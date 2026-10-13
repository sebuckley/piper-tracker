import { nanoid } from "nanoid";

// ---------------------------------------------------------
// BEHAVIOUR SLICE — FULLY NORMALIZED + PERSIST-SAFE
// ---------------------------------------------------------
export const createBehaviourSlice = (set, get) => ({
  // ⭐ Guaranteed shape
  behaviourLogs: [],

  // ⭐ Templates now include category (required for logs)
  behaviourTemplates: [
    { id: nanoid(), category: "Good Behaviour", desc: "Positive behaviour", stars: 1 },
    { id: nanoid(), category: "Helping with Housework", desc: "Helped around the house", stars: 2 },
    { id: nanoid(), category: "Doing Well at School", desc: "School success", stars: 3 },
    { id: nanoid(), category: "Doing Well in Sports", desc: "Sports achievement", stars: 3 },
    { id: nanoid(), category: "Not Listening", desc: "Did not listen", stars: -1 },
    { id: nanoid(), category: "Being Unkind", desc: "Unkind behaviour", stars: -2 },
    { id: nanoid(), category: "Poor Behaviour", desc: "General poor behaviour", stars: -1 }
  ],

  // ⭐ Normalize a behaviour log
  _normalizeBehaviourLog(log) {
    return {
      id: log.id ?? nanoid(),
      date: log.date ?? new Date().toISOString().split("T")[0], // consistent format
      category: log.category ?? "",
      description: log.description ?? "",
      stars: Number(log.stars ?? 0)
    };
  },

  // ⭐ Normalize a behaviour template
  _normalizeBehaviourTemplate(t) {
    return {
      id: t.id ?? nanoid(),
      category: t.category ?? "",
      desc: t.desc ?? "",
      stars: Number(t.stars ?? 0)
    };
  },

  // ⭐ Add behaviour log (persist-safe)
  addBehaviourLog: (category, description, stars, date) => {
    const childId = get().activeChild;
    if (!childId) return;

    const delta = Number(stars);
    const current = Number(get().starBalance);

    const newLog = get()._normalizeBehaviourLog({
      category,
      description,
      stars: delta,
      date
    });

    set(state => ({
      ...state,
      behaviourLogs: [newLog, ...state.behaviourLogs],
      starBalance: current + delta
    }));

    get().saveToKV(childId);
  },

  // ⭐ Add behaviour template
  addBehaviourTemplate: (category, desc, stars) => {
    const newTemplate = get()._normalizeBehaviourTemplate({
      category,
      desc,
      stars
    });

    set(state => ({
      ...state,
      behaviourTemplates: [...state.behaviourTemplates, newTemplate]
    }));
  },

  // ⭐ Update behaviour template
  updateBehaviourTemplate: (templateId, updates) => {
    set(state => ({
      ...state,
      behaviourTemplates: state.behaviourTemplates.map(t =>
        t.id === templateId
          ? get()._normalizeBehaviourTemplate({ ...t, ...updates })
          : t
      )
    }));
  },

  // ⭐ Delete behaviour template
  deleteBehaviourTemplate: (templateId) => {
    set(state => ({
      ...state,
      behaviourTemplates: state.behaviourTemplates.filter(t => t.id !== templateId)
    }));
  },

  // ⭐ Update behaviour log
  updateBehaviourLog: (logId, updates) => {
    set(state => ({
      ...state,
      behaviourLogs: state.behaviourLogs.map(log =>
        log.id === logId
          ? get()._normalizeBehaviourLog({ ...log, ...updates })
          : log
      )
    }));
  },

  // ⭐ Delete behaviour log
  deleteBehaviourLog: (logId) => {
    set(state => ({
      ...state,
      behaviourLogs: state.behaviourLogs.filter(log => log.id !== logId)
    }));
  }
});
