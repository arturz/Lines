import { firebase } from "@react-native-firebase/firestore";
import { EventEmitter } from "eventemitter3";
import { throttle } from "lodash";
import { Player } from "../constants";
import { database } from "../firebase";
import { getToggledPlayer } from "../utils";
import checkIfPresenceExists from "./checkIfPresenceExists";
import { Snapshot } from "./types";

enum Presence {
  CONNECTED = "C",
  DISCONNECTED = "D",
}

//used for controlling game
type Events = "forceRemoveRoom" | "roomRemoved" | "opponentInitialConnect";

//used ONLY for logging and showing notification
export type LogEvents =
  | Events
  | "initialConnect"
  | "reconnect"
  | "disconnect"
  | "opponentInitialConnect"
  | "opponentReconnect"
  | "opponentDisconnect";

export class NetworkPresenceController {
  private readonly emitter = new EventEmitter<Events | "log">();

  constructor(
    private readonly roomId: string,
    private readonly player: Player
  ) {
    this.init();
  }

  private async init() {
    /*
      When receives value for the first time snapshot.val() is false, then true (connected for the first time)
    */
    enum ConnectionStateHelper {
      BEFORE_INITIAL_CONNECTION,
      AFTER_INITIAL_CONNECTION,
    }
    let connectionStateHelper = ConnectionStateHelper.BEFORE_INITIAL_CONNECTION;

    database()
      .ref(".info/connected")
      .on("value", (snapshot: Snapshot) => {
        const connected = snapshot.val();

        if (connected) {
          if (
            connectionStateHelper ===
            ConnectionStateHelper.BEFORE_INITIAL_CONNECTION
          ) {
            this.handleInitialConnect();
            connectionStateHelper =
              ConnectionStateHelper.AFTER_INITIAL_CONNECTION;
          } else {
            this.handleReconnect();
          }
        } else {
          if (
            connectionStateHelper ===
            ConnectionStateHelper.AFTER_INITIAL_CONNECTION
          )
            this.handleDisconnect();
        }
      });
  }

  private async handleInitialConnect() {
    this.log("initialConnect");

    this.setupPresence();

    const throttleForceRemoveRoom = throttle(
      () => {
        this.log("forceRemoveRoom");
        this.emit("forceRemoveRoom");
      },
      5000,
      { leading: false }
    );

    let wasOpponentDisconnected = false;

    database()
      .ref(`/online/${this.roomId}/${getToggledPlayer(this.player)}`)
      .on("value", (snapshot: Snapshot) => {
        switch (snapshot.val()) {
          case null:
            //returns null when object is deleted OR doesn't exist yet
            break;

          case Presence.CONNECTED:
            if (wasOpponentDisconnected) {
              this.log("opponentReconnect");

              //opponent reconnect
              throttleForceRemoveRoom.cancel();
              wasOpponentDisconnected = false;
            } else {
              this.log("opponentInitialConnect");

              //opponent connects for the first time
              this.emit("opponentInitialConnect");
            }
            break;

          case Presence.DISCONNECTED:
            this.log("opponentDisconnect");
            wasOpponentDisconnected = true;
            throttleForceRemoveRoom();
            break;

          default:
            console.log(`Unknown opponent presence value`, snapshot.val());
        }
      });
  }

  private async handleReconnect() {
    this.log("reconnect");

    //make sure that room still exists
    if (await checkIfPresenceExists(this.roomId)) {
      this.setupPresence();
    } else {
      this.log("roomRemoved");
      this.emit("roomRemoved");
    }
  }

  //client-side handler
  private async handleDisconnect() {
    this.log("disconnect");
  }

  private async setupPresence() {
    if (!(await checkIfPresenceExists(this.roomId))) {
      await database()
        .ref(`/online/${this.roomId}/createdAt`)
        .set(firebase.database.ServerValue.TIMESTAMP);
    }

    database()
      .ref(`/online/${this.roomId}`)
      .on("value", (snapshot: Snapshot) => {
        if (snapshot.val() === null) {
          this.log("roomRemoved");
          this.emit("roomRemoved");
        }
      });

    await database()
      .ref(`/online/${this.roomId}/${this.player}`)
      .set(Presence.CONNECTED);

    database()
      .ref(`/online/${this.roomId}/${this.player}`)
      .onDisconnect()
      .set(Presence.DISCONNECTED);
  }

  private emit(event: Events) {
    this.emitter.emit(event);
  }

  private log(event: LogEvents) {
    console.log(`Player ${this.player}'s ${event}`);
    this.emitter.emit("log", event);
  }

  async removePresence() {
    //off all listeners
    database()
      .ref(`/online/${this.roomId}/${this.player}`)
      .onDisconnect()
      .cancel();
    database().ref(".info/connected").off();
    database().ref(`/online/${this.roomId}`).off();
    database()
      .ref(`/online/${this.roomId}/${getToggledPlayer(this.player)}`)
      .off();

    //remove presence
    await database().ref(`/online/${this.roomId}`).remove();
  }

  onRoomRemoved(listener: () => void) {
    this.emitter.on("roomRemoved", listener);
    return this;
  }
  onForceRemoveRoom(listener: () => void) {
    this.emitter.on("forceRemoveRoom", listener);
    return this;
  }
  onOpponentInitialConnect(listener: () => void) {
    this.emitter.on("opponentInitialConnect", listener);
    return this;
  }
  onLog(listener: (type: LogEvents) => void) {
    this.emitter.on("log", listener);
    return this;
  }
}
