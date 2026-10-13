import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function SportsRoutines() {
  const { id } = useParams();
  const {
    sportsClasses,
    addRoutineToApparatus,
    addSkillItem,
    completeSkillItem,
    addStepToRoutine
  } = useAppStore();

  const sport = sportsClasses.find(s => s.id === id);

  const [newRoutineLevel, setNewRoutineLevel] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newStepText, setNewStepText] = useState("");

  if (!sport) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Sport not found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb */}
      <div className="d-flex justify-content-start mb-3">
        <nav
          style={{
            fontWeight: "600",
            fontSize: "15px"
          }}
        >
          <Link
            to="/sports"
            style={{
              color: "#b300ff",
              textDecoration: "none"
            }}
          >
            Sports
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <Link
            to={`/sports/${sport.id}`}
            style={{
              color: "#b300ff",
              textDecoration: "none"
            }}
          >
            {sport.name}
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <span style={{ color: "#1f2a44" }}>
            Routines
          </span>
        </nav>
      </div>

      {/* ⭐ Main Card */}
      <div
        className="card shadow-sm"
        style={{
          borderRadius: "20px",
          border: "2px solid #b300ff20",
          background: "linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)"
        }}
      >
        <div className="p-4">

          {/* Title */}
          <h2
            className="h4 mb-4"
            style={{
              color: "#b300ff",
              fontWeight: "700",
              letterSpacing: "0.5px"
            }}
          >
            {sport.name} — Routines
          </h2>

          {/* Loop apparatus */}
          {sport.apparatus.map(app => (
            <div
              key={app.id}
              className="mb-4 p-3"
              style={{
                borderRadius: "16px",
                border: "1px solid #e6e6e6",
                backgroundColor: "#ffffff",
                boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
              }}
            >
              <h4
                className="h6 mb-3"
                style={{
                  color: "#b300ff",
                  fontWeight: "700",
                  borderBottom: "2px solid #b300ff20",
                  paddingBottom: "6px"
                }}
              >
                {app.name}
              </h4>

              {/* Existing routines */}
              {app.routines.length === 0 && (
                <div className="text-muted small mb-3">
                  No routines added yet.
                </div>
              )}

              {app.routines.map(routine => (
                <div
                  key={routine.id}
                  className="mb-3 p-3"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e6e6e6",
                    backgroundColor: "#fafafa",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                  }}
                >
                  <strong style={{ color: "#1f2a44" }}>
                    Level: <span style={{ color: "#b300ff" }}>{routine.level}</span>
                  </strong>

                  {/* Skills */}
                  <div className="mt-3">
                    <strong className="small" style={{ color: "#1f2a44" }}>
                      Skills
                    </strong>

                    {routine.items.length === 0 && (
                      <div className="text-muted small">No skills yet.</div>
                    )}

                    {routine.items.length > 0 && (
                      <ul className="small mt-1">
                        {routine.items.map(item => (
                          <li key={item.id} className="d-flex align-items-center gap-2">
                            {item.name}
                            {item.completed ? (
                              <span style={{ color: "#28a745", fontWeight: "700" }}>✓</span>
                            ) : (
                              <button
                                className="btn btn-sm btn-success"
                                style={{ borderRadius: "8px", padding: "2px 8px" }}
                                onClick={() =>
                                  completeSkillItem(
                                    sport.id,
                                    app.id,
                                    routine.id,
                                    item.id
                                  )
                                }
                              >
                                ✓
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Add skill */}
                    <div className="d-flex gap-2 mt-2">
                      <input
                        className="form-control form-control-sm"
                        placeholder="New skill"
                        value={newSkillName}
                        onChange={e => setNewSkillName(e.target.value)}
                        style={{ borderRadius: "8px" }}
                      />

                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#b300ff",
                          color: "white",
                          borderRadius: "8px"
                        }}
                        onClick={() => {
                          if (!newSkillName.trim()) return;
                          addSkillItem(
                            sport.id,
                            app.id,
                            routine.id,
                            newSkillName
                          );
                          setNewSkillName("");
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="mt-3">
                    <strong className="small" style={{ color: "#1f2a44" }}>
                      Steps
                    </strong>

                    {routine.steps.length === 0 && (
                      <div className="text-muted small">No steps yet.</div>
                    )}

                    {routine.steps.length > 0 && (
                      <ul className="small mt-1">
                        {routine.steps.map(step => (
                          <li key={step.id}>{step.text}</li>
                        ))}
                      </ul>
                    )}

                    {/* Add step */}
                    <div className="d-flex gap-2 mt-2">
                      <input
                        className="form-control form-control-sm"
                        placeholder="New step"
                        value={newStepText}
                        onChange={e => setNewStepText(e.target.value)}
                        style={{ borderRadius: "8px" }}
                      />

                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#b300ff",
                          color: "white",
                          borderRadius: "8px"
                        }}
                        onClick={() => {
                          if (!newStepText.trim()) return;
                          addStepToRoutine(
                            sport.id,
                            app.id,
                            routine.id,
                            newStepText
                          );
                          setNewStepText("");
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add routine */}
              <div className="d-flex gap-2 mt-3">
                <input
                  className="form-control form-control-sm"
                  placeholder="Routine level"
                  value={newRoutineLevel}
                  onChange={e => setNewRoutineLevel(e.target.value)}
                  style={{ borderRadius: "8px" }}
                />

                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#b300ff",
                    color: "white",
                    borderRadius: "8px"
                  }}
                  onClick={() => {
                    if (!newRoutineLevel.trim()) return;
                    addRoutineToApparatus(sport.id, app.id, newRoutineLevel);
                    setNewRoutineLevel("");
                  }}
                >
                  Add Routine
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
