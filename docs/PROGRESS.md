# NDE REEL — PROGRESS & COMPLETION REPORT

Status: **all phases P0–P8 complete**. The site is a single continuous WebGL camera journey, built in `nde-reel/`, with production build, asset pipeline, and automated acceptance evidence.

## What shipped

- One fixed full-screen R3F `<Canvas>`; a 1900vh spacer drives a normalized progress `p` through Lenis + GSAP ScrollTrigger into zustand.
- Camera position/look Catmull-Rom curves with damping, mouse parallax, handheld noise, roll and FOV punches.
- Ten chapters S00–S09, each with real 3D geometry and scroll-driven animation. Transitions are physical portal gates / flythroughs with flash, bloom spike, FOV punch and chromatic aberration.
- Giant titles are real troika `Text` at multiple depths; geometry passes between layers. DOM is limited to small copy, buttons, HUD, tables, plan dossiers and accessibility duplicates.
- Cinematic skin: letterbox, grain, vignette, HUD corners, REC/timecode, clickable scene rail, scroll hint, sound toggle (default OFF), Bloom/CA/Noise/DOF, ACES tone mapping.
- Content is verbatim: email `nde.noirdemons@atomicmail.io`, 13 decision points, managed/source plans and prices, per-plan mailto subject/body builders.
- A1–A11 GLBs are generated, validated against the exact node contracts, and measured in `public/models/manifest.json`. Runtime uses detailed procedural geometry with the same node names; GLBs are the swap-in pipeline.
- Mobile simplifications, safe-area/touch layout, reduced-motion handling, quality tiers, adaptive downgrade, bundle splitting, and Playwright acceptance screenshots in `docs/shots/`.
- A glass/gold scroll-hint bubble at the start (also in the mobile header area in landscape); it is a real button, jumps into the reel, then hides and becomes inert.
- `noir-demons.vercel.app` was not touched.

## Chapter map

| id | label | p range | hold | bloom |
| --- | --- | --- | --- | ---: |
| S00 | LOADER | 0 | — | 0.6 |
| S01 | HERO / ACT I | 0.000–0.105 | 0.025–0.075 | 1.0 |
| S02 | PREMISE | 0.105–0.195 | 0.125–0.170 | 0.8 |
| S03 | IMPACT → RISE | 0.195–0.285 | 0.215–0.255 | 1.3 |
| S04 | CONSTELLATION | 0.285–0.435 | 0.325–0.395 | 1.4 |
| S05 | THE ENGINE | 0.435–0.615 | 0.470–0.560 | 1.8 |
| S06 | KEYS VS DRIVE | 0.615–0.765 | 0.650–0.720 | 1.2 |
| S07 | PLANS | 0.765–0.900 | 0.790–0.860 | 1.1 |
| S08 | VISION | 0.900–0.965 | 0.915–0.945 | 1.2 |
| S09 | OUTRO | 0.965–1.000 | 0.985–1.000 | 0.55 |

The chapter spans above are the implemented pacing. They are tuned around the camera spline and scene hold windows inside the 1900vh spacer.

## Phase log

- **P0 — setup/spec.** Stack installed (Vite + React + TS + Tailwind v4 + three/R3F/drei/postprocessing + GSAP + Lenis + zustand). Local fonts, logo, reference notes, spec set in `docs/`.
- **P1 — world engine.** One canvas, Lenis → ScrollTrigger → zustand, camera spline, chapter table, post FX, grain/letterbox/HUD/timecode/rail, loader, CSS-driven stage alpha windows.
- **P2 — A1–A5 + S01–S03.** Portal gate, ruins, brutalist corridor, neon tunnel, nde monogram; hero, premise, impact/rise.
- **P3 — A6–A7 + S04.** Spiky star core, crystal shards, orbit camera, product focus interaction, mobile simplification.
- **P4 — A8 + S05.** Arc-reactor engine tower with separate ring groups, camera-anchored title plate, stage labels, deployment sequence.
- **P5 — A9–A11 + S06 + table.** Server rack, wireframe house, chrome key; buy-vs-managed choice cards and 13-row decision table.
- **P6 — S07 plans.** Fluid shader, two-faced glass cards, managed/source flip, four plans each, eight personalized mailtos.
- **P7 — S08/S09.** Black-hole vision port (photon ring, glow sprites, 56k-particle shader discs) with camera-anchored headline; outro portal, email sculpture, footer, replay.
- **P8 — polish/QA.** Transition tuning, full mobile/landscape adaptation (320–430 px portrait, 568/844 px landscape), reduced motion, quality tiers, bundle splitting, rounded particle sprites, scroll-hint bubble, mobile audit and final Playwright sweep.

