# SPEC 01 — WORLD ENGINE

## Stack

Vite + React + TypeScript + Tailwind v4 + three.js + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` + GSAP 3 (`ScrollTrigger`) + Lenis + zustand. GLTF loading supports Draco / meshopt / KTX2 (loader setup is present even when a chapter uses a procedural stand-in).

Fonts via `@fontsource`, with local TTF copies for troika 3D text:
Instrument Serif italic, Big Shoulders Display, JetBrains Mono, Inter.

## One canvas, one progress

- One fixed full-screen `<Canvas>` for the whole site.
- A tall invisible spacer (~1900vh) drives one normalised `p ∈ [0,1]`.
- Lenis smooths wheel/touch. GSAP ScrollTrigger with `scrub: 1.2` writes `p` into a zustand store.
- In `useFrame`, displayed progress lerps toward `p` (damping ≈ 0.08) so motion feels like a heavy cinema dolly.
- DOM never translates upward. Overlays fade / slide locally using chapter progress.

## Camera rig

- A `CatmullRomCurve3` of position waypoints plus a second curve for look-at targets.
- Camera position = pos curve at eased progress; `camera.lookAt` target curve.
- Tiny handheld noise (amplitude ≈ 0.01), damped mouse parallax (±0.15 rad), roll on turns.
- FOV changes per chapter; portal crossings punch FOV 45 → 70.
- Key `D` toggles a debug spline visualiser (points + line).
- Reduced motion: no shake, no flicker, shorter / gentler moves.

## Chapters

Chapter entries contain `{ id, title, pStart, pEnd, holdStart, holdEnd, fog, bg, bloom, lights, camera keys }`.
Hold zones (middle ~30%) barely move the camera so copy can be read; entering/leaving is a fast cinematic move.

Chapter scroll lengths: S01 200vh, S02 150, S03 150, S04 250, S05 300, S06 250, S07 250, S08 150, S09 100. S00 loader sits before scroll.

## Transitions

Every chapter boundary is a physical portal:

- reusable A1 ring gate placed in the world;
- emissive inner rim, rotating `ring_inner`, amber windows;
- camera flies through the ring;
- white-gold flash + bloom spike + FOV punch + chromatic-aberration spike + 6-frame shutter flicker;
- the next environment is already behind the gate in the same Z-axis world;
- fog / light colour is interpolated as the camera passes.

No page cross-fades, no CSS slide transitions.

## 3D typography

- Giant headlines are troika `<Text>` meshes, positioned in world space, often split across depths so ruins / figures / rings pass between layers.
- Gold, bone and plasma colour variants.
- Letter-by-letter reveal (stagger ≈ 0.02s, y 40px + blur/opacity feel), dissolve out when leaving.
- DOM duplicates of all important copy live in a visually hidden semantic layer for accessibility.

## Cinematic skin

- 2.39:1 letterbox bars that animate open after the loader.
- Animated film grain, scanlines, vignette.
- HUD frame corners.
- REC dot + running timecode mapped from `p` (`00:00:00:00 → 00:03:00:00`).
- Left scene rail S00–S09, clickable, smooth-jumps `p`.
- `SCROLL` hint disappears on first scroll.
- Sound toggle, default OFF: low hum + soft ticks via WebAudio.
- Header persists: NDE logo, NOIRDEMONS / formerly Novexa, Ecosystem · Services · Plans · Our vision · Contact, CTA `Start a conversation` mailto.

## Post-processing

`EffectComposer` with Bloom (threshold 0.6, intensity per chapter), ChromaticAberration (portal spikes), Noise, Vignette, DepthOfField in hold zones. ACES filmic tone mapping, sRGB output.

## Quality tiers

- ULTRA: dpr 2, all post FX, max particles.
- HIGH: dpr 1.5, post FX, medium particles.
- LITE: dpr 1, no DOF/CA, fewer particles, no reflector floor.
- Auto-select using GPU hints and an FPS monitor; HUD `QUALITY` selector cycles.
- Mobile <768px: same camera journey, fewer particles, no reflector, stacked / simplified plan UI, DOM fallbacks where needed.
- Respect `prefers-reduced-motion`.

## Performance

- Target 60 fps on a mid laptop, 30+ on mobile.
- Lazy-load heavy assets by chapter when possible, preload the next chapter at 60% of the current one, dispose far geometry/materials.
- Total GLB payload budget < 25 MB; each model 20–150k tris; 1k–2k textures.

## Accessibility

- Semantic hidden DOM copy for every 3D headline.
- Keyboard-focusable CTAs and scene rail.
- `aria-label`s, skip-to-contact link.
- Buttons are real buttons, links real anchors.
