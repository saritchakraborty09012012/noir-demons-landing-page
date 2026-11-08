import { useMemo, useRef } from "react";
import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReel } from "../../store/useReel";
import { clamp01, smooth } from "../chapters";
import { FONT_MONO } from "../fonts";
import { Headline3D } from "../common/Headline3D";
import { Dust } from "../common/Particles";
import { useMobile } from "../useMobile";

const HOUSE = new THREE.Vector3(-11.5, 0, -390);
const RACK = new THREE.Vector3(11.5, 0, -390);

type Item = { kind: "box" | "cone"; pos: [number, number, number]; size?: [number, number, number]; r?: number; h?: number; order: number };

const HOUSE_ITEMS: Item[] = [
  { kind: "box", pos: [0, 0.22, 0], size: [7, 0.44, 5], order: 0 },
  { kind: "box", pos: [0, 1.75, 0], size: [6.2, 2.7, 4.3], order: 1 },
  { kind: "box", pos: [0, 4.55, 0], size: [6.2, 2.7, 4.3], order: 2 },
  { kind: "cone", pos: [0, 7.05, 0], r: 4.6, h: 2.35, order: 3 },
  { kind: "box", pos: [0, 1.2, 2.18], size: [1.15, 2.1, 0.12], order: 4 },
  { kind: "box", pos: [-1.9, 2.1, 2.17], size: [1, 1, 0.1], order: 5 },
  { kind: "box", pos: [1.9, 2.1, 2.17], size: [1, 1, 0.1], order: 6 },
  { kind: "box", pos: [-1.7, 4.8, 2.17], size: [1.4, 1.1, 0.1], order: 7 },
  { kind: "box", pos: [1.7, 4.8, 2.17], size: [1.4, 1.1, 0.1], order: 8 },
  { kind: "box", pos: [2.3, 7.35, 0.8], size: [0.62, 1.7, 0.62], order: 9 },
  { kind: "box", pos: [0, 0.1, 2.7], size: [2.2, 0.2, 1.3], order: 10 },
  { kind: "box", pos: [0, 6.85, 0], size: [6.4, 0.14, 4.45], order: 11 },
];

function WireHouse() {
  const ref = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    const lineMat = new THREE.LineBasicMaterial({ color: "#cfeaff", transparent: true, opacity: 0.9, toneMapped: false });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#9fd4ff", metalness: 0.4, roughness: 0.15, transparent: true, opacity: 0.055, depthWrite: false,
    });
    return HOUSE_ITEMS.map((item) => {
      const geo =
        item.kind === "box"
          ? new THREE.EdgesGeometry(new THREE.BoxGeometry(...(item.size as [number, number, number])))
          : new THREE.EdgesGeometry(new THREE.ConeGeometry(item.r, item.h, 4, 1));
      return { ...item, geo, lineMat, glass };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = useReel.getState().p;
    const build = smooth(0.648, 0.702, p);
    ref.current.children.forEach((child, i) => {
      child.visible = build >= i / (items.length + 1.5);
    });
    const line = items[0]?.lineMat;
    if (line) line.opacity = 0.6 + Math.sin(clock.elapsedTime * 2.4) * 0.1 + build * 0.25;
  });

  return (
    <group ref={ref} position={HOUSE} name="house_wire">
      {items.map((item, i) => (
        <group key={i} position={item.pos} rotation={[0, item.kind === "cone" ? Math.PI / 4 : 0, 0]}>
          <lineSegments geometry={item.geo}>
            <primitive object={item.lineMat} attach="material" />
          </lineSegments>
          {item.kind === "box" && (
            <mesh>
              <boxGeometry args={item.size as [number, number, number]} />
              <primitive object={item.glass} attach="material" />
            </mesh>
          )}
          {item.kind === "cone" && (
            <mesh>
              <coneGeometry args={[item.r, item.h, 4, 1]} />
              <primitive object={item.glass} attach="material" />
            </mesh>
          )}
        </group>
      ))}
      <gridHelper args={[34, 34, "#3d5870", "#16222d"]} position={[0, 0.012, 0]} />
    </group>
  );
}

