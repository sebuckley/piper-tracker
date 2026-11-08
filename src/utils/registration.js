import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth, connectAuthEmulator, setPersistence, inMemoryPersistence,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, collection, doc, runTransaction } from "firebase/firestore";
import { auth, useFirebaseEmulators } from "../hooks/firebaseConfig";
import { DEFAULT_CURRENCY } from "./currency";

export async function registerLocalFamily({ firstName, lastName, familyName, email, password }) {
  if (!useFirebaseEmulators) {
    throw new Error("Registration is available only with the local Firebase emulators.");
  }
  const app = initializeApp(auth.app.options, `registration-${crypto.randomUUID()}`);
  const registrationAuth = getAuth(app);
  const registrationDb = getFirestore(app);
  connectAuthEmulator(registrationAuth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(registrationDb, "127.0.0.1", 8080);
  try {
    await setPersistence(registrationAuth, inMemoryPersistence);
    let credential;
    try {
      credential = await createUserWithEmailAndPassword(registrationAuth, email, password);
    } catch (error) {
      if (error.code !== "auth/email-already-in-use") throw error;
      try {
        credential = await signInWithEmailAndPassword(registrationAuth, email, password);
      } catch (signInError) {
        if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(signInError.code)) {
          throw new Error("An account already uses this email. Sign in instead.", { cause: signInError });
        }
        throw signInError;
      }
    }

    const user = credential.user;
    const userRef = doc(registrationDb, "users", user.uid);
    const groupRef = doc(collection(registrationDb, "familyGroups"));
    const fullName = `${firstName} ${lastName}`.trim();
    const member = { uid: user.uid, email: user.email, role: "owner", name: fullName, avatarUrl: null };
    const encryptionKey = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    await runTransaction(registrationDb, async transaction => {
      const existing = await transaction.get(userRef);
      if (existing.exists()) throw new Error("This account is already registered. Sign in instead.");
      transaction.set(groupRef, { name: familyName, members: [member], encryptionKey });
      transaction.set(userRef, {
        uid: user.uid, email: user.email, firstName, lastName, name: fullName,
        avatarUrl: "", createdAt: Date.now(), currency: DEFAULT_CURRENCY,
        role: "owner", familyGroupId: groupRef.id
      });
    });
  } finally {
    try {
      await signOut(registrationAuth);
    } finally {
      await deleteApp(app);
    }
  }
}
