import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

export default function DeviceSettings() {
  const devices = useAppStore(s => s.devices);
  const deviceId = useAppStore(s => s.deviceId);
  const effectiveRole = useAppStore(s => s.effectiveRole);
  const familyMembers = useAppStore(s => s.familyMembers);

  const loadDevicesFromFamilyGroup = useAppStore(s => s.loadDevicesFromFamilyGroup);
  const updateDeviceRecord = useAppStore(s => s.updateDeviceRecord);
  const removeDeviceRecord = useAppStore(s => s.removeDeviceRecord);

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
                {d.deviceName}
              </strong>

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
                    updateDeviceRecord(d.id, { approved: e.target.checked })
                  }
                  style={{
                    width: "22px",
                    height: "22px",
                    cursor: "pointer"
                  }}
                />
              </div>

              {/* Child Access */}
              <div style={{ textAlign: "left", width: "100%" }}>
                <label className="small" style={{ color: "#1f2a44" }}>
                  Child Access
                </label>

                <select
                  className="form-select form-select-sm"
                  style={{ borderRadius: "12px" }}
                  value={d.roleOverride || "editor"}
                  onChange={e =>
                    updateDeviceRecord(d.id, {
                      roleOverride: e.target.value || null
                    })
                  }
                >
                  <option value="editor">Editor (Default)</option>
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
