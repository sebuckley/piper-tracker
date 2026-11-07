import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../../config/api";

const card = {
  borderRadius: "16px",
  border: "1px solid #e6e6e6",
  backgroundColor: "white"
};
const primaryBtn = {
  backgroundColor: "#b300ff",
  color: "white",
  fontWeight: 600,
  borderRadius: "10px",
  padding: "6px 14px"
};
const dangerBtn = { ...primaryBtn, backgroundColor: "#cc0033" };
const lightBtn = {
  borderRadius: "10px",
  border: "1px solid #dcdcdc",
  fontWeight: 600,
  padding: "6px 14px"
};
const input = { borderRadius: "12px" };

const LABEL_FIELDS = [
  ["routineName", "Routine (singular)"],
  ["routinePlural", "Routine (plural)"],
  ["categoryName", "Category (singular)"],
  ["categoryPlural", "Category (plural)"]
];

function Field({ label, children }) {
  return (
    <div className="mb-2">
      <label className="form-label small mb-1" style={{ fontWeight: 600 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdminTemplateEditor() {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Which category is open, and which skill/routine inside it is being edited
  const [activeCatId, setActiveCatId] = useState(null);
  const [editing, setEditing] = useState(null); // { kind: "skill" | "routine", id }
  const [editingTop, setEditingTop] = useState(null); // "sport" | "level:<id>"
  const [editingCatDetails, setEditingCatDetails] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");
  const [skillLevelFilter, setSkillLevelFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_BASE}/api/templates`);
      const all = await res.json();
      setTemplate(all.find(t => t.id === templateId) ?? null);
    }
    load();
  }, [templateId]);

  if (!template) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Loading template…</div>
      </div>
    );
  }

  const levels = template.levels || [];
  const categories = template.categories || [];
  const labels = template.uiLabels || {};
  const routineWord = labels.routineName || "Routine";
  const routinePlural = labels.routinePlural || "Routines";
  const categoryWord = labels.categoryName || "Category";
  const categoryPlural = labels.categoryPlural || "Categories";

  const activeCat = categories.find(c => c.id === activeCatId) ?? null;

  const updateField = (field, value) =>
    setTemplate(t => ({ ...t, [field]: value }));

  const updateCategory = (catId, changes) =>
    updateField(
      "categories",
      categories.map(c => (c.id === catId ? { ...c, ...changes } : c))
    );

  const updateItem = (list, id, changes) =>
    activeCat &&
    updateCategory(activeCat.id, {
      [list]: activeCat[list].map(x => (x.id === id ? { ...x, ...changes } : x))
    });

  const levelLabel = value =>
    levels.find(l => String(l.value) === String(value))?.label ?? `Level ${value}`;

  /* ------------------------- save / export ------------------------- */
  const saveTemplate = async () => {
    const res = await fetch(`${API_BASE}/api/update/template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(template)
    });

    if (!res.ok) {
      setFeedback("Save failed — check the worker is deployed.");
      return;
    }
    setFeedback("Template updated successfully!");
    setTimeout(() => navigate("/settings/admin/templates"), 1200);
  };

  const exportTemplate = () => {
    const js = `export const ${template.id}Templates = [\n${JSON.stringify(template, null, 2)}\n];\n`;
    navigator.clipboard.writeText(js);
    setFeedback("Template exported and copied to clipboard!");
  };

  /* ------------------------- levels / rules ------------------------- */
  const addLevel = () => {
    const nextValue = Math.max(0, ...levels.map(l => Number(l.value) || 0)) + 1;
    const lvl = {
      id: `${template.id}_level_${nextValue}`,
      value: nextValue,
      label: `Level ${nextValue}`
    };
    updateField("levels", [...levels, lvl]);
    setEditingTop(`level:${lvl.id}`);
  };

  const updateLevel = (idx, changes) =>
    updateField("levels", levels.map((l, i) => (i === idx ? { ...l, ...changes } : l)));

  // Changing a level's value moves its rule with it
  const changeLevelValue = (idx, value) => {
    const old = levels[idx].value;
    const rules = { ...(template.routineRules || {}) };
    if (rules[old] && !rules[value]) {
      rules[value] = rules[old];
      delete rules[old];
    }
    setTemplate(t => ({
      ...t,
      routineRules: rules,
      levels: t.levels.map((l, i) => (i === idx ? { ...l, value } : l))
    }));
  };

  const deleteLevel = idx => {
    const lvl = levels[idx];
    if (!window.confirm(`Remove level "${lvl.label}"?`)) return;
    clearSportRule(lvl.value, { levels: levels.filter((_, i) => i !== idx) });
    if (editingTop === `level:${lvl.id}`) setEditingTop(null);
  };

  const setSportRule = (value, field, raw) => {
    const rules = template.routineRules || {};
    const current = rules[value] ?? { min: 3, max: 5 };
    updateField("routineRules", {
      ...rules,
      [value]: { ...current, [field]: Math.max(0, parseInt(raw) || 0) }
    });
  };

  const clearSportRule = (value, extra = {}) => {
    setTemplate(t => {
      const rules = { ...(t.routineRules || {}) };
      delete rules[value];
      return { ...t, ...extra, routineRules: rules };
    });
  };

  /* ------------------------- categories ------------------------- */
  const addCategory = () => {
    const cat = {
      id: crypto.randomUUID(),
      name: `New ${categoryWord}`,
      description: "",
      skills: [],
      routines: []
    };
    updateField("categories", [...categories, cat]);
    setActiveCatId(cat.id);
    setEditing(null);
    setEditingCatDetails(true);
  };

  const deleteCategory = catId => {
    if (!window.confirm("Remove this category and all of its skills and routines?")) return;
    updateField("categories", categories.filter(c => c.id !== catId));
    if (activeCatId === catId) {
      setActiveCatId(null);
      setEditing(null);
    }
  };

  /* ------------------------- skills ------------------------- */
  const addSkill = () => {
    const skill = {
      id: crypto.randomUUID(),
      name: "New Skill",
      level: levels[0]?.value ?? 1,
      description: "",
      link: ""
    };
    updateCategory(activeCat.id, { skills: [...activeCat.skills, skill] });
    setEditing({ kind: "skill", id: skill.id });
  };

  const deleteSkill = skill => {
    if (!window.confirm(`Remove skill "${skill.name}"? It will also be taken out of any ${routinePlural.toLowerCase()}.`)) return;
    updateCategory(activeCat.id, {
      skills: activeCat.skills.filter(s => s.id !== skill.id),
      routines: activeCat.routines.map(r => ({
        ...r,
        skills: (r.skills || []).filter(ref => ref !== skill.id && ref !== skill.name)
      }))
    });
    if (editing?.id === skill.id) setEditing(null);
  };

  /* ------------------------- routines ------------------------- */
  const addRoutine = () => {
    const routine = {
      id: crypto.randomUUID(),
      name: `New ${routineWord}`,
      level: levels[0]?.value ?? 1,
      description: "",
      link: "",
      skills: []
    };
    updateCategory(activeCat.id, { routines: [...activeCat.routines, routine] });
    setEditing({ kind: "routine", id: routine.id });
  };

  const deleteRoutine = routine => {
    if (!window.confirm(`Remove ${routineWord.toLowerCase()} "${routine.name}"?`)) return;
    updateCategory(activeCat.id, {
      routines: activeCat.routines.filter(r => r.id !== routine.id)
    });
    if (editing?.id === routine.id) setEditing(null);
  };

  const toggleRoutineSkill = (routine, skill) => {
    const refs = routine.skills || [];
    const has = refs.includes(skill.id) || refs.includes(skill.name);
    updateItem("routines", routine.id, {
      skills: has
        ? refs.filter(r => r !== skill.id && r !== skill.name)
        : [...refs, skill.id]
    });
  };

  /* ------------------------- renderers ------------------------- */
  const levelSelect = (value, onChange) => (
    <select
      className="form-select"
      style={input}
      value={value}
      onChange={e => onChange(parseInt(e.target.value))}
    >
      {levels.map(l => (
        <option key={l.id} value={l.value}>
          {l.label}
        </option>
      ))}
    </select>
  );

  const renderSkillEditor = skill => (
    <div className="p-3 mb-3" style={{ ...card, borderColor: "#b300ff" }}>
      <Field label="Name">
        <input
          className="form-control"
          style={input}
          value={skill.name}
          onChange={e => updateItem("skills", skill.id, { name: e.target.value })}
        />
      </Field>
      <Field label="Level">
        {levelSelect(skill.level, v => updateItem("skills", skill.id, { level: v }))}
      </Field>
      <Field label="Description">
        <textarea
          rows={2}
          className="form-control"
          style={input}
          value={skill.description || ""}
          onChange={e => updateItem("skills", skill.id, { description: e.target.value })}
        />
      </Field>
      <Field label="Demonstration link">
        <input
          className="form-control"
          style={input}
          value={skill.link || ""}
          onChange={e => updateItem("skills", skill.id, { link: e.target.value })}
        />
      </Field>
      <div className="text-muted small mb-2">ID: {skill.id}</div>
      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-sm" style={dangerBtn} onClick={() => deleteSkill(skill)}>
          Remove
        </button>
        <button className="btn btn-sm" style={primaryBtn} onClick={() => setEditing(null)}>
          Done
        </button>
      </div>
    </div>
  );

  const renderRoutineEditor = routine => {
    const refs = routine.skills || [];
    const available = [...activeCat.skills].sort(
      (a, b) => a.level - b.level || a.name.localeCompare(b.name)
    );
    const inRoutine = available.filter(
      s => refs.includes(s.id) || refs.includes(s.name)
    ).length;

    return (
      <div className="p-3 mb-3" style={{ ...card, borderColor: "#b300ff" }}>
        <Field label="Name">
          <input
            className="form-control"
            style={input}
            value={routine.name}
            onChange={e => updateItem("routines", routine.id, { name: e.target.value })}
          />
        </Field>
        <Field label="Level">
          {levelSelect(routine.level, v => updateItem("routines", routine.id, { level: v }))}
        </Field>
        <Field label="Description">
          <textarea
            rows={2}
            className="form-control"
            style={input}
            value={routine.description || ""}
            onChange={e => updateItem("routines", routine.id, { description: e.target.value })}
          />
        </Field>
        <Field label="Video link">
          <input
            className="form-control"
            style={input}
            value={routine.link || ""}
            onChange={e => updateItem("routines", routine.id, { link: e.target.value })}
          />
        </Field>

        <Field label={`Skills in this ${routineWord.toLowerCase()} (${inRoutine} selected)`}>
          <div style={{ maxHeight: 220, overflowY: "auto" }} className="border rounded p-2">
            {available.length === 0 && (
              <div className="text-muted small">Add skills to this {categoryWord.toLowerCase()} first.</div>
            )}
            {available.map(s => (
              <div className="form-check" key={s.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`rt-${routine.id}-${s.id}`}
                  checked={refs.includes(s.id) || refs.includes(s.name)}
                  onChange={() => toggleRoutineSkill(routine, s)}
                />
                <label className="form-check-label" htmlFor={`rt-${routine.id}-${s.id}`}>
                  {s.name} <span className="text-muted small">({levelLabel(s.level)})</span>
                </label>
              </div>
            ))}
          </div>
        </Field>

        <div className="text-muted small mb-2">ID: {routine.id}</div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-sm" style={dangerBtn} onClick={() => deleteRoutine(routine)}>
            Remove
          </button>
          <button className="btn btn-sm" style={primaryBtn} onClick={() => setEditing(null)}>
            Done
          </button>
        </div>
      </div>
    );
  };

  const renderCategoryPanel = () => {
    const term = skillSearch.trim().toLowerCase();
    const visibleSkills = activeCat.skills
      .filter(s => s.name.toLowerCase().includes(term))
      .filter(s => skillLevelFilter === "all" || String(s.level) === skillLevelFilter)
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

    const rules = activeCat.routineRules || {};
    const flat = Number.isFinite(rules.min) || Number.isFinite(rules.max);

    return (
      <div className="p-3 mb-4" style={{ ...card, borderColor: "#b300ff" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="h5 m-0" style={{ color: "#b300ff", fontWeight: 700 }}>
            Editing {categoryWord}: {activeCat.name}
          </h4>
          <button
            className="btn btn-light btn-sm"
            style={lightBtn}
            onClick={() => {
              setActiveCatId(null);
              setEditing(null);
              setEditingCatDetails(false);
            }}
          >
            Close
          </button>
        </div>

        {editingCatDetails ? (
          <div className="p-3 mb-3" style={{ ...card, borderColor: "#b300ff" }}>
            <Field label="Name">
              <input
                className="form-control"
                style={input}
                value={activeCat.name}
                onChange={e => updateCategory(activeCat.id, { name: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={2}
                className="form-control"
                style={input}
                value={activeCat.description || ""}
                onChange={e => updateCategory(activeCat.id, { description: e.target.value })}
              />
            </Field>

            <div className="row g-2">
              <div className="col-6">
                <Field label={`Min skills per ${routineWord.toLowerCase()} (overrides sport rules)`}>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    style={input}
                    value={flat ? rules.min ?? "" : ""}
                    placeholder="Use sport rules"
                    onChange={e =>
                      updateCategory(activeCat.id, {
                        routineRules: { ...(flat ? rules : {}), min: parseInt(e.target.value) || 0 }
                      })
                    }
                  />
                </Field>
              </div>
              <div className="col-6">
                <Field label="Max skills">
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    style={input}
                    value={flat ? rules.max ?? "" : ""}
                    placeholder="Use sport rules"
                    onChange={e =>
                      updateCategory(activeCat.id, {
                        routineRules: { ...(flat ? rules : {}), max: parseInt(e.target.value) || 0 }
                      })
                    }
                  />
                </Field>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              {activeCat.routineRules && (
                <button
                  className="btn btn-light btn-sm"
                  style={lightBtn}
                  onClick={() => updateCategory(activeCat.id, { routineRules: undefined })}
                >
                  Clear rule
                </button>
              )}
              <button className="btn btn-sm" style={primaryBtn} onClick={() => setEditingCatDetails(false)}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <div
            className="p-3 mb-3 d-flex justify-content-between align-items-start"
            style={card}
          >
            <div style={{ textAlign: "left" }}>
              <strong style={{ color: "#b300ff" }}>{activeCat.name}</strong>
              {activeCat.description && <div className="small mt-1">{activeCat.description}</div>}
              <div className="text-muted small mt-1">
                {flat
                  ? `Rule: ${rules.min ?? "–"}–${rules.max ?? "–"} skills per ${routineWord.toLowerCase()}`
                  : "Uses sport rules"}
              </div>
            </div>
            <button className="btn btn-light btn-sm" style={lightBtn} onClick={() => setEditingCatDetails(true)}>
              Edit
            </button>
          </div>
        )}

        {/* Skills */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
          <h5 className="m-0" style={{ color: "#1f2a44", fontWeight: 600 }}>
            Skills ({activeCat.skills.length})
          </h5>
          <button className="btn btn-sm" style={primaryBtn} onClick={addSkill}>
            + Add Skill
          </button>
        </div>

        <div className="d-flex gap-2 mb-2">
          <input
            className="form-control"
            style={input}
            placeholder="Search skills…"
            value={skillSearch}
            onChange={e => setSkillSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ ...input, maxWidth: 160 }}
            value={skillLevelFilter}
            onChange={e => setSkillLevelFilter(e.target.value)}
          >
            <option value="all">All levels</option>
            {levels.map(l => (
              <option key={l.id} value={String(l.value)}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {visibleSkills.length === 0 && (
          <div className="text-muted small mb-2">No skills found.</div>
        )}
        {visibleSkills.map(skill =>
          editing?.kind === "skill" && editing.id === skill.id ? (
            <div key={skill.id}>{renderSkillEditor(skill)}</div>
          ) : (
            <div
              key={skill.id}
              className="p-2 mb-2 d-flex justify-content-between align-items-center"
              style={{ ...card, borderRadius: "10px" }}
            >
              <div>
                <strong>{skill.name}</strong>
                <div className="text-muted small">{levelLabel(skill.level)}</div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light btn-sm"
                  style={lightBtn}
                  onClick={() => setEditing({ kind: "skill", id: skill.id })}
                >
                  Edit
                </button>
                <button className="btn btn-sm" style={dangerBtn} onClick={() => deleteSkill(skill)}>
                  ✕
                </button>
              </div>
            </div>
          )
        )}

        {/* Routines */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
          <h5 className="m-0" style={{ color: "#1f2a44", fontWeight: 600 }}>
            {routinePlural} ({activeCat.routines.length})
          </h5>
          <button className="btn btn-sm" style={primaryBtn} onClick={addRoutine}>
            + Add {routineWord}
          </button>
        </div>

        {activeCat.routines.length === 0 && (
          <div className="text-muted small mb-2">No {routinePlural.toLowerCase()} yet.</div>
        )}
        {activeCat.routines.map(routine =>
          editing?.kind === "routine" && editing.id === routine.id ? (
            <div key={routine.id}>{renderRoutineEditor(routine)}</div>
          ) : (
            <div
              key={routine.id}
              className="p-2 mb-2 d-flex justify-content-between align-items-center"
              style={{ ...card, borderRadius: "10px" }}
            >
              <div>
                <strong>{routine.name}</strong>
                <div className="text-muted small">
                  {levelLabel(routine.level)} · {(routine.skills || []).length} skill(s)
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light btn-sm"
                  style={lightBtn}
                  onClick={() => setEditing({ kind: "routine", id: routine.id })}
                >
                  Edit
                </button>
                <button className="btn btn-sm" style={dangerBtn} onClick={() => deleteRoutine(routine)}>
                  ✕
                </button>
              </div>
            </div>
          )
        )}
      </div>
    );
  };

  /* ------------------------- page ------------------------- */
  return (
    <div
      className="container mt-4"
      style={{ maxWidth: "1200px", ...card, padding: "24px" }}
    >
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link to="/settings/" style={{ color: "#b300ff", textDecoration: "none" }}>
            Settings
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <Link to="/settings/admin" style={{ color: "#b300ff", textDecoration: "none" }}>
            Admin
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <Link to="/settings/admin/templates" style={{ color: "#b300ff", textDecoration: "none" }}>
            Global Templates
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <span style={{ color: "#1f2a44" }}>{template.name}</span>
        </nav>
      </div>

      <h2 className="h3 mt-3 mb-4 text-center" style={{ color: "#b300ff", fontWeight: 700 }}>
        Edit Template: {template.name}
      </h2>

      {/* Sport details + labels (summary, edit on demand) */}
      <h3 className="h4 mb-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Sport
      </h3>

      {editingTop === "sport" ? (
        <div className="p-3 mb-4" style={{ ...card, borderColor: "#b300ff" }}>
          <Field label="Name">
            <input
              className="form-control"
              style={input}
              value={template.name}
              onChange={e => updateField("name", e.target.value)}
            />
          </Field>

          <div className="fw-semibold mt-3 mb-1">Labels</div>
          <div className="row g-2">
            {LABEL_FIELDS.map(([key, label]) => (
              <div className="col-6" key={key}>
                <Field label={label}>
                  <input
                    className="form-control"
                    style={input}
                    value={labels[key] ?? ""}
                    onChange={e => updateField("uiLabels", { ...labels, [key]: e.target.value })}
                  />
                </Field>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-end mt-2">
            <button className="btn btn-sm" style={primaryBtn} onClick={() => setEditingTop(null)}>
              Done
            </button>
          </div>
        </div>
      ) : (
        <div
          className="p-3 mb-4 d-flex justify-content-between align-items-start"
          style={card}
        >
          <div style={{ textAlign: "left" }}>
            <strong style={{ color: "#b300ff", fontSize: "16px" }}>{template.name}</strong>
            <div className="small mt-1">
              <span className="text-muted">Labels: </span>
              {routineWord} / {routinePlural} · {categoryWord} / {categoryPlural}
            </div>
          </div>
          <button className="btn btn-light btn-sm" style={lightBtn} onClick={() => setEditingTop("sport")}>
            Edit
          </button>
        </div>
      )}

      {/* Levels + rules (summary, edit on demand) */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="h4 m-0" style={{ color: "#1f2a44", fontWeight: 600 }}>
          Levels &amp; {routineWord} Rules
        </h3>
        <button className="btn btn-sm" style={primaryBtn} onClick={addLevel}>
          + Add Level
        </button>
      </div>
      <p className="text-muted small">
        Min / max skills a {routineWord.toLowerCase()} needs at each level before it can be submitted for review.
      </p>

      {levels.map((lvl, idx) => {
        const rule = template.routineRules?.[lvl.value];
        const isEditing = editingTop === `level:${lvl.id}`;

        if (!isEditing) {
          return (
            <div
              key={lvl.id}
              className="p-3 mb-2 d-flex justify-content-between align-items-center"
              style={card}
            >
              <div style={{ textAlign: "left" }}>
                <strong style={{ color: "#b300ff" }}>{lvl.label}</strong>
                <div className="text-muted small">
                  Level {lvl.value} ·{" "}
                  {rule
                    ? `${rule.min}–${rule.max} skills per ${routineWord.toLowerCase()}`
                    : "No rule (default: min 3)"}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light btn-sm"
                  style={lightBtn}
                  onClick={() => setEditingTop(`level:${lvl.id}`)}
                >
                  Edit
                </button>
                <button className="btn btn-sm" style={dangerBtn} onClick={() => deleteLevel(idx)}>
                  Remove
                </button>
              </div>
            </div>
          );
        }

        return (
          <div key={lvl.id} className="p-3 mb-2" style={{ ...card, borderColor: "#b300ff" }}>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <Field label="Label">
                  <input
                    className="form-control"
                    style={input}
                    value={lvl.label}
                    onChange={e => updateLevel(idx, { label: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-12 col-md-6">
                <Field label="Value">
                  <input
                    type="number"
                    className="form-control"
                    style={input}
                    value={lvl.value}
                    onChange={e => changeLevelValue(idx, parseInt(e.target.value) || 0)}
                  />
                </Field>
              </div>
              <div className="col-6">
                <Field label={`Min skills per ${routineWord.toLowerCase()}`}>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    style={input}
                    placeholder="No rule"
                    value={rule?.min ?? ""}
                    onChange={e => setSportRule(lvl.value, "min", e.target.value)}
                  />
                </Field>
              </div>
              <div className="col-6">
                <Field label="Max skills">
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    style={input}
                    placeholder="No rule"
                    value={rule?.max ?? ""}
                    onChange={e => setSportRule(lvl.value, "max", e.target.value)}
                  />
                </Field>
              </div>
            </div>
            <div className="text-muted small mb-2">ID: {lvl.id}</div>
            <div className="d-flex justify-content-end gap-2">
              {rule && (
                <button className="btn btn-light btn-sm" style={lightBtn} onClick={() => clearSportRule(lvl.value)}>
                  Clear rule
                </button>
              )}
              <button className="btn btn-sm" style={primaryBtn} onClick={() => setEditingTop(null)}>
                Done
              </button>
            </div>
          </div>
        );
      })}

      {/* Categories */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h3 className="h4 m-0" style={{ color: "#1f2a44", fontWeight: 600 }}>
          {categoryPlural}
        </h3>
        <button className="btn btn-sm" style={primaryBtn} onClick={addCategory}>
          + Add {categoryWord}
        </button>
      </div>

      {activeCat && renderCategoryPanel()}

      {categories
        .filter(c => c.id !== activeCatId)
        .map(cat => (
          <div
            key={cat.id}
            className="p-3 mb-2 d-flex justify-content-between align-items-center"
            style={card}
          >
            <div style={{ textAlign: "left" }}>
              <strong style={{ color: "#b300ff" }}>{cat.name}</strong>
              <div className="text-muted small">
                {(cat.skills || []).length} skills · {(cat.routines || []).length}{" "}
                {routinePlural.toLowerCase()}
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-light btn-sm"
                style={lightBtn}
                onClick={() => {
                  setActiveCatId(cat.id);
                  setEditing(null);
                  setEditingCatDetails(false);
                  setSkillSearch("");
                  setSkillLevelFilter("all");
                }}
              >
                Edit
              </button>
              <button className="btn btn-sm" style={dangerBtn} onClick={() => deleteCategory(cat.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}

      {/* Save + Export */}
      <div className="d-flex justify-content-center align-items-center mt-4" style={{ gap: "12px" }}>
        <button
          className="btn"
          style={{ ...primaryBtn, borderRadius: "12px", padding: "10px 20px" }}
          onClick={saveTemplate}
        >
          Save Template
        </button>
        <button
          className="btn"
          style={{ ...primaryBtn, backgroundColor: "#1f2a44", borderRadius: "12px", padding: "10px 20px" }}
          onClick={exportTemplate}
        >
          Export Template
        </button>
      </div>

      {feedback && (
        <div className="p-3 mt-3" style={{ ...card, color: "#1f2a44", fontWeight: 600 }}>
          {feedback}
        </div>
      )}
    </div>
  );
}
