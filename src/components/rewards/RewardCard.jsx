import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import QuestionMark from "../reusable/QuestionMark";
import { currencySymbol } from "../../utils/currency";
import { useAddedByName } from "../../utils/useAddedByName";
import { resolveEmoji } from "../../utils/rewardEmojis";
import EmojiPicker from "./EmojiPicker";

export default function RewardCard({
  item = [],
  type = "reward", 
  onRedeem,
  onRequest,
  onApprove,
  onDeny
}) {

  const {
    emoji,
    name,
    category,
    cost,
    redeemed,
    repeatable,
    date,
    remainingStars,
    confirmedBy
  } = item;

  const isOwner = useAppStore(s => !s.isViewer());
  const starBalance = useAppStore(s => s.starBalance);
  const requested = useAppStore(s => s.rewardRequests.some(request => request.id === item.id));
  const resolveName = useAddedByName();

  const updateReward = useAppStore(s => s.updateReward);
  const deleteReward = useAppStore(s => s.deleteReward);

  // ⭐ LOCAL EDIT STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editEmoji, setEditEmoji] = useState(emoji || "");
  const [editCategory, setEditCategory] = useState(category);
  const [editCost, setEditCost] = useState(cost);
  const [editAmount, setEditAmount] = useState(item.amount ?? 1);
  const profileCurrency = useAppStore(s => s.userProfile?.currency);
  const [editRepeatable, setEditRepeatable] = useState(repeatable);

  // ⭐ LOCAL REDEEM ANIMATION STATE
  const [isRedeemAnimating, setIsRedeemAnimating] = useState(false);

  const categoryOptions = [
    "Treat",
    "Activity",
    "Reward",
    "Food",
    "Trip",
    "Screen Time",
    "Toy",
    "Special Event",
    "Craft",
    "Puzzle",
    "Pet",
    "Other"
  ];

  // Accent colour rules
  const getAccentColor = () => {
    if (type === "achievement") return "#f5b800";
    if (type === "behaviour") return cost < 0 ? "#cc0033" : "#28a745";

    if (cost <= 5) return "#28a745";
    if (cost <= 20) return "#b300ff";
    if (cost <= 40) return "#f5b800";
    return "#cc0033";
  };

  const accentColor = getAccentColor();

  const handleSave = () => {
    updateReward(item.id, {
      name: editName,
      emoji: editEmoji,
      category: editCategory,
      cost: Number(editCost),
      ...(item.type === "pocketMoney" ? { amount: Number(editAmount) || 0 } : {}),
      repeatable: editRepeatable
    });
    setIsEditing(false);
  };

  const handleRedeemClick = () => {
    if (!repeatable) {
      // normal one-time redeem
      onRedeem();
      return;
    }

    // ⭐ repeatable reward animation
    setIsRedeemAnimating(true);
    onRedeem();

    // animate back after 1.2 seconds
    setTimeout(() => {
      setIsRedeemAnimating(false);
    }, 1200);
  };

  return (
    <div
      className="d-flex mb-3"
      style={{
        background: "white",
        border: "1px solid #e6e6e6",
        borderRadius: "16px",
        padding: "16px"
      }}
    >
      {/* LEFT EMOJI */}
      <div
        style={{
          fontSize: "1.8rem",
          marginRight: "12px",
          display: "flex",
          alignItems: "center"
        }}
      >
        {resolveEmoji(emoji)}
      </div>

      {/* ACCENT BAR */}
      <div
        style={{
          width: "6px",
          background: accentColor,
          borderRadius: "6px",
          marginRight: "16px"
        }}
      />

      {/* ⭐ MIDDLE COLUMN */}
      <div style={{ flexGrow: 1, textAlign: "left" }}>

        {/* NORMAL VIEW */}
        {!isEditing && (
          <>
            <strong style={{ color: "#1f2a44", fontSize: "1.2rem" }}>
              {name}
            </strong>

            {category && (
              <div className="small" style={{ color: "#1f2a44" }}>
                {category}
              </div>
            )}

            <div className="small" style={{ color: "#1f2a44" }}>
              {item.type === "pocketMoney"
                ? `${cost} ⭐ per ${currencySymbol(profileCurrency)}${Number(item.amount ?? 1).toFixed(2)} — choose £1–£20 when redeeming`
                : <>Cost: {cost} ⭐{type === "request" && item.amount ? ` (${currencySymbol(profileCurrency)}${Number(item.amount).toFixed(2)})` : ""}</>}
            </div>

            {type === "request" && (
              <div className="small" style={{ color: "#1f2a44" }}>
                Requested by: {resolveName(item.requestedBy)}
              </div>
            )}

            {type !== "request" && (
            <div className="small" style={{ color: "#1f2a44" }}>
              {repeatable ? "Repeatable" : "One‑time only"}
            </div>
            )}

            {/* LOG MODE */}
            {type === "log" && (
              <>
                <div className="small" style={{ color: "#1f2a44" }}>
                  Redeemed for {cost} stars
                </div>

                <div className="small" style={{ color: "#1f2a44" }}>
                  {new Date(date).toLocaleString()}
                </div>

                <div className="small" style={{ color: "#1f2a44" }}>
                  Confirmed By: {resolveName(confirmedBy)}
                </div>
              </>
            )}
          </>
        )}

        {/* ⭐ EDIT PANEL */}
        {type === "reward-settings" && isEditing && (
          <div
            className="mt-3"
            style={{
              background: "white",
              border: "1px solid #e6e6e6",
              borderRadius: "16px",
              padding: "16px"
            }}
          >
            <h4
              className="h5 mb-3"
              style={{ color: "#1f2a44", fontWeight: 600 }}
            >
              Edit Reward
            </h4>

            {/* NAME */}
            <input
              className="form-control mb-3"
              style={{ borderRadius: "12px" }}
              placeholder="Reward Name"
              value={editName}
              onChange={e => setEditName(e.target.value)}
            />

            {/* ICON */}
            <EmojiPicker value={editEmoji} onChange={setEditEmoji} />

            {/* CATEGORY */}
            <select
              className="form-select mb-3"
              style={{ borderRadius: "12px" }}
              value={editCategory}
              onChange={e => setEditCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categoryOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            {/* COST */}
            <input
              className="form-control mb-3"
              style={{ borderRadius: "12px" }}
              type="number"
              placeholder="Cost"
              value={editCost}
              onChange={e => setEditCost(e.target.value)}
            />

            {/* POCKET MONEY AMOUNT */}
            {item.type === "pocketMoney" && (
              <input
                className="form-control mb-3"
                style={{ borderRadius: "12px" }}
                type="number"
                step="0.01"
                placeholder="Pocket money amount for this many stars"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
              />
            )}

            {/* ⭐ REPEATABLE TOGGLE */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id={`repeatable-${item.id}`}
                checked={editRepeatable}
                onChange={e => setEditRepeatable(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label
                className="form-check-label"
                htmlFor={`repeatable-${item.id}`}
                style={{ color: "#1f2a44", fontWeight: 500 }}
              >
                Repeatable reward
              </label>
            </div>

            {/* SAVE / CANCEL */}
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn"
                style={{
                  background: "#b300ff",
                  color: "white",
                  borderRadius: "10px",
                  padding: "6px 14px",
                  fontWeight: 600
                }}
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="btn"
                style={{
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "6px 14px",
                  fontWeight: 600
                }}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ⭐ RIGHT COLUMN — BUTTONS */}
      <div className="d-flex flex-column align-items-end gap-2">

        {/* SETTINGS MODE BUTTONS */}
        {type === "reward-settings" && !isEditing && (
          <>
            <button
              className="btn"
              style={{
                background: "#b300ff",
                color: "white",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            <button
              className="btn"
              style={{
                background: "red",
                color: "white",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={() => deleteReward(item.id)}
            >
              Delete
            </button>
          </>
        )}

        {/* REQUEST MODE BUTTONS */}
        {type === "request" && (
          <>
            <button
              className="btn"
              style={{ background: "#b300ff", color: "white", borderRadius: "10px", padding: "6px 14px", fontWeight: 600 }}
              onClick={onApprove}
            >
              Approve
            </button>
            <button
              className="btn"
              style={{ background: "#cc0033", color: "white", borderRadius: "10px", padding: "6px 14px", fontWeight: 600 }}
              onClick={onDeny}
            >
              Deny
            </button>
          </>
        )}

        {/* ⭐ NORMAL REWARD BUTTONS */}
        {((!redeemed && type === "reward") || (repeatable && type === "reward")) && (
          <>
            {isOwner ? (

              <button
                className="btn"
                disabled={starBalance < cost}
                style={{
                  background: starBalance >= cost ? "#b300ff" : "#dcdcdc",
                  color: starBalance >= cost ? "white" : "#888",
                  borderRadius: "10px",
                  padding: "6px 14px",
                  fontWeight: 600,
                  transition: "all 0.3s ease"
                }}
                onClick={handleRedeemClick}
              >
                {isRedeemAnimating ? "Redeemed 🎉" : "Redeem"}
              </button>

            ) : (
              <button
                className="btn"
                disabled={requested}
                style={{
                  background: "#b300ff",
                  color: "white",
                  borderRadius: "10px",
                  padding: "6px 14px",
                  fontWeight: 600
                }}
                onClick={onRequest}
              >
                {requested ? "Requested" : "Request Redemption"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
