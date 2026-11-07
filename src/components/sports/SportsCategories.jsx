import { useParams, Link } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

export default function SportsCategories() {
  const { id } = useParams();
  const sports = useAppStore(s => s.sportsClasses);

  const sport = sports.find(s => s.templateId === id);

  if (!sport) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Sport not found.</div>
      </div>
    );
  }

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
    <div className="mb-3">
      <nav
        style={{
          fontWeight: 600,
          fontSize: "18px",
          textAlign: "left"
        }}
      >
        <Link to="/sports" style={{ color: "#b300ff", textDecoration: "none" }}>
          Sports & Activities
        </Link>

        <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

        <Link
          to={`/sports/${sport.templateId}`}
          style={{ color: "#b300ff", textDecoration: "none" }}
        >
          {sport.name}
        </Link>

        <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

        <span style={{ color: "#1f2a44" }}>{sport.uiLabels?.categoryName || "Categories"}</span>
      </nav>
    </div>

    {/* ⭐ Page Title */}
    <h2
      className="h3 mt-3 mb-4 text-center"
      style={{
        color: "#b300ff",
        fontWeight: 700,
        letterSpacing: "0.5px"
      }}
    >
      {sport.name} — {sport.uiLabels?.categoryName || "Categories"}
    </h2>

    {/* ⭐ Section Header */}
    <h3
      className="h4 mb-3"
      style={{ color: "#1f2a44", fontWeight: 600 }}
    >
      All {sport.uiLabels?.categoryName || "Categories"}
    </h3>

    {/* ⭐ No Categories */}
    {sport.categories.length === 0 && (
      <div className="text-muted small mb-3">No categories added yet.</div>
    )}

    {/* ⭐ Category List */}
    {sport.categories.map(cat => (
      <Link
        key={cat.id}
        to={`/sports/${sport.templateId}/categories/${cat.templateId}`}
        className="text-decoration-none"
      >
        <div
          className="mb-3 p-3"
          style={{
            width: "100%",
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          {/* ⭐ Category Name */}
          <h4
            className="h6 mb-2"
            style={{ color: "#b300ff", fontWeight: 700 }}
          >
            {cat.name}
          </h4>

          {/* ⭐ Numbers */}
          <div className="d-flex gap-3 flex-wrap small text-muted">

            <div
              style={{
                background: "#f8f8f8",
                padding: "8px 12px",
                borderRadius: "12px",
                border: "1px solid #e6e6e6",
                minWidth: "120px",
                textAlign: "center"
              }}
            >
              <div className="small text-muted">Routines</div>
              <div style={{ color: "#b300ff", fontWeight: 700, fontSize: "18px" }}>
                {cat.routines.length}
              </div>
            </div>

            <div
              style={{
                background: "#f8f8f8",
                padding: "8px 12px",
                borderRadius: "12px",
                border: "1px solid #e6e6e6",
                minWidth: "120px",
                textAlign: "center"
              }}
            >
              <div className="small text-muted">Skills</div>
              <div style={{ color: "#b300ff", fontWeight: 700, fontSize: "18px" }}>
                {cat.skills.length}
              </div>
            </div>

          </div>
        </div>
      </Link>
    ))}

  </div>
);

}
