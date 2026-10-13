import { useState } from "react";
import { Link } from "react-router-dom";
import { sportsTemplates } from "../../data/sportsData";
import { useAppStore } from "../../store/useAppStore";
import { useNavigate } from "react-router-dom";


export default function AddSports() {
  const { addSportFromTemplate, addCustomSport } = useAppStore();
  const navigate = useNavigate();


  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [feedback, setFeedback] = useState("");

  const filtered = sportsTemplates.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCustom = () => {
    if (!customName.trim()) return;

    addCustomSport(customName.trim());
    setFeedback(`Sport "${customName}" added — returning to Sports & Activities…`);
    setCustomName("");
    setShowAddForm(false);

    setTimeout(() => {
      window.location.href = "/sports";
    }, 1200);
  };

  const handleAddTemplate = templateId => {
    const template = sportsTemplates.find(t => t.id === templateId);
    addSportFromTemplate(templateId);

    setFeedback(`"${template.name}" added — returning to Sports & Activities…`);

    setTimeout(() => {
      navigate("/sports");
    }, 1200);
  };

  return (
    <div className="container mt-4">

      {/* ⭐ Breadcrumb */}
      <div className="mb-3">
        <nav style={{ fontWeight: 600, fontSize: "18px", textAlign: "left" }}>
          <Link to="/sports" style={{ color: "#b300ff", textDecoration: "none" }}>
            Sports & Activities
          </Link>
          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>
          <span style={{ color: "#1f2a44" }}>Add Sport</span>
        </nav>
      </div>

      {/* ⭐ Page Title */}
      <h2
        className="h3 mt-3 mb-4"
        style={{ color: "#b300ff", fontWeight: 700, letterSpacing: "0.5px" }}
      >
        Add a Sport
      </h2>

      {/* ⭐ Section Header */}
      <h3
        className="h4"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        Choose a Sport Template
      </h3>

      {/* ⭐ Add Button (for custom sport) */}
      <div className="d-flex justify-content-end align-items-center mb-3">
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            fontWeight: 600,
            borderRadius: "10px",
            padding: "6px 14px"
          }}
          onClick={() => setShowAddForm(true)}
        >
          + Create Custom Sport
        </button>
      </div>

      {/* ⭐ Search Input */}
      <input
        className="form-control mb-3"
        placeholder="Search sports..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      {/* ⭐ Template List */}
      <div className="mb-4">
        {filtered.map(s => (
          <div
            key={s.id}
            className="p-3 mb-3"
            style={{
              borderRadius: "16px",
              border: "1px solid #e6e6e6",
              backgroundColor: "#ffffff"
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong style={{ color: "#b300ff", fontSize: "16px" }}>
                  {s.name}
                </strong>
              </div>

              <button
                className="btn btn-sm"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #dcdcdc",
                  borderRadius: "10px",
                  fontWeight: 600
                }}
                onClick={() => handleAddTemplate(s.id)}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ⭐ Add Custom Sport Form */}
      {showAddForm && (
        <div
          className="p-3 mb-4"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff"
          }}
        >
          <label
            className="form-label"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            New Sport Name
          </label>

          <input
            className="form-control mb-3"
            placeholder="Enter sport name"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          <div className="d-flex gap-2 justify-content-end">
            <button
              className="btn"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                fontWeight: 600,
                borderRadius: "12px"
              }}
              onClick={handleAddCustom}
            >
              Save
            </button>

            <button
              className="btn btn-light"
              style={{
                borderRadius: "12px",
                border: "1px solid #dcdcdc",
                fontWeight: 600
              }}
              onClick={() => {
                setShowAddForm(false);
                setCustomName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ⭐ Feedback */}
      {feedback && (
        <div
          className="p-3 mt-3"
          style={{
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#ffffff",
            color: "#1f2a44",
            fontWeight: 600
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
