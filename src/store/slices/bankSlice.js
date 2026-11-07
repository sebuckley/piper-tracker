import { nanoid } from "nanoid";

export const createBankSlice = (set, get) => ({

 bankAccounts: {},
  
  /* ---------------------------------------------------------
     ENSURE bankAccounts exists
  --------------------------------------------------------- */



  _auditAdd() {
    const user = get().user;
    const deviceId = get().deviceId;
    return {
      addedBy: user?.email ?? "unknown",
      addedAt: Date.now(),
      addedDeviceId: deviceId ?? null
    };
  },

  _auditUpdate() {
    const user = get().user;
    const deviceId = get().deviceId;
    return {
      updatedBy: user?.email ?? "unknown",
      updatedAt: Date.now(),
      updatedDeviceId: deviceId ?? null
    };
  },

  _persist() {
    const childId = get().activeChild;
    if (childId) get().saveToKV(childId);
  },

  /* ---------------------------------------------------------
     CREATE ACCOUNT
  --------------------------------------------------------- */
  createAccount: (name, currency = "GBP", type = "current") => {
    const childId = get().activeChild;
    if (!childId) return;

    const accountId = nanoid();

    set(state => ({
      bankAccounts: {
        ...state.bankAccounts,
        [accountId]: {
          id: accountId,
          name: name.trim(),
          type,
          currency,
          balance: 0,
          transactions: [],
          goals: []
        }
      }
    }));

    get()._persist();
  },

  /* ---------------------------------------------------------
     RENAME ACCOUNT
  --------------------------------------------------------- */
  renameAccount: (accountId, newName) => {
    const childId = get().activeChild;
    if (!childId) return;

    const acc = get().bankAccounts?.[accountId];
    if (!acc) return;

    set(state => ({
      bankAccounts: {
        ...state.bankAccounts,
        [accountId]: {
          ...acc,
          name: newName.trim(),
          ...get()._auditUpdate()
        }
      }
    }));

    get()._persist();
  },

  /* ---------------------------------------------------------
     SET ACCOUNT CURRENCY
  --------------------------------------------------------- */
  setAccountCurrency: (accountId, currency) => {
    const childId = get().activeChild;
    if (!childId) return;

    const acc = get().bankAccounts?.[accountId];
    if (!acc) return;

    set(state => ({
      bankAccounts: {
        ...state.bankAccounts,
        [accountId]: {
          ...acc,
          currency,
          ...get()._auditUpdate()
        }
      }
    }));

    get()._persist();
  },

  /* ---------------------------------------------------------
     SET ACCOUNT TYPE
  --------------------------------------------------------- */
  setAccountType: (accountId, type) => {
    const childId = get().activeChild;
    if (!childId) return;

    const acc = get().bankAccounts?.[accountId];
    if (!acc) return;

    set(state => ({
      bankAccounts: {
        ...state.bankAccounts,
        [accountId]: {
          ...acc,
          type,
          ...get()._auditUpdate()
        }
      }
    }));

    get()._persist();
  },

  /* ---------------------------------------------------------
     CREDIT
  --------------------------------------------------------- */
  addCredit: (accountId, amount, reason = "Pocket Money") => {
    const childId = get().activeChild;
    if (!childId) return;

    const acc = get().bankAccounts?.[accountId];
    if (!acc) return;

    const newBalance = acc.balance + amount;

    set(state => ({
      bankAccounts: {
        ...state.bankAccounts,
        [accountId]: {
          ...acc,
          balance: newBalance,
          transactions: [
            ...acc.transactions,
            {
              id: nanoid(),
              type: "credit",
              amount,
              reason,
              balanceAfter: newBalance,
              ...get()._auditAdd()
            }
          ]
        }
      }
    }));

    get()._persist();
  },

  /* ---------------------------------------------------------
     WITHDRAWAL
  --------------------------------------------------------- */
  addWithdrawal: (accountId, amount, reason = "Withdrawal") => {
    const childId = get().activeChild;
    if (!childId) return;

    const acc = get().bankAccounts?.[accountId];
    if (!acc) return;

    const newBalance = acc.balance - amount;

    set(state => ({
      bankAccounts: {
        ...state.bankAccounts,
        [accountId]: {
          ...acc,
          balance: newBalance,
          transactions: [
            ...acc.transactions,
            {
              id: nanoid(),
              type: "debit",
              amount,
              reason,
              balanceAfter: newBalance,
              ...get()._auditAdd()
            }
          ]
        }
      }
    }));

    get()._persist();
  },

  /* ---------------------------------------------------------
     TRANSFER BETWEEN ACCOUNTS
     amount is in the source currency; rate converts it to the
     destination currency (1 when currencies match).
  --------------------------------------------------------- */
  transferBetweenAccounts: (fromId, toId, amount, rate = 1, reason = "Transfer") => {
    const childId = get().activeChild;
    if (!childId) return { ok: false, error: "No active child" };

    const from = get().bankAccounts?.[fromId];
    const to = get().bankAccounts?.[toId];
    const value = Number(amount);
    const fx = from && to && from.currency === to.currency ? 1 : Number(rate);

    if (!from || !to || fromId === toId) return { ok: false, error: "Choose two different accounts" };
    if (!(value > 0)) return { ok: false, error: "Enter an amount greater than 0" };
    if (!(fx > 0)) return { ok: false, error: "Enter a valid exchange rate" };
    if (value > from.balance) return { ok: false, error: "Not enough funds in the source account" };

    const converted = Math.round(value * fx * 100) / 100;
    const fromBalance = Math.round((from.balance - value) * 100) / 100;
    const toBalance = Math.round((to.balance + converted) * 100) / 100;
    const transferId = nanoid();
    const audit = get()._auditAdd();
    const rateNote = from.currency !== to.currency
      ? ` (${value} ${from.currency} @ ${fx} = ${converted} ${to.currency})`
      : "";

    set(state => ({
      bankAccounts: {
        ...state.bankAccounts,
        [fromId]: {
          ...from,
          balance: fromBalance,
          transactions: [
            ...from.transactions,
            {
              id: nanoid(),
              type: "debit",
              amount: value,
              reason: `${reason} to ${to.name}${rateNote}`,
              balanceAfter: fromBalance,
              transferId,
              ...audit
            }
          ]
        },
        [toId]: {
          ...to,
          balance: toBalance,
          transactions: [
            ...to.transactions,
            {
              id: nanoid(),
              type: "credit",
              amount: converted,
              reason: `${reason} from ${from.name}${rateNote}`,
              balanceAfter: toBalance,
              transferId,
              ...audit
            }
          ]
        }
      }
    }));

    get()._persist();
    return { ok: true, converted };
  },

  /* ---------------------------------------------------------
     IMPORT TRANSACTIONS (CSV)
     Only rows whose importKey isn't already on the account are added.
  --------------------------------------------------------- */
  importTransactions: (accountId, rows) => {
    const childId = get().activeChild;
    const acc = get().bankAccounts?.[accountId];
    if (!childId || !acc) return { added: 0, skipped: 0 };

    const existing = new Set(acc.transactions.map(t => t.importKey).filter(Boolean));
    const fresh = rows.filter(r => !existing.has(r.importKey));

    const audit = get()._auditAdd();
    const added = fresh.map(r => ({
      id: nanoid(),
      type: r.type,
      amount: r.amount,
      reason: r.reason,
      balanceAfter: r.balanceAfter,
      importKey: r.importKey,
      date: r.date,
      ...audit,
      addedAt: r.date,
      importedAt: Date.now()
    }));

    const net = fresh.reduce((sum, r) => sum + (r.type === "credit" ? r.amount : -r.amount), 0);
    const when = t => t.date ?? t.addedAt ?? 0;
    const transactions = [...acc.transactions, ...added].sort((a, b) => when(a) - when(b));

    // If the latest transaction came from the statement, its balance is the bank's true balance
    const latest = transactions[transactions.length - 1];
    const balance =
      latest?.importKey && Number.isFinite(latest.balanceAfter)
        ? latest.balanceAfter
        : Math.round((acc.balance + net) * 100) / 100;

    set(state => ({
      bankAccounts: {
        ...state.bankAccounts,
        [accountId]: {
          ...acc,
          balance,
          transactions,
          ...get()._auditUpdate()
        }
      }
    }));

    get()._persist();
    return { added: fresh.length, skipped: rows.length - fresh.length };
  },

  /* ---------------------------------------------------------
     DELETE ACCOUNT
  --------------------------------------------------------- */
  deleteAccount: (accountId) => {
    const updated = { ...get().bankAccounts };
    delete updated[accountId];

    set({ bankAccounts: updated });

    get()._persist();   // ⭐ called AFTER set()
  },



  /* ---------------------------------------------------------
     GETTERS
  --------------------------------------------------------- */
  getAccounts: () => get().bankAccounts || {},

  getAccount: (accountId) => get().bankAccounts?.[accountId] || null,

  getBalance: (accountId) =>
    get().bankAccounts?.[accountId]?.balance ?? 0,

  getTransactions: (accountId) =>
    get().bankAccounts?.[accountId]?.transactions ?? []
});
