import { nanoid } from "nanoid";
import { API_BASE } from "../../config/api";


/* ---------------------------------------------------------
   ROUTINE SKILL MIGRATION (names → IDs)
--------------------------------------------------------- */
const migrateRoutineSkills = (category) => {
  return {
    ...category,
    routines: category.routines.map(routine => ({
      ...routine,
      skills: routine.skills.map(skillRef => {
        // Already an ID?
        const byId = category.skills.find(sk => sk.id === skillRef);
        if (byId) return skillRef;

        // Name → ID
        const byName = category.skills.find(sk => sk.name === skillRef);
        return byName ? byName.id : skillRef;
      })
    }))
  };
};

const createEmptySport = name => ({
  id: nanoid(),
  name,
  classSessions: [],
  levels: [{ id: nanoid(), value: 1, label: "Beginner" }, { id: nanoid(), value: 2, label: "Intermediate" }, { id: nanoid(), value: 3, label: "Advanced" }],
  categories: [
    {
      id: nanoid(),
      name: "General",
      description: "",
      routines: [],
      skills: []
    }
  ]
});

/* ---------------------------------------------------------
   TEMPLATE-ID NORMALISATION
   Every sport/level/category/skill/routine has a stable templateId
   (shared across users). Routines reference skills by skill templateId.
--------------------------------------------------------------- */
export const normalizeSports = (sports = []) =>
  sports.map(sport => ({
    ...sport,
    templateId: sport.templateId ?? sport.id,
    levels: (sport.levels || []).map(l => ({ ...l, templateId: l.templateId ?? l.id })),
    categories: (sport.categories || []).map(cat => {
      const skills = (cat.skills || []).map(sk => ({
        ...sk,
        templateId: sk.templateId ?? sk.id
      }));

      const toRef = ref => {
        const match = skills.find(
          sk => sk.templateId === ref || sk.id === ref || sk.name === ref
        );
        return match ? match.templateId : ref;
      };

      return {
        ...cat,
        templateId: cat.templateId ?? cat.id,
        skills,
        routines: (cat.routines || []).map(r => ({
          ...r,
          templateId: r.templateId ?? r.id,
          skills: (r.skills || []).map(toRef)
        }))
      };
    })
  }));

const findByRef = (list, ref) =>
  list?.find(x => x.templateId === ref) ?? list?.find(x => x.id === ref);

export const DEFAULT_UI_LABELS = {
  routineName: "Routine",
  routinePlural: "Routines",
  categoryName: "Category",
  categoryPlural: "Categories"
};

/* ---------------------------------------------------------
   TEMPLATE SYNC
   Brings each user sport's structure up to date with its template.
   Skills and routines are never touched (those are user data).
   - uiLabels / routineRules: always taken from the template (fallback to defaults)
   - other sport/level/category fields: filled in only when missing
   - levels / categories missing from the user's sport are added
   Returns { sports, changed }.
--------------------------------------------------------- */
const SPORT_OWN_KEYS = new Set([
  "id", "templateId", "levels", "categories", "classSessions", "clubs",
  "uiLabels", "routineRules", "addedBy", "addedAt", "addedDeviceId",
  "updatedBy", "updatedAt", "updatedDeviceId"
]);
const ITEM_OWN_KEYS = new Set([
  "id", "templateId", "skills", "routines",
  "addedBy", "addedAt", "addedDeviceId", "updatedBy", "updatedAt", "updatedDeviceId"
]);

const fillMissing = (target, source, skip) => {
  let changed = false;
  const out = { ...target };
  Object.entries(source || {}).forEach(([k, v]) => {
    if (skip.has(k) || out[k] !== undefined) return;
    out[k] = v;
    changed = true;
  });
  return { out, changed };
};

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* ---------------------------------------------------------
   ROUTINE RULES
   Category rules win over sport rules. A category's rules may be flat
   ({ min, max }) or keyed by level ({ 1: { min, max } }). Sport rules are
   keyed by level. Falls back to min 3 / no max.
