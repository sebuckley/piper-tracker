import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";

const symbolFor = c =>
  c === "GBP" ? "£" : c === "EUR" ? "€" : c === "USD" ? "$" : c === "JPY" ? "¥" : c;

// Transfer money from one account to another, converting currency when they differ.
export default function TransferForm({ fromId, close }) {
  const accounts = useAppStore(s => s.bankAccounts ?? {});
  const transfer = useAppStore(s => s.transferBetweenAccounts);

  const from = accounts[fromId];
  const targets = Object.values(accounts).filter(a => a.id !== fromId);

  const [toId, setToId] = useState(targets[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [rateStatus, setRateStatus] = useState("");
  const [error, setError] = useState("");

  const to = accounts[toId];
  const sameCurrency = !from || !to || from.currency === to.currency;

  // Look up the live rate; it stays editable in case the lookup fails or a bank rate differs
  useEffect(() => {
    if (!from || !to || from.currency === to.currency) return;

    let cancelled = false;
    fetch(`https://api.frankfurter.app/latest?from=${from.currency}&to=${to.currency}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error("rate lookup failed"))))
      .then(data => {
        const live = data?.rates?.[to.currency];
        if (cancelled) return;
        if (live) {
          setRate(String(live));
          setRateStatus(`Live rate for ${data.date}`);
        } else {
          setRateStatus("No rate found — enter one manually.");
        }
      })
      .catch(() => {
        if (!cancelled) setRateStatus("Couldn't fetch a live rate — enter one manually.");
      });

    return () => {
      cancelled = true;
    };
  }, [from?.currency, to?.currency]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!from) return null;

  if (targets.length === 0) {
    return <div className="text-muted small mt-3">You need a second account to transfer.</div>;
  }

  const fx = sameCurrency ? 1 : Number(rate);
  const converted = Number(amount) > 0 && fx > 0 ? Math.round(Number(amount) * fx * 100) / 100 : null;

  const submit = () => {
    const res = transfer(fromId, toId, Number(amount), fx);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    close();
  };

  return (
    <div className="mt-3">
      <div className="small mb-1">Transfer from {from.name}</div>

      <select
        className="form-select mb-2"
        value={toId}
        onChange={e => { setToId(e.target.value); setRate(""); setRateStatus(""); }}
        style={{ borderRadius: "12px" }}
      >
        {targets.map(a => (
          <option key={a.id} value={a.id}>
            {a.name} ({a.currency})
          </option>
        ))}
      </select>

      <input
        type="number"
        className="form-control mb-2"
        placeholder={`Amount (${symbolFor(from.currency)})`}
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={{ borderRadius: "12px" }}
      />

      {!sameCurrency && (
        <>
          <label className="small text-muted">
            Exchange rate (1 {from.currency} = ? {to.currency})
          </label>
          <input
            type="number"
            className="form-control mb-1"
            value={rate}
            onChange={e => setRate(e.target.value)}
            style={{ borderRadius: "12px" }}
          />
          {rateStatus && <div className="text-muted small mb-2">{rateStatus}</div>}
        </>
      )}

      {converted !== null && (
        <div className="small mb-2">
          {to.name} will receive <strong>{symbolFor(to.currency)}{converted.toFixed(2)}</strong>
        </div>
      )}

      {error && <div className="text-danger small mb-2">{error}</div>}

      <div className="d-flex gap-2">
        <button
          className="btn btn-sm"
          style={{ backgroundColor: "#b300ff", color: "white", borderRadius: "10px" }}
          onClick={submit}
        >
          Transfer
        </button>
        <button
          className="btn btn-light btn-sm"
          style={{ borderRadius: "10px", border: "1px solid #dcdcdc" }}
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
