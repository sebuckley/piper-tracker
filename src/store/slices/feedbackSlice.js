export const createFeedbackSlice = (set, get) => ({
  sportsFeedback: [],

  addFeedback: (entry) => {
    const id = crypto.randomUUID();

    set(state => ({
      sportsFeedback: [
        ...state.sportsFeedback,
        { id, ...entry }
      ]
    }));

    get().saveToKV(get().activeChild);
  },

  updateFeedback: (id, updates) => {
    set(state => ({
      sportsFeedback: state.sportsFeedback.map(f =>
        f.id === id ? { ...f, ...updates } : f
      )
    }));

    get().saveToKV(get().activeChild);
  },

removeFeedback: (id) => {
  console.log("Removing sports feedback with id:", id);
  set(state => ({
    sportsFeedback: state.sportsFeedback.filter(f => f.id !== id)
  }));

  get().saveToKV(get().activeChild);
},


  getFeedbackForSport: (sportId) =>
    get().sportsFeedback.filter(f => f.sportId === sportId)
});
