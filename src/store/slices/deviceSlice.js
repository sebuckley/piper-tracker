// src/store/slices/createDeviceSlice.js

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  runTransaction
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

    // Return roleOverride so userSlice can compute effectiveRole
    return deviceData.roleOverride || null;
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

    // If this is the current device, return override so userSlice can recompute effectiveRole
    const currentDeviceId = get().deviceId;

    if (deviceId === currentDeviceId) {
      return data.roleOverride ?? null;
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
