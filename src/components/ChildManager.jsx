import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import ChildAvatar from "./ChildAvatar";
import { nanoid } from "nanoid";

export default function ChildManager() {
  const {
    profile,
    children,
    activeChild,
    setActiveChild,
    addChild,
    updateChild,
    deleteChild,
    uploadChildAvatar
  } = useAppStore();

  const [editingChild, setEditingChild] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPreferredName, setEditPreferredName] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editSport, setEditSport] = useState("");

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

  const startEdit = (child) => {
    setEditingChild(child.id);
    setEditName(child.fullName);
    setEditPreferredName(child.preferredName || "");
    setEditDob(child.dob || "");
    setEditGender(child.gender || "");
    setEditSport(child.preferredSport || "");
  };

  const saveEdit = () => {
    updateChild(editingChild, {
      fullName: editName,
      preferredName: editPreferredName,
      dob: editDob,
      gender: editGender,
      age: calculateAge(editDob),
      preferredSport: editSport
    });

    setEditingChild(null);
  };

  const confirmDelete = (child) => {
    if (window.confirm(`Delete ${child.fullName}? This cannot be undone.`)) {
      deleteChild(child.id);

      // If deleting the active child, switch to another
      if (activeChild === child.id && children.length > 1) {
        const nextChild = children.find(c => c.id !== child.id);
        setActiveChild(nextChild.id);
      }
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h4 className="mb-3">Your Children</h4>

      {children.map(child => (
        <div
          key={child.id}
          className="d-flex align-items-center gap-3 mb-3"
          style={{
            padding: "10px",
            borderRadius: "10px",
            backgroundColor:
              activeChild === child.id ? "#ffe6ff" : "#f8f9fa",
            cursor: "pointer"
          }}
          onClick={() => setActiveChild(child.id)}
        >
          <ChildAvatar size={80} child={child} />

          <div style={{ flexGrow: 1 }}>
            <strong>{child.fullName}</strong>
            <div className="text-muted">
              ({child.preferredName || child.fullName})  
              <br />
              Gender: {child.gender || "Not set"}
              <br />
              Age {child.age} — {child.preferredSport || "No sport set"}
            </div>
          </div>

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={(e) => {
              e.stopPropagation();
              startEdit(child);
            }}
          >
            Edit
          </button>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete(child);
            }}
          >
            Delete
          </button>
        </div>
      ))}

      {/* EDIT FORM */}
      {editingChild && (
        <div className="mt-3 p-3 border rounded">
          <h5>Edit Child</h5>

          {/* Avatar Upload */}
          <input
            className="form-control mb-2"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                uploadChildAvatar(profile.uid, editingChild, file);
              }
            }}
          />

          <input
            className="form-control mb-2"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Full Name"
          />

          <input
            className="form-control mb-2"
            value={editPreferredName}
            onChange={(e) => setEditPreferredName(e.target.value)}
            placeholder="Preferred Name"
          />

          <input
            className="form-control mb-2"
            value={editGender}
            onChange={(e) => setEditGender(e.target.value)}
            placeholder="Gender (e.g. Girl, Boy)"
          />

          <input
            className="form-control mb-2"
            value={editDob}
            onChange={(e) => setEditDob(e.target.value)}
            type="date"
            placeholder="Date of Birth"
          />

          <input
            className="form-control mb-2"
            value={editSport}
            onChange={(e) => setEditSport(e.target.value)}
            placeholder="Preferred Sport"
          />

          <button className="btn btn-success me-2" onClick={saveEdit}>
            Save
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setEditingChild(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ADD CHILD BUTTON */}
      <button
        className="btn btn-primary mt-3 mb-3 d-block mx-auto"
        onClick={() =>
          addChild({
            id: nanoid(),
            fullName: "New Child",
            preferredName: "",
            gender: "",
            dob: "",
            age: 0,
            avatarUrl: null,
            preferredSport: ""
          })
        }
      >
        Add Child
      </button>
    </div>
  );
}
