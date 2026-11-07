import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { currencySymbol } from "../utils/currency";
import RewardLog from "./RewardLog";
import RewardCard from "./rewards/RewardCard";  

export default function Rewards() {
  const rewards = useAppStore(s => s.rewards);
  const bankAccounts = useAppStore(s => s.bankAccounts);
  const profileCurrency = useAppStore(s => s.userProfile?.currency);
  const starBalance = useAppStore(s => s.starBalance);
  const redeemReward = useAppStore(s => s.redeemReward);
  const requestReward = useAppStore(s => s.requestReward);
  const rewardRequests = useAppStore(s => s.rewardRequests);
  const rewardRequestError = useAppStore(s => s.rewardRequestError);

  const isViewer = useAppStore(s => s.isViewer());
  const isEditor = useAppStore(s => s.isEditor());
  const isOwner = useAppStore(s => s.isOwner());

  // Pocket money can only be paid into current accounts
  const currentAccounts = Object.values(bankAccounts ?? {}).filter(a => a.type === "current");

  const [pickRewardId, setPickRewardId] = useState(null);
  const [pickAccountId, setPickAccountId] = useState("");
  const [pickAmount, setPickAmount] = useState(1);
  const [pickMode, setPickMode] = useState("redeem");
  const [pickError, setPickError] = useState("");

  const AMOUNT_OPTIONS = [1, 5, 10, 15, 20];

  const openPicker = (reward, mode, amount) => {
    setPickError("");
    setPickMode(mode);
    setPickAmount(amount ?? AMOUNT_OPTIONS[0]);
    setPickAccountId(currentAccounts[0]?.id ?? "");
    setPickRewardId(reward.id);
  };

  const redeemOrPick = (reward, amount) => {
    if (reward?.type !== "pocketMoney") {
      redeemReward(reward.id);
      return;
    }
    openPicker(reward, "redeem", amount);
  };

  const requestOrPick = (reward) => {
    if (reward?.type !== "pocketMoney") {
      requestReward(reward.id);
      return;
    }
    openPicker(reward, "request");
  };

  const starsFor = (reward, amount) =>
    Math.ceil((amount * Number(reward.cost)) / (Number(reward.amount) || 1));

  const confirmPocketMoney = async () => {
    if (pickMode === "request") {
      if (await requestReward(pickRewardId, { amount: pickAmount })) setPickRewardId(null);
      return;
    }
    const res = redeemReward(pickRewardId, { accountId: pickAccountId, amount: pickAmount });
    if (res?.ok) setPickRewardId(null);
    else setPickError(res?.error || "Couldn't redeem this reward");
  };

  const pickReward = rewards.find(r => r.id === pickRewardId);

  // Accent colour based on cost
  const getAccentColor = (cost) => {
    if (cost <= 5) return "#28a745";     // green (low)
    if (cost <= 20) return "#b300ff";    // purple (medium)
    if (cost <= 40) return "#f5b800";    // gold (high)
    return "#cc0033";                    // red (very high)
  };

  // Sort rewards low → high cost; hide pocket money until a current account exists
  const sortedRewards = [...rewards]
    .filter(r => r.type !== "pocketMoney" || currentAccounts.length > 0)
    .sort((a, b) => a.cost - b.cost);

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>

      {/* Page Title */}
      <h2
        className="h3 mt-3 mb-4"
        style={{
          color: "#b300ff",
          fontWeight: 700,
          letterSpacing: "0.5px",
          textAlign: "center"
        }}
      >
        Rewards
      </h2>
      {rewardRequestError && <div className="alert alert-danger" role="alert">{rewardRequestError}</div>}

      {/* ⭐ Star Balance — matches Dashboard */}
 <div className="d-flex justify-content-center mb-4">
      <div
        className="p-3 text-center"
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          minWidth: "220px",
          padding: "16px"
        }}
      >
        <h3 className="h6 mb-2" style={{ color: "#1f2a44", fontWeight: 700 }}>
          Current Stars
        </h3>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "#b300ff" }}>
          {starBalance} ⭐
        </div>
      </div>
    </div>

      {/* Pending Requests (Owner Only) */}
      {isOwner && rewardRequests.length > 0 && (
        <div className="mb-4">
          <h3
            className="h4 mb-3"
            style={{ color: "#1f2a44", fontWeight: 600, textAlign: "left" }}
          >
            Pending Reward Requests
          </h3>

          {rewardRequests.map(req => (
            <RewardCard
              key={req.id}
              item={req}
              type="request"
              onApprove={() => redeemOrPick(rewards.find(r => r.id === req.id) ?? req, req.amount)}
              onDeny={() => useAppStore.getState().denyRewardRequest(req.id)}
            />
          ))}
        </div>
      )}

      {/* Rewards List */}
      <div className="mb-4" style={{ textAlign: "left" }}>
        <h3
          className="h4 mb-3"
          style={{ color: "#1f2a44", fontWeight: 600 }}
        >
          Rewards
        </h3>

        {sortedRewards.map(r => {
          const accentColor = getAccentColor(r.cost);

          return (
            <RewardCard
              key={r.id}
              item={r}
              onRedeem={() => redeemOrPick(r)}
              onRequest={() => requestOrPick(r)}
            />
          );
        })}
      </div>

      {/* Pocket money account picker */}
      {pickReward && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
          }}
        >
          <div
            style={{
              background: "white", borderRadius: "16px", border: "1px solid #e6e6e6",
              padding: "24px", width: "90%", maxWidth: "420px", textAlign: "left"
            }}
          >
            <h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>
              {pickMode === "request" ? "Request Pocket Money" : "Redeem Pocket Money"}
            </h3>

            <label className="form-label fw-bold">Amount</label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {AMOUNT_OPTIONS.map(a => {
                const stars = starsFor(pickReward, a);
                const affordable = stars <= Number(starBalance);
                const selected = pickAmount === a;
                return (
                  <button
                    key={a}
                    type="button"
                    disabled={!affordable && pickMode === "redeem"}
                    className="btn"
                    style={{
                      borderRadius: "10px", fontWeight: 600,
                      background: selected ? "#b300ff" : "white",
                      color: selected ? "white" : "#1f2a44",
                      border: "1px solid #dcdcdc"
                    }}
                    onClick={() => setPickAmount(a)}
                  >
                    {currencySymbol(profileCurrency)}{a}
                    <div className="small">{stars} ⭐</div>
                  </button>
                );
              })}
            </div>
            <p style={{ color: "#1f2a44" }}>
              {starsFor(pickReward, pickAmount)} ⭐ will be exchanged for{" "}
              <strong>{Number(pickAmount).toFixed(2)}</strong>
              {pickMode === "redeem" ? " in the account below." : "."}
            </p>

            {pickMode === "redeem" && (<>
            <label className="form-label fw-bold">Pay into</label>
            <select
              className="form-select mb-2"
              value={pickAccountId}
              onChange={e => setPickAccountId(e.target.value)}
              style={{ borderRadius: "12px" }}
            >
              {currentAccounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({currencySymbol(a.currency)})
                </option>
              ))}
            </select>
            </>)}

            {pickError && <div className="text-danger small mb-2">{pickError}</div>}

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn"
                style={{ backgroundColor: "#b300ff", color: "white", fontWeight: 600, borderRadius: "10px" }}
                onClick={confirmPocketMoney}
              >
                Confirm
              </button>
              <button
                className="btn"
                style={{ backgroundColor: "white", border: "1px solid #dcdcdc", fontWeight: 600, borderRadius: "10px" }}
                onClick={() => setPickRewardId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reward Log */}
      <RewardLog />
    </div>
  );
}
