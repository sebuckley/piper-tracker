import { useState } from "react";
import { API_BASE } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore"; 
import { Link } from "react-router-dom";
import { useAdminApprovals } from "./useAdminApprovals";
import AdminApprovalStatus from "./AdminApprovalStatus";

export default function AdminApproveSports() {

  const { environment, apiBase, adminLink, data, setData, error, busy, runAction, retry } = useAdminApprovals(["/api/pending/sports"]);
  const pending = data?.[0] ?? [];
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const loadDefaultSports = useAppStore(state => state.loadDefaultSports);


  const approveSport = submission => runAction(async request => {
    await request("/api/approve/sport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sport: submission.sport })
    });

    await request(`/api/pending/sports/${encodeURIComponent(submission.id)}`, { method: "DELETE" });
    setData(([list]) => [list.filter(p => p.id !== submission.id)]);
    setFeedback(`Approved "${submission.sport.name}"`);
    if (apiBase === API_BASE) await loadDefaultSports();
    setTimeout(() => navigate(adminLink), 1200);
  });

  const rejectSport = submission => runAction(async request => {
    await request(`/api/pending/sports/${encodeURIComponent(submission.id)}`, {
      method: "DELETE"
    });

    setFeedback(`Rejected "${submission.sport.name}"`);
    setData(([list]) => [list.filter(p => p.id !== submission.id)]);
    setTimeout(() => navigate(adminLink), 1200);
  });

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb */}
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link to={adminLink} style={{ color: "#b300ff", textDecoration: "none" }}>
            Admin Panel
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <span style={{ color: "#1f2a44" }}>Approve Sports</span>
        </nav>
      </div>
      <AdminApprovalStatus environment={environment} adminLink={adminLink} error={error} loading={!data} retry={retry} />
      
      <h2 className="h3 mb-4" style={{ color: "#b300ff", fontWeight: 700 }}>
        Pending Sport Approvals
      </h2>



      {data && pending.length === 0 && (
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
              disabled={busy}
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
              disabled={busy}
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
