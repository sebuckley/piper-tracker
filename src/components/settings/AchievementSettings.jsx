import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import AchievementEmojiPicker from "../reusable/AchievementEmojiPicker";
import { resolveAchievementEmoji } from "../../utils/achievementEmojis";

export default function AchievementTemplates() {
  const templates = useAppStore(s => s.achievementTemplates);
  const addTemplate = useAppStore(s => s.addAchievementTemplate);
  const updateTemplate = useAppStore(s => s.updateAchievementTemplate);
  const deleteTemplate = useAppStore(s => s.deleteAchievementTemplate);

  const sports = useAppStore(s => s.sportsClasses);

  const [showAddForm, setShowAddForm] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStars, setNewStars] = useState(5);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStars, setEditStars] = useState(5);
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState("");

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
        <span style={{ color: "#1f2a44" }}>Achievement Templates</span>
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
        Achievement Templates
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
          Add Template
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
            Add Achievement Template
          </h4>

          <AchievementEmojiPicker value={newEmoji} onChange={setNewEmoji} />

          <div className="row">
            <div className="col-md-3 mb-3">
              <input
                className="form-control"
                style={{ borderRadius: "12px" }}
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="col-md-3 mb-3">
              <input
                className="form-control"
                style={{ borderRadius: "12px" }}
                placeholder="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div className="col-md-2 mb-3">
              <input
                type="number"
                min="1"
                className="form-control"
                style={{ borderRadius: "12px" }}
                value={newStars}
                onChange={(e) => setNewStars(Number(e.target.value))}
              />
            </div>

            <div className="col-md-2 mb-3">
              <select
                className="form-select"
                style={{ borderRadius: "12px" }}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              >
                <option value="">No class</option>
                <option value="School">School</option>
                {sports.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

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
                if (!newTitle.trim()) return;
                addTemplate(newTitle.trim(), newDesc.trim(), newStars, newName || "", newEmoji);
                setShowAddForm(false);
                setNewEmoji("");
                setNewTitle("");
                setNewDesc("");
                setNewStars(5);
                setNewName("");
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

      {/* Template List */}
      {templates.map((t) => (
        <div
          key={t.id}
          className="mb-4 d-flex"
          style={{
            background: "white",
            border: "1px solid #e6e6e6",
            borderRadius: "16px",
            padding: "20px"
          }}
        >
          {/* Accent Bar */}
          <div
            style={{
              width: "6px",
              background: "#b300ff",
              borderRadius: "6px",
              marginRight: "16px"
            }}
          />

          {/* Content */}
          {editingId === t.id ? (
            <div style={{ flexGrow: 1 }}>
              <AchievementEmojiPicker value={editEmoji} onChange={setEditEmoji} />

              <input
                className="form-control mb-3"
                style={{ borderRadius: "12px" }}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
              />

              <input
                className="form-control mb-3"
                style={{ borderRadius: "12px" }}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Description"
              />

              <input
                type="number"
                min="1"
                className="form-control mb-3"
                style={{ borderRadius: "12px" }}
                value={editStars}
                onChange={(e) => setEditStars(Number(e.target.value))}
              />

              <select
                className="form-select mb-3"
                style={{ borderRadius: "12px" }}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              >
                <option value="">No class</option>
                <option value="School">School</option>
                {sports.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>

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
                    updateTemplate(t.id, {
                      title: editTitle,
                      desc: editDesc,
                      stars: editStars,
                      name: editName || "",
                      emoji: editEmoji
                    });
                    setEditingId(null);
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
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className="d-flex justify-content-between align-items-start w-100"
              style={{ textAlign: "left" }}
            >
              <div>
                <strong style={{ color: "#000", fontWeight: 600 }}>
                  <span style={{ fontSize: "1.4rem", marginRight: "8px" }}>
                    {resolveAchievementEmoji(t.emoji)}
                  </span>
                  {t.title}
                </strong>

                <div className="small" style={{ color: "#000" }}>
                  {t.desc}
                </div>

                <div className="small" style={{ color: "#000" }}>
                  Stars: {t.stars}
                </div>

                <div className="small" style={{ color: "#000" }}>
                  Class: {t.name || "None"}
                </div>
              </div>

              <div
                className="d-flex flex-column align-items-end gap-2"
                style={{ minWidth: "150px" }}
              >
                <button
                  className="btn"
                  style={{
                    background: "white",
                    border: "1px solid #dcdcdc",
                    borderRadius: "10px",
                    padding: "6px 14px",
                    fontWeight: 600,
                    color: "#0d6efd"
                  }}
                  onClick={() => {
                    setEditingId(t.id);
                    setEditTitle(t.title);
                    setEditDesc(t.desc);
                    setEditStars(t.stars);
                    setEditName(t.name || "");
                    setEditEmoji(t.emoji || "");
                  }}
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
                  onClick={() => deleteTemplate(t.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
