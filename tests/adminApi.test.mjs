import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

test("admin environment selection and request failures", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  const originalFetch = globalThis.fetch;
  try {
    const { getAdminEnvironment, adminRequest, getAdminList } =
      await server.ssrLoadModule("/src/components/settings/adminApi.js");
    const development = getAdminEnvironment("");
    const production = getAdminEnvironment("?environment=production");
    assert.equal(development.apiBase, "http://127.0.0.1:8787");
    assert.equal(production.apiBase, "https://piper-tracker-backend.sebuckley.workers.dev");
    assert.equal(production.query, "?environment=production");
    assert.equal(getAdminEnvironment("?environment=typo").invalid, true);

    const calls = [];
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options });
      return new Response(JSON.stringify([{ id: "one" }]), { status: 200 });
    };
    assert.deepEqual(await getAdminList(production.apiBase, "/api/pending/skills"), [{ id: "one" }]);
    await adminRequest(development.apiBase, "/api/approve/skill", { method: "POST" });
    assert.equal(calls[0].url, `${production.apiBase}/api/pending/skills`);
    assert.equal(calls[1].url, `${development.apiBase}/api/approve/skill`);

    globalThis.fetch = async () => new Response("error", { status: 500 });
    await assert.rejects(adminRequest(production.apiBase, "/api/approve/skill", { method: "POST" }), /HTTP 500/);
    globalThis.fetch = async () => new Response("{}", { status: 200 });
    await assert.rejects(getAdminList(production.apiBase, "/api/pending/skills"), /invalid list/);

    const React = (await import("react")).default;
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { MemoryRouter } = await import("react-router-dom");
    const { default: AdminPanel } = await server.ssrLoadModule("/src/components/settings/AdminPanel.jsx");
    const render = element => renderToStaticMarkup(
      React.createElement(MemoryRouter, { initialEntries: ["/settings/admin?environment=production"] }, element)
    );
    const panel = render(React.createElement(AdminPanel));
    for (const route of ["approve-sports", "approveskills", "approveroutines", "approvecategories", "approverewards", "approveclubs"]) {
      assert.match(panel, new RegExp(`${route}\\?environment=production`));
    }
    assert.match(panel, /Changes affect live production data/);
    for (const name of ["Sports", "Skills", "Routines", "Categories", "Rewards", "Clubs"]) {
      const { default: ApprovalPage } = await server.ssrLoadModule(`/src/components/settings/AdminApprove${name}.jsx`);
      const html = render(React.createElement(ApprovalPage));
      assert.match(html, /Approval environment:.*Production/);
      assert.match(html, /settings\/admin\?environment=production/);
    }
  } finally {
    globalThis.fetch = originalFetch;
    await server.close();
  }
});
