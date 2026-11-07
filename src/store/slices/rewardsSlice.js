import { nanoid } from "nanoid";
import { API_BASE } from "../../config/api";
import { POCKET_MONEY_REWARD_ID, pocketMoneyReward } from "../../data/rewardsData";

// ---------------------------------------------------------
// REWARDS + STARS SLICE — FULLY NORMALIZED + AUDIT TRAIL
// ---------------------------------------------------------
export const createRewardsSlice = (set, get) => ({

  // ⭐ Default rewards
  rewards: [pocketMoneyReward],

  starBalance: 0,
  rewardLogs: [],
  rewardRequests: [],   // ⭐ NEW — pending requests

  // ⭐ Normalize reward
  _normalizeReward(r) {
    return {
      id: r.id ?? nanoid(),
      name: r.name ?? "",
      category: r.category ?? "",
      emoji: r.emoji ?? "",
      cost: Number(r.cost ?? 0),
      ...(r.type ? { type: r.type } : {}),
      ...(r.templateId ? { templateId: r.templateId } : {}),
      ...(r.type === "pocketMoney" ? { amount: Number(r.amount ?? 1) } : {}),
      redeemed: Boolean(r.redeemed),
      repeatable: Boolean(r.repeatable),
      confirmedBy: r.confirmedBy ?? null,
      confirmedAt: r.confirmedAt ?? null,
      confirmedDeviceId: r.confirmedDeviceId ?? null
    };
  },

  // ⭐ Normalize reward log
  _normalizeRewardLog(log) {
    return {
      id: log.id ?? nanoid(),
      rewardId: log.rewardId ?? "",
      name: log.name ?? "",
      type: "reward",
      category: log.category ?? "",
      emoji: log.emoji ?? "",
      cost: Number(log.cost ?? 0),
      date: log.date ?? new Date().toISOString(),
      repeatable: Boolean(log.repeatable),
      remainingStars: Number(log.remainingStars ?? 0),
      confirmedBy: log.confirmedBy ?? null,
      confirmedAt: log.confirmedAt ?? null,
      confirmedDeviceId: log.confirmedDeviceId ?? null
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

  // ---------------------------------------------------------
  // ⭐ REQUEST REWARD (viewer/editor)
  // ---------------------------------------------------------
  requestReward: (rewardId, options = {}) => {
    const { rewards, rewardRequests } = get();
    const user = get().user;
    const deviceId = get().deviceId;

    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    let cost = reward.cost;
    let amount;
    if (reward.type === "pocketMoney") {
      const unit = Number(reward.amount) || 1;
      amount = Number(options.amount ?? unit);
      cost = Math.ceil((amount * Number(reward.cost)) / unit);
    }

    const newReq = {
      id: rewardId,
      name: reward.name,
      category: reward.category,
      emoji: reward.emoji,
      cost,
      ...(amount !== undefined ? { amount } : {}),
      requestedBy: user?.email ?? "unknown",
      requestedAt: Date.now(),
      requestedDeviceId: deviceId ?? null
    };

    set({
      rewardRequests: [...rewardRequests, newReq]
    });
  },

  // ---------------------------------------------------------
  // ⭐ DENY REWARD REQUEST (owner only)
  // ---------------------------------------------------------
  denyRewardRequest: (rewardId) => {
    const { rewardRequests } = get();
    const user = get().user;
    const deviceId = get().deviceId;

    const updatedRequests = rewardRequests.map(req =>
      req.id === rewardId
        ? {
            ...req,
            deniedBy: user?.email ?? "unknown",
            deniedAt: Date.now(),
            deniedDeviceId: deviceId ?? null
          }
        : req
    );

    set({
      rewardRequests: updatedRequests.filter(r => r.id !== rewardId)
    });
  },

  // ---------------------------------------------------------
  // ⭐ Accounts a pocket money reward can be paid into (current accounts only)
  // ---------------------------------------------------------
  getPocketMoneyAccounts: () =>
    Object.values(get().bankAccounts ?? {}).filter(a => a.type === "current"),

  // ---------------------------------------------------------
  // ⭐ APPROVE REWARD (owner only)
  // options.accountId is required for pocket money rewards
  // ---------------------------------------------------------
  redeemReward: (rewardId, options = {}) => {
    const { rewards, rewardRequests, starBalance } = get();
    const user = get().user;
    const deviceId = get().deviceId;
    const childId = get().activeChild;
    if (!childId) return { ok: false };

    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return { ok: false };

    const isPocketMoney = reward.type === "pocketMoney";
    let cost = Number(reward.cost);
    let money = 0;

    // Pocket money: reward.cost stars buy reward.amount, so any amount can be priced
    if (isPocketMoney) {
      const unit = Number(reward.amount) || 1;
      money = Number(options.amount ?? unit);
      if (!(money > 0)) return { ok: false, error: "Choose an amount" };
      cost = Math.ceil((money * Number(reward.cost)) / unit);
    }

    const current = Number(starBalance);
    if (current < cost) return { ok: false, error: "Not enough stars" };

    let accountId = null;

    if (isPocketMoney) {
      const eligible = get().getPocketMoneyAccounts();
      accountId = options.accountId;

      if (eligible.length === 0) return { ok: false, error: "Set up a current account first" };
      if (!eligible.some(a => a.id === accountId)) {
        return { ok: false, error: "Choose a current account" };
      }
    }

    const newBalance = current - cost;

    // Remove pending request if exists
    const updatedRequests = rewardRequests.filter(r => r.id !== rewardId);

    // Update reward with audit metadata
    const updatedRewards = rewards.map(r =>
      r.id === rewardId
        ? {
            ...r,
            redeemed: true,
            confirmedBy: user?.email ?? "unknown",
            confirmedAt: Date.now(),
            confirmedDeviceId: deviceId ?? null
          }
        : r
    );

    // ⭐ Add reward log with FULL reward details
    const newLog = get()._normalizeRewardLog({
      rewardId,
      name: isPocketMoney ? `${reward.name} (${money.toFixed(2)})` : reward.name,
      type: "reward",
      category: reward.category,
      emoji: reward.emoji,
      cost,
      repeatable: reward.repeatable,
      remainingStars: newBalance,
      confirmedBy: user?.email ?? "unknown",
      confirmedAt: Date.now(),
      confirmedDeviceId: deviceId ?? null
    });

    set({
      rewards: updatedRewards,
      rewardRequests: updatedRequests,
      rewardLogs: [newLog, ...get().rewardLogs],
      starBalance: newBalance
    });

    if (isPocketMoney) {
      // addCredit also persists the child's state
      get().addCredit(accountId, money, `Pocket money (${cost} stars)`);
    } else {
      get().saveToKV(childId);
    }

    return { ok: true };
  },

  // ---------------------------------------------------------
  // ⭐ Add reward
  // ---------------------------------------------------------
  addReward: (name, category, cost, repeatable, emoji, options = {}) => {
    const childId = get().activeChild;
    if (!childId) return;

    // templateId is the stable id shared across users (the global reward's id)
    const templateId = options.templateId ?? nanoid();

    const newReward = get()._normalizeReward({
      ...(options.type === "pocketMoney" ? { id: POCKET_MONEY_REWARD_ID, type: "pocketMoney", amount: options.amount } : {}),
      name,
      category,
      emoji,
      cost,
      templateId,
      redeemed: false,
      repeatable
    });

    set({
      rewards: [...get().rewards, newReward]
    });

    get().saveToKV(childId);

    // Rewards picked from the global list are already approved
    if (!options.fromGlobal) {
      fetch(`${API_BASE}/api/submit/reward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reward: {
            templateId,
            name: newReward.name,
            category: newReward.category,
            emoji: newReward.emoji,
            cost: newReward.cost,
            repeatable: newReward.repeatable
          },
          submittedBy: get().user?.email ?? "unknown",
          submittedAt: Date.now(),
          submittedDeviceId: get().deviceId ?? null
        })
      }).catch(err => console.error("Reward submit failed:", err));
    }
  },

  // ---------------------------------------------------------
  // ⭐ Update reward
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // ⭐ Delete reward
  // ---------------------------------------------------------
  deleteReward: (rewardId) => {
    const childId = get().activeChild;
    if (!childId) return;

    set({
      rewards: get().rewards.filter(r => r.id !== rewardId)
    });

    get().saveToKV(childId);
  }
});
