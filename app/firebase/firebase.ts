import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import database from "@react-native-firebase/database";
import auth from '@react-native-firebase/auth';
import { firebaseConfig } from "./config";

//don't create next instance of app on refresh during development
if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);

export { firestore, database, auth };