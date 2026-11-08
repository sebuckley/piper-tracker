// src/hooks/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1ki1pqoOsFCbyyw3oMvK9Ms9P0D_84UY",
  authDomain: "piper-tracker.firebaseapp.com",
  projectId: "piper-tracker",
  storageBucket: "piper-tracker.firebasestorage.app",
  messagingSenderId: "841531138112",
  appId: "1:841531138112:web:1098abc19412da7d1e7fa5",
  measurementId: "G-MSD53295W4"
};

export const useFirebaseEmulators = import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATORS === "true";
const app = initializeApp(useFirebaseEmulators
  ? { ...firebaseConfig, projectId: "demo-piper-tracker", authDomain: "demo-piper-tracker.firebaseapp.com" }
  : firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

if (useFirebaseEmulators) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  console.info("[Firebase] Using local Auth and Firestore emulators (test data only).");
}
