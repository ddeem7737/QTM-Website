# QTM Group Website — Deployment Guide

This package contains the complete source code and all local website assets for the QTM Group website, corresponding to published version 151.

## Technical requirements

- Node.js 22.13 or newer
- npm
- A host that supports a Node.js SSR application or Cloudflare Workers

Traditional PHP-only shared hosting cannot run this application directly. If the hosting account only supports WordPress/PHP, use a Node.js-capable VPS, managed Node host, or Cloudflare Workers instead.

## Included

- React and TypeScript application source
- Responsive CSS and animations
- All local images, logos, icons and favicons
- Route definitions and site content
- `package.json` and locked dependency versions
- Vite/Vinext and Cloudflare Worker configuration
- Production build and validation scripts

Dependency folders, temporary caches, credentials and Git history are intentionally excluded. They are regenerated securely during installation.

## Install and run

```bash
npm ci
npm run build
npm run start
```

For local development:

```bash
npm ci
npm run dev
```

## Production checklist

1. Upload and extract the package on the server.
2. Install Node.js 22.13 or newer.
3. Run `npm ci`.
4. Run `npm run build`.
5. Run `npm run start` using a process manager such as systemd or PM2.
6. Point the domain/reverse proxy to the application.
7. Enable HTTPS.
8. Confirm the contact-form delivery endpoint before accepting real inquiries.

## Important hosting note

The current website is built for a server-side React runtime. Do not upload only the `app` folder or only the HTML-looking assets. The full package and dependency installation are required.

## Domain

The existing `qtm-group.com` domain can remain registered with its current registrar. Only its DNS records need to be updated after the new hosting destination is ready.
