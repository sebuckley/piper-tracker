function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors() });
    }

    // Health check
    if (path === "/" && method === "GET") {
      return new Response("Piper Tracker KV backend is running!", {
        status: 200,
        headers: { ...cors(), "Content-Type": "text/plain" }
      });
    }

    // ---------------------------------------------------------
    // USER ROUTES
    // ---------------------------------------------------------

    // GET /api/user/:uid
    if (method === "GET" && path.startsWith("/api/user/")) {
      const uid = path.split("/")[3];
      const json = await env.TRACKER_DATA.get(`user:${uid}`);
      return new Response(json || "{}", {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // PUT /api/user/:uid
    if (method === "PUT" && path.startsWith("/api/user/")) {
      const uid = path.split("/")[3];
      const body = await request.text();
      await env.TRACKER_DATA.put(`user:${uid}`, body);
      return new Response("OK", { status: 200, headers: cors() });
    }

    // DELETE /api/user/:uid
    if (method === "DELETE" && path.startsWith("/api/user/")) {
      const uid = path.split("/")[3];
      await env.TRACKER_DATA.delete(`user:${uid}`);
      return new Response(JSON.stringify({ ok: true, deleted: uid }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ---------------------------------------------------------
    // CHILD STATE ROUTES
    // ---------------------------------------------------------

    // GET /api/state/:childId
    if (method === "GET" && path.startsWith("/api/state/")) {
      const childId = path.split("/")[3];
      const json = await env.TRACKER_DATA.get(`state:${childId}`);
      return new Response(json || "{}", {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // PUT /api/state/:childId
    if (method === "PUT" && path.startsWith("/api/state/")) {
      const childId = path.split("/")[3];
      const body = await request.text();
      await env.TRACKER_DATA.put(`state:${childId}`, body);
      return new Response("OK", { status: 200, headers: cors() });
    }

    // DELETE /api/state/:childId
    if (method === "DELETE" && path.startsWith("/api/state/")) {
      const childId = path.split("/")[3];
      await env.TRACKER_DATA.delete(`state:${childId}`);
      return new Response(JSON.stringify({ ok: true, deleted: childId }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }

    // ---------------------------------------------------------

    return new Response("Not found", { status: 404, headers: cors() });
  }
};
