import app from './server/index.js';

export default {
  async fetch(request, env, ctx) {
    if (typeof app === 'function') {
      return await app(request, env, ctx);
    }
    if (app && typeof app.default === 'function') {
      return await app.default(request, env, ctx);
    }
    return new Response('Worker app not available', { status: 500 });
  }
};
