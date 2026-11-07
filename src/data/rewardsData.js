export const POCKET_MONEY_REWARD_ID = "pocket-money";

// Converts stars to money: `cost` stars are exchanged for `amount` in the account currency
export const pocketMoneyReward = {
  id: POCKET_MONEY_REWARD_ID,
  name: "Pocket Money",
  category: "Pocket Money",
  emoji: "💷",
  cost: 5,
  amount: 1,
  type: "pocketMoney",
  repeatable: true
};