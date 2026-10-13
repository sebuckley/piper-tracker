export const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://127.0.0.1:8787"
    : "https://piper-tracker-backend.yourdomain.workers.dev";
