export default function ChildAvatar({ child, name=true, size=120 }) {
  if (!child) return null;
  const initials = child?.fullName
    .split(" ")
    .map(n => n[0].toUpperCase())
    .join("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "20px"
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          backgroundColor: "#FF5CA8",
          border: "3px solid #b300ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${size / 3}px`,
          fontWeight: "700",
          color: "white"
        }}
      >
        {initials}
      </div>

      {name && (
        <>
          <strong style={{ marginTop: "10px" }}>{child?.fullName || ""}</strong>
          <small>{child?.preferredSport || ""}</small>
        </>
      )}
    </div>
  );
}
