import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  // Plugin to wrap server output with Worker fetch handler
  const wrapperPlugin = {
    name: "worker-wrapper",
    apply: "build",
    async writeBundle() {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");

      const serverPath = path.join(process.cwd(), "dist/server/index.js");
      const workerPath = path.join(process.cwd(), "dist/worker.js");

      try {
        // Copy server as worker if it doesn't have fetch handler
        const content = await fs.readFile(serverPath, "utf8");
        if (!content.includes("fetch")) {
          const wrapper = `
import app from './server/index.js';

export default {
  async fetch(request, env, ctx) {
    if (typeof app === 'function') {
      return await app(request, env, ctx);
    }
    return new Response('App not available', { status: 500 });
  }
};
`;
          await fs.writeFile(workerPath, wrapper);
        }
      } catch (error) {
        console.error("Failed to create worker wrapper:", error);
      }
    },
  };

  return {
    ssr: {
      external: ["resend"],
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      vinext(),
      sites(),
      wrapperPlugin,
      cloudflare({
        inspectorPort: false,
        config: localBindingConfig,
      }),
    ],
  };
});
