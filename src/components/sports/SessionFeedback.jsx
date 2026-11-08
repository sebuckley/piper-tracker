import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { nanoid } from "nanoid";
import { getRoutineSkillFeedback } from "./feedbackDetails";
import FeedbackEntryDetails from "./FeedbackEntryDetails";
import "./SessionFeedback.css";

export default function SessionFeedback() {
  const { sportId } = useParams();
  const sport = useAppStore(s => s.sportsClasses.find(sp => sp.templateId === sportId));
  const addFeedbackSession = useAppStore(s => s.addFeedbackSession);

  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
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
  const [selectedType, setSelectedType] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [rating, setRating] = useState("");
  const [routineSkills, setRoutineSkills] = useState([]);
  const [showSkillNote, setShowSkillNote] = useState(false);
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

  const category = (sport.categories || []).find(c => c.id === selectedCategory);
  const items = selectedType === "skill" ? category?.skills || [] : category?.routines || [];
  const selectedItemRecord = items.find(item => item.id === selectedItem);
  const hasSkillFeedback = routineSkills.some(skill => skill.rating || skill.notes.trim() || skill.positive.trim() || skill.improve.trim());
  const hasDraft = Boolean(selectedItem || rating || hasSkillFeedback || Object.values(feedback).some(value => value.trim()));

  const resetEntryForm = () => {
    setSelectedType("");
    setSelectedItem("");
    setRating("");
    setRoutineSkills([]);
    setShowSkillNote(false);
    setFeedback({ whatHappened: "", positive: "", improve: "" });
    setEditingId(null);
    setFormError("");
  };

  const handleAddEntry = () => {
    if (!selectedCategory || !selectedType || !selectedItemRecord || !rating) {
      setFormError("Select a category, skill or routine, and rating before adding the feedback item.");
      return;
    }

    const newEntry = {
      id: editingId || nanoid(),
      type: selectedType,
      categoryId: selectedCategory,
      itemId: selectedItem,
      name: selectedItemRecord.name,
      rating,
      ...(selectedType === "skill"
        ? { feedback: { ...feedback, whatHappened: feedback.whatHappened || selectedItemRecord.name } }
        : editingId && entries.find(entry => entry.id === editingId)?.type === "routine"
          ? { feedback: entries.find(entry => entry.id === editingId).feedback }
          : {}),
      ...(selectedType === "routine" ? {
        skillFeedback: routineSkills.map(({ ref, name, rating: skillRating, notes: skillNotes, positive, improve }) => ({
          ref, name, rating: skillRating, notes: skillNotes, positive, improve
        }))
      } : {})
    };

    setEntries(prev => editingId
      ? prev.map(entry => entry.id === editingId ? newEntry : entry)
      : [...prev, newEntry]);

    resetEntryForm();
  };

  const handleEditEntry = entry => {
    if ((editingId || hasDraft) && !window.confirm("Discard the feedback item currently being edited?")) return;
    setSelectedCategory(entry.categoryId);
    setSelectedType(entry.type);
    setSelectedItem(entry.itemId);
    setRating(entry.rating);
    const entryCategory = (sport.categories || []).find(c => c.id === entry.categoryId);
    const routine = entryCategory?.routines?.find(r => r.id === entry.itemId);
    setRoutineSkills(entry.type === "routine" && routine
      ? getRoutineSkillFeedback(routine, entryCategory, entry.skillFeedback || [])
      : []);
    setShowSkillNote(false);
    setFeedback({
      whatHappened: entry.feedback?.whatHappened || "",
      positive: entry.feedback?.positive || "",
      improve: entry.feedback?.improve || ""
    });
    setEditingId(entry.id);
    setFormError("");
  };

  const changeSelection = (kind, value) => {
    if ((kind === "category" && value === selectedCategory) ||
        (kind === "type" && value === selectedType) ||
        (kind === "item" && value === selectedItem)) return;
    if ((rating || hasSkillFeedback || Object.values(feedback).some(value => value.trim())) &&
        !window.confirm("Changing the selection will discard the rating and notes currently being edited. Continue?")) return;
    setRoutineSkills([]);
    setShowSkillNote(false);
    setRating("");
    setFeedback({ whatHappened: "", positive: "", improve: "" });
    if (kind === "category") {
      setSelectedCategory(value);
      setSelectedType("");
      setSelectedItem("");
    } else if (kind === "type") {
      setSelectedType(value);
      setSelectedItem("");
    } else {
      setSelectedItem(value);
      const routine = selectedType === "routine" ? items.find(item => item.id === value) : null;
      if (routine) setRoutineSkills(getRoutineSkillFeedback(routine, category));
    }
  };

  const handleSubmit = () => {
    if (editingId || hasDraft) {
      setFormError(editingId
        ? "Update or cancel the item being edited before saving the session."
        : "Add or cancel the current feedback item before saving the session.");
      return;
    }

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
        <button className="btn app-btn-secondary" onClick={addDummy}>
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
                  className="btn app-btn-secondary"
                  aria-label="Remove one star"
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
                  className="btn app-btn-secondary"
                  aria-label="Add one star"
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
                onClick={() => changeSelection("category", c.id)}
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
                    onClick={() => changeSelection("type", t.id)}
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
{selectedType && category && (
  <div className="mb-4">
    <h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>
      {selectedType === "skill" ? "Skills" : "Routines"}
    </h3>

    {(() => {
      // Extract levels dynamically
      const levels = [...new Set(items.map(i => i.level).filter(Boolean))];

      // If no levels → show ungrouped
      if (levels.length === 0) {
        return (
          <div className="d-flex flex-wrap gap-2 mb-4">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => changeSelection("item", item.id)}
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
      return [...levels, ...(items.some(item => !item.level) ? [null] : [])].map(level => {
        const group = items.filter(i => level === null ? !i.level : i.level === level);

        return (
          <div key={level} className="mb-3">
            <div className="small fw-bold mb-2" style={{ color: "#1f2a44" }}>
              {level || "Other"}
            </div>

            <div className="d-flex flex-wrap gap-2">
              {group.map(item => (
                <button
                  key={item.id}
                  onClick={() => changeSelection("item", item.id)}
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


          {selectedItemRecord && selectedType === "skill" && (
            <div className="mb-4" style={{ background: "white", borderRadius: "16px", border: "1px solid #e6e6e6", padding: "16px" }}>
              <button type="button" className="btn btn-sm app-btn-secondary" aria-expanded={showSkillNote} onClick={() => setShowSkillNote(open => !open)}>
                {showSkillNote ? "Hide note" : feedback.positive || feedback.improve ? "Edit note" : "Add note"}
              </button>
              {showSkillNote && <div className="feedback-note mt-3">
              <div className="small mb-2"><strong>What Happened:</strong> {feedback.whatHappened || selectedItemRecord.name}</div>
              {[
                { field: "positive", label: "Positive" },
                { field: "improve", label: "Improve" }
              ].map(({ field, label }) => (
                <div className="mb-3" key={field}>
                  <label htmlFor={`feedback-${field}`} className="form-label fw-bold">{label}</label>
                  <textarea
                    id={`feedback-${field}`}
                    className="form-control mb-2"
                    rows="2"
                    value={feedback[field]}
                    onChange={e => setFeedback(current => ({ ...current, [field]: e.target.value }))}
                    style={{ borderRadius: "12px" }}
                  />
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-sm app-btn-secondary"
                      aria-label={`Set ${label} to N/A`}
                      onClick={() => setFeedback(current => ({ ...current, [field]: "N/A" }))}
                    >
                      N/A
                    </button>
                  </div>
                </div>
              ))}
              </div>}
            </div>
          )}

          {selectedItemRecord && selectedType === "routine" && (
            <section className="feedback-skills mb-4 p-3">
              <h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>Routine Skills</h3>
              <p className="small text-muted mb-3">Rate or add notes for any skills you want. They will be saved with the routine; you do not need to add them separately.</p>
              {routineSkills.length === 0 && <div className="small text-muted">No skills are listed in this routine.</div>}
              {routineSkills.map((skill, index) => (
                <fieldset key={`${skill.ref}-${index}`} className="feedback-skill mb-3 p-3">
                  <legend className="fs-6 fw-bold">{skill.name}</legend>
                  {skill.missing && <div className="small text-warning mb-2">This skill could not be found in the current category.</div>}
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {[
                      { value: "needs work", label: "Needs Work" },
                      { value: "mixed", label: "Mixed" },
                      { value: "good", label: "Good" },
                      { value: "excellent", label: "Excellent" },
                      { value: "not attempted", label: "Not attempted" }
                    ].map(option => (
                      <button
                        key={option.value}
                        type="button"
                        className="btn btn-sm app-btn-secondary"
                        aria-pressed={skill.rating === option.value}
                        onClick={() => setRoutineSkills(current => current.map((item, i) =>
                          i === index ? { ...item, rating: item.rating === option.value ? "" : option.value } : item
                        ))}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm app-btn-secondary"
                    aria-expanded={skill.showNote}
                    onClick={() => setRoutineSkills(current => current.map((item, i) =>
                      i === index ? { ...item, showNote: !item.showNote } : item
                    ))}
                  >
                    {skill.showNote ? "Hide note" : skill.notes || skill.positive || skill.improve ? "Edit note" : "Add note"}
                  </button>
                  {skill.showNote && (
                    <div className="feedback-note mt-3">
                      <div className="small mb-2"><strong>What Happened:</strong> {skill.name}</div>
                      {skill.hasLegacyNotes && (
                        <div className="mb-2">
                          <label htmlFor={`routine-skill-legacy-${index}`} className="form-label small fw-bold">Previous notes for {skill.name}</label>
                          <textarea
                            id={`routine-skill-legacy-${index}`}
                            className="form-control"
                            rows="2"
                            value={skill.notes}
                            onChange={event => {
                              const notes = event.target.value;
                              setRoutineSkills(current => current.map((item, i) => i === index ? { ...item, notes } : item));
                            }}
                          />
                        </div>
                      )}
                      {[{ field: "positive", label: "Positive" }, { field: "improve", label: "Improve" }].map(({ field, label }) => (
                        <div className="mb-2" key={field}>
                          <label htmlFor={`routine-skill-${field}-${index}`} className="form-label small fw-bold">{label} for {skill.name}</label>
                          <textarea
                            id={`routine-skill-${field}-${index}`}
                            className="form-control mb-2"
                            rows="2"
                            value={skill[field]}
                            onChange={event => {
                              const value = event.target.value;
                              setRoutineSkills(current => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm app-btn-secondary"
                            aria-label={`Set ${label} for ${skill.name} to N/A`}
                            onClick={() => setRoutineSkills(current => current.map((item, i) => i === index ? { ...item, [field]: "N/A" } : item))}
                          >N/A</button>
                        </div>
                      ))}
                    </div>
                  )}
                </fieldset>
              ))}
            </section>
          )}

          {/* ⭐ RATING */}
          {selectedItemRecord && (
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

          {/* ⭐ ADD ENTRY */}
          {(selectedItemRecord || editingId || hasDraft) && (
            <div className="d-flex gap-2 mb-4">
            <button
              type="button"
              className="btn"
              onClick={handleAddEntry}
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "10px",
                padding: "10px 20px"
              }}
            >
              {editingId ? "Update Feedback Item" : "+ Add Feedback Item"}
            </button>
            <button type="button" className="btn app-btn-secondary" onClick={resetEntryForm}>
              {editingId ? "Cancel Edit" : "Cancel Item"}
            </button>
            </div>
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
                  <FeedbackEntryDetails entry={e} />
                  <button type="button" className="btn btn-sm app-btn-secondary mt-2" onClick={() => handleEditEntry(e)}>
                    Edit {e.name}
                  </button>
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
          {formError && <div className="alert alert-danger" role="alert">{formError}</div>}
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
