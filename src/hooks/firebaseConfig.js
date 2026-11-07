// src/hooks/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1ki1pqoOsFCbyyw3oMvK9Ms9P0D_84UY",
  authDomain: "piper-tracker.firebaseapp.com",
  projectId: "piper-tracker",
  storageBucket: "piper-tracker.firebasestorage.app",
  messagingSenderId: "841531138112",
  appId: "1:841531138112:web:1098abc19412da7d1e7fa5",
  measurementId: "G-MSD53295W4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
