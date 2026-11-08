# NDE REEL — BUDGETS & MEASUREMENTS

All numbers below are from the production build and on-disk assets in this repository.

## Production bundle

`npm run build` — Vite 7.3.7, 643 modules.

| Chunk | Raw | Gzip |
| --- | ---: | ---: |
| `assets/index-*.js` (app) | 95.52 kB | 29.18 kB |
| `assets/vendor-*.js` (three / R3F / drei) | 1,334.43 kB | 388.43 kB |
| `assets/motion-vendor-*.js` (GSAP / Lenis) | 134.21 kB | 50.56 kB |
| `assets/postfx-vendor-*.js` (postprocessing) | 90.32 kB | 21.61 kB |
| `assets/index-*.css` | 54.60 kB | 11.80 kB |
| `index.html` | 1.65 kB | 0.68 kB |
| **Total** | **1,710.38 kB** | **502.16 kB** |

`manualChunks` keeps the three heavy vendors in separate long-cache chunks. The app chunk holds all scene and UI code. `chunkSizeWarningLimit` is 1500 kB because three.js alone is ~1.1 MB raw; gzip is the meaningful network cost.

Fonts are local TTFs under `public/fonts` (Anton, Instrument Serif regular/italic, Inter, JetBrains Mono). No Google Fonts, no CDN HDRI, no remote runtime requests.

## 3D assets

Eleven Draco-compressed GLBs in `public/models`, produced by `tools/blender/gen_a1_a5.py` and `gen_a6_a11.py` from the shared `lib_nde.py`. `manifest.json` records the measured values.

| Asset | Node contract | Triangles | Size |
| --- | --- | ---: | ---: |
| A1 `portal_gate` | `portal_gate`, `ring_inner`, `rim_emissive`, `window_*` | 26,256 | 358 KB |
| A2 `ruins_hero` | `ruins_hero`, `debris_*`, `flag`, `figure`, `arch_*`, `rubble_*` | 22,696 | 249 KB |
| A3 `corridor_brutal` | `corridor_brutal`, `monolith_*`, `door_light`, `floor_strip` | 51,572 | 350 KB |
| A4 `tunnel_lines` | `tunnel_lines`, `neon_*`, `floor_mirror`, `ceiling_light_*` | 57,420 | 411 KB |
| A5 `nde_monogram` | `nde_monogram`, `shard_*`, `monogram_shattered` | 25,536 | 208 KB |
| A6 `star_core` | `star_core`, `monogram_face` | 23,584 | 346 KB |
| A7 `crystal_shard` | `crystal_shard` | 28,416 | 161 KB |
| A8 `engine_tower` | `engine_tower`, `base_deploy`, `shell_interface`, `rings_model`, `rings_data`, `core_idea` | 45,732 | 506 KB |
| A9 `server_rack` | `server_rack`, `led_*`, `cable_*`, `rack_unit_*` | 57,656 | 452 KB |
| A10 `house_wire` | `house_wire`, `house_edge_*`, `ground_grid` | 53,160 | 203 KB |
| A11 `key` | `key`, `key_head`, `key_shaft`, `key_teeth` | 22,140 | 94 KB |
| **Total** | 11 assets | **414,168** | **3.26 MB** |

Budgets: payload limit 25 MB (used 13.0%); per-asset limit 20,000–150,000 tris (range 22,140–57,656). All 11 assets are inside both limits.

The runtime renderer currently builds the same geometry procedurally with the same node names, so the GLBs are not downloaded by the app. They are the validated swap-in pipeline output: replacing a procedural group with a loaded GLB does not change scene or camera code.

## Runtime budget

- One WebGL context, one `<Canvas>`, one post stack for the whole journey.
- Only the current and next scene are mounted; portal gates are reused procedural clones.
- Quality tiers: `HIGH` desktop default, `LITE` mobile default, `ULTRA` adds DOF, `HIGH`/`LITE` cycle from the HUD.
- `Adaptive` drops `HIGH` to `LITE` when the measured average stays below 42 fps after 3.5 s.
- Scroll-driven DOM visibility uses CSS variables and `data-live`/`inert`; no React state updates per frame.
- Textures are procedural or generated at runtime; no CDN HDRI. Environment light is local drei `Environment` + Lightformers.
- Target: 60 fps on a mid-range laptop at `HIGH` with postprocessing on. The SwiftShader QA renders at `LITE`; its timings are not representative of GPU performance.

## Source size

Every hand-written source file is under 300 lines. The styles are split into `global.css`, `type.css`, `hud.css`, `hud-rail.css`, `overlays.css`, `overlays-scenes.css`, `panels.css`, `plans.css`, `mobile.css`, `mobile-panels.css`, preserving import order. Largest source files are `tools/qa/final-shots.cjs` (296), `global.css` (294), `gen_a6_a11.py` (283), `S05Engine.tsx` (276), and `content.ts` / `overlays.css` (271). Mobile overrides live in `mobile.css` (268) and `mobile-panels.css` (237).

## Acceptance artifacts

- `docs/shots/report.json` — automated check results, zero console/page/request errors, desktop 1440×900 and mobile 390×844.
- `docs/shots/*.png` — 13 desktop frames (including the 00-start hint, source-plan state and transition) plus 11 mobile frames covering p = 0 → 0.985.
- `tools/qa/final-shots.cjs` — reproducible Playwright acceptance run (installed Chrome + SwiftShader); verifies the scroll-hint bubble on desktop and mobile.
- `tools/qa/mobile-audit.cjs` — six-viewport phone/landscape audit for document overflow, clipping and HUD/panel overlap.
- `tools/qa/capture-products.cjs` — dark-mode homepage screenshots for the S04 product cards (`public/shots/product-*.jpg`: Solve NCERT, Aether Studio, KOKO Coconut Co., Aven Serum). The other six products use client-supplied images from `public/shots/` (originals too: `blitzdata.png`, `economind.png`, `glossdrive.png`, `okhaven.png`, `woodcrest.png`, `novexa 1.png`, `novexa 2.png`).
- `docs/shots/collage-dark-desktop.png` / `collage-dark-mobile.png` — labelled dark-mode contact sheets, regenerated by `tools/qa/dark-gallery.cjs` (also writes `docs/shots/gallery.html`).
