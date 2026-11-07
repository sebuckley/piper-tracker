import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { Link } from "react-router-dom";

export default function AdminTemplateList() {
  const [templates, setTemplates] = useState([]);
  const defaultSports = useAppStore(s => s.defaultSports);
  const loadDefaultSports = useAppStore(s => s.loadDefaultSports);
  const deleteTemplate = useAppStore(s => s.deleteTemplate);

  useEffect(() => {
    setTemplates(defaultSports);
  }, [defaultSports]);

  async function handleDeleteTemplate(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sport template?"
    );

    if (!confirmDelete) return;

    await deleteTemplate(id);

  }

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb */}
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link to="/settings/" style={{ color: "#b300ff", textDecoration: "none" }}>
            Settings
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <Link to="/settings/admin" style={{ color: "#b300ff", textDecoration: "none" }}>
            Admin
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <span style={{ color: "#1f2a44" }}>Templates</span>
        </nav>
      </div>

      <h2 className="h3 mb-4" style={{ color: "#b300ff", fontWeight: 700 }}>
        Global Templates
      </h2>

      {templates.map(t => (
        <div
          key={t.id}
          className="p-3 mb-3 d-flex align-items-center"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff",
            gap: "16px"
          }}
        >
          {/* ⭐ Icon placeholder */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#f2e6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b300ff",
              fontWeight: 700,
              fontSize: "18px"
            }}
          >
            {t.name?.charAt(0) ?? 0}
          </div>

          {/* ⭐ Accent bar */}
          <div
            style={{
              width: "6px",
              height: "100%",
              backgroundColor: "#b300ff",
              borderRadius: "6px"
            }}
          ></div>

          {/* ⭐ Template name */}
          <div style={{ flexGrow: 1 }}>
            <strong style={{ color: "#1f2a44", fontSize: "18px" }}>
              {t.name}
            </strong>
          </div>

          {/* ⭐ Edit */}
          <Link
            to={`/settings/admin/template/${t.id}`}
            className="btn me-2"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "12px"
            }}
          >
            Edit
          </Link>

          {/* ⭐ Delete */}
          <button
            className="btn"
            style={{
              backgroundColor: "#cc0033",
              color: "white",
              fontWeight: 600,
              borderRadius: "12px"
            }}
            onClick={() => handleDeleteTemplate(t.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
