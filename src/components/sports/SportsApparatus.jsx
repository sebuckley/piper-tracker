import { useParams, Link } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

export default function SportsApparatus() {
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

      {/* ⭐ Breadcrumb */}
      <div className="d-flex justify-content-start mb-3">
        <nav
          style={{
            fontWeight: "600",
            fontSize: "15px"
          }}
        >
          <Link
            to="/sports"
            style={{
              color: "#b300ff",
              textDecoration: "none"
            }}
          >
            Sports
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <Link
            to={`/sports/${sport.id}`}
            style={{
              color: "#b300ff",
              textDecoration: "none"
            }}
          >
            {sport.name}
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <span style={{ color: "#1f2a44" }}>
            Apparatus
          </span>
        </nav>
      </div>

      {/* ⭐ Main Card */}
      <div
        className="card shadow-sm"
        style={{
          borderRadius: "20px",
          border: "2px solid #b300ff20",
          background: "linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)"
        }}
      >
        <div className="p-4">

          {/* Title */}
          <h2
            className="h4 mb-4"
            style={{
              color: "#b300ff",
              fontWeight: "700",
              letterSpacing: "0.5px"
            }}
          >
            {sport.name} — Apparatus
          </h2>

          {/* No apparatus */}
          {sport.apparatus.length === 0 && (
            <div className="text-muted small mb-3">
              No apparatus added yet.
            </div>
          )}

          {/* Apparatus list */}
          {sport.apparatus.map(app => (
            <div
              key={app.id}
              className="mb-4 p-3"
              style={{
                borderRadius: "16px",
                border: "1px solid #e6e6e6",
                backgroundColor: "#ffffff",
                boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
              }}
            >
              {/* Apparatus Name */}
              <h4
                className="h6 mb-3"
                style={{
                  color: "#b300ff",
                  fontWeight: "700",
                  borderBottom: "2px solid #b300ff20",
                  paddingBottom: "6px"
                }}
              >
                {app.name}
              </h4>

              {/* Summary */}
              <div className="row text-muted small mb-3">

                <div className="col-md-4 mb-2">
                  <strong style={{ color: "#1f2a44" }}>Routines:</strong>
                  <br />
                  <span style={{ color: "#b300ff", fontWeight: "700" }}>
                    {app.routines.length}
                  </span>
                </div>

                <div className="col-md-4 mb-2">
                  <strong style={{ color: "#1f2a44" }}>Total Skills:</strong>
                  <br />
                  <span style={{ color: "#b300ff", fontWeight: "700" }}>
                    {app.routines.reduce((acc, r) => acc + r.items.length, 0)}
                  </span>
                </div>

                <div className="col-md-4 mb-2">
                  <strong style={{ color: "#1f2a44" }}>Total Steps:</strong>
                  <br />
                  <span style={{ color: "#b300ff", fontWeight: "700" }}>
                    {app.routines.reduce((acc, r) => acc + r.steps.length, 0)}
                  </span>
                </div>

              </div>

              {/* Routines */}
              {app.routines.length === 0 && (
                <div className="text-muted small mb-2">
                  No routines for this apparatus.
                </div>
              )}

              {app.routines.map(routine => (
                <div
                  key={routine.id}
                  className="mb-3 p-3"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e6e6e6",
                    backgroundColor: "#fafafa",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                  }}
                >
                  <strong style={{ color: "#1f2a44" }}>
                    Level:{" "}
                    <span style={{ color: "#b300ff" }}>{routine.level}</span>
                  </strong>

                  {/* Skills */}
                  <div className="mt-2">
                    <strong className="small" style={{ color: "#1f2a44" }}>
                      Skills ({routine.items.length})
                    </strong>

                    {routine.items.length === 0 && (
                      <div className="text-muted small">No skills yet.</div>
                    )}

                    {routine.items.length > 0 && (
                      <ul className="small mt-1">
                        {routine.items.map(item => (
                          <li key={item.id}>
                            {item.name}{" "}
                            {item.completed && (
                              <span style={{ color: "#28a745", fontWeight: "700" }}>
                                ✓
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Steps */}
                  <div className="mt-3">
                    <strong className="small" style={{ color: "#1f2a44" }}>
                      Steps ({routine.steps.length})
                    </strong>

                    {routine.steps.length === 0 && (
                      <div className="text-muted small">No steps yet.</div>
                    )}

                    {routine.steps.length > 0 && (
                      <ul className="small mt-1">
                        {routine.steps.map(step => (
                          <li key={step.id}>{step.text}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
