import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { Link } from "react-router-dom";

export default function BehaviourTemplates() {
  const behaviourTemplates = useAppStore(s => s.behaviourTemplates);
  const addBehaviourTemplate = useAppStore(s => s.addBehaviourTemplate);
  const updateBehaviourTemplate = useAppStore(s => s.updateBehaviourTemplate);
  const deleteBehaviourTemplate = useAppStore(s => s.deleteBehaviourTemplate);

  const [showAddForm, setShowAddForm] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStars, setNewStars] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStars, setEditStars] = useState(1);

  const detectType = (stars) => (stars < 0 ? "negative" : "positive");

  const cleanInput = (raw, previous) => {
    if (raw === "-") return -1;
    let val = Number(raw);
    if (isNaN(val)) return previous;
    if (val === 0) return previous < 0 ? -1 : 1;
    return val;
  };

  const inc = (val) => (val >= 0 ? val + 1 : val + 1 === 0 ? 1 : val + 1);
  const dec = (val) => (val <= 0 ? val - 1 : val - 1 === 0 ? -1 : val - 1);

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>

      {/* Breadcrumb */}
      <div
        className="mb-3"
        style={{ fontSize: "18px", fontWeight: 600, textAlign: "left" }}
      >
          <Link
            to="/settings"
            style={{
              color: "#b300ff",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "18px"
            }}
          >
            Settings
          </Link>
        <span style={{ color: "#1f2a44", margin: "0 8px" }}>/</span>
        <span style={{ color: "#1f2a44" }}>Behaviour Templates</span>
      </div>

      {/* Page Title */}
      <h2
        className="h3 mt-3 mb-4"
        style={{
          color: "#b300ff",
          fontWeight: 700,
          letterSpacing: "0.5px",
          textAlign: "left"
        }}
      >
        Behaviour Templates
      </h2>

      {/* Section Header + Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3
          className="h4"
          style={{ color: "#1f2a44", fontWeight: 600 }}
        >
          Templates
        </h3>

        <button
          className="btn"
          style={{
            background: "#b300ff",
            color: "white",
            borderRadius: "10px",
            padding: "6px 14px",
            fontWeight: 600
          }}
          onClick={() => setShowAddForm(true)}
        >
          Add Template
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div
          className="mb-4"
          style={{
            background: "white",
            border: "1px solid #e6e6e6",
            borderRadius: "16px",
            padding: "20px"
          }}
        >
          <h4
            className="h5 mb-3"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            Add Behaviour Template
          </h4>

          <div className="row">
            <div className="col-md-4 mb-3">
              <input
                className="form-control"
                style={{ borderRadius: "12px" }}
                placeholder="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>

            <div className="col-md-4 mb-3">
              <input
                className="form-control"
                style={{ borderRadius: "12px" }}
                placeholder="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div className="col-md-4 mb-3 d-flex align-items-center gap-2">
              <button
                className="btn"
                style={{
                  background: "#cc0033",
                  color: "white",
                  borderRadius: "10px",
                  width: "40px"
                }}
                onClick={() => setNewStars(dec(newStars))}
              >
                –
              </button>

              <input
                type="text"
                className="form-control text-center"
                style={{ borderRadius: "12px", width: "70px" }}
                value={newStars}
                onChange={(e) => setNewStars(cleanInput(e.target.value, newStars))}
              />

              <button
                className="btn"
                style={{
                  background: "#28a745",
                  color: "white",
                  borderRadius: "10px",
                  width: "40px"
                }}
                onClick={() => setNewStars(inc(newStars))}
              >
                +
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn"
              style={{
                background: "#b300ff",
                color: "white",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={() => {
                if (!newCategory.trim()) return;
                const type = detectType(newStars);
                addBehaviourTemplate(newCategory, newDesc, newStars, type);
                setShowAddForm(false);
                setNewCategory("");
                setNewDesc("");
                setNewStars(1);
              }}
            >
              Save
            </button>

            <button
              className="btn"
              style={{
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Template List */}
      {behaviourTemplates.map((t) => {
        const isNegative = detectType(t.stars) === "negative";
        const accentColor = isNegative ? "#cc0033" : "#28a745";

        return (
          <div
            key={t.id}
            className="mb-4 d-flex"
            style={{
              background: "white",
              border: "1px solid #e6e6e6",
              borderRadius: "16px",
              padding: "20px"
            }}
          >
            {/* Accent Bar */}
            <div
              style={{
                width: "6px",
                background: accentColor,
                borderRadius: "6px",
                marginRight: "16px"
              }}
            />

            {/* Content + Actions */}
            {editingId === t.id ? (
              <div style={{ flexGrow: 1 }}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <input
                      className="form-control"
                      style={{ borderRadius: "12px" }}
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="Category"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <input
                      className="form-control"
                      style={{ borderRadius: "12px" }}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Description"
                    />
                  </div>

                  <div className="col-md-4 mb-3 d-flex align-items-center gap-2">
                    <button
                      className="btn"
                      style={{
                        background: "#cc0033",
                        color: "white",
                        borderRadius: "10px",
                        width: "40px"
                      }}
                      onClick={() => setEditStars(dec(editStars))}
                    >
                      –
                    </button>

                    <input
                      type="text"
                      className="form-control text-center"
                      style={{ borderRadius: "12px", width: "70px" }}
                      value={editStars}
                      onChange={(e) =>
                        setEditStars(cleanInput(e.target.value, editStars))
                      }
                    />

                    <button
                      className="btn"
                      style={{
                        background: "#28a745",
                        color: "white",
                        borderRadius: "10px",
                        width: "40px"
                      }}
                      onClick={() => setEditStars(inc(editStars))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn"
                    style={{
                      background: "#b300ff",
                      color: "white",
                      borderRadius: "10px",
                      padding: "6px 14px",
                      fontWeight: 600
                    }}
                    onClick={() => {
                      const type = detectType(editStars);
                      updateBehaviourTemplate(t.id, {
                        category: editCategory,
                        desc: editDesc,
                        stars: editStars,
                        type
                      });
                      setEditingId(null);
                    }}
                  >
                    Save
                  </button>

                  <button
                    className="btn"
                    style={{
                      background: "white",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      padding: "6px 14px",
                      fontWeight: 600
                    }}
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="d-flex justify-content-between align-items-start w-100"
                style={{ textAlign: "left" }}
              >
                <div>
                  <strong style={{ color: "#000", fontWeight: 600 }}>
                    {t.category}
                  </strong>

                  <div style={{ fontWeight: 600, color: "#000" }}>
                    ⭐{t.stars}
                  </div>

                  <div className="small" style={{ color: "#000" }}>
                    {t.desc}
                  </div>

                  <div
                    className="small mt-1"
                    style={{
                      color: accentColor,
                      fontWeight: 600
                    }}
                  >
                    {isNegative ? "Negative Feedback" : "Positive Feedback"}
                  </div>
                </div>

                <div
                  className="d-flex flex-column align-items-end gap-2"
                  style={{ minWidth: "150px" }}
                >
                  <button
                    className="btn"
                    style={{
                      background: "white",
                      border: "1px solid #dcdcdc",
                      borderRadius: "10px",
                      padding: "6px 14px",
                      fontWeight: 600,
                      color: "#0d6efd"
                    }}
                    onClick={() => {
                      setEditingId(t.id);
                      setEditCategory(t.category);
                      setEditDesc(t.desc);
                      setEditStars(t.stars);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn"
                    style={{
                      background: "red",
                      color: "white",
                      borderRadius: "10px",
                      padding: "6px 14px",
                      fontWeight: 600
                    }}
                    onClick={() => deleteBehaviourTemplate(t.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
