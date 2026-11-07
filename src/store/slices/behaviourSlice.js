import { nanoid } from "nanoid";

// ---------------------------------------------------------
// BEHAVIOUR SLICE — FULLY NORMALIZED + AUDIT TRAIL
// ---------------------------------------------------------
export const createBehaviourSlice = (set, get) => ({
  behaviourLogs: [],

  behaviourTemplates: [
    { id: nanoid(), category: "Good Behaviour", desc: "Positive behaviour", stars: 1 },
    { id: nanoid(), category: "Helping with Housework", desc: "Helped around the house", stars: 2 },
    { id: nanoid(), category: "Doing Well at School", desc: "School success", stars: 3 },
    { id: nanoid(), category: "Doing Well in Sports", desc: "Sports achievement", stars: 3 },
    { id: nanoid(), category: "Not Listening", desc: "Did not listen", stars: -1 },
    { id: nanoid(), category: "Being Unkind", desc: "Unkind behaviour", stars: -2 },
    { id: nanoid(), category: "Poor Behaviour", desc: "General poor behaviour", stars: -1 }
  ],

  // ⭐ Normalize behaviour log
  _normalizeBehaviourLog(log) {
    return {
      id: log.id ?? nanoid(),
      date: log.date ?? new Date().toISOString().split("T")[0],
      category: log.category ?? "",
      description: log.description ?? "",
      stars: Number(log.stars ?? 0),

      // Audit metadata
      addedBy: log.addedBy ?? null,
      addedAt: log.addedAt ?? null,
      addedDeviceId: log.addedDeviceId ?? null,

      updatedBy: log.updatedBy ?? null,
      updatedAt: log.updatedAt ?? null,
      updatedDeviceId: log.updatedDeviceId ?? null,

      deletedBy: log.deletedBy ?? null,
      deletedAt: log.deletedAt ?? null,
      deletedDeviceId: log.deletedDeviceId ?? null
    };
  },

  // ⭐ Normalize template
  _normalizeBehaviourTemplate(t) {
    return {
      id: t.id ?? nanoid(),
      category: t.category ?? "",
      desc: t.desc ?? "",
      stars: Number(t.stars ?? 0)
    };
  },

  // ---------------------------------------------------------
  // ⭐ Add behaviour log (with audit metadata)
  // ---------------------------------------------------------
  addBehaviourLog: (category, description, stars, date) => {
    const childId = get().activeChild;
    if (!childId) return;

    const user = get().user;
    const deviceId = get().deviceId;

    const delta = Number(stars);
    const current = Number(get().starBalance);

    const newLog = get()._normalizeBehaviourLog({
      category,
      description,
      stars: delta,
      date,

      addedBy: user?.email ?? "unknown",
      addedAt: Date.now(),
      addedDeviceId: deviceId ?? null
    });

    set(state => ({
      behaviourLogs: [newLog, ...state.behaviourLogs],
      starBalance: current + delta
    }));

    get().saveToKV(childId);
  },

  // ---------------------------------------------------------
  // ⭐ Add behaviour template
  // ---------------------------------------------------------
  addBehaviourTemplate: (category, desc, stars) => {
    const newTemplate = get()._normalizeBehaviourTemplate({
      category,
      desc,
      stars
    });

    set(state => ({
      behaviourTemplates: [...state.behaviourTemplates, newTemplate]
    }));
  },

  // ---------------------------------------------------------
  // ⭐ Update behaviour template
  // ---------------------------------------------------------
  updateBehaviourTemplate: (templateId, updates) => {
    set(state => ({
      behaviourTemplates: state.behaviourTemplates.map(t =>
        t.id === templateId
          ? get()._normalizeBehaviourTemplate({ ...t, ...updates })
          : t
      )
    }));
  },

  // ---------------------------------------------------------
  // ⭐ Update behaviour log (with audit metadata)
  // ---------------------------------------------------------
  updateBehaviourLog: (logId, updates) => {
    const user = get().user;
    const deviceId = get().deviceId;
    const childId = get().activeChild;

    if (!childId) return;

    set(state => ({
      behaviourLogs: state.behaviourLogs.map(log =>
        log.id === logId
          ? get()._normalizeBehaviourLog({
              ...log,
              ...updates,
              updatedBy: user?.email ?? "unknown",
              updatedAt: Date.now(),
              updatedDeviceId: deviceId ?? null
            })
          : log
      )
    }));

    get().saveToKV(childId);
  },

  // ---------------------------------------------------------
  // ⭐ Delete behaviour log (with audit metadata)
  // ---------------------------------------------------------
  deleteBehaviourLog: (logId) => {
    const user = get().user;
    const deviceId = get().deviceId;
    const childId = get().activeChild;

    if (!childId) return;

    const existing = get().behaviourLogs.find(l => l.id === logId);

    if (existing) {
      const deletedLog = {
        ...existing,
        deletedBy: user?.email ?? "unknown",
        deletedAt: Date.now(),
        deletedDeviceId: deviceId ?? null
      };

      // Optional: store deleted logs
      // set({ behaviourDeletedLogs: [...get().behaviourDeletedLogs, deletedLog] });
    }

    set(state => ({
      behaviourLogs: state.behaviourLogs.filter(log => log.id !== logId)
    }));

    get().saveToKV(childId);
  }
});
