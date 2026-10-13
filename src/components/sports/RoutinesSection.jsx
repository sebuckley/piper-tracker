import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoutinesSection({
  sport,
  category,
  categoryLevels,
  deleteRoutine
}) {
  const navigate = useNavigate();

  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineLevel, setNewRoutineLevel] = useState("1");
  const [customRoutineLevel, setCustomRoutineLevel] = useState("");

  const handleAddRoutine = () => {
    const level =
      newRoutineLevel === "custom" ? customRoutineLevel : newRoutineLevel;

    if (!newRoutineName.trim()) return;

    category.addRoutine(newRoutineName.trim(), level);

    setNewRoutineName("");
    setNewRoutineLevel("1");
    setCustomRoutineLevel("");
    setShowAddRoutine(false);
  };

  return (
    <div className="mt-4">

      <h3 className="h4" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Routines
      </h3>

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

      {/* Add Routine Form */}
      {showAddRoutine && (
        <div
          className="p-3 mb-4"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
            New Routine
          </label>

          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Routine name"
              value={newRoutineName}
              onChange={e => setNewRoutineName(e.target.value)}
              style={{ borderRadius: "12px" }}
            />
          </div>

          <div className="mb-3">
            <select
              className="form-control"
              value={newRoutineLevel}
              onChange={e => setNewRoutineLevel(e.target.value)}
              style={{ borderRadius: "12px" }}
            >
              {categoryLevels.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
        
            </select>
          </div>

          {newRoutineLevel === "custom" && (
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Enter custom level"
                value={customRoutineLevel}
                onChange={e => setCustomRoutineLevel(e.target.value)}
                style={{ borderRadius: "12px" }}
              />
            </div>
          )}

          <div className="d-flex gap-2">
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px"
              }}
              onClick={handleAddRoutine}
            >
              Save
            </button>

            <button
              className="btn btn-light"
              style={{
                borderRadius: "12px",
                border: "1px solid #dcdcdc",
                fontWeight: 600
              }}
              onClick={() => {
                setShowAddRoutine(false);
                setNewRoutineName("");
                setNewRoutineLevel("1");
                setCustomRoutineLevel("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Routines List */}
      {category.routines.length === 0 && (
        <div className="text-muted small">No routines added yet.</div>
      )}

      {category.routines.map(routine => (
        <div
          key={routine.id}
          className="p-3 mb-3"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong style={{ color: "#b300ff", fontSize: "16px" }}>
                {routine.name}
              </strong>
              <div className="text-muted small">Level {routine.level}</div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-sm"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dcdcdc",
                  color: "#1f2a44",
                  background: "white",
                  fontWeight: 600
                }}
                onClick={() =>
                  navigate(
                    `/sports/${sport.id}/categories/${category.id}/routines/${routine.id}`
                  )
                }
              >
                Manage
              </button>

              <button
                className="btn btn-sm btn-danger"
                style={{ borderRadius: "10px" }}
                onClick={() => deleteRoutine(sport.id, category.id, routine.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
