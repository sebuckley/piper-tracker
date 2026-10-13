import { useParams, Link } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

export default function SportsCategories() {
  const { id } = useParams();
  const sports = useAppStore(s => s.sportsClasses);

  const sport = sports.find(s => s.id === id);

  if (!sport) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Sport not found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* Breadcrumb */}
      <div className="d-flex justify-content-start mb-3">
        <nav style={{ fontWeight: "600", fontSize: "15px" }}>
          <Link to="/sports" style={{ color: "#b300ff", textDecoration: "none" }}>
            Sports
          </Link>
          <span style={{ margin: "0 6px" }}>›</span>
          <Link to={`/sports/${sport.id}`} style={{ color: "#b300ff" }}>
            {sport.name}
          </Link>
          <span style={{ margin: "0 6px" }}>›</span>
          <span>Categories</span>
        </nav>
      </div>

      {/* Main Card */}
      <div className="card shadow-sm" style={{
        borderRadius: "20px",
        border: "2px solid #b300ff20",
        background: "linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)"
      }}>
        <div className="p-4">

          <h2 className="h4 mb-4" style={{ color: "#b300ff", fontWeight: "700" }}>
            {sport.name} — Categories
          </h2>

          {sport.categories.length === 0 && (
            <div className="text-muted small">No categories added yet.</div>
          )}

          {sport.categories.map(cat => (
            <Link
              key={cat.id}
              to={`/sports/${sport.id}/categories/${cat.id}`}
              className="text-decoration-none"
            >
              <div className="mb-3 p-3" style={{
                borderRadius: "16px",
                border: "1px solid #e6e6e6",
                backgroundColor: "#ffffff",
                boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
              }}>
                <h4 className="h6 mb-2" style={{ color: "#b300ff", fontWeight: "700" }}>
                  {cat.name}
                </h4>

                <div className="small text-muted">
                  <strong>Routines:</strong> {cat.routines.length}
                  <br />
                  <strong>Skills:</strong> {cat.skills.length}
                </div>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}
