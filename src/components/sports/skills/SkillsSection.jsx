import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SkillsBrowser from "./SkillsBrowser";
import { useAppStore } from "../../../store/useAppStore";

export default function SkillsSection({ sport, category, deleteSkill, readOnly = false }) {
  const navigate = useNavigate();

  const defaultSports = useAppStore(s => s.defaultSports);
  const loadDefaultSports = useAppStore(s => s.loadDefaultSports);

  useEffect(() => {
    if (defaultSports.length === 0) {
      loadDefaultSports();
    }
  }, [defaultSports.length, loadDefaultSports]);

  if (defaultSports.length === 0) {
    return <div className="text-muted small">Loading skills…</div>;
  }

  const sportTemplate = defaultSports.find(s => s.id === sport.templateId);
  if (!sportTemplate) {
    return <div className="text-muted small">Sport template not found.</div>;
  }

  const categoryTemplate = sportTemplate.categories.find(
    c => c.id === category.templateId
  );
  if (!categoryTemplate) {
    return <div className="text-muted small">Category template not found.</div>;
  }

  // Merge template + custom skills
  const mergedSkills = [
    ...categoryTemplate.skills.map(s => ({ ...s, isTemplate: true })),
    ...category.skills.map(s => ({ ...s, isTemplate: false }))
  ];

  return (
    <SkillsBrowser
      skills={mergedSkills}
      levels={sportTemplate.levels}
      sportId={sport.templateId}
      categoryId={category.templateId}
      onRemove={readOnly ? undefined : skill => deleteSkill(sport.id, category.id, skill.id)}
      readOnly={readOnly}
      manageButton={
        !readOnly &&
        <button
          className="btn btn-light"
          style={{
            borderRadius: "10px",
            border: "1px solid #dcdcdc",
            fontWeight: 600,
            padding: "6px 14px"
          }}
          onClick={() =>
            navigate(
              `/sports/${sport.templateId}/categories/${category.templateId}/skills/manage`
            )
          }
        >
          Manage Skills
        </button>
      }
      title={`Manage ${category.name} Skills`}
    />
  );
}
