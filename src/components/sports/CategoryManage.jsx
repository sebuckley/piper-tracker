import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import RoutinesSection from "./RoutinesSection";
import SkillsSection from "./SkillsSection";
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

  const sport = sportsClasses.find(s => s.id === sportId);
  const category = sport?.categories.find(c => c.id === categoryId);

  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddRoutine, setShowAddRoutine] = useState(false);

  const categoryLevels = category?.levels || ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];

  // ⭐ Skill fields
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("1");
  const [customSkillLevel, setCustomSkillLevel] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [newSkillLink, setNewSkillLink] = useState("");

  // ⭐ Routine fields
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineLevel, setNewRoutineLevel] = useState("1");
  const [customRoutineLevel, setCustomRoutineLevel] = useState("");

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

    const level =
      newSkillLevel === "custom"
        ? parseInt(customSkillLevel) || 1
        : parseInt(newSkillLevel);

    addSkill(sport.id, category.id, {
      name: newSkillName.trim(),
      level,
      description: newSkillDescription.trim(),
      link: newSkillLink.trim()
    });

    setNewSkillName("");
    setNewSkillLevel("1");
    setCustomSkillLevel("");
    setNewSkillDescription("");
    setNewSkillLink("");
    setShowAddSkill(false);
  };

  // ⭐ Add Routine
  const handleAddRoutine = () => {
    if (!newRoutineName.trim()) {
      alert("Routine name is required.");
      return;
    }

    const level =
      newRoutineLevel === "custom"
        ? parseInt(customRoutineLevel) || 1
        : parseInt(newRoutineLevel);

    addRoutine(sport.id, category.id, newRoutineName.trim(), level);

    setNewRoutineName("");
    setNewRoutineLevel("1");
    setCustomRoutineLevel("");
    setShowAddRoutine(false);
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

          <span style={{ color: "#1f2a44" }}>{category.name}</span>
        </nav>
      </div>

      {/* ⭐ Page Title */}
      <h2
        className="h3 mt-3 mb-4"
        style={{ color: "#b300ff", fontWeight: 700, letterSpacing: "0.5px" }}
      >
        Manage {category.name}
      </h2>

      <CategoryHeader
        sport={sport}
        category={category}
        categoryLevels={categoryLevels}
        updateCategory={updateCategory}
      />


      {/* ⭐ Skills Section */}
      <SkillsSection
        sport={sport}
        category={category}
        categoryLevels={categoryLevels}
        addSkill={addSkill}
        deleteSkill={deleteSkill}
      />



      {/* ⭐ Routines Section */}
      <RoutinesSection
        sport={sport}
        category={category}
        categoryLevels={categoryLevels}
        addRoutine={addRoutine}
        deleteRoutine={deleteRoutine}
      />

    </div>
  );
}
