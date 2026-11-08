export default function FeedbackEntryDetails({ entry }) {
  const hasEntryNote = entry.feedback?.positive || entry.feedback?.improve ||
    (entry.feedback?.whatHappened && (entry.type === "routine" || entry.feedback.whatHappened !== entry.name));
  return (
    <details className="mb-2">
      <summary style={{ cursor: "pointer" }}>
        <strong>{entry.name}</strong> — {entry.rating}
      </summary>
      <div className="small mt-2" style={{ whiteSpace: "pre-wrap" }}>
        {hasEntryNote && (
          <div className="mb-2">
            {entry.type === "routine" && <strong>Previous routine feedback:</strong>}
            {entry.feedback?.whatHappened && <div><strong>What Happened:</strong> {entry.feedback.whatHappened}</div>}
            {entry.feedback?.positive && <div><strong>Positive:</strong> {entry.feedback.positive}</div>}
            {entry.feedback?.improve && <div><strong>Improve:</strong> {entry.feedback.improve}</div>}
          </div>
        )}
        {entry.skillFeedback?.length > 0 && (
          <div className="mt-2">
            <strong>Routine skills:</strong>
            <ul className="mb-0">
              {entry.skillFeedback.map((skill, index) => (
                <li key={`${skill.ref}-${index}`}>
                  <strong>{skill.name}</strong> — {skill.rating || "Not rated"}
                  {(skill.notes || skill.positive || skill.improve) && (
                    <div>
                      <div><strong>What Happened:</strong> {skill.name}</div>
                      {skill.notes && <div><strong>Notes:</strong> {skill.notes}</div>}
                      {skill.positive && <div><strong>Positive:</strong> {skill.positive}</div>}
                      {skill.improve && <div><strong>Improve:</strong> {skill.improve}</div>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}
