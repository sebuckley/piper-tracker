import { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { nanoid } from "nanoid";

const PRESETS = {
  Gymnastics: ["Bars", "Beam", "Floor", "Vault"],
  Dancing: ["Ballet", "Tap", "Jazz", "Hip Hop", "Contemporary", "Cheer Pom"],
  Swimming: ["Freestyle", "Breaststroke", "Backstroke", "Butterfly"],
  Football: ["Dribbling", "Passing", "Shooting", "Tackling"]
};

function toEmbedUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

function getRoutineLabel(sportName) {
  switch (sportName) {
    case "Gymnastics":
    case "Dancing":
      return "Routine";
    case "Swimming":
      return "Stroke Routine";
    case "Football":
      return "Drill";
    default:
      return "Routine";
  }
}

export default function SkillsManager() {
  const sports = useAppStore(s => s.sportsClasses);
  const addSkill = useAppStore(s => s.addApparatus);
  const deleteSkill = useAppStore(s => s.deleteApparatus);
  const updateSport = useAppStore(s => s.updateSport);
  const addLevel = useAppStore(s => s.addRoutineToApparatus);

  const [selectedSportId, setSelectedSportId] = useState(null);

  const [newSkillName, setNewSkillName] = useState("");
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editingSkillName, setEditingSkillName] = useState("");

  const [newRoutineName, setNewRoutineName] = useState("");
  const [selectedSkillForRoutine, setSelectedSkillForRoutine] = useState("");

  const [editingLevelId, setEditingLevelId] = useState(null);
  const [editingLevelName, setEditingLevelName] = useState("");

  const [stepInputs, setStepInputs] = useState({});
  const [editingStepId, setEditingStepId] = useState(null);
  const [editingStepText, setEditingStepText] = useState("");

  const [expandedLevelIds, setExpandedLevelIds] = useState([]);
  const [draggingStep, setDraggingStep] = useState(null);

  const sport =
    sports.find(s => String(s.id) === String(selectedSportId)) || null;

  useEffect(() => {
    if (!selectedSportId && sports.length > 0) {
      setSelectedSportId(String(sports[0].id));
    }
  }, [sports, selectedSportId]);

  useEffect(() => {
    if (!sport) return;
    if (sport.apparatus.length === 0) {
      const presets = PRESETS[sport.name] || [];
      presets.forEach(name => addSkill(sport.id, name));
    }
  }, [sport]);

  const handleSelectSport = id => setSelectedSportId(id || null);

  const updateLevelName = (sportId, skillId, levelId, newName) => {
    if (!sport) return;
    updateSport(sportId, {
      apparatus: sport.apparatus.map(a =>
        a.id === skillId
          ? {
              ...a,
              routines: a.routines.map(r =>
                r.id === levelId ? { ...r, level: newName } : r
              )
            }
          : a
      )
    });
  };

  const deleteLevel = (sportId, skillId, levelId) => {
    if (!sport) return;
    updateSport(sportId, {
      apparatus: sport.apparatus.map(a =>
        a.id === skillId
          ? { ...a, routines: a.routines.filter(r => r.id !== levelId) }
          : a
      )
    });
  };

  const updateRoutineMeta = (sportId, skillId, levelId, data) => {
    if (!sport) return;
    updateSport(sportId, {
      apparatus: sport.apparatus.map(a =>
        a.id === skillId
          ? {
              ...a,
              routines: a.routines.map(r =>
                r.id === levelId ? { ...r, ...data } : r
              )
            }
          : a
      )
    });
  };

  const handleAddStep = (sportId, skillId, levelId) => {
    if (!sport) return;
    const text = (stepInputs[levelId] || "").trim();
    if (!text) return;

    updateSport(sportId, {
      apparatus: sport.apparatus.map(a =>
        a.id === skillId
          ? {
              ...a,
              routines: a.routines.map(r =>
                r.id === levelId
                  ? {
                      ...r,
                      steps: [...(r.steps || []), { id: nanoid(), text }]
                    }
                  : r
              )
            }
          : a
      )
    });

    setStepInputs(prev => ({ ...prev, [levelId]: "" }));
  };

  const handleEditStepStart = step => {
    setEditingStepId(step.id);
    setEditingStepText(step.text);
  };

  const handleSaveStep = (sportId, skillId, levelId) => {
    if (!sport) return;
    updateSport(sportId, {
      apparatus: sport.apparatus.map(a =>
        a.id === skillId
          ? {
              ...a,
              routines: a.routines.map(r =>
                r.id === levelId
                  ? {
                      ...r,
                      steps: (r.steps || []).map(s =>
                        s.id === editingStepId ? { ...s, text: editingStepText } : s
                      )
                    }
                  : r
              )
            }
          : a
      )
    });

    setEditingStepId(null);
    setEditingStepText("");
  };

  const handleDeleteStep = (sportId, skillId, levelId, stepId) => {
    if (!sport) return;
    updateSport(sportId, {
      apparatus: sport.apparatus.map(a =>
        a.id === skillId
          ? {
              ...a,
              routines: a.routines.map(r =>
                r.id === levelId
                  ? {
                      ...r,
                      steps: (r.steps || []).filter(s => s.id !== stepId)
                    }
                  : r
              )
            }
          : a
      )
    });
  };

  const toggleLevelExpanded = levelId => {
    setExpandedLevelIds(prev =>
      prev.includes(levelId)
        ? prev.filter(id => id !== levelId)
        : [...prev, levelId]
    );
  };

  const handleStepDragStart = (levelId, stepId) => {
    setDraggingStep({ levelId, stepId });
  };

  const handleStepDrop = (sportId, skillId, levelId, targetStepId) => {
    if (!draggingStep || draggingStep.levelId !== levelId || !sport) return;

    updateSport(sportId, {
      apparatus: sport.apparatus.map(a =>
        a.id === skillId
          ? {
              ...a,
              routines: a.routines.map(r => {
                if (r.id !== levelId) return r;

                const steps = [...(r.steps || [])];
                const fromIndex = steps.findIndex(s => s.id === draggingStep.stepId);
                const toIndex = steps.findIndex(s => s.id === targetStepId);

                if (fromIndex === -1 || toIndex === -1) return r;

                const [moved] = steps.splice(fromIndex, 1);
                steps.splice(toIndex, 0, moved);

                return { ...r, steps };
              })
            }
          : a
      )
    });

    setDraggingStep(null);
  };

  const handleStepDragOver = e => e.preventDefault();

  if (!sport) {
    return (
      <div className="container mt-4">
        <div className="card shadow-sm" style={{ borderRadius: "16px" }}>
          <div className="p-4">
            <h2 className="h5 mb-4">Skills Manager</h2>
            <p className="text-muted">Select a sport to manage skills and routines.</p>
            <div className="mb-4">
              <label className="form-label">Choose Sport</label>
              <select
                className="form-select"
                value={selectedSportId || ""}
                onChange={e => handleSelectSport(e.target.value)}
              >
                <option value="">Select a sport</option>
                {sports.map(s => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const routineLabel = getRoutineLabel(sport.name);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm" style={{ borderRadius: "16px" }}>
        <div className="p-4">
          <h2 className="h5 mb-4">Skills Manager</h2>

          {/* Select Sport */}
          <div className="mb-4">
            <label className="form-label">Choose Sport</label>
            <select
              className="form-select"
              value={selectedSportId || ""}
              onChange={e => handleSelectSport(e.target.value)}
            >
              <option value="">Select a sport</option>
              {sports.map(s => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <h4 className="mb-3">{sport.name} — Skills</h4>

          {/* Add Custom Skill */}
          <div className="mb-4">
            <label className="form-label">Add Custom Skill</label>
            <div className="input-group">
              <input
                className="form-control"
                placeholder="New skill"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!newSkillName.trim()) return;
                  addSkill(sport.id, newSkillName.trim());
                  setNewSkillName("");
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Top-level Add Routine */}
          {sport !== null && (
            <div className="card p-3 mb-4 shadow-sm" style={{ borderRadius: "12px" }}>
              <h5 className="mb-3">Add Routine</h5>

              <div className="mb-3">
                <label className="form-label">Select Skill</label>
                <select
                  className="form-select"
                  value={selectedSkillForRoutine || ""}
                  onChange={e => setSelectedSkillForRoutine(e.target.value)}
                >
                  <option value="">Choose a skill</option>
                  {sport.apparatus.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Routine Name</label>
                <input
                  className="form-control"
                  placeholder="Warmup, Conditioning, Drill, Combo..."
                  value={newRoutineName}
                  onChange={e => setNewRoutineName(e.target.value)}
                />
              </div>

              <button
                className="btn btn-success"
                onClick={() => {
                  if (!selectedSkillForRoutine || !newRoutineName.trim()) return;
                  addLevel(sport.id, selectedSkillForRoutine, newRoutineName.trim());
                  setNewRoutineName("");
                  setSelectedSkillForRoutine("");
                }}
              >
                Add Routine
              </button>
            </div>
          )}

          {/* Skill Cards */}
          <div className="d-flex flex-column gap-4">
            {sport.apparatus.map(skill => (
              <div key={skill.id} className="card p-3 shadow-sm">
                {/* Skill Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {editingSkillId === skill.id ? (
                    <input
                      className="form-control"
                      value={editingSkillName}
                      onChange={e => setEditingSkillName(e.target.value)}
                    />
                  ) : (
                    <h5 className="m-0">{skill.name}</h5>
                  )}

                  <div className="d-flex gap-2">
                    {editingSkillId !== skill.id && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setEditingSkillId(skill.id);
                          setEditingSkillName(skill.name);
                        }}
                      >
                        Edit
                      </button>
                    )}

                    {editingSkillId === skill.id && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          updateSport(sport.id, {
                            apparatus: sport.apparatus.map(a =>
                              a.id === skill.id ? { ...a, name: editingSkillName } : a
                            )
                          });
                          setEditingSkillId(null);
                        }}
                      >
                        Save
                      </button>
                    )}

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteSkill(sport.id, skill.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Routine List */}
                <h6 className="mb-2">{routineLabel}s</h6>

                <div className="d-flex flex-column gap-3">
                  {skill.routines.map(level => {
                    const isExpanded = expandedLevelIds.includes(level.id);
                    const steps = level.steps || [];
                    const routineName = level.routineName || "";

                    return (
                      <div
                        key={level.id}
                        className="card shadow-sm"
                        style={{ borderRadius: "12px" }}
                      >
                        <div
                          className="card-header d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleLevelExpanded(level.id)}
                        >
                          <strong>
                            {routineLabel}: {level.level || routineName || "Unnamed"}
                          </strong>
                          <span className="badge bg-secondary">
                            {isExpanded ? "Hide" : "Show"}
                          </span>
                        </div>

                        {isExpanded && (
                          <div className="card-body">
                            {/* Routine Name */}
                            <div className="mt-3 mb-4">
                              <label className="form-label">Routine Name</label>
                              <input
                                className="form-control"
                                placeholder={`e.g. ${skill.name} Warmup`}
                                value={routineName}
                                onChange={e =>
                                  updateRoutineMeta(sport.id, skill.id, level.id, {
                                    routineName: e.target.value
                                  })
                                }
                              />
                            </div>

                            {/* Steps */}
                            <div className="mt-4">
                              <h6>Steps</h6>

                              {steps.length === 0 && (
                                <p className="text-muted small">No steps yet</p>
                              )}

                              {steps.length > 0 && (
                                <ul className="list-group">
                                  {steps.map((step, index) => (
                                    <li
                                      key={step.id}
                                      className="list-group-item d-flex align-items-center"
                                      draggable
                                      onDragStart={() =>
                                        handleStepDragStart(level.id, step.id)
                                      }
                                      onDragOver={handleStepDragOver}
                                      onDrop={() =>
                                        handleStepDrop(
                                          sport.id,
                                          skill.id,
                                          level.id,
                                          step.id
                                        )
                                      }
                                      style={{
                                        paddingTop: "12px",
                                        paddingBottom: "12px"
                                      }}
                                    >
                                      <span
                                        className="me-4 text-muted"
                                        style={{ cursor: "grab", fontSize: "1.3rem" }}
                                        title="Drag to reorder"
                                      >
                                        ⋮⋮
                                      </span>

                                      <span
                                        className="badge bg-primary rounded-pill me-4"
                                        style={{
                                          fontSize: "0.9rem",
                                          padding: "6px 10px"
                                        }}
                                      >
                                        {index + 1}
                                      </span>

                                      <div className="flex-grow-1 me-4">
                                        {editingStepId === step.id ? (
                                          <input
                                            className="form-control"
                                            value={editingStepText}
                                            onChange={e =>
                                              setEditingStepText(e.target.value)
                                            }
                                          />
                                        ) : (
                                          <span style={{ fontSize: "1rem" }}>
                                            {step.text}
                                          </span>
                                        )}
                                      </div>

                                      <a
                                        href={`https://www.google.com/search?q=${encodeURIComponent(
                                          step.text
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center me-4"
                                        style={{ width: "34px", height: "34px", padding: 0 }}
                                        title="Search this step"
                                      >
                                        ➜
                                      </a>

                                      <div className="d-flex align-items-center gap-2">
                                        {editingStepId !== step.id && (
                                          <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleEditStepStart(step)}
                                          >
                                            Edit
                                          </button>
                                        )}

                                        {editingStepId === step.id && (
                                          <>
                                            <button
                                              className="btn btn-sm btn-success"
                                              onClick={() =>
                                                handleSaveStep(
                                                  sport.id,
                                                  skill.id,
                                                  level.id
                                                )
                                              }
                                            >
                                              Save
                                            </button>
                                            <button
                                              className="btn btn-sm btn-outline-danger"
                                              onClick={() =>
                                                handleDeleteStep(
                                                  sport.id,
                                                  skill.id,
                                                  level.id,
                                                  step.id
                                                )
                                              }
                                            >
                                              Delete
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              <div className="input-group mt-3">
                                <input
                                  className="form-control"
                                  placeholder="Add step"
                                  value={stepInputs[level.id] || ""}
                                  onChange={e =>
                                    setStepInputs(prev => ({
                                      ...prev,
                                      [level.id]: e.target.value
                                    }))
                                  }
                                />
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    handleAddStep(sport.id, skill.id, level.id)
                                  }
                                >
                                  Add Step
                                </button>
                              </div>
                            </div>

                            {/* Video */}
                            <div className="mt-4">
                              <h6>Video</h6>
                              <input
                                className="form-control"
                                placeholder="YouTube URL"
                                value={level.videoUrl || ""}
                                onChange={e =>
                                  updateRoutineMeta(sport.id, skill.id, level.id, {
                                    videoUrl: e.target.value
                                  })
                                }
                              />
                              {level.videoUrl && (
                                <div className="mt-3">
                                  <div className="ratio ratio-16x9">
                                    <iframe
                                      src={toEmbedUrl(level.videoUrl)}
                                      title="Routine Video"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Instructions */}
                            <div className="mt-4">
                              <h6>Instructions</h6>
                              <textarea
                                className="form-control"
                                rows={4}
                                placeholder="Describe how to perform this routine..."
                                value={level.instructions || ""}
                                onChange={e =>
                                  updateRoutineMeta(sport.id, skill.id, level.id, {
                                    instructions: e.target.value
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
