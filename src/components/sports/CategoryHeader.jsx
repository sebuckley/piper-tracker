import { useState } from "react";

export default function CategoryHeader({
  sport,
  category,
  updateCategory
}) {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");

  // ⭐ SINGLE SOURCE OF TRUTH
  const [levels, setLevels] = useState(category.levels || []);

  const addLevel = () => {
    setLevels([...levels, `Level ${levels.length + 1}`]);
  };

  const updateLevelName = (index, value) => {
    const updated = [...levels];
    updated[index] = value;
    setLevels(updated);
  };

  const removeLevel = index => {
    const updated = levels.filter((_, i) => i !== index);
    setLevels(updated);
  };

  const save = () => {
    updateCategory(sport.id, category.id, {
      name: name.trim(),
      description: description.trim(),
      levels
    });
    setEditing(false);
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
      {!editing && (
        <>
          <h3
            className="h4 mb-2"
            style={{ color: "#b300ff", fontWeight: 700 }}
          >
            {category.name}
          </h3>

          {category.description && (
            <div className="text-muted small mb-2">
              {category.description}
            </div>
          )}

          <div className="text-muted small mb-3">
            <strong>Levels:</strong>{" "}
            {levels.length > 0 ? levels.join(", ") : "None"}
          </div>

          <button
            className="btn btn-sm"
            style={{
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              color: "#1f2a44",
              fontWeight: 600
            }}
            onClick={() => setEditing(true)}
          >
            Edit Category
          </button>
        </>
      )}

      {editing && (
        <>
          <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
            Edit Category
          </label>

          <input
            className="form-control mb-3"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Category name"
            style={{ borderRadius: "12px" }}
          />

          <textarea
            className="form-control mb-3"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            style={{ borderRadius: "12px" }}
          />

          <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
            Levels
          </label>

          {levels.map((lvl, index) => (
            <div key={index} className="d-flex gap-2 mb-2">
              <input
                className="form-control"
                value={lvl}
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
              borderRadius: "10px"
            }}
            onClick={addLevel}
          >
            + Add Level
          </button>

          <div className="d-flex gap-2">
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px"
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
                fontWeight: 600
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
