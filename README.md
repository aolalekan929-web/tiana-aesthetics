# Tiana Aesthetics

A mobile-first React storefront for girly essentials and cozy decor, with Naira pricing, a persistent shopping bag, bank-transfer instructions, WhatsApp checkout, product video previews, and an owner inventory dashboard.

## Run the project

Use Node.js 20.19 or newer (or 22.12 or newer), then run:

```bash
npm ci
npm run dev
```

Vite prints a local address to open in your browser. Create the production build with:

```bash
npm run build
```

The static production files are written to `dist/`.

## Deploy to Vercel

Import this project from GitHub and use the Vite preset, `npm run build` as the build command, and `dist` as the output directory. The project files and build configuration are at the repository root.

## Manage products

Open **Owner** in the header or **Owner Dashboard** above the catalog. The owner dashboard lets you remove the sample products, clear the catalog, add or edit products, set stock status, and choose multiple image or video files from your device. Uploaded media is stored in this browser’s IndexedDB; product details and bag contents are stored in local storage.

This is a client-side storefront. Owner access is a convenience gate rather than server-side authentication. Inventory and uploaded media remain on the browser/device where they were added, and do not automatically publish to other shoppers’ devices. A shared live catalog and private authentication require a backend or database.

## Checkout details

The bag shows its live total in Nigerian Naira. Customers can send their order and delivery fields to the configured WhatsApp chat or use **Confirm Bank Transfer** to add their delivery details to a WhatsApp message. The storefront does not process bank payments. Confirm the bank details, WhatsApp contact, delivery times, and return policy before launch.