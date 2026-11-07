export const createSettingsSlice = (set, get) => ({
  scoreMax: 10,
  starThreshold: 100,
  recentActivity: [],

  isViewer: () => !["owner", "editor"].includes(get().effectiveRole),
  isEditor: () => get().effectiveRole === "editor",
  isOwner: () => get().effectiveRole === "owner",

  setScoreMax: (value) => set({ scoreMax: value }),
  setStarThreshold: (value) => set({ starThreshold: value }),
  addRecentActivity: (activity) => set((state) => ({ recentActivity: [...state.recentActivity, activity] }))
});
