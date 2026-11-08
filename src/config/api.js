export const DEV_API_BASE = "http://127.0.0.1:8787";
export const PRODUCTION_API_BASE = "https://piper-tracker-backend.sebuckley.workers.dev";

export const API_BASE =
  import.meta.env.MODE === "development" ? DEV_API_BASE : PRODUCTION_API_BASE;
