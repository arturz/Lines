import { firestore } from "../firebase";

export default async () => {
  const room = await firestore().collection("rooms").add({
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  const { id } = room;

  return id;
};
