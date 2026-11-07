import { useState, useEffect } from "react";
import { useAppStore } from "../../../store/useAppStore";

export default function AddSkillForm({
  skillName,
  routineLevel,
  categoryLevels,
  sportId,
  categoryId,
  routineId,
  onSubmit,
  onSave,
  onCancel,
  type = "addSkill"
}) {
  
  const [newSkillName, setNewSkillName] = useState(skillName ?? "");
  const [newSkillLevel, setNewSkillLevel] = useState("inherit");
  const [customSkillLevel, setCustomSkillLevel] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [newSkillLink, setNewSkillLink] = useState("");

  const addSkill = useAppStore(s => s.addSkill);
  const addSkillToRoutine = useAppStore(s => s.addSkillToRoutineLocal);

  // Accepts plain numbers or level objects ({ value, label } / { name }); de-duplicated
  const levelOptions = [];
  const seenLevels = new Set();
  (categoryLevels ?? []).forEach((lvl, index) => {
    const isObj = lvl !== null && typeof lvl === "object";
    const value = isObj ? (lvl.value ?? index + 1) : lvl;
    const label = isObj ? (lvl.label ?? lvl.name ?? `Level ${value}`) : `Level ${value}`;
    const key = String(value);
    if (seenLevels.has(key)) return;
    seenLevels.add(key);
    levelOptions.push({ value: key, label });
  });

  const resetForm = () => {
    setNewSkillName("");
    setNewSkillLevel("inherit");
    setCustomSkillLevel("");
    setNewSkillDescription("");
    setNewSkillLink("");
  };

  const handleSaveNewSkill = () => {
    if (!newSkillName.trim()) return;

    const level =
      newSkillLevel === "inherit"
        ? routineLevel
        : newSkillLevel === "custom"
          ? customSkillLevel
          : newSkillLevel;

    const payload = {
      name: newSkillName.trim(),
      level,
      description: newSkillDescription.trim(),
      link: newSkillLink.trim()
    };

    if (onSubmit) {
      onSubmit(payload);
    } else if (type === "addSkill") {
      addSkill(sportId, categoryId, payload);
    } else {
      addSkillToRoutine(sportId, categoryId, routineId, payload);
    }

    resetForm();
    onSave();
  };

useEffect(() => {
  if (skillName) {
    setNewSkillName(skillName);
  }
}, [skillName]);

  return (
    <div
      className="p-3 mb-4"
      style={{
        borderRadius: "16px",
        border: "1px solid #e6e6e6",
        backgroundColor: "#ffffff"
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <label
          className="form-label"
          style={{ color: "#1f2a44", fontWeight: 600 }}
        >
          Add Skill
        </label>

 
      </div>

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
          <option value="inherit">
            Use routine level ({routineLevel ?? "none"})
          </option>

          {levelOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

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
      <div className="d-flex gap-2 justify-content-end">
        <button
          className="btn btn-light"
          style={{
            borderRadius: "12px",
            border: "1px solid #dcdcdc",
            fontWeight: 600,
            padding: "6px 14px"
          }}
          onClick={() => {
            resetForm();
            onCancel();
          }}
        >
          Cancel
        </button>
               <button
          className="btn btn-sm"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            fontWeight: 600,
            borderRadius: "10px",
            padding: "6px 14px"
          }}
          onClick={handleSaveNewSkill}
        >
          + Add Skill
        </button>
      </div>
    </div>
  );
}
