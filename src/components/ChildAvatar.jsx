export default function ChildAvatar({ child, name = true, size = 120 }) {
  if (!child) return null;

  const fullName = `${child.firstName || ""} ${child.lastName || ""}`.trim();
  const firstName = child.firstName || "";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join("");

  const hasAvatar = Boolean(child.avatarUrl);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "20px"
      }}
    >
      {/* Avatar Circle */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          backgroundColor: hasAvatar ? "transparent" : "#FF5CA8",
          border: "3px solid #b300ff",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {hasAvatar ? (
          <img
            src={child.avatarUrl}
            alt={firstName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : (
          <span
            style={{
              fontSize: `${size / 3}px`,
              fontWeight: "700",
              color: "white"
            }}
          >
            {initials || "?"}
          </span>
        )}
      </div>

      {/* Name + Sport */}
      {name && (
        <>
          <strong style={{ marginTop: "10px" }}>{fullName}</strong>
          <small>{child.preferredSport || ""}</small>
        </>
      )}
    </div>
  );
}
