import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "dist/**",
        "coverage/**",
        "eslint.config.js",
        "vitest.config.ts",
        "src/server.ts",
        "src/config/env.ts",
      ],
      thresholds: { branches: 80, functions: 90, lines: 90, statements: 90 },
    },
  },
});
