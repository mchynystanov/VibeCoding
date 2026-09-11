import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paomma: {
          bg: "#FFF7F2",
          primary: "#E58A7A",
          primaryDark: "#C96B5B",
          text: "#3A2E2A",
        },
      },
    },
  },
  plugins: [],
};

export default config;
