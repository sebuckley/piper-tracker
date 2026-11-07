import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { DEFAULT_UI_LABELS } from "../utils/DEFAULT_LABELS";

export default function SportsClasses() {
  const sports = useAppStore(s => s.sportsClasses);

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
      <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
        <span style={{ color: "#1f2a44" }}>Sports & Activities</span>
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
      Sports & Activities
    </h2>

    {/* ⭐ Section Header + Add Button */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3
        className="h4"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        All Sports / Activities
      </h3>

      <Link
        to="/sports/add"
        className="btn"
        style={{
          backgroundColor: "#b300ff",
          color: "white",
          fontWeight: 600,
          borderRadius: "10px",
          padding: "6px 14px"
        }}
      >
        + Add New Sport / Activity
      </Link>
    </div>

    {/* ⭐ No sports */}
    {sports.length === 0 && (
      <div className="text-muted small">
        No sports added yet. Click “Add New Sport” to begin.
      </div>
    )}

    {/* ⭐ Sports List */}
    {sports.map(sport => {
      const totalRoutines = sport.categories.reduce(
        (acc, c) => acc + c.routines.length,
        0
      );

      const totalSkills = sport.categories.reduce((acc, c) => {
        const routineSteps = c.routines.reduce(
          (rAcc, r) => rAcc + (r.steps?.length || 0),
          0
        );
        return acc + c.skills.length + routineSteps;
      }, 0);

      return (
        <div
          key={sport.id}
          className="mb-4"
          style={{
            background: "white",
            border: "1px solid #e6e6e6",
            borderRadius: "16px",
            padding: "16px",
            width: "100%"
          }}
        >
          {/* ⭐ Sport Name */}
          <h4
            className="h5 mb-3"
            style={{
              color: "#b300ff",
              fontWeight: 700,
              borderBottom: "2px solid #b300ff20",
              paddingBottom: "6px"
            }}
          >
            {sport.name}
          </h4>

          {/* ⭐ Summary */}
          <div className="row mb-3">

            <div className="col-6 col-md-3 mb-3 text-center">
              <div style={{ color: "#1f2a44", fontWeight: 600 }}>Classes / Sessions</div>
              <div
                style={{
                  color: "#b300ff",
                  fontWeight: 700,
                  fontSize: "2rem",
                  lineHeight: "1.2"
                }}
              >
                {sport.classSessions.length}
              </div>
            </div>

            <div className="col-6 col-md-3 mb-3 text-center">
              <div style={{ color: "#1f2a44", fontWeight: 600 }}>{sport.uiLabels?.categoryName || DEFAULT_UI_LABELS.categoryName}</div>
              <div
                style={{
                  color: "#b300ff",
                  fontWeight: 700,
                  fontSize: "2rem",
                  lineHeight: "1.2"
                }}
              >
                {sport.categories.length}
              </div>
            </div>

            <div className="col-6 col-md-3 mb-3 text-center">
              <div style={{ color: "#1f2a44", fontWeight: 600 }}>{sport.uiLabels?.routinePlural || DEFAULT_UI_LABELS.routinePlural}</div>
              <div
                style={{
                  color: "#b300ff",
                  fontWeight: 700,
                  fontSize: "2rem",
                  lineHeight: "1.2"
                }}
              >
                {totalRoutines}
              </div>
            </div>

            <div className="col-6 col-md-3 mb-3 text-center">
              <div style={{ color: "#1f2a44", fontWeight: 600 }}>Skills</div>
              <div
                style={{
                  color: "#b300ff",
                  fontWeight: 700,
                  fontSize: "2rem",
                  lineHeight: "1.2"
                }}
              >
                {totalSkills}
              </div>
            </div>

          </div>

          {/* ⭐ Action Buttons */}
<div className="d-flex gap-3 flex-wrap justify-content-end">

  <Link
    to={`/sports/${sport.templateId}`}
    className="btn"
    style={{
      backgroundColor: "#b300ff",
      color: "white",
      fontWeight: 600,
      borderRadius: "10px",
      padding: "6px 14px"
    }}
  >
    View Details
  </Link>

  <Link
    to={`/sports/${sport.templateId}/feedback`}
    className="btn"
    style={{
      backgroundColor: "#b300ff",
      color: "white",
      fontWeight: 600,
      borderRadius: "10px",
      padding: "6px 14px"
    }}
  >
    Add Feedback
  </Link>

  <Link
    to={`/sports/${sport.templateId}/history`}
    className="btn"
    style={{
      backgroundColor: "#b300ff",
      color: "white",
      fontWeight: 600,
      borderRadius: "10px",
      padding: "6px 14px"
    }}
  >
    History
  </Link>

  <Link
    to={`/sports/${sport.templateId}/manage`}
    className="btn"
    style={{
      backgroundColor: "#b300ff",
      color: "white",
      fontWeight: 600,
      borderRadius: "10px",
      padding: "6px 14px"
    }}
  >
    Manage
  </Link>

</div>

        </div>
      );
    })}
  </div>
);

}
