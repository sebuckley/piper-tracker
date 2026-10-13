import { nanoid } from "nanoid";

// ---------------------------------------------------------
// PROFILE + CHILDREN SLICE — FULLY NORMALIZED + PERSIST-SAFE
// ---------------------------------------------------------
export const createProfileSlice = (set, get) => ({
  // ⭐ Guaranteed profile shape
  profile: {
    uid: null,
    email: "",
    fullName: "",
    country: "",
    preferredSport: "",
    avatarUrl: "",
    createdAt: null
  },

  // ⭐ Normalize profile object
  _normalizeProfile(profile) {
    return {
      uid: profile.uid ?? null,
      email: profile.email ?? "",
      fullName: profile.fullName ?? "",
      country: profile.country ?? "",
      preferredSport: profile.preferredSport ?? "",
      avatarUrl: profile.avatarUrl ?? "",
      createdAt: profile.createdAt ?? null
    };
  },

  // ⭐ Normalize child object
  _normalizeChild(child) {
    return {
      id: child.id ?? nanoid(),
      fullName: child.fullName ?? "",
      preferredName: child.preferredName ?? "",
      gender: child.gender ?? "",
      dob: child.dob ?? "",
      age: Number(child.age ?? 0),
      avatarUrl: child.avatarUrl ?? null,
      preferredSport: child.preferredSport ?? ""
    };
  },

  // ⭐ Set profile safely
  setProfile: (updates) => {
    const uid = get().profile.uid;

    set(state => ({
      ...state,
      profile: get()._normalizeProfile({ ...state.profile, ...updates })
    }));

    if (uid) get().saveUserToKV(uid);
  },

  // ⭐ Upload avatar safely
  uploadAvatar: async (uid, file) => {
    if (!uid) return;

    const storage = getStorage();
    const avatarRef = ref(storage, `avatars/${uid}.jpg`);
    await uploadBytes(avatarRef, file);
    const url = await getDownloadURL(avatarRef);

    set(state => ({
      ...state,
      profile: { ...state.profile, avatarUrl: url }
    }));

    get().saveUserToKV(uid);
  },

  // ⭐ Children slice
  children: [],
  activeChild: null,

  // ⭐ Set active child safely
  setActiveChild: (childId) => {
    const uid = get().profile.uid;

    set(state => ({
      ...state,
      activeChild: childId
    }));

    if (uid) get().saveUserToKV(uid);
  },

  // ⭐ Add child safely
  addChild: (child) => {
    const uid = get().profile.uid;
    if (!uid) return;

    const normalized = get()._normalizeChild(child);

    set(state => {
      const updatedChildren = [...state.children, normalized];

      return {
        ...state,
        children: updatedChildren,
        activeChild: state.activeChild ?? normalized.id
      };
    });

    get().saveUserToKV(uid);
  },

  // ⭐ Update child safely
  updateChild: (childId, updates) => {
    const uid = get().profile.uid;
    if (!uid) return;

    set(state => ({
      ...state,
      children: state.children.map(c =>
        c.id === childId
          ? get()._normalizeChild({ ...c, ...updates })
          : c
      )
    }));

    get().saveUserToKV(uid);
  },

  // ⭐ Delete child safely
  deleteChild: (childId) => {
    const uid = get().profile.uid;
    if (!uid) return;

    set(state => {
      const remaining = state.children.filter(c => c.id !== childId);

      return {
        ...state,
        children: remaining,
        activeChild: state.activeChild === childId
          ? remaining[0]?.id ?? null
          : state.activeChild
      };
    });

    get().saveUserToKV(uid);
  },

  // ⭐ Upload child avatar safely
  uploadChildAvatar: async (uid, childId, file) => {
    if (!uid || !childId) return;

    const storage = getStorage();
    const avatarRef = ref(storage, `children/${uid}/${childId}.jpg`);
    await uploadBytes(avatarRef, file);
    const url = await getDownloadURL(avatarRef);

    set(state => ({
      ...state,
      children: state.children.map(c =>
        c.id === childId ? { ...c, avatarUrl: url } : c
      )
    }));

    get().saveUserToKV(uid);
  }
});
