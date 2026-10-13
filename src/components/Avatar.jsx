import React from "react";
import { useAppStore } from "../store/useAppStore";

export default function Avatar({ size = 48 }) {
  const profile = useAppStore(state => state.profile);

  const name = profile?.fullName?.trim() || "User";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map(part => part[0].toUpperCase())
    .slice(0, 2)
    .join("");

  const hasImage = Boolean(profile?.avatarUrl);

  if (hasImage) {
    return (
      <img
        src={profile.avatarUrl}
        alt="avatar"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #b300ff"
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#FF5CA8",
        border: "2px solid #b300ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        color: "#ffffff",
        fontSize: size * 0.4
      }}
    >
      {initials}
    </div>
  );
}
