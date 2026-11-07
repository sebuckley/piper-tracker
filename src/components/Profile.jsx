import { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import Avatar from "./Avatar";
import { CURRENCIES, DEFAULT_CURRENCY } from "../utils/currency";

export default function Profile() {
  // Unified auth actions
  const user = useAppStore(s => s.user);
  const sendPasswordResetEmail = useAppStore(s => s.sendPasswordResetEmail);
  const updateUserEmail = useAppStore(s => s.updateUserEmail);

  // Unified user slice
  const userProfile = useAppStore(s => s.userProfile);
  const setUserProfile = useAppStore(s => s.setUserProfile);
  const uploadAvatar = useAppStore(s => s.uploadAvatar);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    if (!userProfile) return;

    setFirstName(userProfile.firstName || "");
    setLastName(userProfile.lastName || "");
    setRelationship(userProfile.relationship || "");
    setCurrency(userProfile.currency || DEFAULT_CURRENCY);
    setNewEmail(user?.email || "");
  }, [userProfile, user]);

  if (!userProfile) {
    return <div className="p-4">Loading profile...</div>;
  }

  const handleSaveProfile = async () => {
    await setUserProfile({
      firstName,
      lastName,
      relationship,
      currency
    });
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === user?.email) return;
    await updateUserEmail(newEmail);
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    await sendPasswordResetEmail(user.email);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      
      <h3 className="mb-4 text-center">Your Profile</h3>

      <div className="card p-5 shadow-sm mb-5">
        <div className="text-center mb-4">
          <Avatar size={200} />

          <input
            type="file"
            accept="image/*"
            className="form-control mt-3"
            style={{ maxWidth: "300px", margin: "0 auto" }}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                await uploadAvatar(userProfile.uid, file);
              }
            }}
          />
        </div>

        {/* First Name */}
        <div className="mb-4">
          <label className="form-label fw-semibold">First Name</label>
          <input
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Last Name</label>
          <input
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Currency */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Currency</label>
          <select
            className="form-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
          <div className="form-text">Used as the default for new bank accounts.</div>
        </div>

        <button className="btn btn-primary w-100" onClick={handleSaveProfile}>
          Save Profile
        </button>
      </div>

      {/* EMAIL SETTINGS */}
      <div className="card p-5 shadow-sm mb-5">
        <h5 className="mb-4">Email Settings</h5>

        <div className="mb-4">
          <label className="form-label fw-semibold">Email</label>
          <input
            className="form-control"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        <button className="btn btn-secondary w-100 mb-3" onClick={handleUpdateEmail}>
          Update Email
        </button>

        <button className="btn btn-warning w-100" onClick={handleResetPassword}>
          Reset Password
        </button>
      </div>

    </div>
  );
}
