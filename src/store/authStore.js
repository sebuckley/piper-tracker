import { create } from "zustand";
import { auth } from "../hooks/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  // Prevents init() from running more than once
  _initDone: false,

  // ---------------------------------------------------------
  // LOGIN — ONLY AUTHENTICATES
  // ---------------------------------------------------------
  login: async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // ⭐ ONLY set user here — do NOT load profile in this store
      set({ user: res.user, error: null });
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ---------------------------------------------------------
  // INIT — RUNS ONLY ONCE
  // ---------------------------------------------------------
  init: () => {
    if (get()._initDone) return;

    set({ _initDone: true });

    onAuthStateChanged(auth, (user) => {
      // loading flips to false ONCE
      set({ user, loading: false });
    });
  },

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  }
}));
