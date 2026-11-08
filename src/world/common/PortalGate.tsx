import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  z: number;
  y?: number;
  color?: string;
  scale?: number;
  ribs?: number;
  glowIntensity?: number;
  coreIntensity?: number;
};

export default function PortalGate({
  z,
  y = 4.2,
  color = "#FFD98C",
  scale = 1,
  ribs = 36,
  glowIntensity = 5.5,
  coreIntensity = 0.15,
}: Props) {
  const inner = useRef<THREE.Group>(null);
  const ribRef = useRef<THREE.InstancedMesh>(null);
  const winRef = useRef<THREE.InstancedMesh>(null);
  const spin = useRef(Math.random() * Math.PI);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    for (let i = 0; i < ribs; i += 1) {
      const a = (i / ribs) * Math.PI * 2;
      const r = 5.55;
      e.set(0, 0, a + Math.PI / 2);
      q.setFromEuler(e);
      m.compose(
        new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0),
        q,
        new THREE.Vector3(0.55, 1.05, 0.72),
      );
      ribRef.current?.setMatrixAt(i, m);
    }
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * Math.PI * 2 + 0.13;
      const r = 4.55;
      e.set(0, 0, a);
      q.setFromEuler(e);
      m.compose(
        new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0.18),
        q,
        new THREE.Vector3(0.32, 0.13, 0.16),
      );
      winRef.current?.setMatrixAt(i, m);
    }
    if (ribRef.current) ribRef.current.instanceMatrix.needsUpdate = true;
    if (winRef.current) winRef.current.instanceMatrix.needsUpdate = true;
  }, [ribs]);

  useFrame(({ clock }, dt) => {
    spin.current += dt * 0.18;
    if (inner.current) {
      inner.current.rotation.z = spin.current;
      inner.current.rotation.x = Math.sin(clock.elapsedTime * 0.16) * 0.08;
    }
  });

  const metal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#171512", metalness: 0.92, roughness: 0.32 }),
    [],
  );
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0c0b09", metalness: 0.8, roughness: 0.55 }),
    [],
  );
  const glow = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff4d7",
        emissive: new THREE.Color(color),
        emissiveIntensity: glowIntensity,
        toneMapped: false,
      }),
    [color, glowIntensity],
  );
  const core = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#080604",
        emissive: new THREE.Color(color),
        emissiveIntensity: coreIntensity,
        toneMapped: false,
      }),
    [color, coreIntensity],
  );
  const amber = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffb85c",
        emissive: new THREE.Color("#ff9b32"),
        emissiveIntensity: 4,
        toneMapped: false,
      }),
    [],
  );

  return (
    <group position={[0, y, z]} scale={scale}>
      <mesh material={metal}>
        <torusGeometry args={[5, 0.46, 20, 96]} />
      </mesh>
      <instancedMesh ref={ribRef} args={[undefined, undefined, ribs]} material={metal}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <mesh material={dark} position={[0, 0, -0.42]}>
        <torusGeometry args={[4.7, 0.7, 16, 96]} />
      </mesh>
      <mesh material={glow} position={[0, 0, 0.18]}>
        <torusGeometry args={[4.18, 0.11, 10, 120]} />
      </mesh>
      <instancedMesh ref={winRef} args={[undefined, undefined, 12]} material={amber}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <group ref={inner}>
        <mesh material={dark}>
          <torusGeometry args={[3.62, 0.16, 12, 90]} />
        </mesh>
        <mesh material={glow} position={[0, 0, 0.04]}>
          <torusGeometry args={[3.35, 0.035, 8, 90]} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} material={metal} rotation={[0, 0, (i / 4) * Math.PI]}>
            <boxGeometry args={[7.16, 0.09, 0.16]} />
          </mesh>
        ))}
      </group>
      <mesh material={dark} position={[0, -5.2, 0]}>
        <boxGeometry args={[8.2, 0.34, 2.2]} />
      </mesh>
      <mesh material={metal} position={[0, -5.55, 0]}>
        <boxGeometry args={[5.4, 0.8, 1.7]} />
      </mesh>
      <mesh material={core} position={[0, 0, 1.3]}>
        <circleGeometry args={[3.3, 64]} />
      </mesh>
    </group>
  );
}
