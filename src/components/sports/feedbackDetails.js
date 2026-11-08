export function getRoutineSkillFeedback(routine, category, savedSkills = []) {
  const used = new Set();
  const skills = (routine.skills || []).map((ref, index) => {
    const skill = (category.skills || []).find(item =>
      item.templateId === ref || item.id === ref || item.name === ref
    );
    const previousIndex = savedSkills[index]?.ref === ref && !used.has(index)
      ? index
      : savedSkills.findIndex((item, i) => item.ref === ref && !used.has(i));
    if (previousIndex >= 0) used.add(previousIndex);
    const previous = savedSkills[previousIndex];
    return {
      ref,
      name: skill?.name || previous?.name || ref,
      rating: previous?.rating || "",
      notes: previous?.notes || "",
      positive: previous?.positive || "",
      improve: previous?.improve || "",
      hasLegacyNotes: Boolean(previous?.notes),
      showNote: false,
      missing: !skill
    };
  });
  return [
    ...skills,
    ...savedSkills.filter((_, index) => !used.has(index)).map(skill => ({
      ...skill,
      notes: skill.notes || "",
      positive: skill.positive || "",
      improve: skill.improve || "",
      hasLegacyNotes: Boolean(skill.notes),
      showNote: false,
      missing: true
    }))
  ];
}
