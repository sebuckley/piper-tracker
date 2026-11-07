import { useState, useEffect } from "react";
import { DEFAULT_UI_LABELS } from "../../utils/DEFAULT_LABELS";

export default function CategoryHeader({
  sport,
  category,
  updateCategory,
  readOnly = false
}) {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");

  // ⭐ Sync when switching categories
  useEffect(() => {
    setName(category.name);
    setDescription(category.description || "");
  }, [category.id]);

  const save = () => {
    updateCategory(sport.id, category.id, {
      name: name.trim(),
      description: description.trim()
      // ⭐ Levels removed — sport now owns levels
    });
    setEditing(false);
  };

  return (
    <div
      className="mb-4"
      style={{
        width: "100%",
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e6e6e6",
        padding: "16px"
      }}
    >
      {!editing && (
        <>
          <h3
            className="h4 mb-2"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            {sport.uiLabels.categoryName?.trim() || DEFAULT_UI_LABELS.categoryName} Details
          </h3>

          <div
            style={{
              color: "#b300ff",
              fontWeight: 700,
              fontSize: "20px",
              marginBottom: "6px"
            }}
          >
            {category.name}
          </div>

          {category.description && (
            <div className="text-muted small mb-2">
              {category.description}
            </div>
          )}

          {!readOnly && <div className="d-flex justify-content-end">
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "10px",
                padding: "6px 14px"
              }}
              onClick={() => setEditing(true)}
            >
              Edit Category
            </button>
          </div>}
        </>
      )}

      {!readOnly && editing && (
        <>
          <h3
            className="h4 mb-3"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            Edit {sport.uiLabels.categoryName?.trim() || DEFAULT_UI_LABELS.categoryName }
          </h3>

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
