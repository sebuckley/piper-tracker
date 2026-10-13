import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import BehaviourLog from "./BehaviourLog";

export default function AddBehaviour() {
  const addBehaviourLog = useAppStore(s => s.addBehaviourLog);
  const behaviourLogs = useAppStore(s => s.behaviourLogs);
  const behaviourTemplates = useAppStore(s => s.behaviourTemplates);
  const starBalance = useAppStore(s => s.starBalance);
  const setState = useAppStore(s => s.setState);

  const [category, setCategory] = useState("");
  const [stars, setStars] = useState(1);
  const [description, setDescription] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // ⭐ Auto-detect type for old templates
  const detectType = (t) => {
    if (t.type) return t.type;
    return t.stars < 0 ? "negative" : "positive";
  };

  // ⭐ Correct positive/negative grouping
  const positiveTemplates = behaviourTemplates.filter(
    t => detectType(t) === "positive"
  );

  const negativeTemplates = behaviourTemplates.filter(
    t => detectType(t) === "negative"
  );

  // ⭐ Determine if the CURRENT behaviour is negative
  const isNegative = stars < 0;

  const previewStars = isNegative
    ? Number(starBalance) - Math.abs(Number(stars))
    : Number(starBalance) + Number(stars);

  const undoLastBehaviour = () => {
    if (behaviourLogs.length === 0) return;

    const last = behaviourLogs[0];
    const restoredBalance = Number(starBalance) - Number(last.stars);

    setState({
      behaviourLogs: behaviourLogs.slice(1),
      starBalance: restoredBalance
    });
  };

  return (
    <div className="container mt-4">

      <button
        className="btn mb-4"
        style={{
          backgroundColor: "#b300ff",
          color: "white",
          fontWeight: "600",
          borderRadius: "10px",
          padding: "10px 20px",
          boxShadow: "0 4px 10px rgba(179,0,255,0.25)"
        }}
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Hide Add Behaviour" : "Add Behaviour"}
      </button>

      {showAddForm && (
        <div
          className="card shadow-sm mb-4"
          style={{ borderRadius: "16px", border: "1px solid #e6e6e6" }}
        >
          <div className="p-4">

            <h2
              className="h5 mb-4"
              style={{ color: "#1f2a44", fontWeight: "600" }}
            >
              {isNegative ? "Remove Stars ⭐" : "Award Stars ⭐"}
            </h2>

            {/* ⭐ Positive Behaviour */}
            <h5 className="mt-3 mb-2" style={{ color: "#1f2a44" }}>
              Positive Behaviour
            </h5>
            <div className="mb-3 d-flex gap-2 flex-wrap">
              {positiveTemplates.map(t => (
                <button
                  key={t.id}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    borderRadius: "10px",
                    fontWeight: "600",
                    boxShadow: "0 3px 8px rgba(40,167,69,0.25)"
                  }}
                  onClick={() => {
                    setCategory(t.category);
                    setDescription(t.desc);
                    setStars(Math.abs(t.stars)); // ensure positive
                  }}
                >
                  {t.category} ⭐{Math.abs(t.stars)}
                </button>
              ))}
            </div>

            {/* ⭐ Negative Behaviour */}
            <h5 className="mt-4 mb-2" style={{ color: "#cc0033" }}>
              Negative Behaviour
            </h5>
            <div className="mb-3 d-flex gap-2 flex-wrap">
              {negativeTemplates.map(t => (
                <button
                  key={t.id}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#cc0033",
                    color: "white",
                    borderRadius: "10px",
                    fontWeight: "600",
                    boxShadow: "0 3px 8px rgba(204,0,51,0.25)"
                  }}
                  onClick={() => {
                    setCategory(t.category);
                    setDescription(t.desc);
                    setStars(-Math.abs(t.stars)); // ensure negative
                  }}
                >
                  {t.category} ⭐{-Math.abs(t.stars)}
                </button>
              ))}
            </div>

            {/* Reason Input */}
            <label className="form-label" style={{ color: "#1f2a44" }}>
              Reason
            </label>
            <input
              className="form-control mb-3"
              placeholder="Enter behaviour reason..."
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ borderRadius: "10px", borderColor: "#dcdcdc" }}
            />

            {/* Stars */}
            <label className="form-label" style={{ color: "#1f2a44" }}>
              Stars {isNegative ? "Removed" : "Awarded"} ⭐
            </label>
            <input
              type="number"
              className="form-control mb-3"
              value={stars}
              onChange={e => setStars(Number(e.target.value))}
              style={{
                borderRadius: "10px",
                borderColor: "#dcdcdc",
                width: "120px"
              }}
            />

            {/* Preview */}
            <div
              className="mb-3 p-3"
              style={{
                backgroundColor: "#f8f8ff",
                borderRadius: "10px",
                border: "1px solid #e6e6e6"
              }}
            >
              <strong>Current Stars:</strong> ⭐{starBalance}
              <br />
              <strong>After This Behaviour:</strong> ⭐{previewStars}
            </div>

            {/* Description */}
            <label className="form-label" style={{ color: "#1f2a44" }}>
              Notes (optional)
            </label>
            <textarea
              className="form-control mb-4"
              placeholder={
                isNegative
                  ? "Describe what happened..."
                  : "Describe what Piper did..."
              }
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                borderRadius: "10px",
                borderColor: "#dcdcdc",
                minHeight: "120px"
              }}
            />

            {/* Button Row */}
            <div className="d-flex gap-3">

              <button
                className="btn flex-grow-1"
                style={{
                  backgroundColor: isNegative ? "#cc0033" : "#28a745",
                  color: "white",
                  fontWeight: "600",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  boxShadow: isNegative
                    ? "0 4px 10px rgba(204,0,51,0.25)"
                    : "0 4px 10px rgba(40,167,69,0.25)"
                }}
                onClick={() => {
                  if (!category.trim()) return;

                  addBehaviourLog(
                    category,
                    description,
                    stars,
                    new Date()
                  );

                  setCategory("");
                  setDescription("");
                  setStars(1);
                  setShowAddForm(false);
                }}
              >
                {isNegative ? "Remove Stars ⭐" : "Award Stars ⭐"}
              </button>

              <button
                className="btn"
                style={{
                  backgroundColor: "#444",
                  color: "white",
                  fontWeight: "600",
                  padding: "10px 20px",
                  borderRadius: "12px"
                }}
                onClick={undoLastBehaviour}
              >
                Undo
              </button>

            </div>
          </div>
        </div>
      )}

      <BehaviourLog />
    </div>
  );
}
