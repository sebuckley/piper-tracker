import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

export default function DeviceSettings() {
  const devices = useAppStore(s => s.devices);
  const deviceId = useAppStore(s => s.deviceId);
  const effectiveRole = useAppStore(s => s.effectiveRole);
  const familyMembers = useAppStore(s => s.familyMembers);
  const [editingId, setEditingId] = useState(null);
  const [deviceName, setDeviceName] = useState("");
  const [error, setError] = useState("");

  const loadDevicesFromFamilyGroup = useAppStore(s => s.loadDevicesFromFamilyGroup);
  const updateDeviceRecord = useAppStore(s => s.updateDeviceRecord);
  const removeDeviceRecord = useAppStore(s => s.removeDeviceRecord);
  const updateDevice = async (id, changes) => {
    setError("");
    try {
      await updateDeviceRecord(id, changes);
    } catch (err) {
      console.error("Could not update device:", err.code || err.name);
      setError("Could not update the device. Please try again.");
    }
  };

  useEffect(() => {
    if (familyMembers && familyMembers.length > 0) {
      loadDevicesFromFamilyGroup();
    }
  }, [familyMembers]);

  if (effectiveRole !== "owner") {
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
          <span style={{ color: "#1f2a44" }}>Device Settings</span>
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
          Device Settings
        </h2>

        <div className="text-muted text-center">
          You must be an owner to manage devices.
        </div>
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
        <span style={{ color: "#1f2a44" }}>Device Settings</span>
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
        Device Settings
      </h2>

      {/* ⭐ Section Header */}
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600, textAlign: "left" }}
      >
        Registered Devices
      </h3>

      {devices.length === 0 && (
        <div className="text-muted">No devices found.</div>
      )}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {devices.map(d => (
        <div
          key={d.id}
          className="mb-4 d-flex"
          style={{
            background: "white",
            border: "1px solid #e6e6e6",
            borderRadius: "16px",
            padding: "20px"
          }}
        >
          {/* ⭐ Accent Bar */}
          <div
            style={{
              width: "6px",
              alignSelf: "stretch",
              background: "#b300ff",
              borderRadius: "6px",
              marginRight: "16px"
            }}
          />

          {/* ⭐ Content */}
          <div className="d-flex justify-content-between w-100">

            {/* Device Info */}
            <div style={{ textAlign: "left" }}>
              <strong style={{ color: "#1f2a44", fontWeight: 600 }}>
                {d.deviceName || "Unnamed device"}
              </strong>
              {editingId === d.id ? (
                <form onSubmit={async e => {
                  e.preventDefault();
                  const name = deviceName.trim();
                  if (!name) { setError("Enter a device name."); return; }
                  try {
                    await updateDeviceRecord(d.id, { deviceName: name });
                    setEditingId(null);
                    setError("");
                  } catch (err) {
                    console.error("Could not rename device:", err.code || err.name);
                    setError("Could not rename the device. Please try again.");
                  }
                }}>
                  <label htmlFor={`device-name-${d.id}`} className="small">Device name</label>
                  <input id={`device-name-${d.id}`} className="form-control form-control-sm" value={deviceName} maxLength={100} onChange={e => setDeviceName(e.target.value)} />
                  <button type="submit" className="btn btn-sm btn-primary mt-1">Save name</button>{" "}
                  <button type="button" className="btn btn-sm btn-light mt-1" onClick={() => setEditingId(null)}>Cancel</button>
                </form>
              ) : (
                <button type="button" className="btn btn-sm btn-light ms-2" onClick={() => { setDeviceName(d.deviceName || ""); setEditingId(d.id); }}>Rename</button>
              )}

              <div className="small text-muted">
                {d.platform} • {d.email}
              </div>

              <div className="small text-muted">
                Last seen: {new Date(d.lastSeen).toLocaleString()}
              </div>

              {d.id === deviceId && (
                <div
                  style={{
                    marginTop: "8px",
                    background: "#b300ff",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "inline-block"
                  }}
                >
                  This Device
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className="d-flex flex-column align-items-end gap-3"
              style={{ minWidth: "200px" }}
            >

              {/* Approved */}
              <div style={{ textAlign: "left", width: "100%" }}>
                <label className="small" style={{ color: "#1f2a44" }}>
                  Approved
                </label>

                <input
                  type="checkbox"
                  checked={d.approved}
                  onChange={e =>
                    updateDevice(d.id, { approved: e.target.checked })
                  }
                  style={{
                    width: "22px",
                    height: "22px",
                    cursor: "pointer"
                  }}
                />
              </div>

              <div style={{ textAlign: "left", width: "100%" }}>
                <label className="small d-flex gap-2 align-items-center">
                  <input type="checkbox" checked={d.isChildDevice === true}
                    onChange={e => updateDevice(d.id, { isChildDevice: e.target.checked })} />
                  Child device
                </label>
                <div className="text-muted small">Child devices can view data and request rewards.</div>
              </div>

              {/* Device access */}
              <div style={{ textAlign: "left", width: "100%" }}>
                <label className="small" style={{ color: "#1f2a44" }}>
                  Device access
                </label>

                <select
                  className="form-select form-select-sm"
                  style={{ borderRadius: "12px" }}
                  value={d.roleOverride || ""}
                  onChange={e =>
                    updateDevice(d.id, {
                      roleOverride: e.target.value || null
                    })
                  }
                >
                  <option value="">Use account role</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer Only</option>
                </select>
              </div>

              {/* Remove */}
              <button
                className="btn"
                style={{
                  background: "red",
                  color: "white",
                  borderRadius: "10px",
                  padding: "6px 14px",
                  fontWeight: 600
                }}
                onClick={() => removeDeviceRecord(d.id)}
              >
                Remove Device
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
