import bpy, os, math
out = r"D:\SARIT\NOVEXA- NoirDemons\nde-reel\public\models"
os.makedirs(out, exist_ok=True)

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def export(name):
    bpy.ops.export_scene.gltf(filepath=os.path.join(out,name), export_format='GLB', use_selection=False)
    print("EXPORTED", name)

# A2 ruins_hero
reset()
# two pillars
for i,x in enumerate([-4,4]):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x,0,0))
    o=bpy.context.object; o.scale=(0.6,0.6,3); o.name=f"pillar_{i}"
# fractured top
bpy.ops.mesh.primitive_cube_add(size=1, location=(0,3.2,0)); bpy.context.object.scale=(4.5,0.6,0.6); bpy.context.object.name="arch_top"
# debris
for i in range(25):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.2, location=( (i%5-2)*1.2, 0.2, (i//5-2)*1.2 ))
    bpy.context.object.name=f"debris_{i:02d}"
# figure
bpy.ops.mesh.primitive_cylinder_add(radius=0.3, depth=1.4, location=(0,-1,0)); bpy.context.object.name="figure"
# flag pole
bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=3, location=(3,0,2)); bpy.context.object.name="flag_pole"
export("ruins_hero.glb")

# A3 corridor_brutal
reset()
for i in range(14):
    for s in (-1,1):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(s*3,0,i*4-20))
        o=bpy.context.object; o.scale=(0.4,4,0.4); o.name=f"monolith_{i}_{s}"
bpy.ops.mesh.primitive_plane_add(size=1, location=(0,-0.1,0)); bpy.context.object.scale=(6,1,40); bpy.context.object.name="floor"
bpy.ops.mesh.primitive_cube_add(size=1, location=(0,0,35)); bpy.context.object.scale=(2,3,0.1); bpy.context.object.name="door_light"
export("corridor_brutal.glb")

# A4 tunnel_lines
reset()
for i in range(20):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-3,2,i*3-20)); bpy.context.object.scale=(0.05,0.05,2); bpy.context.object.name=f"neon_L_{i}"
    bpy.ops.mesh.primitive_cube_add(size=1, location=(3,2,i*3-20)); bpy.context.object.scale=(0.05,0.05,2); bpy.context.object.name=f"neon_R_{i}"
bpy.ops.mesh.primitive_plane_add(size=1, location=(0,-0.1,0)); bpy.context.object.scale=(6,1,40); bpy.context.object.name="floor_mirror"
export("tunnel_lines.glb")

print("DONE")