--------------------------------------------------------- */
export const getRoutineRules = (sport, category, level) => {
  const pick = rules => {
    if (!rules) return null;
    if (Number.isFinite(rules.min) || Number.isFinite(rules.max)) return rules;
    return rules[level] ?? null;
  };
  const r = pick(category?.routineRules) ?? pick(sport?.routineRules) ?? {};
  return {
    min: Number.isFinite(r.min) ? r.min : 3,
    max: Number.isFinite(r.max) ? r.max : Infinity
  };
};

export const syncSportsWithTemplates = (sports = [], templates = []) => {
  if (!templates.length) return { sports, changed: false };
  let anyChanged = false;

  const result = sports.map(sport => {
    const template = templates.find(t => t.id === (sport.templateId ?? sport.id));
    let changed = false;
    let next = { ...sport };

    const uiLabels = template?.uiLabels ?? sport.uiLabels ?? DEFAULT_UI_LABELS;
    const routineRules = template?.routineRules ?? sport.routineRules ?? {};
    if (!same(next.uiLabels, uiLabels)) { next.uiLabels = uiLabels; changed = true; }
    if (!same(next.routineRules, routineRules)) { next.routineRules = routineRules; changed = true; }

    if (!Array.isArray(next.clubs)) { next.clubs = []; changed = true; }

    if (template) {
      const filled = fillMissing(next, template, SPORT_OWN_KEYS);
      next = filled.out;
      changed = changed || filled.changed;

      const levels = [...(next.levels || [])];
      template.levels?.forEach(tl => {
        const existing = levels.findIndex(l => (l.templateId ?? l.id) === tl.id);
        if (existing === -1) {
          const { id, ...rest } = tl;
          levels.push({ ...rest, templateId: id, id: nanoid() });
          changed = true;
        } else {
          const filledLevel = fillMissing(levels[existing], tl, ITEM_OWN_KEYS);
          if (filledLevel.changed) { levels[existing] = filledLevel.out; changed = true; }
        }
      });
      next.levels = levels;

      const categories = [...(next.categories || [])];
      template.categories?.forEach(tc => {
        const idx = categories.findIndex(c => (c.templateId ?? c.id) === tc.id);
        if (idx === -1) {
          const { id, ...rest } = tc;
          categories.push({ ...rest, templateId: id, id: nanoid(), skills: [], routines: [] });
          changed = true;
        } else {
          const filledCat = fillMissing(categories[idx], tc, ITEM_OWN_KEYS);
          let cat = filledCat.out;
          let catChanged = filledCat.changed;
          // Category-level routine rules follow the template
          if (tc.routineRules && !same(cat.routineRules, tc.routineRules)) {
            cat = { ...cat, routineRules: tc.routineRules };
            catChanged = true;
          }
          if (catChanged) { categories[idx] = cat; changed = true; }
        }
      });
      next.categories = categories;
    }

    if (changed) anyChanged = true;
    return changed ? next : sport;
  });

  return { sports: result, changed: anyChanged };
};

// Sends a user-created routine for admin approval. Routines copied from a
// template (instance id differs from templateId) are never submitted.
// The submission is keyed by the routine's templateId, so re-saving updates
// the pending entry instead of duplicating it.
function submitRoutineForApproval(get, sport, category, routine) {
  if (!sport || !category || !routine) return;

  const routineTemplateId = routine.templateId ?? routine.id;
  if (routine.id !== routineTemplateId) return;

  const skillsInRoutine = (routine.skills || [])
    .map(ref => findByRef(category.skills, ref))
    .filter(Boolean);

  const skillRefs = skillsInRoutine.map(sk => sk.templateId ?? sk.id);

  // Full skill objects so the approver can add any that the template lacks
  const skills = skillsInRoutine.map(sk => ({
    ...sk,
    id: sk.templateId ?? sk.id,
    templateId: sk.templateId ?? sk.id
  }));

  fetch(`${API_BASE}/api/submit/routine`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      routine: { ...routine, id: routineTemplateId, templateId: routineTemplateId, skills: skillRefs },
      skills,
      sportId: sport.templateId ?? sport.id,
      sportName: sport.name,
      categoryId: category.templateId ?? category.id,
      categoryName: category.name,
      submittedBy: get().user?.email ?? "unknown",
      submittedAt: Date.now(),
      submittedDeviceId: get().deviceId ?? null
    })
  }).catch(err => console.error("Routine submit failed:", err));
}

