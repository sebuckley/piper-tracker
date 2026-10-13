import { useState } from "react"; 
import { useParams, Link } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

export default function SessionHistory() {
  const { id } = useParams();

  const sports = useAppStore(s => s.sportsClasses);
  const feedback = useAppStore(s => s.sportsFeedback);

  const updateFeedback = useAppStore(s => s.updateFeedback);
  const removeFeedback = useAppStore(s => s.removeFeedback);

  const [editingSession, setEditingSession] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const sport = sports.find(s => s.id === id);

  if (!sport) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Sport not found.</div>
      </div>
    );
  }

  const sportFeedback = feedback.filter(f => f.sportId === sport.id);

  // ⭐ Save edited session
  const saveEditedSession = (updated) => {
    updateFeedback(updated.id, updated);
    setEditingSession(null);
  };

  // ⭐ Delete session
  const deleteSession = (id) => {
    removeFeedback(id);
    setDeleteConfirm(null);
  };


return (
  <div className="container mt-4">

    {/* ⭐ Breadcrumb */}
    <div className="mb-3">
      <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
        <Link to="/sports" style={{ color: "#b300ff", textDecoration: "none" }}>
          Sports
        </Link>

        <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

        <Link
          to={`/sports/${sport.id}`}
          style={{ color: "#b300ff", textDecoration: "none" }}
        >
          {sport.name}
        </Link>

        <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

        <span style={{ color: "#1f2a44" }}>Session History</span>
      </nav>
    </div>

    {/* ⭐ Page Title */}
    <h2
      className="h3 mt-3 mb-4"
      style={{
        color: "#b300ff",
        fontWeight: 700,
        letterSpacing: "0.5px"
      }}
    >
      {sport.name} — Session History
    </h2>

    {/* ⭐ Sessions List */}
    {sportFeedback.length === 0 && (
      <div className="text-muted small">No feedback sessions recorded yet.</div>
    )}

    <div className="d-flex flex-column gap-3">
      {sportFeedback.map(session => {
        const category = sport.categories.find(c => c.id === session.categoryId);
        const routine = category?.routines.find(r => r.id === session.routineId);

        return (
<div
  key={session.id}
  className="p-3"
  style={{
    borderRadius: "12px",
    border: "1px solid #e6e6e6",
    backgroundColor: "#ffffff"
  }}
>
  <div className="d-flex flex-column flex-md-row justify-content-between gap-5">

    {/* ⭐ LEFT SIDE (two rows, centered on mobile) */}
    <div
      className="d-flex flex-column text-center text-md-start"
      style={{ flexGrow: 1 }}
    >

      {/* Row 1 — Date */}
      <div
        style={{
          color: "#b300ff",
          fontWeight: 700,
          fontSize: "16px",
          marginBottom: "6px"
        }}
      >
        {new Date(session.date).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric"
        })}
      </div>

      {/* ⭐ Row 2 — FULL WIDTH */}
      <div
        className="
          d-flex 
          flex-column flex-md-row 
          align-items-center align-items-md-center 
          gap-3
          text-center text-md-start
        "
        style={{ width: "100%" }}
      >

        {/* Category — left */}
        <div
          className="small"
          style={{
            color: "#1f2a44",
            flex: "0 0 auto",
            minWidth: "140px"
          }}
        >
          <strong>Category:</strong>{" "}
          <span style={{ color: "#b300ff", fontWeight: 600 }}>
            {category?.name || "Unknown"}
          </span>
        </div>

        {/* Notes — center, flexible */}
        <div
          className="small"
          style={{
            color: "#1f2a44",
            flex: 1,
            textAlign: "center"
          }}
        >
          <strong>Notes:</strong> {session.notes || "No notes"}
        </div>

        {/* Score — right */}
        <div
          className="small"
          style={{
            color: "#b300ff",
            fontWeight: 700,
            flex: "0 0 auto",
            minWidth: "80px",
            textAlign: "right"
          }}
        >
          ⭐ {session.score}
        </div>
      </div>
    </div>

    {/* ⭐ RIGHT SIDE BUTTONS (centered on mobile, vertical on desktop) */}
    <div
      className="
        d-flex 
        flex-row flex-md-column 
        gap-2 
        mt-3 mt-md-0 
        justify-content-center justify-content-md-end
        text-center
      "
    >
      <button
        className="btn btn-sm"
        style={{
          backgroundColor: "white",
          border: "1px solid #dcdcdc",
          borderRadius: "10px",
          fontWeight: 600,
          color: "#1f2a44"
        }}
        onClick={() => setEditingSession(session)}
      >
        Edit
      </button>

      <button
        className="btn btn-sm btn-danger"
        style={{ borderRadius: "10px", fontWeight: 600 }}
        onClick={() => setDeleteConfirm(session.id)}
      >
        Remove
      </button>
    </div>

  </div>
</div>




        );
      })}
    </div>

    {/* ⭐ Edit Modal */}
    {editingSession && (
      <div
        className="p-4 mt-4"
        style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff"
        }}
      >
        <h3 className="h4 mb-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
          Edit Session
        </h3>

        <label className="form-label" style={{ color: "#1f2a44" }}>
          Notes
        </label>
        <textarea
          className="form-control mb-3"
          value={editingSession.notes}
          onChange={e =>
            setEditingSession({ ...editingSession, notes: e.target.value })
          }
          style={{ borderRadius: "12px", minHeight: "120px" }}
        />

        <label className="form-label" style={{ color: "#1f2a44" }}>
          Score
        </label>
        <input
          type="number"
          className="form-control mb-3"
          value={editingSession.score}
          onChange={e =>
            setEditingSession({
              ...editingSession,
              score: Number(e.target.value)
            })
          }
          style={{ borderRadius: "12px" }}
        />

        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px"
            }}
            onClick={() => saveEditedSession(editingSession)}
          >
            Save
          </button>

          <button
            className="btn btn-light"
            style={{
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              fontWeight: 600
            }}
            onClick={() => setEditingSession(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* ⭐ Delete Confirmation */}
    {deleteConfirm && (
      <div
        className="p-4 mt-4"
        style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff"
        }}
      >
        <h3 className="h4 mb-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
          Remove Session
        </h3>

        <p style={{ color: "#1f2a44" }}>
          Are you sure you want to remove this session?
        </p>

        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-danger"
            style={{
              borderRadius: "10px",
              fontWeight: 600,
              padding: "6px 14px"
            }}
            onClick={() => deleteSession(deleteConfirm)}
          >
            Remove
          </button>

          <button
            className="btn btn-light"
            style={{
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              fontWeight: 600
            }}
            onClick={() => setDeleteConfirm(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    )}

  </div>
);




}
