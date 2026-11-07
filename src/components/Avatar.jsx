import React from "react";
import { useAppStore } from "../store/useAppStore";

export default function Avatar({ size = 48 }) {
   const userProfile = useAppStore(s => s.userProfile);

  const first = userProfile.firstName?.trim() || "";
  const last = userProfile.lastName?.trim() || "";

  const fullName = `${first} ${last}`.trim() || "User";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map(part => part[0].toUpperCase())
    .slice(0, 2)
    .join("");

  const hasImage = Boolean(userProfile.avatarUrl);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid #b300ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: hasImage ? "transparent" : "#FF5CA8",
        margin: "0 auto"
      }}
    >
      {hasImage ? (
        <img
          src={profile.avatarUrl}
          alt={fullName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      ) : (
        <span
          style={{
            fontWeight: "700",
            color: "#ffffff",
            fontSize: size * 0.4
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