// Which leading arguments of each action are sport/category/routine/level/skill refs
const REF_ARGS = {
  updateSport: ["sport"],
  deleteSport: ["sport"],
  addClub: ["sport"],
  deleteClub: ["sport"],
  updateClub: ["sport"],
  hideClub: ["sport"],
  addClassSession: ["sport"],
  updateClassSession: ["sport"],
  deleteClassSession: ["sport"],
  addCategory: ["sport"],
  deleteCategory: ["sport", "category"],
  updateCategory: ["sport", "category"],
  addLevel: ["sport"],
  updateLevel: ["sport", "level"],
  deleteLevel: ["sport", "level"],
  addRoutine: ["sport", "category"],
  deleteRoutine: ["sport", "category", "routine"],
  updateRoutine: ["sport", "category", "routine"],
  reorderRoutineSkills: ["sport", "category", "routine"],
  addSkill: ["sport", "category"],
  deleteSkill: ["sport", "category", "skill"],
  addSkillToRoutineLocal: ["sport", "category", "routine"],
  saveRoutine: ["sport", "category", "routine"],
  deleteRoutineSkill: ["sport", "category", "routine"]
};

// Callers pass templateIds; the slice internals work on instance ids.
const withTemplateIdArgs = (slice, get) => {
  const wrapped = { ...slice };

  Object.entries(REF_ARGS).forEach(([name, kinds]) => {
    const original = slice[name];
    if (typeof original !== "function") return;

    wrapped[name] = (...args) => {
      const sport = findByRef(get().sportsClasses, args[0]);
      const category = findByRef(sport?.categories, args[1]);
      const resolved = {
        sport,
        category,
        routine: findByRef(category?.routines, args[2]),
        level: findByRef(sport?.levels, args[1]),
        skill: findByRef(category?.skills, args[2])
      };

      const next = [...args];
      kinds.forEach((kind, i) => {
        // update/delete level takes the level as 2nd arg
        const item = resolved[kind];
        if (item) next[i] = item.id;
      });
      return original(...next);
    };
  });

  return wrapped;
};

export const createSportsSlice = (set, get) =>
  withTemplateIdArgs(createRawSportsSlice(set, get), get);

