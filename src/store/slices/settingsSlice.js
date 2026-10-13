export const createSettingsSlice = (set) => ({
  scoreMax: 10,
  starThreshold: 100,

  setScoreMax: (value) => set({ scoreMax: value }),
  setStarThreshold: (value) => set({ starThreshold: value })
});
