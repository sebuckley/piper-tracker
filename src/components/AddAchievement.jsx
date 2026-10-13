import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import AchievementLog from "./AchievementLog";

export default function AddAchievement() {
  const addAchievement = useAppStore(s => s.addAchievement);
  const sports = useAppStore(s => s.sportsClasses);
  const templates = useAppStore(s => s.achievementTemplates);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [className, setClassName] = useState("");
  const [stars, setStars] = useState(1);
  const [date, setDate] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  // ⭐ Correct format for datetime-local
  const today = new Date().toISOString().slice(0, 16);


  // ⭐ Populate form from template
  const applyTemplateToForm = (t) => {

    setTitle(t.title);
    setDesc(t.desc);
    setStars(t.stars);
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
    <div className="container mt-4">

      {/* Toggle Button */}
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
        {showAddForm ? "Hide Add Achievement" : "Add Achievement"}
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
              Add Achievement
            </h2>

            {/* Template Buttons */}
            <div className="mb-3 d-flex gap-2 flex-wrap">
              {templates.map(t => (
                <button
                  key={t.id}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#b300ff",
                    color: "white",
                    borderRadius: "10px",
                    fontWeight: "600"
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
              style={{ borderRadius: "10px" }}
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
              style={{ borderRadius: "10px" }}
            />

            {/* Title */}
            <input
              className="form-control mb-3"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ borderRadius: "10px" }}
            />

            {/* Description */}
            <textarea
              className="form-control mb-3"
              placeholder="Description"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              style={{ borderRadius: "10px", minHeight: "100px" }}
            />

            {/* Sport */}
<select
  className="form-select mb-3"
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
              style={{ borderRadius: "10px", width: "120px" }}
            />

            {/* Save */}
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: "600",
                padding: "10px 20px",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(179,0,255,0.25)"
              }}
              onClick={() => {
                if (!title.trim()) return;
                addAchievement(title, desc, className, stars, date);

                setTitle("");
                setDesc("");
                setStars(1);
                setDate("");
                setClassName("");
                setShowAddForm(false);
              }}
            >
              Save Achievement
            </button>

          </div>
        </div>
      )}

      <AchievementLog />
    </div>
  );
}
