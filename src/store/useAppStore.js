import { create } from "zustand";
import { persist } from "zustand/middleware";


import { createSyncSlice } from "./slices/syncSlice";
import { createProfileSlice } from "./slices/profileSlice";
import { createBehaviourSlice } from "./slices/behaviourSlice";
import { createAchievementSlice } from "./slices/achievementSlice";
import { createRoutinesSlice } from "./slices/routineSlice";
import { createSportsSlice } from "./slices/sportsSlice";
import { createRewardsSlice } from "./slices/rewardsSlice";
import { createUiSlice } from "./slices/UISlice";
import { createResetSlice } from "./slices/resetSlice";
import { createFeedbackSlice } from "./slices/feedbackSlice";
import { createSettingsSlice } from "./slices/settingsSlice";



export const useAppStore = create((set, get) => ({
  ...createUiSlice(set),
  ...createSyncSlice(set, get),
  ...createProfileSlice(set, get),
  ...createBehaviourSlice(set, get),
  ...createAchievementSlice(set, get),
  ...createRoutinesSlice(set, get),
  ...createSportsSlice(set, get),
  ...createSettingsSlice(set),
  ...createFeedbackSlice(set, get),
  ...createRewardsSlice(set, get),
  ...createResetSlice(set, get),
}));

