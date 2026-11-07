import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

export default function FamilySettings() {
  const familyGroupId = useAppStore(s => s.familyGroupId);
  const familyMembers = useAppStore(s => s.familyMembers);
  const effectiveRole = useAppStore(s => s.effectiveRole);

  const updateFamilyMemberRole = useAppStore(s => s.updateFamilyMemberRole);
  const removeFamilyMember = useAppStore(s => s.removeFamilyMember);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  if (!familyGroupId) {
    return (
      <div className="container" style={{ maxWidth: "700px" }}>
        <h3>Loading family group…</h3>
      </div>
    );
  }

  if (effectiveRole !== "owner") {
    return (
      <div className="container" style={{ maxWidth: "700px" }}>
        <h3>Family Settings</h3>
        <p>You must be an owner to manage family members.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>

      {/* ⭐ Breadcrumb */}
      <div
        className="mb-3"
        style={{ fontSize: "18px", fontWeight: 600, textAlign: "left" }}
      >
        <Link
          to="/settings"
          style={{
            color: "#b300ff",
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          Settings
        </Link>
        <span style={{ color: "#1f2a44", margin: "0 8px" }}>/</span>
        <span style={{ color: "#1f2a44" }}>Family Settings</span>
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
        Family Settings
      </h2>

      {/* ⭐ Section Header + Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3
          className="h4"
          style={{ color: "#1f2a44", fontWeight: 600 }}
        >
          Family Members
        </h3>

        <button
          className="btn"
          style={{
            background: "#b300ff",
            color: "white",
            borderRadius: "10px",
            padding: "6px 14px",
            fontWeight: 600
          }}
          onClick={() => setShowInvite(true)}
        >
          + Add Member
        </button>
      </div>

      {/* ⭐ Invite Form */}
      {showInvite && (
        <div
          className="mb-4"
          style={{
            background: "white",
            border: "1px solid #e6e6e6",
            borderRadius: "16px",
            padding: "16px"
          }}
        >
          <h4
            className="h5 mb-3"
            style={{ color: "#1f2a44", fontWeight: 600 }}
          >
            Invite Family Member
          </h4>

          <input
            className="form-control mb-3"
            placeholder="Email address"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          <div className="d-flex gap-3">
            <button
              className="btn"
              style={{
                background: "#b300ff",
                color: "white",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={() => {
                useAppStore.getState().inviteFamilyMember(inviteEmail);
                setInviteEmail("");
                setShowInvite(false);
              }}
            >
              Send Invite
            </button>

            <button
              className="btn btn-light"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={() => setShowInvite(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ⭐ Members List */}
      {familyMembers.length === 0 && (
        <div className="text-muted">No family members found.</div>
      )}

      {familyMembers.map(member => (
        <div
          key={member.uid}
          className="mb-4 d-flex"
          style={{
            background: "white",
            border: "1px solid #e6e6e6",
            borderRadius: "16px",
            padding: "20px"
          }}
        >
          {/* Accent Bar */}
          <div
            style={{
              width: "6px",
              alignSelf: "stretch",
              background: "#b300ff",
              borderRadius: "6px",
              marginRight: "16px"
            }}
          />

          {/* Content */}
          <div className="d-flex justify-content-between w-100">

            {/* Member Info */}
            <div style={{ textAlign: "left" }}>
              <strong style={{ color: "#1f2a44", fontWeight: 600 }}>
                {member.email}
              </strong>

              <div className="small text-muted">
                UID: {member.uid}
              </div>

              <div className="small text-muted">
                Current Role: {member.role}
              </div>
            </div>

            {/* Actions */}
            <div
              className="d-flex flex-column align-items-end gap-2"
              style={{ minWidth: "180px" }}
            >
              {/* Role Selector */}
              <select
                className="form-select form-select-sm"
                style={{ borderRadius: "12px" }}
                value={member.role}
                onChange={e =>
                  updateFamilyMemberRole(member.uid, e.target.value)
                }
              >
                <option value="owner">Owner</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>

              {/* Remove Member */}
              {member.role !== "owner" && (
                <button
                  className="btn"
                  style={{
                    background: "red",
                    color: "white",
                    borderRadius: "10px",
                    padding: "6px 14px",
                    fontWeight: 600
                  }}
                  onClick={() => removeFamilyMember(member.uid)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
