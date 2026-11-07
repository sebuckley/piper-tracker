import { nanoid } from "nanoid";

export const createSavingsSlice = (set, get) => ({

  addGoal(childId, name, target) {
    set(state => {
      const accounts = state.bankAccounts;
      if (!accounts[childId]) {
        accounts[childId] = { balance: 0, transactions: [], goals: [] };
      }

      const newGoal = {
        id: nanoid(),
        name: name.trim(),
        target: Number(target),
        ...get()._auditAdd()
      };

      accounts[childId].goals = [...(accounts[childId].goals || []), newGoal];

      get()._persist();
      return { bankAccounts: { ...accounts } };
    });
  },

  updateGoal(childId, goalId, updates) {
    set(state => {
      const accounts = state.bankAccounts;
      const goals = accounts[childId]?.goals || [];

      accounts[childId].goals = goals.map(g =>
        g.id === goalId
          ? { ...g, ...updates, ...get()._auditUpdate() }
          : g
      );

      get()._persist();
      return { bankAccounts: { ...accounts } };
    });
  },

  deleteGoal(childId, goalId) {
    set(state => {
      const accounts = state.bankAccounts;
      const goals = accounts[childId]?.goals || [];

      const goal = goals.find(g => g.id === goalId);
      if (goal) get()._auditDelete(goal);

      accounts[childId].goals = goals.filter(g => g.id !== goalId);

      get()._persist();
      return { bankAccounts: { ...accounts } };
    });
  },

  getGoals(childId) {
    return get().bankAccounts[childId]?.goals || [];
  }

});
