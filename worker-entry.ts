import app from './dist/server/index.js';

export default {
  async fetch(request: Request, env: any, ctx: any) {
    try {
      // Call the vinext app handler
      if (typeof app === 'function') {
        return await app(request, env, ctx);
      }
      if (app && typeof app.fetch === 'function') {
        return await app.fetch(request, env, ctx);
      }
      if (app && typeof app.default === 'function') {
        return await app.default(request, env, ctx);
      }
      if (app && app.default && typeof app.default.fetch === 'function') {
        return await app.default.fetch(request, env, ctx);
      }

      return new Response('Worker handler not configured', { status: 500 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
  }
};
