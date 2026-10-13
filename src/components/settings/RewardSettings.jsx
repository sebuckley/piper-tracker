import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function RewardsSettings() {

  const rewards = useAppStore(s => s.rewards);
  const addReward = useAppStore(s => s.addReward);
  const updateReward = useAppStore(s => s.updateReward);
  const deleteReward = useAppStore(s => s.deleteReward);
  const [newRepeatable, setNewRepeatable] = useState(false);


  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Treat");
  const [newCost, setNewCost] = useState(5);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCost, setEditCost] = useState(0);

  return (
    <div
      className="card shadow-sm mt-4"
      style={{ borderRadius: "16px", border: "1px solid #e6e6e6" }}
    >
      <div className="p-4">

        <h2
          className="h5 mb-4"
          style={{ color: "#1f2a44", fontWeight: "600" }}
        >
          Reward Templates
        </h2>

        {/* Add Reward Template */}
        <div className="row mb-4">
          <div className="col-md-4 mb-2">
            <input
              className="form-control"
              placeholder="Reward name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="col-md-3 mb-2">
            <select
              className="form-select"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              style={{ borderRadius: "10px" }}
            >
              <option>Treat</option>
              <option>Activity</option>
              <option>Privilege</option>
            </select>
          </div>

          <div className="col-md-3 mb-2">
            <select
                className="form-select"
                value={newRepeatable}
                onChange={e => setNewRepeatable(e.target.value === "true")}
                style={{ borderRadius: "10px" }}
            >
                <option value="false">One-off</option>
                <option value="true">Repeatable</option>
            </select>
            </div>


          <div className="col-md-2 mb-2">
            <input
              type="number"
              min="1"
              className="form-control"
              value={newCost}
              onChange={e => setNewCost(Number(e.target.value))}
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="col-md-3 mb-2">
            <button
              className="btn w-100"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: "600",
                borderRadius: "12px"
              }}
              onClick={() => {
                if (!newName.trim()) return;
                addReward(newName.trim(), newCategory, newCost);
                setNewName("");
                setNewCost(5);
              }}
            >
              Add Reward
            </button>
          </div>
        </div>

        {/* Reward Template List */}
        <ul className="list-group">
          {rewards.map(r => (
            <li
              key={r.id}
              className="list-group-item"
              style={{ borderRadius: "10px", marginBottom: "14px" }}
            >
              {editingId === r.id ? (
                <div className="row mb-3">
                  <div className="col-md-4 mb-2">
                    <input
                      className="form-control"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{ borderRadius: "10px" }}
                    />
                  </div>

                  <div className="col-md-3 mb-2">
                    <select
                      className="form-select"
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value)}
                      style={{ borderRadius: "10px" }}
                    >
                      <option>Treat</option>
                      <option>Activity</option>
                      <option>Privilege</option>
                    </select>
                  </div>

                  <div className="col-md-3 mb-2">
  <select
                className="form-select"
                value={newRepeatable}
                onChange={e => setNewRepeatable(e.target.value === "true")}
                style={{ borderRadius: "10px" }}
            >
                <option value="false">One-off</option>
                <option value="true">Repeatable</option>
            </select>
            </div>


                  <div className="col-md-2 mb-2">
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={editCost}
                      onChange={e => setEditCost(Number(e.target.value))}
                      style={{ borderRadius: "10px" }}
                    />
                  </div>

                  <div className="col-md-3 mb-2 d-flex gap-2">
                    <button
                      className="btn btn-success w-50"
                      style={{ borderRadius: "10px" }}
                      onClick={() => {
                        updateReward(r.id, {
                          name: editName,
                          category: editCategory,
                          cost: editCost,
                          repeatable: newRepeatable     
                        });
                        setEditingId(null);
                      }}
                    >
                      Save
                    </button>

                    <button
                      className="btn btn-secondary w-50"
                      style={{ borderRadius: "10px" }}
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong style={{ color: "#1f2a44" }}>{r.name}</strong>
                    <div className="text-muted small">{r.category}</div>
                    <div className="text-muted small">Cost: {r.cost} ⭐</div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      style={{ borderRadius: "10px" }}
                      onClick={() => {
                        setEditingId(r.id);
                        setEditName(r.name);
                        setEditCategory(r.category);
                        setEditCost(r.cost);
                        setNewRepeatable(r.repeatable);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      style={{ borderRadius: "10px" }}
                      onClick={() => deleteReward(r.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
