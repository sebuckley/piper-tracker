import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function AchievementTemplates() {
  const templates = useAppStore(s => s.achievementTemplates);
  const addTemplate = useAppStore(s => s.addAchievementTemplate);
  const updateTemplate = useAppStore(s => s.updateAchievementTemplate);
  const deleteTemplate = useAppStore(s => s.deleteAchievementTemplate);

  const sports = useAppStore(s => s.sportsClasses);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStars, setNewStars] = useState(5);
  const [newName, setNewName] = useState(""); // ⭐ NEW

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStars, setEditStars] = useState(5);
  const [editName, setEditName] = useState(""); // ⭐ NEW

  return (
    <div
      className="card shadow-sm mt-4"
      style={{ borderRadius: "16px", border: "1px solid #e6e6e6" }}
    >
      <div className="p-4">

        <h2 className="h5 mb-4" style={{ color: "#1f2a44", fontWeight: "600" }}>
          Achievement Templates
        </h2>

        {/* ⭐ Add Template */}
        <div className="row mb-4">
          <div className="col-md-3 mb-2">
            <input
              className="form-control"
              placeholder="Template title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="col-md-3 mb-2">
            <input
              className="form-control"
              placeholder="Template description"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="col-md-2 mb-2">
            <input
              type="number"
              min="1"
              className="form-control"
              value={newStars}
              onChange={e => setNewStars(Number(e.target.value))}
              style={{ borderRadius: "10px" }}
            />
          </div>

          {/* ⭐ Class Name Dropdown */}
          <div className="col-md-2 mb-2">
            <select
              className="form-select"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{ borderRadius: "10px" }}
            >
              <option value="">No class</option>
              <option value="School">School</option>
              {sports.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2 mb-2">
            <button
              className="btn w-100"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: "600",
                borderRadius: "12px"
              }}
              onClick={() => {
                if (!newTitle.trim()) return;
                addTemplate(newTitle.trim(), newDesc.trim(), newStars, newName || "");
                setNewTitle("");
                setNewDesc("");
                setNewStars(5);
                setNewName("");
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* ⭐ Template List */}
        <ul className="list-group">
          {templates.map(t => (
            <li
              key={t.id}
              className="list-group-item"
              style={{ borderRadius: "10px", marginBottom: "14px" }}
            >
              {editingId === t.id ? (
                <>
                  <input
                    className="form-control mb-2"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    style={{ borderRadius: "10px" }}
                  />

                  <input
                    className="form-control mb-2"
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    style={{ borderRadius: "10px" }}
                  />

                  <input
                    type="number"
                    min="1"
                    className="form-control mb-3"
                    value={editStars}
                    onChange={e => setEditStars(Number(e.target.value))}
                    style={{ borderRadius: "10px" }}
                  />

                  {/* ⭐ Edit Class Name Dropdown */}
                  <select
                    className="form-select mb-3"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{ borderRadius: "10px" }}
                  >
                    <option value="">No class</option>
                    <option value="School">School</option>
                    {sports.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success"
                      style={{ borderRadius: "10px" }}
                      onClick={() => {
                        updateTemplate(t.id, {
                          title: editTitle,
                          desc: editDesc,
                          stars: editStars,
                          name: editName || ""
                        });
                        setEditingId(null);
                      }}
                    >
                      Save
                    </button>

                    <button
                      className="btn btn-secondary"
                      style={{ borderRadius: "10px" }}
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong style={{ color: "#1f2a44" }}>{t.title}</strong>
                    <div className="text-muted small">{t.desc}</div>
                    <div className="text-muted small">Stars: {t.stars}</div>
                    <div className="text-muted small">Class: {t.name || "None"}</div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      style={{ borderRadius: "10px" }}
                      onClick={() => {
                        setEditingId(t.id);
                        setEditTitle(t.title);
                        setEditDesc(t.desc);
                        setEditStars(t.stars);
                        setEditName(t.name || "");
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      style={{ borderRadius: "10px" }}
                      onClick={() => deleteTemplate(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
