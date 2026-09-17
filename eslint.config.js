import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    // Node-скрипты вне src/ (например, scripts/with-secrets.mjs, deploy/ecosystem.config.cjs) — не браузерный код.
    files: ["scripts/**/*.mjs", "deploy/**/*.cjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        Buffer: "readonly",
        fetch: "readonly",
      },
    },
  },
  eslintConfigPrettier,
  {
    ignores: ["dist/", ".next/", "node_modules/", "next-env.d.ts"],
  },
);
