import { nanoid } from "nanoid";

// ---------------------------------------------------------
// ACHIEVEMENT SLICE — FULLY NORMALIZED + PERSIST-SAFE
// ---------------------------------------------------------

export const createAchievementSlice = (set, get) => ({
  // ⭐ Guaranteed shape
  achievements: [],

  // ⭐ Templates now use className (correct field)
  achievementTemplates: [
    { id: nanoid(), title: "Passed dance exam", desc: "Completed dance exam successfully", stars: 10, name: "Dancing" },
    { id: nanoid(), title: "Passed gymnastics exam", desc: "Completed gymnastics exam successfully", stars: 10, name: "Gymnastics" },
    { id: nanoid(), title: "Passed swimming level", desc: "Completed swimming level successfully", stars: 10, name: "Swimming" },
    { id: nanoid(), title: "Great School Work", desc: "Outstanding school performance", stars: 5, name: "School" }
  ],

  // ⭐ Normalize achievement log
  _normalizeAchievement(a) {
    return {
      id: a.id ?? nanoid(),
      date: a.date ?? new Date().toISOString().split("T")[0],
      title: a.title ?? "",
      description: a.description ?? "",
      name: a.name ?? "",
      stars: Number(a.stars ?? 0)
    };
  },

  // ⭐ Normalize achievement template
  _normalizeAchievementTemplate(t) {
    return {
      id: t.id ?? nanoid(),
      title: t.title ?? "",
      desc: t.desc ?? "",
      name: t.name ?? "",
      stars: Number(t.stars ?? 0)
    };
  },

  // ⭐ Add achievement template
  addAchievementTemplate: (title, desc, stars, name) => {
    const newTemplate = get()._normalizeAchievementTemplate({
      title,
      desc,
      stars,
      name
    });

    set(state => ({
      ...state,
      achievementTemplates: [...state.achievementTemplates, newTemplate]
    }));
  },

  // ⭐ Update achievement template
  updateAchievementTemplate: (templateId, updates) => {
    set(state => ({
      ...state,
      achievementTemplates: state.achievementTemplates.map(t =>
        t.id === templateId
          ? get()._normalizeAchievementTemplate({ ...t, ...updates })
          : t
      )
    }));
  },

  // ⭐ Delete achievement template
  deleteAchievementTemplate: (templateId) => {
    set(state => ({
      ...state,
      achievementTemplates: state.achievementTemplates.filter(t => t.id !== templateId)
    }));
  },

  // ⭐ Add achievement (persist-safe)
  addAchievement: (title, description, name, stars, date) => {
    const childId = get().activeChild;
    if (!childId) return;

    const delta = Number(stars);
    const current = Number(get().starBalance);

    const newAchievement = get()._normalizeAchievement({
      title,
      description,
      name,
      stars: delta,
      date
    });

    set(state => ({
      ...state,
      achievements: [newAchievement, ...state.achievements],
      starBalance: current + delta
    }));

    get().saveToKV(childId);
  },

  // ⭐ Update achievement
  updateAchievement: (achievementId, updates) => {
    set(state => ({
      ...state,
      achievements: state.achievements.map(a =>
        a.id === achievementId
          ? get()._normalizeAchievement({ ...a, ...updates })
          : a
      )
    }));
  },

  // ⭐ Delete achievement
  deleteAchievement: (achievementId) => {
    set(state => ({
      ...state,
      achievements: state.achievements.filter(a => a.id !== achievementId)
    }));
  }
});
