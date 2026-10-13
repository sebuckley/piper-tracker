import { useAppStore } from "../store/useAppStore";
import RewardLog from "./RewardLog";

export default function Rewards() {
  const rewards = useAppStore(s => s.rewards);
  const starBalance = useAppStore(s => s.starBalance);
  const redeemReward = useAppStore(s => s.redeemReward);

  return (
    <div className="container mt-4">
      <div
        className="card shadow-sm"
        style={{
          borderRadius: "16px",
          border: "1px solid #e6e6e6"
        }}
      >
        <div className="p-4">

          {/* Star Balance */}
          <div className="mb-4">
            <h2
              className="h5"
              style={{ color: "#1f2a44", fontWeight: "600" }}
            >
              Star Balance
            </h2>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#b300ff"
              }}
            >
              ⭐ {starBalance}
            </div>
          </div>

          {/* Rewards List */}
          <h3
            className="h6 mb-3"
            style={{ color: "#1f2a44", fontWeight: "600" }}
          >
            Rewards
          </h3>

          <ul className="list-group">
            {rewards.map(r => (
              <li
                id={`reward-${r.id}`}
                className="list-group-item d-flex justify-content-between align-items-center star-explosion"
                style={{ borderRadius: "10px", marginBottom: "14px" }}
              >
                <div>
                  <strong style={{ color: "#1f2a44" }}>{r.name}</strong>
                  <div className="text-muted small">{r.category}</div>
                  <div className="text-muted small">Cost: {r.cost} ⭐</div>
                </div>

                {!r.redeemed ? (
                  <button
                    className="btn btn-sm"
                    disabled={starBalance < r.cost}
                    style={{
                      backgroundColor:
                        starBalance >= r.cost ? "#b300ff" : "#dcdcdc",
                      color: starBalance >= r.cost ? "white" : "#888",
                      fontWeight: "600",
                      borderRadius: "10px",
                      padding: "6px 12px"
                    }}
                    onClick={() => {
                      redeemReward(r.id);
                      document.getElementById(`reward-${r.id}`).classList.add("redeem-animate");
                    }}

                  >
                    Redeem
                  </button>
                ) : (
                  <span
                    style={{
                      color: "#b300ff",
                      fontWeight: "600"
                    }}
                  >
                    Redeemed 🎉
                  </span>
                )}
              </li>
            ))}
          </ul>

        </div>
      </div>
      <RewardLog />
    </div>
  );
}
