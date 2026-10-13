import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function Dashboard() {
  // Unified store selectors
  const behaviour = useAppStore(s => s.behaviourLogs);
  const achievements = useAppStore(s => s.achievements);
  const rewardLogs = useAppStore(s => s.rewardLogs);
  const starBalance = useAppStore(s => s.starBalance);

  const activeChild = useAppStore(s => s.activeChild);
  const children = useAppStore(s => s.children);

  const child = children.find(c => c.id === activeChild);

  // ⭐ FILTER STATES
  const [filter, setFilter] = useState("last7");
  const [activityFilter, setActivityFilter] = useState("all");

  // ⭐ DATE FILTER LOGIC
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

  function passesFilter(dateString) {
    const d = new Date(dateString);

    if (isNaN(d.getTime())) return false;

    switch (filter) {
      case "today":
        return d >= todayStart;
      case "last7":
        return d >= sevenDaysAgo;
      case "month":
        return d >= monthStart;
      case "year":
        return d >= yearStart;
      case "all":
        return true;
      default:
        return true;
    }
  }

  function normalizeDate(dateString) {
    // If date is YYYY-MM-DD, convert to local midnight
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [y, m, d] = dateString.split("-");
      return new Date(Number(y), Number(m) - 1, Number(d));
    }

    // Otherwise parse normally
    return new Date(dateString);
  }


  // ⭐ FILTERED DATA
  const filteredBehaviour = behaviour.filter(b => passesFilter(b.date));
  const filteredAchievements = achievements.filter(a => passesFilter(a.date));
  const filteredRewards = rewardLogs.filter(r => passesFilter(r.date));

  // ⭐ CALCULATIONS
  const behaviourStars = filteredBehaviour.reduce((sum, b) => sum + b.stars, 0);
  const achievementStars = filteredAchievements.reduce((sum, a) => sum + a.stars, 0);
  const redeemedStars = filteredRewards.reduce((sum, r) => sum + (r.cost ?? r.stars ?? 0), 0);
  const removedStars = filteredBehaviour
    .filter(b => b.stars < 0)
    .reduce((sum, b) => sum + Math.abs(b.stars), 0);

  const starsThisPeriod =
    behaviourStars +
    achievementStars -
    redeemedStars;

  // ⭐ Unified activity feed
  let activities = [
    ...filteredBehaviour.map(b => ({
      type: "Behaviour",
      title: b.category,
      description: b.description,
      stars: b.stars,
      date: b.date
    })),
    ...filteredAchievements.map(a => {
      console.log(a)
      return {
        type: "Achievement",
        title: a.title,
        description: a.description,
        stars: a.stars,
        date: a.date
      };
    }),
...filteredRewards.map(r => {
  const cost = r.cost ?? r.stars ?? 0;

  let date = r.date;
  if (!date || isNaN(normalizeDate(date).getTime())) {
    date = new Date().toISOString().split("T")[0]; // store as YYYY-MM-DD
  }

  return {
    type: "Reward Redeemed",
    title: r.rewardName || r.name || "Reward",
    description: `Redeemed for ${cost} stars`,
    stars: -cost,
    date
  };
})

  ];

  // ⭐ Apply sub-filter (FIXED)
  activities = activities.filter(a => {
    if (activityFilter === "all") return true;
    if (activityFilter === "behaviour") return a.type === "Behaviour";
    if (activityFilter === "achievement") return a.type === "Achievement";
    if (activityFilter === "removed") return a.type === "Behaviour" && a.stars < 0;
    if (activityFilter === "redeemed") return a.type === "Reward Redeemed";
    return true;
  });

  // Sort newest first
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="container mt-4">
      <div
        className="card p-4 shadow-sm"
        style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6"
        }}
      >
        {/* Header */}
        <h1
          className="h4 mb-4 text-center"
          style={{ color: "#1f2a44", fontWeight: "700" }}
        >
          {child?.fullName || "Child"}'s Dashboard
        </h1>

        {/* ⭐ MAIN FILTER BUTTONS */}
        <div className="d-flex gap-3 flex-wrap justify-content-center mb-3">
          {[
            ["today", "Today"],
            ["last7", "Last 7 Days"],
            ["month", "This Month"],
            ["year", "This Year"],
            ["all", "All Time"]
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

        {/* ⭐ SUB FILTER BUTTONS */}
        <div className="d-flex gap-2 flex-wrap justify-content-center mb-4">
          {[
            ["all", "All"],
            ["behaviour", "Behaviour"],
            ["achievement", "Achievements"],
            ["removed", "Removed"],
            ["redeemed", "Redeemed"]
          ].map(([key, label]) => (
            <button
              key={key}
              className="btn btn-sm"
              style={{
                backgroundColor: activityFilter === key ? "#b300ff" : "#ffffff",
                color: activityFilter === key ? "white" : "#1f2a44",
                borderRadius: "8px",
                border: activityFilter === key ? "2px solid #b300ff" : "1px solid #dcdcdc",
                fontWeight: "600",
                padding: "4px 10px",
                fontSize: "12px"
              }}
              onClick={() => setActivityFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ⭐ Current Stars ABOVE the others, same width */}
        <div className="d-flex justify-content-center mb-4">
          <div
            className="p-3 text-center"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              border: "2px solid #b300ff",
              boxShadow: "0 2px 6px rgba(179,0,255,0.25)",
              minWidth: "200px",
              width: "200px"
            }}
          >
            <h2
              className="h6 mb-2"
              style={{ color: "#1f2a44", fontWeight: "700" }}
            >
              Current Stars
            </h2>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#b300ff"
              }}
            >
              {starBalance} ⭐
            </div>
          </div>
        </div>

        {/* ⭐ Stats Row */}
        <div className="d-flex justify-content-center gap-4 flex-wrap mb-4">

          {/* Stars This Period */}
          <div
            className="p-3 text-center"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #e6e6e6",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              minWidth: "200px"
            }}
          >
            <h2 className="h6 mb-2" style={{ color: "#1f2a44", fontWeight: "600" }}>
              Stars ({filter})
            </h2>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: starsThisPeriod >= 0 ? "#b300ff" : "#cc0033"
              }}
            >
              {starsThisPeriod >= 0 ? `+${starsThisPeriod}` : starsThisPeriod} ⭐
            </div>
          </div>

          {/* Removed Stars */}
          <div
            className="p-3 text-center"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #e6e6e6",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              minWidth: "200px"
            }}
          >
            <h2 className="h6 mb-2" style={{ color: "#1f2a44", fontWeight: "600" }}>
              Removed Stars
            </h2>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#cc0033"
              }}
            >
              -{removedStars} ⭐
            </div>
          </div>

          {/* Redeemed Stars */}
          <div
            className="p-3 text-center"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #e6e6e6",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              minWidth: "200px"
            }}
          >
            <h2 className="h6 mb-2" style={{ color: "#1f2a44", fontWeight: "600" }}>
              Redeemed
            </h2>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#cc0033"
              }}
            >
              -{redeemedStars} ⭐
            </div>
          </div>

        </div>

        {/* Latest Activities */}
        <div className="mb-4">
          <h2 className="h6 mb-3" style={{ color: "#1f2a44", fontWeight: "600" }}>
            Latest Activities
          </h2>

          <ul className="list-group">
            {activities.length === 0 && (
              <li className="list-group-item text-muted">
                No activities logged for this period
              </li>
            )}

            {activities.slice(0, 5).map((a, idx) => (
              <li
                key={idx}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  borderRadius: "10px",
                  height: "90px",
                  padding: "12px 16px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <div style={{ maxWidth: "70%", overflow: "hidden" }}>
                  <strong style={{ color: "#1f2a44" }}>
                    {a.type}: {a.title}
                  </strong>

                  <div
                    className="text-muted small"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {a.description}
                  </div>

                  <div className="text-muted small">
                    {new Date(a.date).toLocaleString()}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: "700",
                    color: a.stars < 0 ? "#cc0033" : "#b300ff",
                    fontSize: "20px",
                    minWidth: "60px",
                    textAlign: "right"
                  }}
                >
                  {a.stars < 0
                    ? `-${Math.abs(a.stars)} ⭐`
                    : `+${a.stars} ⭐`}
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
