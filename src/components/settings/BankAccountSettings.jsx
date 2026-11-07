import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { Link } from "react-router-dom";

/* ---------------------------------------------------------
   Account Row — Piper Tracker Style
--------------------------------------------------------- */
function AccountRow({ account, renameAccount, setAccountCurrency, setAccountType, deleteAccount }) {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(account.name);
  const [currency, setCurrency] = useState(account.currency);
  const [type, setType] = useState(account.type);

  const symbol =
    currency === "GBP" ? "£" :
    currency === "EUR" ? "€" :
    currency === "USD" ? "$" :
    currency === "JPY" ? "¥" :
    currency;

  const accentColor = "#b300ff";

  const saveChanges = () => {
    renameAccount(account.id, name);
    setAccountCurrency(account.id, currency);
    setAccountType(account.id, type);
    setEditing(false);
  };

  return (
    <div
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

        {/* TEXT BLOCK / EDIT BLOCK */}
        <div style={{ flexGrow: 1, textAlign: "left" }}>
          {!editing && (
            <>
              <strong style={{ color: "#1f2a44", fontSize: "16px" }}>
                {account.name}
              </strong>

              <div className="text-muted small">Type: {account.type}</div>
              <div className="text-muted small">Currency: {currency} ({symbol})</div>
            </>
          )}

          {editing && (
            <>
              <input
                type="text"
                className="form-control mb-2"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ borderRadius: "12px" }}
              />

              <select
                className="form-control mb-2"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                style={{ borderRadius: "12px" }}
              >
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="JPY">JPY (¥)</option>
              </select>

              <select
                className="form-control mb-2"
                value={type}
                onChange={e => setType(e.target.value)}
                style={{ borderRadius: "12px" }}
              >
                <option value="current">Current Account</option>
                <option value="saving">Savings Account</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div
        style={{
          textAlign: "right",
          minWidth: "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        {!editing && (
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-light btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc",
                padding: "4px 10px",
                fontWeight: 600,
                color: "#1f2a44"
              }}
              onClick={() => setEditing(true)}
            >
              Manage
            </button>

            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#cc0033",
                borderRadius: "10px",
                padding: "4px 10px",
                fontWeight: 600,
                color: "#ffffff"
              }}
              onClick={() => deleteAccount(account.id)}
            >
              Delete
            </button>
          </div>
        )}

        {editing && (
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                borderRadius: "10px",
                padding: "4px 10px",
                fontWeight: 600
              }}
              onClick={saveChanges}
            >
              Save
            </button>

            <button
              className="btn btn-light btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc"
              }}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



/* ---------------------------------------------------------
   MAIN PAGE — Piper Tracker Style
--------------------------------------------------------- */
export default function BankAccountSettings() {
  const activeChild = useAppStore(state => state.activeChild);
  const children = useAppStore(state => state.children);

  const accounts = useAppStore(state => state.bankAccounts ?? {});
  const createAccount = useAppStore(state => state.createAccount);
  const renameAccount = useAppStore(state => state.renameAccount);
  const setAccountCurrency = useAppStore(state => state.setAccountCurrency);
  const setAccountType = useAppStore(state => state.setAccountType);
  const deleteAccount = useAppStore(state => state.deleteAccount);

  const profileCurrency = useAppStore(state => state.userProfile?.currency) || "GBP";
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCurrency, setNewCurrency] = useState(profileCurrency);
  const [newType, setNewType] = useState("current");

  if (!activeChild) {
    return (
      <div className="container mt-4">
        <div className="text-muted">No child selected.</div>
      </div>
    );
  }

  const child = children.find(c => c.id === activeChild);

  const resetCreateForm = () => {
    setNewName("");
    setNewCurrency(profileCurrency);
    setNewType("current");
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    createAccount(newName.trim(), newCurrency, newType);
    resetCreateForm();
    setShowCreate(false);
  };

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>

      {/* Breadcrumb — ALWAYS LEFT ALIGNED */}
      <div className="mb-3" style={{ fontSize: "18px", fontWeight: 600, textAlign: "left" }}>
        <Link to="/settings" style={{ color: "#1f2a44", textDecoration: "none" }}>
          Settings
        </Link>
        <span style={{ color: "#1f2a44" }}> / </span>
        <span style={{ color: "#b300ff" }}>Bank Accounts</span>
      </div>

      {/* Page Title */}
      <h2
        className="h3 mt-3 mb-4 text-center"
        style={{
          color: "#b300ff",
          fontWeight: 700,
          letterSpacing: "0.5px"
        }}
      >
        Bank Accounts
      </h2>

      {/* Section Header */}
      <h3
        className="h4 mb-3"
        style={{ color: "#1f2a44", fontWeight: 600 }}
      >
        Manage Accounts for {child.firstName}
      </h3>

      {/* Add Button */}
      {!showCreate && (
        <div className="d-flex justify-content-end align-items-center mb-3">
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "#b300ff",
              color: "white",
              borderRadius: "10px",
              padding: "6px 14px",
              fontWeight: 600
            }}
            onClick={() => setShowCreate(true)}
          >
            + Add Account
          </button>
        </div>
      )}

      {/* Accounts */}
      {Object.keys(accounts).length === 0 && (
        <div className="text-muted small">No accounts created yet.</div>
      )}

      {Object.values(accounts).map(acc => (
        <AccountRow
          key={acc.id}
          account={acc}
          renameAccount={renameAccount}
          setAccountCurrency={setAccountCurrency}
          setAccountType={setAccountType}
          deleteAccount={deleteAccount}
        />
      ))}

      {/* Add Form */}
      {showCreate && (
        <div
          className="mt-3"
          style={{
            background: "white",
            border: "1px solid #e6e6e6",
            borderRadius: "16px",
            padding: "16px"
          }}
        >
          <h5 style={{ fontWeight: 600, color: "#1f2a44" }}>Create Account</h5>

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Account Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            style={{ borderRadius: "12px" }}
          />

          <select
            className="form-control mb-2"
            value={newCurrency}
            onChange={e => setNewCurrency(e.target.value)}
            style={{ borderRadius: "12px" }}
          >
            <option value="GBP">GBP (£)</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="JPY">JPY (¥)</option>
          </select>

          <select
            className="form-control mb-3"
            value={newType}
            onChange={e => setNewType(e.target.value)}
            style={{ borderRadius: "12px" }}
          >
            <option value="current">Current Account</option>
            <option value="saving">Savings Account</option>
          </select>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#b300ff",
                color: "white",
                borderRadius: "10px",
                padding: "6px 14px",
                fontWeight: 600
              }}
              onClick={handleCreate}
            >
              Save
            </button>

            <button
              className="btn btn-light btn-sm"
              style={{
                borderRadius: "10px",
                border: "1px solid #dcdcdc"
              }}
              onClick={() => {
                resetCreateForm();
                setShowCreate(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
