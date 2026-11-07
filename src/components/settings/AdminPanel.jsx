import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config/api";

export default function AdminPanel() {
  const [counts, setCounts] = useState({
    sports: 0,
    skills: 0,
    routines: 0,
    clubs: 0
  });

  useEffect(() => {
    async function loadCounts() {
      const [sports, skills, routines, clubs, clubUpdates, categories, rewards] = await Promise.all([
        fetch(`${API_BASE}/api/pending/sports`).then(r => r.json()),
        fetch(`${API_BASE}/api/pending/skills`).then(r => r.json()),
        fetch(`${API_BASE}/api/pending/routines`).then(r => r.json()),
        fetch(`${API_BASE}/api/pending/clubs`).then(r => r.json()),
        fetch(`${API_BASE}/api/pending/club-updates`).then(r => r.json()),
        fetch(`${API_BASE}/api/pending/categories`).then(r => r.json()),
        fetch(`${API_BASE}/api/pending/rewards`).then(r => r.json()).catch(() => [])
      ]);

      setCounts({
        sports: sports.length,
        skills: skills.length,
        routines: routines.length,
        categories: categories.length,
        rewards: rewards.length,
        clubs: clubs.length + clubUpdates.length,
        clubUpdates: clubUpdates.length
      });
    }

    loadCounts();
  }, []);

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
            to="/settings/admin/approve-sports"
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
            to="/settings/admin/approveskills"
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
            to="/settings/admin/approveroutines"
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
            to="/settings/admin/approvecategories"
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
            to="/settings/admin/approverewards"
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
            to="/settings/admin/approveclubs"
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
