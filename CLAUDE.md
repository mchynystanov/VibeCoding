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

- `npm run dev` — локальный сервер разработки
- `npm run build` / `npm run start` — прод-сборка и запуск
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
содержит только имена переменных.

## Заметки для Claude Code

- Открытые вопросы к владельцу (доставка, скидка на бандл, юр. реквизиты и
  т.п.) зафиксированы в `TODO.md` — не блокировать разработку, ставить
  плейсхолдеры с `// TODO(owner): ...`.
- Порядок блоков на странице (`src/app/page.tsx`) фиксирован — менять только
  по явному запросу.
