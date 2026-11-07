import { nanoid } from "nanoid";

// ---------------------------------------------------------
// ACHIEVEMENT SLICE — FULLY NORMALIZED + AUDIT TRAIL
// ---------------------------------------------------------

export const createAchievementSlice = (set, get) => ({

  achievements: [],

  achievementTemplates: [
    { id: nanoid(), title: "Passed dance exam", desc: "Completed dance exam successfully", stars: 10, name: "Dancing" },
    { id: nanoid(), title: "Passed gymnastics exam", desc: "Completed gymnastics exam successfully", stars: 10, name: "Gymnastics" },
    { id: nanoid(), title: "Passed swimming level", desc: "Completed swimming level successfully", stars: 10, name: "Swimming" },
    { id: nanoid(), title: "Great School Work", desc: "Outstanding school performance", stars: 5, name: "School" },
    { id: nanoid(), title: "Great School Report", desc: "Outstanding school performance and repsort at school", stars: 10, name: "School" }
  ],

  // ---------------------------------------------------------
  // INTERNAL HELPERS
  // ---------------------------------------------------------

  _auditAdd() {
    const user = get().user;
    const deviceId = get().deviceId;

    return {
      addedBy: user?.email ?? "unknown",
      addedAt: Date.now(),
      addedDeviceId: deviceId ?? null
    };
  },

  _auditUpdate() {
    const user = get().user;
    const deviceId = get().deviceId;

    return {
      updatedBy: user?.email ?? "unknown",
      updatedAt: Date.now(),
      updatedDeviceId: deviceId ?? null
    };
  },

  _auditDelete(obj) {
    const user = get().user;
    const deviceId = get().deviceId;

    return {
      ...obj,
      deletedBy: user?.email ?? "unknown",
      deletedAt: Date.now(),
      deletedDeviceId: deviceId ?? null
    };
  },

  _persist() {
    const childId = get().activeChild;
    if (childId) get().saveToKV(childId);
  },

  // ---------------------------------------------------------
  // NORMALIZERS
  // ---------------------------------------------------------

  _normalizeAchievement(a) {
    return {
      id: a.id ?? nanoid(),
      date: a.date ?? new Date().toISOString().split("T")[0],
      title: a.title ?? "",
      description: a.description ?? "",
      name: a.name ?? "",
      emoji: a.emoji ?? "",
      stars: Number(a.stars ?? 0),

      addedBy: a.addedBy ?? null,
      addedAt: a.addedAt ?? null,
      addedDeviceId: a.addedDeviceId ?? null,

      updatedBy: a.updatedBy ?? null,
      updatedAt: a.updatedAt ?? null,
      updatedDeviceId: a.updatedDeviceId ?? null,

      deletedBy: a.deletedBy ?? null,
      deletedAt: a.deletedAt ?? null,
      deletedDeviceId: a.deletedDeviceId ?? null
    };
  },

  _normalizeAchievementTemplate(t) {
    return {
      id: t.id ?? nanoid(),
      title: t.title ?? "",
      desc: t.desc ?? "",
      name: t.name ?? "",
      emoji: t.emoji ?? "",
      stars: Number(t.stars ?? 0),

      addedBy: t.addedBy ?? null,
      addedAt: t.addedAt ?? null,
      addedDeviceId: t.addedDeviceId ?? null,

      updatedBy: t.updatedBy ?? null,
      updatedAt: t.updatedAt ?? null,
      updatedDeviceId: t.updatedDeviceId ?? null,

      deletedBy: t.deletedBy ?? null,
      deletedAt: t.deletedAt ?? null,
      deletedDeviceId: t.deletedDeviceId ?? null
    };
  },

  // ---------------------------------------------------------
  // TEMPLATES
  // ---------------------------------------------------------

  addAchievementTemplate(title, desc, stars, name, emoji = "") {
    const newTemplate = get()._normalizeAchievementTemplate({
      title,
      desc,
      stars,
      name,
      emoji,
      ...get()._auditAdd()
    });

    set(state => ({
      achievementTemplates: [...state.achievementTemplates, newTemplate]
    }));

    get()._persist();
  },

  updateAchievementTemplate(templateId, updates) {
    set(state => ({
      achievementTemplates: state.achievementTemplates.map(t =>
        t.id === templateId
          ? get()._normalizeAchievementTemplate({
              ...t,
              ...updates,
              ...get()._auditUpdate()
            })
          : t
      )
    }));

    get()._persist();
  },

  deleteAchievementTemplate(templateId) {
    const existing = get().achievementTemplates.find(t => t.id === templateId);

    if (existing) {
      const deletedLog = get()._auditDelete(existing);
      // Optional: store deleted logs
    }

    set(state => ({
      achievementTemplates: state.achievementTemplates.filter(t => t.id !== templateId)
    }));

    get()._persist();
  },

  // ---------------------------------------------------------
  // ACHIEVEMENTS
  // ---------------------------------------------------------

  addAchievement(title, description, name, stars, date, emoji = "") {
    const childId = get().activeChild;
    if (!childId) return;

    const delta = Number(stars);
    const current = Number(get().starBalance);

    const newAchievement = get()._normalizeAchievement({
      title,
      description,
      name,
      emoji,
      stars: delta,
      date,
      ...get()._auditAdd()
    });

    set(state => ({
      achievements: [newAchievement, ...state.achievements],
      starBalance: current + delta
    }));

    get()._persist();
  },

  updateAchievement(achievementId, updates) {
    set(state => ({
      achievements: state.achievements.map(a =>
        a.id === achievementId
          ? get()._normalizeAchievement({
              ...a,
              ...updates,
              ...get()._auditUpdate()
            })
          : a
      )
    }));

    get()._persist();
  },

  deleteAchievement(achievementId) {
    const existing = get().achievements.find(a => a.id === achievementId);

    if (existing) {
      const deletedLog = get()._auditDelete(existing);
      // Optional: store deleted logs
    }

    set(state => ({
      achievements: state.achievements.filter(a => a.id !== achievementId)
    }));

    get()._persist();
  }
});
