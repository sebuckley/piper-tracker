import { useState } from "react";
import SessionForm from "./SessionForm";
import { useAppStore } from "../../../store/useAppStore";

export default function SessionsSection({ sport }) {
  const { deleteClassSession } = useAppStore();
  const [editingSession, setEditingSession] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mt-4">
      <h3 className="h4" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Sessions
      </h3>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-sm"
          style={{ backgroundColor: "#b300ff", color: "white", borderRadius: "10px" }}
          onClick={() => {
            setEditingSession(null);
            setShowForm(true);
          }}
        >
          + Add Session
        </button>
      </div>

      {showForm && (
        <SessionForm
          sport={sport}
          editingSession={editingSession}
          close={() => {
            setShowForm(false);
            setEditingSession(null);
          }}
        />
      )}

      {sport.classSessions.map(session => {
       
        return (
        <div
          key={session.id}
          className="p-3 mb-3"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <div className="d-flex justify-content-between">
            <div>
              <strong style={{ color: "#b300ff" }}>{session.day} - {session.time}</strong>

              {session.startDate && (
                <div className="small text-muted">
                  <strong>Starts:</strong>{" "}
                  {session.day} - {new Date(session.startDate).toLocaleDateString()}
                </div>
              )}

              <div className="small text-muted">
                <strong>Status:</strong> {session.status}
              </div>

              <div className="small text-muted">
                <strong>Club:</strong> {sport.clubs.find(c => c.id === session.clubId)?.name || "N/A" }
              </div>

              {session.categories?.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {session.categories.map(catId => {
                    const cat = sport.categories.find(c => c.id === catId);
                    return (
                      <span
                        key={catId}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "20px",
                          backgroundColor: "#b300ff10",
                          border: "1px solid #b300ff",
                          color: "#b300ff",
                          fontWeight: 600,
                          fontSize: "12px"
                        }}
                      >
                        {cat?.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
 
             <div className="d-flex align-items-center gap-2">
              <button
                className="btn"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dcdcdc",
                  color: "#1f2a44"
                }}
                onClick={() => {
                  setEditingSession(session);
                  setShowForm(true);
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                style={{ borderRadius: "10px" }}
                onClick={() => deleteClassSession(sport.id, session.id)}
              >
                Remove
              </button>
            </div>
            </div>
          </div>
      
      )})}

      {sport.classSessions?.length === 0 && (
        <div className="text-muted small">No sessions added yet.</div>
      )}
    </div>
  );
}
