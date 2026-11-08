import { Link, useNavigate } from "react-router-dom";
import { useAdminApprovals } from "./useAdminApprovals";

const pendingPaths = [
  "/api/pending/sports", "/api/pending/skills", "/api/pending/routines",
  "/api/pending/clubs", "/api/pending/club-updates", "/api/pending/categories",
  "/api/pending/rewards"
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { environment, apiBase, query, data, error, retry } = useAdminApprovals(pendingPaths);
  const counts = data ? {
    sports: data[0].length, skills: data[1].length, routines: data[2].length,
    clubs: data[3].length + data[4].length, categories: data[5].length, rewards: data[6].length
  } : { sports: "—", skills: "—", routines: "—", clubs: "—", categories: "—", rewards: "—" };

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb */}
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link
            to="/settings"
            style={{
              color: "#b300ff",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            Settings
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 8px" }}>›</span>
          <span style={{ color: "#1f2a44" }}>Admin Panel</span>
        </nav>
      </div>

      {/* ⭐ Page Title */}
      <h2
        className="h3 mt-3 mb-4"
        style={{ color: "#b300ff", fontWeight: 700, letterSpacing: "0.5px" }}
      >
        Admin Panel
      </h2>

      <div className={`alert ${environment === "production" ? "alert-warning" : "alert-info"} text-start`}>
        <label htmlFor="admin-environment" className="form-label fw-bold">Approval environment</label>
        <select
          id="admin-environment"
          className="form-select"
          value={environment}
          onChange={event => navigate(`?environment=${event.target.value}`)}
        >
          {!environment && <option value="" disabled>Select an environment</option>}
          <option value="development">Development</option>
          <option value="production">Production</option>
        </select>
        <div className="small mt-2">
          Approval lists, approvals and rejections use {apiBase}.
          {environment === "production" ? " Changes affect live production data." : " The local development Worker must be running on this device."}
          {" "}Developer tools and template editing still use the app's normal API.
        </div>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error} <button type="button" className="btn btn-sm btn-outline-danger" onClick={retry}>Retry</button></div>}
      {!data && !error && <div role="status" className="mb-3">Loading approval counts…</div>}

      {/* ⭐ Stats Overview */}
      <div className="row mb-4">
        <div className="col-6 col-md-3 mb-3">
          <div className="p-3" style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "#b300ff" }}>
              {counts.sports}
            </div>
            <div style={{ color: "#1f2a44", fontWeight: 600 }}>
              Pending Sports
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3 mb-3">
          <div className="p-3" style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "#b300ff" }}>
              {counts.skills}
            </div>
            <div style={{ color: "#1f2a44", fontWeight: 600 }}>
              Pending Skills
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3 mb-3">
          <div className="p-3" style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "#b300ff" }}>
              {counts.routines}
            </div>
            <div style={{ color: "#1f2a44", fontWeight: 600 }}>
              Pending Routines
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3 mb-3">
          <div className="p-3" style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "#b300ff" }}>
              {counts.clubs}
            </div>
            <div style={{ color: "#1f2a44", fontWeight: 600 }}>
              Pending Clubs
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ Tools & Management */}
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        Tools & Management
      </h3>

      {/* ⭐ Developer Tools */}
      <div className="p-3 mb-3"
        style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff"
        }}
      >
        <strong style={{ color: "#b300ff", fontSize: "16px" }}>
          Developer Tools
        </strong>

        <div className="d-flex justify-content-end mt-2">
          <Link
            to="/settings/admin/dev"
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px",
              textDecoration: "none"
            }}
          >
            Open Dev Tools
          </Link>
        </div>
      </div>

      {/* ⭐ Approvals */}
      <div className="p-3 mb-3"
        style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff"
        }}
      >
        <strong style={{ color: "#b300ff", fontSize: "16px" }}>
          Approvals
        </strong>

        <div className="d-flex flex-wrap gap-2 mt-2">
          <Link
            to={`/settings/admin/approve-sports${query}`}
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px",
              textDecoration: "none"
            }}
          >
            Approve Sports ({counts.sports})
          </Link>

          <Link
            to={`/settings/admin/approveskills${query}`}
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px",
              textDecoration: "none"
            }}
          >
            Approve Skills ({counts.skills})
          </Link>

          <Link
            to={`/settings/admin/approveroutines${query}`}
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px",
              textDecoration: "none"
            }}
          >
            Approve Routines ({counts.routines})
          </Link>

          <Link
            to={`/settings/admin/approvecategories${query}`}
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px",
              textDecoration: "none"
            }}
          >
            Approve Categories ({counts.categories})
          </Link>

          <Link
            to={`/settings/admin/approverewards${query}`}
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px",
              textDecoration: "none"
            }}
          >
            Approve Rewards ({counts.rewards ?? 0})
          </Link>

          <Link
            to={`/settings/admin/approveclubs${query}`}
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px",
              textDecoration: "none"
            }}
          >
            Approve Clubs ({counts.clubs})
          </Link>
        </div>
      </div>

      {/* ⭐ Global Templates */}
      <div className="p-3 mb-3"
        style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          backgroundColor: "#ffffff"
        }}
      >
        <strong style={{ color: "#b300ff", fontSize: "16px" }}>
          Global Templates
        </strong>

        <div className="d-flex justify-content-end mt-2">
          <Link
            to="/settings/admin/templates"
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px",
              textDecoration: "none"
            }}
          >
            Open templates list
          </Link>
        </div>
      </div>

    </div>
  );
}