function ServerRack() {
  const ledMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const units = useMemo(() => Array.from({ length: 26 }, (_, i) => i), []);
  const cables = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.5 + i * 0.7, 4.4 - i * 0.1, 1.3),
          new THREE.Vector3(-2.2 + i * 0.9, 2.6, 2.6 + i * 0.4),
          new THREE.Vector3(-3.5 + i * 1.4, 0.25, 3.2 + i * 0.5),
          new THREE.Vector3(-5.5 + i * 2.2, 0.06, 1.5 + i * 0.4),
        ]);
        return new THREE.TubeGeometry(curve, 26, 0.035, 6, false);
      }),
    [],
  );

  useFrame(({ clock }) => {
    const p = useReel.getState().p;
    const active = smooth(0.71, 0.748, p);
    ledMats.current.forEach((mat, i) => {
      if (!mat) return;
      const seq = Math.sin(clock.elapsedTime * 6 - i * 0.62) * 0.5 + 0.5;
      mat.opacity = 0.12 + seq * 0.5 + active * 0.34;
    });
  });

  return (
    <group position={RACK} name="server_rack">
      <mesh position={[0, 5.1, 0]}>
        <boxGeometry args={[4.5, 10.2, 2.7]} />
        <meshStandardMaterial color="#0a0f17" metalness={0.9} roughness={0.3} emissive="#0d2b44" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 10.25, 0]}>
        <boxGeometry args={[4.8, 0.16, 3]} />
        <meshStandardMaterial color="#3BA0FF" emissive="#3BA0FF" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {units.map((i) => (
        <group key={i} position={[0, 0.65 + i * 0.37, 1.37]}>
          <mesh>
            <boxGeometry args={[3.9, 0.29, 0.08]} />
            <meshStandardMaterial color="#111821" metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[-1.35, 0, 0.06]}>
            <boxGeometry args={[0.75, 0.11, 0.03]} />
            <meshBasicMaterial ref={(m) => { ledMats.current[i] = m as THREE.MeshBasicMaterial; }} color={i % 5 === 0 ? "#F3DDA0" : "#63C5FF"} transparent opacity={0.4} toneMapped={false} />
          </mesh>
          <mesh position={[1.4, 0, 0.06]}>
            <boxGeometry args={[0.3, 0.08, 0.03]} />
            <meshBasicMaterial color="#3BA0FF" toneMapped={false} />
          </mesh>
        </group>
      ))}
      {cables.map((geo, i) => (
        <mesh key={i} geometry={geo} name={`cable_${i + 1}`}>
          <meshBasicMaterial color={i % 2 ? "#3BA0FF" : "#8FD8FF"} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      ))}
      <pointLight color="#3BA0FF" intensity={45} distance={22} decay={2} position={[0, 5, 3]} />
      <pointLight color="#F3DDA0" intensity={12} distance={12} decay={2} position={[0, 10.5, 1]} />
      <Text font={FONT_MONO} fontSize={0.18} color="#67BFFF" position={[0, 10.55, 1.55]} anchorX="center" letterSpacing={0.22}>
        NDE / DRIVE / 02
      </Text>
    </group>
  );
}

function ChromeKey() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    if (!group.current) return;
    const p = useReel.getState().p;
    const left = smooth(0.648, 0.676, p);
    const right = smooth(0.712, 0.746, p);
    const center = 1 - smooth(0.752, 0.762, p);
    const x = (left * -13.5 + right * 27) * center;
    group.current.position.x += (x - group.current.position.x) * Math.min(1, dt * 4.2);
    group.current.position.y = 2.1 + Math.sin(clock.elapsedTime * 1.4) * 0.16;
    group.current.rotation.y += dt * 0.45;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 1.1) * 0.09 + (right - left) * -0.5;
  });
  return (
    <group ref={group} position={[0, 2.1, -390]} name="key">
      <mesh position={[0, 1.55, 0]} name="key_head">
        <torusGeometry args={[0.85, 0.24, 18, 44]} />
        <meshStandardMaterial color="#d8dde5" metalness={1} roughness={0.1} envMapIntensity={1.8} />
      </mesh>
      <mesh position={[0, -0.45, 0]} name="key_shaft">
        <boxGeometry args={[0.42, 3.1, 0.3]} />
        <meshStandardMaterial color="#c8cfd9" metalness={1} roughness={0.12} envMapIntensity={1.6} />
      </mesh>
      <group name="key_teeth" position={[0, -1.78, 0]}>
        <mesh position={[0.38, 0.2, 0]}>
          <boxGeometry args={[0.7, 0.28, 0.26]} />
          <meshStandardMaterial color="#b9c1cc" metalness={1} roughness={0.14} />
        </mesh>
        <mesh position={[0.5, -0.24, 0]}>
          <boxGeometry args={[0.95, 0.24, 0.24]} />
          <meshStandardMaterial color="#b9c1cc" metalness={1} roughness={0.14} />
        </mesh>
      </group>
      <mesh position={[0, 1.55, 0]}>
        <torusGeometry args={[1.12, 0.022, 6, 64]} />
        <meshBasicMaterial color="#74E6FF" toneMapped={false} transparent opacity={0.8} />
      </mesh>
      <pointLight color="#74E6FF" intensity={15} distance={6} decay={2} position={[0, 1.8, 1.2]} />
    </group>
  );
}

export default function S06Keys() {
  const mobile = useMobile();
  return (
    <group>
      <ambientLight color="#9fb8d5" intensity={0.3} />
      <pointLight color="#BFE4FF" intensity={36} distance={24} decay={2} position={[-12, 6, -384]} />
      <pointLight color="#F3DDA0" intensity={22} distance={16} decay={2} position={[0, 3, -384]} />
      <WireHouse />
      <ServerRack />
      <ChromeKey />
      <mesh position={[0, 5, -390]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.05, 11]} />
        <meshBasicMaterial color="#fff2d2" transparent opacity={0.4} blending={THREE.AdditiveBlending} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 5, -390]}>
        <boxGeometry args={[0.02, 11, 0.02]} />
        <meshBasicMaterial color="#F3DDA0" toneMapped={false} />
      </mesh>
      <Billboard position={[0, mobile ? 6.2 : 7.4, -405]} scale={mobile ? 0.42 : 0.9}>
        <Headline3D
          pStart={0.624}
          pEnd={0.678}
          outAt={0.008}
          maxWidth={30}
          anchorX="center"
          lines={[
            { text: "Take the keys,", size: 1.85, italic: true, y: 0.95 },
            { text: "or let us drive.", size: 2.15, italic: true, y: -1.15, color: "#EBCB82" },
          ]}
        />
      </Billboard>
      <Text font={FONT_MONO} fontSize={0.16} color="#7d8a9a" position={[0, 5.25, -410]} anchorX="center" letterSpacing={0.26}>
        TWO WAYS TO SHIP / ONE STUDIO
      </Text>
      <Dust count={400} spread={[30, 12, 12]} origin={[0, 4, -390]} color="#a9d4ff" size={0.03} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -390]}>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial color="#04070b" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}
