# NDE REEL — MASTER SPEC

Cinematic 3D portfolio for **NDE (NoirDemons, formerly Novexa)**.
Quality bar: Awwwards Site of the Day. One continuous camera journey through one WebGL world.

This brief is split into:

- `spec-01-world.md` — stack, world engine, camera, HUD, performance, accessibility.
- `spec-02-scenes.md` — exact behaviour of S00–S09.
- `spec-03-assets.md` — Blender pipeline, A1–A11, procedural fallback rules.
- `spec-04-content.md` — verbatim copy, decision table, plans, mailto builders.

## Non-negotiables

1. No page scrolling. Exactly one fixed full-screen `<Canvas>`; a ~1900vh invisible spacer drives one normalised progress `p`.
2. Every chapter is real 3D geometry in the same world. Scene changes are physical portal / flythrough events, never DOM cross-fades.
3. Giant titles are real 3D troika text at different depths so geometry passes between text layers. DOM is reserved for small copy, controls, HUD, tables and plan dossiers.
4. No placeholders, no flat-colour boxes pretending to be assets. Procedural stand-ins must be detailed and use the same node names as the Blender assets.
5. All copy, prices, decision points and mailto subjects/bodies must match `spec-04-content.md` exactly.
6. `noir-demons.vercel.app` is not modified.

## Design system

| Token | Value |
| --- | --- |
| ink | `#050505` |
| near-black | `#0b0b0d` |
| bone | `#ECE7DD` |
| gold | `#C9A24B → #F3DDA0 → #8A6A21` |
| plasma blue | `#3BA0FF` (S05 / S06 server only) |
| iridescent | blue-green-teal (S07 only) |

Type: **Instrument Serif Italic** for captions and gold keyword, **Big Shoulders Display / Anton** for condensed display, **JetBrains Mono** for HUD/timecode, **Inter** for body.

Glass: `MeshPhysicalMaterial` transmission 1, roughness 0.15, thickness 0.5, ior 1.45, thin gold fresnel edge.

## Build phases

- P0 setup, spec, fonts, video notes, audit.
- P1 world engine: single canvas, Lenis + ScrollTrigger → zustand, camera curves, chapter table, post FX, grain/letterbox/HUD/timecode/rail, loader.
- P2 Blender pipeline A1–A5 + S01–S03.
- P3 A6–A7 + S04 constellation.
- P4 A8 + S05 engine.
- P5 A9–A11 + S06 keys vs drive + table.
- P6 S07 plans: fluid shader, glass cards, toggle flip, all mailtos.
- P7 S08 black hole, S09 outro, header/footer.
- P8 polish: transition timings, mobile, reduced motion, quality tiers, bundle, Playwright shots at p = 0…1 at 1440×900 and 390×844.

The final instruction is to implement all phases consecutively without stopping.

## Acceptance

- Scrolling 0 → 1 gives one unbroken camera journey.
- Every chapter has real 3D geometry and at least two scroll-driven animations.
- No plain page-scroll movement anywhere.
- Transitions are portals / flythroughs.
- All text and prices match the content spec.
- 60 fps target on a mid laptop.
- Zero console errors.
- Playwright screenshots exist in `docs/shots/`.
