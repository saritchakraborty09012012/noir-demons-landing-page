import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useReel } from "../../store/useReel";
import { clamp01, smooth } from "../chapters";
import { Headline3D } from "../common/Headline3D";
import { Dust } from "../common/Particles";
import { useMobile } from "../useMobile";

export default function S02Corridor() {
  const mobile = useMobile();
  const door = useRef<THREE.Mesh>(null);
  const doorLight = useRef<THREE.PointLight>(null);

  const concrete = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#272522", roughness: 0.94, metalness: 0.03 }),
    [],
  );
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#111110", roughness: 0.88, metalness: 0.1 }),
    [],
  );
  const strip = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff2cf",
        emissive: new THREE.Color("#ffd89b"),
        emissiveIntensity: 3.4,
        toneMapped: false,
      }),
    [],
  );

  const bays = useMemo(() => Array.from({ length: 14 }, (_, i) => i), []);

  useFrame(({ clock }) => {
    const p = useReel.getState().p;
    const local = clamp01((p - 0.105) / 0.09);
    const open = smooth(0.56, 0.82, local);
    if (door.current) {
      door.current.scale.x = 0.04 + open * 0.96;
      door.current.scale.y = 0.04 + open * 0.96;
    }
    if (doorLight.current) doorLight.current.intensity = 35 + open * 220 + Math.sin(clock.elapsedTime * 3) * 4;
    strip.emissiveIntensity = 2.2 + Math.sin(clock.elapsedTime * 2.4 + local * 12) * 0.8 + open * 2;
  });

  return (
    <group>
      <ambientLight color="#8d877b" intensity={0.4} />
      <directionalLight color="#ffe3b8" intensity={1.1} position={[0, 8, -60]} />
      <pointLight color="#ffd89b" intensity={24} distance={30} position={[0, 3, -60]} />
      <pointLight color="#fff4dd" intensity={45} distance={38} position={[0, 4, -102]} />

      <group position={[0, 0, -78]}>
        {/* floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={dark}>
          <planeGeometry args={[9.4, 62, 1, 1]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} material={strip}>
          <planeGeometry args={[0.16, 58]} />
        </mesh>
        {Array.from({ length: 28 }).map((_, i) => (
          <mesh key={i} position={[0, 0.018, 29 - i * 2.15]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[9.3, 0.018]} />
            <meshBasicMaterial color="#3b3831" transparent opacity={0.5} />
          </mesh>
        ))}
        {/* ceiling */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 11.4, 0]} material={dark}>
          <planeGeometry args={[9.4, 62]} />
        </mesh>
        {bays.map((i) => {
          const z = 27 - i * 4.1;
          const h = 8.4 + (i % 4) * 0.55;
          return (
            <group key={i}>
              {[-1, 1].map((side) => (
                <group key={side} position={[side * 4.25, h / 2, z]}>
                  <RoundedBox args={[1.15, h, 0.85]} radius={0.045} smoothness={2} material={concrete} />
                  <mesh position={[side * -0.58, h * 0.18, 0.02]} material={strip}>
                    <boxGeometry args={[0.03, 1.5, 0.12]} />
                  </mesh>
                  <mesh position={[side * -0.58, -h * 0.22, 0.02]} material={strip}>
                    <boxGeometry args={[0.03, 0.5, 0.1]} />
                  </mesh>
                </group>
              ))}
              <mesh position={[0, 10.4, z]}>
                <boxGeometry args={[8.4, 0.12, 0.4]} />
                <meshStandardMaterial color="#1a1917" roughness={0.8} />
              </mesh>
            </group>
          );
        })}
        {/* floor light strip pulse */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} material={strip}>
          <planeGeometry args={[0.2, 58]} />
        </mesh>
      </group>

      {/* end door */}
      <group position={[0, 4.4, -106.5]}>
        <mesh ref={door}>
          <boxGeometry args={[5.2, 7.4, 0.3]} />
          <meshStandardMaterial color="#fff7e6" emissive="#fff0ca" emissiveIntensity={5} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.3]}>
          <boxGeometry args={[7.4, 9.4, 0.35]} />
          <meshStandardMaterial color="#0b0a09" roughness={0.85} />
        </mesh>
        <pointLight ref={doorLight} color="#fff0cf" intensity={60} distance={26} position={[0, 0, 2]} />
      </group>
      <group position={[0, 4.2, -106]}>
        <Headline3D
          pStart={0.17}
          pEnd={0.2}
          delay={0}
          lines={[{ text: "OPEN", size: 0.55, color: "#2a2115", display: true, letterSpacing: 0.3 }]}
        />
      </group>

      <group
        position={mobile ? [-2.4, 4.2, -74] : [-3.72, 4.4, -74]}
        rotation={[0, mobile ? 0.45 : 0.78, 0]}
        scale={mobile ? 0.52 : 1}
      >
        <Headline3D
          pStart={0.116}
          pEnd={0.2}
          anchorX="left"
          maxWidth={16}
          lines={[
            { text: "A door,", size: 1.7, italic: true, color: "#ECE7DD", x: 0, y: 1.12 },
            { text: "not a wall.", size: 1.55, italic: true, color: "#EBCB82", x: 0.1, y: -1.18 },
          ]}
        />
      </group>

      <Dust count={600} spread={[7, 7, 50]} origin={[0, 5, -78]} color="#ffe3b3" size={0.026} />
    </group>
  );
}
