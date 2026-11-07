import { useEffect, useState } from "react";
import { API_BASE } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore"; 
import { Link } from "react-router-dom";

export default function AdminApproveSports() {

  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const loadDefaultSports = useAppStore(state => state.loadDefaultSports);


  // ⭐ Load pending sports from Worker
  useEffect(() => {
    async function loadPending() {
      const res = await fetch(`${API_BASE}/api/pending/sports`);
      const data = await res.json();
      console.log(data);
      setPending(data);
      setLoading(false);
    }
    loadPending();
  }, []);

  // ⭐ Approve sport → add to GLOBAL_TEMPLATES
  const approveSport = async (submission) => {
    const res = await fetch(`${API_BASE}/api/approve/sport`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sport: submission.sport })
    });

    if (res.ok) {

      console.log(`Approved sport: ${submission.sport.name}`);
      setFeedback(`Approved "${submission.sport.name}"`);
      // Remove from UI
      setPending(pending.filter(p => p.id !== submission.id));

      // Delete from pending list
      await fetch(`${API_BASE}/api/pending/sports/${submission.id}`, {
        method: "DELETE"
      });

      await loadDefaultSports();

      setTimeout(() => navigate("/settings/admin"), 1200);
    }
  };

  // ⭐ Reject sport → delete from GLOBAL_SUBMISSIONS
  const rejectSport = async (submission) => {
    await fetch(`${API_BASE}/api/pending/sports/${submission.id}`, {
      method: "DELETE"
    });

    setFeedback(`Rejected "${submission.sport.name}"`);
    setPending(pending.filter(p => p.id !== submission.id));

    setTimeout(() => navigate("/settings/admin"), 1200);
  };

  if (loading) {
    return <div className="container mt-4">Loading pending sports…</div>;
  }

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb */}
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link to="/settings/admin" style={{ color: "#b300ff", textDecoration: "none" }}>
            Admin Panel
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <span style={{ color: "#1f2a44" }}>Approve Sports</span>
        </nav>
      </div>
      
      <h2 className="h3 mb-4" style={{ color: "#b300ff", fontWeight: 700 }}>
        Pending Sport Approvals
      </h2>



      {pending.length === 0 && (
        <div className="p-3" style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff",
          fontWeight: 600
        }}>
          No pending sports.
        </div>
      )}

      {pending.map(sub => (
        <div
          key={sub.id}
          className="p-3 mb-3"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <strong style={{ color: "#b300ff", fontSize: "18px" }}>
            {sub.sport.name}
          </strong>

          <div className="mt-2" style={{ color: "#1f2a44" }}>
            Submitted by: {sub.submittedBy}<br />
            At: {new Date(sub.submittedAt).toLocaleString()}
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px"
              }}
              onClick={() => approveSport(sub)}
            >
              Approve
            </button>

            <button
              className="btn btn-light"
              style={{
                borderRadius: "12px",
                border: "1px solid #dcdcdc",
                fontWeight: 600
              }}
              onClick={() => rejectSport(sub)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      {feedback && (
        <div
          className="p-3 mt-3"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff",
            color: "#1f2a44",
            fontWeight: 600
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
