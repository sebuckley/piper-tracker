import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { createFeedbackSlice } from "../src/store/slices/feedbackSlice.js";
import { getRoutineSkillFeedback } from "../src/components/sports/feedbackDetails.js";

test("routine skill feedback resolves stable, instance and legacy references and preserves edits", () => {
  const category = { skills: [{ id: "local", templateId: "stable", name: "Jump" }, { id: "roll", name: "Roll" }] };
  const routine = { skills: ["stable", "local", "Roll", "missing"] };
  const skills = getRoutineSkillFeedback(routine, category, [
    { ref: "stable", name: "Jump", rating: "good", notes: "Controlled" },
    { ref: "removed", name: "Old skill", rating: "mixed", notes: "Keep me" }
  ]);
  assert.deepEqual(skills.map(skill => skill.name), ["Jump", "Jump", "Roll", "missing", "Old skill"]);
  assert.equal(skills[0].notes, "Controlled");
  assert.equal(skills[0].showNote, false);
  assert.equal(skills[1].rating, "");
  assert.equal(skills[3].missing, true);
  assert.equal(skills[4].notes, "Keep me");
  assert.equal(skills[4].missing, true);
});

test("detailed feedback survives saving without changing star calculation", () => {
  const saved = [];
  const logs = [];
  let state = {
    activeChild: "child", sportsFeedback: [], user: null, deviceId: "device",
    saveToKV: child => saved.push(child),
    addBehaviourLog: (...args) => logs.push(args)
  };
  const slice = createFeedbackSlice(update => {
    state = { ...state, ...(typeof update === "function" ? update(state) : update) };
  }, () => state);
  slice.addFeedbackSession({
    sportId: "sport", sportName: "Dance", mode: "detailed", score: 9,
    entries: [{
      id: "draft", name: "Jump", rating: "good",
      feedback: { whatHappened: "Jump", positive: "N/A", improve: "Balance" },
      skillFeedback: [{ ref: "skill", name: "Jump", rating: "not attempted", notes: "Controlled", positive: "Strong", improve: "Balance" }]
    }]
  });
  assert.deepEqual(state.sportsFeedback[0].entries[0].feedback, {
    whatHappened: "Jump", positive: "N/A", improve: "Balance"
  });
  assert.equal(state.sportsFeedback[0].starsAwarded, 2);
  assert.deepEqual(state.sportsFeedback[0].entries[0].skillFeedback, [
    { ref: "skill", name: "Jump", rating: "not attempted", notes: "Controlled", positive: "Strong", improve: "Balance" }
  ]);
  assert.equal(logs[0][2], 2);
  assert.deepEqual(saved, ["child"]);
});

test("history displays detail and tolerates older entries without feedback", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const React = (await import("react")).default;
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { MemoryRouter, Routes, Route } = await import("react-router-dom");
    const { useAppStore } = await server.ssrLoadModule("/src/store/useAppStore.js");
    const { default: SessionHistory } = await server.ssrLoadModule("/src/components/sports/SessionHistory.jsx");
    const sport = { id: "instance", templateId: "sport", name: "Dance" };
    const sessions = [{
      id: "session", sportId: "sport", date: "2025-01-01", mode: "detailed",
      entries: [
        { id: "one", type: "routine", name: "Routine", rating: "good", feedback: { whatHappened: "Practised", positive: "N/A", improve: "Balance" }, skillFeedback: [{ ref: "skill", name: "Handstand", rating: "mixed", notes: "Straight arms", positive: "Control" }, { ref: "other", name: "Jump", rating: "not attempted" }] },
        { id: "two", name: "Roll", rating: "mixed" }
      ]
    }];
    Object.assign(useAppStore.getInitialState(), { sportsClasses: [sport], sportsFeedback: sessions, effectiveRole: "viewer" });
    useAppStore.setState({ sportsClasses: [sport], sportsFeedback: sessions, effectiveRole: "viewer" });
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ["/sports/sport/history"] },
      React.createElement(Routes, null, React.createElement(Route, { path: "/sports/:sportId/history", element: React.createElement(SessionHistory) }))));
    assert.match(html, /Practised/);
    assert.match(html, /Balance/);
    assert.match(html, /N\/A/);
    assert.match(html, /<details/);
    assert.match(html, /Handstand/);
    assert.match(html, /Straight arms/);
    assert.match(html, /Previous routine feedback/);
    assert.match(html, /not attempted/);
    assert.match(html, /Control/);
    assert.match(html, /Roll/);
    assert.doesNotMatch(html, />Remove</);
  } finally {
    await server.close();
  }
});
