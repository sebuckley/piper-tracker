import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function SessionFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();

  const sports = useAppStore(s => s.sportsClasses);
  const addFeedback = useAppStore(s => s.addFeedback);
  const awardStar = useAppStore(s => s.logBehaviour);

  const scoreMax = useAppStore(s => s.scoreMax || 10);
  const starThreshold = useAppStore(s => s.starThreshold || 8);

  const sport = sports.find(s => s.id === id);

  const [sessionDate, setSessionDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  const [skillFeedback, setSkillFeedback] = useState({});
  const [overallNotes, setOverallNotes] = useState("");
  const [overallScore, setOverallScore] = useState(0);

  const [askStar, setAskStar] = useState(false);
  const [awardStarChoice, setAwardStarChoice] = useState(null);

  if (!sport) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Sport not found.</div>
      </div>
    );
  }

  const skillsToShow = selectedRoutine
  ? selectedRoutine?.skills
  : selectedCategory?.skills;


  // ⭐ Set date to now
  const setDateToNow = () => {
    const now = new Date();
    const formatted =
      now.toISOString().split("T")[0] + " " +
      now.toTimeString().split(" ")[0].slice(0, 5);
    setSessionDate(formatted);
  };

  // ⭐ Toggle skill feedback
  const handleSkillToggle = (skillId, type) => {
    setSkillFeedback(prev => ({
      ...prev,
      [skillId]: {
        completed: type === "completed" ? true : prev[skillId]?.completed || false,
        feedback:
          type === "positive"
            ? "positive"
            : type === "negative"
            ? "negative"
            : prev[skillId]?.feedback || null
      }
    }));
  };

  // ⭐ Score change
  const changeScore = (delta) => {
    const newScore = Math.max(0, Math.min(scoreMax, overallScore + delta));
    setOverallScore(newScore);

    if (newScore >= starThreshold) {
      setAskStar(true);
    } else {
      setAskStar(false);
      setAwardStarChoice(null);
    }
  };

  // ⭐ Submit form
  const submitForm = () => {
    if (askStar && awardStarChoice === null) {
      alert("Please choose whether to award a star.");
      return;
    }

    if (awardStarChoice === true) {
      awardStar("Sports Session", "High score achievement", 1);
    }

    addFeedback({
      sportId: sport.id,
      date: sessionDate,
      categoryId: selectedCategory?.id,
      routineId: selectedRoutine?.id || null,
      skills: skillFeedback,
      notes: overallNotes,
      score: overallScore
    });

    navigate(`/sports/${sport.id}/history`);
  };