const createRawSportsSlice = (set, get) => ({
  defaultSports: [],
  sportsClasses: [],

  /* ---------------------------------------------------------
     INTERNAL HELPERS
  --------------------------------------------------------- */
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

  loadDefaultSports: async () => {
    const res = await fetch(`${API_BASE}/api/templates`);
    if (!res.ok) {
      const error = new Error("Could not load sport templates");
      error.code = `http/${res.status}`;
      throw error;
    }
    const templates = await res.json();
    if (!Array.isArray(templates)) {
      throw new Error("Invalid sport templates response");
    }
    set({ defaultSports: templates });
  },

  /* ---------------------------------------------------------
     SPORTS
  --------------------------------------------------------- */
addSportFromTemplate(templateId) {
  const childId = get().activeChild;
  if (!childId) return;

  const sportsTemplates = get().defaultSports;
  const template = sportsTemplates.find(t => t.id === templateId);
  if (!template) return;

  // ⭐ Build sport instance from template
  const newSport = {
    // Copy template fields except its ID
    name: template.name,
    classSessions: [],
    levels: template.levels.map(level => {
      const { id: templateLevelId, ...rest } = level;
      return {
        ...rest,
        templateId: templateLevelId,
        id: nanoid()
      };
    }),

    // New instance ID
    id: nanoid(),

    // Reference to template
    templateId: template.id,

    clubs: [],

    uiLabels: template.uiLabels || DEFAULT_UI_LABELS,
    routineRules: template.routineRules || {},

    // ⭐ Categories
    categories: template.categories.map(cat => {
      const { id: templateCategoryId, skills, routines, ...rest } = cat;

      return {
        ...rest,

        // Template category ID preserved
        templateId: templateCategoryId,

        // New instance category ID
        id: nanoid(),

        // ⭐ Skills
        skills: skills.map(skill => {
          const { id: templateSkillId, ...skillRest } = skill;

          return {
            ...skillRest,

            // Template skill ID preserved
            templateId: templateSkillId,

            // New instance skill ID
            id: nanoid()
          };
        }),

        // ⭐ Routines (skills must be migrated later)
        routines: routines.map(r => ({
          ...r,
          // Routine ID stays the same (template ID)
          templateId: r.id,
          id: nanoid(), // instance routine ID
          skills: [...r.skills] // will be migrated after skill IDs exist
        }))
      };
    }),

    ...get()._auditAdd()
  };

  // ⭐ Migrate routine skill names → instance skill IDs
  const migratedCategories = newSport.categories.map(category => {
    const skillMap = new Map(
      category.skills.map(s => [s.templateId, s.id])
    );

    const migratedRoutines = category.routines.map(routine => ({
      ...routine,
      skills: routine.skills.map(skillNameOrTemplateId => {
        // In your template routines, skills are names, not IDs.
        // So we must match by name OR templateId.
        const match = category.skills.find(
          s =>
            s.name === skillNameOrTemplateId ||
            s.templateId === skillNameOrTemplateId
        );

        return match ? match.templateId : skillNameOrTemplateId;
      })
    }));

    return {
      ...category,
      routines: migratedRoutines
    };
  });

  const finalSport = {
    ...newSport,
    categories: migratedCategories
  };

  // ⭐ Save to state
  set(state => ({
    sportsClasses: [...state.sportsClasses, finalSport]
  }));

  get()._persist();
},

addCustomSport(sportObject) {
  const childId = get().activeChild;
  if (!childId) return;

  console.log("add sport");

  // ⭐ Brand new sport: id and templateId are identical for every item
  const safeCategories = (sportObject.categories || []).map(cat => {
    const catId = cat.id || nanoid();

    return {
      ...cat,
      id: catId,
      templateId: catId,

      skills: (cat.skills || []).map(skill => {
        const skillId = skill.id || nanoid();
        return { ...skill, id: skillId, templateId: skillId };
      }),

      routines: (Array.isArray(cat.routines) ? cat.routines : []).map(r => {
        const routineId = r.id || nanoid();
        return { ...r, id: routineId, templateId: routineId };
      })
    };
  });

  // ⭐ Build final sport object
  const newId = nanoid();
  const newSport = {
    id: newId,
    templateId: newId,

    name: sportObject.name,
    classSessions: [],
    clubs: [],
    uiLabels: sportObject.uiLabels || DEFAULT_UI_LABELS,
    routineRules: sportObject.routineRules || {},

    levels: (sportObject.levels || []).map(level => {
      const levelId = level.id || nanoid();
      return { ...level, id: levelId, templateId: levelId };
    }),

    categories: safeCategories,

    ...get()._auditAdd()
  };

  // ⭐ Add to child immediately
  set({
    sportsClasses: [...get().sportsClasses, newSport]
  });

  get()._persist();

  // ⭐ Submit full sport object for approval
  fetch(`${API_BASE}/api/submit/sport`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sport: newSport,
      submittedBy: get().user?.email ?? "unknown",
      submittedAt: Date.now(),
      submittedDeviceId: get().deviceId ?? null
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Custom sport submitted for approval:", data);
    });
},


  updateSport(sportId, updates) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? { ...s, ...updates, ...get()._auditUpdate() }
          : s
      )
    }));

    get()._persist();
  },

  deleteSport(sportId) {
    const childId = get().activeChild;
    if (!childId) return;

    const sport = get().sportsClasses.find(s => s.id === sportId);
    if (sport) get()._auditDelete(sport);

    set(state => ({
      sportsClasses: state.sportsClasses.filter(s => s.id !== sportId)
    }));

    get()._persist();
  },

