// src/store/slices/createDeviceSlice.js

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  runTransaction,
  onSnapshot
} from "firebase/firestore";

import { db } from "../../hooks/firebaseConfig";
import { getDeviceId, getDeviceMetadata } from "../../utils/deviceUtils";

export const createDeviceSlice = (set, get) => ({

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------
  deviceId: null,
  deviceMetadata: null,
  devices: [],

  // ---------------------------------------------------------
  // INIT DEVICE (runs before login)
  // ---------------------------------------------------------
  initDevice: () => {
    const id = getDeviceId();
    const metadata = getDeviceMetadata();

    set({
      deviceId: id,
      deviceMetadata: metadata,
    });
  },

  // ---------------------------------------------------------
  // REFRESH DEVICE RECORD (runs after login)
  // ---------------------------------------------------------
  refreshDeviceRecord: async (uid) => {
    const { deviceId, deviceMetadata } = get();
    const familyGroupId = get().familyGroupId;

    if (!deviceId || !uid || !familyGroupId) return;

    const { deviceName, platform } = deviceMetadata;

    const deviceRef = doc(
      db,
      "familyGroups",
      familyGroupId,
      "devices",
      deviceId
    );

    // Create/update device record inside a transaction
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(deviceRef);

      if (!snap.exists()) {
        tx.set(deviceRef, {
          deviceName,
          platform,
          uid,
          createdAt: Date.now(),
          lastSeen: Date.now(),
          approved: true,
          roleOverride: null,
          isChildDevice: false
        });
      } else {
        tx.update(deviceRef, {
          lastSeen: Date.now()
        });
      }
    });

    // Fetch updated device record
    const deviceSnap = await getDoc(deviceRef);
    const deviceData = deviceSnap.exists() ? deviceSnap.data() : {};

    set({ deviceRoleOverride: deviceData.roleOverride || null, isChildDevice: deviceData.isChildDevice === true });
    set({ effectiveRole: get().computeEffectiveRole() });
    return deviceData.roleOverride || null;
  },

  watchCurrentDevice: () => {
    const { deviceId, familyGroupId } = get();
    if (!deviceId || !familyGroupId) return () => {};
    return onSnapshot(doc(db, "familyGroups", familyGroupId, "devices", deviceId), snap => {
      if (!snap.exists()) {
        set({ isChildDevice: true, deviceRoleOverride: "viewer" });
      } else {
        const data = snap.data();
        set({ isChildDevice: data.isChildDevice === true, deviceRoleOverride: data.roleOverride || null });
      }
      set({ effectiveRole: get().computeEffectiveRole() });
    }, error => {
      console.error("Could not monitor device permissions:", error.code);
      set({ isChildDevice: true, deviceRoleOverride: "viewer" });
      set({ effectiveRole: get().computeEffectiveRole() });
    });
  },

  // ---------------------------------------------------------
  // LOAD ALL DEVICES IN FAMILY GROUP
  // ---------------------------------------------------------
  loadDevicesFromFamilyGroup: async () => {
    const familyGroupId = get().familyGroupId;
    if (!familyGroupId) {
      set({ devices: [] });
      return;
    }

    const ref = collection(db, "familyGroups", familyGroupId, "devices");
    const snap = await getDocs(ref);

    const all = snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    set({ devices: all });
  },

  // ---------------------------------------------------------
  // UPDATE DEVICE RECORD
  // ---------------------------------------------------------
  updateDeviceRecord: async (deviceId, data) => {
    const familyGroupId = get().familyGroupId;
    if (!familyGroupId || !deviceId) return;

    const deviceRef = doc(
      db,
      "familyGroups",
      familyGroupId,
      "devices",
      deviceId
    );

    await updateDoc(deviceRef, data);

    // Update local state
    set({
      devices: get().devices.map(d =>
        d.id === deviceId ? { ...d, ...data } : d
      )
    });

    if (deviceId === get().deviceId) {
      const current = get().devices.find(d => d.id === deviceId);
      set({ deviceRoleOverride: current?.roleOverride || null, isChildDevice: current?.isChildDevice === true });
      set({ effectiveRole: get().computeEffectiveRole() });
    }
  },

  // ---------------------------------------------------------
  // REMOVE DEVICE
  // ---------------------------------------------------------
  removeDeviceRecord: async (deviceId) => {
    const familyGroupId = get().familyGroupId;
    if (!familyGroupId || !deviceId) return;

    const deviceRef = doc(
      db,
      "familyGroups",
      familyGroupId,
      "devices",
      deviceId
    );

    await deleteDoc(deviceRef);

    set({
      devices: get().devices.filter(d => d.id !== deviceId)
    });
  },

});
