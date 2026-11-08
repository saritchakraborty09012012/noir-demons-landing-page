import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useReel } from "../store/useReel";
import { clamp01, flashAt } from "./chapters";

type Key = { p: number; pos: [number, number, number]; tgt: [number, number, number]; fov: number };

export const CAMERA_KEYS: Key[] = [
  { p: 0.0, pos: [0, 3.4, 26], tgt: [0, 4.3, -8], fov: 52 },
  { p: 0.03, pos: [0, 3.2, 19], tgt: [0, 4.2, -8], fov: 52 },
  { p: 0.055, pos: [-3.6, 3.5, 12], tgt: [0, 4.4, -8], fov: 54 },
  { p: 0.08, pos: [-3, 4.3, 5], tgt: [0, 4.6, -12], fov: 56 },
  { p: 0.098, pos: [-0.8, 4.7, -2], tgt: [0, 4.6, -18], fov: 60 },
  { p: 0.105, pos: [0, 4.7, -28], tgt: [0, 4.7, -40], fov: 72 },
  { p: 0.12, pos: [0, 3.1, -42], tgt: [0, 3.2, -60], fov: 55 },
  { p: 0.15, pos: [0, 3.0, -62], tgt: [0, 3.0, -82], fov: 50 },
  { p: 0.175, pos: [0, 2.9, -82], tgt: [0, 2.9, -98], fov: 50 },
  { p: 0.193, pos: [0, 2.8, -104], tgt: [0, 2.8, -112], fov: 58 },
  { p: 0.195, pos: [0, 2.8, -110], tgt: [0, 2.8, -120], fov: 72 },
  { p: 0.205, pos: [0, 2.4, -122], tgt: [0, 2.4, -140], fov: 52 },
  { p: 0.235, pos: [0, 2.2, -136], tgt: [0, 2.2, -150], fov: 62 },
  { p: 0.26, pos: [2.2, 2.5, -146], tgt: [0, 2.5, -158], fov: 74 },
  { p: 0.282, pos: [0, 2.5, -160], tgt: [0, 2.5, -170], fov: 85 },
  { p: 0.285, pos: [0, 2.5, -170], tgt: [0, 2.5, -180], fov: 80 },
  { p: 0.3, pos: [0, 4, -180], tgt: [0, 1, -202], fov: 55 },
  { p: 0.33, pos: [14, 5, -188], tgt: [0, 0, -205], fov: 55 },
  { p: 0.36, pos: [18, 2, -206], tgt: [0, 0, -205], fov: 50 },
  { p: 0.39, pos: [1, 4, -224], tgt: [0, 0, -205], fov: 55 },
  { p: 0.42, pos: [-17, 1, -208], tgt: [0, 0, -205], fov: 50 },
  { p: 0.428, pos: [-12, 3, -228], tgt: [0, 2, -238], fov: 60 },
  { p: 0.435, pos: [0, 3, -242], tgt: [0, 2, -254], fov: 72 },
  { p: 0.445, pos: [0, 3, -256], tgt: [0, 2, -290], fov: 55 },
  { p: 0.48, pos: [10, 4, -275], tgt: [0, 2.2, -295], fov: 55 },
  { p: 0.52, pos: [14, 4, -290], tgt: [0, 2.4, -295], fov: 50 },
  { p: 0.535, pos: [0, 9, -268], tgt: [0, 2.2, -295], fov: 55 },
  { p: 0.55, pos: [-14, 6, -302], tgt: [0, 2.2, -295], fov: 55 },
  { p: 0.58, pos: [-8, 2, -285], tgt: [0, 2, -295], fov: 50 },
  { p: 0.6, pos: [0, 1, -292], tgt: [0, 1.6, -295], fov: 64 },
  { p: 0.61, pos: [0, 0, -302], tgt: [0, 0, -330], fov: 75 },
  { p: 0.615, pos: [0, 0, -340], tgt: [0, 0, -352], fov: 72 },
  { p: 0.63, pos: [0, 2, -352], tgt: [0, 2, -378], fov: 55 },
  { p: 0.655, pos: [0, 2, -380], tgt: [0, 2, -390], fov: 50 },
  { p: 0.69, pos: [-6, 2, -381], tgt: [-11.5, 2, -390], fov: 48 },
  { p: 0.715, pos: [-16, 4, -382], tgt: [-11.5, 3, -390], fov: 50 },
  { p: 0.735, pos: [16, 3, -382], tgt: [11.5, 4, -390], fov: 52 },
  { p: 0.756, pos: [0, 3, -410], tgt: [0, 2, -424], fov: 55 },
  { p: 0.765, pos: [0, 3, -436], tgt: [0, 2, -448], fov: 72 },
  { p: 0.775, pos: [0, 2, -450], tgt: [0, 2, -480], fov: 55 },
  { p: 0.8, pos: [-7, 1.5, -458], tgt: [0, 2, -480], fov: 50 },
  { p: 0.84, pos: [7, 1.5, -458], tgt: [0, 2, -480], fov: 50 },
  { p: 0.865, pos: [0, 2, -500], tgt: [0, 2, -512], fov: 55 },
  { p: 0.885, pos: [0, 2, -512], tgt: [0, 2, -522], fov: 65 },
  { p: 0.9, pos: [0, 2, -524], tgt: [0, 2, -536], fov: 75 },
  { p: 0.91, pos: [0, 3, -528], tgt: [0, 1, -552], fov: 58 },
  { p: 0.935, pos: [0, 1, -540], tgt: [0, 0, -552], fov: 62 },
  { p: 0.955, pos: [0, 0, -548], tgt: [0, 0, -552], fov: 72 },
  { p: 0.965, pos: [0, 0, -554], tgt: [0, 0, -558], fov: 88 },
  { p: 0.972, pos: [0, 4, -580], tgt: [0, 4, -612], fov: 55 },
  { p: 0.988, pos: [0, 4, -590], tgt: [0, 4, -620], fov: 52 },
  { p: 1.0, pos: [0, 4, -596], tgt: [0, 4, -626], fov: 50 },
];