deleteTemplate: async (id) => {
  // 1️⃣ Remove locally
  const updated = get().defaultSports.filter(t => t.id !== id);

  set({
    defaultSports: updated,
    ...get()._auditDelete()
  });

  // 2️⃣ Delete from backend
  await fetch(`${API_BASE}/api/templates/${id}`, {
    method: "DELETE"
  });

  // 3️⃣ Reload templates from backend
  const res = get().loadDefaultSports();
  const fresh = await res.json();

  set({ defaultSports: fresh });
  get()._persist();
},



  /* ---------------------------------------------------------
     CLUBS
  --------------------------------------------------------- */
  addClub(sportId, clubData, options = {}) {

    const childId = get().activeChild;
    if (!childId) return;

    const newClub = {
      id: nanoid(),
      name: clubData.name || "",
      logo: clubData.logo || null,
      sport: clubData.sport || "",
      address: clubData.address || "",
      email: clubData.email || "",
      website: clubData.website || "",
      socials: clubData.socials || [],
      hidden: false,
      ...get()._auditAdd()
    };

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? { ...s, clubs: [...(s.clubs || []), newClub] }
          : s
      )
    }));

    get()._persist();

    // Clubs picked from the global list are already approved
    if (options.fromGlobal) return;

    // Submit for approval
    fetch(`${API_BASE}/api/submit/club`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        club: newClub,
        sportId,
        submittedBy: get().user?.email ?? "unknown",
        submittedAt: Date.now(),
        submittedDeviceId: get().deviceId ?? null
      })
    });
  },

  deleteClub(sportId, clubId) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? { ...s, clubs: s.clubs.filter(c => c.id !== clubId) }
          : s
      )
    }));

    get()._persist();
  },

