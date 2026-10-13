import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function AchievementLog() {
  const achievements = useAppStore(s => s.achievements);
  const sports = useAppStore(s => s.sportsClasses);

  const [filter, setFilter] = useState("last7");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const now = new Date();

  const filteredAchievements = achievements.filter(a => {
    const date = new Date(a.date);

    if (filter === "today") {
      return date.toDateString() === now.toDateString();
    }

    if (filter === "last7") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return date >= sevenDaysAgo;
    }

    if (filter === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "year") {
      return date.getFullYear() === now.getFullYear();
    }

    if (filter === "custom") {
      if (!customStart || !customEnd) return true;
      const start = new Date(customStart);
      const end = new Date(customEnd);
      return date >= start && date <= end;
    }

    return true;
  });

  return (
    <div className="containerALog mt-4">
      <div
        className="card shadow-sm"
        style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6"
        }}
      >
        <div className="p-4">

          <h2
            className="h5 mb-4"
            style={{ color: "#1f2a44", fontWeight: "600" }}
          >
            Achievement Log
          </h2>

          {/* Filters */}
          <div className="d-flex gap-3 flex-wrap mb-4">
            {[
              ["today", "Today"],
              ["last7", "Last 7 Days"],
              ["month", "This Month"],
              ["year", "This Year"],
              ["custom", "Custom Range"]
            ].map(([key, label]) => (
              <button
                key={key}
                className="btn"
                style={{
                  backgroundColor: filter === key ? "#b300ff" : "#ffffff",
                  color: filter === key ? "white" : "#1f2a44",
                  borderRadius: "10px",
                  border: filter === key ? "2px solid #b300ff" : "1px solid #dcdcdc",
                  fontWeight: "600",
                  padding: "8px 16px"
                }}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Custom date range */}
          {filter === "custom" && (
            <div className="d-flex gap-3 mb-4 flex-wrap">
              <input
                type="date"
                className="form-control"
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
                style={{ borderRadius: "10px", maxWidth: "200px" }}
              />
              <input
                type="date"
                className="form-control"
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
                style={{ borderRadius: "10px", maxWidth: "200px" }}
              />
            </div>
          )}

          {/* Achievement List */}
          <ul className="list-group">
            {filteredAchievements.length === 0 && (
              <li className="list-group-item text-muted">
                No achievements found for this period.
              </li>
            )}

            {filteredAchievements.map(a => (
              <li
                key={a.id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ borderRadius: "10px" }}
              >
                <div>
                  <strong style={{ color: "#1f2a44" }}>{a.title}</strong>
                  <div className="text-muted small">{a.description}</div>

                  <div className="text-muted small">
                    Date: {new Date(a.date).toLocaleDateString()}
                  </div>

                  {a.classId && (
                    <div className="text-muted small">
                      Class: {sports.find(s => s.id === a.classId)?.name}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    fontWeight: "700",
                    color: "#b300ff"
                  }}
                >
                  +{a.stars} ⭐
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
}
