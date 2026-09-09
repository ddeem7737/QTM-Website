/**
 * Cloudflare Worker entry point.
 * See vinext's README ("Cloudflare Workers" deployment section) for the
 * documented pattern. No image optimization is configured for this app
 * (no next/image usage), so this delegates everything to vinext directly.
 */
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handler.fetch(request, env, ctx);
  },
};
