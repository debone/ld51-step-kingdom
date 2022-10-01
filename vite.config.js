import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";

let host;

if (process.env.GITPOD_WORKSPACE_URL) {
  console.log("Running from gitpod.io, making URLs from proxy", process.env.GITPOD_WORKSPACE_URL);
  const { host: gitpodHost } = new URL(process.env.GITPOD_WORKSPACE_URL);
  host = gitpodHost;
} else {
  host = "localhost";
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  define: {
    __GITPOD_WORKSPACE_URL__: JSON.stringify(host),
  },
  build: {
    assetsInlineLimit: 0,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    hmr: {
      clientPort: 443,
    },
  },
});
