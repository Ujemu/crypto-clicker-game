// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Needed for leaderboard and user data

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAza97HJNHVC70YfdOo9nz15_z7c1M3wik",
  authDomain: "coinclickergame.firebaseapp.com",
  projectId: "coinclickergame",
  storageBucket: "coinclickergame.appspot.com",
  messagingSenderId: "746511658244",
  appId: "1:746511658244:web:237c406ccf0627bf5ef451",
  databaseURL: "https://coinclickergame-default-rtdb.firebaseio.com" // VERY IMPORTANT for realtime database
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication and Realtime Database services
export const auth = getAuth(app);
export const database = getDatabase(app);