import { useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "../../../store/useAppStore";
import AddSkillsForm from "./AddSkillsForm";
import { useState } from "react";
import { DEFAULT_UI_LABELS } from "../../../utils/DEFAULT_LABELS";

export default function ManageSkillsPage() {
  const navigate = useNavigate();
  const { sportId, categoryId } = useParams();

  const sportsClasses = useAppStore(s => s.sportsClasses);
  const deleteRoutineSkill = useAppStore(s => s.deleteRoutineSkill);

  const sport = sportsClasses.find(s => s.templateId === sportId);
  const category = sport.categories.find(c => c.templateId === categoryId);

  const [editingSkill, setEditingSkill] = useState(null);

  return (
    <div className="container py-4">

      <h2 style={{ color: "#1f2a44", fontWeight: 700 }}>
        Manage {category.name} Skills
      </h2>

      <button
        className="btn btn-light mb-3"
        onClick={() => navigate(-1)}
        style={{
          borderRadius: "10px",
          border: "1px solid #dcdcdc",
          fontWeight: 600
        }}
      >
        ← Back
      </button>

      {editingSkill && (
        <AddSkillsForm
          sportId={sportId}
          categoryId={categoryId}
          routineId={""}
          categoryLevels={category.levels}
          categorySkills={category.skills}
          type="editSkill"
          existingSkill={editingSkill}
          onSave={() => setEditingSkill(null)}
          onCancel={() => setEditingSkill(null)}
        />
      )}

      {category.skills.map(skill => (
        <div
          key={skill.id}
          className="p-3 mb-3"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <strong style={{ color: "#b300ff", fontSize: "16px" }}>
            {skill.name}
          </strong>

          <div className="text-muted small">Level {skill.level}</div>

          {skill.description && (
            <div className="small mt-1">{skill.description}</div>
          )}

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc",
                background: "white",
                color: "#1f2a44",
                fontWeight: 600
              }}
              onClick={() => setEditingSkill(skill)}
            >
              Edit
            </button>

            <button
              className="btn btn-sm btn-danger"
              style={{ borderRadius: "10px" }}
              onClick={() =>
                deleteRoutineSkill(sportId, categoryId, skill.id)
              }
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
