import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAdminApprovals } from "./useAdminApprovals";
import AdminApprovalStatus from "./AdminApprovalStatus";

export default function AdminApproveRoutines() {
  const { environment, adminLink, data, setData, error, busy, runAction, retry } = useAdminApprovals(["/api/pending/routines"]);
  const pending = data?.[0] ?? [];
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const approve = item => runAction(async request => {
    await request("/api/approve/routine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: item.sportId,
        categoryId: item.categoryId,
        routine: item.routine,
        skills: item.skills || []
      })
    });

    await request(`/api/pending/routines/${encodeURIComponent(item.id)}`, {
      method: "DELETE"
    });

    setFeedback(`Approved routine "${item.routine.name}"`);
    setData(([list]) => [list.filter(p => p.id !== item.id)]);

    setTimeout(() => navigate(adminLink), 1200);
  });

  const reject = item => runAction(async request => {
    await request(`/api/pending/routines/${encodeURIComponent(item.id)}`, {
      method: "DELETE"
    });

    setFeedback(`Rejected routine "${item.routine.name}"`);
    setData(([list]) => [list.filter(p => p.id !== item.id)]);

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
          <span style={{ color: "#1f2a44" }}>Approve Routines</span>
        </nav>
      </div>
      <AdminApprovalStatus environment={environment} adminLink={adminLink} error={error} loading={!data} retry={retry} />

      <h2 className="h3 mb-4" style={{ color: "#b300ff", fontWeight: 700 }}>
        Pending Routine Approvals
      </h2>

      {data && pending.length === 0 && (
        <div className="p-3" style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff",
          fontWeight: 600
        }}>
          No pending routines.
        </div>
      )}

      {pending.map(item => (
        <div key={item.id} className="p-3 mb-3" style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff"
        }}>

          <strong style={{ color: "#b300ff", fontSize: "18px" }}>
            {item.routine.name}
          </strong>

          <div className="mt-2" style={{ color: "#1f2a44" }}>
            Sport: {item.sportName || item.sportId}<br />
            Category: {item.categoryName || item.categoryId}<br />
            Level: {item.routine.level}<br />
            Skills: {(item.routine.skills || []).map(ref =>
              (item.skills || []).find(sk => sk.id === ref)?.name || ref
            ).join(", ") || "None"}<br />
            {(item.skills || []).length > 0 && (
              <span className="text-muted small">
                Includes {(item.skills || []).length} skill(s) that will be added to the template if missing.<br />
              </span>
            )}
            Submitted by: {item.submittedBy}<br />
            At: {new Date(item.submittedAt).toLocaleString()}
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
              onClick={() => approve(item)}
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
              onClick={() => reject(item)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      {feedback && (
        <div className="p-3 mt-3" style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff",
          color: "#1f2a44",
          fontWeight: 600
        }}>
          {feedback}
        </div>
      )}
    </div>
  );
}
