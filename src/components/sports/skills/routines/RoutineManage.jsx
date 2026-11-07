import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { useAppStore } from "../../../../store/useAppStore";
import AddSkillsForm from "../AddSkillsForm";
import RoutineSkillsList from "./RoutineSkillsList";
import { getRoutineRules } from "../../../../store/slices/sportsSlice";

export default function RoutineManage() {
  const { sportId, categoryId, routineId } = useParams();

  const {
    sportsClasses,
    defaultSports,
    loadDefaultSports,
    addSkillToRoutineLocal,
    deleteRoutineSkill,
    reorderRoutineSkills,
    updateRoutine,
    saveRoutine
  } = useAppStore();

  useEffect(() => {
    if (defaultSports.length === 0) loadDefaultSports();
  }, [defaultSports.length, loadDefaultSports]);

  const sport = sportsClasses.find(s => s.templateId === sportId);
  const category = sport?.categories.find(c => c.templateId === categoryId);
  const routine = category?.routines.find(r => r.templateId === routineId);

  const sportTemplate = defaultSports.find(s => s.id === sport?.templateId);
  const categoryTemplate = sportTemplate?.categories.find(
    c => c.id === category?.templateId
  );

  const categoryLevels = [...new Set(
    [...(categoryTemplate?.skills || []), ...(category?.skills || [])]
      .map(sk => parseInt(sk.level))
      .filter(Boolean)
  )].sort((a, b) => a - b);

  // ⭐ Routine Settings (view/edit mode)
  const [editingSettings, setEditingSettings] = useState(false);
  const [routineLevel, setRoutineLevel] = useState(routine?.level || 1);
  const [routineDescription, setRoutineDescription] = useState(routine?.description || "");
  const [routineLink, setRoutineLink] = useState(routine?.link || "");

  // ⭐ Search + Add
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const handleSaveRoutineSettings = () => {
    updateRoutine(sport.id, category.id, routine.id, {
      level: parseInt(routineLevel),
      description: routineDescription.trim(),
      link: routineLink.trim()
    });
    setEditingSettings(false);
  };

  if (!sport || !category || !routine || !sportTemplate || !categoryTemplate) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Routine not found.</div>
      </div>
    );
  }

  const mergedSkills = [
    ...categoryTemplate.skills.map(s => ({ ...s, isTemplate: true })),
    ...category.skills.map(s => ({ ...s, isTemplate: false }))
  ];

  // Hide category copies of template skills, and duplicates by name
  const seenNames = new Set();
  const uniqueSkills = mergedSkills.filter(sk => {
    const key = sk.name.toLowerCase();
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });

  const searchTerm = search.trim().toLowerCase();
  const rules = getRoutineRules(sport, category, routine.level);
  const allSkillsAtLevel = uniqueSkills
    .filter(sk => (parseInt(sk.level) || 0) <= (parseInt(routine.level) || 0))
    .sort((a, b) => (a.level - b.level) || a.name.localeCompare(b.name));
  const matches = searchTerm
    ? uniqueSkills.filter(sk => sk.name.toLowerCase().includes(searchTerm))
    : [];
  const inRoutineNames = new Set(
    routine.skills.map(ref =>
      category.skills.find(sk => sk.templateId === ref || sk.id === ref)?.name.toLowerCase()
    )
  );

  const addExistingSkill = (sk) => {
    const templateId = sk.isTemplate ? sk.id : sk.templateId;
    addSkillToRoutineLocal(sport.id, category.id, routine.id, {
      name: sk.name,
      level: sk.level,
      description: sk.description,
      link: sk.link,
      ...(templateId ? { templateId } : {})
    });
    setSearch("");
  };


  const handleDragEnd = result => {
    if (!result.destination) return;

    const newOrder = [...routine.skills];
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    reorderRoutineSkills(sport.id, category.id, routine.id, newOrder);
  };

  return (
    <div className="container mt-4">

      {/* Breadcrumb */}
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link to="/sports" style={{ color: "#b300ff", textDecoration: "none" }}>
            Sports
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <Link to={`/sports/${sport.templateId}`} style={{ color: "#b300ff", textDecoration: "none" }}>
            {sport.name}
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <Link to={`/sports/${sport.templateId}/categories/${category.templateId}`} style={{ color: "#b300ff", textDecoration: "none" }}>
            {category.name}
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <span style={{ color: "#1f2a44" }}>{routine.name}</span>
        </nav>
      </div>

      {/* Page Title */}
      <h2 className="h3 mt-3 mb-4" style={{ color: "#b300ff", fontWeight: 700 }}>
        Manage {routine.name}
      </h2>

      {/* ⭐ Routine Settings */}
      <div
        className="p-3 mb-4"
        style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff"
        }}
      >
        <h4 style={{ color: "#1f2a44", fontWeight: 600 }}>Routine Settings</h4>

        {!editingSettings ? (
          <>
            <div className="mb-2">
              <strong>Level:</strong> {routine.level}
            </div>
            <div className="mb-2">
              <strong>Description:</strong> {routine.description || "None"}
            </div>
            <div className="mb-2">
              <strong>Video Link:</strong>{" "}
              {routine.link ? (
                <a href={routine.link} target="_blank" rel="noopener noreferrer">
                  View →
                </a>
              ) : (
                "None"
              )}
            </div>

            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "10px",
                padding: "6px 14px"
              }}
              onClick={() => setEditingSettings(true)}
            >
              Edit Settings
            </button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Routine Level</label>
              <input
                type="number"
                className="form-control"
                value={routineLevel}
                onChange={e => setRoutineLevel(e.target.value)}
                style={{ borderRadius: "12px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={routineDescription}
                onChange={e => setRoutineDescription(e.target.value)}
                style={{ borderRadius: "12px" }}
                rows={3}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Video Link</label>
              <input
                className="form-control"
                value={routineLink}
                onChange={e => setRoutineLink(e.target.value)}
                style={{ borderRadius: "12px" }}
              />
            </div>

            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px"
              }}
              onClick={handleSaveRoutineSettings}
            >
              Save Settings
            </button>

            <button
              className="btn btn-light ms-2"
              style={{
                borderRadius: "12px",
                border: "1px solid #ccc"
              }}
              onClick={() => setEditingSettings(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Skills Section */}
      <h3 className="h4 mb-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Skills (Level {routineLevel} Routine)
      </h3>

      {/* Skill count vs rules */}
      <div
        className={`small mb-3 ${
          routine.skills.length < rules.min || routine.skills.length > rules.max
            ? "text-danger"
            : "text-success"
        }`}
      >
        {routine.skills.length} skill(s) — this level needs {rules.min}
        {Number.isFinite(rules.max) ? `–${rules.max}` : "+"} to be submitted for review.
      </div>

      {/* Search + Add */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Search for a skill..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ borderRadius: "12px" }}
        />
        <button
          className="btn btn-light"
          style={{ borderRadius: "12px", border: "1px solid #dcdcdc", whiteSpace: "nowrap" }}
          onClick={() => setShowAll(v => !v)}
        >
          {showAll ? "Hide all skills" : "Show all skills"}
        </button>
      </div>

      {showAll && (
        <div className="mb-3">
          <div className="text-muted small mb-2">
            All {category.name} skills at level {routine.level} or below.
          </div>
          {allSkillsAtLevel.length === 0 && (
            <div className="text-muted small">No skills at this level yet.</div>
          )}
          {allSkillsAtLevel.map(sk => {
            const added = inRoutineNames.has(sk.name.toLowerCase());
            return (
              <div
                key={sk.id}
                className="p-2 mb-2 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "10px", border: "1px solid #e6e6e6", backgroundColor: "#fafafa" }}
              >
                <div>
                  <strong>{sk.name}</strong>
                  <div className="text-muted small">Level {sk.level}</div>
                </div>
                <button
                  className="btn btn-sm"
                  disabled={added}
                  style={{
                    backgroundColor: "#b300ff",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "6px 14px"
                  }}
                  onClick={() => addExistingSkill(sk)}
                >
                  {added ? "Added" : "+ Add"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Filtered Skill Suggestions */}
      {matches.length > 0 && (
        <div className="mb-3">
          {matches.map(sk => {
            const added = inRoutineNames.has(sk.name.toLowerCase());
            return (
              <div
                key={sk.id}
                className="p-2 mb-2 d-flex justify-content-between align-items-center"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #e6e6e6",
                  backgroundColor: "#fafafa"
                }}
              >
                <div>
                  <strong>{sk.name}</strong>
                  <div className="text-muted small">Level {sk.level}</div>
                </div>
                <button
                  className="btn btn-sm"
                  disabled={added}
                  style={{
                    backgroundColor: "#b300ff",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "6px 14px"
                  }}
                  onClick={() => addExistingSkill(sk)}
                >
                  {added ? "Added" : "+ Add"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* No matches: add a new skill */}
      {searchTerm && matches.length === 0 && (
        <AddSkillsForm
          routineLevel={routine.level}
          categoryLevels={categoryLevels}
          sportId={sport.templateId}
          categoryId={category.templateId}
          routineId={routine.templateId}
          skillName={search.trim()}
          onSave={() => setSearch("")}
          onCancel={() => setSearch("")}
          type="addSkillToRoutine"
        />
      )}

      {/* Routine Skills List */}
      <RoutineSkillsList
        routine={routine}
        category={category}
        sport={sport}
        moveSkill={(index, dir) => {
          const newOrder = [...routine.skills];
          const target = index + dir;
          if (target < 0 || target >= newOrder.length) return;
          [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
          reorderRoutineSkills(sport.id, category.id, routine.id, newOrder);
        }}
        deleteRoutineSkill={deleteRoutineSkill}
        handleDragEnd={handleDragEnd}
      />

      {/* ⭐ Save Routine (moved to bottom) */}
      <div className="mt-4">
        <button
          className="btn"
          style={{
            backgroundColor: "#1f2a44",
            color: "white",
            fontWeight: 600,
            borderRadius: "12px",
            padding: "10px 18px"
          }}
          onClick={() => {
            setSaveResult(saveRoutine(sport.id, category.id, routine.id, rules));
          }}
        >
          Save Routine
        </button>

        {saveResult?.saved && (
          <div
            className={`alert mt-3 ${saveResult.submitted ? "alert-success" : "alert-warning"}`}
          >
            {saveResult.submitted && "Routine saved and submitted for review."}
            {saveResult.reason === "too-few" &&
              `Routine saved, but it needs at least ${saveResult.min} skills (currently ${saveResult.count}) before it can be submitted for review.`}
            {saveResult.reason === "too-many" &&
              `Routine saved, but it can have at most ${saveResult.max} skills (currently ${saveResult.count}) to be submitted for review.`}
          </div>
        )}
      </div>
    </div>
  );
}
