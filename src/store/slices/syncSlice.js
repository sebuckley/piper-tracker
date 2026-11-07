import { API_BASE } from "../../config/api";
import { normalizeSports, syncSportsWithTemplates } from "./sportsSlice";
import { POCKET_MONEY_REWARD_ID, pocketMoneyReward } from "../../data/rewardsData";
import { hashText, isLegacyTrackerState, prepareLegacyMigration } from "../../utils/legacyTrackerMigration";
import {
  encryptPayload,
  decryptPayload,
  base64ToBytes
} from "../../utils/crypto";

export const createSyncSlice = (set, get) => {
let loadVersion = 0;
const activeLoads = new Map();
return ({

  loadingData: true,
  trackerLoadError: null,
  loadedTrackerChildId: null,
  trackerStateExtras: {},

  // ---------------------------------------------------------
  // LOAD TRACKER STATE FROM KV (per child)
  // ---------------------------------------------------------
 loadFromKV(childId) {
  if (!childId) {
    console.warn("[Login:KV] Skipped: no active child");
    return Promise.resolve(false);
  }
  const pending = activeLoads.get(childId);
  if (pending && pending.version === loadVersion) return pending.promise;
  const version = ++loadVersion;
  const load = (async () => {
  const current = () => version === loadVersion && get().activeChild === childId;
  const fail = message => {
    console.error(`[Login:KV] ${message}`);
    if (current()) set({ loadingData: false, trackerLoadError: message, loadedTrackerChildId: null });
    return false;
  };
  set({ loadingData: true, trackerLoadError: null, loadedTrackerChildId: null });

  console.info("[Login:KV] Fetching child state");
  let res, originalText, record;
  try {
    res = await fetch(`${API_BASE}/api/state/${childId}`);
    if (!res.ok) return fail(`State request failed (HTTP ${res.status}).`);
    originalText = await res.text();
    record = JSON.parse(originalText);
  } catch {
    return fail("Unable to fetch or parse the saved state.");
  }

  const encryptionKey = get().encryptionKey;
  if (!encryptionKey) return fail("Family encryption key is missing.");
  let rawKeyBytes;
  try {
    rawKeyBytes = typeof encryptionKey === "string" ? base64ToBytes(encryptionKey) : encryptionKey;
  } catch {
    return fail("Family encryption key has an invalid encoding.");
  }

  let cloud;
  try {
    if (isLegacyTrackerState(record)) {
      console.info("[Login:KV] Legacy state found; encrypting and verifying before migration");
      const payload = await prepareLegacyMigration(record, rawKeyBytes);
      if (!current()) return false;
      const migrated = {
        meta: {
          version: 1,
          updatedAt: new Date().toISOString(),
          updatedBy: get().userProfile?.uid,
          familyGroupId: get().familyGroupId,
          childId,
          deviceId: get().deviceId,
          appVersion: "1.0.0"
        },
        payload
      };
      const response = await fetch(`${API_BASE}/api/state/${childId}/migrate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalHash: await hashText(originalText), record: migrated })
      });
      if (!response.ok) return fail(`Legacy migration failed (HTTP ${response.status}); saved data has not been loaded.`);
      console.info("[Login:KV] Backup created and encrypted state saved; verifying storage");
      let verified = false;
      for (let attempt = 0; attempt < 14; attempt++) {
        const check = await fetch(`${API_BASE}/api/state/${childId}`);
        if (!check.ok) return fail(`Migration verification failed (HTTP ${check.status}).`);
        const saved = await check.json();
        if (JSON.stringify(saved.payload) === JSON.stringify(payload)) {
          const restored = await decryptPayload(saved.payload, rawKeyBytes);
          verified = JSON.stringify(restored) === JSON.stringify(record);
          if (verified) break;
        }
        if (!current()) return false;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      if (!verified) return fail("Migration could not be verified yet. Retry after storage has updated.");
      await new Promise(resolve => setTimeout(resolve, 1100));
      if (!current()) return false;
      cloud = record;
      console.info("[Login:KV] Migration verified");
    } else {
      if (!record?.payload) return fail("Unrecognized or missing tracker state; no data was changed.");
      console.info("[Login:KV] Decrypting child state");
      cloud = await decryptPayload(record.payload, rawKeyBytes);
    }
  } catch {
    return fail("Unable to decrypt or migrate the saved state. No empty data will be saved.");
  }

  if (!current()) return false;
  if (!cloud || typeof cloud !== "object" || Array.isArray(cloud)) {
    return fail("Saved tracker state has an invalid format.");
  }
  console.info("[Login:KV] Applying child state");
  const next = {};
  const knownFields = new Set(["sportsClasses", "behaviourLogs", "achievements", "rewards", "routines", "starBalance", "rewardLogs", "sportsFeedback", "bankAccounts"]);
  next.trackerStateExtras = Object.fromEntries(Object.entries(cloud).filter(([key]) => !knownFields.has(key)));

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

  set({ ...next, loadedTrackerChildId: childId });

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
        await get().saveToKV(childId);
      }
      console.info("[Login:KV] Sport template synchronization completed");
    } catch {
      console.warn("[Login:KV] Sport template synchronization failed");
    }
  }

  if (current()) set({ loadingData: false });
  console.info("[Login:KV] Child state load completed");
  return true;
  })().catch(() => {
    console.error("[Login:KV] Unexpected error loading child state");
    if (version === loadVersion && get().activeChild === childId) {
      set({ loadingData: false, trackerLoadError: "Unable to load saved data. Check the console and retry.", loadedTrackerChildId: null });
    }
    return false;
  }).finally(() => {
    if (activeLoads.get(childId)?.promise === load) activeLoads.delete(childId);
  });
  activeLoads.set(childId, { version, promise: load });
  return load;
},


  // ---------------------------------------------------------
  // SAVE TRACKER STATE TO KV (per child)
  // ---------------------------------------------------------
  async saveToKV(childId) {

    if (!childId) return;

    const state = get();
    if (state.activeChild !== childId || state.loadedTrackerChildId !== childId) {
      console.error("[Login:KV] Save blocked: child state has not been successfully loaded");
      return;
    }
    const encryptionKey = state.encryptionKey;

    if (!encryptionKey) return;

    const rawKeyBytes =
      typeof encryptionKey === "string"
        ? base64ToBytes(encryptionKey)
        : encryptionKey;

    const trackerState = {
      ...state.trackerStateExtras,
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

    if (get().activeChild !== childId || get().loadedTrackerChildId !== childId) {
      console.error("[Login:KV] Save blocked: the selected child changed");
      return;
    }
    const response = await fetch(`${API_BASE}/api/state/${childId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meta, payload: encrypted })
    });
    if (!response.ok) console.error(`[Login:KV] Save failed (HTTP ${response.status})`);
  },

  // ---------------------------------------------------------
  // DEV RESET (KV only)
  // ---------------------------------------------------------
  resetAllDev: async () => {
    if (!import.meta.env.DEV) return;

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
};
