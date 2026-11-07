import { useAppStore } from "../store/useAppStore";
import RewardCard from "./rewards/RewardCard";

export default function RewardLog() {
  const logs = useAppStore(s => s.rewardLogs);

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>
      
      {/* Section Header */}
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600, textAlign: "left" }}
      >
        Reward Log
      </h3>

      {/* Empty State */}
      {logs.length === 0 && (
        <p className="text-muted" style={{ marginLeft: "4px" }}>
          No rewards redeemed yet.
        </p>
      )}

      {/* Log List */}
      <div>
        {logs.map(log => (
          <RewardCard
            key={log.id}
            item={log}
            type="log"
            onRedeem={() => {}}
            onRequest={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
