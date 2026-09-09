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

  // `vinext build` (used by `npm run build` for the Node/Hostinger target,
  // which `vinext start` then serves) and `vinext deploy` (Cloudflare
  // Workers) share this one config, but need incompatible settings: the
  // App Router's RSC code needs the "react-server" export condition when
  // bundled for Workers, but forcing that condition breaks the plain
  // Node output `vinext start` relies on. Scope it to `vinext deploy` only.
  const isVinextDeploy = process.argv.at(-1) === "deploy";

  return {
    ssr: {
      // @svg-maps/world is a CommonJS-only package (no "type": "module")
      // used exclusively by the "use client" QtmSite component. Bundling
      // it into the server/RSC output makes Vite's CJS interop wrapper
      // collide with vinext's own default export in the Cloudflare Worker
      // build stage ("Duplicated export 'default'"). Externalizing it
      // keeps it out of the server bundle entirely, same as `resend`.
      external: ["resend", "@svg-maps/world"],
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
      cloudflare({
        inspectorPort: false,
        config: localBindingConfig,
        ...(isVinextDeploy
          ? { viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] } }
          : {}),
      }),
    ],
  };
});
