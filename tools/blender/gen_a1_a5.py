"""A1-A5 detailed asset generation. Run: blender -b -P gen_a1_a5.py"""
import bpy, math, random, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib_nde import *

# ---------------------------------------------------------------- A1 portal
reset(11)
stone = mat("A1_Stone", (0.052, 0.047, 0.041), 0.55, 0.38)
metal = mat("A1_Gunmetal", (0.028, 0.032, 0.038), 0.96, 0.22)
gold = mat("A1_Gold", (0.72, 0.49, 0.18), 1.0, 0.25, (1.0, 0.63, 0.22), 5.5)
amber = mat("A1_Amber", (0.31, 0.16, 0.05), 0.6, 0.3, (1.0, 0.55, 0.16), 6.0)
root = torus("portal_gate", (0, 0, 0), 10, 0.56, 128, 24, (math.radians(90), 0, 0), stone)
root.data.materials[0] = metal
for i in range(48):
    a = i / 48 * TAU
    rib = cube("rib_%02d" % (i + 1), (math.cos(a) * 10.0, 0, math.sin(a) * 10.0),
               (1.9, 0.72, 0.58), (0, -a, 0), metal if i % 4 else gold)
    bevel(rib, 0.055, 2)
    parent(rib, root)
    if i % 2 == 0:
        pan = cube("panel_%02d" % (i + 1), (math.cos(a) * 9.55, 0.02, math.sin(a) * 9.55),
                   (0.3, 1.1, 2.0), (0, -a, 0), stone)
        bevel(pan, 0.035, 2)
        parent(pan, root)
rim = torus("rim_structure", (0, 0, 0), 7.45, 0.34, 96, 18, (math.radians(90), 0, 0), metal)
parent(rim, root)
emissive = torus("rim_emissive", (0, -0.02, 0), 7.08, 0.085, 160, 12, (math.radians(90), 0, 0), gold)
parent(emissive, root)
inner = torus("ring_inner", (0, -0.12, 0), 5.15, 0.32, 112, 18, (math.radians(90), 0, 0), metal)
parent(inner, root)
for i in range(8):
    a = i / 8 * TAU
    spoke = cube("spoke_%d" % (i + 1), (math.cos(a) * 6.1, 0.08, math.sin(a) * 6.1),
                 (2.0, 0.28, 0.22), (0, -a, 0), metal)
    bevel(spoke, 0.035, 2)
    parent(spoke, root)
for i in range(12):
    a = (i + 0.5) / 12 * TAU
    win = cube("window_%02d" % (i + 1), (math.cos(a) * 8.42, -0.36, math.sin(a) * 8.42),
               (0.62, 0.08, 0.22), (0, -a, 0), amber)
    parent(win, root)
export("portal_gate")

# ---------------------------------------------------------------- A2 ruins
reset(23)
hero_stone = mat("A2_Stone", (0.075, 0.064, 0.052), 0.04, 0.94)
hero_dark = mat("A2_DarkStone", (0.035, 0.031, 0.027), 0.02, 0.98)
cloth = mat("A2_Flag", (0.032, 0.029, 0.025), 0.05, 0.88)
gold2 = mat("A2_Gold", (0.69, 0.47, 0.18), 0.9, 0.3, (0.95, 0.59, 0.2), 1.4)
pole_mat = mat("A2_Iron", (0.03, 0.032, 0.034), 0.92, 0.28)
root = empty("ruins_hero")
for side, x in (("left", -4.7), ("right", 4.7)):
    p = cube("pillar_" + side, (x, 0, 6.4), (2.3, 2.3, 12.8), (0, 0, 0), hero_stone)
    for v in p.data.vertices:
        if v.co.z > 0:
            v.co.x *= 0.74
            v.co.y *= 0.74
    bevel(p, 0.12, 2)
    subd(p, 1)
    dent(p, 0.09, 2.2, 3)
    parent(p, root)
    for j in range(3):
        c = cube("pillar_crack_%s_%d" % (side, j), (x + random.uniform(-0.8, 0.8), 0.95,
                 random.uniform(1.5, 11.5)), (0.05, 0.04, random.uniform(0.6, 2.4)), (0, 0, 0), hero_dark)
        parent(c, root)
