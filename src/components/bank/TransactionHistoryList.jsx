import useAppStore from "../../../store/useAppStore";

export default function TransactionHistoryList({ childId }) {
  const getTransactions = useAppStore(state => state.getTransactions);
  const transactions = getTransactions(childId);

  return (
    <div
      className="p-3 mb-4"
      style={{
        background: "white",
        borderRadius: "14px",
        border: "1px solid #e6e6e6"
      }}
    >
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        Transaction History
      </h3>

      {transactions.length === 0 && (
        <div className="text-muted small">No transactions yet</div>
      )}

      {transactions.map(tx => (
        <div
          key={tx.id}
          className="d-flex justify-content-between align-items-center mb-3 pb-2"
          style={{
            borderBottom: "1px solid #f0f0f0"
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 600,
                color: tx.type === "credit" ? "#1f8b24" : "#b30000"
              }}
            >
              {tx.type === "credit" ? "➕ Credit" : "➖ Withdrawal"}
            </div>

            <div className="small text-muted">
              {tx.reason || "No reason provided"}
            </div>

            <div className="small text-muted">
              {new Date(tx.addedAt).toLocaleString()}
            </div>
          </div>

          <div className="text-end">
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: tx.type === "credit" ? "#1f8b24" : "#b30000"
              }}
            >
              €{tx.amount.toFixed(2)}
            </div>

            <div className="small text-muted">
              Balance: €{tx.balanceAfter.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
