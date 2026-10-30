import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs so the build works from any subpath, e.g.
  // https://<user>.github.io/web-app-task-management-project/
  base: "./",
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
