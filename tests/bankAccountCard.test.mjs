import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

test("bank card offers the appropriate actions for editors and viewers", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const React = (await import("react")).default;
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { MemoryRouter } = await import("react-router-dom");
    const { useAppStore } = await server.ssrLoadModule("/src/store/useAppStore.js");
    const { default: BankAccountCard } = await server.ssrLoadModule("/src/components/bank/BankAccountCard.jsx");
    const account = {
      id: "one", name: "Savings", type: "savings", currency: "GBP", balance: 42,
      transactions: [{ id: "tx", type: "credit", amount: 42, reason: "Gift", addedAt: 0 }]
    };
    const bankAccounts = { one: account, two: { ...account, id: "two" } };
    useAppStore.getInitialState().bankAccounts = bankAccounts;
    useAppStore.setState({
      bankAccounts,
      effectiveRole: "editor"
    });
    const render = id => renderToStaticMarkup(
      React.createElement(MemoryRouter, null, React.createElement(BankAccountCard, { accountId: id }))
    );

    const editor = render("one");
    assert.match(editor, /Savings/);
    assert.match(editor, /£42\.00/);
    assert.match(editor, /Add Credit/);
    assert.match(editor, /Withdraw/);
    assert.match(editor, /aria-expanded="false"/);
    assert.match(editor, /bank-secondary-actions/);
    assert.match(editor, /Import CSV/);
    assert.match(editor, />Transfer</);
    assert.match(editor, /View Full History/);

    useAppStore.setState({ effectiveRole: "viewer" });
    const viewer = render("one");
    assert.match(viewer, /Additional actions/);
    assert.match(viewer, /View Full History/);
    assert.doesNotMatch(viewer, /Add Credit|Withdraw|Import CSV|>Transfer</);
    assert.match(render("missing"), /Account not found/);
  } finally {
    await server.close();
  }
});
