import { useState } from "react";
import { useAppStore } from "../../../store/useAppStore";
import { useNavigate } from "react-router-dom";

export default function CategoriesSection({ sport }) {
  const { addCategory, deleteCategory } = useAppStore();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const label = sport.categoryLabel || "Category";

  const saveCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(sport.id, newCategoryName.trim());
    setNewCategoryName("");
    setShowForm(false);
  };

  return (
    <div className="mt-4">
      <h3 className="h4" style={{ color: "#1f2a44", fontWeight: 600 }}>
        {label}s
      </h3>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-sm"
          style={{ backgroundColor: "#b300ff", color: "white", borderRadius: "10px" }}
          onClick={() => setShowForm(true)}
        >
          + Add {label}
        </button>
      </div>

      {showForm && (
        <div
          className="p-3 mb-4"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
            New {label}
          </label>

          <input
            className="form-control mb-3"
            placeholder={`Add a new ${label.toLowerCase()}`}
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          <div className="d-flex gap-2">
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px"
              }}
              onClick={saveCategory}
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
                setShowForm(false);
                setNewCategoryName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {sport.categories.length === 0 && (
        <div className="text-muted small">No {label.toLowerCase()}s added yet.</div>
      )}

      {sport.categories.map(cat => (
        <div
          key={cat.id}
          className="p-3 mb-3"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <div className="d-flex justify-content-between">
            <strong style={{ color: "#b300ff", fontSize: "16px" }}>
              {cat.name}
            </strong>

            <div className="d-flex gap-2">
              <button
                className="btn btn-sm"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dcdcdc",
                  color: "#1f2a44"
                }}
                onClick={() => navigate(`/sports/${sport.id}/categories/${cat.id}`)}
              >
                Manage
              </button>

              <button
                className="btn btn-sm btn-danger"
                style={{ borderRadius: "10px" }}
                onClick={() => deleteCategory(sport.id, cat.id)}
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
