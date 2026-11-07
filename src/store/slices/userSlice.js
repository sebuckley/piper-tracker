// src/store/slices/createUserSlice.js

import { nanoid } from "nanoid";
import { db } from "../../hooks/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { DEFAULT_CURRENCY } from "../../utils/currency";
import { getEffectiveRole } from "../../utils/devicePermissions";

export const createUserSlice = (set, get) => ({

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------
  userProfile: {
    uid: null,
    email: "",
    firstName: "",
    lastName: "",
    avatarUrl: "",
    createdAt: null,
    currency: DEFAULT_CURRENCY
  },

  userRole: null,             // owner | editor | viewer
  deviceRoleOverride: null,   // viewer | editor | null
  isChildDevice: false,
  effectiveRole: null,        // computed

  // ---------------------------------------------------------
  // NORMALIZERS
  // ---------------------------------------------------------
  _normalizeProfile(profile) {
    return {
      uid: profile.uid ?? null,
      email: profile.email ?? "",
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      avatarUrl: profile.avatarUrl ?? "",
      createdAt: profile.createdAt ?? null,
      currency: profile.currency || DEFAULT_CURRENCY
    };
  },

  // ---------------------------------------------------------
  // INTERNAL: compute effective role
  // ---------------------------------------------------------
  computeEffectiveRole: () => {
    const { userRole, deviceRoleOverride, isChildDevice } = get();
    return getEffectiveRole(userRole, deviceRoleOverride, isChildDevice);
  },

  // ---------------------------------------------------------
  // LOAD USER IDENTITY (profile + role)
  // ---------------------------------------------------------
  loadUserIdentity: async (uid) => {
    if (!uid) return;

    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const data = snap.data();

    const userProfile = {
      uid,
      email: data.email || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      avatarUrl: data.avatarUrl || "",
      createdAt: data.createdAt || null,
      currency: data.currency || DEFAULT_CURRENCY
    };

    const userRole = data.role || "owner";

    set({ userProfile, userRole });
    set({ effectiveRole: get().computeEffectiveRole() });

    // ❌ Removed: loadActiveChildOnLogin()
    // ChildrenSlice owns child loading, App.jsx orchestrates it.
  },

  // ---------------------------------------------------------
  // UPDATE PROFILE (Firestore only)
  // ---------------------------------------------------------
  setUserProfile: async (updates) => {
    const uid = get().userProfile.uid;
    if (!uid) return;

    const updated = get()._normalizeProfile({
      ...get().userProfile,
      ...updates
    });

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updated);

    set({ userProfile: updated });
  },

  // ---------------------------------------------------------
  // UPLOAD AVATAR
  // ---------------------------------------------------------
  uploadAvatar: async (uid, file) => {
    if (!uid) return;

    const storage = getStorage();
    const avatarRef = ref(storage, `avatars/${uid}.jpg`);
    await uploadBytes(avatarRef, file);
    const url = await getDownloadURL(avatarRef);

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { avatarUrl: url });

    set(state => ({
      userProfile: { ...state.userProfile, avatarUrl: url }
    }));
  },

  // ---------------------------------------------------------
  // USER ROLE (owner/editor/viewer)
  // ---------------------------------------------------------
  setUserRole: async (uid, newRole) => {
    if (!uid) return;

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { role: newRole });

    set({ userRole: newRole });
    set({ effectiveRole: get().computeEffectiveRole() });
  },

  // ---------------------------------------------------------
  // DEVICE ROLE OVERRIDE (viewer/editor/null)
  // ---------------------------------------------------------
  loadDeviceRoleOverride: async (deviceId) => {
    const familyGroupId = get().familyGroupId;
    if (!familyGroupId || !deviceId) return;

    const deviceRef = doc(
      db,
      "familyGroups",
      familyGroupId,
      "devices",
      deviceId
    );

    const snap = await getDoc(deviceRef);
    const data = snap.exists() ? snap.data() : {};

    const deviceRoleOverride =
      data.roleOverride === undefined ? null : data.roleOverride;

    set({ deviceRoleOverride, isChildDevice: data.isChildDevice === true });
    set({ effectiveRole: get().computeEffectiveRole() });
  },

  setDeviceRoleOverride: async (deviceId, newRole) => {
    const familyGroupId = get().familyGroupId;
    if (!familyGroupId || !deviceId) return;

    const deviceRef = doc(
      db,
      "familyGroups",
      familyGroupId,
      "devices",
      deviceId
    );

    await updateDoc(deviceRef, { roleOverride: newRole });

    if (deviceId === get().deviceId) {
      set({ deviceRoleOverride: newRole });
      set({ effectiveRole: get().computeEffectiveRole() });
    }
  },

});
