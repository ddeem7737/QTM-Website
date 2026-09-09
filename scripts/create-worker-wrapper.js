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
    if (typeof app === 'function') {
      return await app(request, env, ctx);
    }
    if (app && typeof app.default === 'function') {
      return await app.default(request, env, ctx);
    }
    return new Response('Worker app not available', { status: 500 });
  }
};
`;

fs.writeFileSync(workerPath, wrapper, 'utf8');
console.log(`Created Worker wrapper at ${workerPath}`);
