import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useReel } from "../store/useReel";
import { CHAPTERS } from "./chapters";
import PortalGate from "./common/PortalGate";
import S01Hero from "./scenes/S01Hero";
import S02Corridor from "./scenes/S02Corridor";
import S03Tunnel from "./scenes/S03Tunnel";
import S04Constellation from "./scenes/S04Constellation";
import S05Engine from "./scenes/S05Engine";
import S06Keys from "./scenes/S06Keys";
import S07Plans from "./scenes/S07Plans";
import S08Vision from "./scenes/S08Vision";
import S09Outro from "./scenes/S09Outro";

const SCENES = [S01Hero, S02Corridor, S03Tunnel, S04Constellation, S05Engine, S06Keys, S07Plans, S08Vision, S09Outro];

const GATES: { z: number; y: number; scale: number; color: string; ribs: number; glow: number }[] = [
  { z: -34, y: 4.7, scale: 1, color: "#FFD98C", ribs: 36, glow: 2.2 },
  { z: -114, y: 3.4, scale: 0.72, color: "#FFE4B4", ribs: 30, glow: 1.8 },
  { z: -176, y: 2.6, scale: 0.8, color: "#9FD8FF", ribs: 30, glow: 1.1 },
  { z: -248, y: 3, scale: 1.1, color: "#FFD98C", ribs: 40, glow: 2.2 },
  { z: -344, y: 2, scale: 0.88, color: "#74C7FF", ribs: 36, glow: 2.0 },
  { z: -440, y: 3, scale: 1, color: "#FFE2AC", ribs: 38, glow: 2.2 },
  { z: -526, y: 2, scale: 0.74, color: "#BFD9FF", ribs: 26, glow: 1.6 },
  { z: -558, y: 2.5, scale: 1.1, color: "#FFD98C", ribs: 40, glow: 2.0 },
];

function Adaptive() {
  const frames = useRef(0);
  const acc = useRef(0);
  const done = useRef(false);
  useFrame((_, dt) => {
    if (done.current) return;
    frames.current += 1;
    acc.current += dt;
    if (acc.current > 3.5) {
      const fps = frames.current / acc.current;
      const state = useReel.getState();
      if (fps < 42 && state.quality === "HIGH") state.setQuality("LITE");
      done.current = true;
    }
  });
  return null;
}

export default function World() {
  const chapter = useReel((s) => s.chapter);
  const idx = Math.max(0, Math.min(8, CHAPTERS.findIndex((c) => c.id === chapter) - 1));
  const Current = SCENES[idx];
  const Next = SCENES[idx + 1] ?? null;

  useEffect(() => {
    document.body.dataset.chapter = CHAPTERS[idx + 1]?.id ?? "S09";
  }, [idx]);

  return (
    <>
      <color attach="background" args={["#040404"]} />
      <fog attach="fog" args={["#040404", 20, 130]} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#FFD9A0" position={[0, 8, -8]} scale={[20, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#7FB7E8" position={[-10, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[16, 8, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#ECE7DD" position={[10, 4, 6]} rotation={[0, -Math.PI / 2, 0]} scale={[16, 8, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#C9A24B" position={[0, -6, -12]} scale={[10, 10, 1]} />
      </Environment>
      <Current />
      {Next && <Next />}
      {GATES.map((g, i) => (
        <PortalGate key={i} z={g.z} y={g.y} scale={g.scale} color={g.color} ribs={g.ribs} glowIntensity={g.glow} coreIntensity={0.05} />
      ))}
      <Adaptive />
    </>
  );
}
