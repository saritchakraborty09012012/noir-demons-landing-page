import bpy
bpy.ops.mesh.primitive_cube_add(size=1)
bpy.ops.export_scene.gltf(filepath=r"D:\SARIT\NOVEXA- NoirDemons\nde-reel\public\models\test.glb")
print("EXPORTED")