# CLAUDE.md

## Проект

VibeCoding — веб-приложение.

## Стек

- JavaScript/TypeScript
- Node.js
- Фреймворк фронтенда/бэкенда пока не выбран

## Кодстайл / линтер

Настроены ESLint + Prettier + TypeScript strict mode.

## Команды разработки

- `npm run build` — проверка типов (`tsc --noEmit`)
- `npm run lint` — ESLint
- `npm run format` — автоформатирование Prettier
- `npm run format:check` — проверка форматирования без изменений

## Структура

- `src/` — исходный код (точка входа: `src/index.ts`)

## Заметки для Claude Code

- Проект в самом начале разработки: есть только точка входа-заглушка, реальной архитектуры пока нет.
- Придерживаться единого стиля (ESLint + Prettier следят за этим автоматически).
