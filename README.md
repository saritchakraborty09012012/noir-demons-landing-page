# NDE: NoirDemons — the Reel

A continuous cinematic WebGL portfolio for **NDE: NoirDemons** (formerly Novexa): one scroll, ten scenes, one camera journey. Dark 3D film plus a black-and-white 2D dive page with products, samples, the Solve NCERT growth graph, a SaaS-vs-source comparison, and plans.

## Run

```bash
npm install
npm run dev        # http://127.0.0.1:5200/
npm run build      # production build into dist/
npm run preview    # serve the build locally
```

## Dive page

After the outro, click **Dive deeper** (or scroll 3 times at the end, or open `/#/dive`):

- Sample index — Top Public Products, 3D Service Samples (with disclaimer), 2D Site Services
- The Site Catalogue — eight site walkthroughs (`public/templates`), each with a reference button that opens the enquiry email with that clip pre-attached
- Solve NCERT Search Console graph (coded SVG) + zero-promotion story
- Comparative study — own the source code vs SaaS, 13 points + plan prices, ✓ bullets
- Plans & pricing — side-by-side rate cards
- 10 policy pages (Privacy, Terms, Refunds, SaaS Agreement, Digital Products, IP, Acceptable Use, Disclaimer, Cookies, Contact)

## QA

```bash
npx tsc --noEmit
npm run build
node tools/qa/final-shots.cjs     # Playwright acceptance screenshots
node tools/qa/mobile-audit.cjs    # six-viewport audit
node tools/qa/capture-products.cjs # refresh product screenshots
```

Docs and metrics are in `docs/`.
