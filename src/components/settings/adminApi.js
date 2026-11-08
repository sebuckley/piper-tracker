import { DEV_API_BASE, PRODUCTION_API_BASE } from "../../config/api";

export function getAdminEnvironment(search) {
  const value = new URLSearchParams(search).get("environment");
  if (value !== null && value !== "development" && value !== "production") {
    return { environment: "", apiBase: "", query: "", invalid: true };
  }
  const environment = value || "development";
  return {
    environment,
    apiBase: environment === "production" ? PRODUCTION_API_BASE : DEV_API_BASE,
    query: `?environment=${environment}`
  };
}

export async function adminRequest(apiBase, path, options) {
  const response = await fetch(`${apiBase}${path}`, options);
  if (!response.ok) {
    throw new Error(`${options?.method || "GET"} ${path} failed (HTTP ${response.status}).`);
  }
  return response;
}

export async function getAdminList(apiBase, path, signal) {
  const response = await adminRequest(apiBase, path, { signal });
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error(`${path} returned an invalid list.`);
  return data;
}
