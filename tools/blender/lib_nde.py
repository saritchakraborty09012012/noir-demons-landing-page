"""Shared NDE asset-pipeline helpers for Blender 5.0."""
import bpy, bmesh, math, os, random, json
from mathutils import Vector

OUT = r"D:\SARIT\NOVEXA- NoirDemons\nde-reel\public\models"
MANIFEST = os.path.join(OUT, "manifest.json")
TAU = math.pi * 2


def reset(seed=7):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    random.seed(seed)
    os.makedirs(OUT, exist_ok=True)


def mat(name, color, metallic=0.0, roughness=0.5, emit=None, strength=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = roughness
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1.0)
        b.inputs["Emission Strength"].default_value = strength
    return m


def assign(obj, material):
    obj.data.materials.clear()
    obj.data.materials.append(material)
    return obj


def active(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    return obj


def apply_mod(obj, mod):
    active(obj)
    bpy.ops.object.modifier_apply(modifier=mod.name)


def bevel(obj, width=0.05, segments=2, angle=40):
    m = obj.modifiers.new("bevel", "BEVEL")
    m.width = width
    m.segments = segments
    m.limit_method = "ANGLE"
    m.angle_limit = math.radians(angle)
    apply_mod(obj, m)
    return obj


def subd(obj, levels=1, simple=True):
    m = obj.modifiers.new("density", "SUBSURF")
    m.subdivision_type = "SIMPLE" if simple else "CATMULL_CLARK"
    m.levels = levels
    m.render_levels = levels
    apply_mod(obj, m)
    return obj


def tri(obj):
    m = obj.modifiers.new("tri", "TRIANGULATE")
    apply_mod(obj, m)
    return obj


def shade(obj, smooth=False):
    active(obj)
    if smooth:
        bpy.ops.object.shade_smooth_by_angle()
    else:
        bpy.ops.object.shade_flat()
    return obj


def cube(name, loc, scale, rot=(0, 0, 0), material=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.data.name = name + "_mesh"
    o.scale = scale
    o.rotation_euler = rot
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    if material:
        assign(o, material)
    return o


def cyl(name, loc, radius, depth, vertices=32, rot=(0, 0, 0), material=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    o = bpy.context.object
    o.name = name
    o.data.name = name + "_mesh"
    o.rotation_euler = rot
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    if material:
        assign(o, material)
    return o


def torus(name, loc, major, minor, ms=64, ns=12, rot=(0, 0, 0), material=None):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major, minor_radius=minor, major_segments=ms, minor_segments=ns, location=loc
    )
    o = bpy.context.object
    o.name = name
    o.data.name = name + "_mesh"
    o.rotation_euler = rot
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    if material:
        assign(o, material)
    return o


def ico(name, loc, radius=1.0, subdiv=2, material=None):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdiv, radius=radius, location=loc)
    o = bpy.context.object
    o.name = name
    o.data.name = name + "_mesh"
    if material:
        assign(o, material)
    return o


def plane(name, loc, sx, sy, cuts_x=1, cuts_y=1, material=None):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.data.name = name + "_mesh"
    o.scale = (sx, sy, 1)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if cuts_x > 1 or cuts_y > 1:
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.subdivide(number_cuts=max(cuts_x, cuts_y) - 1)
        bpy.ops.object.mode_set(mode="OBJECT")
    if material:
        assign(o, material)
    return o


def text_mesh(name, body, loc, size=2.0, extrude=0.3, depth=0.03, material=None, front=True, spacing=1.0):
    bpy.ops.object.text_add(location=loc)
    o = bpy.context.object
    o.name = name
    o.data.name = name + "_mesh"
    o.data.body = body
    o.data.size = size
    o.data.extrude = extrude
    o.data.bevel_depth = depth
    o.data.bevel_resolution = 2
    o.data.resolution_u = 6
    o.data.space_character = spacing
    o.data.align_x = "CENTER"
    o.data.align_y = "CENTER"
    if front:
        o.rotation_euler = (math.radians(90), 0, 0)
    active(o)
    bpy.ops.object.convert(target="MESH")
    o = bpy.context.object
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    if material:
        assign(o, material)
    return o


def dent(obj, strength=0.12, freq=4.0, seed=1.0):
    for v in obj.data.vertices:
        n = math.sin(v.co.x * freq + seed) * math.sin(v.co.y * freq * 0.73 + seed * 1.7)
        n *= math.sin(v.co.z * freq * 0.41 + seed * 2.3)
        v.co += v.normal * (n * strength)
    obj.data.update()
    return obj


def empty(name, loc=(0, 0, 0)):
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=loc)
    o = bpy.context.object
    o.name = name
    return o


def parent(child, root):
    child.parent = root
    return child


def tris():
    dg = bpy.context.evaluated_depsgraph_get()
    total = 0
    for o in bpy.data.objects:
        if o.type != "MESH":
            continue
        e = o.evaluated_get(dg)
        me = e.to_mesh()
        me.calc_loop_triangles()
        total += len(me.loop_triangles)
        e.to_mesh_clear()
    return total


def export(name):
    path = os.path.join(OUT, name + ".glb")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=False,
        export_apply=True,
        export_animations=False,
        export_cameras=False,
        export_lights=False,
        export_yup=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_draco_position_quantization=14,
        export_draco_normal_quantization=10,
        export_draco_texcoord_quantization=12,
    )
    size = os.path.getsize(path)
    entry = {"name": name, "tris": tris(), "bytes": size}
    data = {}
    if os.path.exists(MANIFEST):
        try:
            data = json.load(open(MANIFEST, "r", encoding="utf-8"))
        except Exception:
            data = {}
    data[name] = entry
    json.dump(data, open(MANIFEST, "w", encoding="utf-8"), indent=2, sort_keys=True)
    print("EXPORTED %-18s %6d tris  %7.2f MB" % (name, entry["tris"], size / 1048576))
    return entry
