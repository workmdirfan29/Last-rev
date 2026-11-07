/// <reference types="vitest/config" />
import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    include: ["src/**/*.test.{ts,tsx}"],
    // Journey tests render whole pages and load lazily split routes; they are legitimately heavy.
    // Vitest's on-disk transform cache is keyed on a file's own content. `import.meta.glob` (the question loaders)
    // depends on which files exist, so a new question folder left a stale loader behind and the content gate
    // passed or failed depending on the cache. Correctness over speed: transform fresh every run.
    fsModuleCache: false,
    testTimeout: 30000,
    hookTimeout: 30000,
  },
})
