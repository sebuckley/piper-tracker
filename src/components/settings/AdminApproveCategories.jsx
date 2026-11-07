import { useEffect, useState } from "react";
import { API_BASE } from "../../config/api";
import { useNavigate, Link } from "react-router-dom";

export default function AdminApproveCategories() {
  const [pending, setPending] = useState([]);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_BASE}/api/pending/categories`);
      setPending(await res.json());
    }
    load();
  }, []);

  const remove = async item => {
    await fetch(`${API_BASE}/api/pending/categories/${item.id}`, { method: "DELETE" });
    setPending(pending.filter(p => p.id !== item.id));
    setTimeout(() => navigate("/settings/admin"), 1200);
  };

  const approve = async item => {
    await fetch(`${API_BASE}/api/approve/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: item.sportId, category: item.category })
    });
    await remove(item);
    setFeedback(`Approved category "${item.category.name}"`);
  };

  const reject = async item => {
    await remove(item);
    setFeedback(`Rejected category "${item.category.name}"`);
  };

  const card = {
    borderRadius: "16px",
    border: "1px solid #e6e6e6",
    backgroundColor: "#ffffff"
  };

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link to="/settings/admin" style={{ color: "#b300ff", textDecoration: "none" }}>
            Admin Panel
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <span style={{ color: "#1f2a44" }}>Approve Categories</span>
        </nav>
      </div>

      <h2 className="h3 mb-4" style={{ color: "#b300ff", fontWeight: 700 }}>
        Pending Category Approvals
      </h2>

      {pending.length === 0 && (
        <div className="p-3" style={{ ...card, fontWeight: 600 }}>No pending categories.</div>
      )}

      {pending.map(item => (
        <div key={item.id} className="p-3 mb-3" style={card}>
          <strong style={{ color: "#b300ff", fontSize: "18px" }}>{item.category.name}</strong>

          <div className="mt-2" style={{ color: "#1f2a44" }}>
            Sport: {item.sportName || item.sportId}<br />
            Submitted by: {item.submittedBy}<br />
            At: {new Date(item.submittedAt).toLocaleString()}
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn"
              style={{ backgroundColor: "#b300ff", color: "white", fontWeight: 600, borderRadius: "12px" }}
              onClick={() => approve(item)}
            >
              Approve
            </button>
            <button
              className="btn btn-light"
              style={{ borderRadius: "12px", border: "1px solid #dcdcdc", fontWeight: 600 }}
              onClick={() => reject(item)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      {feedback && (
        <div className="p-3 mt-3" style={{ ...card, color: "#1f2a44", fontWeight: 600 }}>
          {feedback}
        </div>
      )}
    </div>
  );
}
