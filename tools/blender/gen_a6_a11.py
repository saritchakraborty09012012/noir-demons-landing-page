"""A6-A11 detailed asset generation. Run: blender -b -P gen_a6_a11.py"""
import bpy, bmesh, math, random, sys, os
from mathutils import Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib_nde import *


def beam(name, a, b, thick, material, sides=12, density=1):
    va, vb = Vector(a), Vector(b)
    d = vb - va
    mid = (va + vb) * 0.5
    o = cyl(name, mid, thick, d.length, sides, material=material)
    o.rotation_euler = Vector((0, 0, 1)).rotation_difference(d.normalized()).to_euler()
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    if density:
        subd(o, density)
    return o


def curve_mesh(name, points, radius, material):
    cu = bpy.data.curves.new(name + "_curve", "CURVE")
    cu.dimensions = "3D"
    cu.resolution_u = 8
    cu.bevel_depth = radius
    cu.bevel_resolution = 2
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(points) - 1)
    for bp, co in zip(sp.bezier_points, points):
        bp.co = co
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"
    o = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(o)
    active(o)
    bpy.ops.object.convert(target="MESH")
    o = bpy.context.object
    assign(o, material)
    return o


# ---------------------------------------------------------------- A6 star
reset(61)
obsidian = mat("A6_Obsidian", (0.012, 0.014, 0.021), 0.9, 0.2)
gold6 = mat("A6_Gold", (0.78, 0.53, 0.18), 1.0, 0.26, (1.0, 0.64, 0.22), 1.2)
core = ico("star_core", (0, 0, 0), 2.0, 6, obsidian)
for v in core.data.vertices:
    r = 1.0 + 0.18 * math.sin(v.co.x * 4.1) * math.sin(v.co.y * 3.7) * math.sin(v.co.z * 4.9)
    v.co *= r
core.data.update()
shade(core)
for i in range(18):
    a = i / 18 * TAU
    z = math.sin(i * 1.7) * 0.75
    d = Vector((math.cos(a), math.sin(a) * 0.55, z)).normalized()
    sp = cyl("spike_%02d" % (i + 1), d * 2.4, 0.28, 1.7, 6, material=obsidian)
    sp.rotation_euler = Vector((0, 0, 1)).rotation_difference(d).to_euler()
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    parent(sp, core)
face = text_mesh("monogram_face", "NDE", (0, -2.12, 0), 0.82, 0.08, 0.012, gold6)
parent(face, core)
rim = torus("star_rim", (0, 0, 0), 2.12, 0.026, 120, 8, (math.radians(90), 0, 0), gold6)
parent(rim, core)
export("star_core")

# ---------------------------------------------------------------- A7 crystal
reset(67)
gem = mat("A7_Quartz", (0.28, 0.52, 0.72), 0.16, 0.06, (0.32, 0.66, 1.0), 0.55)
mesh = bpy.data.meshes.new("crystal_shard_mesh")
obj = bpy.data.objects.new("crystal_shard", mesh)
bpy.context.collection.objects.link(obj)
bm = bmesh.new()
profile = [(-2.6, 0.0), (-2.05, 0.2), (-1.25, 0.46), (-0.45, 0.68), (0.35, 0.72), (1.15, 0.5), (1.95, 0.22), (2.6, 0.0)]
rings = []
for ri, (z, r) in enumerate(profile):
    if r == 0:
        rings.append([bm.verts.new((0, 0, z))])
        continue
    row = []
    for j in range(12):
        a = j / 12 * TAU + (ri % 2) * math.pi / 12
        rr = r * (1.0 if j % 2 == 0 else 0.9)
        row.append(bm.verts.new((math.cos(a) * rr, math.sin(a) * rr, z)))
    rings.append(row)
for i in range(len(rings) - 1):
    a, b = rings[i], rings[i + 1]
    if len(a) == 1:
        for j in range(12):
            bm.faces.new((a[0], b[j], b[(j + 1) % 12]))
    elif len(b) == 1:
        for j in range(12):
            bm.faces.new((a[j], a[(j + 1) % 12], b[0]))
    else:
        for j in range(12):
            bm.faces.new((a[j], a[(j + 1) % 12], b[(j + 1) % 12], b[j]))
bm.to_mesh(mesh)
bm.free()
assign(obj, gem)
bevel(obj, 0.025, 2)
subd(obj, 3)
shade(obj)
export("crystal_shard")

