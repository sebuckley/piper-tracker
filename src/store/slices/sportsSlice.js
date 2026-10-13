import { nanoid } from "nanoid";
import { sportsTemplates, createEmptySport } from "../../data/sportsData";

export const createSportsSlice = (set, get) => ({
  defaultSports: sportsTemplates,
  sportsClasses: [],

  // ---------------------------------------------------------
  // SPORTS
  // ---------------------------------------------------------

  addSportFromTemplate(templateId) {
    const childId = get().activeChild;
    if (!childId) return;

    const template = sportsTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newSport = {
      ...template,
      id: nanoid(),
      clubs: [],
      categories: template.categories.map(cat => ({
        ...cat,
        id: nanoid(),
        skills: cat.skills.map(skill => ({
          ...skill,
          id: nanoid()
        }))
      }))
    };

    set({
      sportsClasses: [...get().sportsClasses, newSport]
    });

    get().saveToKV(childId);
  },

  addCustomSport(name) {
    const childId = get().activeChild;
    if (!childId) return;

    const newSport = {
      ...createEmptySport(name),
      clubs: []
    };

    set({
      sportsClasses: [...get().sportsClasses, newSport]
    });

    get().saveToKV(childId);
  },

  deleteSport(sportId) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.filter(s => s.id !== sportId)
    }));

    get().saveToKV(childId);
  },

  updateSport(sportId, updates) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId ? { ...s, ...updates } : s
      )
    }));

    get().saveToKV(childId);
  },

  // ---------------------------------------------------------
  // CLUBS (multiple)
  // ---------------------------------------------------------

  addClub(sportId, clubData) {
    const childId = get().activeChild;
    if (!childId) return;

    const newClub = {
      id: nanoid(),
      name: clubData.name || "",
      address: clubData.address || "",
      email: clubData.email || "",
      website: clubData.website || "",
      hidden: false // ⭐ user can hide clubs instead of deleting globally
    };

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? { ...s, clubs: [...(s.clubs || []), newClub] }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  updateClub(sportId, clubId, updates) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              clubs: s.clubs.map(club =>
                club.id === clubId ? { ...club, ...updates } : club
              )
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  hideClub(sportId, clubId) {
    const childId = get().activeChild;
    if (!childId) return;

    // ⭐ Clubs are hidden, not deleted
    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              clubs: s.clubs.map(club =>
                club.id === clubId ? { ...club, hidden: true } : club
              )
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  // ---------------------------------------------------------
  // CLASS SESSIONS (with categories + club + manual status)
  // ---------------------------------------------------------

  addClassSession(sportId, day, time, categories = [], clubId = null, status = "live") {
    const childId = get().activeChild;
    if (!childId) return;

    const newSession = {
      id: nanoid(),
      day,
      time,
      categories,
      clubId,
      status // ⭐ "live" | "historic" | "cancelled"
    };

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? { ...s, classSessions: [...s.classSessions, newSession] }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  updateClassSession(sportId, sessionId, updates) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              classSessions: s.classSessions.map(cs =>
                cs.id === sessionId ? { ...cs, ...updates } : cs
              )
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  deleteClassSession(sportId, sessionId) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              classSessions: s.classSessions.filter(cs => cs.id !== sessionId)
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  // ---------------------------------------------------------
  // CATEGORIES
  // ---------------------------------------------------------

  addCategory(sportId, name) {
    const childId = get().activeChild;
    if (!childId) return;

    const newCategory = {
      id: nanoid(),
      name,
      description: "",
      levels:["Beginner", "Intermediate", "Advanced", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"],
      routines: [],
      skills: []
    };

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? { ...s, categories: [...s.categories, newCategory] }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  deleteCategory(sportId, categoryId) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              categories: s.categories.filter(c => c.id !== categoryId)
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  updateCategory: (sportId, categoryId, updates) =>
  set(state => {
    const sport = state.sportsClasses.find(s => s.id === sportId);
    if (!sport) return state;

    const category = sport.categories.find(c => c.id === categoryId);
    if (!category) return state;

    Object.assign(category, updates);

    // ⭐ Persist to KV / backend
    get().saveToKV(state.activeChild);

    return { sportsClasses: [...state.sportsClasses] };
  }),


  // ---------------------------------------------------------
  // ROUTINES
  // ---------------------------------------------------------

  addRoutine(sportId, categoryId, name, level) {
    const childId = get().activeChild;
    if (!childId) return;

    const routineLevel = parseInt(level) || 1;

    const newRoutine = {
      id: nanoid(),
      name,
      level: routineLevel,
      skills: [],
      steps: []
    };

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              categories: s.categories.map(c =>
                c.id === categoryId
                  ? { ...c, routines: [...c.routines, newRoutine] }
                  : c
              )
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  deleteRoutine(sportId, categoryId, routineId) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              categories: s.categories.map(c =>
                c.id === categoryId
                  ? {
                      ...c,
                      routines: c.routines.filter(r => r.id !== routineId)
                    }
                  : c
              )
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  reorderRoutineSkills(sportId, categoryId, routineId, newOrder) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              categories: s.categories.map(c =>
                c.id === categoryId
                  ? {
                      ...c,
                      routines: c.routines.map(r =>
                        r.id === routineId
                          ? { ...r, skills: newOrder }
                          : r
                      )
                    }
                  : c
              )
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  updateRoutine(sportId, categoryId, routineId, updates) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              categories: s.categories.map(c =>
                c.id === categoryId
                  ? {
                      ...c,
                      routines: c.routines.map(r =>
                        r.id === routineId ? { ...r, ...updates } : r
                      )
                    }
                  : c
              )
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  // ---------------------------------------------------------
  // SKILLS
  // ---------------------------------------------------------

  addSkill(sportId, categoryId, { name, level, description, link }) {
    const childId = get().activeChild;
    if (!childId) return;

    const skillLevel = parseInt(level) || 1;

    const newSkill = {
      id: nanoid(),
      name,
      level: skillLevel,
      description: description || "",
      link: link || ""
    };

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              categories: s.categories.map(c =>
                c.id === categoryId
                  ? { ...c, skills: [...c.skills, newSkill] }
                  : c
              )
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  deleteSkill(sportId, categoryId, skillId) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              categories: s.categories.map(c =>
                c.id === categoryId
                  ? {
                      ...c,
                      skills: c.skills.filter(sk => sk.id !== skillId),
                      routines: c.routines.map(r => ({
                        ...r,
                        skills: r.skills.filter(sk => sk.id !== skillId)
                      }))
                    }
                  : c
              )
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  addSkillToRoutine(
    sportId,
    categoryId,
    routineId,
    { name, level, description, link }
  ) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              categories: s.categories.map(c => {
                if (c.id !== categoryId) return c;

                const routine = c.routines.find(r => r.id === routineId);
                const routineLevel = routine.level;

                const skillLevel = parseInt(level) || routineLevel;

                if (skillLevel > routineLevel) {
                  alert(
                    `Skill level ${skillLevel} cannot be added to a routine of level ${routineLevel}.`
                  );
                  return c;
                }

                const newSkill = {
                  id: nanoid(),
                  name,
                  level: skillLevel,
                  description: description || "",
                  link: link || ""
                };

                const updatedRoutines = c.routines.map(r =>
                  r.id === routineId
                    ? { ...r, skills: [...r.skills, newSkill] }
                    : r
                );

                const skillExists = c.skills.some(sk => sk.name === name);

                const updatedSkills = skillExists
                  ? c.skills
                  : [...c.skills, newSkill];

                return {
                  ...c,
                  skills: updatedSkills,
                  routines: updatedRoutines
                };
              })
            }
          : s
      )
    }));

    get().saveToKV(childId);
  },

  deleteRoutineSkill(sportId, categoryId, routineId, skillId) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              categories: s.categories.map(c =>
                c.id === categoryId
                  ? {
                      ...c,
                      routines: c.routines.map(r =>
                        r.id === routineId
                          ? {
                              ...r,
                              skills: r.skills.filter(sk => sk.id !== skillId)
                            }
                          : r
                      )
                    }
                  : c
              )
            }
          : s
      )
    }));

    get().saveToKV(childId);
  }
});
