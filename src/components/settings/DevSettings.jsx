import { useAppStore } from "../../store/useAppStore";

export default function DevSettings() {
  const resetAllDev = useAppStore(s => s.resetAllDev);

  console.log(process.env.NODE_ENV)

  if (process.env.NODE_ENV !== "development") {
    return null; // hide in production
  }

  return (
    <div className="container mt-4">
      <h3>Developer Tools</h3>

      <button
        className="btn btn-danger mt-3"
        style={{
          fontWeight: "600",
          borderRadius: "10px",
          padding: "10px 20px"
        }}
        onClick={() => {
          if (window.confirm("Reset ALL data? Local + KV will be wiped.")) {
            resetAllDev();
            window.location.reload();
          }
        }}
      >
        Reset All Data (Dev Only)
      </button>
    </div>
  );
}
