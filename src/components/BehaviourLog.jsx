import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function BehaviourLog() {
  const logs = useAppStore(s => s.behaviourLogs);

  const [filter, setFilter] = useState("last7");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  
  const now = new Date();

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.date);

    if (filter === "today") {
      return logDate.toDateString() === now.toDateString();
    }

    if (filter === "last7") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return logDate >= sevenDaysAgo;
    }

    if (filter === "month") {
      return (
        logDate.getMonth() === now.getMonth() &&
        logDate.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "year") {
      return logDate.getFullYear() === now.getFullYear();
    }

    if (filter === "custom") {
      if (!customStart || !customEnd) return true;
      const start = new Date(customStart);
      const end = new Date(customEnd);
      return logDate >= start && logDate <= end;
    }

    return true;
  });

  return (
    <div className="containerBLog mt-4">
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
            Behaviour Activity Log
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

          {/* Log List */}
          <ul className="list-group">
            {filteredLogs.length === 0 && (
              <li className="list-group-item text-muted">
                No behaviour entries found for this period.
              </li>
            )}

            {filteredLogs.map(log => (
              <li
                key={log.id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ borderRadius: "10px" }}
              >
                <div>
                  <strong style={{ color: "#1f2a44" }}>{log.category}</strong>
                  <div className="text-muted small">{log.description}</div>
                  <div className="text-muted small">
                    Date: {new Date(log.date).toLocaleDateString()}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: "700",
                    color: log.stars < 0 ? "#cc0033" : "#b300ff"
                  }}
                >
                  {log.stars < 0 ? `-${Math.abs(log.stars)} ⭐` : `+${log.stars} ⭐`}
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
}
