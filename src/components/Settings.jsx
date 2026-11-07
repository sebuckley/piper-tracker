import { Link } from "react-router-dom";

export default function Settings() {

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>

      {/* ⭐ Breadcrumb */}
      <div className="mb-3" style={{ fontSize: "18px", fontWeight: 600, textAlign: "left" }}>
        <span style={{ color: "#1f2a44" }}>Settings</span>
      </div>

      {/* ⭐ Page Title */}
      <h2
        className="h3 mt-3 mb-4 text-center"
        style={{
          color: "#b300ff",
          fontWeight: 700,
          letterSpacing: "0.5px"
        }}
      >
        Settings
      </h2>

      {/* ⭐ Section Header */}
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600, textAlign: "left" }}
      >
        Choose a Settings Area
      </h3>

      {/* ⭐ Settings Navigation Card */}
      <div
        style={{
          background: "white",
          border: "1px solid #e6e6e6",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "left"
        }}
      >
        <div className="d-flex flex-column gap-4">

          {/* Behaviour */}
          <div>
            <Link
              to="/settings/behaviour"
              style={{
                color: "#b300ff",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "18px"
              }}
            >
              Behaviour Settings
            </Link>
            <p className="text-muted mt-1 mb-0">
              Configure behaviour categories, positive actions, negative actions,
              and how behaviour is tracked for your child.
            </p>
          </div>

          {/* Achievements */}
          <div>
            <Link
              to="/settings/achievements"
              style={{
                color: "#b300ff",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "18px"
              }}
            >
              Achievement Settings
            </Link>
            <p className="text-muted mt-1 mb-0">
              Manage achievement categories, milestones, and custom achievement
              types for sports, school, and routines.
            </p>
          </div>

          {/* Rewards */}
          <div>
            <Link
              to="/settings/rewards"
              style={{
                color: "#b300ff",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "18px"
              }}
            >
              Rewards Settings
            </Link>
            <p className="text-muted mt-1 mb-0">
              Create and customise rewards, star values, and how rewards are
              unlocked or redeemed.
            </p>
          </div>

          {/* Device Management */}
          <div>
            <Link
              to="/settings/device"
              style={{
                color: "#b300ff",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "18px"
              }}
            >
              Device Management
            </Link>
            <p className="text-muted mt-1 mb-0">
              Approve or remove devices, manage device permissions, and set
              child‑safe access levels per device.
            </p>
          </div>

          {/* Family Settings */}
          <div>
            <Link
              to="/settings/family"
              style={{
                color: "#b300ff",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "18px"
              }}
            >
              Family Settings
            </Link>
            <p className="text-muted mt-1 mb-0">
              Invite family members, assign roles (Owner, Editor, Viewer), and
              manage who can access your child’s progress.
            </p>
          </div>

          {/* Child Manager */}
          <div>
            <Link
              to="/settings/child"
              style={{
                color: "#b300ff",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "18px"
              }}
            >
              Child Manager
            </Link>
            <p className="text-muted mt-1 mb-0">
              Add or edit children, update their profile, set relationships,
              manage avatars, and configure sport preferences.
            </p>
          </div>

          {/* ⭐ Bank Accounts */}
          <div>
            <Link
              to="/settings/bank"
              style={{
                color: "#b300ff",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "18px"
              }}
            >
              Bank Accounts
            </Link>
            <p className="text-muted mt-1 mb-0">
              Create and manage bank accounts, set account names, currencies,
              and account types (saving or current).
            </p>
          </div>

          {/* Developer Settings */}
          {process.env.NODE_ENV === "development" && (
            <div>
              <Link
                to="/settings/admin"
                style={{
                  color: "#b300ff",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "18px"
                }}
              >
                Admin
              </Link>
              <p className="text-muted mt-1 mb-0">
                Administration of the application.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
