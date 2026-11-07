import { useState } from "react";
import { useAppStore } from "../../../store/useAppStore";
import { formatAddress } from "../../../utils/formatAddress";

export default function ClubForm({ sport, editingClub, close, initialName = "" }) {
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

  /* ⭐ Club fields */
  const [clubName, setClubName] = useState(editingClub?.name || initialName);
  const [email, setEmail] = useState(editingClub?.email || "");
  const [website, setWebsite] = useState(editingClub?.website || "");

  /* ⭐ Logo */
  const [logo, setLogo] = useState(editingClub?.logo || null);
  const [logoPreview, setLogoPreview] = useState(editingClub?.logo || null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result);       // base64 string
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ⭐ Address fields */
  const [line1, setLine1] = useState(editingClub?.address?.line1 || "");
  const [line2, setLine2] = useState(editingClub?.address?.line2 || "");
  const [extras, setExtras] = useState(editingClub?.address?.extras || []);
  const [town, setTown] = useState(editingClub?.address?.town || "");
  const [postcode, setPostcode] = useState(editingClub?.address?.postcode || "");

  /* ⭐ Autocomplete */
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const searchAddress = async (query) => {
    setSearch(query);

    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1`
    );

    const data = await res.json();
    setResults(data.slice(0, 5));
  };

  const applyAddress = (item) => {
    const a = item.address;

    setLine1(a.house_number || a.building || "");
    setLine2(a.road || "");
    setExtras([a.neighbourhood, a.suburb].filter(Boolean));
    setTown(a.city || a.town || a.village || "");
    setPostcode(a.postcode || "");

    setResults([]);
    setSearch(item.display_name);
  };

  /* ⭐ Extra lines */
  const addExtraLine = () => setExtras(prev => [...prev, ""]);
  const updateExtraLine = (i, v) => {
    const updated = [...extras];
    updated[i] = v;
    setExtras(updated);
  };
  const removeExtraLine = (i) => setExtras(prev => prev.filter((_, idx) => idx !== i));

  /* ⭐ Social media */
  const [socials, setSocials] = useState(editingClub?.socials || []);
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const addSocial = () => {
    if (!selectedPlatform) return;
    setSocials(prev => [...prev, { platform: selectedPlatform, handle: "" }]);
    setSelectedPlatform("");
  };

  const updateHandle = (i, v) => {
    const updated = [...socials];
    updated[i].handle = v;
    setSocials(updated);
  };

  const removeSocial = (i) => setSocials(prev => prev.filter((_, idx) => idx !== i));

  /* ⭐ Save */
  const save = () => {
    const payload = {
      name: clubName.trim(),
      logo: logo || null,
      sport: sport.name,
      address: {
        line1: line1.trim(),
        line2: line2.trim(),
        extras: extras.map(e => e.trim()).filter(Boolean),
        town: town.trim(),
        postcode: postcode.trim()
      },
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

      {/* ⭐ Club Name */}
      <input
        className="form-control mb-3"
        placeholder="Club Name"
        value={clubName}
        onChange={e => setClubName(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      {/* ⭐ Logo Upload */}
      <label className="form-label" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Club Logo
      </label>

      <input
        type="file"
        accept="image/*"
        className="form-control mb-3"
        onChange={handleLogoUpload}
        style={{ borderRadius: "12px" }}
      />

      {logoPreview && (
        <div className="mb-3">
          <img
            src={logoPreview}
            alt="Club Logo"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "1px solid #e6e6e6"
            }}
          />
        </div>
      )}

      {/* ⭐ Email */}
      <input
        className="form-control mb-3"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      {/* ⭐ Website */}
      <input
        className="form-control mb-3"
        placeholder="Website"
        value={website}
        onChange={e => setWebsite(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      {/* ⭐ Address Autocomplete */}
      <input
        className="form-control mb-2"
        placeholder="Search Address"
        value={search}
        onChange={(e) => searchAddress(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      {results.length > 0 && (
        <div
          className="p-2 mb-3"
          style={{
            borderRadius: "12px",
            border: "1px solid #e6e6e6",
            backgroundColor: "#fafafa"
          }}
        >
          {results.map((item, index) => (
            <div
              key={index}
              onClick={() => applyAddress(item)}
              style={{
                padding: "6px 8px",
                cursor: "pointer",
                borderRadius: "8px"
              }}
            >
              {item.display_name}
            </div>
          ))}
        </div>
      )}

      {/* ⭐ Address Fields */}
      <label className="form-label mt-3" style={{ color: "#1f2a44", fontWeight: 600 }}>
        Address
      </label>

      <input
        className="form-control mb-2"
        placeholder="Number / Building"
        value={line1}
        onChange={e => setLine1(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      <input
        className="form-control mb-2"
        placeholder="First Line"
        value={line2}
        onChange={e => setLine2(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      {extras.map((line, index) => (
        <div key={index} className="d-flex gap-2 mb-2">
          <input
            className="form-control"
            placeholder="Additional Line"
            value={line}
            onChange={e => updateExtraLine(index, e.target.value)}
            style={{ borderRadius: "12px" }}
          />
          <button
            className="btn btn-danger"
            style={{ borderRadius: "10px" }}
            onClick={() => removeExtraLine(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        className="btn btn-light mb-3"
        style={{
          borderRadius: "12px",
          border: "1px solid #dcdcdc",
          fontWeight: 600
        }}
        onClick={addExtraLine}
      >
        + Add Extra Line
      </button>

      <input
        className="form-control mb-2"
        placeholder="Town / City"
        value={town}
        onChange={e => setTown(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      <input
        className="form-control mb-3"
        placeholder="Postcode"
        value={postcode}
        onChange={e => setPostcode(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      {/* ⭐ Social Media */}
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

      {socials.map((s, index) => (
        <div key={index} className="d-flex align-items-center gap-2 mb-2">
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
