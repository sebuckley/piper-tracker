import { API_BASE } from "../../config/api";

export const createResetSlice = (set, get) => ({

resetAllDev: async () => {
  if (process.env.NODE_ENV !== "development") return;

  const childId = get().activeChild;

  console.log("Resetting all dev data");

  // Delete Firestore child + user
  if (childId) {
    await fetch(`${API_BASE}/api/state/${childId}`, { method: "DELETE" });
  }

  // Delete ALL KV pending submissions
  await fetch(`${API_BASE}/api/admin/pending/all`, { method: "DELETE" });

  // Reset local state
  set(state => ({
    ...state,
    behaviourLogs: [],
    achievements: [],
    routines: [],
    rewardLogs: [],
    starBalance: 0,
    sportsClasses: [],
    rewards: [],
  
  }));
}


});
