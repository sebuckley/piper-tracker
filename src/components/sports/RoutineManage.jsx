import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAppStore } from "../../store/useAppStore";

export default function RoutineManage() {
  const { sportId, categoryId, routineId } = useParams();

  const {
    sportsClasses,
    addSkillToRoutine,
    deleteRoutineSkill,
    reorderRoutineSkills,
    updateRoutine
  } = useAppStore();

  const sport = sportsClasses.find(s => s.id === sportId);
  const category = sport?.categories.find(c => c.id === categoryId);
  const routine = category?.routines.find(r => r.id === routineId);

  const [showAddSkill, setShowAddSkill] = useState(false);

  // ⭐ Routine settings fields
  const [routineLevel, setRoutineLevel] = useState(routine?.level || 1);
  const [routineDescription, setRoutineDescription] = useState(routine?.description || "");
  const [routineLink, setRoutineLink] = useState(routine?.link || "");

  // ⭐ Add Skill fields
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("inherit");
  const [customSkillLevel, setCustomSkillLevel] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [newSkillLink, setNewSkillLink] = useState("");

  if (!sport || !category || !routine) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Routine not found.</div>
      </div>
    );
  }

  // ⭐ Save routine settings
  const handleSaveRoutineSettings = () => {
    updateRoutine(sport.id, category.id, routine.id, {
      level: parseInt(routineLevel),
      description: routineDescription.trim(),
      link: routineLink.trim()
    });
  };

  // ⭐ Add Skill
  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      alert("Skill name is required.");
      return;
    }

    let level;

    if (newSkillLevel === "inherit") {
      level = routineLevel;
    } else if (newSkillLevel === "custom") {
      level = parseInt(customSkillLevel) || routineLevel;
    } else {
      level = parseInt(newSkillLevel);
    }

    if (level > routineLevel) {
      alert(`Skill level ${level} cannot exceed routine level ${routineLevel}.`);
      return;
    }

    addSkillToRoutine(sport.id, category.id, routine.id, {
      name: newSkillName.trim(),
      level,
      description: newSkillDescription.trim(),
      link: newSkillLink.trim()
    });

    setNewSkillName("");
    setNewSkillLevel("inherit");
    setCustomSkillLevel("");
    setNewSkillDescription("");
    setNewSkillLink("");
    setShowAddSkill(false);
  };

  // ⭐ Arrow Button Reordering
  const moveSkill = (index, direction) => {
    const newOrder = [...routine.skills];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    reorderRoutineSkills(sport.id, category.id, routine.id, newOrder);
  };

  // ⭐ Drag & Drop Reordering
  const handleDragEnd = result => {
    if (!result.destination) return;

    const newOrder = [...routine.skills];
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    reorderRoutineSkills(sport.id, category.id, routine.id, newOrder);
  };

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb */}
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link to="/sports" style={{ color: "#b300ff", textDecoration: "none" }}>
            Sports
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <Link
            to={`/sports/${sport.id}`}
            style={{ color: "#b300ff", textDecoration: "none" }}
          >
            {sport.name}
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <Link
            to={`/sports/${sport.id}/categories/${category.id}`}
            style={{ color: "#b300ff", textDecoration: "none" }}
          >
            {category.name}
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <span style={{ color: "#1f2a44" }}>{routine.name}</span>
        </nav>
      </div>

      {/* ⭐ Page Title */}
      <h2
        className="h3 mt-3 mb-4"
        style={{ color: "#b300ff", fontWeight: 700, letterSpacing: "0.5px" }}
      >
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

        {/* Level */}
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

        {/* Description */}
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

        {/* Link */}
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
          Save Routine Settings
        </button>
      </div>

      {/* ⭐ Skills Section */}
      <h3 className="h4" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Skills (Level {routineLevel} Routine)
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
          onClick={() => setShowAddSkill(true)}
        >
          + Add Skill
        </button>
      </div>

      {/* ⭐ Add Skill Form */}
      {showAddSkill && (
        <div
          className="p-3 mb-4"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
            New Skill
          </label>

          {/* Name */}
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Skill name"
              value={newSkillName}
              onChange={e => setNewSkillName(e.target.value)}
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* Level */}
          <div className="mb-3">
            <select
              className="form-control"
              value={newSkillLevel}
              onChange={e => setNewSkillLevel(e.target.value)}
              style={{ borderRadius: "12px" }}
            >
              <option value="inherit">Use routine level ({routineLevel})</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {newSkillLevel === "custom" && (
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Enter custom level"
                value={customSkillLevel}
                onChange={e => setCustomSkillLevel(e.target.value)}
                style={{ borderRadius: "12px" }}
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Description"
              value={newSkillDescription}
              onChange={e => setNewSkillDescription(e.target.value)}
              style={{ borderRadius: "12px" }}
              rows={3}
            />
          </div>

          {/* Link */}
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Link to demonstration (optional)"
              value={newSkillLink}
              onChange={e => setNewSkillLink(e.target.value)}
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2">
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px"
              }}
              onClick={handleAddSkill}
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
                setShowAddSkill(false);
                setNewSkillName("");
                setNewSkillLevel("inherit");
                setCustomSkillLevel("");
                setNewSkillDescription("");
                setNewSkillLink("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ⭐ Skills List with Drag & Drop + Arrows + Numbering */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="routineSkills">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {routine.skills.length === 0 && (
                <div className="text-muted small">No skills added yet.</div>
              )}

              {routine.skills.map((skill, index) => (
                <Draggable key={skill.id} draggableId={skill.id} index={index}>
                  {provided => (
                    <div
                      className="p-3 mb-3"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        borderRadius: "16px",
                        border: "1px solid #e6e6e6",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        ...provided.draggableProps.style
                      }}
                    >
                      {/* ⭐ Number + Drag Handle on LEFT */}
                      <div
                        {...provided.dragHandleProps}
                        style={{
                          cursor: "grab",
                          fontWeight: 700,
                          color: "#b300ff",
                          width: "32px",
                          textAlign: "center"
                        }}
                      >
                        {index + 1}
                      </div>

                      {/* ⭐ Skill Content */}
                      <div style={{ flexGrow: 1 }}>
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
                      </div>

                      {/* ⭐ Controls */}
                      <div className="d-flex gap-2 align-items-center">

                        {/* Move Up */}
                        <button
                          className="btn btn-sm"
                          style={{
                            borderRadius: "10px",
                            border: "1px solid #dcdcdc",
                            background: "white",
                            fontWeight: 600
                          }}
                          onClick={() => moveSkill(index, -1)}
                          disabled={index === 0}
                        >
                          ↑
                        </button>

                        {/* Move Down */}
                        <button
                          className="btn btn-sm"
                          style={{
                            borderRadius: "10px",
                            border: "1px solid #dcdcdc",
                            background: "white",
                            fontWeight: 600
                          }}
                          onClick={() => moveSkill(index, 1)}
                          disabled={index === routine.skills.length - 1}
                        >
                          ↓
                        </button>

                        {/* Remove */}
                        <button
                          className="btn btn-sm btn-danger"
                          style={{ borderRadius: "10px" }}
                          onClick={() =>
                            deleteRoutineSkill(
                              sport.id,
                              category.id,
                              routine.id,
                              skill.id
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
