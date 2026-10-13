import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export default function SportsClasses() {
  const sports = useAppStore(s => s.sportsClasses);

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb */}
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <span style={{ color: "#1f2a44" }}>Sports & Activities</span>
        </nav>
      </div>

      {/* ⭐ Page Title */}
      <h2
        className="h3 mt-3 mb-4"
        style={{
          color: "#b300ff",
          fontWeight: 700,
          letterSpacing: "0.5px"
        }}
      >
        Sports & Activities
      </h2>

      {/* ⭐ Add New Sport Button */}
      <div className="d-flex justify-content-end align-items-center mb-4">
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

        const totalSkills =
          sport.categories.reduce(
            (acc, c) =>
              acc +
              c.skills.length +
              c.routines.reduce((rAcc, r) => rAcc + r.skills.length, 0),
            0
          );

        return (
          <div
            key={sport.id}
            className="mb-4 p-3"
            style={{
              borderRadius: "16px",
              border: "1px solid #e6e6e6",
              backgroundColor: "#ffffff"
            }}
          >
            {/* ⭐ Sport Name */}
            <h4
              className="h6 mb-3"
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
            <div className="row text-muted small mb-3">

              <div className="col-md-3 mb-2">
                <strong style={{ color: "#1f2a44" }}>Sessions:</strong>
                <br />
                <span style={{ color: "#b300ff", fontWeight: 700 }}>
                  {sport.classSessions.length}
                </span>
              </div>

              <div className="col-md-3 mb-2">
                <strong style={{ color: "#1f2a44" }}>Categories:</strong>
                <br />
                <span style={{ color: "#b300ff", fontWeight: 700 }}>
                  {sport.categories.length}
                </span>
              </div>

              <div className="col-md-3 mb-2">
                <strong style={{ color: "#1f2a44" }}>Routines:</strong>
                <br />
                <span style={{ color: "#b300ff", fontWeight: 700 }}>
                  {totalRoutines}
                </span>
              </div>

              <div className="col-md-3 mb-2">
                <strong style={{ color: "#1f2a44" }}>Skills:</strong>
                <br />
                <span style={{ color: "#b300ff", fontWeight: 700 }}>
                  {totalSkills}
                </span>
              </div>

            </div>

            {/* ⭐ Action Buttons */}
            <div className="d-flex gap-3 flex-wrap justify-content-end">

              <Link
                to={`/sports/${sport.id}`}
                className="btn btn-light"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dcdcdc",
                  fontWeight: 600
                }}
              >
                View Details
              </Link>

              <Link
                to={`/sports/${sport.id}/feedback`}
                className="btn btn-light"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dcdcdc",
                  fontWeight: 600
                }}
              >
                Add Feedback
              </Link>

              <Link
                to={`/sports/${sport.id}/history`}
                className="btn btn-light"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dcdcdc",
                  fontWeight: 600
                }}
              >
                History
              </Link>

              <Link
                to={`/sports/${sport.id}/manage`}
                className="btn btn-light"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dcdcdc",
                  fontWeight: 600
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
