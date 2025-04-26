import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // add this for leaderboard

const firebaseConfig = {
  apiKey: "AIzaSyAza97HJNHVC70YfdOo9nz15_z7c1M3wik",
  authDomain: "coinclickergame.firebaseapp.com",
  projectId: "coinclickergame",
  storageBucket: "coinclickergame.appspot.com",
  messagingSenderId: "746511658244",
  appId: "1:746511658244:web:237c406ccf0627bf5ef451",
  databaseURL: "https://coinclickergame-default-rtdb.firebaseio.com" // VERY IMPORTANT
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Database
export const auth = getAuth(app);
export const database = getDatabase(app);