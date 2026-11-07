import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { nanoid } from "nanoid";
import SearchList from "../../components/reusable/SearchList";
import SkillsBrowser from "./skills/SkillsBrowser";
import { DEFAULT_UI_LABELS } from "../../store/slices/sportsSlice";


export default function AddSports() {
  const { addSportFromTemplate, addCustomSport } = useAppStore();
  const navigate = useNavigate();
  const defaultSports = useAppStore(s => s.defaultSports);

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [feedback, setFeedback] = useState("");

  // ⭐ Builder state
  const [levels, setLevels] = useState([
    { id: nanoid(), value: 1, label: "Beginner" },
    { id: nanoid(), value: 2, label: "Intermediate" },
    { id: nanoid(), value: 3, label: "Advanced" }
  ]);

  const [categories, setCategories] = useState([
    { id: nanoid(), name: "General", skills: [], routines: [] }
  ]);

  // ⭐ Labels + routine rules (defaults for every input)
  const [uiLabels, setUiLabels] = useState({ ...DEFAULT_UI_LABELS });
  const [newLabelFields, setNewLabelFields] = useState({}); // key -> true when typing a new value

  // Existing label sets from templates (swimming nests sets by context)
  const labelSets = useMemo(() => {
    const sets = [];
    defaultSports.forEach(s => {
      const l = s.uiLabels;
      if (!l) return;
      if (l.routineName || l.categoryName) sets.push(l);
      else Object.values(l).forEach(v => v && typeof v === "object" && sets.push(v));
    });
    sets.push(DEFAULT_UI_LABELS);
    return sets;
  }, [defaultSports]);

  const labelOptions = useMemo(() => {
    const opts = {};
    Object.keys(DEFAULT_UI_LABELS).forEach(key => {
      opts[key] = [...new Set(labelSets.map(l => l[key]).filter(Boolean))].sort();
    });
    return opts;
  }, [labelSets]);

  const handleLabelSelect = (key, value) => {
    if (value === "__new__") {
      setNewLabelFields(prev => ({ ...prev, [key]: true }));
      setUiLabels(prev => ({ ...prev, [key]: "" }));
      return;
    }
    setNewLabelFields(prev => ({ ...prev, [key]: false }));
    setUiLabels(prev => {
      const next = { ...prev, [key]: value };
      // Auto-fill the matching plural/singular from the same existing set
      const pairKey = {
        routineName: "routinePlural",
        categoryName: "categoryPlural"
      }[key];
      const set = pairKey && labelSets.find(l => l[key] === value);
      if (set && !newLabelFields[pairKey]) next[pairKey] = set[pairKey];
      return next;
    });
  };
  const [rules, setRules] = useState({}); // keyed by level id

  const getRule = lvl => rules[lvl.id] ?? { min: 3, max: 5 };
  const setRule = (lvl, field, raw) => {
    const value = raw === "" ? "" : Math.max(0, parseInt(raw) || 0);
    setRules(prev => ({ ...prev, [lvl.id]: { ...getRule(lvl), [field]: value } }));
  };

  const [levelSearch, setLevelSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // ⭐ Build reusable pools from defaultSports (safe + normalised)
const allLevels = useMemo(() => {
  return defaultSports.flatMap(s =>
    (s.levels || []).map(l => ({
      id: l.id || nanoid(),
      value: l.value ?? 1,
      label: l.label || "",
      sourceSport: s.name || "Unknown"
    }))
  );
}, [defaultSports]);

const allCategories = useMemo(() => {
  return defaultSports.flatMap(s =>
    (s.categories || []).map(c => ({
      id: c.id || nanoid(),
      name: c.name || "",
      description: c.description || "",
      skills: Array.isArray(c.skills) ? c.skills : [],
      routines: Array.isArray(c.routines) ? c.routines : [],
      sourceSport: s.name || "Unknown"
    }))
  );
}, [defaultSports]);

const allSkills = useMemo(() => {
  return defaultSports.flatMap(s =>
    (s.categories || []).flatMap(c =>
      (c.skills || []).map(sk => ({
        id: sk.id || nanoid(),
        name: sk.name || "",
        level: sk.level ?? 1,
        description: sk.description || "",
        link: sk.link || "",
        sourceSport: s.name || "Unknown",
        categoryName: c.name || "Unknown"
      }))
    )
  );
}, [defaultSports]);

  const filteredTemplates = defaultSports.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const shouldShowCustomForm =
    search.trim().length > 0 && filteredTemplates.length === 0;

  const handleAddTemplate = templateId => {
    const template = defaultSports.find(t => t.id === templateId);
    addSportFromTemplate(templateId);

    setFeedback(`"${template.name}" added — returning to Sports & Activities…`);
    setTimeout(() => navigate("/sports"), 1200);
  };

  const importLevelsFromSport = sportId => {
    const sport = defaultSports.find(s => s.id === sportId);
    if (!sport?.levels) return;

    setLevels(
      sport.levels.map((l, idx) => ({
        id: nanoid(),
        value: idx + 1,
        label: l.label
      }))
    );
  };

  const importCategoriesFromSport = sportId => {
    const sport = defaultSports.find(s => s.id === sportId);
    if (!sport?.categories) return;

    setCategories(
      sport.categories.map(c => ({
        id: nanoid(),
        name: c.name,
        skills: [],
        routines: []
      }))
    );
  };

  const handleSaveCustomSport = () => {
    console.log("Saving custom sport...");
    console.log("Custom name:", customName);
    if (!customName.trim()) return;

    const routineRules = {};
    levels.forEach(l => {
      const r = getRule(l);
      const min = parseInt(r.min) || 3;
      const max = Math.max(min, parseInt(r.max) || min);
      routineRules[l.value] = { min, max };
    });

    const cleanLabels = Object.fromEntries(
      Object.entries(DEFAULT_UI_LABELS).map(([k, v]) => [k, uiLabels[k]?.trim() || v])
    );

    const newSport = {
      id: customName.toLowerCase().replace(/\s+/g, "_"),
      name: customName.trim(),
      levels,
      uiLabels: cleanLabels,
      routineRules,
      categories: categories.map(c => ({
        ...c,
        routines: [] // ⭐ always included
      }))
    };

    console.log("New sport object:", newSport);
    console.log("Adding custom sport...");
    addCustomSport(newSport);

    setFeedback(`Sport "${customName}" added — returning to Sports & Activities…`);
    setTimeout(() => navigate("/sports"), 1200);
  };

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb */}
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link to="/sports" style={{ color: "#b300ff", textDecoration: "none" }}>
            Sports & Activities
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <span style={{ color: "#1f2a44" }}>Add Sport</span>
        </nav>
      </div>

      {/* ⭐ Page Title */}
      <h2
        className="h3 mt-3 mb-4"
        style={{ color: "#b300ff", fontWeight: 700 }}
      >
        Add a Sport
      </h2>

      {/* ⭐ Section Header */}
      <h3 className="h4" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Choose a Sport Template
      </h3>

      {!shouldShowCustomForm && (
        <div className="d-flex justify-content-end align-items-center mb-3">
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px"
            }}
            onClick={() => {
              setShowAddForm(true);
              setCustomName("");
            }}
          >
            + Create Custom Sport
          </button>
        </div>
      )}

      {/* ⭐ Search */}
      <input
        className="form-control mb-3"
        placeholder="Search sports..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          console.log("Search input changed:", e.target.value);
          console.log("Show add form:", showAddForm);
          if (shouldShowCustomForm) {
            setCustomName(e.target.value);
          }
        }}
        style={{ borderRadius: "12px" }}
      />

      {/* ⭐ Template List */}
      {!shouldShowCustomForm && (
        <div className="mb-4">
          {filteredTemplates.map(s => (
            <div
              key={s.id}
              className="p-3 mb-3"
              style={{
                borderRadius: "16px",
                border: "1px solid #e6e6e6",
                backgroundColor: "#ffffff"
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <strong style={{ color: "#b300ff", fontSize: "16px" }}>
                  {s.name}
                </strong>

                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #dcdcdc",
                    borderRadius: "10px",
                    fontWeight: 600
                  }}
                  onClick={() => handleAddTemplate(s.id)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⭐ Custom Sport Builder */}
      {(showAddForm || shouldShowCustomForm) && (
        <div
          className="p-3 mb-4"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          {/* ⭐ Sport Name */}
          <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
            Sport Name
          </label>

          <input
            className="form-control mb-3"
            placeholder="Enter sport name"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          {/* ⭐ Preview */}
          <div
            className="p-3 mb-4"
            style={{
              borderRadius: "16px",
              border: "1px solid #e6e6e6",
              backgroundColor: "#fafafa"
            }}
          >
            <strong style={{ color: "#b300ff" }}>Preview:</strong>
            <div className="mt-2">
              <div><strong>Name:</strong> {customName || "Untitled Sport"}</div>
              <div><strong>Levels:</strong> {levels.map(l => l.label).join(", ")}</div>
              <div><strong>{uiLabels.categoryPlural?.trim() || DEFAULT_UI_LABELS.categoryPlural}:</strong> {categories.map(c => c.name).join(", ")}</div>
            </div>
          </div>

          {/* ⭐ Levels */}
          <h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>
            Levels
          </h3>
          <p className="text-muted small mb-3">
            Levels are the stages a child progresses through (e.g. belts or grades).
            Use <strong>Import levels from…</strong> to replace the list below with the
            levels from an existing sport. Use the search to find a single level used by
            other sports and add it to your list, or edit the names directly.
          </p>

          {/* Import from sport */}
          <select
            className="form-select mb-3"
            style={{ borderRadius: "12px" }}
            onChange={e => importLevelsFromSport(e.target.value)}
          >
            <option value="">Import levels from…</option>
            {defaultSports.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <SearchList
            items={allLevels}
            search={levelSearch}
            onSearch={setLevelSearch}
            labelKey="label"
            sourceKey="sourceSport"
            onAdd={item =>
              setLevels([
                ...levels,
                { id: nanoid(), value: levels.length + 1, label: item.label }
              ])
            }
          />

          {/* Render levels */}
          {levels.map((lvl, idx) => (
            <div
              key={lvl.id}
              className="p-3 mb-3"
              style={{
                borderRadius: "16px",
                border: "1px solid #e6e6e6",
                backgroundColor: "white"
              }}
            >
              <input
                className="form-control mb-2"
                style={{ borderRadius: "12px" }}
                value={lvl.label}
                onChange={e => {
                  const updated = [...levels];
                  updated[idx].label = e.target.value;
                  setLevels(updated);
                }}
              />

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small mb-0">
                    Min {uiLabels.routineName?.trim() || DEFAULT_UI_LABELS.routineName} skills
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    style={{ borderRadius: "12px" }}
                    value={getRule(lvl).min}
                    onChange={e => setRule(lvl, "min", e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small mb-0">Max skills</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    style={{ borderRadius: "12px" }}
                    value={getRule(lvl).max}
                    onChange={e => setRule(lvl, "max", e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#cc0033",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "6px 14px"
                  }}
                  onClick={() => {
                    const updated = [...levels];
                    updated.splice(idx, 1);
                    setLevels(updated);
                  }}
                >
                  Delete Level
                </button>
              </div>
            </div>
          ))}

          {/* ⭐ Labels */}
          <h3 className="h4 mb-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
            Labels
          </h3>
          <div className="row g-2 mb-4">
            {[
              ["routineName", "Routine (singular)"],
              ["routinePlural", "Routine (plural)"],
              ["categoryName", "Category (singular)"],
              ["categoryPlural", "Category (plural)"]
            ].map(([key, label]) => (
              <div className="col-6" key={key}>
                <label className="form-label small">{label}</label>
                <select
                  className="form-select"
                  style={{ borderRadius: "12px" }}
                  value={newLabelFields[key] ? "__new__" : uiLabels[key]}
                  onChange={e => handleLabelSelect(key, e.target.value)}
                >
                  {[...new Set([...labelOptions[key], uiLabels[key]].filter(Boolean))].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                  <option value="__new__">+ Add new…</option>
                </select>
                {newLabelFields[key] && (
                  <input
                    className="form-control mt-2"
                    style={{ borderRadius: "12px" }}
                    autoFocus
                    value={uiLabels[key]}
                    placeholder={`New ${label.toLowerCase()}`}
                    onChange={e => setUiLabels({ ...uiLabels, [key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ⭐ Categories */}
          <h3 className="h4 mb-2 mt-4" style={{ color: "#1f2a44", fontWeight: 600 }}>
            {uiLabels.categoryPlural?.trim() || DEFAULT_UI_LABELS.categoryPlural}
          </h3>
          <p className="text-muted small mb-3">
            Groups your {(uiLabels.routineName?.trim() || DEFAULT_UI_LABELS.routineName).toLowerCase()}s
            and skills together. Use <strong>Import {(uiLabels.categoryPlural?.trim() || DEFAULT_UI_LABELS.categoryPlural).toLowerCase()} from…</strong>{" "}
            to replace the list below with the names from an existing sport (skills are not copied).
            Use the search to find a {(uiLabels.categoryName?.trim() || DEFAULT_UI_LABELS.categoryName).toLowerCase()} used by
            other sports and add it, or type a new name to create your own.
          </p>

          {/* Import from sport */}
          <select
            className="form-select mb-3"
            style={{ borderRadius: "12px" }}
            onChange={e => importCategoriesFromSport(e.target.value)}
          >
            <option value="">
              Import {(uiLabels.categoryPlural?.trim() || DEFAULT_UI_LABELS.categoryPlural).toLowerCase()} from…
            </option>
            {defaultSports.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

<SearchList
  items={allCategories}
  search={categorySearch}
  onSearch={setCategorySearch}
  labelKey="name"
  sourceKey="sourceSport"
  onAdd={item =>
    setCategories([
      ...categories,
      {
        id: nanoid(),
        name: item.name,
        skills: [],
        routines: []
      }
    ])
  }
/>


          {/* Add new category */}
          {categorySearch.trim() !== "" &&
            !allCategories.some(c => c.name.toLowerCase() === categorySearch.toLowerCase()) && (
              <button
                className="btn btn-sm mb-3"
                style={{
                  backgroundColor: "#b300ff",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: "10px",
                  padding: "6px 14px"
                }}
                onClick={() =>
                  setCategories([
                    ...categories,
                    {
                      id: nanoid(),
                      name: categorySearch.trim(),
                      skills: [],
                      routines: []
                    }
                  ])
                }
              >
                + Add "{categorySearch}" as new {(uiLabels.categoryName?.trim() || DEFAULT_UI_LABELS.categoryName).toLowerCase()}
              </button>
            )}

          {/* Render categories */}
          {categories.map((cat, catIdx) => (
            <div
              key={cat.id}
              className="p-3 mb-4"
              style={{
                borderRadius: "16px",
                border: "1px solid #e6e6e6",
                backgroundColor: "white"
              }}
            >
              {/* Category Name */}
              <input
                className="form-control mb-3"
                style={{ borderRadius: "12px" }}
                value={cat.name}
                onChange={e => {
                  const updated = [...categories];
                  updated[catIdx].name = e.target.value;
                  setCategories(updated);
                }}
              />

              <SkillsBrowser
                title="Skills (optional)"
                skills={cat.skills}
                levels={levels}
                suggestions={allSkills}
                pageSize={5}
                onAddSuggestion={item => {
                  const updated = [...categories];
                  updated[catIdx] = {
                    ...cat,
                    skills: [
                      ...cat.skills,
                      {
                        id: nanoid(),
                        name: item.name,
                        level: item.level || 1,
                        description: item.description || "",
                        link: item.link || ""
                      }
                    ]
                  };
                  setCategories(updated);
                }}
                onAddSkill={payload => {
                  const updated = [...categories];
                  updated[catIdx] = {
                    ...cat,
                    skills: [
                      ...cat.skills,
                      { id: nanoid(), ...payload, level: parseInt(payload.level) || 1 }
                    ]
                  };
                  setCategories(updated);
                }}
                onRemove={skill => {
                  const updated = [...categories];
                  updated[catIdx] = {
                    ...cat,
                    skills: cat.skills.filter(s => s.id !== skill.id)
                  };
                  setCategories(updated);
                }}
              />
            </div>
          ))}

          {/* ⭐ Save Button */}
          <div
            className="d-flex justify-content-end align-items-center mt-4"
            style={{ gap: "12px" }}
          >
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px",
                padding: "10px 20px"
              }}
              onClick={handleSaveCustomSport}
            >
              Save Sport
            </button>
          </div>
        </div>
      )}

      {/* ⭐ Feedback */}
      {feedback && (
        <div
          className="p-3 mt-3"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff",
            color: "#1f2a44",
            fontWeight: 600
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
