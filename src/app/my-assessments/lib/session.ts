/*
  Secure localStorage session management for my-assessments
  - Encrypts session payload per-phone using AES-GCM (Web Crypto)
  - Avoids storing raw phone numbers by hashing for the storage key
  - Configurable expiry between 7–14 days via NEXT_PUBLIC_SESSION_EXPIRY_DAYS
*/

// Guard for SSR
const isBrowser = typeof window !== "undefined" && typeof window.crypto !== "undefined";

const PEPPER = "okmobile::myassessments::pepper::v1"; // harmless obfuscation constant
const STORAGE_PREFIX = "okmobile:myassessments";
const LAST_PHONE_KEY = `${STORAGE_PREFIX}:lastPhone`;

export type CachedSession = {
  phoneNumber: string;
  verifiedAt: number; // epoch ms
  expiresAt: number; // epoch ms
  version: 1;
};

type EncryptedRecord = {
  v: 1;
  cipher: string; // base64
  iv: string; // base64
  salt: string; // base64
  expiresAt: number; // epoch ms
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function getSessionExpiryDays(): number {
  const def = 7; // default 7 days
  if (!isBrowser) return def;
  const envVal = (process.env.NEXT_PUBLIC_SESSION_EXPIRY_DAYS || "").trim();
  const parsed = parseInt(envVal, 10);
  if (Number.isFinite(parsed)) return clamp(parsed, 7, 14);
  return def;
}

// text/binary helpers
const te = new TextEncoder();
function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function fromBase64(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await window.crypto.subtle.digest("SHA-256", te.encode(input));
  const bytes = new Uint8Array(digest);
  return Array.prototype.map
    .call(bytes, (b: number) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function deriveKey(passphrase: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    te.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 120_000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function sessionStorageKeyForPhone(phoneNumber: string): Promise<string> {
  const hash = await sha256Hex(`${PEPPER}|${phoneNumber}`);
  return `${STORAGE_PREFIX}:v1:${hash}`;
}

async function encryptSession(phoneNumber: string, payload: CachedSession): Promise<EncryptedRecord> {
  const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(`${PEPPER}|${phoneNumber}`, saltBytes.buffer);
  const encoded = te.encode(JSON.stringify(payload));
  const cipherBuf = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return {
    v: 1,
    cipher: toBase64(cipherBuf),
    iv: toBase64(iv.buffer),
    salt: toBase64(saltBytes.buffer),
    expiresAt: payload.expiresAt,
  };
}

async function decryptSession(phoneNumber: string, record: EncryptedRecord): Promise<CachedSession> {
  const saltBuf = fromBase64(record.salt);
  const iv = new Uint8Array(fromBase64(record.iv));
  const key = await deriveKey(`${PEPPER}|${phoneNumber}`, saltBuf);
  const cipherBuf = fromBase64(record.cipher);
  const plainBuf = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipherBuf);
  const json = new TextDecoder().decode(plainBuf);
  return JSON.parse(json) as CachedSession;
}

export async function setVerifiedSession(phoneNumber: string): Promise<void> {
  if (!isBrowser) return;
  const now = Date.now();
  const expiresDays = getSessionExpiryDays();
  const expiresAt = now + expiresDays * 24 * 60 * 60 * 1000;
  const payload: CachedSession = {
    phoneNumber,
    verifiedAt: now,
    expiresAt,
    version: 1,
  };
  const record = await encryptSession(phoneNumber, payload);
  const key = await sessionStorageKeyForPhone(phoneNumber);
  window.localStorage.setItem(key, JSON.stringify(record));
}

export async function getVerifiedSession(phoneNumber: string): Promise<CachedSession | null> {
  if (!isBrowser) return null;
  const key = await sessionStorageKeyForPhone(phoneNumber);
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    const record = JSON.parse(raw) as EncryptedRecord;
    if (!record?.expiresAt || record.expiresAt < Date.now()) {
      // expired; clear
      window.localStorage.removeItem(key);
      return null;
    }
    const payload = await decryptSession(phoneNumber, record);
    // additional guard on payload.expiresAt
    if (!payload?.expiresAt || payload.expiresAt < Date.now()) {
      window.localStorage.removeItem(key);
      return null;
    }
    return payload;
  } catch (e) {
    // corrupted; clear
    window.localStorage.removeItem(key);
    return null;
  }
}

export async function hasValidSession(phoneNumber: string): Promise<boolean> {
  const sess = await getVerifiedSession(phoneNumber);
  return !!sess;
}

export async function clearSession(phoneNumber: string): Promise<void> {
  if (!isBrowser) return;
  const key = await sessionStorageKeyForPhone(phoneNumber);
  window.localStorage.removeItem(key);
}

export function clearAllSessions(): void {
  if (!isBrowser) return;
  const prefix = `${STORAGE_PREFIX}:v1:`;
  const keysToRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i) || "";
    if (k.startsWith(prefix)) keysToRemove.push(k);
  }
  keysToRemove.forEach((k) => window.localStorage.removeItem(k));
}

// last phone helpers (non-sensitive)
export function persistLastPhone(phoneNumber: string): void {
  if (!isBrowser) return;
  window.localStorage.setItem(LAST_PHONE_KEY, phoneNumber);
}

export function loadLastPhone(): string | null {
  if (!isBrowser) return null;
  const v = window.localStorage.getItem(LAST_PHONE_KEY);
  return v || null;
}