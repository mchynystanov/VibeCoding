import { scryptSync, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "paomma_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 часов

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET не задан в .env (см. ХРАНИТЕЛЬ.md)");
  }
  return secret;
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Buffer.from(signature).toString("hex");
}

/** Проверяет логин/пароль против ADMIN_USERNAME/ADMIN_PASSWORD_HASH из .env. */
export function verifyCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUsername || !passwordHash) {
    throw new Error("ADMIN_USERNAME/ADMIN_PASSWORD_HASH не заданы в .env (см. ХРАНИТЕЛЬ.md)");
  }

  const usernameOk =
    username.length === expectedUsername.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(expectedUsername));

  const [salt, hash] = passwordHash.split(":");
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  const passwordOk = candidate.length === expected.length && timingSafeEqual(candidate, expected);

  return usernameOk && passwordOk;
}

/** Подписывает сессионный токен вида "<expiresAtMs>.<hmac>". */
export async function signSession(): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const signature = await hmac(getSessionSecret(), `admin:${expiresAt}`);
  return `${expiresAt}.${signature}`;
}

/** Проверяет токен из cookie: подпись и срок действия. */
export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!expiresAt || !signature || Date.now() > expiresAt) return false;

  const expected = await hmac(getSessionSecret(), `admin:${expiresAt}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
