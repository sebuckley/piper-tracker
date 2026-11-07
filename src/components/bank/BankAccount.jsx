import { useAppStore } from "../../store/useAppStore";
import BankAccountCard from "./BankAccountCard";

export default function BankAccounts() {
  const accounts = useAppStore(state => state.bankAccounts ?? {});

  return (
    <div className="p-3">
      <h2 className="h4 mb-3" style={{ fontWeight: 700 }}>
        Bank Accounts
      </h2>

      {Object.keys(accounts).length === 0 && (
        <div className="text-muted small">No accounts created yet.</div>
      )}

      {Object.values(accounts).map(acc => (
        <BankAccountCard key={acc.id} accountId={acc.id} />
      ))}
    </div>
  );
}
