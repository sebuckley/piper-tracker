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
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null, authLoading: false });
        return;
      }

      set({ user: firebaseUser, authLoading: false });
    });
  },

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  login: async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      set({ user: res.user, authError: null });
    } catch (err) {
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
