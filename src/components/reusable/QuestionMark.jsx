export default function QuestionMark({ text, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: color || "#1f2a44", // navy
        color: "white",
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
        marginLeft: "2px",
        position: "relative"
      }}
      title={text}
    >
      ?
    </span>
  );
}
