#!/usr/bin/env node
// Регистрирует у Telegram адрес вебхука для кнопок статуса заказа.
// Нужно запустить один раз (и заново — если поменяли домен/секрет).
//
//   npm run telegram:set-webhook -- https://paomma.luvsbaby.club/api/telegram/webhook
//
// Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_WEBHOOK_SECRET в .env — скрипт
// запускается через with-secrets.mjs (sops exec-env), сам файл не читает.

const url = process.argv[2];
if (!url) {
  console.error("Использование: npm run telegram:set-webhook -- <url вебхука>");
  process.exit(1);
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!token || !secret) {
  console.error(
    "TELEGRAM_BOT_TOKEN или TELEGRAM_WEBHOOK_SECRET не заданы в .env — добавьте их через sops перед запуском.",
  );
  process.exit(1);
}

const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url, secret_token: secret }),
});

const data = await res.json();

if (!res.ok || !data.ok) {
  console.error("Не удалось зарегистрировать вебхук:", data.description ?? data);
  process.exit(1);
}

console.log("Вебхук зарегистрирован:", data.description ?? "ok");
