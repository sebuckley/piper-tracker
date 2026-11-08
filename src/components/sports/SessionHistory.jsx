import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import FeedbackEntryDetails from "./FeedbackEntryDetails";

export default function SessionHistory() {
  const { sportId } = useParams();

  const sports = useAppStore(s => s.sportsClasses);
  const feedbackSessions = useAppStore(s => s.sportsFeedback);
  const isViewer = useAppStore(s => s.isViewer());

  const removeSession = useAppStore(s => s.removeFeedbackSession);

  const sport = sports.find(s => s.templateId === sportId);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  if (!sport) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Sport not found.</div>
      </div>
    );
  }

  // Older sessions may store the instance id or only the sport name
  const sessions = feedbackSessions
    .filter(
      f =>
        f.sportId === sport.templateId ||
        f.sportId === sport.id ||
        (f.sportName && f.sportName === sport.name)
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

return (
  <div
    className="container mt-4"
    style={{
      maxWidth: "1200px",
      background: "white",
      borderRadius: "16px",
      padding: "24px",
      border: "2px solid #e6e6e6"
    }}
  >
    {/* ⭐ Breadcrumb */}
    <nav className="mb-3" style={{ fontWeight: 600, fontSize: "18px" }}>
      <Link to="/sports" style={{ color: "#b300ff", textDecoration: "none" }}>
        Sports
      </Link>
      <span style={{ margin: "0 6px", color: "#1f2a44" }}>›</span>
      <Link
        to={`/sports/${sport.templateId}`}
        style={{ color: "#b300ff", textDecoration: "none" }}
      >
        {sport.name}
      </Link>
      <span style={{ margin: "0 6px", color: "#1f2a44" }}>›</span>
      <span style={{ color: "#1f2a44" }}>Session History</span>
    </nav>

    {/* ⭐ Page Title */}
    <h2
      className="h3 mb-4 text-center"
      style={{ color: "#b300ff", fontWeight: 700, letterSpacing: "0.5px" }}
    >
      {sport.name} — Session History
    </h2>

    {/* ⭐ No Sessions */}
    {sessions.length === 0 && (
      <div className="text-muted small">No feedback sessions recorded yet.</div>
    )}

    {/* ⭐ Sessions List */}
    <div className="d-flex flex-column gap-3">
      {sessions.map(session => (
        <div
          key={session.id}
          className="p-3"
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e6e6e6"
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between gap-4">

            {/* ⭐ LEFT SIDE */}
            <div style={{ flexGrow: 1 }}>
              
              {/* Date */}
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

              {/* ⭐ Score + Stars */}
              <div className="small mb-2 d-flex align-items-center gap-3">
                <span
                  className="badge"
                  style={{ backgroundColor: session.mode === "simple" ? "#6c757d" : "#b300ff" }}
                >
                  {session.mode === "simple" ? "Simple" : "Detailed"}
                </span>

                {session.mode !== "simple" && (
                  <div>
                    <strong>Score:</strong> {session.score ?? "N/A"}
                  </div>
                )}

                <div style={{ fontSize: "22px" }}>
                  {!session.starsAwarded ? (
                    <span style={{ color: "#ccc" }}>No stars</span>
                  ) : (
                    <span style={{ color: "#f5b800" }}>
                      {session.starsAwarded <= 5
                        ? "⭐".repeat(session.starsAwarded)
                        : `⭐ ${session.starsAwarded}`}
                    </span>
                  )}
                </div>
              </div>

              {session.mode === "simple" ? (
                <div className="small mb-2" style={{ whiteSpace: "pre-wrap" }}>
                  {session.notes || session.overall?.summary || "No feedback text"}
                </div>
              ) : (
                <>
                  {/* ⭐ Summary */}
                  <div className="small mb-2">
                    <strong>Summary:</strong>{" "}
                    {session.overall?.summary || "No summary"}
                  </div>

                  {/* ⭐ Overall Ratings */}
                  <div className="small d-flex gap-3">
                    <div><strong>Effort:</strong> {session.overall?.effort}</div>
                    <div><strong>Listening:</strong> {session.overall?.listening}</div>
                    <div><strong>Behaviour:</strong> {session.overall?.behaviour}</div>
                  </div>

                  {/* ⭐ Entries */}
                  <div className="mt-3">
                    <strong>Entries:</strong>
                    <ul className="small mt-2">
                      {(session.entries || []).map(e => (
                        <li key={e.id} className="mb-2">
                          <FeedbackEntryDetails entry={e} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* ⭐ RIGHT SIDE BUTTONS */}
            <div className="d-flex flex-row flex-md-column gap-2 text-center">
              {!isViewer && <button
                className="btn btn-sm btn-danger"
                style={{ borderRadius: "10px", fontWeight: 600 }}
                onClick={() => setDeleteConfirm(session.id)}
              >
                Remove
              </button>}
            </div>

          </div>
        </div>
      ))}
    </div>

    {/* ⭐ Delete Confirmation */}
{!isViewer && deleteConfirm && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e6e6e6",
        padding: "24px",
        width: "90%",
        maxWidth: "420px",
        textAlign: "center"
      }}
    >
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        Remove Session
      </h3>

      <p style={{ color: "#1f2a44", marginBottom: "20px" }}>
        Are you sure you want to remove this session?
      </p>

      <div className="d-flex justify-content-center gap-3">
        <button
          className="btn"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            fontWeight: 600,
            borderRadius: "10px",
            padding: "8px 18px"
          }}
          onClick={() => {
            removeSession(deleteConfirm);
            setDeleteConfirm(null);
          }}
        >
          Confirm
        </button>

        <button
          className="btn"
          style={{
            backgroundColor: "white",
            border: "1px solid #dcdcdc",
            color: "#1f2a44",
            fontWeight: 600,
            borderRadius: "10px",
            padding: "8px 18px"
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


  </div>
);

}
