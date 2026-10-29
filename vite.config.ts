import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { postsPlugin } from "./plugins/posts";
export default defineConfig({
  plugins: [react(), postsPlugin()],
  server: { host: "0.0.0.0" },
});
