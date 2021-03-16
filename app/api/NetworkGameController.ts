import { EventEmitter } from "eventemitter3";
import { Player } from "../constants";
import { INITIALIZE_AND_START_GAME, INITIALIZE_GAME } from "../redux";
import checkIfRoomExists from "./checkIfRoomExists";
import { auth, firestore } from "../firebase";
import { getToggledPlayer } from "../utils";
import {
  NetworkPresenceController,
  LogEvents as PresenceLogEvents,
} from "./NetworkPresenceController";
import createRoom from "./createRoom";

type Events = "roomRemoved" | "action" | "opponentInitialConnect" | "log";
type LogEvents =
  | "roomRemoved"
  | "authStateChanged: logged in"
  | "authStateChanged: logged out";

export class NetworkGameController {
  private readonly emitter = new EventEmitter<Events>();
  private presenceController: NetworkPresenceController | null = null;
  private roomId: string | null = null;
  private authorized: boolean = false;

  constructor(public readonly player: Player) {}

  private checkAuth() {
    if (!this.authorized) throw new Error(`You aren't authorized to do that!`);

    return true;
  }

  private checkAuthAndRoom() {
    if (this.checkAuth()) {
      if (this.roomId === null) throw new Error(`Room id was not yet defined!`);

      return true;
    }
  }

  auth() {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth().onAuthStateChanged((user) => {
        if (user) {
          this.log("authStateChanged: logged in");
          this.authorized = true;
          resolve();
          unsubscribe();
        } else {
          this.log("authStateChanged: logged out");
          this.authorized = false;
        }
      });

      auth().signInAnonymously();
    });
  }

  async createRoom() {
    if (this.checkAuth()) {
      const roomId = await createRoom();
      this.roomId = roomId;
      this.init();
      return roomId;
    }
  }

  async joinRoom(roomId: string) {
    if (this.checkAuth()) {
      const roomExists = await checkIfRoomExists(roomId);
      if (!roomExists) {
        this.emit("roomRemoved");
        return;
      }

      this.roomId = roomId;
      this.init();
    }
  }

  private async init() {
    if (this.checkAuthAndRoom()) {
      this.presenceController = new NetworkPresenceController(
        this.roomId as string,
        this.player
      );
      this.presenceController
        .onOpponentInitialConnect(() => {
          this.emit("opponentInitialConnect");
        })
        .onForceRemoveRoom(() => {
          this.removeRoom();
        })
        .onRoomRemoved(() => {
          this.emit("roomRemoved");
        })
        .onLog((log) => {
          this.emit("log", log);
        });

      firestore()
        .collection("rooms")
        .doc(this.roomId as string)
        .collection("actions")
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (
              change.type === "added" &&
              change.doc.data()?.by === getToggledPlayer(this.player)
            ) {
              this.emit("action", change.doc.data());
            }
          });
        });
    }
  }

  private async deleteActions() {
    if (this.checkAuthAndRoom()) {
      const snapshot = await firestore()
        .collection("rooms")
        .doc(this.roomId as string)
        .collection("actions")
        .get();

      await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
    }
  }

  async addAction({ type, payload }: { type: string; payload?: any }) {
    if (this.checkAuthAndRoom()) {
      if (type === INITIALIZE_GAME || type === INITIALIZE_AND_START_GAME)
        await this.deleteActions();

      await firestore()
        .collection("rooms")
        .doc(this.roomId as string)
        .collection("actions")
        .add({
          by: this.player,
          type,
          payload,
        });
    }
  }

  async removeRoom() {
    if (this.checkAuthAndRoom() && this.presenceController !== null) {
      await this.presenceController.removePresence();

      //delete actions
      await this.deleteActions();

      //delete room
      await firestore()
        .collection("rooms")
        .doc(this.roomId as string)
        .delete();

      this.log("roomRemoved");
      this.emit("roomRemoved");
    }
  }

  private emit(event: Events, value?: any) {
    this.emitter.emit(event, value);
  }

  private log(event: LogEvents) {
    console.log(`Player ${this.player}'s ${event}`);
    this.emitter.emit("log", event);
  }

  onRoomRemoved(listener: () => void) {
    this.emitter.on("roomRemoved", listener);
    return this;
  }
  onAction(
    listener: ({ type, payload }: { type: string; payload?: any }) => void
  ) {
    this.emitter.on("action", listener);
    return this;
  }
  onOpponentInitialConnect(listener: () => void) {
    this.emitter.on("opponentInitialConnect", listener);
    return this;
  }
  onLog(listener: (log: LogEvents | PresenceLogEvents) => void) {
    this.emitter.on("log", listener);
    return this;
  }
}