for i in range(7):
    x = -6.1 + i * 2.05
    z = 13.2 + random.uniform(-0.35, 0.5)
    b = cube("arch_%02d" % (i + 1), (x, 0, z), (random.uniform(1.7, 2.2), 2.4,
               random.uniform(0.8, 1.5)), (0, random.uniform(-0.12, 0.12), 0), hero_stone)
    bevel(b, 0.09, 2)
    subd(b, 1)
    dent(b, 0.07, 2.8, i + 1)
    parent(b, root)
for i in range(26):
    d = ico("debris_%02d" % (i + 1), (random.uniform(-9, 9), random.uniform(-4, 5),
             random.uniform(1.2, 15.5)), random.uniform(0.22, 0.75), 2, hero_stone)
    d.rotation_euler = (random.random() * 3, random.random() * 3, random.random() * 3)
    d.scale = (random.uniform(0.6, 1.7), random.uniform(0.5, 1.4), random.uniform(0.6, 2.1))
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    dent(d, 0.18, 4.5, i + 9)
    parent(d, root)
floor = plane("rubble_floor", (0, 0, -0.15), 42, 42, 78, 78, hero_dark)
dent(floor, 0.13, 1.1, 4)
parent(floor, root)
for i in range(14):
    r = ico("rubble_%02d" % (i + 1), (random.uniform(-12, 12), random.uniform(-12, 12),
             random.uniform(-0.1, 0.45)), random.uniform(0.25, 0.9), 1, hero_stone)
    r.scale.z = random.uniform(0.4, 1.1)
    dent(r, 0.2, 5, i)
    parent(r, root)
pole = cyl("flag_pole", (7.2, 0, 6.0), 0.09, 12.2, 20, material=pole_mat)
parent(pole, root)
flag = plane("flag", (8.9, 0, 10.1), 3.8, 2.5, 28, 18, cloth)
flag.rotation_euler = (math.radians(90), 0, 0)
bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
for v in flag.data.vertices:
    v.co.y += math.sin(v.co.x * 1.7 + v.co.z * 1.3) * 0.22 * (v.co.x + 1.9) / 3.8
solid = flag.modifiers.new("cloth", "SOLIDIFY")
solid.thickness = 0.025
apply_mod(flag, solid)
parent(flag, root)
emblem = torus("flag_emblem", (8.9, -0.25, 10.25), 0.52, 0.05, 40, 8, (math.radians(90), 0, 0), gold2)
parent(emblem, root)
cloak = cyl("figure_cloak", (0, -0.4, 1.2), 0.62, 2.3, 14, material=hero_dark)
for v in cloak.data.vertices:
    if v.co.z > 0:
        v.co.x *= 0.45
        v.co.y *= 0.45
head = ico("figure_head", (0, -0.58, 2.52), 0.3, 2, hero_dark)
active(cloak)
head.select_set(True)
bpy.context.view_layer.objects.active = cloak
bpy.ops.object.join()
cloak.name = "figure"
parent(cloak, root)
export("ruins_hero")

# ---------------------------------------------------------------- A3 corridor
reset(31)
concrete = mat("A3_Concrete", (0.105, 0.098, 0.086), 0.03, 0.93)
dark3 = mat("A3_Dark", (0.023, 0.022, 0.021), 0.1, 0.82)
strip3 = mat("A3_Strip", (1.0, 0.86, 0.56), 0.0, 0.5, (1.0, 0.74, 0.38), 5.0)
root = empty("corridor_brutal")
f = plane("floor", (0, 30, 0), 9.4, 62, 8, 34, dark3)
parent(f, root)
line = cube("floor_strip", (0, 30, 0.025), (0.18, 60, 0.025), material=strip3)
parent(line, root)
for i in range(14):
    y = 30 - i * 4.1
    h = 8.4 + (i % 4) * 0.42
    for side, x in (("L", -4.25), ("R", 4.25)):
        m = cube("monolith_%s_%02d" % (side, i + 1), (x, y, h / 2), (1.15, 0.88, h), material=concrete)
        for v in m.data.vertices:
            if v.co.z > 0:
                v.co.x *= 0.82
                v.co.y *= 0.82
        bevel(m, 0.05, 2)
        subd(m, 2)
        parent(m, root)
        for k, zz in enumerate((h * 0.7, h * 0.32)):
            s = cube("monolith_light_%s_%02d_%d" % (side, i + 1, k), (x - (0.58 if x > 0 else -0.58), y + 0.02, zz),
                     (0.035, 0.03, 1.3 if k == 0 else 0.4), material=strip3)
            parent(s, root)
    slab = cube("ceiling_%02d" % (i + 1), (0, y, h + 1.9), (8.4, 0.4, 0.14), material=dark3)
    parent(slab, root)
