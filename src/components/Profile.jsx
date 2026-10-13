import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useAppStore } from "../store/useAppStore";
import Avatar from "./Avatar";
import ChildManager from "./ChildManager";

export default function Profile() {
  const { user } = useAuthStore();

  const {
    profile,
    setProfile,
    uploadAvatar,
    saveUserToKV
  } = useAppStore();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [preferredSport, setPreferredSport] = useState("");

  // Hydrate form fields when profile loads
  useEffect(() => {
    if (!profile) return;

    setFullName(profile.fullName || "");
    setCountry(profile.country || "");
    setPreferredSport(profile.preferredSport || "");
  }, [profile]);

  if (!profile) {
    return <div className="p-4">Loading profile...</div>;
  }

  const handleSave = async () => {
    setProfile({
      fullName,
      country,
      preferredSport
    });

    // Save to KV under user:<uid>
    await saveUserToKV(profile.uid);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <div className="card p-4 shadow-sm">
        <h3 className="mb-3">Your Profile</h3>

        {/* Avatar */}
        <div
          className="mb-4"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <Avatar size={200} />

          <input
            type="file"
            accept="image/*"
            className="form-control mt-3"
            style={{ maxWidth: "300px" }}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                await uploadAvatar(profile.uid, file);
                await saveUserToKV(profile.uid);
              }
            }}
          />
        </div>

        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Country */}
        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            className="form-control"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        {/* Preferred Sport */}
        <div className="mb-3">
          <label className="form-label">Preferred Sport</label>
          <input
            className="form-control"
            value={preferredSport}
            onChange={(e) => setPreferredSport(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          Save Profile
        </button>
      </div>

      {/* Children Manager */}
      <ChildManager />
    </div>
  );
}