updateClub(sportId, clubId, updates) {
  const childId = get().activeChild;
  if (!childId) return;

  // 1️⃣ Update locally
  set(state => ({
    sportsClasses: state.sportsClasses.map(s =>
      s.id === sportId
        ? {
            ...s,
            clubs: s.clubs.map(club =>
              club.id === clubId
                ? { ...club, ...updates, ...get()._auditUpdate() }
                : club
            )
          }
        : s
    )
  }));

  get()._persist();

  // 2️⃣ Submit update for approval
  const sport = get().sportsClasses.find(s => s.id === sportId);
  const club = sport?.clubs.find(c => c.id === clubId);

  console.log(club.name);

  fetch(`${API_BASE}/api/submit/club-update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clubName: club.name,   // you may need to add this
      updates,
      submittedBy: get().user?.email ?? "unknown",
      submittedAt: Date.now(),
      submittedDeviceId: get().deviceId ?? null
    })
  });
},


  hideClub(sportId, clubId) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? {
              ...s,
              clubs: s.clubs.map(club =>
                club.id === clubId
                  ? { ...club, hidden: true, ...get()._auditUpdate() }
                  : club
              )
            }
          : s
      )
    }));

    get()._persist();
  },

  /* ---------------------------------------------------------
     CLASS SESSIONS
  --------------------------------------------------------- */
  addClassSession(sportId, day, time, categories = [], clubId = null, status = "live") {
    const childId = get().activeChild;
    if (!childId) return;

    const newSession = {
      id: nanoid(),
      day,
      time,
      categories,
      clubId,
      status,
      ...get()._auditAdd()
    };

    set(state => ({
      sportsClasses: state.sportsClasses.map(s =>
        s.id === sportId
          ? { ...s, classSessions: [...s.classSessions, newSession] }
          : s
      )
    }));

    get()._persist();
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
                cs.id === sessionId
                  ? { ...cs, ...updates, ...get()._auditUpdate() }
                  : cs
              )
            }
          : s
      )
    }));

    get()._persist();
  },

  deleteClassSession(sportId, sessionId) {
    const childId = get().activeChild;
    if (!childId) return;

    const sport = get().sportsClasses.find(s => s.id === sportId);
    const session = sport?.classSessions.find(cs => cs.id === sessionId);

    if (session) get()._auditDelete(session);

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

    get()._persist();
  },

  /* ---------------------------------------------------------
     CATEGORIES
  --------------------------------------------------------- */
addCategory(sportId, name) {
  const childId = get().activeChild;
  if (!childId) return;

  const coreLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Level 1",
    "Level 2",
    "Level 3",
    "Level 4",
    "Level 5"
  ].map(level => ({
    id: nanoid(),
    name: level
  }));

  const newCategoryId = nanoid();
  const newCategory = {
    id: newCategoryId,
    templateId: newCategoryId,
    name,
    description: "",
    levels: coreLevels,
    routines: [],
    skills: [],
    ...get()._auditAdd()
  };

  set(state => ({
    sportsClasses: state.sportsClasses.map(s =>
      s.id === sportId
        ? { ...s, categories: [...s.categories, newCategory] }
        : s
    )
  }));

  get()._persist();

  // Submit for approval (templateId is the stable id across users)
  const sport = get().sportsClasses.find(s => s.id === sportId);
  if (sport) {
    fetch(`${API_BASE}/api/submit/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: {
          id: newCategoryId,
          templateId: newCategoryId,
          name,
          description: "",
          levels: [],
          routines: [],
          skills: []
        },
        sportId: sport.templateId ?? sport.id,
        sportName: sport.name,
        submittedBy: get().user?.email ?? "unknown",
        submittedAt: Date.now(),
        submittedDeviceId: get().deviceId ?? null
      })
    }).catch(err => console.error("Category submit failed:", err));
  }
},


  deleteCategory(sportId, categoryId) {
    const childId = get().activeChild;
    if (!childId) return;

    const sport = get().sportsClasses.find(s => s.id === sportId);
    const category = sport?.categories.find(c => c.id === categoryId);

    if (category) get()._auditDelete(category);

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

    get()._persist();
  },

  updateCategory(sportId, categoryId, updates) {
    const childId = get().activeChild;
    if (!childId) return;

    set(state => {
      const sport = state.sportsClasses.find(s => s.id === sportId);
      if (!sport) return state;

      const category = sport.categories.find(c => c.id === categoryId);
      if (!category) return state;

      Object.assign(category, updates, get()._auditUpdate());

      get()._persist();

      return { sportsClasses: [...state.sportsClasses] };
    });
  },

  /* ---------------------------------------------------------
     LEVELS
  --------------------------------------------------------- */

addLevel(sportId, levelLabel) {
  const childId = get().activeChild;
  if (!childId) return;

  const sport = get().sportsClasses.find(s => s.id === sportId);
  const currentLevels = sport?.levels || [];

  const nextValue =
    currentLevels.length > 0
      ? Math.max(...currentLevels.map(l => l.value)) + 1
      : 1;

  const newLevelId = nanoid();
  const newLevel = {
    id: newLevelId,
    templateId: newLevelId,
    value: nextValue,
    label: levelLabel.trim(),
    ...get()._auditAdd()
  };

  set(state => ({
    sportsClasses: state.sportsClasses.map(s =>
      s.id === sportId
        ? { ...s, levels: [...currentLevels, newLevel] }
        : s
    )
  }));

  get()._persist();
},

updateLevel(sportId, levelId, newLabel) {
  const childId = get().activeChild;
  if (!childId) return;

  set(state => ({
    sportsClasses: state.sportsClasses.map(s =>
      s.id === sportId
        ? {
            ...s,
            levels: s.levels.map(l =>
              l.id === levelId
                ? { ...l, label: newLabel.trim(), ...get()._auditUpdate() }
                : l
            )
          }
        : s
    )
  }));

  get()._persist();
},

