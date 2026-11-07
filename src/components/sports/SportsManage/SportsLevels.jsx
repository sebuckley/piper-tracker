import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { useAppStore } from "../../../store/useAppStore";

export default function SportLevelsEditor({ sport, updateSport, edit = true }) {
  const [editing, setEditing] = useState(false);

  const addLevelToStore = useAppStore(state => state.addLevel);
  const updateLevelInStore = useAppStore(state => state.updateLevel);
  const deleteLevelFromStore = useAppStore(state => state.deleteLevel);

  const [levels, setLevels] = useState(sport.levels || []);
  
  useEffect(() => {
    setLevels(sport.levels || []);
  }, [sport.id]);

  const addLevel = () => {
    const nextValue =
      levels.length > 0
        ? Math.max(...levels.map(l => l.value)) + 1
        : 1;

    const label = `Level ${nextValue}`;

    const newLevel = {
      id: nanoid(),
      value: nextValue,
      label
    };

    setLevels(prev => [...prev, newLevel]);
    addLevelToStore(sport.id, label);
  };

  const updateLevelName = (index, value) => {
    const updated = [...levels];
    updated[index] = { ...updated[index], label: value };
    setLevels(updated);

    updateLevelInStore(sport.id, updated[index].id, value);
  };

  const removeLevel = index => {
    const level = levels[index];
    deleteLevelFromStore(sport.id, level.id);

    const updated = levels.filter((_, i) => i !== index);
    setLevels(updated);
  };

  const save = () => {
    updateSport(sport.id, { levels });
    setEditing(false);
  };

  return (
    <div className="mb-4" style={{ width: "100%", background: "white", marginTop: "16px" }}>
      {!editing && (
        <>
          <h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>
            {sport.name} Levels
          </h3>

          <div className="text-muted small mb-3">
            <strong>Levels:</strong>{" "}
            {levels.length > 0
              ? levels.map(l => l.label).join(", ")
              : "None"}
          </div>

          {edit && (
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#b300ff", color: "white", borderRadius: "10px" }}
                onClick={() => setEditing(true)}
              >
                + Add Level(s)
              </button>
            </div>
          )}
        </>
      )}

      {editing && edit && (
        <>
          <h3 className="h4 mb-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
            Edit Sport Levels
          </h3>

          {levels.map((lvl, index) => (
            <div key={lvl.id} className="d-flex gap-2 mb-2">
              <input
                className="form-control"
                value={lvl.label}
                onChange={e => updateLevelName(index, e.target.value)}
                style={{ borderRadius: "12px" }}
              />
              <button
                className="btn btn-danger btn-sm"
                style={{ borderRadius: "10px" }}
                onClick={() => removeLevel(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            className="btn btn-sm mb-3"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px"
            }}
            onClick={addLevel}
          >
            + Add Level
          </button>

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
              onClick={save}
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
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
