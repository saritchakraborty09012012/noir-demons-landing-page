# SPEC 03 — ASSET PIPELINE

## Blender

Blender 5.0 is installed at `C:\Program Files\Blender Foundation\Blender 5.0\blender.exe`.
Scripts live in `tools/blender/`. They build models with `bpy`, assign materials, bake AO where useful, apply modifiers, merge by material and export `public/models/<asset>.glb` (Draco, +Y up).

Budget: total GLB payload <25 MB, per model 20–150k tris, textures 1k–2k. Runtime uses procedural stand-ins with the same node names when a generated asset is not yet production quality, so replacing a GLB never changes scene code.

Mesh names are part of the contract:

- A1 `portal_gate`, `ring_inner`, `rim_emissive`, `window_*`
- A2 `ruins_hero`, `debris_*`, `flag`, `figure`, `arch_*`, `rubble_*`
- A3 `corridor_brutal`, `monolith_*`, `door_light`, `floor_strip`
- A4 `tunnel_lines`, `neon_*`, `floor_mirror`, `ceiling_light_*`
- A5 `nde_monogram`, `shard_*`, `monogram_shattered`
- A6 `star_core`, `monogram_face`
- A7 `crystal_shard`
- A8 `engine_tower`, `base_deploy`, `shell_interface`, `rings_model` (`ringM_1..3`), `rings_data` (`ringD_1..5`), `core_idea`
- A9 `server_rack`, `led_*`, `cable_*`, `rack_unit_*`
- A10 `house_wire`, `house_edge_*`, `ground_grid`
- A11 `key`, `key_head`, `key_shaft`, `key_teeth`

## A1 portal_gate.glb

Massive ring gate. Outer torus R=10 with 48 bevelled radial ribs, inset panel greeble, thick inner rim with emissive warm-white strip (emissive 6), second smaller rotating ring `ring_inner`, small amber windows. Baked AO. Cloned at every transition and tinted.

## A2 ruins_hero.glb

Broken colossal stone arch (two pillars, fractured top), 20–30 floating debris chunks (`debris_*`), rubble floor, tall flag pole with monogram cloth (`flag`, 60-frame baked wave), kneeling hooded rim-lit figure (`figure`). Dark stone roughness 0.9, bevels, crack displacement.

## A3 corridor_brutal.glb

Brutalist concrete corridor: 14 tapering instanced monolith pairs, tall bright rectangular opening `door_light`, tiled floor with thin centre light strip.

## A4 tunnel_lines.glb

Black glossy A-frame tunnel, white neon X bars along both walls (`neon_*`), ceiling slabs, mirror floor `floor_mirror` (runtime uses `MeshReflectorMaterial`).

## A5 nde_monogram.glb

Extruded NDE logo, bevelled, brushed gold (metalness 1, roughness 0.28), depth 0.4. Cracked version: 40 `shard_*` for S03 and S09.

## A6 star_core.glb

Dark spiky faceted star, obsidian (metalness 0.9, roughness 0.2), monogram embedded at front. Centre of S04.

## A7 crystal_shard.glb

Elongated bevelled gem, 14–20 facets. Instanced 10× with per-product colour, transmission, iridescence, inner emissive.

## A8 engine_tower.glb

Arc-reactor tower with separately animatable named groups: `base_deploy`, `shell_interface`, `rings_model`, `rings_data`, `core_idea`. Gunmetal + plasma-blue emissive.

## A9 server_rack.glb

30 slim units, tiny emissive LEDs (`led_*`), cable splines flowing out (`cable_*`), plasma-blue glow.

## A10 house_wire.glb

Two-storey architectural wireframe (thickness 0.01, emissive cool white), ground grid, `house_edge_*`. Builds bottom-up, then fills with dark glass.

## A11 key.glb

Chrome key, bevelled, emissive cyan edge, NDE glyph engraved. Slow rotation; it swings between the two worlds in S06.

## Environment / lighting

Most light is baked plus a few real lights. A local dark environment map (generated with drei `Environment` + Lightformers — never a CDN) at low intensity gives metals something to reflect. A1–A11 material palettes follow the design system.
