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
  if (!childId) {
    console.warn("[Login:KV] Skipped: no active child");
    return false;
  }

  console.info("[Login:KV] Fetching child state");
  const res = await fetch(`${API_BASE}/api/state/${childId}`);
  if (!res.ok) {
    console.error(`[Login:KV] State request failed (HTTP ${res.status})`);
    set({ loadingData: false });
    return false;
  }

  console.info("[Login:KV] State received; parsing response");
  let payload;
  try {
    ({ payload } = await res.json());
  } catch {
    console.error("[Login:KV] State response contains invalid JSON");
    set({ loadingData: false });
    return false;
  }

  const encryptionKey = get().encryptionKey;
  if (!encryptionKey) {
    console.error("[Login:KV] Cannot decrypt state: family encryption key is missing");
    set({ loadingData: false });
    return false;
  }

  console.info("[Login:KV] Decrypting child state");
  const rawKeyBytes =
    typeof encryptionKey === "string"
      ? base64ToBytes(encryptionKey)
      : encryptionKey;

  let cloud;

  // ⭐ Graceful decrypt failure
  try {
    cloud = await decryptPayload(payload, rawKeyBytes);
  } catch {
    console.error("[Login:KV] Could not decrypt child state");
    set({ loadingData: false });
    return false;
  }

  console.info("[Login:KV] Applying child state");
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
      console.info("[Login:KV] Synchronizing sport templates");
      if (!get().defaultSports?.length) await get().loadDefaultSports();
      const { sports, changed } = syncSportsWithTemplates(
        get().sportsClasses,
        get().defaultSports
      );
      if (changed) {
        console.info("[Login:KV] Sport structure changed; saving updates");
        set({ sportsClasses: sports });
        get().saveToKV(childId);
      }
      console.info("[Login:KV] Sport template synchronization completed");
    } catch {
      console.warn("[Login:KV] Sport template synchronization failed");
    }
  }

  set({ loadingData: false });
  console.info("[Login:KV] Child state load completed");
  return true;
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
