import { useParams, Link } from "react-router-dom";
import SessionsSection from "./SessionsSection";
import ClubsSection from "./ClubsSection";
import CategoriesSection from "./CategoriesSection";
import { useAppStore } from "../../../store/useAppStore";

export default function SportsManage() {
  const { id } = useParams();
  const sports = useAppStore(s => s.sportsClasses);
  const sport = sports.find(s => s.id === id);

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
          to={`/sports/${sport.id}`}
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
      <CategoriesSection sport={sport} />
    </div>
  );
}
