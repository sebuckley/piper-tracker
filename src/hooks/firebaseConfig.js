// src/hooks/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHZxn07Z8dcgDE7WQ-EPSjfG-5HufCcRs",
  authDomain: "travel-app-planner-sb.firebaseapp.com",
  projectId: "travel-app-planner-sb",
  storageBucket: "travel-app-planner-sb.appspot.com",
  messagingSenderId: "10168990956",
  appId: "1:10168990956:web:2381274b331b74502879c9",
  measurementId: "G-Q3FEN5P7S9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
