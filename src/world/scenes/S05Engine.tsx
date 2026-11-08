import { useMemo, useRef, type RefObject } from "react";
import { Billboard, Line, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReel } from "../../store/useReel";
import { clamp01, smooth } from "../chapters";import { FONT_MONO } from "../fonts";
import { Headline3D } from "../common/Headline3D";
import { SoftPlate } from "../common/SoftPlate";
import { Dust, Starfield } from "../common/Particles";
import { useMobile } from "../useMobile";

const CENTER: [number, number, number] = [0, 0, -295];

type Stage = { key: string; title: string; sub: string; y: number; accent: string };

const STAGES: Stage[] = [
  { key: "base_deploy", title: "DEPLOY", sub: "LAUNCH · SCALE · MAINTAIN", y: -2.7, accent: "#8EA4C4" },
  { key: "shell_interface", title: "INTERFACE", sub: "UX · PRODUCT · EXPERIENCE", y: -0.9, accent: "#D8C28C" },
  { key: "rings_model", title: "MODEL", sub: "REASON · GENERATE · DECIDE", y: 0.8, accent: "#9FB4E8" },
  { key: "rings_data", title: "DATA", sub: "INGEST · STRUCTURE · LEARN", y: 2.4, accent: "#3BA0FF" },
  { key: "core_idea", title: "IDEA CORE", sub: "VISION · PROBLEM · DESIGN", y: 4.1, accent: "#F3DDA0" },
];

function StageLabel({ stage }: { stage: Stage }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const p = useReel.getState().p;
    const a = smooth(0.452, 0.478, p) * (1 - smooth(0.572, 0.596, p));
    ref.current.visible = a > 0.01;
    ref.current.traverse((c: any) => {
      if (c.material && "opacity" in c.material) {
        c.material.transparent = true;
        c.material.opacity = a;
        c.material.depthTest = false;
        c.material.depthWrite = false;
        c.renderOrder = 4;
      }
    });
  });
  return (
    <group ref={ref} position={[0, stage.y, 0]}>
      <Line points={[[1.7, 0, 0], [5.1, 0.15, 0]]} color={stage.accent} lineWidth={1} transparent opacity={0.55} />
      <mesh position={[1.7, 0, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color={stage.accent} toneMapped={false} />
      </mesh>
      <Billboard position={[5.3, 0, 0]}>
        <Text font={FONT_MONO} fontSize={0.28} color={stage.accent} anchorX="left" anchorY="middle" position={[0, 0.32, 0]} letterSpacing={0.16}>
          {stage.title}
        </Text>
        <Text font={FONT_MONO} fontSize={0.13} color="#8b8479" anchorX="left" anchorY="middle" position={[0, -0.02, 0]} letterSpacing={0.1}>
          {stage.sub}
        </Text>
      </Billboard>
    </group>
  );
}

function Rings({ count, radius, color, tube, prefix }: { count: number; radius: number; color: string; tube: number; prefix: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} name={`${prefix}_${i + 1}`} rotation={[Math.PI / 2 + (i - count / 2) * 0.055, 0, i * 0.4]} position={[0, (i - count / 2) * 0.42, 0]}>
          <torusGeometry args={[radius + i * 0.12, tube, 10, 128]} />
          <meshStandardMaterial color="#6f767f" emissive={color} emissiveIntensity={0.35 + i * 0.12} metalness={0.96} roughness={0.24} />
        </mesh>
      ))}
    </>
  );
}

