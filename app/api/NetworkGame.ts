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

export class NetworkGame {
  public readonly emitter = new EventEmitter();
  private readonly firestoreListeners: Function[] = [];

  constructor(public readonly roomId: string, private readonly player: Player) {
    if (__DEV__) this.checkCodebase();
    this.attachEmitterListeners();
    this.attachFirestoreListeners();
    this.setupPresence();
  }

  private async checkCodebase() {
    //make sure events will be handled properly (you have to attach them on your own)
    setTimeout(() => {
      if (
        this.emitter.listenerCount("roomDestroyed") === 0 &&
        this.emitter.listenerCount("opponentLeft") === 0
      ) {
        throw new Error(
          `You should attach roomDestroyed or opponentLeft listener that navigates to menu`
        );
      }

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

    //configure onDisconnect callback
    await database()
      .ref(`/online/${this.roomId}/${this.player}`)
      .onDisconnect()
      .set(NetworkPlayerStatus.DISCONNECTED);
  }

  private attachEmitterListeners() {
    const delayedOpponentLeft = throttle(() => {
      this.emitter.emit("opponentLeft");
    }, MAX_DISCONNECTED_TIME);

    //opponent has left the game or may has some connection problems
    //if he/she doesn't reconnect before MAX_DISCONNECTED_TIME, room will be destroyed
    this.emitter.on("opponentDisconnected", delayedOpponentLeft);
    this.emitter.on("opponentConnected", () => delayedOpponentLeft.cancel());

    //opponent left the game and can't go back - it's time to destroy the room and leave the game
    this.emitter.on("opponentLeft", this.__destroy);
  }

  private attachFirestoreListeners() {
    //listen for opponent's presence change
    this.firestoreListeners.push(
      database()
        .ref(`/online/${this.roomId}/${getToggledPlayer(this.player)}`)
        //@ts-ignore
        .on("value", (snapshot) => {
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
        })
    );

    //listen for opponent's action
    this.firestoreListeners.push(
      firestore()
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
        })
    );
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
    this.firestoreListeners.forEach((fn) => fn());

    //remove presence object
    await database().ref(`/online/${this.roomId}`).remove();

    //delete actions
    await this.deleteActions();

    //delete room
    await firestore().collection("rooms").doc(this.roomId).delete();

    //it's time to navigate to menu
    this.emitter.emit("roomDestroyed");

    //remove client-side listeners
    this.emitter.removeAllListeners();
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
    this.firestoreListeners.map((fn) => fn());

    //remove client-side listeners
    this.emitter.removeAllListeners();

    //set presence to LEFT
    await database()
      .ref(`/online/${this.roomId}/${this.player}`)
      .set(NetworkPlayerStatus.LEFT);

    //navigate to menu
  }
}
