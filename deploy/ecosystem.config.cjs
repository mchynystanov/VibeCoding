// Конфиг pm2 — держит сайт запущенным и перезапускает при сбое/перезагрузке
// сервера. Запуск (из корня проекта на сервере):
//
//   pm2 start deploy/ecosystem.config.cjs
//   pm2 save                # запомнить на будущее
//   pm2 startup             # автозапуск pm2 при перезагрузке сервера (одна команда, см. вывод)
//
// npm run start уже обёрнут в scripts/with-secrets.mjs — секреты берутся
// из зашифрованного .env через sops, отдельно настраивать не нужно.
module.exports = {
  apps: [
    {
      name: "paomma-shop",
      cwd: __dirname + "/..",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
};
