# Tiana Aesthetics

A responsive React storefront for girly essentials and cozy decor. It includes product filters, a persistent shopping bag, WhatsApp ordering and transfer handoff, a video gallery, FAQs, newsletter interaction, and a PIN-gated owner dashboard.

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local address shown by Vite (usually `http://localhost:4173`).
Vite 8 requires Node.js 20.19+ or 22.12+.

## Build and preview

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`. The Vite base path is relative so the build can be hosted from a GitHub Pages project path as well as at a domain root.

## Deploy

Push this project to a GitHub repository. For GitHub Pages or another static host, build the project and publish the `dist/` directory. Vercel and Netlify can also build it with `npm run build` and use `dist` as the output directory. No paid service or custom domain is required.

## Owner and checkout notes

- The Owner Dashboard PIN is `1234`. It is a client-side convenience gate, not server security.
- Inventory, stock status, images, videos, and the shopping bag are stored in the current browser's local storage. Changes made in one browser do not sync to other customers or devices; a shared live catalog requires a database/backend.
- The WhatsApp contact uses `https://wa.me/2348157040998`. Orders and delivery details are passed to WhatsApp only when the shopper chooses to continue.
- Bank transfer instructions are for Opay, account name **Tiana Aesthetics**, account number **8157040998**. The site does not process or verify payments.
- Product photos, fonts, and sample video use public external URLs; replace them with the store's own media before launch.
