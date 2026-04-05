import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact, { rules } from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
