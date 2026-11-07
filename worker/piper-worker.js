import { DEFAULT_TEMPLATES } from "./templates/sportsData";
import { DEFAULT_REWARDS } from "./templates/rewardsData";

// Adds any code-defined rewards missing from GLOBAL_REWARDS (existing entries win)
async function seedRewards(env) {
  const list = await env.GLOBAL_REWARDS.list();
  const existing = new Set(list.keys.map(k => k.name));

  for (const reward of DEFAULT_REWARDS) {
    const key = `${reward.templateId}.json`;
    if (!existing.has(key)) {
      await env.GLOBAL_REWARDS.put(key, JSON.stringify(reward));
    }
  }
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

function upsertById(list, item) {
  const i = list.findIndex(x => x.id === item.id);
  if (i >= 0) list[i] = item;
  else list.push(item);
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...cors(), "Content-Type": "application/json" }
  });
}

// Find a stored template by its stable id (not by KV key name)
async function findTemplate(env, templateId) {
  const list = await env.GLOBAL_TEMPLATES.list();
  for (const k of list.keys) {
    const template = await env.GLOBAL_TEMPLATES.get(k.name, "json");
    if (template?.id === templateId) return { key: k.name, template };
  }
  return null;
}

// Adds items from `def` that are missing in `current` (matched by id). Mutates
// `current` and returns true if anything was added.
function mergeMissing(current, def) {
  let changed = false;

  const addMissing = (target, source) => {
    const ids = new Set(target.map(x => x.id));
    for (const item of source || []) {
      if (!ids.has(item.id)) {
        target.push(item);
        changed = true;
      }
    }
  };

  // Backfill rules added to the code templates after the KV copy was seeded
  if (!current.routineRules && def.routineRules) {
    current.routineRules = def.routineRules;
    changed = true;
  }

  if (!current.uiLabels && def.uiLabels) {
    current.uiLabels = def.uiLabels;
    changed = true;
  }

  current.levels = current.levels || [];
  addMissing(current.levels, def.levels);

  current.categories = current.categories || [];
  addMissing(current.categories, def.categories);

  for (const defCat of def.categories || []) {
    const cat = current.categories.find(c => c.id === defCat.id);
    if (!cat) continue;

    if (!cat.routineRules && defCat.routineRules) {
      cat.routineRules = defCat.routineRules;
      changed = true;
    }
    cat.skills = cat.skills || [];
    cat.routines = cat.routines || [];
    addMissing(cat.skills, defCat.skills);
    addMissing(cat.routines, defCat.routines);
  }

  return changed;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // ---------------------------------------------------------
    // CORS preflight
    // ---------------------------------------------------------
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors() });
    }

    // ---------------------------------------------------------
    // Health check
    // ---------------------------------------------------------
    if (path === "/" && method === "GET") {
      return new Response("Piper Tracker KV backend is running!", {
        status: 200,
        headers: { ...cors(), "Content-Type": "text/plain" }
      });
    }

    // ---------------------------------------------------------
    // GLOBAL TEMPLATE ROUTES
    // ---------------------------------------------------------

    // GET /api/templates
    if (method === "GET" && path === "/api/templates") {
      const list = await env.GLOBAL_TEMPLATES.list();
      const stored = new Map();

      await Promise.all(
        list.keys.map(async k => {
          stored.set(k.name, await env.GLOBAL_TEMPLATES.get(k.name, "json"));
        })
      );

      // Reseed missing templates and merge in code-defined items missing from KV
      // (levels, categories, skills, routines by id). Existing KV data wins.
      for (const def of DEFAULT_TEMPLATES) {
        const key = `${def.name.toLowerCase()}.json`;
        const current = stored.get(key);

        if (!current) {
          await env.GLOBAL_TEMPLATES.put(key, JSON.stringify(def));
          stored.set(key, def);
          continue;
        }

        if (mergeMissing(current, def)) {
          await env.GLOBAL_TEMPLATES.put(key, JSON.stringify(current));
        }
      }

      const templates = [...stored.values()].filter(Boolean);

      return new Response(JSON.stringify(templates), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // POST /api/update/template - replace a stored template (admin editor)
    if (method === "POST" && path === "/api/update/template") {
      const template = await request.json();
      if (!template?.id) return jsonError("Template id required", 400);

      const found = await findTemplate(env, template.id);
      const key = found?.key ?? `${String(template.name || template.id).toLowerCase()}.json`;
      await env.GLOBAL_TEMPLATES.put(key, JSON.stringify(template));

      return new Response(JSON.stringify({ status: "updated", id: template.id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // DELETE /api/templates/:id
    if (method === "DELETE" && path.startsWith("/api/templates/")) {
      const id = path.split("/")[3];

      const list = await env.GLOBAL_TEMPLATES.list();
      let deletedFile = null;

      for (const item of list.keys) {
        const data = await env.GLOBAL_TEMPLATES.get(item.name, { type: "json" });
        if (data && data.id === id) {
          deletedFile = item.name;
          break;
        }
      }

      if (deletedFile) {
        await env.GLOBAL_TEMPLATES.delete(deletedFile);
        return new Response(JSON.stringify({ deleted: id }), {
          status: 200,
          headers: { ...cors(), "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ error: "Template not found" }), {
        status: 404,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ---------------------------------------------------------
    // SUBMISSION ROUTES (User → Pending)
    // ---------------------------------------------------------

    // ⭐ Submit Sport
    if (method === "POST" && path === "/api/submit/sport") {
      const body = await request.json();
      const id = crypto.randomUUID();

      await env.GLOBAL_SUBMISSIONS.put(
        `pendingSports/${id}.json`,
        JSON.stringify({ id, ...body })
      );

      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ⭐ Submit Skill
    if (method === "POST" && path === "/api/submit/skill") {
      const body = await request.json();
      const id = crypto.randomUUID();

      await env.GLOBAL_SUBMISSIONS.put(
        `pendingSkills/${id}.json`,
        JSON.stringify({ id, ...body })
      );

      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ⭐ Submit Routine (keyed by routine id so re-saving updates the pending entry)
    if (method === "POST" && path === "/api/submit/routine") {
      const body = await request.json();
      const id = body.routine?.id || crypto.randomUUID();

      await env.GLOBAL_SUBMISSIONS.put(
        `pendingRoutines/${id}.json`,
        JSON.stringify({ ...body, id })
      );

      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // Submit Category (keyed by category id)
    if (method === "POST" && path === "/api/submit/category") {
      const body = await request.json();
      const id = body.category?.id || crypto.randomUUID();

      await env.GLOBAL_SUBMISSIONS.put(
        `pendingCategories/${id}.json`,
        JSON.stringify({ ...body, id })
      );

      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // GET /api/rewards?q=term - search approved global rewards
    if (method === "GET" && path === "/api/rewards") {
      const q = (url.searchParams.get("q") || "").trim().toLowerCase();
      await seedRewards(env);
      const list = await env.GLOBAL_REWARDS.list();
      const rewards = [];
      for (const k of list.keys) {
        const data = await env.GLOBAL_REWARDS.get(k.name, "json");
        if (!data?.name) continue;
        if (q && !data.name.toLowerCase().includes(q)) continue;
        rewards.push(data);
        if (rewards.length >= 20) break;
      }
      return new Response(JSON.stringify(rewards), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // Submit Reward (keyed by the reward's stable templateId)
    if (method === "POST" && path === "/api/submit/reward") {
      const body = await request.json();
      const id = body.reward?.templateId || body.reward?.id || crypto.randomUUID();
      await env.GLOBAL_SUBMISSIONS.put(`pendingRewards/${id}.json`, JSON.stringify({ ...body, id }));
      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // Pending Rewards
    if (method === "GET" && path === "/api/pending/rewards") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingRewards/" });
      const items = await Promise.all(list.keys.map(k => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Approve Reward (stored in the global rewards list)
    if (method === "POST" && path === "/api/approve/reward") {
      const { reward } = await request.json();
      if (!reward?.templateId) return jsonError("Reward needs a templateId", 400);
      await env.GLOBAL_REWARDS.put(`${reward.templateId}.json`, JSON.stringify(reward));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Reject Reward
    if (method === "DELETE" && path.startsWith("/api/pending/rewards/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingRewards/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // GET /api/clubs?q=term&sport=Gymnastics - search approved clubs
    if (method === "GET" && path === "/api/clubs") {
      const q = (url.searchParams.get("q") || "").trim().toLowerCase();
      const sportName = (url.searchParams.get("sport") || "").trim().toLowerCase();

      const list = await env.GLOBAL_CLUBS.list();
      const clubs = [];
      for (const k of list.keys) {
        const data = await env.GLOBAL_CLUBS.get(k.name, "json");
        if (!data?.name) continue;
        if (q && !data.name.toLowerCase().includes(q)) continue;
        if (sportName && data.sport && data.sport.toLowerCase() !== sportName) continue;
        clubs.push(data);
        if (clubs.length >= 20) break;
      }

      return new Response(JSON.stringify(clubs), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ⭐ Submit Club (new club)
    if (method === "POST" && path === "/api/submit/club") {
      const body = await request.json();
      const id = crypto.randomUUID();

      await env.GLOBAL_SUBMISSIONS.put(
        `pendingClubs/${id}.json`,
        JSON.stringify({ id, ...body })
      );

      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ⭐ Submit Club Update
    if (method === "POST" && path === "/api/submit/club-update") {
      const body = await request.json();
      const id = crypto.randomUUID();

      await env.GLOBAL_SUBMISSIONS.put(
        `pendingClubUpdates/${id}.json`,
        JSON.stringify({ id, ...body })
      );

      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ---------------------------------------------------------
    // PENDING ROUTES (Admin → View)
    // ---------------------------------------------------------

    // Pending Sports
    if (method === "GET" && path === "/api/pending/sports") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingSports/" });
      const items = await Promise.all(list.keys.map(k => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Pending Skills
    if (method === "GET" && path === "/api/pending/skills") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingSkills/" });
      const items = await Promise.all(list.keys.map(k => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Pending Routines
    if (method === "GET" && path === "/api/pending/routines") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingRoutines/" });
      const items = await Promise.all(list.keys.map(k => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Pending Categories
    if (method === "GET" && path === "/api/pending/categories") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingCategories/" });
      const items = await Promise.all(list.keys.map(k => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Pending Clubs
    if (method === "GET" && path === "/api/pending/clubs") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingClubs/" });
      const items = await Promise.all(list.keys.map(k => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Pending Club Updates
    if (method === "GET" && path === "/api/pending/club-updates") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingClubUpdates/" });
      const items = await Promise.all(list.keys.map(k => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // ---------------------------------------------------------
    // APPROVAL ROUTES (Admin → Global Stores)
    // ---------------------------------------------------------

    // Approve Sport
    if (method === "POST" && path === "/api/approve/sport") {
      const { sport } = await request.json();
      await env.GLOBAL_TEMPLATES.put(`${sport.name.toLowerCase()}.json`, JSON.stringify(sport));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Approve Skill
    if (method === "POST" && path === "/api/approve/skill") {
      const { templateId, categoryId, skill } = await request.json();
      const found = await findTemplate(env, templateId);
      const category = found?.template.categories.find(c => c.id === categoryId);
      if (!category) return jsonError("Sport or category not found", 404);

      category.skills = category.skills || [];
      upsertById(category.skills, skill);
      await env.GLOBAL_TEMPLATES.put(found.key, JSON.stringify(found.template));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Approve Routine (also adds any of its skills the template doesn't have yet)
    if (method === "POST" && path === "/api/approve/routine") {
      const { templateId, categoryId, routine, skills = [] } = await request.json();
      const found = await findTemplate(env, templateId);
      const category = found?.template.categories.find(c => c.id === categoryId);
      if (!category) return jsonError("Sport or category not found", 404);

      category.skills = category.skills || [];
      category.routines = category.routines || [];

      const existingSkillIds = new Set(category.skills.map(s => s.id));
      for (const sk of skills) {
        if (!existingSkillIds.has(sk.id)) category.skills.push(sk);
      }

      upsertById(category.routines, routine);
      await env.GLOBAL_TEMPLATES.put(found.key, JSON.stringify(found.template));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Approve Category (added to the sport template if missing)
    if (method === "POST" && path === "/api/approve/category") {
      const { templateId, category } = await request.json();
      const found = await findTemplate(env, templateId);
      if (!found) return jsonError("Sport not found", 404);

      found.template.categories = found.template.categories || [];
      upsertById(found.template.categories, category);
      await env.GLOBAL_TEMPLATES.put(found.key, JSON.stringify(found.template));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Approve Club (new club)
    if (method === "POST" && path === "/api/approve/club") {
      const { club } = await request.json();
      await env.GLOBAL_CLUBS.put(`${club.name}.json`, JSON.stringify(club));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // ⭐ POST /api/approve/club-update
    if (method === "POST" && path === "/api/approve/club-update") {
      const { clubName, updates, submittedBy, submittedAt } = await request.json();

      console.log(clubName);

      // 1️⃣ Load existing club using clubName as the KV key
      const club = await env.GLOBAL_CLUBS.get(`${clubName}.json`, "json");
      if (!club) {
        return new Response(JSON.stringify({ error: "Club not found" }), {
          status: 404,
          headers: { ...cors(), "Content-Type": "application/json" }
        });
      }

      // 2️⃣ Merge updates + add audit fields
      const updatedClub = {
        ...club,
        ...updates,
        lastUpdatedBy: submittedBy,
        lastUpdatedAt: submittedAt
      };

      // 3️⃣ Save updated club back using clubName.json
      await env.GLOBAL_CLUBS.put(`${clubName}.json`, JSON.stringify(updatedClub));

      return new Response(JSON.stringify({ status: "approved" }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ---------------------------------------------------------
    // DELETE ROUTES (Admin → Reject)
    // ---------------------------------------------------------

    // Reject Sport
    if (method === "DELETE" && path.startsWith("/api/pending/sports/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingSports/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Reject Skill
    if (method === "DELETE" && path.startsWith("/api/pending/skills/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingSkills/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Reject Routine
    if (method === "DELETE" && path.startsWith("/api/pending/routines/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingRoutines/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Reject Category
    if (method === "DELETE" && path.startsWith("/api/pending/categories/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingCategories/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Reject Club
    if (method === "DELETE" && path.startsWith("/api/pending/clubs/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingClubs/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // Reject Club Update
    if (method === "DELETE" && path.startsWith("/api/pending/club-updates/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingClubUpdates/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    // ---------------------------------------------------------
    // USER ROUTES
    // ---------------------------------------------------------

    if (method === "GET" && path.startsWith("/api/user/")) {
      const uid = path.split("/")[3];
      const json = await env.TRACKER_DATA.get(`user:${uid}`);
      return new Response(json || "{}", { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    if (method === "PUT" && path.startsWith("/api/user/")) {
      const uid = path.split("/")[3];
      const body = await request.text();
      await env.TRACKER_DATA.put(`user:${uid}`, body);
      return new Response("OK", { status: 200, headers: cors() });
    }

    if (method === "DELETE" && path.startsWith("/api/user/")) {
      const uid = path.split("/")[3];
      await env.TRACKER_DATA.delete(`user:${uid}`);
      return new Response(JSON.stringify({ ok: true, deleted: uid }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // GET /api/admin/storage - size of each KV namespace (KV has no size API, so
    // every value is read; fine for dev monitoring, slow on very large stores)
    if (method === "GET" && path === "/api/admin/storage") {
      const namespaces = {
        TRACKER_DATA: env.TRACKER_DATA,
        GLOBAL_TEMPLATES: env.GLOBAL_TEMPLATES,
        GLOBAL_CLUBS: env.GLOBAL_CLUBS,
        GLOBAL_SUBMISSIONS: env.GLOBAL_SUBMISSIONS,
        GLOBAL_REWARDS: env.GLOBAL_REWARDS
      };
      const encoder = new TextEncoder();
      const result = [];

      for (const [name, kv] of Object.entries(namespaces)) {
        if (!kv) continue;

        let keys = 0;
        let bytes = 0;
        let largest = { key: null, bytes: 0 };
        let cursor;

        do {
          const page = await kv.list({ cursor });
          for (let i = 0; i < page.keys.length; i += 25) {
            const batch = page.keys.slice(i, i + 25);
            const values = await Promise.all(batch.map(k => kv.get(k.name)));
            values.forEach((v, idx) => {
              const size = v ? encoder.encode(v).length : 0;
              keys += 1;
              bytes += size;
              if (size > largest.bytes) largest = { key: batch[idx].name, bytes: size };
            });
          }
          cursor = page.list_complete ? undefined : page.cursor;
        } while (cursor);

        result.push({ namespace: name, keys, bytes, largest });
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // List all pending submissions
    if (method === "GET" && path === "/api/admin/pending/list") {
      const list = await env.GLOBAL_SUBMISSIONS.list();

      return new Response(
        JSON.stringify({
          keys: list.keys.map(k => k.name)
        }),
        {
          status: 200,
          headers: { ...cors(), "Content-Type": "application/json" }
        }
      );
    }

    // Delete ALL pending submissions
    if (method === "DELETE" && path === "/api/admin/pending/all") {
      const list = await env.GLOBAL_SUBMISSIONS.list();

      console.log("Deleting all pending submissions");

      for (const key of list.keys) {
        await env.GLOBAL_SUBMISSIONS.delete(key.name);
      }

      return new Response(
        JSON.stringify({ status: "all pending submissions cleared" }),
        {
          status: 200,
          headers: { ...cors(), "Content-Type": "application/json" }
        }
      );
    }

    if (method === "DELETE" && path === "/api/admin/pending/sports") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingSports/" });

      for (const key of list.keys) {
        await env.GLOBAL_SUBMISSIONS.delete(key.name);
      }

      return new Response(JSON.stringify({ status: "pending sports cleared" }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    if (method === "DELETE" && path === "/api/admin/pending/skills") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingSkills/" });

      for (const key of list.keys) {
        await env.GLOBAL_SUBMISSIONS.delete(key.name);
      }

      return new Response(JSON.stringify({ status: "pending skills cleared" }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    if (method === "DELETE" && path === "/api/admin/pending/categories") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingCategories/" });

      for (const key of list.keys) {
        await env.GLOBAL_SUBMISSIONS.delete(key.name);
      }

      return new Response(JSON.stringify({ status: "pending categories cleared" }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ---------------------------------------------------------
    // CHILD STATE ROUTES
    // ---------------------------------------------------------

    if (method === "GET" && path.startsWith("/api/state/")) {
      const childId = path.split("/")[3];
      const json = await env.TRACKER_DATA.get(`state:${childId}`);
      return new Response(json || "{}", { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }

    if (method === "PUT" && path.startsWith("/api/state/")) {
      const childId = path.split("/")[3];
      const body = await request.text();
      await env.TRACKER_DATA.put(`state:${childId}`, body);
      return new Response("OK", { status: 200, headers: cors() });
    }

    if (method === "DELETE" && path.startsWith("/api/state/")) {
      const childId = path.split("/")[3];
      await env.TRACKER_DATA.delete(`state:${childId}`);
      return new Response(JSON.stringify({ ok: true, deleted: childId }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ---------------------------------------------------------
    // FALLBACK
    // ---------------------------------------------------------
    return new Response("Not found", { status: 404, headers: cors() });
  }
};