const posCurve = new THREE.CatmullRomCurve3(
  CAMERA_KEYS.map((k) => new THREE.Vector3(...k.pos)),
  false,
  "catmullrom",
  0.35,
);
const tgtCurve = new THREE.CatmullRomCurve3(
  CAMERA_KEYS.map((k) => new THREE.Vector3(...k.tgt)),
  false,
  "catmullrom",
  0.35,
);

function keyIndex(p: number) {
  let i = 0;
  while (i < CAMERA_KEYS.length - 2 && CAMERA_KEYS[i + 1].p <= p) i += 1;
  return i;
}

function uAt(p: number) {
  const i = keyIndex(p);
  const a = CAMERA_KEYS[i];
  const b = CAMERA_KEYS[i + 1] ?? a;
  const t = clamp01((p - a.p) / Math.max(0.00001, b.p - a.p));
  const n = CAMERA_KEYS.length - 1;
  return (i + t) / n;
}

function fovAt(p: number) {
  const i = keyIndex(p);
  const a = CAMERA_KEYS[i];
  const b = CAMERA_KEYS[i + 1] ?? a;
  const t = clamp01((p - a.p) / Math.max(0.00001, b.p - a.p));
  return a.fov + (b.fov - a.fov) * t;
}

export default function Rig() {
  const { camera, gl } = useThree();
  const disp = useRef(0);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [debug, setDebug] = useState(false);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d") setDebug((v) => !v);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useFrame(({ clock }, dt) => {
    const state = useReel.getState();
    const raw = state.p;
    const damp = state.reduced ? 12 : 5.2;
    disp.current += (raw - disp.current) * Math.min(1, dt * damp);
    if (Math.abs(raw - disp.current) < 0.00002) disp.current = raw;
    const p = clamp01(disp.current);
    const u = uAt(p);

    posCurve.getPoint(u, pos);
    tgtCurve.getPoint(u, target);

    mouse.current.x += (mouse.current.tx - mouse.current.x) * Math.min(1, dt * 2.4);
    mouse.current.y += (mouse.current.ty - mouse.current.y) * Math.min(1, dt * 2.4);

    const f = flashAt(p);
    const shake = state.reduced ? 0 : 1;
    const t = clock.elapsedTime;
    const nx = Math.sin(t * 0.83) * 0.012 + Math.sin(t * 1.71) * 0.006;
    const ny = Math.cos(t * 0.71) * 0.01 + Math.sin(t * 1.33) * 0.005;

    camera.position.copy(pos);
    right.setFromMatrixColumn(camera.matrix, 0);
    up.setFromMatrixColumn(camera.matrix, 1);
    camera.position.addScaledVector(right, mouse.current.x * 0.55 + nx * shake);
    camera.position.addScaledVector(up, -mouse.current.y * 0.35 + ny * shake);

    look.copy(target);
    look.x += mouse.current.x * 0.9;
    look.y += -mouse.current.y * 0.6;
    camera.lookAt(look);

    const roll = Math.sin(p * Math.PI * 9) * 0.012 + mouse.current.x * -0.025;
    camera.rotateZ(state.reduced ? 0 : roll);

    const cam = camera as THREE.PerspectiveCamera;
    const fov = fovAt(p) + f * (state.reduced ? 0 : 9);
    cam.fov += (fov - cam.fov) * Math.min(1, dt * 8);
    cam.updateProjectionMatrix();
    gl.toneMappingExposure = 1.0 + f * 0.18;
  });

  return debug ? (
    <group>
      <Line points={posCurve.getPoints(500)} color="#c9a24b" lineWidth={1} transparent opacity={0.7} />
      {CAMERA_KEYS.map((k, i) => (
        <mesh key={i} position={k.pos}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#3ba0ff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  ) : null;
}
