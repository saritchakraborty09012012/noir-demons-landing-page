# VIDEO NOTES — 2026-11-02 REFERENCES

Frames extracted with ffmpeg to a 3×3 contact sheet per source (temp working set) and inspected against the brief.

## Reel 1 — 231957 (50.6 s) — title / impact / resolve

Sequence observed:

1. **Gold portal corridor.** Camera flies toward an enormous vertical golden slit of light. Heavy bloom, warm volumetric haze, tiny debris silhouettes. Text sits behind the light, not on top of it.
2. **White-flash cut.** The portal blows out to near-white and the next frame is a new world. No page slide, no cross-fade — a physical flythrough with a one- to two-frame white-out.
3. **IMPACT.** Condensed grey-white display type filling the frame. The word cracks / splits; fragments are physical objects with parallax.
4. **RISE.** The fragments re-form as a gold/white wordmark, lit from behind with a blue core visible through the letter counters.
5. **Resolve.** Black-hole event horizon with a ring of particles and a purple serif word. A vertical lightning column hits a suited figure standing inside a broken arch, then the whole frame blooms to gold.
6. **Contact.** Chrome email address on black, tiny mono HUD. Film-grain blacks, no flat panels.

Timing/easing: cuts land on a heavy beat; each new scene starts *inside* motion (already 20–30% through a push/orbit), never on a static frame. Portal approach accelerates; the last 4–6 frames before white-out are the fastest.

Takeaways for NDE: use the portal as the only transition device; put the big word behind foreground geometry; white-gold flash masks chapter seams; the camera should already be moving on entry.

## Reel 2 — 232106 (16.4 s) — dark glass / creative digital

1. Dark glass card hero, rim-lit in violet/cyan, star particle field, huge condensed white type `CREATIVE DIGITAL EXPERIENCES` behind the glass.
2. A chrome ring / circular monitor with purple particle trails orbits the object.
3. Cut to an exploded chrome pavilion / ring installation in purple volumetric fog.
4. Cut to a dark particle field with gold sparks and a faint circular HUD reticle.

Look: tinted transmission glass, very low roughness, thin fresnel edges, bloom only on thin highlights. Type is a layer in the scene, partially occluded. Camera moves are lateral drifts plus slow dolly, not zooms. Particles are sparse and large in the foreground, dense and small in the back.

## Reel 3 — 232318 (90.4 s) — Arc-reactor exploded assembly

1. Reactor ring in darkness, blue-white glow, concentric machined rings.
2. Exploded assembly: each part floats on its own vertical track, camera orbits slowly. Parts are chrome, gunmetal, blue anodised metal, glass.
3. Continuous narration cuts on part close-ups. Shallow DOF in every hold. Labels are small white captions, never covering the object.
4. Blue plasma torus with stretched light streaks; lens flare/streak highlights. One side of each ring is hotter (Doppler-like asymmetry).
5. Final assembly: parts return, then a white-blue flash.

Takeaways: the engine sequence should read as an exploded technical diagram in 3D — each named group on a vertical axis, labels via leader lines, ring rotations at different speeds, DOF in holds, plasma-blue emissive only here.

## Cross-reference timing sheet used in the build

| Beat | Reference behaviour | NDE implementation |
| --- | --- | --- |
| Chapter enter | already moving, 4–6 frame acceleration | camera waypoints packed after boundary |
| Portal | gold slit, bloom spike, white flash | A1 gates + CSS flash + FOV punch + CA spike |
| Hold | slow drift, shallow DOF, labels | middle 30% of chapter, subtle orbit |
| Exit | explosive acceleration into light | sparse waypoints, FOV +12, bloom up |
| Type | behind/through geometry, hard light | troika text at 2–3 Z depths |

Easing: long ease-in on approach (`power2.in` feel), hard 1–2 frame flash, then ease-out settle. No bounce. No elastic. Reduced-motion variant removes flash/flicker and shortens the punch.
