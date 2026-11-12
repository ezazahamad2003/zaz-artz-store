# ZAZ ARTZ

Custom printed clothing store: tees, heavyweights, hoodies, crewnecks, joggers, camp shirts and matching PJ sets, personalized by the customer with text, photo uploads or AI-generated artwork. Everything runs on Microsoft Azure.

Live site: https://zaz-artz.azurewebsites.net

## What is in the box

| Area | Details |
| --- | --- |
| Storefront | Next.js 16 (App Router) in `web/`, Tailwind 4, classic red-and-white theme (DM Serif Display + Inter) |
| Catalog | 10 garments, 17 colors, 10 trend-researched collections, 87 templates with personalization fields (`web/src/lib/catalog.ts`) |
| Studio | `/studio`: text layers (19 fonts, outline, curve, rotate), photo upload, AI generate, AI photo restyle, drag-to-position on an SVG garment mockup, front and back |
| Product pages | `/products/[slug]`: live personalized preview, garment, color and size switch, "customize further" into the studio |
| Cart and checkout | localStorage cart, server-side price recomputation, 15% off automatically at 10+ items, free shipping over $75 |
| Payments | Stripe Checkout when `STRIPE_SECRET_KEY` is set; otherwise orders are saved as `pending_payment` for a manual payment link |
| Admin | `/admin` (enter `ADMIN_KEY`): orders list, revenue, status changes, links to print JSON and preview PNG |
| AI | Azure OpenAI: `gpt-image-1-mini` deployment `zaz-image` for artwork, `gpt-5-mini` deployment `zaz-text` for slogans |
| Data | Azure Cosmos DB (serverless) `zaz-artz-db`, database `zaz`, containers `designs`, `orders`, `products` (partition key `/pk`) |
| Files | Azure Blob Storage `zazartzstore`: `designs` (AI output and previews), `uploads` (customer photos), `products` (template artwork) |

## Azure resources (resource group `zaz-artz`, East US 2)

- App Service plan `zaz-artz-plan` (Linux B1) and web app `zaz-artz`
- Cosmos DB `zaz-artz-db` (serverless, NoSQL)
- Storage account `zazartzstore`
- Azure OpenAI `zaz-artz-openai` with deployments `zaz-image` (gpt-image-1-mini, 6 capacity) and `zaz-text` (gpt-5-mini)

All connection strings and keys are stored as App Service application settings. The same values live in `web/.env.local` for local development (git-ignored).

## Run locally

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000. Without `.env.local` the app still runs: designs and orders go to memory, AI is disabled.

## Deploy

Deploys run on GitHub Actions from the private repo `ezazahamad2003/zaz-artz-store`. Every push to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml) on a Linux runner:

1. `npm ci`, `next typegen`, typecheck and lint in `web/`
2. `next build` (output: standalone)
3. Bundle `.next/standalone` + `.next/static` + `public`
4. Zip-deploy to App Service `zaz-artz` with `azure/webapps-deploy@v3`, authenticated by the `AZURE_WEBAPP_PUBLISH_PROFILE` repo secret
5. Smoke test `/api/health` and `/`

A deploy takes a few minutes and never touches your machine. The workflow can also be started by hand from the Actions tab (workflow_dispatch). Oryx is disabled, so nothing is built on the server. The App Service startup command is `if [ -f server.js ]; then node server.js; else npm start; fi`, so it runs the standalone bundle from Actions and the `npm start` layout from the manual script alike. To rotate the secret:

```bash
az webapp deployment list-publishing-profiles -n zaz-artz -g zaz-artz --xml | gh secret set AZURE_WEBAPP_PUBLISH_PROFILE -R ezazahamad2003/zaz-artz-store
```

### Manual fallback

```bash
cd web
npm run deploy
```

`web/scripts/deploy.sh` type-checks, lints, builds locally, installs Linux x64 production dependencies into a temp folder, zips the bundle and pushes it with `az webapp deploy`. It is slow from a OneDrive folder; prefer pushing to `main`.

## Regenerate template artwork

```bash
cd web
npm run seed            # only missing artworks
npm run seed -- --force # all
```

Artwork URLs are written to `web/src/lib/generated-images.json`.

## Turning on payments

1. Create a Stripe account, copy the secret key.
2. `az webapp config appsettings set -n zaz-artz -g zaz-artz --settings STRIPE_SECRET_KEY=sk_live_...`
3. Add a webhook in Stripe for `checkout.session.completed` pointing at `https://zaz-artz.azurewebsites.net/api/webhooks/stripe`, and set `STRIPE_WEBHOOK_SECRET` the same way.

## Fulfilment

Each order item carries the full design JSON (layers, fonts, positions relative to the print area) and a preview PNG. A print partner such as Printful or Printify can take the layered JSON, or you can export print files from the admin page. The print area per garment is defined in `web/src/components/GarmentMockup.tsx`.

## Content and trademark note

Fandom and anime designs are deliberately original and logo-free. The AI prompt filter blocks a short list of brand and character names; extend `BLOCKED` in `web/src/app/api/generate/route.ts` as needed. See `RESEARCH.md` for the trend research behind the collections.

## Product photos

Every template has a photoreal product shot generated with Azure OpenAI (`web/scripts/seed-photos.mts`) and re-encoded as a 1024px JPEG (`web/scripts/optimize-photos.mts`). URLs live in `web/src/lib/generated-photos.json`.

```bash
cd web
npm run seed:photos -- new-template-slug   # photo for a new template
npm run photos:optimize                    # convert any PNGs to JPEG
```

Product cards and the product page show the photo; the live SVG preview takes over as soon as the customer personalizes.
