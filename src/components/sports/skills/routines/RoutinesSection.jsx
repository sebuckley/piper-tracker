import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddRoutineForm from "./AddRoutineForm"; // ⭐ import your new component

export default function RoutinesSection({
  sport,
  category,
  categoryLevels,
  deleteRoutine
}) {
  const navigate = useNavigate();
  const [showAddRoutine, setShowAddRoutine] = useState(false);

  return (
    <div className="mt-4">

      {/* ⭐ Section Header */}
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        {category.name} Routines
      </h3>

      {/* ⭐ Add Button */}
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
          onClick={() => setShowAddRoutine(true)}
        >
          + Add Routine
        </button>
      </div>

      {/* ⭐ Add Routine Form */}
      {showAddRoutine && (
        <AddRoutineForm
          sportId={sport.id}
          categoryId={category.id}
          categoryLevels={sport.levels}
          onCancel={() => setShowAddRoutine(false)}
        />
      )}

      {/* ⭐ Routines List */}
      {category.routines.length === 0 && (
        <div className="text-muted small">No routines added yet.</div>
      )}

      {category.routines.map(routine => (
        <div
          key={routine.id}
          className="p-3 mb-3"
          style={{
            borderRadius: "16px",
            border: "1px solid #331d1d",
            backgroundColor: "#ffffff",
            display: "flex",
            gap: "12px"
          }}
        >
          {/* ⭐ Accent Bar */}
          <div
            style={{
              width: "6px",
              backgroundColor: "#b300ff",
              borderRadius: "6px"
            }}
          ></div>

          {/* ⭐ Routine Content */}
          <div style={{ flexGrow: 1, textAlign: "left" }}>
            <strong style={{ color: "#b300ff", fontSize: "16px" }}>
              {routine.name}
            </strong>
            <div className="text-muted small">Level {routine.level}</div>

            {routine.description && (
              <div className="text-muted small mt-1">
                {routine.description}
              </div>
            )}
          </div>

          {/* ⭐ Controls */}
          <div className="d-flex gap-2 align-items-center">

            {/* Manage */}
            <button
              className="btn btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc",
                background: "white",
                color: "#1f2a44",
                fontWeight: 600
              }}
              onClick={() =>
                navigate(
                  `/sports/${sport.templateId}/categories/${category.templateId}/routines/${routine.templateId}`
                )
              }
            >
              Manage
            </button>

            {/* Remove */}
            <button
              className="btn btn-sm btn-danger"
              style={{ borderRadius: "10px" }}
              onClick={() => deleteRoutine(sport.id, category.id, routine.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
