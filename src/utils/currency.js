export const CURRENCIES = [
  { code: "GBP", symbol: "£" },
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "JPY", symbol: "¥" }
];

export const DEFAULT_CURRENCY = "GBP";

export const currencySymbol = code =>
  CURRENCIES.find(c => c.code === code)?.symbol ?? code ?? "";
