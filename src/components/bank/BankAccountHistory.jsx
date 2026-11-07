import { useAppStore } from "../../store/useAppStore";
import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import TransactionViewer from "./TransactionViewer";

export default function BankAccountHistory() {
  const { accountId } = useParams();

  const account = useAppStore(state => state.bankAccounts?.[accountId]);
  const allTransactions = account?.transactions ?? [];

  const symbol =
    account?.currency === "GBP" ? "£" :
    account?.currency === "EUR" ? "€" :
    account?.currency === "USD" ? "$" :
    account?.currency === "JPY" ? "¥" :
    account?.currency;

  const accentColor = "#b300ff";

  const [selected, setSelected] = useState(null);

  /* ---------------------------------------------------------
     FILTER STATE
  --------------------------------------------------------- */
  const [filterType, setFilterType] = useState("month"); // month | year | custom
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  /* ---------------------------------------------------------
     FILTER LOGIC
  --------------------------------------------------------- */
  const filteredTransactions = useMemo(() => {
    const now = new Date();

    if (filterType === "month") {
      const month = now.getMonth();
      const year = now.getFullYear();
      return allTransactions.filter(tx => {
        const d = new Date(tx.addedAt);
        return d.getMonth() === month && d.getFullYear() === year;
      });
    }

    if (filterType === "year") {
      const year = now.getFullYear();
      return allTransactions.filter(tx => {
        const d = new Date(tx.addedAt);
        return d.getFullYear() === year;
      });
    }

    if (filterType === "custom" && customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      return allTransactions.filter(tx => {
        const d = new Date(tx.addedAt);
        return d >= start && d <= end;
      });
    }

    return allTransactions;
  }, [filterType, customStart, customEnd, allTransactions]);

  return (
    <div className="p-3" style={{ maxWidth: "1200px", margin: "0 auto" }}>

      {/* Breadcrumb */}
      <div
        className="mb-3"
        style={{ fontSize: "18px", fontWeight: 600, textAlign: "left" }}
      >
        <Link to="/bank" style={{ color: "#1f2a44", textDecoration: "none" }}>
          Bank Accounts
        </Link>
        <span style={{ color: "#1f2a44" }}> / </span>
        <span style={{ color: "#b300ff" }}>History {account?.name || ""}</span>
      </div>

      {/* Page Title */}
      <h2
        className="h3 mb-4 text-center"
        style={{ color: "#b300ff", fontWeight: 700, letterSpacing: "0.5px" }}
      >
        Transaction History
      </h2>

      {/* Account Header */}
      <div
        className="mb-4"
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e6e6e6",
          padding: "16px"
        }}
      >
        <div style={{ fontWeight: 700, color: "#1f2a44", fontSize: "20px" }}>
          {symbol}
        </div>

        <div style={{ fontWeight: 600, color: "#1f2a44" }}>
          {account?.name}
        </div>

        <div className="text-muted small">Type: {account?.type}</div>
        <div className="text-muted small">Currency: {account?.currency}</div>
      </div>

      {/* ---------------------------------------------------------
         FILTERS
      --------------------------------------------------------- */}
      <div className="mb-4">
        <h3
          className="h4 mb-2"
          style={{ color: "#1f2a44", fontWeight: 600 }}
        >
          Filter Transactions
        </h3>

        <div className="d-flex gap-2 mb-3">
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: filterType === "month" ? "#b300ff" : "white",
              color: filterType === "month" ? "white" : "#1f2a44",
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              padding: "6px 14px",
              fontWeight: 600
            }}
            onClick={() => setFilterType("month")}
          >
            This Month
          </button>

          <button
            className="btn btn-sm"
            style={{
              backgroundColor: filterType === "year" ? "#b300ff" : "white",
              color: filterType === "year" ? "white" : "#1f2a44",
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              padding: "6px 14px",
              fontWeight: 600
            }}
            onClick={() => setFilterType("year")}
          >
            This Year
          </button>

          <button
            className="btn btn-sm"
            style={{
              backgroundColor: filterType === "custom" ? "#b300ff" : "white",
              color: filterType === "custom" ? "white" : "#1f2a44",
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              padding: "6px 14px",
              fontWeight: 600
            }}
            onClick={() => setFilterType("custom")}
          >
            Custom
          </button>
        </div>

        {filterType === "custom" && (
          <div
            className="p-3"
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e6e6e6"
            }}
          >
            <div className="mb-2">
              <label className="small text-muted">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
                style={{ borderRadius: "12px" }}
              />
            </div>

            <div className="mb-2">
              <label className="small text-muted">End Date</label>
              <input
                type="date"
                className="form-control"
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
                style={{ borderRadius: "12px" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------
         TRANSACTIONS LIST
      --------------------------------------------------------- */}
      {filteredTransactions.length === 0 && (
        <div className="text-muted small">No transactions found.</div>
      )}

      {filteredTransactions.map(tx => (
        <div
          key={tx.id}
          className="d-flex justify-content-between align-items-center mb-3"
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1px solid #e6e6e6",
            padding: "16px",
            transition: "transform 0.15s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onClick={() => setSelected(tx)}
        >
          {/* LEFT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexGrow: 1 }}>
            
            {/* SYMBOL */}
            <span style={{ fontSize: "26px", color: accentColor }}>
              {symbol}
            </span>

            {/* ACCENT BAR */}
            <div
              style={{
                width: "4px",
                alignSelf: "stretch",
                backgroundColor: accentColor,
                borderRadius: "4px"
              }}
            />

            {/* TEXT BLOCK */}
            <div style={{ flexGrow: 1, textAlign: "left" }}>
              <strong
                style={{
                  color: tx.type === "credit" ? "#1f8b24" : "#b30000",
                  fontSize: "16px"
                }}
              >
                {tx.type === "credit" ? "Credit" : "Withdrawal"}
              </strong>

              <div className="text-muted small">{tx.reason}</div>

              <div className="text-muted small">
                {new Date(tx.addedAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{
              textAlign: "right",
              minWidth: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: tx.type === "credit" ? "#1f8b24" : "#b30000",
                fontSize: "20px"
              }}
            >
              {symbol}{tx.amount}
            </div>

            <div className="text-muted small">
              Balance: {symbol}{tx.balanceAfter}
            </div>
          </div>
        </div>
      ))}

      {/* Transaction Viewer */}
      {selected && (
        <TransactionViewer
          transaction={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
