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
        },
      },
    },
  },
  plugins: [],
};

export default config;
