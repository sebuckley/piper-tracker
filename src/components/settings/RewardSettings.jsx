import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { API_BASE } from "../../config/api";
import RewardCard from "../rewards/RewardCard";
import EmojiPicker from "../rewards/EmojiPicker";
import { resolveEmoji } from "../../utils/rewardEmojis";

export default function RewardsSettings() {

  const rewards = useAppStore(s => s.rewards);
  const addReward = useAppStore(s => s.addReward);


  const [showAddForm, setShowAddForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Treat");
  const [newCost, setNewCost] = useState(5);
  const [newRepeatable, setNewRepeatable] = useState(false);
  const [newEmoji, setNewEmoji] = useState("");

  // Search of approved global rewards
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const trimmed = term.trim();

  useEffect(() => {
    if (!showAddForm || trimmed.length < 2) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/rewards?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) throw new Error("search failed");
        const data = await res.json();
        if (!cancelled) {
          setResults(data);
          setSearchError(false);
          setSearched(true);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setSearchError(true);
          setSearched(true);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, showAddForm]);

  const alreadyAdded = (g) =>
    rewards.some(r =>
      (r.templateId && r.templateId === g.templateId) ||
      (g.type === "pocketMoney" && r.type === "pocketMoney") ||
      r.name.trim().toLowerCase() === g.name.trim().toLowerCase()
    );

  const closeAdd = () => {
    setShowAddForm(false);
    setTerm("");
    setResults([]);
    setSearched(false);
    setNewName("");
    setNewCategory("Treat");
    setNewCost(5);
    setNewRepeatable(false);
    setNewEmoji("");
  };

  const addGlobal = (g) => {
    addReward(g.name, g.category, g.cost, g.repeatable, g.emoji, {
      templateId: g.templateId,
      type: g.type,
      amount: g.amount,
      fromGlobal: true
    });
    closeAdd();
  };

  const showForm = trimmed.length >= 2 && searched && results.length === 0;

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>

      {/* Breadcrumb */}
      <div
        className="mb-3"
        style={{ fontSize: "18px", fontWeight: 600, textAlign: "left" }}
      >
        <Link
          to="/settings"
          style={{
            color: "#b300ff",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "18px"
          }}
        >
          Settings
        </Link>
        <span style={{ color: "#1f2a44", margin: "0 8px" }}>/</span>
        <span style={{ color: "#1f2a44" }}>Reward Templates</span>
      </div>

      {/* Page Title */}
      <h2
        className="h3 mt-3 mb-4"
        style={{
          color: "#b300ff",
          fontWeight: 700,
          letterSpacing: "0.5px",
          textAlign: "left"
        }}
      >
        Reward Templates
      </h2>

      {/* Section Header + Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3
          className="h4"
          style={{ color: "#1f2a44", fontWeight: 600 }}
        >
          Templates
        </h3>

        <button
          className="btn"
          style={{
            background: "#b300ff",
            color: "white",
            borderRadius: "10px",
            padding: "6px 14px",
            fontWeight: 600
          }}
          onClick={() => setShowAddForm(true)}
        >
          Add Reward
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div
          className="mb-4"
          style={{
            background: "white",
            border: "1px solid #e6e6e6",
            borderRadius: "16px",
            padding: "20px"
          }}
        >
          <h4
            className="h5 mb-3"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            Find or Add Reward
          </h4>

          <input
            className="form-control"
            style={{ borderRadius: "12px" }}
            placeholder="Search rewards by name…"
            value={term}
            autoFocus
            onChange={(e) => {
              setTerm(e.target.value);
              setNewName(e.target.value);
              setSearched(false);
            }}
          />

          <div className="text-muted small mt-2 mb-3">
            Search rewards already added by other users. If yours isn't listed, you can add it
            below and it will be sent for review.
          </div>

          {searchError && (
            <div className="text-danger small mb-2">
              Couldn't search existing rewards right now. You can still add a new one.
            </div>
          )}

          {results.map(g => {
            const added = alreadyAdded(g);
            return (
              <div
                key={g.templateId}
                className="p-2 mb-2 d-flex justify-content-between align-items-center"
                style={{ borderRadius: "10px", border: "1px solid #e6e6e6", backgroundColor: "#fafafa" }}
              >
                <div style={{ textAlign: "left" }}>
                  <strong>{resolveEmoji(g.emoji)} {g.name}</strong>
                  <div className="text-muted small">{g.category} · {g.cost} ⭐</div>
                </div>
                <button
                  className="btn btn-sm"
                  disabled={added}
                  style={{
                    background: "#b300ff",
                    color: "white",
                    borderRadius: "10px",
                    padding: "6px 14px",
                    fontWeight: 600
                  }}
                  onClick={() => addGlobal(g)}
                >
                  {added ? "Added" : "+ Add"}
                </button>
              </div>
            );
          })}

          {showForm && (
          <>
          <div className="text-muted small mb-2">
            No rewards found for "{trimmed}" — add it below.
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <input
                className="form-control"
                style={{ borderRadius: "12px" }}
                placeholder="Reward name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="col-12">
              <EmojiPicker value={newEmoji} onChange={setNewEmoji} />
            </div>

            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                style={{ borderRadius: "12px" }}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option>Treat</option>
                <option>Activity</option>
                <option>Privilege</option>
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                style={{ borderRadius: "12px" }}
                value={newRepeatable}
                onChange={(e) => setNewRepeatable(e.target.value === "true")}
              >
                <option value="false">One-off</option>
                <option value="true">Repeatable</option>
              </select>
            </div>

            <div className="col-md-2 mb-3">
              <input
                type="number"
                min="1"
                className="form-control"
                style={{ borderRadius: "12px" }}
                value={newCost}
                onChange={(e) => setNewCost(Number(e.target.value))}
              />
            </div>
          </div>
          </>
          )}

          <div className="d-flex justify-content-end gap-2">
            {showForm && (
            <button
              className="btn"
              style={{
                background: "#b300ff",
                color: "white",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={() => {
                if (!newName.trim()) return;
                addReward(newName.trim(), newCategory, newCost, newRepeatable, newEmoji.trim());
                closeAdd();
              }}
            >
              Save
            </button>
            )}

            <button
              className="btn"
              style={{
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={closeAdd}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reward List */}
      {rewards.map((r) => (
        <RewardCard
          key={r.id}
          item={r}
          type="reward-settings"
     
        />
      ))}
    </div>
  );
}