# ---------------------------------------------------------------- A8 engine
reset(71)
gun = mat("A8_Gunmetal", (0.07, 0.082, 0.1), 0.94, 0.24)
panel = mat("A8_Panel", (0.025, 0.032, 0.042), 0.8, 0.35)
blue = mat("A8_Plasma", (0.2, 0.55, 1.0), 0.3, 0.2, (0.16, 0.55, 1.0), 5.0)
warm = mat("A8_Warm", (0.8, 0.65, 0.35), 0.5, 0.28, (1.0, 0.75, 0.38), 3.2)
root = empty("engine_tower")
base = empty("base_deploy")
parent(base, root)
b = cyl("base_ring", (0, 0, 0.35), 4.55, 1.2, 64, material=gun)
bevel(b, 0.07, 2)
subd(b, 1)
parent(b, base)
b2 = cyl("base_core", (0, 0, 1.0), 3.45, 0.75, 48, material=panel)
bevel(b2, 0.06, 2)
parent(b2, base)
for i in range(12):
    a = i / 12 * TAU
    br = cube("base_bracket_%02d" % (i + 1), (math.cos(a) * 3.9, math.sin(a) * 3.9, 0.4),
              (0.72, 0.42, 1.4), (0, 0, -a), gun)
    bevel(br, 0.04, 2)
    parent(br, base)
bt = torus("base_glow", (0, 0, 0.22), 4.62, 0.05, 128, 8, material=blue)
parent(bt, base)
shell = empty("shell_interface")
parent(shell, root)
for i in range(12):
    a = i / 12 * TAU
    pil = cube("shell_pillar_%02d" % (i + 1), (math.cos(a) * 6.0, math.sin(a) * 6.0, 3.7),
               (0.26, 0.6, 8.2), (0, 0, -a), gun)
    bevel(pil, 0.035, 2)
    subd(pil, 1)
    parent(pil, shell)
for z in (0.2, 7.4):
    t = torus("shell_ring_%d" % int(z), (0, 0, z), 6.0, 0.15, 112, 12, material=panel)
    parent(t, shell)

rings_m = empty("rings_model")
parent(rings_m, root)
for i in range(3):
    t = torus("ringM_%d" % (i + 1), (0, 0, 3.8 + (i - 1) * 0.5), 3.3, 0.065, 112, 10,
              (math.radians(8), 0, i * 0.4), gun)
    parent(t, rings_m)
for i in range(18):
    a = i / 18 * TAU
    d = cube("model_dash_%02d" % (i + 1), (math.cos(a) * 3.7, math.sin(a) * 3.7, 3.8 + (i % 3 - 1) * 0.3),
             (0.07, 0.35, 0.16), (0, 0, -a), blue)
    parent(d, rings_m)
rings_d = empty("rings_data")
parent(rings_d, root)
for i in range(5):
    t = torus("ringD_%d" % (i + 1), (0, 0, 3.8 + (i - 2) * 0.36), 4.9, 0.045, 128, 8,
              (math.radians(18), 0, i * 0.32), blue)
    parent(t, rings_d)
for i in range(32):
    a = i / 32 * TAU
    d = cube("data_dash_%02d" % (i + 1), (math.cos(a) * 4.25, math.sin(a) * 4.25, 3.8 + (i % 5 - 2) * 0.3),
             (0.08, 0.3, 0.14), (0, 0, -a), blue)
    parent(d, rings_d)
idea = empty("core_idea")
parent(idea, root)
c = ico("core_orb", (0, 0, 3.9), 1.82, 4, blue)
parent(c, idea)
cw = ico("core_wire", (0, 0, 3.9), 1.86, 3, blue)
wire = cw.modifiers.new("wire", "WIREFRAME")
wire.thickness = 0.018
apply_mod(cw, wire)
parent(cw, idea)
for i in range(5):
    t = torus("core_ring_%d" % (i + 1), (0, 0, 3.9), 2.35 + i * 0.14, 0.018, 96, 6,
              (math.radians(24 + i * 11), math.radians(12), i * 0.4), warm)
    parent(t, idea)
export("engine_tower")

# ---------------------------------------------------------------- A9 rack
reset(79)
rack_metal = mat("A9_Metal", (0.025, 0.03, 0.037), 0.92, 0.28)
rack_dark = mat("A9_Dark", (0.012, 0.014, 0.018), 0.5, 0.5)
led_blue = mat("A9_LED", (0.25, 0.6, 1.0), 0.2, 0.25, (0.2, 0.62, 1.0), 7.0)
led_warm = mat("A9_LEDWarm", (0.9, 0.55, 0.2), 0.2, 0.3, (1.0, 0.58, 0.2), 4.0)
root = empty("server_rack")
for i, (x, y) in enumerate(((-0.95, -0.5), (0.95, -0.5), (-0.95, 0.5), (0.95, 0.5))):
    p = cube("rack_post_%d" % (i + 1), (x, y, 2.3), (0.1, 0.1, 4.8), material=rack_metal)
    bevel(p, 0.02, 2)
    parent(p, root)
for i in range(30):
    z = 0.25 + i * 0.145
    u = cube("rack_unit_%02d" % (i + 1), (0, -0.48, z), (1.78, 0.12, 0.82), material=rack_dark)
    bevel(u, 0.012, 2)
    subd(u, 2)
    parent(u, root)
    for k in range(3):
        vent = cube("rack_vent_%02d_%d" % (i + 1, k), (-0.45 + k * 0.3, -0.55, z),
                    (0.2, 0.015, 0.45), material=rack_metal)
        parent(vent, root)
    for k in range(2):
        led = cube("led_%02d_%d" % (i + 1, k), (0.68, -0.56, z + (k - 0.5) * 0.22),
                   (0.035, 0.025, 0.035), material=led_blue if (i + k) % 4 else led_warm)
        parent(led, root)
