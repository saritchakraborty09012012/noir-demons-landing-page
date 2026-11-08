import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

let dot: THREE.CanvasTexture | null = null;

/** Soft round sprite so point particles never read as hard squares up close. */
function dotTexture() {
  if (dot) return dot;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.72)");
  gradient.addColorStop(0.72, "rgba(255,255,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  dot = new THREE.CanvasTexture(canvas);
  dot.colorSpace = THREE.SRGBColorSpace;
  return dot;
}

export function Starfield({
  count = 3000,
  radius = 120,
  size = 0.12,
  color = "#cfd8ff",
  opacity = 0.8,
  speed = 0.01,
  origin = [0, 0, 0],
}: {
  count?: number;
  radius?: number;
  size?: number;
  color?: string;
  opacity?: number;
  speed?: number;
  origin?: [number, number, number];
}) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = radius * (0.35 + Math.random() * 0.65);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count, radius]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });

  return (
    <points ref={ref} geometry={geo} position={origin}>
      <pointsMaterial
        map={dotTexture()}
        alphaTest={0.02}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function Dust({
  count = 1200,
  spread = [10, 8, 16],
  origin = [0, 0, 0],
  color = "#f0c681",
  size = 0.035,
}: {
  count?: number;
  spread?: [number, number, number];
  origin?: [number, number, number];
  color?: string;
  size?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * spread[0];
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.012;
      ref.current.position.y = origin[1] + Math.sin(clock.elapsedTime * 0.18) * 0.08;
    }
  });

  return (
    <points ref={ref} geometry={geo} position={origin}>
      <pointsMaterial
        map={dotTexture()}
        alphaTest={0.02}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function GodRay({
  position = [0, 8, 0],
  color = "#ffc777",
  scale = 1,
  opacity = 0.075,
}: {
  position?: [number, number, number];
  color?: string;
  scale?: number | [number, number, number];
  opacity?: number;
}) {
  return (
    <mesh position={position} scale={scale} rotation={[0, 0, 0]}>
      <coneGeometry args={[5.6, 16, 32, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
