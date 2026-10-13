import { useAppStore } from "../store/useAppStore";

export default function RewardLog() {
  const logs = useAppStore (s => s.rewardLogs);

  return (
    <div className="card shadow-sm mt-4" style={{ borderRadius: "16px" }}>
      <div className="p-4">
        <h2 className="h5 mb-4" style={{ color: "#1f2a44", fontWeight: "600" }}>
          Reward Log
        </h2>

        {logs.length === 0 && (
          <p className="text-muted">No rewards redeemed yet.</p>
        )}

        <ul className="list-group">
          {logs.map(log => (
            <li
              key={log.id}
              className="list-group-item"
              style={{ borderRadius: "10px", marginBottom: "10px" }}
            >
              <strong>{log.name}</strong>  
              <div className="text-muted small">
                Redeemed: {new Date(log.date).toLocaleString()}
              </div>
              <div className="text-muted small">
                Cost: {log.cost} ⭐
              </div>
              <div className="text-muted small">
                Remaining Stars: {log.remainingStars}
              </div>
              <div className="text-muted small">
                {log.repeatable ? "Repeatable" : "One-off"}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
