import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function SportsClassSessions({ sportId }) {
  
  const sport = useAppStore(s =>
    s.sportsClasses.find(sc => sc.id === sportId)
  );

  const addClassSession = useAppStore(s => s.addClassSession);
  const updateClassSession = useAppStore(s => s.updateClassSession);
  const deleteClassSession = useAppStore(s => s.deleteClassSession);

  const [editingSessionId, setEditingSessionId] = useState(null);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const startAdd = () => {
    setEditingSessionId("new");
    setDay("");
    setTime("");
  };

  const startEdit = (session) => {
    setEditingSessionId(session.id);
    setDay(session.day);
    setTime(session.time);
  };

  const saveSession = () => {
    if (!day || !time) return;

    if (editingSessionId === "new") {
      addClassSession(sportId, day, time);
    } else {
      updateClassSession(sportId, editingSessionId, { day, time });
    }

    setEditingSessionId(null);
    setDay("");
    setTime("");
  };

  const cancelEdit = () => {
    setEditingSessionId(null);
    setDay("");
    setTime("");
  };

  return (
    <div className="card p-4 shadow-sm" style={{ borderRadius: "16px" }}>
      <h2 className="h5 mb-3">{sport.name} — Class Sessions</h2>



      {/* Inline editor */}
      {editingSessionId !== null && (
        <div
          className="p-3 mb-4"
          style={{
            borderRadius: "12px",
            border: "1px solid #e6e6e6",
            backgroundColor: "white"
          }}
        >
          <h5 className="mb-3">
            {editingSessionId === "new" ? "Add Session" : "Edit Session"}
          </h5>

          <label className="form-label">Day</label>
          <select
            className="form-select mb-3"
            value={day}
            onChange={e => setDay(e.target.value)}
            style={{ borderRadius: "10px" }}
          >
            <option value="">Select day</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>

          <label className="form-label">Time</label>
          <input
            type="time"
            className="form-control mb-3"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{ borderRadius: "10px" }}
          />

          <div className="d-flex gap-2">
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: "600",
                borderRadius: "10px"
              }}
              onClick={saveSession}
            >
              Save
            </button>

            <button
              className="btn btn-outline-secondary"
              style={{ borderRadius: "10px" }}
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sessions table */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Day</th>
            <th>Time</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sport.classSessions.map(session => (
            <tr key={session.id}>
              <td>{session.day}</td>
              <td>{session.time}</td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => startEdit(session)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteClassSession(sportId, session.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add button */}
      {editingSessionId === null && (
        <button
          className="btn mb-3"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            fontWeight: "600",
            borderRadius: "10px"
          }}
          onClick={startAdd}
        >
          Add Class Session
        </button>
      )}
    </div>
  );
}
