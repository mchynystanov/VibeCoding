import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paomma: {
          bg: "#FAF5EE",
          surface: "#EFE6D8",
          ink: "#2B2621",
          inkMuted: "#6B6259",
          line: "#D8CBB8",
          // Заливка основных CTA-кнопок (В корзину / Купить / Оформить заказ)
          // — контраст с белым текстом 5.18:1, проходит WCAG AA с запасом.
          accent: "#C2410C",
          accentDark: "#9A3410",
          // Кнопка "Подробнее" (вторичный CTA) — контраст с ink-текстом 8.3:1.
          rose: "#E8B4B8",
          roseDark: "#DC9CA1",
        },
      },
    },
  },
  plugins: [],
};

export default config;
