export default function HoldScreen2({
  title = "Loading...",
  subtitle = "Please wait a moment.",
}) {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "70vh",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* Animated Circle */}
      <div className="hs2-circle mb-4"></div>

      {/* Text */}
      <div style={{ maxWidth: "600px" }}>
        <h2
          style={{
            color: "#b300ff",
            fontWeight: 700,
            letterSpacing: "0.5px",
            marginBottom: "12px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: "#1f2a44",
            fontSize: "18px",
            lineHeight: "1.5",
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
