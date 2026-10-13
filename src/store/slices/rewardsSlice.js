import { nanoid } from "nanoid";

// ---------------------------------------------------------
// REWARDS + STARS SLICE — FULLY NORMALIZED + PERSIST-SAFE
// ---------------------------------------------------------
export const createRewardsSlice = (set, get) => ({
  // ⭐ Default rewards now include repeatable
  rewards: [
    { id: nanoid(), name: "Movie Night", category: "Treat", cost: 10, redeemed: false, repeatable: false },
    { id: nanoid(), name: "Trip to the Park", category: "Activity", cost: 15, redeemed: false, repeatable: false },
    { id: nanoid(), name: "Choose Dinner", category: "Privilege", cost: 20, redeemed: false, repeatable: false }
  ],

  starBalance: 0,
  rewardLogs: [],

  // ⭐ Normalize reward
  _normalizeReward(r) {
    return {
      id: r.id ?? nanoid(),
      name: r.name ?? "",
      category: r.category ?? "",
      cost: Number(r.cost ?? 0),
      redeemed: Boolean(r.redeemed),
      repeatable: Boolean(r.repeatable)
    };
  },

  // ⭐ Normalize reward log
  _normalizeRewardLog(log) {
    return {
      id: log.id ?? nanoid(),
      rewardId: log.rewardId ?? "",
      name: log.name ?? "",
      cost: Number(log.cost ?? 0),
      date: log.date ?? new Date().toISOString(),
      repeatable: Boolean(log.repeatable),
      remainingStars: Number(log.remainingStars ?? 0)
    };
  },

  // ⭐ Add stars
  addStars: (amount) => {
    const childId = get().activeChild;
    if (!childId) return;

    const delta = Number(amount);
    const current = Number(get().starBalance);

    set({ starBalance: current + delta });

    get().saveToKV(childId);
  },

  // ⭐ Redeem reward
  redeemReward: (rewardId) => {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => {
      const reward = state.rewards.find(r => r.id === rewardId);
      if (!reward) return state;

      const current = Number(state.starBalance);
      const cost = Number(reward.cost);

      if (current < cost) return state; // not enough stars

      const newBalance = current - cost;

      return {
        rewards: state.rewards.map(r =>
          r.id === rewardId
            ? {
                ...r,
                redeemed: r.repeatable ? !r.redeemed : true
              }
            : r
        ),

        starBalance: newBalance,

        rewardLogs: [
          get()._normalizeRewardLog({
            rewardId,
            name: reward.name,
            cost,
            repeatable: reward.repeatable,
            remainingStars: newBalance
          }),
          ...state.rewardLogs
        ]
      };
    });

    get().saveToKV(childId);
  },

  // ⭐ Add reward
  addReward: (name, category, cost, repeatable) => {
    const childId = get().activeChild;
    if (!childId) return;

    const newReward = get()._normalizeReward({
      name,
      category,
      cost,
      redeemed: false,
      repeatable
    });

    set({
      rewards: [...get().rewards, newReward]
    });

    get().saveToKV(childId);
  },

  // ⭐ Update reward
  updateReward: (rewardId, updates) => {
    const childId = get().activeChild;
    if (!childId) return;

    set({
      rewards: get().rewards.map(r =>
        r.id === rewardId
          ? get()._normalizeReward({ ...r, ...updates })
          : r
      )
    });

    get().saveToKV(childId);
  },

  // ⭐ Delete reward
  deleteReward: (rewardId) => {
    const childId = get().activeChild;
    if (!childId) return;

    set({
      rewards: get().rewards.filter(r => r.id !== rewardId)
    });

    get().saveToKV(childId);
  }
});
