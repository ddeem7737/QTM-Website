import app from './server/index.js';

export default {
  async fetch(request, env, ctx) {
    try {
      // vinext RSC handler - just pass the request
      if (typeof app === 'function') {
        return await app(request);
      }

      // If app is an object with default as function
      if (app?.default && typeof app.default === 'function') {
        return await app.default(request);
      }

      return new Response('App handler not available', { status: 500 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(`Error: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
    }
  }
};
