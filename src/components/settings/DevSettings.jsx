import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { API_BASE } from "../../config/api";

const FREE_LIMIT_BYTES = 1024 * 1024 * 1024; // Workers KV free tier: 1 GB stored

const toMb = bytes => (bytes / (1024 * 1024)).toFixed(3);

export default function DevSettings() {

  const [storage, setStorage] = useState(null);
  const [storageLoading, setStorageLoading] = useState(false);
  const [storageError, setStorageError] = useState("");

  const loadStorage = async () => {
    setStorageLoading(true);
    setStorageError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/storage`);
      if (!res.ok) throw new Error("Request failed");
      setStorage(await res.json());
    } catch {
      setStorageError("Couldn't load storage usage. Is the worker deployed with /api/admin/storage?");
    } finally {
      setStorageLoading(false);
    }
  };

  const totalBytes = (storage || []).reduce((sum, n) => sum + n.bytes, 0);

  const resetAllDev = useAppStore(s => s.resetAllDev);
  const resetStarsOnly = useAppStore(s => s.resetStarsOnly);
  const resetBehaviourOnly = useAppStore(s => s.resetBehaviourOnly);
  const resetAchievementsOnly = useAppStore(s => s.resetAchievementsOnly);
  const resetRoutinesOnly = useAppStore(s => s.resetRoutinesOnly);
  const resetRewardsOnly = useAppStore(s => s.resetRewardsOnly);
  const resetExceptChildren = useAppStore(s => s.resetExceptChildren);

  if (!import.meta.env.DEV) {
    return null;
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
        <span style={{ color: "#1f2a44", margin: "0 8px" }}>›</span>
        <Link
          to="/settings/admin"
          style={{
            color: "#b300ff",
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          Admin
        </Link>
        <span style={{ color: "#1f2a44", margin: "0 8px" }}>›</span>
        <span style={{ color: "#1f2a44" }}>Developer Tools</span>
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
        Developer Tools
      </h2>

      {/* ⭐ KV Storage Usage */}
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600, textAlign: "left" }}
      >
        KV Storage Usage
      </h3>

      <div
        className="mb-4"
        style={{
          background: "white",
          border: "1px solid #e6e6e6",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "left"
        }}
      >
        <p className="small mb-3" style={{ color: "#1f2a44" }}>
          Size of the data stored in each KV namespace. KV has no size API, so this reads every
          value and can take a few seconds.
        </p>

        <button
          className="btn mb-3"
          disabled={storageLoading}
          style={{
            background: "#b300ff",
            color: "white",
            borderRadius: "10px",
            padding: "6px 14px",
            fontWeight: 600
          }}
          onClick={loadStorage}
        >
          {storageLoading ? "Measuring…" : storage ? "Refresh" : "Check storage"}
        </button>

        {storageError && <div className="text-danger small mb-2">{storageError}</div>}

        {storage && (
          <>
            <table className="table table-sm mb-2">
              <thead>
                <tr>
                  <th>Namespace</th>
                  <th className="text-end">Keys</th>
                  <th className="text-end">Size (MB)</th>
                  <th>Largest key</th>
                </tr>
              </thead>
              <tbody>
                {storage.map(n => (
                  <tr key={n.namespace}>
                    <td>{n.namespace}</td>
                    <td className="text-end">{n.keys}</td>
                    <td className="text-end">{toMb(n.bytes)}</td>
                    <td className="small">
                      {n.largest.key ? `${n.largest.key} (${toMb(n.largest.bytes)} MB)` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: 700 }}>
                  <td>Total</td>
                  <td className="text-end">{storage.reduce((s, n) => s + n.keys, 0)}</td>
                  <td className="text-end">{toMb(totalBytes)}</td>
                  <td className="small">
                    {((totalBytes / FREE_LIMIT_BYTES) * 100).toFixed(3)}% of the 1 GB free tier
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="text-muted small">
              Size is the stored value in bytes (UTF-8); keys and metadata aren't counted.
            </div>
          </>
        )}
      </div>

      {/* ⭐ Section Header */}
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600, textAlign: "left" }}
      >
        Development Reset Options
      </h3>

      {/* ⭐ Developer Tools Card */}
      <div
        className="d-flex mb-4"
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
        <div style={{ width: "100%", textAlign: "left" }}>
          <p className="small mb-4" style={{ color: "#1f2a44" }}>
            These tools are only available in development mode.  
            They allow you to quickly reset specific parts of the app state.
          </p>

          {/* ⭐ Buttons Grid */}
          <div className="row">

            {/* Reset ALL */}
            <div className="col-md-6 mb-3">
              <button
                className="btn w-100"
                style={{
                  background: "red",
                  color: "white",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontWeight: 600
                }}
                onClick={() => {
                  if (window.confirm("Reset ALL data? Local + KV will be wiped.")) {
                    resetAllDev();
                  }
                }}
              >
                Reset ALL Data (Local + KV)
              </button>
            </div>

            {/* Reset Stars */}
            <div className="col-md-6 mb-3">
              <button
                className="btn w-100"
                style={{
                  background: "#b300ff",
                  color: "white",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontWeight: 600
                }}
                onClick={() => {
                  if (window.confirm("Reset all stars?")) {
                    resetStarsOnly();
                  }
                }}
              >
                Reset Stars Only
              </button>
            </div>

            {/* Reset Behaviour */}
            <div className="col-md-6 mb-3">
              <button
                className="btn w-100"
                style={{
                  background: "#b300ff",
                  color: "white",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontWeight: 600
                }}
                onClick={() => {
                  if (window.confirm("Reset all behaviour logs?")) {
                    resetBehaviourOnly();
                  }
                }}
              >
                Reset Behaviour Only
              </button>
            </div>

            {/* Reset Achievements */}
            <div className="col-md-6 mb-3">
              <button
                className="btn w-100"
                style={{
                  background: "#b300ff",
                  color: "white",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontWeight: 600
                }}
                onClick={() => {
                  if (window.confirm("Reset all achievements?")) {
                    resetAchievementsOnly();
                  }
                }}
              >
                Reset Achievements Only
              </button>
            </div>

            {/* Reset Routines */}
            <div className="col-md-6 mb-3">
              <button
                className="btn w-100"
                style={{
                  background: "#b300ff",
                  color: "white",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontWeight: 600
                }}
                onClick={() => {
                  if (window.confirm("Reset all routines?")) {
                    resetRoutinesOnly();
                  }
                }}
              >
                Reset Routines Only
              </button>
            </div>

            {/* Reset Rewards */}
            <div className="col-md-6 mb-3">
              <button
                className="btn w-100"
                style={{
                  background: "#b300ff",
                  color: "white",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontWeight: 600
                }}
                onClick={() => {
                  if (window.confirm("Reset all rewards?")) {
                    resetRewardsOnly();
                  }
                }}
              >
                Reset Rewards Only
              </button>
            </div>

            {/* Reset Everything Except Children */}
            <div className="col-md-12 mt-2">
              <button
                className="btn w-100"
                style={{
                  background: "#1f2a44",
                  color: "white",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontWeight: 600
                }}
                onClick={() => {
                  if (window.confirm("Reset everything except children?")) {
                    resetExceptChildren();
                  }
                }}
              >
                Reset Everything Except Children
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
