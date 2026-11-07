import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import ChildManagerCard from "./ChildManagerCard";

export default function ChildManager() {
  const {
    children,
    activeChild,
    setActiveChild,
    addChild,
    updateChild,
    deleteChild,
    uploadChildAvatar
  } = useAppStore();

  const { familyGroup } = useAuthStore();

  const [editingChild, setEditingChild] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // ADD FORM STATE
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPreferredName, setNewPreferredName] = useState("");
  const [newDob, setNewDob] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newSport, setNewSport] = useState("");

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

const startEdit = (childId) => {
  const child = children.find(c => c.id === childId);
  if (!child) return;

  setEditingChild(childId);
  setEditFirstName(child.firstName || "");
  setEditLastName(child.lastName || "");
  setEditPreferredName(child.preferredName || "");
  setEditDob(child.dob || "");
  setEditGender(child.gender || "");
  setEditSport(child.preferredSport || "");
};



  const handleAddChild = () => {
    if (!newFirstName.trim()) return;

    addChild({
      firstName: newFirstName,
      lastName: newLastName,
      preferredName: newPreferredName,
      gender: newGender,
      dob: newDob,
      age: calculateAge(newDob),
      avatarUrl: null,
      preferredSport: newSport.trim(),
      relationships: {}
    });

    setShowAddForm(false);
    setNewFirstName("");
    setNewLastName("");
    setNewPreferredName("");
    setNewDob("");
    setNewGender("");
    setNewSport("");
  };

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
        <span style={{ color: "#1f2a44" }}>Children</span>
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
        Manage Children
      </h2>

      {/* ⭐ Section Header + Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3
          className="h4"
          style={{ color: "#1f2a44", fontWeight: 600 }}
        >
          Your Children
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
          onClick={() => setShowAddForm(true)}
        >
          + Add Child
        </button>
      </div>

      {/* ⭐ Add Child Form */}
      {showAddForm && (
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
            Add Child
          </h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                style={{ borderRadius: "12px" }}
                placeholder="First Name"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                className="form-control"
                style={{ borderRadius: "12px" }}
                placeholder="Surname"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </div>
          </div>

          <input
            className="form-control mb-3"
            style={{ borderRadius: "12px" }}
            placeholder="Preferred Name"
            value={newPreferredName}
            onChange={(e) => setNewPreferredName(e.target.value)}
          />

          <select
            className="form-select mb-3"
            style={{ borderRadius: "12px" }}
            value={newGender}
            onChange={(e) => setNewGender(e.target.value)}
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
            value={newDob}
            onChange={(e) => setNewDob(e.target.value)}
          />

          <input
            className="form-control mb-3"
            style={{ borderRadius: "12px" }}
            placeholder="Preferred Sport"
            value={newSport}
            onChange={(e) => setNewSport(e.target.value)}
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
              onClick={handleAddChild}
            >
              Save Child
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
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ⭐ Child Cards */}
      {children.map(child => (
        <ChildManagerCard
          key={child.id}
          child={child}
          startEdit={startEdit}
          editingChild={editingChild}
          deleteChild={deleteChild}
          updateChild={updateChild}
        />
      ))}
    </div>
  );
}
