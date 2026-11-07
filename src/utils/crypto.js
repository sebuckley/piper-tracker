// src/utils/crypto.js

export function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function importAesKey(rawKeyBytes) {
  return crypto.subtle.importKey(
    "raw",
    rawKeyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptPayload(data, rawKeyBytes) {
  const key = await importAesKey(rawKeyBytes);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    iv: Array.from(iv),
    cipher: Array.from(new Uint8Array(cipher))
  };
}

export async function decryptPayload(payload, rawKeyBytes) {
  const key = await importAesKey(rawKeyBytes);
  const iv = new Uint8Array(payload.iv);
  const cipher = new Uint8Array(payload.cipher);

  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipher
  );

  return JSON.parse(new TextDecoder().decode(plain));
}
