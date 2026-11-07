import React, { useState } from "react";
import { useAppStore } from "../../../../store/useAppStore";

export default function AddRoutineForm({
  sportId,
  categoryId,
  categoryLevels = [],
  onCancel
}) {
  const addRoutine = useAppStore(s => s.addRoutine);

  const [name, setName] = useState("");
  const [level, setLevel] = useState(categoryLevels[0] || "1");
  const [customLevel, setCustomLevel] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    const finalLevel = level === "custom" ? customLevel : level;

    if (!name.trim()) return;

    addRoutine(sportId, categoryId, name.trim(), finalLevel, description.trim());

    // Reset internal state
    setName("");
    setLevel(categoryLevels[0] || "1");
    setCustomLevel("");
    setDescription("");

    onCancel(); // parent only closes the form
  };

  const handleCancel = () => {
    setName("");
    setLevel(categoryLevels[0] || "1");
    setCustomLevel("");
    setDescription("");
    onCancel();
  };

  return (
    <div
      className="p-3 mb-4"
      style={{
        borderRadius: "16px",
        border: "1px solid #e6e6e6",
        backgroundColor: "#ffffff"
      }}
    >
      <label
        className="form-label"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        New Routine
      </label>

      {/* Name */}
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Routine name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ borderRadius: "12px" }}
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Routine description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          style={{ borderRadius: "12px" }}
        />
      </div>

      {/* Level */}
      <div className="mb-3">
        <select
          className="form-control"
          value={level}
          onChange={e => setLevel(e.target.value)}
          style={{ borderRadius: "12px" }}
        >
          {categoryLevels.map((lvl, index) => (
            <option key={index} value={lvl.value}>
              {lvl.label}
            </option>
          ))}
        </select>
      </div>

      {level === "custom" && (
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Enter custom level"
            value={customLevel}
            onChange={e => setCustomLevel(e.target.value)}
            style={{ borderRadius: "12px" }}
          />
        </div>
      )}

      {/* Buttons */}
      <div className="d-flex gap-2 justify-content-end">
        <button
          className="btn"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            fontWeight: 600,
            borderRadius: "12px",
            padding: "6px 14px"
          }}
          onClick={handleSave}
        >
          Save
        </button>

        <button
          className="btn btn-light"
          style={{
            borderRadius: "12px",
            border: "1px solid #dcdcdc",
            fontWeight: 600,
            padding: "6px 14px"
          }}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
