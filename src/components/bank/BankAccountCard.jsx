import { useRef, useState } from "react";
import { parseStatementCsv } from "../../utils/bankCsv";
import { useAppStore } from "../../store/useAppStore";
import { Link } from "react-router-dom";
import TransferForm from "./TransferForm";

export default function BankAccountCard({ accountId }) {
  const getAccount = useAppStore(state => state.getAccount);
  const getBalance = useAppStore(state => state.getBalance);
  const getTransactions = useAppStore(state => state.getTransactions);

  

  const addCredit = useAppStore(state => state.addCredit);
  const addWithdrawal = useAppStore(state => state.addWithdrawal);
  const importTransactions = useAppStore(state => state.importTransactions);
  const accounts = useAppStore(state => state.bankAccounts ?? {});
  const isViewer = useAppStore(state => state.isViewer());

  const account = getAccount(accountId);

  console.log(account);

  if (!account) {
    return (
      <div className="p-3 mb-4" style={{ background: "white", borderRadius: "14px", border: "1px solid #e6e6e6" }}>
        <div className="text-muted small">Account not found</div>
      </div>
    );
  }

  const balance = getBalance(accountId);
  const transactions = getTransactions(accountId);

  const currency = account.currency;
  const symbol =
    currency === "GBP" ? "£" :
    currency === "EUR" ? "€" :
    currency === "USD" ? "$" :
    currency === "JPY" ? "¥" :
    currency;

  const [showCredit, setShowCredit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const fileRef = useRef(null);

  const handleImport = async e => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const { rows, errors } = parseStatementCsv(await file.text());
    if (rows.length === 0) {
      setImportMsg(errors[0] || "No transactions found in the file.");
      return;
    }

    const { added, skipped } = importTransactions(accountId, rows);
    setImportMsg(
      `Imported ${added} new transaction(s), ignored ${skipped} already on this account` +
      (errors.length ? `, ${errors.length} invalid row(s) skipped.` : ".")
    );
  };

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const resetForm = () => {
    setAmount("");
    setReason("");
  };

  const handleCredit = () => {
    if (!amount) return;
    addCredit(accountId, Number(amount), reason || "Pocket Money");
    resetForm();
    setShowCredit(false);
  };

  const handleWithdraw = () => {
    if (!amount) return;
    addWithdrawal(accountId, Number(amount), reason || "Withdrawal");
    resetForm();
    setShowWithdraw(false);
  };

  return (
    <div
      className="p-3 mb-4"
      style={{
        background: "white",
        borderRadius: "14px",
        border: "1px solid #e6e6e6"
      }}
    >
      <h3 className="h4 mb-2" style={{ color: "#1f2a44", fontWeight: 600 }}>
        {account.name} <span className="text-muted small">({account.type})</span>
      </h3>

      {/* Balance */}
      <div className="mb-3">
        <div className="small text-muted">Current Balance</div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: balance >= 0 ? "#1f2a44" : "#b30000"
          }}
        >
          {symbol}{balance.toFixed(2)}
        </div>
      </div>

      {/* Recent Activity (limit 5) */}
      <div className="mb-3">
        <div className="small text-muted mb-1">Recent Activity</div>

        {transactions.length === 0 && (
          <div className="text-muted small">No transactions yet</div>
        )}

        {transactions.slice(-5).reverse().map(tx => (
          <div
            key={tx.id}
            className="d-flex justify-content-between small mb-1"
          >
            <span>
              {tx.type === "credit" ? "➕" : "➖"} {symbol}{tx.amount} — {tx.reason}
            </span>
            <span className="text-muted">
              {new Date(tx.addedAt).toLocaleDateString()}
            </span>
          </div>
        ))}

    
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-2 mb-2">
        {!isViewer && <><button
          className="btn btn-sm"
          style={{
            backgroundColor: "#b300ff",
            color: "white",
            borderRadius: "10px"
          }}
          onClick={() => {
            resetForm();
            setShowWithdraw(false);
            setShowCredit(true);
          }}
        >
          + Add Credit
        </button>

        <button
          className="btn btn-sm btn-light"
          style={{
            borderRadius: "10px",
            border: "1px solid #dcdcdc"
          }}
          onClick={() => {
            resetForm();
            setShowCredit(false);
            setShowWithdraw(true);
          }}
        >
          Withdraw
        </button>

        <button
          className="btn btn-sm btn-light"
          style={{ borderRadius: "10px", border: "1px solid #dcdcdc" }}
          onClick={() => fileRef.current?.click()}
        >
          Import CSV
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          style={{ display: "none" }}
          onChange={handleImport}
        />

        {Object.keys(accounts).length > 1 && (
          <button
            className="btn btn-sm btn-light"
            style={{ borderRadius: "10px", border: "1px solid #dcdcdc" }}
            onClick={() => {
              resetForm();
              setShowCredit(false);
              setShowWithdraw(false);
              setShowTransfer(true);
            }}
          >
            Transfer
          </button>
        )}</>}
            {/* Full History Button */}
        {transactions.length > 0 && (
         
            <Link
              to={`/bank/history/${accountId}`}
              className="btn btn-light btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc"
              }}
            >
              View Full History
            </Link>
       
        )}
      </div>

      {importMsg && (
        <div className="small mb-2" style={{ color: "#1f2a44" }}>{importMsg}</div>
      )}

      {!isViewer && showTransfer && (
        <TransferForm fromId={accountId} close={() => setShowTransfer(false)} />
      )}

      {/* Hidden Credit Form */}
      {!isViewer && showCredit && (
        <div className="mt-3">
          <div className="small mb-1">Add Credit</div>

          <input
            type="number"
            className="form-control mb-2"
            placeholder={`Amount (${symbol})`}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Reason (optional)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                borderRadius: "10px"
              }}
              onClick={handleCredit}
            >
              Save
            </button>

            <button
              className="btn btn-light btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc"
              }}
              onClick={() => setShowCredit(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hidden Withdrawal Form */}
      {!isViewer && showWithdraw && (
        <div className="mt-3">
          <div className="small mb-1">Withdraw Money</div>

          <input
            type="number"
            className="form-control mb-2"
            placeholder={`Amount (${symbol})`}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Reason (optional)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                borderRadius: "10px"
              }}
              onClick={handleWithdraw}
            >
              Save
            </button>

            <button
              className="btn btn-light btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc"
              }}
              onClick={() => setShowWithdraw(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
