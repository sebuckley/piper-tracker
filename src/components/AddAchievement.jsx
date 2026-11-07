import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import AchievementLog from "./AchievementLog";
import AchievementEmojiPicker from "./reusable/AchievementEmojiPicker";

export default function AddAchievement() {
  const addAchievement = useAppStore(s => s.addAchievement);
  const sports = useAppStore(s => s.sportsClasses);
  const templates = useAppStore(s => s.achievementTemplates);

  const isViewer = useAppStore(s => s.isViewer());

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [className, setClassName] = useState("");
  const [stars, setStars] = useState(1);
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const today = new Date().toISOString().slice(0, 16);

  const applyTemplateToForm = (t) => {
    if (isViewer) return;

    setTitle(t.title);
    setDesc(t.desc);
    setStars(t.stars);
    setEmoji(t.emoji || "");
    setDate(today);

    if (t.name?.toLowerCase() === "school") {
      setClassName("School");
      return;
    }

    setClassName(
      sports.find(s => s.name === t.name)?.name ?? ""
    );
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
        Achievements
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
            {showAddForm ? "Hide" : "Add Achievement"}
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
          Viewer Mode: Achievements cannot be added on this device.
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
            Add Achievement
          </h3>

          {/* Template Buttons */}
          <div className="mb-3 d-flex gap-2 flex-wrap">
            {templates.map(t => (
              <button
                key={t.id}
                className="btn btn-sm"
                style={{
                  background: "#b300ff",
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: 600,
                  padding: "6px 12px"
                }}
                onClick={() => applyTemplateToForm(t)}
              >
                {t.title}
              </button>
            ))}
          </div>

          {/* Template Dropdown */}
          <select
            className="form-select mb-3"
            style={{ borderRadius: "12px" }}
            onChange={e => {
              const t = templates.find(x => x.id === e.target.value);
              if (t) applyTemplateToForm(t);
            }}
          >
            <option value="">Choose a template</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>

          {/* Date */}
          <input
            type="datetime-local"
            className="form-control mb-3"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          {/* Icon */}
          <AchievementEmojiPicker value={emoji} onChange={setEmoji} />

          {/* Title */}
          <input
            className="form-control mb-3"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          {/* Description */}
          <textarea
            className="form-control mb-3"
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            style={{ borderRadius: "12px", minHeight: "100px" }}
          />

          {/* Sport */}
          <select
            className="form-select mb-3"
            style={{ borderRadius: "12px" }}
            value={className}
            onChange={e => setClassName(e.target.value)}
          >
            <option value="">No class</option>
            <option value="School">School</option>
            {sports.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>

          {/* Stars */}
          <input
            type="number"
            min="1"
            className="form-control mb-4"
            value={stars}
            onChange={e => setStars(Number(e.target.value))}
            style={{ borderRadius: "12px", width: "120px" }}
          />

          {/* Save + Cancel Buttons */}
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
                if (!title.trim()) return;
                addAchievement(title, desc, className, stars, date, emoji);
                setTitle("");
                setEmoji("");
                setDesc("");
                setStars(1);
                setDate("");
                setClassName("");
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

          </div>
        </div>
      )}

      {/* Achievement Log */}
      <AchievementLog />
    </div>
  );
}
