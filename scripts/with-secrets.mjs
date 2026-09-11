#!/usr/bin/env node
/**
 * Запускает переданную команду (например `next dev` / `next start`) через
 * `sops exec-env .env -- <команда>`, если в корне проекта есть непустой
 * зашифрованный `.env`. Если `.env` отсутствует или пуст (например, при
 * чистой вёрстке без секретов) — запускает команду напрямую, без sops.
 *
 * Секреты этот скрипт НИКОГДА не читает и не печатает: он только проверяет
 * факт существования/размер файла `.env` (fs.existsSync/statSync), а
 * расшифровку и подстановку в окружение дочернего процесса делает сам sops
 * (`sops exec-env`), в обход этого скрипта.
 *
 * Использование (см. package.json):
 *   node scripts/with-secrets.mjs next dev
 *   node scripts/with-secrets.mjs next start
 */

import { existsSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: node scripts/with-secrets.mjs <command> [args...]");
  process.exit(1);
}

function hasUsableEnvFile() {
  if (!existsSync(envPath)) {
    return false;
  }
  try {
    return statSync(envPath).size > 0;
  } catch {
    return false;
  }
}

const useSops = hasUsableEnvFile();

function quoteArg(a) {
  // Minimal shell-safe quoting for cmd.exe/sh: wrap in double quotes if it
  // contains whitespace or quotes; escape embedded double quotes.
  if (/[\s"]/.test(a)) {
    return '"' + a.replace(/"/g, '\\"') + '"';
  }
  return a;
}

// sops exec-env expects exactly two positional args: [file] [command to run],
// where "command to run" must be ONE argv element (a whole command string),
// not a list of separately-quoted args after "--".
const innerCommand = args.map(quoteArg).join(" ");

const fullCommand = useSops
  ? `sops exec-env ${quoteArg(".env")} ${quoteArg(innerCommand)}`
  : innerCommand;

console.log(
  useSops
    ? "[with-secrets] .env найден — запускаю через: sops exec-env .env -- " + args.join(" ")
    : "[with-secrets] .env отсутствует или пуст — запускаю без sops: " + args.join(" ")
);

// Single full command string + shell:true (rather than an args array with
// shell:true) avoids Node's shell-array-escaping pitfalls/deprecation and
// matches how sops itself expects to receive the inner command.
const child = spawn(fullCommand, {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
});

child.on("error", (err) => {
  const shownCommand = useSops ? "sops" : args[0];
  console.error(
    `[with-secrets] Не удалось запустить "${shownCommand}": ${err.code ?? err.message}.` +
      (useSops
        ? " Убедитесь, что sops установлен и виден в PATH (см. ХРАНИТЕЛЬ.md)."
        : "")
  );
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
