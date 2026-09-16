#!/usr/bin/env node
/**
 * Печатает scrypt-хэш пароля в формате "salt:hash" (оба — hex), готовый
 * для ADMIN_PASSWORD_HASH в .env. Пароль передаётся аргументом и никуда,
 * кроме stdout, не пишется.
 *
 * Использование: node scripts/hash-admin-password.mjs "мой-пароль"
 */

import { scryptSync, randomBytes } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "password"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log(`${salt}:${hash}`);