## Verification

Commands:

```bash
npx tsc --noEmit
npm run build
npm run dev -- --host 127.0.0.1   # http://127.0.0.1:5200/
node tools/qa/final-shots.cjs
node tools/qa/mobile-audit.cjs
```

Automated acceptance (`docs/shots/report.json`, final post-cleanup run) checks:

- zero console, page and request errors on desktop and mobile;
- exactly one `<canvas>`;
- ten scene-rail buttons;
- thirteen decision-table rows;
- every mailto uses `nde.noirdemons@atomicmail.io`;
- four managed + four source plans, eight unique personalized subjects/bodies;
- verbatim prices and plan copy;
- no mobile horizontal overflow (390px viewport, 320–430px audit);
- footer/clock clearance at the outro;
- scroll-hint bubble present and clickable on desktop and mobile;
- reduced-motion load still yields one canvas.

Production build (latest):

| Chunk | Raw | Gzip |
| --- | ---: | ---: |
| app `index` | 95.52 kB | 29.18 kB |
| `vendor` | 1,334.43 kB | 388.43 kB |
| `motion-vendor` | 134.21 kB | 50.56 kB |
| `postfx-vendor` | 90.32 kB | 21.61 kB |
| CSS | 54.60 kB | 11.80 kB |

Full asset sizes and per-model triangle counts are in `docs/BUDGET.md` and `public/models/manifest.json`.

## Notes

- Runtime geometry is procedural, with A1–A11 node names matching the GLBs so the Blender outputs can replace them without scene changes. The 3.26 MB GLB payload is not fetched by the app.
- QA is executed with installed Chrome + SwiftShader. That renderer reports `LITE`; timings are not representative of hardware GPU performance. The design target remains 60 fps on a mid-range laptop at `HIGH`.
- Screenshots are captured at desktop 1440×900 and mobile 390×844 in `docs/shots/` (13 desktop states including the start hint and source-plan toggle, 11 mobile states). A separate six-viewport audit covers 320–430 px portrait and 568/844 px landscape.
- S07 now flips along the scroll: managed prices cycle over 0.788–0.824, then the deck turns to the source-code face at 0.824 and cycles 0.824–0.862 (shared windows in `src/lib/planScroll.ts`); the manual toggle still outranks auto-flip until leaving S07.
- S04 product cards now show a homepage screenshot under the card head (`public/shots/product-*.jpg`: Solve NCERT, Aether Studio, KOKO Coconut Co., Aven Serum) with a crossfade on focus change; Novexa shows its two screenshots as a side-by-side collage, and the other five products use client-supplied images. `object-fit: contain` — screenshots are never cropped. Regenerate shots with `node tools/qa/capture-products.cjs`.
- Outro has a **Dive deeper** button; three downward scrolls at the end of the reel (p ≥ 0.998, wheel/touch) also open the 2D page, and `#/dive` deep-links straight to it. The page (`src/components/DivePage.tsx`, `src/styles/dive.css`) is full black & white in the `noir-demons-landing-page` theme (`#050505`, `#f4f4f2`, Georgia serif, Arial/Helvetica). Content order: Top Public Products → 3D Service Samples (with DISCLAIMER / NOTE box) → 2D Site Services → coded Solve NCERT Search Console graph with the zero-promotion story → comparative study (`#dive-compare`: 13 points + watermark row + 4 plan price rows, ✓ ticks) → Plans and pricing (`#dive-plans`: Own the source code vs SaaS, two side-by-side cards that stay side by side even on phones). The dive scroller carries `data-lenis-prevent` so wheel/touch scroll works while the film stays frozen.
