// eslint.config.mjs
// (Copy & Paste - วางทับไฟล์เดิมได้เลย)
// SECTION: Imports
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginNext from "@next/eslint-plugin-next";

// SECTION: Setup Compatibility Layer
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  // Recommended: Use recommended configs as base
  // We'll extend specific framework configs below
});

// SECTION: Configuration Array
export default tseslint.config(
  // Base recommended rules
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended, // TypeScript recommended

  // Next.js Core Web Vitals (already present in your config)
  // Ensure the plugin object is correctly accessed if needed directly
  // Adjust based on how @next/eslint-plugin-next exports its configs in Flat Config
  {
    plugins: {
      "@next/next": eslintPluginNext,
    },
    rules: {
      ...eslintPluginNext.configs.recommended.rules,
      ...eslintPluginNext.configs["core-web-vitals"].rules,
      // Example: Disable specific Next.js rule if needed
      // "@next/next/no-img-element": "off",
    },
  },

  // React Specific Configs
  {
    files: ["**/*.{ts,tsx}"], // Target TypeScript/TSX files
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      "jsx-a11y": eslintPluginJsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser, // Add browser globals
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
    rules: {
      // React Recommended Rules
      ...eslintPluginReact.configs.recommended.rules,
      // React Hooks Rules
      ...eslintPluginReactHooks.configs.recommended.rules,
      // JSX A11y Recommended Rules
      ...eslintPluginJsxA11y.configs.recommended.rules,

      // === Custom Rules & Overrides ===
      "react/prop-types": "off", // Disable prop-types rule, rely on TypeScript
      "react/react-in-jsx-scope": "off", // Not needed with Next.js/React 17+
      "react/jsx-uses-react": "off", // Not needed with Next.js/React 17+
      "react-hooks/exhaustive-deps": "warn", // Warn about missing useEffect dependencies

      // Example: Enforce specific import order (using a compatible plugin if desired)
      // "import/order": ["warn", { "groups": ["builtin", "external", "internal", "parent", "sibling", "index"], "newlines-between": "always" }],

      // Example: Prefer const over let if variable is not reassigned
      "prefer-const": "warn",

      // TypeScript specific adjustments
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Allow unused vars starting with _
      "@typescript-eslint/no-explicit-any": "warn", // Warn against using 'any'

      // Add other specific rules based on team preference
      // e.g., naming conventions, complexity limits, etc.
    },
  },

  // Global Ignores
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "build/",
      "next-env.d.ts",
      "**/*.config.js", // Ignore config files if necessary
      "**/*.config.mjs",
      "postcss.config.mjs", // Ignore PostCSS config
      "tailwind.config.js", // Ignore Tailwind config
    ],
  },
);
