// src/store/slices/createAuthSlice.js

import { auth } from "../../hooks/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail
} from "firebase/auth";

export const createAuthSlice = (set, get) => ({

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------
  user: null,
  authLoading: true,
  authError: null,

  // ---------------------------------------------------------
  // INIT AUTH LISTENER
  // ---------------------------------------------------------
  initAuth: () => {
    console.info("[Login] Firebase authentication listener started");
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        console.info("[Login] Firebase authentication resolved: no signed-in user");
        set({ user: null, authLoading: false });
        return;
      }

      console.info("[Login] Firebase authentication resolved: signed in");
      set({ user: firebaseUser, authLoading: false });
    }, (error) => {
      const code = typeof error.code === "string" && /^[\w/-]+$/.test(error.code)
        ? error.code
        : "unknown";
      console.error(`[Login] Firebase authentication listener failed (code: ${code})`);
      set({ authLoading: false, authError: "Unable to initialize authentication. Check the console for details." });
    });
  },

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  login: async (email, password) => {
    console.info("[Login] Firebase sign-in started");
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.info("[Login] Firebase sign-in completed");
      set({ user: res.user, authError: null });
    } catch (err) {
      const code = typeof err.code === "string" && /^[\w/-]+$/.test(err.code)
        ? err.code
        : "unknown";
      console.error(`[Login] Firebase sign-in failed (code: ${code})`);
      set({ authError: err.message });
    }
  },

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  // ---------------------------------------------------------
  // UPDATE EMAIL
  // ---------------------------------------------------------
  updateUserEmail: async (newEmail) => {
    const user = get().user;
    if (!user) return;

    try {
      await updateEmail(user, newEmail);
      set({ user: { ...user, email: newEmail } });
    } catch (err) {
      set({ authError: err.message });
    }
  },

  // ---------------------------------------------------------
  // RESET PASSWORD
  // ---------------------------------------------------------
  sendPasswordResetEmail: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      set({ authError: err.message });
    }
  }

});