for i in range(14):
    pts = [(-0.4 + i * 0.06, 0.55, 0.3 + (i % 4) * 0.6),
           (-1.4 - i * 0.08, 1.1, 0.2 + (i % 3) * 0.45),
           (-1.8 - i * 0.1, 0.5, -0.1 + (i % 5) * 0.35)]
    c = curve_mesh("cable_%02d" % (i + 1), pts, 0.022, rack_metal)
    parent(c, root)
export("server_rack")

# ---------------------------------------------------------------- A10 house
reset(83)
wire_mat = mat("A10_Wire", (0.5, 0.72, 0.92), 0.55, 0.28, (0.45, 0.72, 1.0), 2.4)
glass_mat = mat("A10_Glass", (0.02, 0.04, 0.055), 0.4, 0.12)
root = empty("house_wire")
W, D, H = 6.0, 4.0, 7.2
pts = {}
for x in (-W, 0, W):
    for y in (-D, D):
        for z in (0, 3.5, H):
            pts[(x, y, z)] = (x, y, z)
edges = []
for x in (-W, W):
    for y in (-D, D):
        edges += [(x, y, 0, x, y, H)]
for z in (0, 3.5, H):
    edges += [(-W, -D, z, W, -D, z), (-W, D, z, W, D, z), (-W, -D, z, -W, D, z), (W, -D, z, W, D, z)]
for x in (-W, 0, W):
    edges += [(x, -D, 3.5, x, D, 3.5)]
for y in (-D, D):
    edges += [(-W, y, 3.5, W, y, 3.5)]
edges += [(-W, -D, H, 0, 0, H + 3.0), (W, -D, H, 0, 0, H + 3.0),
          (-W, D, H, 0, 0, H + 3.0), (W, D, H, 0, 0, H + 3.0)]
for i, e in enumerate(edges):
    b = beam("house_edge_%03d" % (i + 1), e[:3], e[3:], 0.035, wire_mat, 10, 3)
    parent(b, root)
for i, (x, y) in enumerate(((-3.6, -D), (0, -D), (3.6, -D), (-3.6, D), (0, D), (3.6, D))):
    for z in (1.75, 5.35):
        w = beam("house_mullion_%02d_%d" % (i + 1, int(z * 10)), (x, y, z), (x, y, z + 1.6), 0.018, wire_mat, 8, 2)
        parent(w, root)
for i, (x, y) in enumerate(((-2, -D), (2, -D), (-2, D), (2, D))):
    g = cube("house_glass_%d" % (i + 1), (x, y * 0.99, 3.5), (2.4, 0.02, 3.4), material=glass_mat)
    parent(g, root)
grid_objs = []
for i in range(21):
    v = -10 + i
    grid_objs.append(cube("grid_x_%02d" % i, (0, v, -0.03), (20, 0.012, 0.012), material=wire_mat))
    grid_objs.append(cube("grid_y_%02d" % i, (v, 0, -0.03), (0.012, 20, 0.012), material=wire_mat))
active(grid_objs[0])
for o in grid_objs:
    o.select_set(True)
bpy.context.view_layer.objects.active = grid_objs[0]
bpy.ops.object.join()
grid_objs[0].name = "ground_grid"
parent(grid_objs[0], root)
export("house_wire")

# ---------------------------------------------------------------- A11 key
reset(89)
chrome = mat("A11_Chrome", (0.62, 0.68, 0.74), 1.0, 0.12)
cyan = mat("A11_Cyan", (0.35, 0.75, 1.0), 0.4, 0.18, (0.28, 0.75, 1.0), 5.0)
root = empty("key")
head = torus("key_head", (0, 0, 1.75), 0.75, 0.17, 96, 18, (math.radians(90), 0, 0), chrome)
subd(head, 1)
parent(head, root)
edge = torus("key_ring_glow", (0, -0.03, 1.75), 0.93, 0.025, 96, 8, (math.radians(90), 0, 0), cyan)
parent(edge, root)
shaft = cyl("key_shaft", (0, 0, -0.3), 0.13, 3.2, 32, material=chrome)
bevel(shaft, 0.025, 2)
subd(shaft, 2)
parent(shaft, root)
for i, z in enumerate((-1.35, -1.65, -1.95)):
    t = cube("key_tooth_%d" % (i + 1), (0.35 + i * 0.04, 0, z), (0.6, 0.18, 0.18), material=chrome)
    bevel(t, 0.03, 2)
    parent(t, root)
teeth = empty("key_teeth")
for o in bpy.data.objects:
    if o.name.startswith("key_tooth"):
        parent(o, teeth)
parent(teeth, root)
glyph = text_mesh("key_glyph", "NDE", (0, -0.2, 1.75), 0.22, 0.025, 0.006, cyan)
parent(glyph, root)
export("key")
print("A6-A11 DONE")
