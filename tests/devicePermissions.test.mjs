import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { getEffectiveRole } from "../src/utils/devicePermissions.js";

test("device restrictions cannot elevate the account role", () => {
  assert.equal(getEffectiveRole("owner", null, false), "owner");
  assert.equal(getEffectiveRole("owner", "editor", false), "editor");
  assert.equal(getEffectiveRole("owner", "viewer", false), "viewer");
  assert.equal(getEffectiveRole("owner", null, true), "viewer");
  assert.equal(getEffectiveRole("editor", null, true), "viewer");
  assert.equal(getEffectiveRole("viewer", "editor", false), "viewer");
  assert.equal(getEffectiveRole(null, null, false), "viewer");
});

test("viewer pages retain browsing and requests but hide mutation controls", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const React = (await import("react")).default;
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { MemoryRouter } = await import("react-router-dom");
    const { useAppStore } = await server.ssrLoadModule("/src/store/useAppStore.js");
    const { default: SportsClasses } = await server.ssrLoadModule("/src/components/SportsClasses.jsx");
    const { default: RewardCard } = await server.ssrLoadModule("/src/components/rewards/RewardCard.jsx");
    const { default: SkillsBrowser } = await server.ssrLoadModule("/src/components/sports/skills/SkillsBrowser.jsx");
    useAppStore.setState({
      effectiveRole: "viewer",
      sportsClasses: [{ id: "s", templateId: "sport", name: "Dance", classSessions: [], categories: [], uiLabels: {} }]
    });
    useAppStore.getInitialState = useAppStore.getState;
    const render = element => renderToStaticMarkup(React.createElement(MemoryRouter, null, element));
    const sports = render(React.createElement(SportsClasses));
    assert.doesNotMatch(sports, /Add New Sport|Add Feedback/);
    const rewards = render(React.createElement(RewardCard, {
      item: { name: "Treat", cost: 5, repeatable: true }, onRequest: () => {}
    }));
    assert.match(rewards, /Request Redemption/);
    assert.doesNotMatch(rewards, />Redeem</);
    const skills = render(React.createElement(SkillsBrowser, {
      skills: [{ id: "1", name: "Jump", level: 1 }], levels: [], readOnly: true, onRemove: () => {}
    }));
    assert.match(skills, /Jump/);
    assert.doesNotMatch(skills, />Remove</);
  } finally {
    await server.close();
  }
});
