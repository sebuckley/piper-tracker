import React from "react";
import { Link } from "react-router-dom";
import { useAddedByName } from "../../utils/useAddedByName";
import { resolveAchievementEmoji } from "../../utils/achievementEmojis";

export default function ActivityCard({
  activity,
  canManage = false,
  showButtons = false,
  onEdit,
  onDelete
}) {
  const resolveName = useAddedByName();

  const type = activity.type.toLowerCase();
  const isNegative = activity.stars < 0;
  const isFeedback = type === "feedback";
  const hideStars = isFeedback && !activity.stars;

  // Accent colours based on type
  const accentColor =
    type === "achievement"
      ? "#f5b800" // gold
      : isFeedback && hideStars
      ? "#b300ff"
      : isNegative
      ? "#cc0033" // negative behaviour
      : "#28a745"; // positive behaviour

  const starText = isNegative
    ? `-${Math.abs(activity.stars)} ⭐`
    : `+${activity.stars} ⭐`;

  const showAccentBar = !showButtons;

  // ICONS
  const icon = type === "achievement"
    ? resolveAchievementEmoji(activity.emoji)
    : isFeedback && hideStars ? "💬" : "⭐";

  return (
    <div
      className="d-flex justify-content-between align-items-center mb-3"
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1px solid #e6e6e6",
        padding: "16px",
        transition: "transform 0.15s ease",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* LEFT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexGrow: 1 }}>
        
        {/* ICON */}
        <span style={{ fontSize: showButtons ? "20px" : "26px", color: accentColor }}>
          {icon}
        </span>

        {/* ACCENT BAR (only when no buttons) */}
        {showAccentBar && (
          <div
            style={{
              width: "4px",
             alignSelf: "stretch",   // ⭐ makes it match the full height of the left column
              backgroundColor: accentColor,
              borderRadius: "4px"
            }}
          />
        )}

        {/* TEXT BLOCK */}
        <div style={{ flexGrow: 1, textAlign: "left" }}>
          <strong style={{ color: "#1f2a44", fontSize: "16px" }}>
            {activity.type}: {activity.title}
          </strong>

          <div className="text-muted small">{activity.description}</div>

          <div className="text-muted small">
            {new Date(activity.date).toLocaleString()}
          </div>

          {activity.link && (
            <Link to={activity.link} style={{ color: "#b300ff", fontWeight: 600, fontSize: "14px" }}>
              View full feedback →
            </Link>
          )}

          {/* ⭐ ADDED BY */}
          {activity.addedBy && (
            <div className="text-muted small" style={{ fontStyle: "italic" }}>
              Added by {resolveName(activity.addedBy)}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          textAlign: showButtons ? "right" : "left",
          minWidth: showButtons ? "120px" : "auto"
        }}
      >
        {!hideStars && (
          <div
            style={{
              fontWeight: 700,
              color: accentColor,
              fontSize: showButtons ? "20px" : "28px",
              marginBottom: showButtons ? "8px" : "0"
            }}
          >
            {starText}
          </div>
        )}

        {/* OPTIONAL BUTTONS */}
        {canManage && showButtons && (
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #dcdcdc",
                borderRadius: "10px",
                padding: "4px 10px",
                fontWeight: 600,
                color: "#1f2a44"
              }}
              onClick={onEdit}
            >
              Edit
            </button>

            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#cc0033",
                borderRadius: "10px",
                padding: "4px 10px",
                fontWeight: 600,
                color: "#ffffff"
              }}
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
