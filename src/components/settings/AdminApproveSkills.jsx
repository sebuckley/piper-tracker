import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminApprovals } from "./useAdminApprovals";
import AdminApprovalStatus from "./AdminApprovalStatus";

export default function AdminApproveSkills() {
  const { environment, adminLink, data, setData, error, busy, runAction, retry } = useAdminApprovals(["/api/pending/skills", "/api/templates"]);
  const pending = data?.[0] ?? [];
  const defaultSports = data?.[1] ?? [];
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
const getSportName = (item) => {

  if (!defaultSports) return "Unknown Sport";

  const sport = defaultSports.find(s => s.id === item.sportId);

  return sport ? sport.name : "Unknown Sport";
};

const getCategoryName = (item) => {
  if (!defaultSports) return "Unknown Category";

  const sport = defaultSports.find(s => s.id === item.sportId);

  if (!sport) return "Unknown Category";

  const category = (sport.categories || []).find(c => c.id === item.categoryId);

  return category ? category.name : "Unknown Category";
};


  const approve = item => runAction(async request => {
    await request("/api/approve/skill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: item.sportId,
        categoryId: item.categoryId,
        skill: item.skill
      })
    });

    await request(`/api/pending/skills/${encodeURIComponent(item.id)}`, {
      method: "DELETE"
    });

    setFeedback(`Approved "${item.skill.name}"`);
    setData(([list, templates]) => [list.filter(p => p.id !== item.id), templates]);

    setTimeout(() => navigate(adminLink), 1200);
  });

  const reject = item => runAction(async request => {
    await request(`/api/pending/skills/${encodeURIComponent(item.id)}`, {
      method: "DELETE"
    });

    setFeedback(`Rejected "${item.skill.name}"`);
    setData(([list, templates]) => [list.filter(p => p.id !== item.id), templates]);

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
          <span style={{ color: "#1f2a44" }}>Approve Skills</span>
        </nav>
      </div>
      <AdminApprovalStatus environment={environment} adminLink={adminLink} error={error} loading={!data} retry={retry} />
      
      <h2 className="h3 mb-4" style={{ color: "#b300ff", fontWeight: 700 }}>
        Pending Skill Approvals
      </h2>


      {data && pending.length === 0 && (
        <div className="p-3" style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff",
          fontWeight: 600
        }}>
          No pending skills.
        </div>
      )}

      {pending.map(item => (
        <div key={item.id} className="p-3 mb-3" style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff"
        }}>
          <strong style={{ color: "#b300ff", fontSize: "18px" }}>
            {item.skill.name}
          </strong>

          <div className="mt-2" style={{ color: "#1f2a44" }}>
            Sport: {getSportName(item)}<br />
            Category: {getCategoryName(item)}<br />
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
