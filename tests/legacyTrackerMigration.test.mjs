import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

test("legacy migration preserves data and blocks unsafe saves", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  const previousFetch = globalThis.fetch;
  try {
    const { default: worker } = await server.ssrLoadModule("/worker/piper-worker.js");
    const { createSyncSlice } = await server.ssrLoadModule("/src/store/slices/syncSlice.js");
    const { encryptPayload, decryptPayload } = await server.ssrLoadModule("/src/utils/crypto.js");
    const original = {
      sportsClasses: [], behaviourLogs: [{ id: "behaviour", stars: 1 }],
      achievements: [{ id: "achievement", stars: 10 }], rewards: [],
      routines: [], starBalance: 11, rewardLogs: [], sportsFeedback: [],
      extraField: { keep: true }
    };
    const originalText = JSON.stringify(original);
    const data = new Map([["state:child", originalText]]);
    let failBackup = false;
    const env = { TRACKER_DATA: {
      get: async key => data.get(key) ?? null,
      put: async (key, value) => {
        if (failBackup && key.startsWith("migration-backup:")) throw new Error("backup failed");
        data.set(key, value);
      }
    } };
    globalThis.fetch = async (url, options) => worker.fetch(new Request(url, options), env);

    const key = crypto.getRandomValues(new Uint8Array(32));
    const state = { activeChild: "child", encryptionKey: key, sportsClasses: [] };
    const set = values => Object.assign(state, values);
    Object.assign(state, createSyncSlice(set, () => state));

    failBackup = true;
    assert.equal(await state.loadFromKV("child"), false);
    assert.equal(data.get("state:child"), originalText);
    await state.saveToKV("child");
    assert.equal(data.get("state:child"), originalText);

    failBackup = false;
    const [first, second] = await Promise.all([state.loadFromKV("child"), state.loadFromKV("child")]);
    assert.equal(first, true);
    assert.equal(second, true);
    assert.equal(state.starBalance, 11);
    assert.deepEqual(state.achievements, original.achievements);
    assert.deepEqual(state.behaviourLogs, original.behaviourLogs);
    assert.deepEqual(state.trackerStateExtras, { extraField: { keep: true } });
    const backups = [...data.entries()].filter(([name]) => name.startsWith("migration-backup:"));
    assert.equal(backups.length, 1);
    assert.equal(backups[0][1], originalText);
    assert.ok(JSON.parse(data.get("state:child")).payload);

    state.encryptionKey = crypto.getRandomValues(new Uint8Array(32));
    assert.equal(await state.loadFromKV("child"), false);
    const encrypted = data.get("state:child");
    await state.saveToKV("child");
    assert.equal(data.get("state:child"), encrypted);

    data.set("state:child", JSON.stringify({ payload: await encryptPayload(original, key) }));
    state.encryptionKey = key;
    assert.equal(await state.loadFromKV("child"), true);
    assert.equal([...data.keys()].filter(name => name.startsWith("migration-backup:")).length, 1);
    await state.saveToKV("child");
    const saved = await decryptPayload(JSON.parse(data.get("state:child")).payload, key);
    assert.equal(saved.starBalance, 11);
    assert.deepEqual(saved.achievements, original.achievements);
    assert.deepEqual(saved.extraField, original.extraField);

    data.set("state:child", originalText);
    const staleMigration = await worker.fetch(new Request("http://test/api/state/child/migrate", {
      method: "POST",
      body: JSON.stringify({ originalHash: "0".repeat(64), record: { payload: { iv: [], cipher: [] } } })
    }), env);
    assert.equal(staleMigration.status, 409);
    assert.equal(data.get("state:child"), originalText);
  } finally {
    globalThis.fetch = previousFetch;
    await server.close();
  }
});
