import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import BehaviourLog from "./BehaviourLog";

export default function AddBehaviour() {
  const addBehaviourLog = useAppStore(s => s.addBehaviourLog);
  const behaviourLogs = useAppStore(s => s.behaviourLogs);
  const behaviourTemplates = useAppStore(s => s.behaviourTemplates);
  const starBalance = useAppStore(s => s.starBalance);
  const setState = useAppStore(s => s.setState);

  const isViewer = useAppStore(s => s.isViewer());

  const [category, setCategory] = useState("");
  const [stars, setStars] = useState(1);
  const [description, setDescription] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const detectType = (t) => {
    if (t.type) return t.type;
    return t.stars < 0 ? "negative" : "positive";
  };

  const positiveTemplates = behaviourTemplates.filter(
    t => detectType(t) === "positive"
  );

  const negativeTemplates = behaviourTemplates.filter(
    t => detectType(t) === "negative"
  );

  const isNegative = stars < 0;

  const previewStars = isNegative
    ? Number(starBalance) - Math.abs(Number(stars))
    : Number(starBalance) + Number(stars);

  const undoLastBehaviour = () => {
    if (isViewer) return;
    if (behaviourLogs.length === 0) return;

    const last = behaviourLogs[0];
    const restoredBalance = Number(starBalance) - Number(last.stars);

    setState({
      behaviourLogs: behaviourLogs.slice(1),
      starBalance: restoredBalance
    });
  };

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
        Behaviour
      </h2>

      {/* Add Button */}
      {!isViewer && (
        <div className="d-flex justify-content-end align-items-center mb-3">
          <button
            className="btn"
            style={{
              background: "#b300ff",
              color: "white",
              borderRadius: "10px",
              padding: "6px 14px",
              fontWeight: 600
            }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Hide" : "Add Behaviour"}
          </button>
        </div>
      )}

      {/* Viewer Mode Banner */}
      {isViewer && (
        <div
          style={{
            background: "#e8f4ff",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
            color: "#1f2a44",
            fontWeight: 600,
            marginBottom: "20px"
          }}
        >
          Viewer Mode: Behaviour logs cannot be added on this device.
        </div>
      )}

      {/* Add Form */}
      {!isViewer && showAddForm && (
        <div
          className="mb-4"
          style={{
            background: "white",
            border: "1px solid #e6e6e6",
            borderRadius: "16px",
            padding: "16px",
            textAlign: "left"
          }}
        >
          {/* Section Header */}
          <h3
            className="h4 mb-3"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            {isNegative ? "Remove Stars" : "Award Stars"}
          </h3>

          {/* Positive Behaviour */}
          <h4
            className="h5 mb-2"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            Positive Behaviour
          </h4>

          <div className="mb-3 d-flex gap-2 flex-wrap">
            {positiveTemplates.map(t => (
              <button
                key={t.id}
                className="btn btn-sm"
                style={{
                  background: "#28a745",   // GREEN for positive
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: 600,
                  padding: "6px 12px"
                }}
                onClick={() => {
                  setCategory(t.category);
                  setDescription(t.desc);
                  setStars(Math.abs(t.stars));
                }}
              >
                {t.category} ⭐{Math.abs(t.stars)}
              </button>
            ))}
          </div>

          {/* Negative Behaviour */}
          <h4
            className="h5 mb-2"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            Negative Behaviour
          </h4>

          <div className="mb-3 d-flex gap-2 flex-wrap">
            {negativeTemplates.map(t => (
              <button
                key={t.id}
                className="btn btn-sm"
                style={{
                  background: "#cc0033",   // RED for negative
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: 600,
                  padding: "6px 12px"
                }}
                onClick={() => {
                  setCategory(t.category);
                  setDescription(t.desc);
                  setStars(-Math.abs(t.stars));
                }}
              >
                {t.category} ⭐{-Math.abs(t.stars)}
              </button>
            ))}
          </div>

          {/* Reason */}
          <label className="form-label" style={{ color: "#1f2a44" }}>
            Reason
          </label>
          <input
            className="form-control mb-3"
            placeholder="Enter behaviour reason..."
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          {/* Stars */}
          <label className="form-label" style={{ color: "#1f2a44" }}>
            Stars {isNegative ? "Removed" : "Awarded"}
          </label>
          <input
            type="number"
            className="form-control mb-3"
            value={stars}
            onChange={e => setStars(Number(e.target.value))}
            style={{ borderRadius: "12px", width: "120px" }}
          />

          {/* Preview */}
          <div
            className="mb-3 p-3"
            style={{
              background: "#f8f8ff",
              borderRadius: "12px",
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
              borderRadius: "12px",
              minHeight: "120px"
            }}
          />

          {/* Buttons */}
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
              onClick={() => setShowAddForm(false)}
            >
              Cancel
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
              onClick={undoLastBehaviour}
            >
              Undo
            </button>

          </div>
        </div>
      )}

      {/* Behaviour Log */}
      <BehaviourLog />
    </div>
  );
}
