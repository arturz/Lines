import { EventEmitter } from "eventemitter3";
import { throttle } from "lodash";
import {
  Player,
  NetworkPlayerStatus,
  MAX_DISCONNECTED_TIME,
} from "../constants";
import { INITIALIZE_AND_START_GAME, INITIALIZE_GAME } from "../redux";
import checkIfRoomExists from "./checkIfRoomExists";
import { database, firestore } from "../firebase";
import { getToggledPlayer } from "../utils";

type Listener = {
  removeListener: Function;
  type?: string;
};

type Snapshot = {
  val: () => any;
};

type EventNames =
  | "connected"
  | "disconnected"
  | "left"
  | "opponentConnected"
  | "opponentDisconnected"
  | "opponentLeft"
  | "opponentsAction";

export class NetworkGame {
  public readonly emitter = new EventEmitter<EventNames>();
  private readonly listeners: Listener[] = [];

  constructor(public readonly roomId: string, private readonly player: Player) {
    if (__DEV__) this.checkCodebase();
    this.attachEmitterListeners();
    this.attachFirestoreListeners();
    this.setupPresence();
  }

  private async checkCodebase() {
    //make sure events will be handled properly (you have to attach them on your own)
    setTimeout(() => {
      const navigationEvents: EventNames[] = ["opponentLeft", "left"];
      navigationEvents
        .filter((name) => this.emitter.listenerCount(name) === 0)
        .forEach((name) => {
          throw new Error(
            `You should attach ${name} listener that navigates to menu`
          );
        });

      if (this.emitter.listenerCount("opponentsAction") === 0) {
        throw new Error(
          `You should attach opponentsAction listener that dispatches action to store`
        );
      }
    }, 0);

    const roomExists = await checkIfRoomExists(this.roomId);
    if (!roomExists)
      throw new Error(
        `NetworkGame: room with id ${this.roomId} doesn't exists! It has to be checked before creating new NetworkGame instance.`
      );
  }

  private async setupPresence() {
    //setup presence
    await database()
      .ref(`/online/${this.roomId}/${this.player}`)
      .set(NetworkPlayerStatus.CONNECTED);

    //onDisconnect listener is removed every disconnection
    database()
      .ref(".info/connected")
      .on("value", (snapshot: Snapshot) => {
        if (snapshot.val() === true) {
          const onDisconnectRef = database()
            .ref(`/online/${this.roomId}/${this.player}`)
            .onDisconnect();

          onDisconnectRef.set(NetworkPlayerStatus.DISCONNECTED);

          this.listeners.push({
            removeListener: () => onDisconnectRef.cancel(),
            type: "ON_DISCONNECT",
          });

          this.emitter.emit("connected");
        } else {
          this.emitter.emit("disconnected");
        }
      });

    this.listeners.push({
      removeListener: () => database().ref(".info/connected").off("value"),
    });
  }

  private attachEmitterListeners() {
    const throttledOpponentLeft = throttle(
      () => void this.emitter.emit("opponentLeft"),
      MAX_DISCONNECTED_TIME,
      { leading: false }
    );

    const throttledLeft = throttle(
      () => void this.emitter.emit("left"),
      MAX_DISCONNECTED_TIME,
      { leading: false }
    );

    //opponent has left the game or may has some connection problems
    //if he/she doesn't reconnect before MAX_DISCONNECTED_TIME, room will be destroyed
    this.emitter.on("opponentDisconnected", throttledOpponentLeft);
    this.emitter.on("opponentConnected", () => throttledOpponentLeft.cancel());
    //opponent left the game and can't go back - it's time to destroy the room and leave the game
    this.emitter.on("opponentLeft", this.__destroy);

    this.emitter.on("disconnected", throttledLeft);
    this.emitter.on("connected", () => throttledLeft.cancel());
    this.emitter.on("left", this.leave);
  }

  private attachFirestoreListeners() {
    //listen for opponent's presence change
    database()
      .ref(`/online/${this.roomId}/${getToggledPlayer(this.player)}`)
      .on("value", (snapshot: Snapshot) => {
        console.log(
          `on('value') snapshot = ${snapshot ? snapshot.val() : snapshot}`
        );

        // object has been destroyed (?)
        if (snapshot === undefined) return;

        // parent object has been destroyed (?)
        if (snapshot === null) return;

        if (snapshot.val() === NetworkPlayerStatus.CONNECTED) {
          this.emitter.emit("opponentConnected");
        } else if (snapshot.val() === NetworkPlayerStatus.DISCONNECTED) {
          this.emitter.emit("opponentDisconnected");
        } else if (snapshot.val() === NetworkPlayerStatus.LEFT) {
          this.emitter.emit("opponentLeft");
        }
      });

    this.listeners.push({
      removeListener: () =>
        database()
          .ref(`/online/${this.roomId}/${getToggledPlayer(this.player)}`)
          .off("value"),
    });

    //listen for opponent's action
    this.listeners.push({
      removeListener: firestore()
        .collection("rooms")
        .doc(this.roomId)
        .collection("actions")
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (
              change.type === "added" &&
              change.doc.data()?.by === getToggledPlayer(this.player)
            ) {
              this.emitter.emit("opponentsAction", change.doc.data());
            }
          });
        }),
    });
  }

  private async deleteActions() {
    const snapshot = await firestore()
      .collection("rooms")
      .doc(this.roomId)
      .collection("actions")
      .get();

    await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
  }

  async __destroy() {
    //remove firebase listeners
    this.listeners.forEach(({ removeListener }) => removeListener());

    //remove client-side listeners
    this.emitter.removeAllListeners();

    //remove presence object
    await database().ref(`/online/${this.roomId}`).remove();

    //delete actions
    await this.deleteActions();

    //delete room
    await firestore().collection("rooms").doc(this.roomId).delete();
  }

  async action({ type, payload }: { type: string; payload?: any }) {
    if (type === INITIALIZE_GAME || type === INITIALIZE_AND_START_GAME)
      await this.deleteActions();

    await firestore()
      .collection("rooms")
      .doc(this.roomId)
      .collection("actions")
      .add({
        by: this.player,
        type,
        payload,
      });
  }

  //set presence to LEFT and leave the game, opponent will destroy the room
  async leave() {
    //remove firebase listeners
    this.listeners.forEach(({ removeListener }) => removeListener());

    //remove client-side listeners
    this.emitter.removeAllListeners();

    //set presence to LEFT
    await database()
      .ref(`/online/${this.roomId}/${this.player}`)
      .set(NetworkPlayerStatus.LEFT);

    //navigate to menu
  }
}
