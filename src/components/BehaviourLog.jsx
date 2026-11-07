import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import ActivityCard from "./activity/ActivityComponent";

export default function BehaviourLog() {
  const logs = useAppStore(s => s.behaviourLogs);

  const [filter, setFilter] = useState("last7");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const now = new Date();

const filteredLogs = logs
  .map(log => ({ ...log, type: "behaviour" }))   // inject type
  .filter(log => {

   
    const logDate = new Date(log.date);

    if (filter === "today") return logDate.toDateString() === now.toDateString();

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

    if (filter === "year") return logDate.getFullYear() === now.getFullYear();

    if (filter === "custom") {
      if (!customStart || !customEnd) return true;
      const start = new Date(customStart);
      const end = new Date(customEnd);
      return logDate >= start && logDate <= end;
    }

    return true;
  });


  return (
    <div className="container" style={{ maxWidth: "1200px" }}>

      {/* Page Title */}
      <h2
        className="h3 mt-3 mb-4"
        style={{
          color: "#b300ff",
          fontWeight: 700,
          letterSpacing: "0.5px",
          textAlign: "center"
        }}
      >
        Behaviour Log
      </h2>

      {/* Section Header */}
      <div style={{ textAlign: "left" }} className="mb-4">
        <h3
          className="h4 mb-3"
          style={{ color: "#1f2a44", fontWeight: 600 }}
        >
          Filter Behaviour
        </h3>

        {/* Filters */}
        <div className="d-flex gap-2 flex-wrap mb-3">
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
                background: filter === key ? "#b300ff" : "white",
                color: filter === key ? "white" : "#1f2a44",
                borderRadius: "10px",
                border: filter === key
                  ? "2px solid #b300ff"
                  : "1px solid #dcdcdc",
                fontWeight: 600,
                padding: "6px 14px"
              }}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        {filter === "custom" && (
          <div className="d-flex gap-3 mb-4 flex-wrap">
            <input
              type="date"
              className="form-control"
              value={customStart}
              onChange={e => setCustomStart(e.target.value)}
              style={{ borderRadius: "12px", maxWidth: "200px" }}
            />
            <input
              type="date"
              className="form-control"
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              style={{ borderRadius: "12px", maxWidth: "200px" }}
            />
          </div>
        )}
      </div>

      {/* No Results */}
      {filteredLogs.length === 0 && (
        <div
          className="text-muted"
          style={{
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            background: "white"
          }}
        >
          No behaviour entries found for this period.
        </div>
      )}

      {/* Behaviour Items */}
      {filteredLogs.map(log => (
        <ActivityCard
          key={log.id}
          activity={log}
          canManage={false}
          showButtons={false}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
}
