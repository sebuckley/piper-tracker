import { useState } from "react";
import AddSkillsForm from "./AddSkillsForm";

// Shared skills UI (search, level filter, add form when nothing matches, list, show more).
// Used by SkillsSection (store-backed) and AddSport (local builder state).
//
// skills:        [{ id, name, level, description?, link? }]
// levels:        [{ value, label }]
// onRemove:      (skill) => void
// onAddSkill:    (payload) => void   - when set, the add form calls this instead of the store
// onSaveForm:    () => void          - optional, after the form saves
// suggestions:   optional pool of skills from other sports; shown with an "+ Add" button
// onAddSuggestion: (suggestion) => void
// manageButton:  optional node rendered above the filters
export default function SkillsBrowser({
  skills,
  levels,
  onRemove,
  onAddSkill,
  onSaveForm,
  sportId,
  categoryId,
  suggestions = [],
  onAddSuggestion,
  manageButton = null,
  pageSize = 10,
  title = "Skills"
}) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const term = search.trim().toLowerCase();

  const filteredSkills = skills.filter(skill => {
    const matchesSearch =
      (skill.name || "").toLowerCase().includes(term) ||
      (skill.description || "").toLowerCase().includes(term);
    const matchesLevel =
      levelFilter === "all" || String(skill.level) === String(levelFilter);
    return matchesSearch && matchesLevel;
  });

  const visibleSkills = filteredSkills.slice(0, visibleCount);

  const nameMatches = skills.filter(s =>
    (s.name || "").toLowerCase().includes(term)
  );

  const existingNames = new Set(skills.map(s => (s.name || "").toLowerCase()));
  const matchingSuggestions =
    term && onAddSuggestion
      ? suggestions
          .filter(
            s =>
              (s.name || "").toLowerCase().includes(term) &&
              !existingNames.has((s.name || "").toLowerCase())
          )
          .slice(0, 5)
      : [];

  const showForm =
    term.length > 0 && nameMatches.length === 0 && matchingSuggestions.length === 0;

  return (
    <div className="mt-4">
      <h3 className="h4 mb-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
        {title}
      </h3>

      {manageButton && <div className="mb-3">{manageButton}</div>}

      {/* Filters */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ borderRadius: "12px" }}
        />

        <select
          className="form-control"
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          style={{ borderRadius: "12px", maxWidth: "140px" }}
        >
          <option value="all">All Levels</option>
          {levels.map((lvl, index) => (
            <option key={lvl.id ?? index} value={lvl.value}>
              {lvl.label}
            </option>
          ))}
        </select>
      </div>

      {/* Suggestions from other sports */}
      {matchingSuggestions.map((s, i) => (
        <div
          key={`${s.id}-${i}`}
          className="p-2 mb-2 d-flex justify-content-between align-items-center"
          style={{ borderRadius: "12px", border: "1px dashed #b300ff" }}
        >
          <span>
            <strong>{s.name}</strong>{" "}
            <span className="text-muted small">
              {s.sourceSport ? `from ${s.sourceSport}` : ""}
            </span>
          </span>
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px"
            }}
            onClick={() => {
              onAddSuggestion(s);
              setSearch("");
            }}
          >
            + Add
          </button>
        </div>
      ))}

      {visibleSkills.length === 0 && (
        <div className="text-muted small" style={{ margin: "12px 0" }}>
          No skills found. If you wish to add a new skill, use the form below.
        </div>
      )}

      {showForm && (
        <AddSkillsForm
          skillName={search}
          routineLevel={null}
          categoryLevels={levels}
          sportId={sportId}
          categoryId={categoryId}
          routineId=""
          onSubmit={onAddSkill}
          onSave={() => {
            setSearch("");
            onSaveForm?.();
          }}
          onCancel={() => setSearch("")}
          type="addSkill"
        />
      )}

      {/* Skills list */}
      {visibleSkills.map(skill => {
        const googleQuery = encodeURIComponent(
          `${skill.name} ${skill.description || ""}`
        );

        return (
          <div
            key={skill.id}
            className="p-3 mb-3"
            style={{
              borderRadius: "16px",
              border: "1px solid #e6e6e6",
              backgroundColor: "#ffffff",
              display: "flex",
              gap: "12px"
            }}
          >
            <div
              style={{
                width: "6px",
                backgroundColor: "#b300ff",
                borderRadius: "6px"
              }}
            ></div>

            <div style={{ flexGrow: 1, textAlign: "left" }}>
              <strong style={{ color: "#b300ff", fontSize: "16px" }}>
                {skill.name}
              </strong>

              <div className="text-muted small">Level {skill.level}</div>

              {skill.description && (
                <div className="small mt-1">{skill.description}</div>
              )}

              {skill.link && (
                <div className="small mt-1">
                  <a
                    href={skill.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#b300ff" }}
                  >
                    View demonstration →
                  </a>
                </div>
              )}

              <div className="small mt-2">
                <a
                  href={`https://www.google.com/search?q=${googleQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#b300ff", fontWeight: 600 }}
                >
                  Search Google →
                </a>
              </div>
            </div>

            <button
              className="btn btn-sm btn-danger"
              style={{ borderRadius: "10px", height: "32px" }}
              onClick={() => onRemove(skill)}
            >
              Remove
            </button>
          </div>
        );
      })}

      {filteredSkills.length > visibleCount && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-light"
            style={{
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              fontWeight: 600,
              padding: "6px 14px"
            }}
            onClick={() => setVisibleCount(visibleCount + pageSize)}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
