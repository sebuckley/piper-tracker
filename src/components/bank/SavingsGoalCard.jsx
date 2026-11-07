import { useState } from "react";
import useAppStore from "../../../store/useAppStore";

export default function SavingsGoalCard({ childId, goal, updateGoal, deleteGoal }) {
  const getBalance = useAppStore(state => state.getBalance);
  const balance = getBalance(childId);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(goal.name);
  const [target, setTarget] = useState(goal.target);

  const progress = Math.min(balance / target, 1);
  const percent = Math.round(progress * 100);

  const save = () => {
    updateGoal(childId, goal.id, {
      name: name.trim(),
      target: Number(target)
    });
    setEditing(false);
  };

  return (
    <div
      className="p-3 mb-4"
      style={{
        background: "white",
        borderRadius: "14px",
        border: "1px solid #e6e6e6"
      }}
    >
      {!editing && (
        <>
          <h4
            className="h5 mb-2"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            {goal.name}
          </h4>

          <div className="small text-muted mb-1">
            Target: €{goal.target.toFixed(2)}
          </div>

          <div className="small text-muted mb-2">
            Saved: €{balance.toFixed(2)}
          </div>

          {/* Progress Bar */}
          <div
            style={{
              height: "10px",
              background: "#f0f0f0",
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                background: "#b300ff"
              }}
            />
          </div>

          <div className="small text-muted mb-3">
            {percent}% complete
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                borderRadius: "10px"
              }}
              onClick={() => setEditing(true)}
            >
              Edit Goal
            </button>

            <button
              className="btn btn-light btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc"
              }}
              onClick={() => deleteGoal(childId, goal.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}

      {/* Hidden Editor */}
      {editing && (
        <>
          <h4
            className="h5 mb-3"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            Edit Savings Goal
          </h4>

          <input
            type="text"
            className="form-control mb-2"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Goal name"
            style={{ borderRadius: "12px" }}
          />

          <input
            type="number"
            className="form-control mb-3"
            value={target}
            onChange={e => setTarget(e.target.value)}
            placeholder="Target amount"
            style={{ borderRadius: "12px" }}
          />

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                borderRadius: "10px"
              }}
              onClick={save}
            >
              Save
            </button>

            <button
              className="btn btn-light btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc"
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
