export const createGlobalTemplatesSlice = (set, get) => ({
  templates: [],
  clubs: [],

  async loadTemplates() {
    const res = await fetch("/api/templates");
    const data = await res.json();
    set({ templates: data });
  },

  async loadClubs() {
    const res = await fetch("/api/clubs");
    const data = await res.json();
    set({ clubs: data });
  },

  /* ⭐ Search skills globally */
  searchSkills(query) {
    const allSkills = [];

    get().templates.forEach(t => {
      t.categories.forEach(c => {
        c.skills.forEach(sk => {
          allSkills.push({
            ...sk,
            templateId: t.id,
            categoryId: c.id
          });
        });
      });
    });

    return allSkills.filter(sk =>
      sk.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  /* ⭐ Search routines globally */
  searchRoutines(query) {
    const allRoutines = [];

    get().templates.forEach(t => {
      t.categories.forEach(c => {
        c.routines.forEach(r => {
          allRoutines.push({
            ...r,
            templateId: t.id,
            categoryId: c.id
          });
        });
      });
    });

    return allRoutines.filter(r =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );
  }
});
