import { useState } from "react";

export default function SkillsSection({
  sport,
  category,
  categoryLevels,
  addSkill,
  deleteSkill
}) {
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("1");
  const [customSkillLevel, setCustomSkillLevel] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [newSkillLink, setNewSkillLink] = useState("");

  const handleAddSkill = () => {
    const level =
      newSkillLevel === "custom" ? customSkillLevel : newSkillLevel;

    if (!newSkillName.trim()) return;

    addSkill(
      sport.id,
      category.id,
      newSkillName.trim(),
      level,
      newSkillDescription.trim(),
      newSkillLink.trim()
    );

    setNewSkillName("");
    setNewSkillLevel("1");
    setCustomSkillLevel("");
    setNewSkillDescription("");
    setNewSkillLink("");
    setShowAddSkill(false);
  };

  return (
    <div className="mt-4">

      <h3 className="h4" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Skills
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

      {/* Add Skill Form */}
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

          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Skill name"
              value={newSkillName}
              onChange={e => setNewSkillName(e.target.value)}
              style={{ borderRadius: "12px" }}
            />
          </div>

          <div className="mb-3">
            <select
              className="form-control"
              value={newSkillLevel}
              onChange={e => setNewSkillLevel(e.target.value)}
              style={{ borderRadius: "12px" }}
            >
              {categoryLevels.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
             
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

          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Link to demonstration (optional)"
              value={newSkillLink}
              onChange={e => setNewSkillLink(e.target.value)}
              style={{ borderRadius: "12px" }}
            />
          </div>

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
                setNewSkillLevel("1");
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

      {/* Skills List */}
      {category.skills.length === 0 && (
        <div className="text-muted small">No skills added yet.</div>
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
          <div className="d-flex justify-content-between align-items-center">
            <div>
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

            <button
              className="btn btn-sm btn-danger"
              style={{ borderRadius: "10px" }}
              onClick={() => deleteSkill(sport.id, category.id, skill.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
