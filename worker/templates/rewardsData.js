// Default global rewards. `templateId` is the stable id shared by all users and is
// the KV key in GLOBAL_REWARDS. Add new entries here and they are seeded on the next
// load; existing KV entries are never overwritten.
// 1 star = 20p.
export const DEFAULT_REWARDS = [
  { templateId: "pocket-money", name: "Pocket Money", category: "Pocket Money", emoji: "💷", cost: 5, amount: 1, type: "pocketMoney", repeatable: true },
  { templateId: "reward-movie", name: "Movie / Film / TV", category: "Movie", emoji: "🎬", cost: 25, repeatable: true },
  { templateId: "reward-outdoor", name: "Outdoor / Park / Nature", category: "Outdoor", emoji: "🌳", cost: 15, repeatable: true },
  { templateId: "reward-food", name: "Food / Dinner / Meal Choice", category: "Food", emoji: "🍽️", cost: 20, repeatable: true },
  { templateId: "reward-treat", name: "Sweets / Treats", category: "Treat", emoji: "🍭", cost: 3, repeatable: true },
  { templateId: "reward-sticker", name: "Stickers / Small Rewards", category: "Sticker", emoji: "⭐", cost: 1, repeatable: true },
  { templateId: "reward-reading", name: "Magazine / Book / Reading", category: "Reading", emoji: "📚", cost: 5, repeatable: true },
  { templateId: "reward-screen-time", name: "Screen Time / Games", category: "Screen Time", emoji: "🎮", cost: 10, repeatable: true },
  { templateId: "reward-toy-shop", name: "Toy Shop Visit (£30+)", category: "Shopping", emoji: "🛍️", cost: 150, repeatable: true },
  { templateId: "reward-bedtime", name: "Bedtime Pass / Stay Up Late", category: "Bedtime", emoji: "🛌", cost: 10, repeatable: true },
  { templateId: "reward-event", name: "Special Event / Celebration", category: "Event", emoji: "🎉", cost: 75, repeatable: true },
  { templateId: "reward-trip", name: "Trip / Outing", category: "Trip", emoji: "🚗", cost: 100, repeatable: true },
  { templateId: "reward-craft", name: "Craft / Creative Activity", category: "Craft", emoji: "🎨", cost: 10, repeatable: true },
  { templateId: "reward-achievement", name: "Achievement‑based Reward", category: "Achievement", emoji: "🏆", cost: 100, repeatable: true },
  { templateId: "reward-baking", name: "Baking / Cooking Together", category: "Baking", emoji: "🧁", cost: 12, repeatable: true },
  { templateId: "reward-puzzle", name: "Puzzle / Board Game", category: "Puzzle", emoji: "🧩", cost: 25, repeatable: true },
  { templateId: "reward-pet", name: "Pet‑related Reward", category: "Pet", emoji: "🐾", cost: 15, repeatable: true }
];
