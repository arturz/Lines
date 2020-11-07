import { firestore } from "../firebase";

export default async function (roomId: string) {
  const snapshot = await firestore()
    .collection("rooms")
    .doc(roomId)
    .collection("actions")
    .get();

  await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
}
