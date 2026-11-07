import { Link, useLocation } from "react-router-dom";

export default function NavigationTabs({ isViewer }) {
  const location = useLocation();

  const tabs = [
    ["/", "Dashboard"],
    ["/behaviour", "Behaviour"],
    ["/achievement", "Achievements"],
    ["/sports", "Sports & Activities"],
    ["/rewards", "Rewards"],
    ["/bank", "Bank Account"],
    ...(!isViewer ? [
      ["/settings", "Settings"],
      ["/profile", "Profile"]
    ] : [])
  ];

  return (
    <nav
      className="d-flex gap-3 justify-content-center mb-4 flex-wrap"
      style={{ maxWidth: "1200px", margin: "0 auto" }}
    >
      {tabs.map(([path, label]) => {
        const isActive = location.pathname === path;

        return (
          <Link
            key={path}
            to={path}
            className="btn"
            style={{
              backgroundColor: "#ffffff",
              color: isActive ? "#b300ff" : "#1f2a44",
              borderRadius: "10px",
              padding: "10px 20px",
              fontWeight: "600",
              border: isActive ? "2px solid #b300ff" : "1px solid #dcdcdc",
              transition: "0.2s"
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
