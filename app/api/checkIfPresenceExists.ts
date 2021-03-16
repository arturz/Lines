import { database } from "../firebase";
import { Snapshot } from "./types";

export default (roomId: string) => {
  return new Promise<boolean>(async (resolve) => {
    database()
      .ref(`/online/${roomId}`)
      .once("value", async (snapshot: Snapshot) => {
        const exists = Boolean(snapshot.val());
        resolve(exists);
      });
  });
};
