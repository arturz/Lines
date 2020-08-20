import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import database from "@react-native-firebase/database";
import { firebaseConfig } from "./config";

//don't create next instance of app on refresh during development
if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);

export async function createRoom() {
  //firestore
  const docRef = await firestore().collection("rooms").add({
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  docRef.collection("actions");
  const { id } = docRef;

  //realtime database for presence
  const rtRef = database().ref(`/online/${id}/host`);
  await Promise.all([
    rtRef.set(true),
    rtRef.onDisconnect().set(false), //configure onDisconnect callback
  ]);

  return id;
}

export async function joinRoom(id: string) {
  //realtime database for presence
  const rtRef = database().ref(`/online/${id}/guest`);
  await Promise.all([
    rtRef.set(true),
    rtRef.onDisconnect().set(false), //configure onDisconnect callback
  ]);
}

export async function clearActions(id: string) {
  const querySnapshot = await firestore()
    .collection("rooms")
    .doc(id)
    .collection("actions")
    .get();

  await Promise.all(querySnapshot.docs.map((doc) => doc.ref.delete()));
}

export async function deleteRoom(id: string) {
  //firestore
  await clearActions(id);
  await firestore().collection("rooms").doc(id).delete();

  //realtime database for presence
  await database().ref(`/online/${id}`).remove();
}

export function addActionListener(id: string) {
  const removeActionListener = firestore()
    .collection("rooms")
    .doc(id)
    .collection("actions")
    .onSnapshot(() => {});

  return removeActionListener;
}
