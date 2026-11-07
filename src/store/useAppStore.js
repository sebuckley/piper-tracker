import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createAuthSlice } from "./slices/authStoreSlice"; 
import { createChildrenSlice } from "./slices/childSlice";
import { createDeviceSlice } from "./slices/deviceSlice";
import { createSyncSlice } from "./slices/syncSlice";
import { createUserSlice } from "./slices/userSlice";
import { createBehaviourSlice } from "./slices/behaviourSlice";
import { createAchievementSlice } from "./slices/achievementSlice";
import { createRoutinesSlice } from "./slices/routineSlice";
import { createSportsSlice } from "./slices/sportsSlice";
import { createRewardsSlice } from "./slices/rewardsSlice";
import { createUiSlice } from "./slices/UISlice";
import { createResetSlice } from "./slices/resetSlice";
import { createFeedbackSlice } from "./slices/feedbackSlice";
import { createSettingsSlice } from "./slices/settingsSlice";
import { createFamilySlice } from "./slices/familySlice";
import { createBankSlice } from "./slices/bankSlice";
import { createSavingsSlice } from "./slices/savingsSlice";
import { createGlobalTemplatesSlice } from "./slices/globalTemplatesSlice";

export const useAppStore = create((set, get) => ({
  
  ...createAuthSlice(set, get),
  ...createUserSlice(set, get),
  ...createFamilySlice(set, get),
  ...createChildrenSlice(set, get),
  ...createUiSlice(set),
  ...createSyncSlice(set, get),
  ...createBehaviourSlice(set, get),
  ...createAchievementSlice(set, get),
  ...createRoutinesSlice(set, get),
  ...createSportsSlice(set, get),
  ...createSettingsSlice(set, get),
  ...createFeedbackSlice(set, get),
  ...createRewardsSlice(set, get),
  ...createResetSlice(set, get),
  ...createDeviceSlice(set, get),
  ...createBankSlice(set, get),
  ...createSavingsSlice(set, get),
  ...createGlobalTemplatesSlice(set, get),

}));

