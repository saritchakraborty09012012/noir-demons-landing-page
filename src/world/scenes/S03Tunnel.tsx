import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, Text } from "@react-three/drei";
import * as THREE from "three";
import { useReel } from "../../store/useReel";
import { clamp01, smooth } from "../chapters";
import { Headline3D } from "../common/Headline3D";
import { FONT_DISPLAY, FONT_SERIF_IT } from "../fonts";
import { Starfield } from "../common/Particles";
import { useMobile } from "../useMobile";

function Shards({ count = 44 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 0.4 + Math.random() * 1.6;
        return {
          base: new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            3.2 + r * Math.sin(phi) * Math.sin(theta) * 0.8,
            -138 + r * Math.cos(phi) * 0.5,
          ),
          dir: new THREE.Vector3(
            Math.cos(theta) * (1 + Math.random()),
            Math.sin(phi) * (0.5 + Math.random()),
            1.5 + Math.random() * 5,
          ),
          rot: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6),
          s: 0.12 + Math.random() * 0.35,
        };
      }),
    [count],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = useReel.getState().p;
    const t = smooth(0.198, 0.258, p);
    const collapse = 1 - smooth(0.258, 0.285, p) * 0.9;
    seeds.forEach((s, i) => {
      const push = t * collapse;
      dummy.position.copy(s.base).addScaledVector(s.dir, push * 3.4);
      dummy.position.y += Math.sin(clock.elapsedTime * 0.8 + i) * 0.18 * push;
      dummy.rotation.set(s.rot.x + t * 3, s.rot.y + t * 2, s.rot.z + t * 4);
      const scale = s.s * (1 + push * 0.7);
      dummy.scale.set(scale, scale * 1.7, scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#C9A24B"
        emissive="#8A6A21"
        emissiveIntensity={0.6}
        metalness={1}
        roughness={0.22}
      />
    </instancedMesh>
  );
}

function NeonTunnel() {
  const quality = useReel((s) => s.quality);
  const glow = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#f4fbff",
        toneMapped: false,
      }),
    [],
  );
  const black = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#060708", roughness: 0.18, metalness: 0.75 }),
    [],
  );
  const frames = useMemo(() => Array.from({ length: 17 }, (_, i) => i), []);

  return (
    <group>
      {frames.map((i) => {
        const z = -114 - i * 3.35;
        return (
          <group key={i} position={[0, 0, z]}>
            {[-1, 1].map((side) => (
              <group key={side}>
                <mesh position={[side * 2.5, 3.5, 0]} rotation={[0, 0, side * -0.92]} material={black}>
                  <boxGeometry args={[8.8, 0.32, 0.42]} />
                </mesh>
                <mesh position={[side * 2.55, 3.55, 0.05]} rotation={[0, 0, side * -0.92]} material={glow}>
                  <boxGeometry args={[7.7, 0.045, 0.05]} />
                </mesh>
              </group>
            ))}
            <mesh position={[0, 7.05, 0]} material={black}>
              <boxGeometry args={[8.4, 0.3, 0.4]} />
            </mesh>
            <mesh position={[0, 6.92, 0]} material={glow}>
              <boxGeometry args={[2.6, 0.03, 0.06]} />
            </mesh>
          </group>
        );
      })}
      {Array.from({ length: 9 }).map((_, i) => (
        <group key={`x${i}`} position={[i % 2 ? 3.62 : -3.62, 3.2, -121 - i * 5.1]} rotation={[0, 0, i % 2 ? -0.8 : 0.8]}>
          <mesh material={glow}>
            <boxGeometry args={[0.035, 5.4, 0.04]} />
          </mesh>
        </group>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -143]}>
        <planeGeometry args={[12, 70]} />
        {quality === "LITE" ? (
          <meshStandardMaterial color="#07080a" metalness={0.25} roughness={0.58} />
        ) : (
          <MeshReflectorMaterial
            resolution={512}
            mirror={0.85}
            blur={[240, 80]}
            mixBlur={1.1}
            mixStrength={3.2}
            depthScale={0.4}
            color="#0a0b0d"
            metalness={0.65}
            roughness={0.32}
          />
        )}
      </mesh>
    </group>
  );
}

export default function S03Tunnel() {
  const mobile = useMobile();
  const monogram = useRef<any>(null);
  useFrame(() => {
    if (!monogram.current) return;
    const p = useReel.getState().p;
    const out = 1 - smooth(0.202, 0.228, p);
    monogram.current.material.transparent = true;
    monogram.current.material.opacity = out;
    monogram.current.visible = out > 0.01;
  });

  return (
    <group>
      <ambientLight color="#9bb6cc" intensity={0.35} />
      <pointLight color="#3BA0FF" intensity={30} distance={35} position={[-2, 2.5, -135]} />
      <pointLight color="#ffffff" intensity={9} distance={22} position={[2.5, 7, -158]} />
      <NeonTunnel />
      <Starfield count={900} radius={40} size={0.05} opacity={0.6} speed={0.02} origin={[0, 2, -140]} />

      <Text
        ref={monogram}
        font={FONT_SERIF_IT}
        fontSize={3.8}
        color="#EDD49B"
        position={[0, 3.3, -137]}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        NDE
      </Text>

      <group position={[0, 3.3, -142]} scale={mobile ? 0.52 : 1}>
        <Headline3D
          pStart={0.2}
          pEnd={0.24}
          delay={0}
          maxWidth={24}
          lines={[{ text: "IMPACT", size: 4.1, color: "#D8D2C5", display: true, letterSpacing: 0.02 }]}
        />
      </group>
      <group position={[0, 3.2, -160]} scale={mobile ? 0.52 : 1}>
        <Headline3D
          pStart={0.245}
          pEnd={0.287}
          delay={0}
          maxWidth={24}
          lines={[{ text: "RISE", size: 4.4, color: "#F3DDA0", display: true, letterSpacing: 0.04 }]}
        />
      </group>
      <Text
        font={FONT_DISPLAY}
        fontSize={0.55}
        color="#C9A24B"
        position={[0, 1.1, -160]}
        anchorX="center"
        letterSpacing={0.5}
      >
        BREAK / LEARN / REBUILD
      </Text>

      <Shards count={44} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -140]}>
        <ringGeometry args={[2.2, 2.35, 64]} />
        <meshBasicMaterial color="#3BA0FF" transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}