export default function S05Engine() {
  const mobile = useMobile();
  const { camera } = useThree();
  const title = useRef<THREE.Group>(null);
  const plateRef = useRef<THREE.ShaderMaterial>(null);
  const titlePos = useMemo(() => new THREE.Vector3(), []);
  const base = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Group>(null);
  const model = useRef<THREE.Group>(null);
  const data = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const spinM = useRef<THREE.Group>(null);
  const spinD = useRef<THREE.Group>(null);
  const coreSpin = useRef<THREE.Group>(null);
  const dash = useRef<THREE.InstancedMesh>(null);

  const brackets = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  useFrame(({ clock }, dt) => {
    const p = useReel.getState().p;
    const ex = smooth(0.45, 0.5, p) * (1 - smooth(0.57, 0.602, p) * 0.88);
    const t = clock.elapsedTime;
    const dive = smooth(0.588, 0.612, p);
    if (base.current) base.current.position.y = -1.1 - ex * 3.1;
    if (shell.current) {
      shell.current.position.y = 0 + ex * 0.25;
      shell.current.rotation.y += dt * 0.03;
    }
    if (model.current) model.current.position.y = 0.55 + ex * 3.4;
    if (data.current) data.current.position.y = 1.15 + ex * 6.1;
    if (core.current) {
      core.current.position.y = 0.3 + ex * 0.7;
      core.current.scale.setScalar(1 + dive * 1.9);
    }
    if (spinM.current) spinM.current.rotation.y += dt * 0.22;
    if (spinD.current) {
      spinD.current.rotation.y -= dt * 0.13;
      spinD.current.rotation.z = Math.sin(t * 0.2) * 0.05;
    }
    if (coreSpin.current) coreSpin.current.rotation.y += dt * 0.6;
    if (dash.current) dash.current.rotation.y += dt * 0.08;

    const bloom = 1.35 + Math.sin(t * 1.7) * 0.22 + smooth(0.56, 0.61, p) * 1.4;
    const light = core.current?.children.find((c: any) => c.isPointLight) as THREE.PointLight | undefined;
    if (light) light.intensity = 26 + bloom * 14;

    if (title.current) {
      titlePos
        .set(0, mobile ? 1.68 : 1.15, -5)
        .applyQuaternion(camera.quaternion)
        .add(camera.position);
      title.current.position.copy(titlePos);
    }
    if (plateRef.current) {
      const a = smooth(0.442, 0.462, p) * (1 - smooth(0.604, 0.624, p));
      plateRef.current.uniforms.uOpacity.value = a * 0.94;
    }
  });

  return (
    <group>
      <ambientLight color="#6f84a8" intensity={0.28} />
      <pointLight color="#3BA0FF" intensity={48} distance={40} decay={2} position={[0, 1, -285]} />
      <pointLight color="#fff2d0" intensity={24} distance={26} decay={2} position={[-7, 9, -292]} />
      <Starfield count={1600} radius={48} size={0.075} opacity={0.55} speed={0.004} color="#a9c6ff" origin={[0, 2, -295]} />

      <group position={CENTER} scale={mobile ? 0.54 : 0.88} name="engine_tower">
        <group ref={base} name="base_deploy" position={[0, -1.1, 0]}>
          <mesh position={[0, -1.2, 0]}>
            <cylinderGeometry args={[4.4, 4.9, 1.1, 12]} />
            <meshStandardMaterial color="#14171c" metalness={0.9} roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[3.5, 3.9, 0.8, 12]} />
            <meshStandardMaterial color="#2a2e34" metalness={0.95} roughness={0.22} />
          </mesh>
          {brackets.slice(0, 8).map((i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 3.8, -0.85, Math.sin(a) * 3.8]} rotation={[0, -a, 0]}>
                <boxGeometry args={[0.8, 1.5, 0.34]} />
                <meshStandardMaterial color="#1c2026" metalness={0.9} roughness={0.3} emissive="#3BA0FF" emissiveIntensity={0.15} />
              </mesh>
            );
          })}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.72, 0]}>
            <torusGeometry args={[4.55, 0.06, 8, 100]} />
            <meshBasicMaterial color="#3BA0FF" transparent opacity={0.55} toneMapped={false} />
          </mesh>
        </group>

        <group ref={shell} name="shell_interface">
          {brackets.map((i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 6.1, 0.6, Math.sin(a) * 6.1]} rotation={[0, -a, 0]}>
                <boxGeometry args={[0.26, 8.4, 0.6]} />
                <meshStandardMaterial color="#30363f" metalness={0.94} roughness={0.2} emissive="#8ea4c4" emissiveIntensity={0.08} />
              </mesh>
            );
          })}
          {[4.4, -3.0].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[6.1, 0.14, 10, 128]} />
              <meshStandardMaterial color="#20252c" metalness={0.96} roughness={0.24} />
            </mesh>
          ))}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[6.25, 6.4, 1.1, 48, 1, true]} />
            <meshPhysicalMaterial color="#b9d6ff" transparent opacity={0.08} roughness={0.08} metalness={0.1} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>

        <group ref={model} name="rings_model">
          <group ref={spinM}>
            <Rings count={3} radius={3.25} color="#9FB4E8" tube={0.07} prefix="ringM" />
            {Array.from({ length: 18 }).map((_, i) => {
              const a = (i / 18) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(a) * 3.64, Math.sin(i) * 0.35, Math.sin(a) * 3.64]} rotation={[0, -a, 0]}>
                  <boxGeometry args={[0.05, 0.5, 0.32]} />
                  <meshBasicMaterial color="#DCE8FF" toneMapped={false} />
                </mesh>
              );
            })}
          </group>
        </group>

        <group ref={data} name="rings_data">
          <group ref={spinD}>
            <Rings count={5} radius={4.9} color="#3BA0FF" tube={0.045} prefix="ringD" />
            <instancedMesh ref={dash} args={[undefined, undefined, 64]}>
              <boxGeometry args={[0.08, 0.34, 0.16]} />
              <meshBasicMaterial color="#7CC7FF" toneMapped={false} />
            </instancedMesh>
            <Dashes inner={dash} />
          </group>
        </group>

        <group ref={core} name="core_idea">
          <pointLight color="#9FD4FF" intensity={16} distance={22} decay={2} />
          <group ref={coreSpin}>
            <mesh>
              <icosahedronGeometry args={[1.75, 3]} />
              <meshStandardMaterial color="#bfe7ff" emissive="#3f9bff" emissiveIntensity={1.25} metalness={0.25} roughness={0.18} />
            </mesh>
            <mesh scale={1.02}>
              <icosahedronGeometry args={[1.75, 1]} />
              <meshBasicMaterial color="#9FDFFF" wireframe transparent opacity={0.55} toneMapped={false} />
            </mesh>
            {Array.from({ length: 5 }).map((_, i) => (
              <mesh key={i} rotation={[i * 0.8, i * 0.4, 0]}>
                <torusGeometry args={[2.4 + i * 0.18, 0.018, 6, 90]} />
                <meshBasicMaterial color="#BDEBFF" transparent opacity={0.4} toneMapped={false} />
              </mesh>
            ))}
          </group>
        </group>

        {!mobile &&
          STAGES.map((s) => <StageLabel key={s.key} stage={s} />)}
      </group>

      <group ref={title}>
        <Billboard scale={mobile ? 0.2 : 0.34}>
          <SoftPlate width={18} height={6} materialRef={plateRef} />
          <Headline3D
            pStart={0.442}
            pEnd={0.622}
            maxWidth={26}
            anchorX="center"
            lines={[{ text: "The Engine.", size: 2.3, italic: true, color: "#EBCB82", y: 0 }]}
          />
        </Billboard>
      </group>

      <Dust count={420} spread={[28, 22, 22]} origin={[0, 3, -295]} color="#9ecbff" size={0.03} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.4, -295]}>
        <circleGeometry args={[16, 96]} />
        <meshStandardMaterial color="#04070c" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Dashes({ inner }: { inner: RefObject<THREE.InstancedMesh | null> }) {
  const seeded = useRef(false);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (seeded.current || !inner.current) return;
    for (let i = 0; i < 64; i += 1) {
      const a = (i / 64) * Math.PI * 2;
      const r = 4.35 + (i % 5) * 0.32;
      dummy.position.set(Math.cos(a) * r, ((i % 5) - 2) * 0.35, Math.sin(a) * r);
      dummy.rotation.set(0, -a, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      inner.current.setMatrixAt(i, dummy.matrix);
    }
    inner.current.instanceMatrix.needsUpdate = true;
    seeded.current = true;
  });
  return null;
}
