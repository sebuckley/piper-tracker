import { useParams, Link, useNavigate } from "react-router-dom";
import SessionsSection from "./SessionsSection";
import ClubsSection from "./ClubsSection";
import CategoriesSection from "./CategoriesSection";
import SportLevelsEditor from "./SportsLevels";
import { useAppStore } from "../../../store/useAppStore";


export default function SportsManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const deleteSport = useAppStore(s => s.deleteSport);
  const sports = useAppStore(s => s.sportsClasses);
  const sport = sports.find(s => s.templateId === id);


  if (!sport) {
    return <div className="container mt-4">Sport not found.</div>;
  }

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb (restored) */}
      <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
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
        <span style={{ color: "#1f2a44" }}>Manage</span>
      </nav>

      {/* ⭐ Page Title */}
      <h2
        className="h3 mb-4"
        style={{ color: "#b300ff", fontWeight: 700 }}
      >
        Manage {sport.name}
      </h2>

      <ClubsSection sport={sport} />
      <SessionsSection sport={sport} />
      <SportLevelsEditor sport={sport} updateSport={() => {}} />
      <CategoriesSection sport={sport} />

      <div className="p-3 mb-4" style={{ borderRadius: "16px", border: "1px solid #e6e6e6", backgroundColor: "#ffffff" }}>
        <strong style={{ color: "#c0392b" }}>Danger zone</strong>
        <div className="text-muted small mt-1">
          Removes {sport.name} and its clubs, sessions from this child only.
        </div>
        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-sm"
            style={{ backgroundColor: "#c0392b", color: "white", fontWeight: 600, borderRadius: "10px", padding: "6px 14px" }}
            onClick={() => {
              if (window.confirm(`Delete ${sport.name} for this child? This cannot be undone.`)) {
                deleteSport(sport.templateId);
                navigate("/sports");
              }
            }}
          >
            Delete Sport
          </button>
        </div>
      </div>

    </div>
  );
}
