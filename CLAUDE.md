# CLAUDE.md

## Проект

Paomma Shop — одностраничный интернет-магазин (лендинг с корзиной) для 3
товаров бренда Paomma (молокоотсосы, стерилизатор). Заявки с сайта уходят
автоматически в Telegram и Google Sheets, без CRM и без ручной обработки.
Онлайн-оплаты нет — оплата при получении. Полное ТЗ: см. `TODO.md` и историю
проекта (изначальный файл ТЗ хранился вне репозитория).

## Стек

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- React Hook Form + Zod (валидация — одна схема для клиента и сервера)
- Zustand (стор корзины, persist в localStorage)
- Telegram Bot API + Google Sheets (`google-spreadsheet`) — двойной канал
  приёма заказов, ни один не должен быть единой точкой отказа

## Кодстайл / линтер

ESLint (включая `@next/eslint-plugin-next`) + Prettier + TypeScript strict
mode. Хук в `.claude/settings.json` автоматически форматирует файлы после
записи/правки.

## Команды разработки

- `npm run dev` — локальный сервер разработки. Обёрнут в
  `scripts/with-secrets.mjs`: если в корне есть непустой зашифрованный `.env`,
  запускается через `sops exec-env .env -- next dev` (секреты идут только в
  переменные окружения процесса next, на диск в открытом виде не попадают и
  никуда не печатаются); если `.env` нет/пуст — обычный `next dev` без sops
  (для чистой вёрстки без интеграций). Подробности — `README.md`.
- `npm run build` — прод-сборка, `next build` напрямую (сейчас секреты на
  этапе сборки не нужны — см. README про `NEXT_PUBLIC_*` на будущее).
- `npm run start` — прод-запуск, обёрнут так же, как `dev` (нужен доступ к
  `TELEGRAM_*`/`GOOGLE_*` в рантайме для `api/order/route.ts`).
- `npm run typecheck` — проверка типов (`tsc --noEmit`)
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier

## Структура

- `src/app/` — роуты App Router (`page.tsx`, `layout.tsx`, `api/order/route.ts`)
- `src/components/` — React-компоненты секций страницы
- `src/data/products.ts` — каталог товаров (единственный источник правды)
- `src/lib/` — бизнес-логика: `schemas.ts` (Zod), `pricing.ts` (скидка за
  бандл), `quiz.ts` (подборщик), `cart-store.ts`, `telegram.ts`,
  `googleSheets.ts`, `rateLimit.ts`
- `public/products/` — изображения товаров

## Секреты

`.env` — реальные значения (Telegram-токен, Google service account ключ)
НЕ создаются напрямую в основном чате: делегируются субагенту
`secret-keeper` (см. глобальный `~/.claude/CLAUDE.md`). `.env.example`
содержит только имена переменных. `.env` хранится зашифрованным (sops+age);
запуск с расшифровкой на лету — через `scripts/with-secrets.mjs`
(см. `npm run dev`/`npm run start` выше и `README.md`). Подробнее о картe
секретов — `ХРАНИТЕЛЬ.md`.

## Заметки для Claude Code

- Открытые вопросы к владельцу (доставка, скидка на бандл, юр. реквизиты и
  т.п.) зафиксированы в `TODO.md` — не блокировать разработку, ставить
  плейсхолдеры с `// TODO(owner): ...`.
- Порядок блоков на странице (`src/app/page.tsx`) фиксирован — менять только
  по явному запросу.
