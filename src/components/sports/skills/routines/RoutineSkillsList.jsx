import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function RoutineSkillsList({
  routine,
  category,
  sport,
  moveSkill,
  deleteRoutineSkill,
  handleDragEnd
}) {
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="routineSkills">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {routine.skills.length === 0 && (
              <div className="text-muted small">No skills added yet.</div>
            )}

            {routine.skills.map((skillId, index) => {
              const skillDefinition = category.skills.find(
                sk => sk.templateId === skillId || sk.id === skillId || sk.name === skillId
              );

              const googleQuery = encodeURIComponent(
                `${skillDefinition?.name} ${skillDefinition?.description || ""}`
              );

              return (
                <div
                  key={index}
                  className="p-3 mb-3"
                  style={{
                    borderRadius: "16px",
                    border: "1px solid #e6e6e6",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center"
                  }}
                >
                  {/* ⭐ Drag Handle + Number */}
                  <div
                    {...provided.dragHandleProps}
                    style={{
                      cursor: "grab",
                      fontWeight: 700,
                      color: "#b300ff",
                      width: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      borderRadius: "8px"
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* ⭐ Accent Bar */}
                  <div
                    style={{
                      width: "6px",
                      backgroundColor: "#b300ff",
                      borderRadius: "6px",
                      alignSelf: "stretch"
                    }}
                  ></div>

                  {/* ⭐ Skill Content */}
                  <div style={{ flexGrow: 1, textAlign: "left" }}>
                    <strong style={{ color: "#b300ff", fontSize: "16px" }}>
                      {skillDefinition?.name}
                    </strong>

                    <div className="text-muted small">
                      Level {skillDefinition?.level}
                    </div>

                    {skillDefinition?.description && (
                      <div className="small mt-1">
                        {skillDefinition?.description}
                      </div>
                    )}

                    {skillDefinition?.link && (
                      <div className="small mt-1">
                        <a
                          href={skillDefinition?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#b300ff" }}
                        >
                          View demonstration →
                        </a>
                      </div>
                    )}

                    <div className="small mt-2">
                      <a
                        href={`https://www.google.com/search?q=${googleQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#b300ff", fontWeight: 600 }}
                      >
                        Search Google →
                      </a>
                    </div>
                  </div>

                  {/* ⭐ Controls */}
                  <div className="d-flex gap-2 align-items-center">
                    <button
                      className="btn btn-sm"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #dcdcdc",
                        background: "white",
                        fontWeight: 600
                      }}
                      onClick={() => moveSkill(index, -1)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>

                    <button
                      className="btn btn-sm"
                      style={{
                        borderRadius: "10px",
                        border: "1px solid #dcdcdc",
                        background: "white",
                        fontWeight: 600
                      }}
                      onClick={() => moveSkill(index, 1)}
                      disabled={index === routine.skills.length - 1}
                    >
                      ↓
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      style={{ borderRadius: "10px" }}
                      onClick={() =>
                        deleteRoutineSkill(
                          sport.id,
                          category.id,
                          routine.id,
                          skillDefinition?.id,
                          index
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
