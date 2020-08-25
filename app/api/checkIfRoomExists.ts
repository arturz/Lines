import { firestore } from "../firebase";

export default (roomId: string) => {
  return new Promise<boolean>(async (resolve) => {
    const snapshot = await firestore().collection("rooms").doc(roomId).get();
    resolve(snapshot.exists);
  });
};
