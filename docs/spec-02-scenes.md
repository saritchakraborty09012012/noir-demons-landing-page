# SPEC 02 — SCENES S00–S09

All scenes share one Z-axis world. A portal gate sits at every boundary.

## S00 LOADER

Black. Monogram ink-bleeds in with a noise-threshold reveal. Thin letter-spaced `NOIRDEMONS` below. Progress bar `INITIALIZING REEL … 84%` driven by real boot work (font loading + first shader compile). At 100%: shutter flicker, letterbox bars open, hold 0.4 s, camera starts inside the hero. Scroll locked until finished.

## S01 HERO (ACT I, 200vh)

World: colossal broken stone arch, cracked pillars, 20–30 drifting debris chunks (`debris_*`), rubble floor, tall flag pole with cloth flag carrying the NDE monogram (`flag`), kneeling hooded rim-lit figure (`figure`), warm volumetric god-rays and 2,000 drifting dust particles.

Camera starts low and far, pushes in, arcs around the figure, rises toward the arch, flies through it into light.

3D title: `Make the / impossible / useful.` — Instrument Serif italic, `impossible` in gold, placed across three depths so the figure sits between layers. Letter-by-letter reveal.

Eyebrow: `Independent intelligence studio / 001`.
Body: NDE builds intelligent systems for the moments that matter…
Buttons: `Explore the ecosystem` (S04), `View custom plans` (S07).

## S02 PREMISE (150vh)

World: brutalist concrete corridor, 14 tapering monolith pairs, bright rectangular opening at the end, tiled floor with thin centre light strip. `door_light` slides open (scale X 0 → 1), white flood + bloom 4 for 8 frames.

Camera walks forward, monolith parallax, floor pulse.

3D title on the left wall plane, perspective-skewed: `A door, / not a wall.`
Subcopy: `Constraints aren't stops — they're frames for sharper design, smarter systems and more meaningful outcomes.`

## S03 IMPACT → RISE (150vh)

World: black glossy triangular / A-frame tunnel, white neon X bars along both walls (`neon_*`), ceiling light slabs, mirror floor (`floor_mirror`). Camera accelerates; FOV 45 → 85; radial motion feel.

Gold monogram shatters — 40 `shard_*` fly toward camera with stagger. Huge 3D `IMPACT` breaks into fragments that reassemble into gold `RISE`. Mono line advances: `BREAK / LEARN / REBUILD / RISE`.

## S04 CONSTELLATION (ACT II, 250vh)

Open space. Dark spiky faceted `star_core` with embedded monogram at centre, thin tilted gold orbit rings, 5k star dust. Ten crystals orbit, each with its own colour, halo and 3D label + mono sub-label.

Products: 01 Novexa (violet), 02 EconoMind AI (blue), 03 BlitzData (cyan), 04 Solve NCERT (green), 05 Woodcrest Co. (amber/wood), 06 GlossDrive Co. (silver), 07 Oakhaven Home (warm white), 08 Aether Studio (ice-blue), 09 KOKO Coconut Co. (coconut cream), 10 Aven Serum (rose).

Camera orbits 360°, each crystal gets a focus beat: dolly closer, others dim, glass info card with name + pitch + Visit link. Aether / KOKO / Aven use live URLs; others `#`. Hover tilts crystal toward cursor and emits particles. Click jumps to focus.

Headline: `Ten ways to move forward.` / `One studio. An expanding constellation of products designed to make difficult things feel possible.`

## S05 THE ENGINE (300vh)

`engine_tower` in a black void, plasma-blue light, volumetric haze, rotating assembled.

Scroll explodes vertically in stages:
1. `core_idea` — IDEA CORE: Vision · Problem · Design
2. `rings_data` — DATA: Ingest · Structure · Learn
3. `rings_model` — MODEL: Reason · Generate · Decide
4. `shell_interface` — INTERFACE: UX · Product · Experience
5. `base_deploy` — DEPLOY: Launch · Scale · Maintain

Each ring spins at its own speed; labels appear with SVG leader lines drawn via stroke-dashoffset from projected 3D anchors. End: pieces reassemble and camera dives into the core.

Headline `The Engine.` gold italic.
Copy: `From a raw idea to a living, scalable digital reality — our engine turns intent into impact.`

## S06 KEYS vs DRIVE (250vh)

Two worlds. Left: `house_wire` blueprint on a dark grid, cool light. Right: `server_rack` glowing plasma-blue with cable particles. Centre: floating chrome key and vertical light seam.

Headline: `Take the keys, / or let us drive.`

1. Camera centres key.
2. Push into LEFT while house builds bottom-up. DOM card `01 · BUY THE BUILD — ONE-TIME` etc.
3. Key swings RIGHT, camera pushes into server rack, LEDs sequence. DOM card `02 · MANAGED SERVICE — RECOMMENDED` etc.
4. Both pull back; 13-row hologram table rises as a glass panel, rows reveal with a scan-line sweep.

## S07 PLANS (250vh)

Fullscreen liquid iridescent fluid shader (domain-warped fbm, fresnel highlights, slow flow, mouse reactive).

Pill toggle: `Run it as a service (Popular)` ⇄ `Own the source code`. Whole row of four 3D glass cards flips with rotateY 180 and 0.08s stagger. Cards are `RoundedBox` glass in a gentle arc, gold edge sweep, cursor tilt ±12°, scrolling camera glides along them, focused card scales 1.08.

All plan copy, prices, features, CTAs and mailto links are in `spec-04-content.md`.

## S08 VISION (150vh)

Camera falls toward a black hole. Accretion disc shader with thousands of stretched blue-white particle streaks, gold hot spots, Doppler brightening on one side. Pitch-black event horizon sphere, photon-ring glow, fake gravitational lensing via refract pass.

Text: `A more useful digital world.` (gold italic on `useful digital`) and `Products that work. Systems that think. Experiences that feel. A creative-technical studio for what's next.`

End: pass the horizon, white-gold then black.

## S09 OUTRO (100vh)

Emerge through A1 gate onto a glowing bridge toward a huge portal. Giant 3D-lit serif italic email `nde.noirdemons@atomicmail.io` (clickable mailto). Above: `PROJECT INQUIRIES & COLLABORATIONS`; below: `PRODUCTS / SYSTEMS / EXPERIENCES / COLLABORATIONS`. Button `Start a conversation`.

Footer DOM: logo, `NDE — NoirDemons, formerly Novexa`, links Ecosystem / Services / Plans / Our vision / Contact. Monogram flickers like film end; tiny `REPLAY` animates p back to 0 fast.
