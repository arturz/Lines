import { EventEmitter } from "eventemitter3";
import { throttle } from "lodash";
import { result } from "lodash/fp";
import {
  Player,
  NetworkPlayerStatus,
  MAX_DISCONNECTED_TIME,
} from "../constants";
import { START_GAME } from "../redux";
import checkIfRoomExists from "./checkIfRoomExists";
import { database, firestore } from "../firebase";
import { getToggledPlayer } from "../utils";

export default async (roomId: string, player: Player) => {
  if (!(await checkIfRoomExists(roomId))) return;

  //setup presence
  await database()
    .ref(`/online/${roomId}/${player}`)
    .set(NetworkPlayerStatus.CONNECTED);

  //configure onDisconnect callback
  await database()
    .ref(`/online/${roomId}/${player}`)
    .onDisconnect()
    .set(NetworkPlayerStatus.DISCONNECTED);

  const firebaseListeners = [];
  const emitter = new EventEmitter();

  const delayedOpponentLeft = throttle(() => {
    emitter.emit("opponentLeft");
  }, MAX_DISCONNECTED_TIME);

  //opponent has left the game or may has some connection problems
  //if he/she doesn't reconnect before MAX_DISCONNECTED_TIME, room will be destroyed
  emitter.on("opponentDisconnected", delayedOpponentLeft);
  emitter.on("opponentConnected", () => delayedOpponentLeft.cancel());

  //opponent left the game and can't go back - it's time to destroy the room and leave the game
  emitter.on("opponentLeft", async () => {
    //remove firebase listeners
    firebaseListeners.map(result);

    //remove client-side listeners
    emitter.removeAllListeners();

    //remove presence object
    await database().ref(`/online/${roomId}`).remove();

    //delete actions
    await deleteActions();

    //delete room
    await firestore().collection("rooms").doc(roomId).delete();

    //it's time to navigate to menu
    emitter.emit("roomDestroyed");
  });

  //listen for opponent's presence change
  firebaseListeners.push(
    database()
      .ref(`/online/${roomId}/${getToggledPlayer(player)}`)
      .on("value", (snapshot) => {
        console.log(
          `on('value') snapshot = ${snapshot ? snapshot.val() : snapshot}`
        );

        // object has been destroyed (?)
        if (snapshot === undefined) return;

        // parent object has been destroyed (?)
        if (snapshot === null) return;

        if (snapshot.val() === NetworkPlayerStatus.CONNECTED) {
          emitter.emit("opponentConnected");
        } else if (snapshot.val() === NetworkPlayerStatus.DISCONNECTED) {
          emitter.emit("opponentDisconnected");
        } else if (snapshot.val() === NetworkPlayerStatus.LEFT) {
          emitter.emit("opponentLeft");
        }
      })
  );

  async function deleteActions() {
    const snapshot = await firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("actions")
      .get();

    await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
  }

  async function action({ type, payload }: { type: string; payload: any }) {
    if (type === START_GAME) await deleteActions();
    await firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("actions")
      .add({
        by: player,
        type,
        payload,
      });
  }

  //listen for opponent's action
  firebaseListeners.push(
    firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("actions")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data()?.by === getToggledPlayer(player)
          ) {
            emitter.emit("opponentsAction", change.doc.data());
          }
        });
      })
  );

  //set presence to LEFT and leave the game, opponent will destroy the room
  async function leave() {
    //remove firebase listeners
    firebaseListeners.map(result);

    //remove client-side listeners
    emitter.removeAllListeners();

    //set presence to LEFT
    await database()
      .ref(`/online/${roomId}/${player}`)
      .set(NetworkPlayerStatus.LEFT);

    //navigate to menu
  }

  //make sure events will be handled properly (you have to attach them on your own)
  setTimeout(() => {
    if (emitter.listenerCount("roomDestroyed") === 0) {
      throw new Error(
        `You should attach roomDestroyed listener that navigates to menu`
      );
    }

    if (emitter.listenerCount("opponentsAction") === 0) {
      throw new Error(
        `You should attach opponentsAction listener that dispatches action to store`
      );
    }
  }, 0);

  return {
    emitter,
    action,
    leave,
  };
};
