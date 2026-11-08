import { useMemo, useRef, useState } from "react";
import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReel } from "../../store/useReel";
import { clamp01 } from "../chapters";
import { jumpTo } from "../../lib/scroll";
import { PRODUCTS } from "../../content/content";
import { FONT_MONO, FONT_SERIF_IT } from "../fonts";
import { Headline3D } from "../common/Headline3D";
import { Starfield, Dust } from "../common/Particles";
import { useMobile } from "../useMobile";

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.25, "rgba(255,255,255,0.34)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function StarCore() {
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(3, 2);
    const pos = g.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i += 1) {
      v.fromBufferAttribute(pos, i);
      const n = Math.sin(v.x * 2.1) * Math.cos(v.y * 1.7) * Math.sin(v.z * 2.6);
      const len = 3 + n * 0.95 + Math.abs(Math.sin(v.x * 5.3 + v.y * 3.1)) * 0.55;
      v.normalize().multiplyScalar(len);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.07;
    ref.current.rotation.x = Math.sin(0 + ref.current.rotation.y * 0.6) * 0.16;
  });
  return (
    <group>
      <group ref={ref}>
        <mesh geometry={geo}>
          <meshStandardMaterial color="#0b0d15" metalness={0.92} roughness={0.22} emissive="#122449" emissiveIntensity={0.55} />
        </mesh>
        <mesh geometry={geo} scale={1.012}>
          <meshBasicMaterial color="#B9964B" wireframe transparent opacity={0.14} toneMapped={false} />
        </mesh>
      </group>
      <pointLight color="#8fa9ff" intensity={22} distance={20} decay={2} />
      <pointLight color="#ffcf7e" intensity={12} distance={16} decay={2} position={[2, 3, 3]} />
      <Billboard position={[0, 0.1, 4.1]}>
        <Text font={FONT_SERIF_IT} fontSize={2.1} color="#E8CE92" anchorX="center" anchorY="middle" letterSpacing={0.02}>
          NDE
        </Text>
      </Billboard>
      {[5.6, 6.8, 8.1].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2.4 + i * 0.12, i * 0.4, 0.2 + i * 0.1]}>
          <torusGeometry args={[r, i === 1 ? 0.045 : 0.022, 8, 160]} />
          <meshStandardMaterial color="#C9A24B" emissive="#8A6A21" emissiveIntensity={1.2} metalness={1} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function Crystal({
  index,
  texture,
}: {
  index: number;
  texture: THREE.Texture;
}) {
  const product = PRODUCTS[index];
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const label = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const baseAngle = (index / PRODUCTS.length) * Math.PI * 2;
  const radius = 8.5 + (index % 3) * 0.45;
  const baseY = Math.sin(index * 1.7) * 1.9;

  useFrame(({ clock }, dt) => {
    if (!group.current || !inner.current) return;
    const state = useReel.getState();
    const focused = state.focusProduct === index;
    const angle = baseAngle + clock.elapsedTime * 0.032;
    group.current.position.set(
      Math.cos(angle) * radius,
      baseY + Math.sin(clock.elapsedTime * 0.5 + index) * 0.22,
      Math.sin(angle) * radius,
    );
    const target = focused ? 1.35 : hovered ? 1.2 : 1;
    const s = group.current.scale.x + (target - group.current.scale.x) * Math.min(1, dt * 4);
    group.current.scale.setScalar(s);
    inner.current.rotation.y += dt * (focused ? 0.7 : 0.25);
    inner.current.rotation.z = Math.sin(clock.elapsedTime * 0.4 + index) * 0.12;
    const labelOn = focused || hovered;
    if (label.current) {
      label.current.visible = labelOn;
      label.current.traverse((c: any) => {
        if (c.material && "opacity" in c.material) {
          c.material.transparent = true;
          c.material.opacity = labelOn ? 1 : 0;
        }
      });
    }
  });

  return (
    <group
      ref={group}
      position={[0, baseY, radius]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        jumpTo(0.318 + index * (0.09 / PRODUCTS.length), 1.15);
      }}
    >
      <group ref={inner}>
        <mesh scale={[0.52, 1.55, 0.52]}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshPhysicalMaterial
            color={product.color}
            emissive={product.color}
            emissiveIntensity={0.3}
            metalness={0.42}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            iridescence={0.8}
            iridescenceIOR={1.4}
          />
        </mesh>
        <mesh scale={[1.24, 3.3, 1.24]} rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.52, 0]} />
          <meshBasicMaterial color={product.color} wireframe transparent opacity={0.18} toneMapped={false} />
        </mesh>
        <mesh userData={{ glow: true }} position={[0, 0.1, -0.1]} scale={4.2}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial map={texture} color={product.color} transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <torusGeometry args={[1.35, 0.018, 6, 80]} />
          <meshBasicMaterial color={product.color} transparent opacity={0.55} toneMapped={false} />
        </mesh>
      </group>
      <group ref={label} visible={false}>
        <Billboard position={[0, 2.35, 0]}>
          <Text font={FONT_SERIF_IT} fontSize={0.58} color="#ECE7DD" anchorX="center" anchorY="middle">
            {product.name}
          </Text>
          <Text font={FONT_MONO} fontSize={0.17} color={product.color} anchorX="center" anchorY="middle" position={[0, -0.42, 0]} letterSpacing={0.12}>
            {product.no} / {product.category.toUpperCase()}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

export default function S04Constellation() {
  const texture = useMemo(glowTexture, []);
  const mobile = useMobile();
  const step = useRef(-1);

  useFrame(() => {
    const p = useReel.getState().p;
    const local = clamp01((p - 0.315) / 0.09);
    const next = Math.min(PRODUCTS.length - 1, Math.floor(local * PRODUCTS.length));
    if (p > 0.315 && p < 0.412 && next !== step.current) {
      step.current = next;
      useReel.getState().setFocusProduct(next);
    }
  });

  return (
    <group>
      <ambientLight color="#8b98b8" intensity={0.32} />
      <directionalLight color="#dbe6ff" intensity={1.1} position={[-12, 18, -175]} />
      <Starfield count={3400} radius={58} size={0.1} opacity={0.7} speed={0.008} origin={[0, 0, -205]} />
      <Starfield count={900} radius={26} size={0.045} opacity={0.55} speed={-0.013} color="#ffd9a0" origin={[0, 0, -205]} />

      <group position={[0, -0.5, -205]} scale={mobile ? 0.52 : 0.78}>
        <StarCore />
        {PRODUCTS.map((_, i) => (
          <Crystal key={i} index={i} texture={texture} />
        ))}
        <Dust count={850} spread={[30, 18, 24]} origin={[0, 1, 0]} color="#bcd3ff" size={0.035} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[11.2, 11.7, 120, 1, 0, Math.PI * 1.65]} />
          <meshBasicMaterial color="#C9A24B" transparent opacity={0.18} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>

      <Billboard position={[0, 5.4, -205]} scale={mobile ? 0.4 : 0.9}>
        <Headline3D
          pStart={0.292}
          pEnd={0.43}
          maxWidth={34}
          anchorX="center"
          lines={[
            { text: "Ten ways", size: 1.25, italic: true, y: 0.95, letterSpacing: 0 },
            { text: "to move forward.", size: 2.05, italic: true, y: -1.35, color: "#EBCB82" },
          ]}
        />
      </Billboard>

      <pointLight color="#C9A24B" intensity={16} distance={28} decay={2} position={[0, 6, -197]} />
    </group>
  );
}
