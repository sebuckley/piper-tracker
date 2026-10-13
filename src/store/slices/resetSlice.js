import { API_BASE } from "../../config/api";

export const createResetSlice = (set, get) => ({

 resetAllDev: async () => {
    if (process.env.NODE_ENV !== "development") return;

    const uid = get().profile.uid;
    const childId = get().activeChild;

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