door = cube("door_light", (0, 61.8, 4.4), (5.1, 0.22, 7.2), material=strip3)
parent(door, root)
frame = cube("door_frame", (0, 62.15, 4.4), (7.4, 0.4, 9.4), material=dark3)
parent(frame, root)
export("corridor_brutal")

# ---------------------------------------------------------------- A4 tunnel
reset(43)
black = mat("A4_Black", (0.014, 0.015, 0.017), 0.72, 0.19)
neon = mat("A4_Neon", (0.84, 0.92, 1.0), 0.1, 0.3, (0.74, 0.9, 1.0), 7.0)
mirror = mat("A4_Mirror", (0.02, 0.025, 0.032), 0.98, 0.08)
root = empty("tunnel_lines")
floor_m = plane("floor_mirror", (0, 30, 0), 9.6, 64, 4, 24, mirror)
parent(floor_m, root)
for i in range(16):
    y = 30 - i * 4.0
    for side, x in (("L", -4.8), ("R", 4.8)):
        beam = cube("tunnel_frame_%s_%02d" % (side, i + 1), (x * 0.5, y, 4.2), (0.22, 0.3, 8.4),
                    (0, math.radians(9 if x > 0 else -9), 0), black)
        bevel(beam, 0.04, 2)
        subd(beam, 2)
        parent(beam, root)
    ceil = cube("ceiling_light_%02d" % (i + 1), (0, y, 8.55), (9.4, 0.32, 0.16), material=black)
    parent(ceil, root)
    for k, zz in enumerate((2.4, 5.9)):
        bar = cube("neon_%s_%02d_%d" % ("L" if i % 2 else "R", i + 1, k),
                   (-4.35 if i % 2 else 4.35, y + 0.2, zz), (0.07, 0.75, 0.07),
                   (math.radians(45), 0, 0), neon)
        parent(bar, root)
        bar2 = cube("neon_%s_%02d_b" % ("R" if i % 2 else "L", i + 1),
                    (4.35 if i % 2 else -4.35, y + 0.2, zz), (0.07, 0.75, 0.07),
                    (math.radians(-45), 0, 0), neon)
        parent(bar2, root)
centre = cube("floor_strip", (0, 30, 0.02), (0.1, 62, 0.02), material=neon)
parent(centre, root)
export("tunnel_lines")

# ---------------------------------------------------------------- A5 monogram
reset(57)
gold5 = mat("A5_Gold", (0.79, 0.55, 0.2), 1.0, 0.28, (0.95, 0.62, 0.2), 0.7)
dark5 = mat("A5_Shard", (0.04, 0.036, 0.03), 0.9, 0.25, (0.8, 0.5, 0.15), 0.25)
mono = text_mesh("nde_monogram", "NDE", (0, 0, 0), 3.2, 0.42, 0.035, gold5)
bevel(mono, 0.025, 2)
subd(mono, 1)
shattered = empty("monogram_shattered")
for i in range(40):
    s = ico("shard_%02d" % (i + 1), (random.uniform(-4.4, 4.4), random.uniform(-1.6, 1.6),
            random.uniform(-2.4, 2.4)), random.uniform(0.18, 0.62), 2, gold5 if i % 7 == 0 else dark5)
    s.scale = (random.uniform(0.5, 2.2), random.uniform(0.35, 1.1), random.uniform(0.6, 2.4))
    s.rotation_euler = (random.random() * 3, random.random() * 3, random.random() * 3)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    subd(s, 1)
    parent(s, shattered)
export("nde_monogram")
print("A1-A5 DONE")
