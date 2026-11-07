import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import RoutinesSection from "./skills/routines/RoutinesSection";
import SkillsSection from "./skills/SkillsSection";
import CategoryHeader from "./CategoryHeader";

export default function CategoryManage() {
  const { sportId, categoryId } = useParams();
  const navigate = useNavigate();

  const {
    sportsClasses,
    addSkill,
    addRoutine,
    deleteSkill,
    deleteRoutine,
    updateCategory,
  } = useAppStore();

  // ⭐ Hooks MUST come before any conditional return
  const sport = sportsClasses.find(s => s.templateId === sportId);
  const category = sport?.categories.find(c => c.templateId === categoryId);

  // ⭐ Skill fields
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("1");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [newSkillLink, setNewSkillLink] = useState("");

  // ⭐ Routine fields
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineLevel, setNewRoutineLevel] = useState("1");

  // ⭐ NOW we can safely return early
  if (!sport || !category) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Not found.</div>
      </div>
    );
  }

  // ⭐ Add Skill
  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      alert("Skill name is required.");
      return;
    }

    addSkill(sport.id, category.id, {
      name: newSkillName.trim(),
      level: parseInt(newSkillLevel),
      description: newSkillDescription.trim(),
      link: newSkillLink.trim()
    });

    setNewSkillName("");
    setNewSkillLevel("1");
    setNewSkillDescription("");
    setNewSkillLink("");
  };

  // ⭐ Add Routine
  const handleAddRoutine = () => {
    if (!newRoutineName.trim()) {
      alert("Routine name is required.");
      return;
    }

    addRoutine(
      sport.id,
      category.id,
      newRoutineName.trim(),
      parseInt(newRoutineLevel)
    );

    setNewRoutineName("");
    setNewRoutineLevel("1");
  };

  return (
    <div
      className="container mt-4"
      style={{
        maxWidth: "1200px",
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        border: "2px solid #e6e6e6"
      }}
    >
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
            Sports & Activities
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <Link
            to={`/sports/${sport.templateId}`}
            style={{ color: "#b300ff", textDecoration: "none" }}
          >
            {sport.name}
          </Link>

          <span style={{ color: "#1f2a44", margin: "0 6px" }}>›</span>

          <span style={{ color: "#1f2a44" }}>{category.name}</span>
        </nav>
      </div>

      {/* ⭐ Page Title */}
      <h2
        className="h3 mt-3 mb-4 text-center"
        style={{
          color: "#b300ff",
          fontWeight: 700,
          letterSpacing: "0.5px"
        }}
      >
        Manage {category.name}
      </h2>

      {/* ⭐ Category Header */}
      <CategoryHeader
        sport={sport}
        category={category}
        updateCategory={updateCategory}
      />

      {/* ⭐ Skills Section */}
      <SkillsSection
        sport={sport}
        category={category}
        addSkill={handleAddSkill}
        deleteSkill={deleteSkill}
        newSkillName={newSkillName}
        setNewSkillName={setNewSkillName}
        newSkillLevel={newSkillLevel}
        setNewSkillLevel={setNewSkillLevel}
        newSkillDescription={newSkillDescription}
        setNewSkillDescription={setNewSkillDescription}
        newSkillLink={newSkillLink}
        setNewSkillLink={setNewSkillLink}
      />

      {/* ⭐ Routines Section */}
      <RoutinesSection
        sport={sport}
        category={category}
        addRoutine={handleAddRoutine}
        deleteRoutine={deleteRoutine}
        newRoutineName={newRoutineName}
        setNewRoutineName={setNewRoutineName}
        newRoutineLevel={newRoutineLevel}
        setNewRoutineLevel={setNewRoutineLevel}
      />
    </div>
  );
}
