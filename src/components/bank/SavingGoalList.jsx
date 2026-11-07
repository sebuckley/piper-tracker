import { useState } from "react";
import { nanoid } from "nanoid";
import useAppStore from "../../../store/useAppStore";
import SavingsGoalCard from "./SavingsGoalCard";

export default function SavingsGoalList({ childId }) {
  const goals = useAppStore(state => state.bankAccounts[childId]?.goals || []);
  const addGoal = useAppStore(state => state.addGoal);
  const updateGoal = useAppStore(state => state.updateGoal);
  const deleteGoal = useAppStore(state => state.deleteGoal);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const resetForm = () => {
    setName("");
    setTarget("");
  };

  const saveGoal = () => {
    if (!name || !target) return;

    addGoal(childId, {
      id: nanoid(),
      name: name.trim(),
      target: Number(target)
    });

    resetForm();
    setAdding(false);
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
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        Savings Goals
      </h3>

      {/* List of goals */}
      {goals.length === 0 && (
        <div className="text-muted small mb-3">
          No savings goals yet
        </div>
      )}

      {goals.map(goal => (
        <SavingsGoalCard
          key={goal.id}
          childId={childId}
          goal={goal}
          updateGoal={updateGoal}
          deleteGoal={deleteGoal}
        />
      ))}

      {/* Add Goal Button */}
      {!adding && (
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            borderRadius: "10px"
          }}
          onClick={() => setAdding(true)}
        >
          + Add Goal
        </button>
      )}

      {/* Hidden Add Goal Form */}
      {adding && (
        <div className="mt-3">
          <div className="small mb-1">New Savings Goal</div>

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Goal name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          <input
            type="number"
            className="form-control mb-3"
            placeholder="Target amount"
            value={target}
            onChange={e => setTarget(e.target.value)}
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
              onClick={saveGoal}
            >
              Save
            </button>

            <button
              className="btn btn-light btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc"
              }}
              onClick={() => {
                resetForm();
                setAdding(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
