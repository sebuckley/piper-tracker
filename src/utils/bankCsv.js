// Parses a bank statement CSV (Transaction Date, Type, Description, Amount, Balance)
// into transactions. Rows are given a stable key so re-importing is idempotent.

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map(s => s.trim());
}

const num = v => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9+\-.]/g, ""));
  return Number.isFinite(n) ? n : null;
};

// dd/mm/yyyy or yyyy-mm-dd -> local-noon timestamp (avoids timezone day shifts)
function parseDate(v) {
  const s = String(v || "").trim();
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 12).getTime();
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12).getTime();
  return null;
}

export function parseStatementCsv(text) {
  const lines = String(text || "").replace(/^\uFEFF/, "").split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { rows: [], errors: ["The file has no data rows."] };

  const header = splitCsvLine(lines[0]).map(h => h.toLowerCase());
  const col = names => header.findIndex(h => names.some(n => h.includes(n)));
  const iDate = col(["date"]);
  const iDesc = col(["description", "details", "reference"]);
  const iAmount = col(["amount"]);
  const iBalance = col(["balance"]);

  if (iDate < 0 || iDesc < 0 || iAmount < 0) {
    return { rows: [], errors: ["Couldn't find Date, Description and Amount columns."] };
  }

  const rows = [];
  const errors = [];
  const seen = {};

  lines.slice(1).forEach((line, idx) => {
    const cells = splitCsvLine(line);
    const date = parseDate(cells[iDate]);
    const signed = num(cells[iAmount]);

    if (date === null || signed === null || signed === 0) {
      errors.push(`Row ${idx + 2} skipped (invalid date or amount).`);
      return;
    }

    const description = cells[iDesc] || "Imported transaction";
    const balance = iBalance >= 0 ? num(cells[iBalance]) : null;
    const base = `${new Date(date).toISOString().slice(0, 10)}|${signed.toFixed(2)}|${description.toLowerCase()}|${balance ?? ""}`;

    // Identical rows within one file are distinct transactions
    seen[base] = (seen[base] || 0) + 1;

    rows.push({
      importKey: `${base}#${seen[base]}`,
      date,
      type: signed > 0 ? "credit" : "debit",
      amount: Math.abs(signed),
      reason: description,
      balanceAfter: balance
    });
  });

  // Statements are usually newest-first; keep rows chronological so the last row is the latest
  if (rows.length > 1 && rows[0].date > rows[rows.length - 1].date) rows.reverse();

  return { rows, errors };
}
