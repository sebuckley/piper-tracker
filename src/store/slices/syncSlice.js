import { API_BASE } from "../../config/api";

export const createSyncSlice = (set, get) => ({


  async loadFromKV(childId) {
    if (!childId) return;

    const res = await fetch(`${API_BASE}/api/state/${childId}`);
    if (!res.ok) return;

    const cloud = await res.json();

    const next = {};

    if (get().sportsClasses.length === 0 && Array.isArray(cloud.sportsClasses)) {
      next.sportsClasses = cloud.sportsClasses;
    }

    if (get().behaviourLogs.length === 0 && Array.isArray(cloud.behaviourLogs)) {
      next.behaviourLogs = cloud.behaviourLogs;
    }

    if (get().achievements.length === 0 && Array.isArray(cloud.achievements)) {
      next.achievements = cloud.achievements;
    }

    if (get().rewards.length === 0 && Array.isArray(cloud.rewards)) {
      next.rewards = cloud.rewards;
    }

    if (get().routines.length === 0 && Array.isArray(cloud.routines)) {
      next.routines = cloud.routines;
    }

    if (get().rewardLogs.length === 0 && Array.isArray(cloud.rewardLogs)) {
      next.rewardLogs = cloud.rewardLogs;
    }

    if (get().starBalance === 0 && cloud.starBalance !== undefined) {
      next.starBalance = Number(cloud.starBalance);
    }

    if (get().sportsFeedback.length === 0 && Array.isArray(cloud.sportsFeedback)) {
      next.sportsFeedback = cloud.sportsFeedback;
    }

    // ⭐ DO NOT SPREAD STATE — this causes reloads
    if (Object.keys(next).length > 0) {
      set(next);
    }
  },


  async saveToKV(childId) {
    console.log("Saving state to KV for childId:", childId);
    if (!childId) return;

    const state = get();

    const trackerState = {
      sportsClasses: state.sportsClasses,
      behaviourLogs: state.behaviourLogs,
      achievements: state.achievements,
      rewards: state.rewards,
      routines: state.routines,
      starBalance: state.starBalance,
      rewardLogs: state.rewardLogs,
      sportsFeedback: state.sportsFeedback,
    };

    console.log("Tracker state to be saved:", trackerState);

    await fetch(`${API_BASE}/api/state/${childId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trackerState)
    });
  },

  async loadUserFromKV(uid) {
    if (!uid) return;

    const res = await fetch(`${API_BASE}/api/user/${uid}`);

    let user = null;
    if (res.ok) {
      const text = await res.text();
      user = text ? JSON.parse(text) : null;
    }

    if (!user || Object.keys(user).length === 0) {
      user = {
        profile: {
          uid,
          fullName: "",
          email: "",
          country: "",
          preferredSport: "",
          avatarUrl: "",
          createdAt: new Date().toISOString()
        },
        children: [],
        activeChild: null
      };

      await fetch(`${API_BASE}/api/user/${uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
    }

    set(state => ({
      ...state,
      profile: user.profile,
      children: Array.isArray(user.children) ? user.children : [],
      activeChild: user.activeChild ?? null
    }));
  },

  async saveUserToKV(uid) {
    if (!uid) return;

    const userState = {
      profile: get().profile,
      children: get().children,
      activeChild: get().activeChild
    };

    await fetch(`${API_BASE}/api/user/${uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userState)
    });
  },

  resetAllDev: async () => {
    if (process.env.NODE_ENV !== "development") return;

    const uid = get().profile.uid;
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
      children: [],
      activeChild: null,
      behaviourLogs: [],
      achievements: [],
      routines: [],
      rewardLogs: [],
      starBalance: 0,
      sportsClasses: state.sportsClasses,
      rewards: state.rewards
    }));
  }
});
