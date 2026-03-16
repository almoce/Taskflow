import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  base: "/Taskflow/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "vendor-react",
              test: /node_modules[\\/]react/,
              priority: 50,
            },
            {
              name: "vendor-d3",
              test: /node_modules[\\/]d3/,
              priority: 45,
            },
            {
              name: "vendor-motion",
              test: /node_modules[\\/](framer-motion|@dnd-kit)/,
              priority: 40,
            },
            {
              name: "vendor",
              test: /node_modules/,
              priority: 30,
            },
            {
              name: "landing",
              test: /src\/(pages\/Index|components\/landing)/,
              priority: 20,
            },
            {
              name: "core",
              test: /src/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
  },
}));
