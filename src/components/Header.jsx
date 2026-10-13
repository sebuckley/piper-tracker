import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useAppStore } from "../store/useAppStore";
import Avatar from "./Avatar";
import ChildAvatar from "./ChildAvatar";

export default function Header({ page, setPage, child }) {
  const { logout } = useAuthStore();
  const profile = useAppStore(state => state.profile);

  const [menuOpen, setMenuOpen] = useState(false);

  const avatarUrl =
    profile?.avatarUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      profile?.fullName || "User"
    )}&background=FF5CA8&color=ffffff`;

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "12px 20px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      {/* Top Row */}
      <div className="d-flex justify-content-between align-items-center">
        
        {/* Title */}
        <div
          className="d-flex align-items-center gap-4"
          style={{ flexGrow: 1 }}
        >
          {/* Child Avatar */}
          <ChildAvatar child={child} size={60} name={false} />

          {/* Title + Subtitle */}
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "2.4rem",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontFamily: "'Patrick Hand', 'Gloria Hallelujah', cursive",
                color: "#b300ff",
                fontWeight: "700",
                position: "relative"
              }}
            >
              {child?.preferredName || child?.fullName || "Child"}’s Progress Tracker
            </h2>

            <small
              style={{
                color: "#4a5670",
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "0.95rem"
              }}
            >
              Track achievements, routines and sports
            </small>
          </div>
        </div>

        {/* Desktop Avatar + Logout */}
        <div className="d-none d-md-flex align-items-center gap-3">
          <Avatar size={48} />
          
          <button
            className="btn btn-outline-danger"
            style={{ borderRadius: "10px", padding: "8px 16px" }}
            onClick={logout}
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="btn d-md-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #dcdcdc",
            borderRadius: "10px"
          }}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="#1f2a44"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mt-3 d-md-none">
          <div className="d-flex flex-column gap-2">
            {[
              ["dashboard", "Dashboard"],
              ["behaviour", "Behaviour"],
              ["achievement", "Achievements"],
              ["sports", "Sports & Activities"],
              ["rewards", "Rewards"],
              ["settings", "Settings"],
              ["profile", "Profile"]
            ].map(([key, label]) => (
              <button
                key={key}
                className="btn text-start"
                style={{
                  backgroundColor: "#ffffff",
                  color: page === key ? "#b300ff" : "#1f2a44",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  border:
                    page === key ? "2px solid #b300ff" : "1px solid #dcdcdc"
                }}
                onClick={() => {
                  setPage(key);
                  setMenuOpen(false);
                }}
              >
                {label}
              </button>
            ))}

            <button
              className="btn btn-danger text-start"
              style={{
                borderRadius: "10px",
                padding: "10px 16px",
                color: "#fff"
              }}
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
