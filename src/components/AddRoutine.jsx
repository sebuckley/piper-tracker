import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function AddRoutine() {
  const addRoutine = useAppStore(s => s.addRoutine);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h2 className="h5 mb-3">Add Routine</h2>

        <input
          className="form-control mb-3"
          placeholder="Routine name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <select
          className="form-select mb-3"
          value={frequency}
          onChange={e => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>

        <button
          className="btn btn-warning"
          onClick={() => addRoutine(name, frequency)}
        >
          Save
        </button>
      </div>
    </div>
  );
}
