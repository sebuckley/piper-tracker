import { API_BASE } from "../../config/api";
import { normalizeSports, syncSportsWithTemplates } from "./sportsSlice";
import { POCKET_MONEY_REWARD_ID, pocketMoneyReward } from "../../data/rewardsData";
import {
  encryptPayload,
  decryptPayload,
  base64ToBytes
} from "../../utils/crypto";

export const createSyncSlice = (set, get) => ({

  loadingData: true,

  // ---------------------------------------------------------
  // LOAD TRACKER STATE FROM KV (per child)
  // ---------------------------------------------------------
 async loadFromKV(childId) {
  if (!childId) return;

  const res = await fetch(`${API_BASE}/api/state/${childId}`);
  if (!res.ok) {
    set({ loadingData: false });
    return;
  }

  let meta, payload;
  try {
    ({ meta, payload } = await res.json());
  } catch (err) {
    console.warn("KV load: invalid JSON", err);
    set({ loadingData: false });
    return;
  }

  const encryptionKey = get().encryptionKey;
  if (!encryptionKey) {
    console.warn("KV load: no encryption key");
    set({ loadingData: false });
    return;
  }

  const rawKeyBytes =
    typeof encryptionKey === "string"
      ? base64ToBytes(encryptionKey)
      : encryptionKey;

  let cloud;

  // ⭐ Graceful decrypt failure
  try {
    cloud = await decryptPayload(payload, rawKeyBytes);
  } catch (err) {
    console.warn("KV load: decrypt failed, continuing with empty state", err);
    set({ loadingData: false });
    return;
  }

  const next = {};

  // Existing fields
  if (Array.isArray(cloud.sportsClasses)) next.sportsClasses = normalizeSports(cloud.sportsClasses);
  if (Array.isArray(cloud.behaviourLogs)) next.behaviourLogs = cloud.behaviourLogs;
  if (Array.isArray(cloud.achievements)) next.achievements = cloud.achievements;
  if (Array.isArray(cloud.rewards)) {
    // Make sure the pocket money reward exists for children saved before it was added
    next.rewards = cloud.rewards.some(r => r.id === POCKET_MONEY_REWARD_ID)
      ? cloud.rewards
      : [pocketMoneyReward, ...cloud.rewards];
  }
  if (Array.isArray(cloud.routines)) next.routines = cloud.routines;
  if (Array.isArray(cloud.rewardLogs)) next.rewardLogs = cloud.rewardLogs;
  if (Array.isArray(cloud.sportsFeedback)) next.sportsFeedback = cloud.sportsFeedback;

  if (cloud.starBalance !== undefined) {
    next.starBalance = Number(cloud.starBalance);
  }

  // ⭐ NEW: Load bank accounts
  next.bankAccounts = cloud.bankAccounts ?? {};

  if (Object.keys(next).length > 0) {
    set(next);
  }

  // Bring sport structure up to date with the latest templates
  if (get().sportsClasses?.length) {
    try {
      if (!get().defaultSports?.length) await get().loadDefaultSports();
      const { sports, changed } = syncSportsWithTemplates(
        get().sportsClasses,
        get().defaultSports
      );
      if (changed) {
        set({ sportsClasses: sports });
        get().saveToKV(childId);
      }
    } catch (err) {
      console.warn("Template sync failed", err);
    }
  }

  set({ loadingData: false });
},


  // ---------------------------------------------------------
  // SAVE TRACKER STATE TO KV (per child)
  // ---------------------------------------------------------
  async saveToKV(childId) {

    if (!childId) return;

    const state = get();
    const encryptionKey = state.encryptionKey;

    if (!encryptionKey) return;

    const rawKeyBytes =
      typeof encryptionKey === "string"
        ? base64ToBytes(encryptionKey)
        : encryptionKey;

    const trackerState = {
      sportsClasses: state.sportsClasses,
      behaviourLogs: state.behaviourLogs,
      achievements: state.achievements,
      rewards: state.rewards,
      routines: state.routines,
      starBalance: state.starBalance,
      rewardLogs: state.rewardLogs,
      sportsFeedback: state.sportsFeedback,

      // ⭐ NEW: Persist bank accounts
      bankAccounts: state.bankAccounts
    };

    let encrypted;
    try {
      encrypted = await encryptPayload(trackerState, rawKeyBytes);
    } catch (err) {
      console.error("Encryption failed:", err);
      return;
    }

    if (!encrypted) {
      console.error("Encryption returned null/undefined");
      return;
    }

    const meta = {
      version: 1,
      updatedAt: new Date().toISOString(),
      updatedBy: state.userProfile?.uid,
      familyGroupId: state.familyGroupId,
      childId,
      deviceId: state.deviceId,
      appVersion: "1.0.0"
    };

    await fetch(`${API_BASE}/api/state/${childId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meta, payload: encrypted })
    });
  },

  // ---------------------------------------------------------
  // DEV RESET (KV only)
  // ---------------------------------------------------------
  resetAllDev: async () => {
    if (process.env.NODE_ENV !== "development") return;

    const uid = get().userProfile?.uid;
    const childId = get().activeChild;

    localStorage.removeItem("piper-tracker");

    if (childId) {
      await fetch(`${API_BASE}/api/state/${childId}`, { method: "DELETE" });
    }

    if (uid) {
      await fetch(`${API_BASE}/api/user/${uid}`, { method: "DELETE" });
    }

    set(state => ({
      ...state,
      activeChild: null,
      behaviourLogs: [],
      achievements: [],
      routines: [],
      rewardLogs: [],
      starBalance: 0,
      sportsClasses: state.sportsClasses,
      rewards: state.rewards,

      // ⭐ NEW: Reset bank accounts
      bankAccounts: {}
    }));
  }
});
