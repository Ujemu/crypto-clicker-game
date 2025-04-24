import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAza97HJNHVC70YfdOo9nz15_z7c1M3wik",
  authDomain: "coinclickergame.firebaseapp.com",
  projectId: "coinclickergame",
  storageBucket: "coinclickergame.firebasestorage.app",
  messagingSenderId: "746511658244",
  appId: "1:746511658244:web:237c406ccf0627bf5ef451"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);