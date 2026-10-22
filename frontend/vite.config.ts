import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

/**
 * Vite configuration for Occasio frontend.
 * Configures React, Tailwind CSS v4, manualChunk isolation for Three.js, and ES2022 target.
 */
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@occasio/shared": path.resolve(__dirname, "../shared/src/index.ts"),
    },
  },
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("three") || id.includes("@react-three")) {
            return "vendor-three";
          }
        },
      },
    },
  },
});
