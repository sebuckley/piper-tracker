import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { nanoid } from "nanoid";

export default function SessionFeedback() {
  const { sportId } = useParams();
  const classes = useAppStore(s => s.sportsClasses);
  const sport = useAppStore(s => s.sportsClasses.find(sp => sp.templateId === sportId));
  const addFeedbackSession = useAppStore(s => s.addFeedbackSession);

  const [entries, setEntries] = useState([]);
  const [mode, setMode] = useState("simple");
  const [notes, setNotes] = useState("");
  const [simpleStars, setSimpleStars] = useState(0);
  const [overall, setOverall] = useState({
    effort: "",
    listening: "",
    behaviour: "",
    summary: ""
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState(""); // skill | routine
  const [selectedItem, setSelectedItem] = useState("");
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState({
    whatHappened: "",
    positive: "",
    improve: ""
  });
  const [score, setScore] = useState(null);
  const [starsAwarded, setStarsAwarded] = useState(0);

  if (!sport) {
    return <div className="container mt-4">Sport not found.</div>;
  }

  const category = sport.categories.find(c => c.id === selectedCategory);

  const handleAddEntry = () => {
    if (!selectedCategory || !selectedType || !selectedItem || !rating) return;

    const item =
      selectedType === "skill"
        ? category.skills.find(s => s.id === selectedItem)
        : category.routines.find(r => r.id === selectedItem);

    const items = selectedType === "skill" ? category.skills : category.routines;

    // Get all unique levels
    const levels = [...new Set(items.map(i => i.level).filter(Boolean))];


    const newEntry = {
      id: nanoid(),
      type: selectedType,
      categoryId: selectedCategory,
      itemId: selectedItem,
      name: item.name,
      rating,
      feedback
    };

    setEntries(prev => [...prev, newEntry]);

    // Reset fields
    setSelectedType("");
    setSelectedItem("");
    setRating("");
    setFeedback({ whatHappened: "", positive: "", improve: "" });
  };

  const handleSubmit = () => {

    const base = {
      id: nanoid(),
      sportId: sport.templateId ?? sport.id,
      sportName: sport.name,
      date: new Date().toISOString(),
      mode
    };

    const session =
      mode === "simple"
        ? { ...base, notes, starsAwarded: simpleStars, entries: [], overall: { summary: notes }, score: null }
        : { ...base, entries, overall, score, starsAwarded };

    addFeedbackSession(session);
    window.history.back();
  };

  const addDummy = () => {
    if (!sport || sport.categories.length === 0) return;

    const cat = sport.categories[0];
    const skill = cat.skills[0];

    // Fill selection fields
    setSelectedCategory(cat.id);
    setSelectedType("skill");
    setSelectedItem(skill?.id || "");
    setRating("good");

    // Fill feedback fields
    setFeedback({
      whatHappened: "Practised basic movements.",
      positive: "Showed good control.",
      improve: "Needs more consistency."
    });

    // Add entry to the list
    const newEntry = {
      id: nanoid(),
      type: "skill",
      categoryId: cat.id,
      itemId: skill?.id || "",
      name: skill?.name || "Dummy Skill",
      rating: "good",
      feedback: {
        whatHappened: "Practised basic movements.",
        positive: "Showed good control.",
        improve: "Needs more consistency."
      }
    };

    setEntries(prev => [...prev, newEntry]);

    // Fill overall summary
    setOverall({
      effort: "good",
      listening: "mixed",
      behaviour: "excellent",
      summary: "Strong session with room for improvement."
    });

    alert("Dummy data filled!");
  };

  const updateScore = (value) => {

    setScore(value);

    if (value >= 10) setStarsAwarded(3);
    else if (value >= 9) setStarsAwarded(2);
    else if (value >= 8) setStarsAwarded(1);
    else setStarsAwarded(0);

  };

  return (
    <>
      <div className="mb-3">
        <button className="btn btn-secondary" onClick={addDummy}>
          Add Dummy Feedback
        </button>
      </div>


        <div
          className="container mt-4"
          style={{
            maxWidth: "1200px",
            border: "2px solid #e6e6e6",
            borderRadius: "16px",
            padding: "24px",
            background: "white"
          }}
        >
          {/* ⭐ Page Title */}
          <h2
            className="h3 mt-3 mb-4 text-center"
            style={{ color: "#b300ff", fontWeight: 700, letterSpacing: "0.5px" }}
          >
            Session Feedback — {sport.name}
          </h2>

          {/* ⭐ MODE TOGGLE */}
          <div className="d-flex gap-2 mb-4 justify-content-center">
            {[
              { id: "simple", label: "Simple" },
              { id: "detailed", label: "Detailed" }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="btn"
                style={{
                  borderRadius: "12px",
                  padding: "8px 20px",
                  fontWeight: 600,
                  backgroundColor: mode === m.id ? "#b300ff" : "white",
                  color: mode === m.id ? "white" : "#1f2a44",
                  border: mode === m.id ? "2px solid #b300ff" : "2px solid #e6e6e6"
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* ⭐ SIMPLE FEEDBACK */}
          {mode === "simple" && (
            <div className="mb-4">
              <label className="form-label fw-bold">Feedback</label>
              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="How did the session go?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ borderRadius: "12px" }}
              />

              <label className="form-label fw-bold">Stars</label>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-light"
                  style={{ borderRadius: "10px", border: "1px solid #dcdcdc", fontWeight: 700 }}
                  onClick={() => setSimpleStars(s => Math.max(0, s - 1))}
                >
                  −
                </button>
                <div style={{ fontSize: "28px", minWidth: "120px", textAlign: "center" }}>
                  {simpleStars === 0
                    ? <span style={{ color: "#ccc", fontSize: "16px" }}>No stars</span>
                    : <span style={{ color: "#f5b800" }}>{"⭐".repeat(Math.min(simpleStars, 5))}{simpleStars > 5 ? ` ${simpleStars}` : ""}</span>}
                </div>
                <button
                  className="btn btn-light"
                  style={{ borderRadius: "10px", border: "1px solid #dcdcdc", fontWeight: 700 }}
                  onClick={() => setSimpleStars(s => s + 1)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {mode === "detailed" && (
          <>

          {/* ⭐ CATEGORY */}
          <h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>
            Category
          </h3>

          <div className="d-flex flex-wrap gap-2 mb-4">
            {sport.categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className="btn"
                style={{
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontWeight: 600,
                  backgroundColor:
                    selectedCategory === c.id ? "#b300ff" : "white",
                  color: selectedCategory === c.id ? "white" : "#1f2a44",
                  border: selectedCategory === c.id
                    ? "2px solid #b300ff"
                    : "2px solid #e6e6e6",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                📁 {c.name}
              </button>
            ))}
          </div>

          {/* ⭐ TYPE */}
          {selectedCategory && (
            <>
              <h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>
                Type
              </h3>

              <div className="d-flex gap-2 mb-4">
                {[
                  { id: "skill", icon: "🧩", label: "Skill" },
                  { id: "routine", icon: "🎵", label: "Routine" }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className="btn"
                    style={{
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontWeight: 600,
                      backgroundColor:
                        selectedType === t.id ? "#b300ff" : "white",
                      color: selectedType === t.id ? "white" : "#1f2a44",
                      border: selectedType === t.id
                        ? "2px solid #b300ff"
                        : "2px solid #e6e6e6",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ⭐ SKILLS / ROUTINES GROUPED BY LEVEL */}
{selectedType && (
  <div className="mb-4">
    <h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>
      {selectedType === "skill" ? "Skills" : "Routines"}
    </h3>

    {(() => {
      const items =
        selectedType === "skill"
          ? category.skills
          : category.routines;

      // Extract levels dynamically
      const levels = [...new Set(items.map(i => i.level).filter(Boolean))];

      // If no levels → show ungrouped
      if (levels.length === 0) {
        return (
          <div className="d-flex flex-wrap gap-2 mb-4">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className="btn"
                style={{
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontWeight: 600,
                  backgroundColor:
                    selectedItem === item.id ? "#b300ff" : "white",
                  color: selectedItem === item.id ? "white" : "#1f2a44",
                  border: selectedItem === item.id
                    ? "2px solid #b300ff"
                    : "2px solid #e6e6e6"
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        );
      }

      // Grouped by detected levels
      return levels.map(level => {
        const group = items.filter(i => i.level === level);

        return (
          <div key={level} className="mb-3">
            <div className="small fw-bold mb-2" style={{ color: "#1f2a44" }}>
              {level}
            </div>

            <div className="d-flex flex-wrap gap-2">
              {group.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className="btn"
                  style={{
                    borderRadius: "12px",
                    padding: "10px 14px",
                    fontWeight: 600,
                    backgroundColor:
                      selectedItem === item.id ? "#b300ff" : "white",
                    color: selectedItem === item.id ? "white" : "#1f2a44",
                    border: selectedItem === item.id
                      ? "2px solid #b300ff"
                      : "2px solid #e6e6e6"
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        );
      });
    })()}
  </div>
)}


          {/* ⭐ RATING */}
          {selectedItem && (
            <div className="mb-4">
              <h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>
                Rating
              </h3>

              <div className="d-flex gap-2 flex-wrap">
                {[
                  { id: "needs work", icon: "🔧", label: "Needs Work" },
                  { id: "mixed", icon: "🤷", label: "Mixed" },
                  { id: "good", icon: "👍", label: "Good" },
                  { id: "excellent", icon: "🌟", label: "Excellent" }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRating(r.id)}
                    className="btn"
                    style={{
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontWeight: 600,
                      backgroundColor:
                        rating === r.id ? "#b300ff" : "white",
                      color: rating === r.id ? "white" : "#1f2a44",
                      border: rating === r.id
                        ? "2px solid #b300ff"
                        : "2px solid #e6e6e6",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ⭐ FEEDBACK TEXT */}
          {rating && (
            <div
              className="mb-4"
              style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid #e6e6e6",
                padding: "16px"
              }}
            >
              <h3 className="h4 mb-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
                Details
              </h3>

              <label className="form-label fw-bold">What Happened?</label>
              <textarea
                className="form-control mb-3"
                rows="2"
                value={feedback.whatHappened}
                onChange={e =>
                  setFeedback({ ...feedback, whatHappened: e.target.value })
                }
                style={{ borderRadius: "12px" }}
              />

              <label className="form-label fw-bold">Positive</label>
              <textarea
                className="form-control mb-3"
                rows="2"
                value={feedback.positive}
                onChange={e =>
                  setFeedback({ ...feedback, positive: e.target.value })
                }
                style={{ borderRadius: "12px" }}
              />

              <label className="form-label fw-bold">Improve</label>
              <textarea
                className="form-control"
                rows="2"
                value={feedback.improve}
                onChange={e =>
                  setFeedback({ ...feedback, improve: e.target.value })
                }
                style={{ borderRadius: "12px" }}
              />
            </div>
          )}

          {/* ⭐ ADD ENTRY */}
          {rating && (
            <button
              className="btn mb-4"
              onClick={handleAddEntry}
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "10px",
                padding: "10px 20px"
              }}
            >
              + Add Feedback Item
            </button>
          )}

          {/* ⭐ ADDED ENTRIES */}
          {entries.length > 0 && (
            <div className="mb-4">
              <h3 className="h4 mb-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
                Added Feedback
              </h3>

              {entries.map(e => (
                <div
                  key={e.id}
                  className="p-3 mb-2"
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    border: "1px solid #e6e6e6"
                  }}
                >
                  <strong>{e.name}</strong> — {e.rating}
                  <div className="small mt-2">
                    <div><strong>What Happened:</strong> {e.feedback.whatHappened}</div>
                    <div><strong>Positive:</strong> {e.feedback.positive}</div>
                    <div><strong>Improve:</strong> {e.feedback.improve}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ⭐ OVERALL SUMMARY */}
          <h3 className="h4 mb-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
            Overall Summary
          </h3>

          <div
            className="p-3 mb-4"
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e6e6e6"
            }}
          >
            {[
              { field: "effort", label: "Effort" },
              { field: "listening", label: "Listening" },
              { field: "behaviour", label: "Behaviour" }
            ].map(section => (
              <div key={section.field} className="mb-3">
                <label className="form-label fw-bold">{section.label}</label>

                <div className="d-flex gap-2 flex-wrap">
                  {[
                    { id: "poor", icon: "⚠️", label: "Poor" },
                    { id: "mixed", icon: "🤷", label: "Mixed" },
                    { id: "good", icon: "👍", label: "Good" },
                    { id: "excellent", icon: "🌟", label: "Excellent" }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() =>
                        setOverall({ ...overall, [section.field]: r.id })
                      }
                      className="btn"
                      style={{
                        borderRadius: "12px",
                        padding: "10px 14px",
                        fontWeight: 600,
                        backgroundColor:
                          overall[section.field] === r.id ? "#b300ff" : "white",
                        color:
                          overall[section.field] === r.id ? "white" : "#1f2a44",
                        border: overall[section.field] === r.id
                          ? "2px solid #b300ff"
                          : "2px solid #e6e6e6",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      }}
                    >
                      {r.icon} {r.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <label className="form-label fw-bold">Summary</label>
            <textarea
              className="form-control"
              rows="3"
              value={overall.summary}
              onChange={e => setOverall({ ...overall, summary: e.target.value })}
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* ⭐ SCORE OUT OF 10 */}
<h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>
  Session Score (out of 10)
</h3>

<div className="d-flex flex-wrap gap-2 mb-3">
  {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
    <button
      key={num}
      onClick={() => updateScore(num)}
      className="btn"
      style={{
        borderRadius: "12px",
        padding: "10px 14px",
        fontWeight: 600,
        backgroundColor: score === num ? "#b300ff" : "white",
        color: score === num ? "white" : "#1f2a44",
        border: score === num
          ? "2px solid #b300ff"
          : "2px solid #e6e6e6",
        minWidth: "48px",
        textAlign: "center"
      }}
    >
      {num}
    </button>
  ))}
</div>

        {/* ⭐ STAR PREVIEW */}
        <div className="mb-4">
          <div className="small fw-bold" style={{ color: "#1f2a44" }}>
            Stars Awarded:
          </div>

          <div style={{ fontSize: "28px", marginTop: "6px" }}>
            {starsAwarded === 0 && <span style={{ color: "#ccc" }}>No stars</span>}
            {starsAwarded >= 1 && <span style={{ color: "#f5b800" }}>⭐</span>}
            {starsAwarded >= 2 && <span style={{ color: "#f5b800" }}>⭐</span>}
            {starsAwarded >= 3 && <span style={{ color: "#f5b800" }}>⭐</span>}
          </div>
        </div>
          </>
          )}


          {/* ⭐ SAVE */}
          <button
            className="btn"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 700,
              borderRadius: "10px",
              padding: "10px 20px"
            }}
          >
            Save Feedback
          </button>
        </div>




    </>
  
  );
}
