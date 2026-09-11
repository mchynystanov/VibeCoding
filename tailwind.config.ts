import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paomma: {
          bg: "#FFF7F2",
          // Светлый акцент — только для фонов-подложек (/10, /15) и рамок,
          // НЕ для белого текста поверх (контраст с белым ~2.5:1, ниже AA).
          primary: "#E58A7A",
          // Основной цвет кнопок/бейджей с белым текстом — контраст с белым
          // ~5.8:1, проходит WCAG AA (раздел 14 ТЗ).
          primaryDark: "#A24B3D",
          primaryDarker: "#7D3A2F",
          text: "#3A2E2A",
        },
      },
    },
  },
  plugins: [],
};

export default config;
