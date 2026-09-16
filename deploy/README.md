# Деплой Paomma Shop на VPS

Пошаговая инструкция для развёртывания сайта на собственном сервере
(Ubuntu 22.04) с привязкой домена. Все команды — в **вашем** терминале,
не через Claude Code: секреты (SSH-доступ, age-ключ) не должны попадать
в чат.

## Домен: план владельца

Основной домен — `luvsbaby.club`. На корне (`luvsbaby.club`/`www`)
будет отдельный одностраничный лендинг бренда LuvsBaby — отдельный
проект, не этот репозиторий, разворачивается отдельно (свой процесс в
pm2 на другом порту, свой блок в nginx, но тот же сервер и тот же
домен подойдут — расширим `deploy/`, когда та страница будет готова).

**Этот магазин (Paomma) живёт на поддомене** `paomma.luvsbaby.club` —
отдельная покупка домена не нужна, поддомены у уже купленного домена
бесплатны и их можно заводить сколько угодно.

## Предварительно нужно

- Купленный домен `luvsbaby.club` (любой регистратор).
- Арендованный VPS с Ubuntu 22.04 (у Timeweb Cloud — образ "Ubuntu 22.04").
- IP-адрес сервера и root-пароль/SSH-ключ (выдаст хостинг после аренды).
- Ваш age-ключ (`keys.txt`), которым сейчас шифруется `.env` локально —
  найдите его через `sops-keeper`/`secret-keeper`, если не помните путь
  (обычно `%APPDATA%\sops\age\keys.txt` на Windows).

## 1. DNS: привязать поддомен к серверу

У регистратора домена (или там, где управляете DNS-записями
`luvsbaby.club`) добавьте:

| Тип | Имя    | Значение            |
| --- | ------ | ------------------- |
| A   | paomma | IP-адрес вашего VPS |

Только поддомен `paomma` — корень (`@`) и `www` домена `luvsbaby.club`
не трогайте, они зарезервированы под будущую главную страницу бренда.
Обновление DNS может занять от нескольких минут до пары часов.

## 2. Подключиться к серверу и настроить его

```bash
ssh root@ВАШ_IP
```

На сервере — скопируйте `deploy/setup-server.sh` (можно через `scp` с
вашего компьютера, или создать файл прямо на сервере и вставить
содержимое) и запустите:

```bash
bash setup-server.sh
```

Ставит Node.js 20, nginx, certbot, sops, age, pm2.

## 3. Перенести age-ключ на сервер

**Это единственный секретный шаг** — ключ даёт доступ к расшифровке
`.env` (Telegram-токен и т.д.). Переносите его напрямую с вашего
компьютера на сервер, никогда не через чат:

```bash
# С вашего компьютера (Windows PowerShell):
scp "$env:APPDATA\sops\age\keys.txt" root@ВАШ_IP:/root/.config/sops/age/keys.txt
```

(создайте папку `/root/.config/sops/age/` на сервере заранее:
`mkdir -p /root/.config/sops/age/`)

## 4. Склонировать репозиторий и собрать проект

На сервере:

```bash
git clone https://github.com/ВАШ_GITHUB/VibeCoding.git paomma-shop
cd paomma-shop
npm install
npm run build
```

## 5. Запустить через pm2

```bash
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup   # выполнит команду, которую покажет — скопируйте и запустите её тоже
```

Проверить, что работает:

```bash
curl -I http://localhost:3000
```

Должно быть `HTTP/1.1 200 OK`.

## 6. Настроить nginx + домен

```bash
sudo cp deploy/nginx.conf.template /etc/nginx/sites-available/paomma
sudo nano /etc/nginx/sites-available/paomma   # замените YOUR_DOMAIN на paomma.luvsbaby.club
sudo ln -s /etc/nginx/sites-available/paomma /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Выпустить SSL-сертификат (https)

```bash
sudo certbot --nginx -d paomma.luvsbaby.club
```

(без `-d www...` — это поддомен, отдельный `www`-вариант ему не нужен).
Certbot сам допишет HTTPS в конфиг nginx и настроит автопродление
сертификата. Дальше сайт доступен по `https://paomma.luvsbaby.club`.

## Обновление сайта после новых изменений

Каждый раз, когда в репозитории появляются новые коммиты:

```bash
ssh root@ВАШ_IP
cd paomma-shop
git pull
npm install   # только если менялись зависимости
npm run build
pm2 restart paomma-shop
```

## Важно про данные админки

Файлы `data/product-overrides.json`, `data/reviews.json`,
`data/admin-credentials.json` живут **на диске сервера** и не
приходят из git (специально в `.gitignore`, см. `TODO.md`). При
`git pull`/пересборке они не трогаются — цены, отзывы и пароль
админки сохраняются. Но: если пересоздать сервер с нуля, эти файлы
нужно будет либо восстановить из бэкапа, либо настроить заново через
`/admin`.
