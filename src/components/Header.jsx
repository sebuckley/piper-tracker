import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import Avatar from "./Avatar";
import ChildAvatar from "./ChildAvatar";

export default function Header() {
  const logout = useAppStore(s => s.logout);
  const userProfile = useAppStore(s => s.userProfile);

  const activeChild = useAppStore(s => s.activeChild);
  const children = useAppStore(s => s.children);

  const child = children.find(c => c.id === activeChild);

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const avatarUrl =
    userProfile?.avatarUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      userProfile?.firstName || userProfile?.email || "User"
    )}&background=FF5CA8&color=ffffff`;

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "12px 20px",
        borderBottom: "1px solid #e6e6e6",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      {/* TOP ROW */}
      <div className="d-flex justify-content-between align-items-center">

        {/* LEFT: CHILD AVATAR + TITLE */}
        <div className="d-flex align-items-center gap-4" style={{ flexGrow: 1 }}>
          <ChildAvatar child={child} size={60} name={false} />

          <div>
            <h2
              className="h3"
              style={{
                margin: 0,
                color: "#b300ff",
                fontWeight: 700,
                letterSpacing: "0.5px",
                fontFamily: '"Love Ya Like A Sister", cursive',
                fontWeight: 400
              }}
            >
              {child?.preferredName || child?.fullName || "Child"}’s Progress Tracker
            </h2>

            <small
              style={{
                color: "#4a5670",
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "0.9rem"
              }}
            >
              Track achievements, routines and sports
            </small>
          </div>
        </div>

        {/* RIGHT: DESKTOP AVATAR + LOGOUT */}
        <div className="d-none d-md-flex align-items-center gap-3">
          <Avatar size={48} />

          <button
            className="btn"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #dcdcdc",
              borderRadius: "10px",
              padding: "8px 16px",
              fontWeight: 600,
              color: "#cc0033"
            }}
            onClick={logout}
          >
            Logout
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="btn d-md-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #dcdcdc",
            borderRadius: "10px",
            padding: "6px 10px"
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

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mt-3 d-md-none">
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e6e6e6",
              borderRadius: "16px",
              padding: "12px"
            }}
            className="d-flex flex-column gap-2"
          >
            {[
              ["/", "Dashboard"],
              ["/behaviour", "Behaviour"],
              ["/achievement", "Achievements"],
              ["/sports", "Sports & Activities"],
              ["/rewards", "Rewards"],
              ["/settings", "Settings"],
              ["/profile", "Profile"]
            ].map(([path, label]) => {
              const isActive = location.pathname === path;

              return (
                <Link
                  key={path}
                  to={path}
                  className="btn text-start"
                  style={{
                    backgroundColor: "#ffffff",
                    color: isActive ? "#b300ff" : "#1f2a44",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    border: isActive ? "2px solid #b300ff" : "1px solid #dcdcdc",
                    fontWeight: 600
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}

            {/* MOBILE LOGOUT */}
            <button
              className="btn text-start"
              style={{
                backgroundColor: "#cc0033",
                borderRadius: "10px",
                padding: "10px 16px",
                color: "#fff",
                fontWeight: 600
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
