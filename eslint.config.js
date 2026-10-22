import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

/**
 * Root ESLint flat configuration for Occasio monorepo.
 * Enforces strict type checking, accessibility, line limits, and forbidden dependencies.
 */
export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/.vite/**",
      "agent-pack/**",
      "files /**",
    ],
  },
  js.configs.recommended,
  {
    files: ["frontend/src/**/*.{ts,tsx}", "shared/src/**/*.{ts,tsx}"],
    extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...jsxA11y.configs.strict.rules,
      "max-lines": [
        "error",
        {
          max: 250,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-lines-per-function": [
        "error",
        {
          max: 60,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      complexity: ["error", 12],
      "no-console": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "framer-motion",
              message: "Use 'motion/react' instead of 'framer-motion' per M03.",
            },
            {
              name: "react-router-dom",
              message: "Use 'react-router' instead of 'react-router-dom' per M03.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**", "**/src/test/**"],
    rules: {
      "max-lines-per-function": "off",
    },
  },
  {
    files: ["*.config.ts", "**/*.config.ts"],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
      "max-lines-per-function": "off",
      complexity: ["error", 15],
    },
  }
);
