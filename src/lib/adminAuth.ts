import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import path from "node:path";

export const ADMIN_SESSION_COOKIE = "paomma_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 часов

const credentialsPath = path.join(process.cwd(), "data", "admin-credentials.json");

type AdminCredentials = {
  username: string;
  passwordHash: string; // формат "salt:hash" (hex)
  sessionSecret: string;
};

/**
 * Логин/пароль админки хранятся в отдельном файле на диске сервера
 * (гитигнорится, как data/product-overrides.json и data/reviews.json) —
 * НЕ в .env. Пока файла нет, /admin открыт без пароля и предлагает его
 * задать (первый заход) — это устраняет необходимость вручную заводить
 * секреты через sops для одной локальной админ-панели.
 */
export async function getAdminCredentials(): Promise<AdminCredentials | null> {
  try {
    const raw = await readFile(credentialsPath, "utf-8");
    return JSON.parse(raw) as AdminCredentials;
  } catch {
    return null;
  }
}

/** Задаёт/меняет логин и пароль. Секрет сессии генерируется один раз и
 * ротируется при каждой смене пароля (старые сессии инвалидируются). */
export async function setAdminCredentials(username: string, password: string): Promise<void> {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  const credentials: AdminCredentials = {
    username,
    passwordHash: `${salt}:${hash}`,
    sessionSecret: randomBytes(32).toString("hex"),
  };
  await mkdir(path.dirname(credentialsPath), { recursive: true });
  await writeFile(credentialsPath, JSON.stringify(credentials, null, 2) + "\n", "utf-8");
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

/** Проверяет логин/пароль против сохранённых в data/admin-credentials.json. */
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const creds = await getAdminCredentials();
  if (!creds) return false;

  const usernameOk =
    username.length === creds.username.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(creds.username));

  const [salt, hash] = creds.passwordHash.split(":");
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  const passwordOk = candidate.length === expected.length && timingSafeEqual(candidate, expected);

  return usernameOk && passwordOk;
}

/** Подписывает сессионный токен вида "<expiresAtMs>.<hmac>". */
export async function signSession(): Promise<string | null> {
  const creds = await getAdminCredentials();
  if (!creds) return null;
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const signature = await hmac(creds.sessionSecret, `admin:${expiresAt}`);
  return `${expiresAt}.${signature}`;
}

/** Проверяет токен из cookie: подпись и срок действия. */
export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const creds = await getAdminCredentials();
  if (!creds) return false;

  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!expiresAt || !signature || Date.now() > expiresAt) return false;

  const expected = await hmac(creds.sessionSecret, `admin:${expiresAt}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
