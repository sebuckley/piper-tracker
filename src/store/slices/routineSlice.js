import { nanoid } from "nanoid";

// ---------------------------------------------------------
// ROUTINES SLICE — FULLY NORMALIZED + PERSIST-SAFE
// ---------------------------------------------------------
export const createRoutinesSlice = (set, get) => ({
  // ⭐ Guaranteed shape
  routines: [],

  // ⭐ Normalize a routine object
  _normalizeRoutine(r) {
    return {
      id: r.id ?? nanoid(),
      name: r.name ?? "",
      frequency: r.frequency ?? "",
      completedDates: Array.isArray(r.completedDates)
        ? r.completedDates
        : []
    };
  },

  // ⭐ Add routine (persist-safe)
  addRoutine: (name, frequency) => {
    const childId = get().activeChild;
    if (!childId) return;

    const newRoutine = get()._normalizeRoutine({
      name,
      frequency,
      completedDates: []
    });

    set(state => ({
      ...state,
      routines: [newRoutine, ...state.routines]
    }));

    get().saveToKV(childId);
  },

  // ⭐ Complete routine (persist-safe)
  completeRoutine: (routineId) => {
    const childId = get().activeChild;
    if (!childId) return;

    const now = new Date().toISOString();

    set(state => ({
      ...state,
      routines: state.routines.map(r =>
        r.id === routineId
          ? get()._normalizeRoutine({
              ...r,
              completedDates: [...r.completedDates, now]
            })
          : r
      )
    }));

    get().saveToKV(childId);
  }
});