return (
  <div className="container mt-4">

    {/* ⭐ Breadcrumb */}
    <div className="mb-3">
      <nav
        style={{
          fontWeight: 600,
          fontSize: "18px",
          textAlign: "left"
        }}
      >
        <Link to="/sports" style={{ color: "#b300ff", textDecoration: "none" }}>
          Sports
        </Link>

        <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

        <Link
          to={`/sports/${sport.id}`}
          style={{ color: "#b300ff", textDecoration: "none" }}
        >
          {sport.name}
        </Link>

        <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

        <span style={{ color: "#1f2a44" }}>Session Feedback</span>
      </nav>
    </div>

    {/* ⭐ Page Title */}
    <h2
      className="h3 mt-3 mb-4"
      style={{
        color: "#b300ff",
        fontWeight: 700,
        letterSpacing: "0.5px"
      }}
    >
      {sport.name} — Session Feedback
    </h2>

    {/* ⭐ Main Card */}
    <div
      className="p-4 mb-4"
      style={{
        borderRadius: "16px",
        border: "1px solid #e6e6e6",
        backgroundColor: "#ffffff"
      }}
    >

      {/* ⭐ Session Date */}
      <h3
        className="h4"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        Session Details
      </h3>

      <div className="mb-4">
        <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
          Session Date & Time
        </label>

        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="YYYY-MM-DD HH:MM"
            value={sessionDate}
            onChange={e => setSessionDate(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "6px 14px"
            }}
            onClick={setDateToNow}
          >
            Now
          </button>
        </div>
      </div>

      {/* ⭐ Category Selector */}
      <h3
        className="h4"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        Category
      </h3>

      <div className="mb-4">
        <select
          className="form-select"
          value={selectedCategory?.id || ""}
          onChange={e => {
            const cat = sport.categories.find(c => c.id === e.target.value);
            setSelectedCategory(cat);
            setSelectedRoutine(null);
          }}
          style={{ borderRadius: "12px" }}
        >
          <option value="">Select category</option>
          {sport.categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* ⭐ Routine Selector */}
      {selectedCategory && (
        <>
          <h3
            className="h4"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            Routine
          </h3>

          {selectedCategory.routines.length === 0 ? (
            <div
              className="p-3 mb-4"
              style={{
                borderRadius: "16px",
                border: "1px solid #e6e6e6",
                backgroundColor: "#ffffff"
              }}
            >
              <strong style={{ color: "#b300ff" }}>
                No routines added for this category.
              </strong>

              <div className="d-flex justify-content-end mt-3">
                <Link
                  to={`/sports/${sport.id}/categories/${selectedCategory.id}`}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#b300ff",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "6px 14px"
                  }}
                >
                  Add Routine
                </Link>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <select
                className="form-select"
                value={selectedRoutine?.id || ""}
                onChange={e => {
                  const routine = selectedCategory.routines.find(
                    r => r.id === e.target.value
                  );
                  setSelectedRoutine(routine);
                }}
                style={{ borderRadius: "12px" }}
              >
                <option value="">Select routine</option>
                {selectedCategory.routines.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {/* ⭐ Skills Section */}
      {selectedCategory && (
        <>
          <h3
            className="h4"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            Skills Completed & Feedback
          </h3>

          {(() => {
            const skillsToShow = selectedRoutine
              ? selectedRoutine.skills
              : selectedCategory.skills;

            if (skillsToShow.length === 0) {
              return (
                <div
                  className="p-3 mb-4"
                  style={{
                    borderRadius: "16px",
                    border: "1px solid #e6e6e6",
                    backgroundColor: "#ffffff"
                  }}
                >
                  <strong style={{ color: "#b300ff" }}>
                    No skills added for this category/routine.
                  </strong>

                  <div className="d-flex justify-content-end mt-3">
                    <Link
                      to={`/sports/${sport.id}/categories/${selectedCategory.id}`}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#b300ff",
                        color: "white",
                        fontWeight: 600,
                        borderRadius: "10px",
                        padding: "6px 14px"
                      }}
                    >
                      Add Skill
                    </Link>
                  </div>
                </div>
              );
            }

            return skillsToShow.map(skill => {
              const fb = skillFeedback[skill.id] || {};

              return (
                <div
                  key={skill.id}
                  className="p-3 mb-3"
                  style={{
                    borderRadius: "16px",
                    border: "1px solid #e6e6e6",
                    backgroundColor: "#ffffff"
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <strong style={{ width: "200px", color: "#1f2a44" }}>
                      {skill.name}
                    </strong>

                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: fb.completed ? "#28a745" : "white",
                        color: fb.completed ? "white" : "#1f2a44",
                        border: "1px solid #dcdcdc",
                        borderRadius: "10px",
                        fontWeight: 600
                      }}
                      onClick={() => handleSkillToggle(skill.id, "completed")}
                    >
                      ✓ Completed
                    </button>

                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor:
                          fb.feedback === "positive" ? "#28a745" : "white",
                        color: fb.feedback === "positive" ? "white" : "#1f2a44",
                        border: "1px solid #dcdcdc",
                        borderRadius: "10px",
                        fontWeight: 600
                      }}
                      onClick={() => handleSkillToggle(skill.id, "positive")}
                    >
                      👍 Positive
                    </button>

                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor:
                          fb.feedback === "negative" ? "#cc0033" : "white",
                        color: fb.feedback === "negative" ? "white" : "#1f2a44",
                        border: "1px solid #dcdcdc",
                        borderRadius: "10px",
                        fontWeight: 600
                      }}
                      onClick={() => handleSkillToggle(skill.id, "negative")}
                    >
                      👎 Negative
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </>
      )}

      {/* ⭐ Notes */}
      <h3
        className="h4 mt-4"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        Overall Notes
      </h3>

      <textarea
        className="form-control mb-4"
        value={overallNotes}
        onChange={e => setOverallNotes(e.target.value)}
        style={{ borderRadius: "12px", minHeight: "120px" }}
      />

      {/* ⭐ Score */}
      <h3
        className="h4"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        Overall Score (Max {scoreMax})
      </h3>

      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: "white",
            border: "1px solid #dcdcdc",
            borderRadius: "10px",
            fontWeight: 600
          }}
          onClick={() => changeScore(-1)}
        >
          −
        </button>

        <strong style={{ fontSize: "20px", color: "#b300ff" }}>
          {overallScore}
        </strong>

        <button
          className="btn btn-sm"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            borderRadius: "10px",
            fontWeight: 600
          }}
          onClick={() => changeScore(1)}
        >
          +
        </button>
      </div>

      {/* ⭐ Star Award */}
      {askStar && (
        <div
          className="p-3 mb-4"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <strong style={{ color: "#b300ff" }}>
            High Score! Award a star?
          </strong>

          <div className="d-flex gap-3 mt-3">
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                borderRadius: "10px",
                fontWeight: 600
              }}
              onClick={() => setAwardStarChoice(true)}
            >
              Yes ⭐
            </button>

            <button
              className="btn btn-sm btn-light"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc",
                fontWeight: 600
              }}
              onClick={() => setAwardStarChoice(false)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* ⭐ Save Button */}
      <div className="d-flex justify-content-end">
        <button
          className="btn"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            fontWeight: 600,
            borderRadius: "10px",
            padding: "10px 20px"
          }}
          onClick={submitForm}
        >
          Save Session Feedback
        </button>
      </div>

    </div>
  </div>
);


}
