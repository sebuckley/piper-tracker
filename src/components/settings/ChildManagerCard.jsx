import { useState } from "react";
import ChildAvatar from "../ChildAvatar";
import { useAppStore } from "@/store/useAppStore";

export default function ChildManagerCard({ child }) {
  const activeChild = useAppStore(s => s.activeChild);
  const setActiveChild = useAppStore(s => s.setActiveChild);

  const userProfile = useAppStore(s => s.userProfile);
  const familyMembers = useAppStore(s => s.familyMembers);

  const isOwner = useAppStore(s => s.isOwner());
  const isEditor = useAppStore(s => s.isEditor());

  const updateChild = useAppStore(s => s.updateChild);
  const deleteChild = useAppStore(s => s.deleteChild);

  const fullName = `${child.firstName} ${child.lastName}`.trim();
  const isActive = activeChild === child.id;

  const relationships = child.relationships || {};
  const userId = userProfile?.uid;

  // ⭐ LOCAL EDIT STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState(child.firstName || "");
  const [editLastName, setEditLastName] = useState(child.lastName || "");
  const [editPreferredName, setEditPreferredName] = useState(child.preferredName || "");
  const [editDob, setEditDob] = useState(child.dob || "");
  const [editGender, setEditGender] = useState(child.gender || "");
  const [editSport, setEditSport] = useState(child.preferredSport || "");

  const calculateAge = dob => {
    if (!dob) return child.age || 0;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSaveEdit = () => {
    updateChild(child.id, {
      firstName: editFirstName,
      lastName: editLastName,
      preferredName: editPreferredName,
      dob: editDob,
      gender: editGender,
      age: calculateAge(editDob),
      preferredSport: editSport.trim()
    });
    setIsEditing(false);
  };

  return (
    <div
      className="mb-4"
      style={{
        background: "white",
        border: "1px solid #e6e6e6",
        borderRadius: "16px",
        padding: "16px"
      }}
    >
      {/* ⭐ TOP ROW */}
      <div className="d-flex align-items-center gap-3">
        <ChildAvatar size={80} child={child} />

        <div style={{ flexGrow: 1 }}>
          {isActive && (
            <span
              style={{
                background: "#b300ff",
                color: "white",
                borderRadius: "999px",
                padding: "2px 10px",
                fontSize: "12px",
                fontWeight: 600
              }}
            >
              Active
            </span>
          )}

          <div className="text-muted small mt-2">
            Preferred: {child.preferredName || fullName} <br />
            Gender: {child.gender || "Not set"} <br />
            Age: {child.age} <br />
            Sport: {child.preferredSport || "None"}
          </div>
        </div>

        {/* ⭐ ACTION BUTTONS */}
        <div
          className="d-flex flex-column align-items-end gap-2"
          style={{ minWidth: "160px" }}
        >
          <button
            className="btn"
            style={{
              background: "white",
              border: "1px solid #dcdcdc",
              borderRadius: "10px",
              padding: "6px 14px",
              fontWeight: 600,
              color: "#0d6efd"
            }}
            onClick={() => setIsEditing(prev => !prev)}
          >
            {isEditing ? "Close" : "Manage"}
          </button>

          {!isActive && (
            <button
              className="btn"
              style={{
                background: "white",
                border: "1px solid #dcdcdc",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600,
                color: "#1f2a44"
              }}
              onClick={() => setActiveChild(child.id)}
            >
              Set Active Child
            </button>
          )}

          <button
            className="btn"
            style={{
              background: "red",
              color: "white",
              borderRadius: "10px",
              padding: "6px 14px",
              fontWeight: 600
            }}
            onClick={() => deleteChild(child.id)}
          >
            Remove
          </button>
        </div>
      </div>

      {/* ⭐ RELATIONSHIPS */}
      <div className="mt-4">
        <h4
          className="h5 mb-3"
          style={{ color: "#1f2a44", fontWeight: 600 }}
        >
          Relationships
        </h4>

        {familyMembers.map(member => {
          const relObj = relationships[member.uid] || {};
          const role = relObj.role || "";
          const knownAs = relObj.knownAs || "";

          const canEdit = isOwner || member.uid === userId;

          return (
            <div key={member.uid} className="row mb-4">
              {/* LEFT COLUMN */}
              <div className="col-12 col-md-6 mb-2">
                <strong style={{ color: "#1f2a44" }}>{member.name}</strong>
                <div className="text-muted small">{member.email}</div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-12 col-md-6">
                <select
                  className="form-select mb-2"
                  disabled={!canEdit}
                  style={{ borderRadius: "12px" }}
                  value={role}
                  onChange={e =>
                    updateChild(child.id, {
                      relationships: {
                        ...relationships,
                        [member.uid]: {
                          ...relObj,
                          role: e.target.value
                        }
                      }
                    })
                  }
                >
                  <option value="">Select relationship</option>
                  <option value="Mum">Mum</option>
                  <option value="Dad">Dad</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Coach">Coach</option>
                  <option value="Family Friend">Family Friend</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="text"
                  className="form-control"
                  disabled={!canEdit}
                  placeholder="Known as (e.g., Nana, Poppa, Grandad Jim)"
                  value={knownAs}
                  onChange={e =>
                    updateChild(child.id, {
                      relationships: {
                        ...relationships,
                        [member.uid]: {
                          ...relObj,
                          knownAs: e.target.value
                        }
                      }
                    })
                  }
                  style={{ borderRadius: "12px" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ⭐ INLINE EDIT FORM */}
      {isEditing && (
        <div
          className="mt-3"
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
            Edit Child Details
          </h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                style={{ borderRadius: "12px" }}
                placeholder="First Name"
                value={editFirstName}
                onChange={e => setEditFirstName(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                style={{ borderRadius: "12px" }}
                placeholder="Surname"
                value={editLastName}
                onChange={e => setEditLastName(e.target.value)}
              />
            </div>
          </div>

          <input
            className="form-control mb-3"
            style={{ borderRadius: "12px" }}
            placeholder="Preferred Name"
            value={editPreferredName}
            onChange={e => setEditPreferredName(e.target.value)}
          />

          <select
            className="form-select mb-3"
            style={{ borderRadius: "12px" }}
            value={editGender}
            onChange={e => setEditGender(e.target.value)}
          >
            <option value="">Gender</option>
            <option value="Girl">Girl</option>
            <option value="Boy">Boy</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>

          <input
            className="form-control mb-3"
            style={{ borderRadius: "12px" }}
            type="date"
            value={editDob}
            onChange={e => setEditDob(e.target.value)}
          />

          <input
            className="form-control mb-3"
            style={{ borderRadius: "12px" }}
            placeholder="Preferred Sport"
            value={editSport}
            onChange={e => setEditSport(e.target.value)}
          />

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn"
              style={{
                background: "#b300ff",
                color: "white",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={handleSaveEdit}
            >
              Save Changes
            </button>

            <button
              className="btn"
              style={{
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
