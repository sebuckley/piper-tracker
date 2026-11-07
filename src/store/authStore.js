import { create } from "zustand";
import { auth } from "../hooks/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../hooks/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { nanoid } from "nanoid";

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  familyGroup: [],
  role: null,
  deviceId: nanoid(),
  activeChild: null,
  loading: true,
  error: null,
  _initDone: false,
  offline: true,

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  login: async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
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

    onAuthStateChanged(auth, async (user) => {
      set({ user, loading: false });

      if (user) {
        await get().loadUserProfile(user.uid);
        await get().loadFamilyGroup(user.uid);
      }
    });
  },

  // ---------------------------------------------------------
  // LOAD USER PROFILE
  // ---------------------------------------------------------
  loadUserProfile: async (uid) => {
    
    const app = get().appStore || null;
    if (!app) return;

    const profile = await app.loadUserFromKV(uid);
    set({ profile });
  },

  // ---------------------------------------------------------
  // LOAD FAMILY GROUP (ENRICHED)
  // ---------------------------------------------------------
  loadFamilyGroup: async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        set({ familyGroup: [], role: "viewer" });
        return;
      }

      const userData = userSnap.data();
      const familyGroupId = userData.familyGroupId;

      if (!familyGroupId) {
        set({ familyGroup: [], role: "owner" });
        return;
      }

      const groupRef = doc(db, "familyGroups", familyGroupId);
      const groupSnap = await getDoc(groupRef);

      if (!groupSnap.exists()) {
        set({ familyGroup: [], role: "owner" });
        return;
      }

      const groupData = groupSnap.data();
      const members = groupData.members || [];

      const enrichedMembers = [];
      for (const m of members) {
        const memberRef = doc(db, "users", m.uid);
        const memberSnap = await getDoc(memberRef);
        const profile = memberSnap.exists() ? memberSnap.data() : {};

        enrichedMembers.push({
          uid: m.uid,
          email: m.email || profile.email || "",
          role: m.role || "viewer",
          name: profile.name || profile.preferredName || m.email.split("@")[0],
          avatarUrl: profile.avatarUrl || null
        });
      }

      const myMember = enrichedMembers.find(m => m.uid === uid);
      const myRole = myMember?.role || "viewer";

      set({
        familyGroup: enrichedMembers,
        role: myRole
      });

    } catch (err) {
      console.error("loadFamilyGroup ERROR:", err);
      set({ familyGroup: [], role: "viewer" });
    }
  },

  // ---------------------------------------------------------
  // SET ACTIVE CHILD
  // ---------------------------------------------------------
  setActiveChild: (childId) => {
    set({ activeChild: childId });
  },

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  logout: async () => {
    await signOut(auth);

    set({
      user: null,
      profile: null,
      familyGroup: [],
      role: null,
      activeChild: null
    });
  }
}));
