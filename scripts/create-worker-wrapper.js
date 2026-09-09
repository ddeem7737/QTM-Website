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
      return new Response(\`Error: \${error instanceof Error ? error.message : String(error)}\`, { status: 500 });
    }
  }
};
`;

fs.writeFileSync(workerPath, wrapper, 'utf8');
console.log(`Created Worker wrapper at ${workerPath}`);
