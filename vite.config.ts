import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  server: {
    // User screenshots saved into the project root are frequently locked while
    // being written; watching them crashes the dev server with EBUSY.
    watch: { ignored: ["**/Screenshot*.png"] },
  },
  build: {
    target: "es2020",
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("postprocessing")) return "postfx-vendor";
          if (id.includes("gsap") || id.includes("lenis")) return "motion-vendor";
          return "vendor";
        },
      },
    },
  },
});
