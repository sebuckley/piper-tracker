// setupFirestore.js

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

// --- 1. FIREBASE INIT -------------------------------------------------------

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 2. CONFIGURE YOUR INITIAL DATA -----------------------------------------

const ownerUid = "nQsLD706NXOIZq2JzLffyk8Cq7E3";          // your Firebase UID
const ownerEmail = "sebuckley@hotmail.com";  // your email
const childId = "4X9oWEkv9cR7u1RFbwBBn";                   // your child ID
const familyGroupId = "family_" + ownerUid;

// --- 3. RUN SETUP -----------------------------------------------------------

async function setup() {
  console.log("Setting up Piper‑Tracker Firestore…");

  // --- USERS/{uid} ----------------------------------------------------------
  await setDoc(doc(db, "users", ownerUid), {
    email: ownerEmail,
    familyGroupId,
    role: "owner",
  });

  console.log("✓ Created user document");

  // --- FAMILY GROUP ---------------------------------------------------------
  await setDoc(doc(db, "familyGroups", familyGroupId), {
    members: [
      {
        uid: ownerUid,
        email: ownerEmail,
        role: "owner",
      },
    ],
    children: [childId],
  });

  console.log("✓ Created family group");

  // --- CHILDREN/{childId} ---------------------------------------------------
  await setDoc(doc(db, "children", childId), {
    name: "Piper Buckley",
    dob: "2021-08-10",
    avatarUrl: null,
    familyGroupId,
  });

  console.log("✓ Created child document");

  // --- DEVICES SUBCOLLECTION (empty, created automatically on login) -------
  console.log("✓ Devices will be created automatically on login");

  // --- INVITES COLLECTION (empty) ------------------------------------------
  console.log("✓ Invites collection ready");

  console.log("🎉 Firestore setup complete");
}

setup().catch(console.error);
