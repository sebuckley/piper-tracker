import { decryptPayload, encryptPayload } from "./crypto";

const arrayFields = [
  "sportsClasses", "behaviourLogs", "achievements", "rewards",
  "routines", "rewardLogs", "sportsFeedback"
];

export function isLegacyTrackerState(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    !Object.hasOwn(value, "payload") &&
    arrayFields.every(field => Array.isArray(value[field])) &&
    typeof value.starBalance === "number" && Number.isFinite(value.starBalance);
}

export async function hashText(text) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function prepareLegacyMigration(state, key) {
  if (!isLegacyTrackerState(state)) throw new Error("Unrecognized legacy tracker format");
  const payload = await encryptPayload(state, key);
  const verified = await decryptPayload(payload, key);
  if (JSON.stringify(verified) !== JSON.stringify(state)) {
    throw new Error("Migration encryption verification failed");
  }
  return payload;
}