deleteLevel(sportId, levelId) {
  const childId = get().activeChild;
  if (!childId) return;

  const sport = get().sportsClasses.find(s => s.id === sportId);
  const level = sport?.levels.find(l => l.id === levelId);

  if (level) get()._auditDelete(level);

  set(state => ({
    sportsClasses: state.sportsClasses.map(s =>
      s.id === sportId
        ? {
            ...s,
            levels: s.levels.filter(l => l.id !== levelId)
          }
        : s
    )
  }));

  get()._persist();
},


  /* ---------------------------------------------------------
     ROUTINES
  --------------------------------------------------------- */
  addRoutine(sportId, categoryId, name, level) {
    const childId = get().activeChild;
    if (!childId) return;

    const routineLevel = parseInt(level) || 1;

    const newRoutineId = nanoid();
    const newRoutine = {
      id: newRoutineId,
      templateId: newRoutineId,
      name,
      level: routineLevel,
      skills: [],
      steps: [],
      ...get()._auditAdd()
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

    get()._persist();
  },

  deleteRoutine(sportId, categoryId, routineId) {
    const childId = get().activeChild;
    if (!childId) return;

    const sport = get().sportsClasses.find(s => s.id === sportId);
    const category = sport?.categories.find(c => c.id === categoryId);
    const routine = category?.routines.find(r => r.id === routineId);

    if (routine) get()._auditDelete(routine);

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

    get()._persist();
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
                        r.id === routineId
                          ? { ...r, ...updates, ...get()._auditUpdate() }
                          : r
                      )
                    }
                  : c
              )
            }
          : s
      )
    }));

    get()._persist();
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
                          ? {
                              ...r,
                              skills: newOrder,
                              ...get()._auditUpdate()
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

    get()._persist();
  },

  /* ---------------------------------------------------------
     SKILLS (FULLY FIXED)
  --------------------------------------------------------- */

  /* ⭐ Add a new skill to a category */
  addSkill(sportId, categoryId, { name, level, description, link }) {
    const childId = get().activeChild;
    if (!childId) return;

    const skillLevel = parseInt(level) || 1;

    const newSkillId = nanoid();
    const newSkill = {
      id: newSkillId,
      templateId: newSkillId,
      sportId,
      categoryId,
      name: name.trim(),
      level: skillLevel,
      description: description?.trim() || "",
      link: link?.trim() || "",
      ...get()._auditAdd()
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

    get()._persist();

    // Submit for approval
    fetch(`${API_BASE}/api/submit/skill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skill: newSkill,
        sportId: get().sportsClasses.find(s => s.id === sportId)?.templateId ?? sportId,
        categoryId:
          get().sportsClasses.find(s => s.id === sportId)?.categories.find(c => c.id === categoryId)
            ?.templateId ?? categoryId,
        submittedBy: get().user?.email ?? "unknown",
        submittedAt: Date.now(),
        submittedDeviceId: get().deviceId ?? null
      })
    });
  },

  /* ⭐ Delete a skill from category + remove from routines */
  deleteSkill(sportId, categoryId, skillId) {
    const childId = get().activeChild;
    if (!childId) return;

    const sport = get().sportsClasses.find(s => s.id === sportId);
    const category = sport?.categories.find(c => c.id === categoryId);
    const skill = category?.skills.find(sk => sk.id === skillId);

    if (skill) get()._auditDelete(skill);

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
                        skills: r.skills.filter(
                          ref => ref !== skillId && ref !== skill?.templateId
                        )
                      }))
                    }
                  : c
              )
            }
          : s
      )
    }));

    get()._persist();
  },

/* ⭐ Add skill to routine (LOCAL ONLY — but submit NEW skills) */
addSkillToRoutineLocal(sportId, categoryId, routineId, skill) {
  const user = get().user;
  const deviceId = get().deviceId;

  const sport = get().sportsClasses.find(s => s.id === sportId);
  const category = sport?.categories.find(c => c.id === categoryId);
  const routine = category?.routines.find(r => r.id === routineId);
  if (!routine) {
    console.warn("addSkillToRoutineLocal: routine not found", {
      sportId, categoryId, routineId,
      sportFound: !!sport,
      categoryFound: !!category,
      routineIdsInCategory: category?.routines?.map(r => r.id),
      sportIds: get().sportsClasses.map(s => s.id)
    });
    return;
  }

  const skillLevel = parseInt(skill.level) || routine.level;
  if (skillLevel > routine.level) {
    alert(`Skill level ${skillLevel} cannot be added to a routine of level ${routine.level}.`);
    return;
  }

  const lowerName = skill.name.trim().toLowerCase();
  const existingSkill = category.skills.find(sk =>
    (sk.templateId && skill.templateId && sk.templateId === skill.templateId) ||
    sk.name.toLowerCase() === lowerName
  );

  let createdSkill = null;
  if (!existingSkill) {
    // New skill: id and templateId are the same stable id
    const newId = skill.templateId || nanoid();
    createdSkill = {
      id: newId,
      templateId: newId,
      name: skill.name.trim(),
      level: skillLevel,
      description: skill.description?.trim() || "",
      link: skill.link?.trim() || "",
      ...get()._auditAdd()
    };
  }

  // Routines reference skills by templateId
  const skillRef = existingSkill
    ? existingSkill.templateId ?? existingSkill.id
    : createdSkill.templateId;

  if ((routine.skills || []).includes(skillRef)) return;

  set(state => ({
    sportsClasses: state.sportsClasses.map(s =>
      s.id === sportId
        ? {
            ...s,
            categories: s.categories.map(c =>
              c.id !== categoryId
                ? c
                : {
                    ...c,
                    skills: createdSkill ? [...(c.skills || []), createdSkill] : c.skills,
                    routines: c.routines.map(r =>
                      r.id === routineId
                        ? { ...r, skills: [...(r.skills || []), skillRef] }
                        : r
                    )
                  }
            )
          }
        : s
    )
  }));

  get()._persist();

  if (createdSkill && !skill.templateId) {
    fetch(`${API_BASE}/api/submit/skill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skill: createdSkill,
        sportId: sport.templateId ?? sportId,
        categoryId: category.templateId ?? categoryId,
        routineId: routine.templateId ?? routineId,
        submittedBy: user?.email ?? "unknown",
        submittedAt: Date.now(),
        submittedDeviceId: deviceId ?? null
      })
    }).catch(err => console.error("Skill submit failed:", err));
  }
},


// Always saves locally. Submits for approval only when the skill count is
// within rules ({min, max}); defaults to a minimum of 3 when no rules exist.
// Returns { saved, submitted, reason, count, min, max }.
saveRoutine(sportId, categoryId, routineId, rules) {
  const sport = get().sportsClasses.find(s => s.id === sportId);
  const category = sport?.categories.find(c => c.id === categoryId);
  const routine = category?.routines.find(r => r.id === routineId);
  if (!routine) return { saved: false, submitted: false, reason: "not-found" };

  get()._persist();

  const min = Number.isFinite(rules?.min) ? rules.min : 3;
  const max = Number.isFinite(rules?.max) ? rules.max : Infinity;
  const count = (routine.skills || []).length;
  const result = { saved: true, submitted: false, count, min, max };

  if (count < min) return { ...result, reason: "too-few" };
  if (count > max) return { ...result, reason: "too-many" };

  submitRoutineForApproval(get, sport, category, routine);
  return { ...result, submitted: true };
},


  /* ⭐ Delete ONE occurrence of a skill from a routine */
  deleteRoutineSkill(sportId, categoryId, routineId, skillId, index) {
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
                              skills: r.skills.filter((_, i) => i !== index)
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

    get()._persist();
  }

});
