import { useState } from "react";
import { useAppStore } from "../../../store/useAppStore";

export default function ClubForm({ sport, editingClub, close }) {
  const { addClub, updateClub } = useAppStore();

  const SOCIAL_OPTIONS = [
    "Facebook",
    "Instagram",
    "Twitter / X",
    "TikTok",
    "YouTube",
    "Snapchat",
    "LinkedIn"
  ];

  const [name, setName] = useState(editingClub?.name || "");
  const [address, setAddress] = useState(editingClub?.address || "");
  const [email, setEmail] = useState(editingClub?.email || "");
  const [website, setWebsite] = useState(editingClub?.website || "");

  // Social media list: [{ platform: "Instagram", handle: "@club" }]
  const [socials, setSocials] = useState(editingClub?.socials || []);
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const addSocial = () => {
    if (!selectedPlatform) return;

    setSocials(prev => [
      ...prev,
      { platform: selectedPlatform, handle: "" }
    ]);

    setSelectedPlatform("");
  };

  const updateHandle = (index, value) => {
    setSocials(prev => {
      const updated = [...prev];
      updated[index].handle = value;
      return updated;
    });
  };

  const removeSocial = index => {
    setSocials(prev => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    const payload = {
      name: name.trim(),
      address: address.trim(),
      email: email.trim(),
      website: website.trim(),
      socials
    };

    if (editingClub) {
      updateClub(sport.id, editingClub.id, payload);
    } else {
      addClub(sport.id, payload);
    }

    close();
  };

  return (
    <div
      className="p-3 mb-4"
      style={{
        borderRadius: "16px",
        border: "1px solid #e6e6e6",
        backgroundColor: "#ffffff"
      }}
    >
      <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
        {editingClub ? "Edit Club" : "New Club"}
      </label>

      <input
        className="form-control mb-3"
        placeholder="Club Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      <input
        className="form-control mb-3"
        placeholder="Address"
        value={address}
        onChange={e => setAddress(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      <input
        className="form-control mb-3"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      <input
        className="form-control mb-3"
        placeholder="Website"
        value={website}
        onChange={e => setWebsite(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      {/* Social Media Selector */}
      <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Social Media
      </label>

      <div className="d-flex gap-2 mb-3">
        <select
          className="form-control"
          value={selectedPlatform}
          onChange={e => setSelectedPlatform(e.target.value)}
          style={{ borderRadius: "12px" }}
        >
          <option value="">Select Platform</option>
          {SOCIAL_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <button
          className="btn"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            fontWeight: 600,
            borderRadius: "12px",
            whiteSpace: "nowrap"
          }}
          onClick={addSocial}
        >
          + Add
        </button>
      </div>

      {/* Social Media Inputs */}
      {socials.map((s, index) => (
        <div
          key={index}
          className="d-flex align-items-center gap-2 mb-2"
        >
          <div
            className="flex-grow-1 p-2"
            style={{
              borderRadius: "12px",
              border: "1px solid #e6e6e6",
              backgroundColor: "#fafafa"
            }}
          >
            <strong style={{ color: "#b300ff" }}>{s.platform}</strong>

            <input
              className="form-control mt-2"
              placeholder="Handle / Username"
              value={s.handle}
              onChange={e => updateHandle(index, e.target.value)}
              style={{ borderRadius: "10px" }}
            />
          </div>

          <button
            className="btn btn-danger"
            style={{ borderRadius: "10px" }}
            onClick={() => removeSocial(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="d-flex gap-2 mt-3">
        <button
          className="btn"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            fontWeight: 600,
            borderRadius: "12px"
          }}
          onClick={save}
        >
          Save
        </button>

        <button
          className="btn btn-light"
          style={{
            borderRadius: "12px",
            border: "1px solid #dcdcdc",
            fontWeight: 600
          }}
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
