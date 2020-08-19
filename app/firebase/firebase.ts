// @refresh reset

import * as firebase from "firebase";
import "firebase/firestore";
import { firebaseConfig } from "./config";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
