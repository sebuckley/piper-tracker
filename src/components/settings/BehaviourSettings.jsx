import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function BehaviourTemplates() {
  const behaviourTemplates = useAppStore(s => s.behaviourTemplates);
  const addBehaviourTemplate = useAppStore(s => s.addBehaviourTemplate);
  const updateBehaviourTemplate = useAppStore(s => s.updateBehaviourTemplate);
  const deleteBehaviourTemplate = useAppStore(s => s.deleteBehaviourTemplate);

  const [newCategory, setNewCategory] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStars, setNewStars] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStars, setEditStars] = useState(1);

  // ⭐ Auto-detect positive/negative based on stars
  const detectType = (stars) => (stars < 0 ? "negative" : "positive");

  // ⭐ Fix zero and detect negative typing
  const cleanInput = (raw, previous) => {
    if (raw === "-") return -1; // user typed minus
    let val = Number(raw);

    if (isNaN(val)) return previous; // ignore invalid typing

    if (val === 0) {
      return previous < 0 ? -1 : 1; // never allow zero
    }

    return val;
  };

  // ⭐ Increment / Decrement helpers
  const inc = (val) => (val >= 0 ? val + 1 : val + 1 === 0 ? 1 : val + 1);
  const dec = (val) => (val <= 0 ? val - 1 : val - 1 === 0 ? -1 : val - 1);

  return (
    <div
      className="card shadow-sm mt-4"
      style={{ borderRadius: "16px", border: "1px solid #e6e6e6" }}
    >
      <div className="p-4">

        <h2 className="h5 mb-4" style={{ color: "#1f2a44", fontWeight: "600" }}>
          Behaviour Templates
        </h2>

        {/* ⭐ Add Behaviour Template */}
        <div className="row mb-4">

          <div className="col-md-4 mb-2">
            <input
              className="form-control"
              placeholder="Behaviour category"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="col-md-4 mb-2">
            <input
              className="form-control"
              placeholder="Description"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              style={{ borderRadius: "10px" }}
            />
          </div>

          {/* ⭐ Stars with + / - buttons */}
          <div className="col-md-2 mb-2 d-flex align-items-center gap-2">

            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#cc0033",
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
              value={newStars}
              onChange={e => setNewStars(cleanInput(e.target.value, newStars))}
              style={{ borderRadius: "10px", width: "70px" }}
            />

            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#28a745",
                color: "white",
                borderRadius: "10px",
                width: "40px"
              }}
              onClick={() => setNewStars(inc(newStars))}
            >
              +
            </button>

          </div>

          <div className="col-md-2 mb-2">
            <button
              className="btn w-100"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: "600",
                borderRadius: "12px"
              }}
              onClick={() => {
                if (!newCategory.trim()) return;

                const finalStars = newStars;
                const type = detectType(finalStars);

                addBehaviourTemplate(newCategory, newDesc, finalStars, type);

                setNewCategory("");
                setNewDesc("");
                setNewStars(1);
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* ⭐ Behaviour Template List */}
        <ul className="list-group">
          {behaviourTemplates.map(t => {
            const type = detectType(t.stars);
            const isNegative = type === "negative";

            return (
              <li
                key={t.id}
                className="list-group-item"
                style={{ borderRadius: "10px", marginBottom: "14px" }}
              >
                {editingId === t.id ? (
                  <>
                    <input
                      className="form-control mb-2"
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value)}
                      style={{ borderRadius: "10px" }}
                    />

                    <input
                      className="form-control mb-2"
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                      style={{ borderRadius: "10px" }}
                    />

                    {/* ⭐ Stars with + / - buttons */}
                    <div className="d-flex align-items-center gap-2 mb-3">

                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#cc0033",
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
                        value={editStars}
                        onChange={e =>
                          setEditStars(cleanInput(e.target.value, editStars))
                        }
                        style={{ borderRadius: "10px", width: "70px" }}
                      />

                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          borderRadius: "10px",
                          width: "40px"
                        }}
                        onClick={() => setEditStars(inc(editStars))}
                      >
                        +
                      </button>

                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success"
                        style={{ borderRadius: "10px" }}
                        onClick={() => {
                          const finalStars = editStars;
                          const finalType = detectType(finalStars);

                          updateBehaviourTemplate(t.id, {
                            category: editCategory,
                            desc: editDesc,
                            stars: finalStars,
                            type: finalType
                          });

                          setEditingId(null);
                        }}
                      >
                        Save
                      </button>

                      <button
                        className="btn btn-secondary"
                        style={{ borderRadius: "10px" }}
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong
                        style={{
                          color: isNegative ? "#cc0033" : "#28a745",
                          fontWeight: "600"
                        }}
                      >
                        {t.category} ⭐{t.stars}
                      </strong>

                      <div className="text-muted small">{t.desc}</div>

                      <div
                        className="small"
                        style={{ color: isNegative ? "#cc0033" : "#28a745" }}
                      >
                        {isNegative ? "Negative Feedback" : "Positive Feedback"}
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        style={{ borderRadius: "10px" }}
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
                        className="btn btn-outline-danger btn-sm"
                        style={{ borderRadius: "10px" }}
                        onClick={() => deleteBehaviourTemplate(t.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

      </div>
    </div>
  );
}
