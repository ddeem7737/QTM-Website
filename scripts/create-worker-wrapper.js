#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const serverPath = path.join(projectRoot, 'dist/server/index.js');
const workerPath = path.join(projectRoot, 'dist/worker.js');

if (!fs.existsSync(serverPath)) {
  console.error(`Error: ${serverPath} not found`);
  process.exit(1);
}

const wrapper = `import app from './server/index.js';

console.log('Worker loaded, app type:', typeof app, 'app.default type:', app?.default ? typeof app.default : 'undefined');

export default {
  async fetch(request, env, ctx) {
    try {
      console.log('Fetch request:', request.method, request.url);

      // Try different ways to invoke the app
      if (typeof app === 'function') {
        console.log('Calling app as function');
        return await app(request, env, ctx);
      }
      if (app?.default && typeof app.default === 'function') {
        console.log('Calling app.default as function');
        return await app.default(request, env, ctx);
      }
      if (app?.default?.fetch && typeof app.default.fetch === 'function') {
        console.log('Calling app.default.fetch');
        return await app.default.fetch(request, env, ctx);
      }
      if (app?.fetch && typeof app.fetch === 'function') {
        console.log('Calling app.fetch');
        return await app.fetch(request, env, ctx);
      }

      console.error('No handler found. App:', Object.keys(app || {}), 'App.default:', app?.default ? Object.keys(app.default) : 'undefined');
      return new Response('Worker app handler not found', { status: 500 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(\`Error: \${error instanceof Error ? error.message : String(error)}\`, { status: 500 });
    }
  }
};
`;

fs.writeFileSync(workerPath, wrapper, 'utf8');
console.log(`Created Worker wrapper at ${workerPath}`);
