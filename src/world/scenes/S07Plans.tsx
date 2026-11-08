import { useEffect, useMemo, useRef, useState } from "react";
import { Billboard, RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReel } from "../../store/useReel";
import { clamp01, smooth } from "../chapters";
import { jumpTo } from "../../lib/scroll";
import { planCenter } from "../../lib/planScroll";
import { PLAN_GROUPS, type PlanMode } from "../../content/content";
import { FONT_MONO, FONT_SERIF_IT } from "../fonts";
import { Headline3D } from "../common/Headline3D";
import { Dust } from "../common/Particles";
import { useMobile } from "../useMobile";
import { PLAN_FLIP, PLAN_SPAN } from "../../lib/planScroll";

const frag = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(3.4, 2.0);
  float t = uTime * 0.045;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.4*q + vec2(1.7, 9.2) + t*0.6), fbm(p + 3.4*q + vec2(8.3, 2.8) - t*0.4));
  float f = fbm(p + 3.0*r);
  vec3 deep = vec3(0.006, 0.028, 0.032);
  vec3 teal = vec3(0.035, 0.28, 0.27);
  vec3 ice = vec3(0.30, 0.72, 0.72);
  vec3 gold = vec3(0.62, 0.44, 0.16);
  vec3 col = mix(deep, teal, smoothstep(0.18, 0.92, f));
  col = mix(col, ice, pow(clamp(r.x, 0.0, 1.0), 2.2) * 0.35);
  col += gold * pow(clamp(q.y, 0.0, 1.0), 3.0) * 0.28;
  float bands = smoothstep(0.47, 0.54, sin(f*13.0 + t*7.0)*0.5+0.5);
  col += bands * gold * 0.055;
  float md = length(uv - uMouse) * 1.8;
  col += ice * smoothstep(0.55, 0.0, md) * 0.035;
  float vig = smoothstep(1.05, 0.22, length((uv-0.5)*vec2(1.55,1.0)));
  col *= vig;
  gl_FragColor = vec4(col, 1.0);
}`;

const vert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

function Fluid() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame(({ clock }) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = clock.elapsedTime;
    (mat.current.uniforms.uMouse.value as THREE.Vector2).lerp(mouse.current, 0.05);
  });
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0.5, 0.5) } }), []);
  return (
    <mesh position={[0, 2, -492]}>
      <planeGeometry args={[120, 70]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vert} fragmentShader={frag} />
    </mesh>
  );
}

function PlanCard({ planIndex, mode }: { planIndex: number; mode: PlanMode }) {
  const flip = useRef<THREE.Group>(null);
  const card = useRef<THREE.Group>(null);
  const frontFace = useRef<THREE.Group>(null);
  const backFace = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const lastMode = useRef<PlanMode>(mode);
  const flipStart = useRef(0);
  const x = -7.5 + planIndex * 5;

  useFrame(({ clock }, dt) => {
    if (!flip.current || !card.current) return;
    const state = useReel.getState();
    if (state.planMode !== lastMode.current) {
      lastMode.current = state.planMode;
      flipStart.current = clock.elapsedTime + planIndex * 0.08;
    }
    if (clock.elapsedTime > flipStart.current) {
      const target = state.planMode === "source" ? Math.PI : 0;
      flip.current.rotation.y += (target - flip.current.rotation.y) * Math.min(1, dt * 3.4);
    }
    const facingFront = Math.cos(flip.current.rotation.y) >= 0;
    if (frontFace.current) frontFace.current.visible = facingFront;
    if (backFace.current) backFace.current.visible = !facingFront;
    const active = state.activePlan === planIndex;
    const targetScale = active ? 1.08 : hovered ? 1.04 : 0.94;
    const s = card.current.scale.x + (targetScale - card.current.scale.x) * Math.min(1, dt * 4);
    card.current.scale.setScalar(s);
    card.current.position.y = 2.75 + Math.sin(clock.elapsedTime * 0.7 + planIndex) * 0.08 + (active ? 0.12 : 0);
  });

  return (
    <group
      ref={card}
      position={[x, 2.75, -478]}
      rotation={[0, planIndex < 2 ? 0.09 : -0.09, 0]}
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
        jumpTo(planCenter(useReel.getState().planMode, planIndex), 1.1);
      }}
    >
      <group ref={flip}>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[4.28, 5.38]} />
          <meshStandardMaterial color="#071210" metalness={0.35} roughness={0.62} side={THREE.DoubleSide} />
        </mesh>
        <RoundedBox args={[4.4, 5.5, 0.16]} radius={0.1} smoothness={3}>
          <meshPhysicalMaterial
            color="#dff4ef"
            transmission={0.72}
            transparent
            opacity={0.42}
            roughness={0.12}
            metalness={0.32}
            thickness={0.6}
            ior={1.42}
            clearcoat={1}
            envMapIntensity={1.2}
            depthWrite={false}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[4.2, 5.3]} />
          <meshBasicMaterial color="#06110f" transparent opacity={0.18} depthWrite={false} />
        </mesh>
        <group ref={frontFace}>
          <CardFace plan={PLAN_GROUPS.managed.plans[planIndex]} accent="#D8C28C" managed />
        </group>
        <group ref={backFace} rotation={[0, Math.PI, 0]} visible={false}>
          <CardFace plan={PLAN_GROUPS.source.plans[planIndex]} accent="#9FD8FF" managed={false} />
        </group>
      </group>
    </group>
  );
}

function CardFace({ plan, accent, managed }: { plan: { no: string; name: string; price: string; unit: string; cta: string; kicker: string }; accent: string; managed: boolean }) {
  const z = 0.1;
  return (
    <group position={[0, 0, z]}>
      <Text font={FONT_MONO} fontSize={0.15} color={accent} anchorX="left" position={[-1.88, 2.44, 0.02]} letterSpacing={0.16}>
        {managed ? "NEGOTIABLE BY SCOPE" : "ONE-TIME · YOU OWN IT"}
      </Text>
      <Text font={FONT_MONO} fontSize={0.18} color="#8f887a" anchorX="left" position={[-1.88, 2.02, 0]}>
        {plan.no} / {plan.name.toUpperCase()}
      </Text>
      <Text font={FONT_SERIF_IT} fontSize={0.96} color="#F1EBDD" anchorX="left" anchorY="middle" position={[-1.9, 1.0, 0]} maxWidth={3.6}>
        {plan.name}
      </Text>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[3.8, 0.012, 0.01]} />
        <meshBasicMaterial color={accent} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <Text font={FONT_MONO} fontSize={0.3} color={accent} anchorX="left" anchorY="middle" position={[-1.88, -0.28, 0]}>
        {plan.price}
      </Text>
      <Text font={FONT_MONO} fontSize={0.13} color="#7f7a6f" anchorX="left" anchorY="middle" position={[-1.88, -0.62, 0]} letterSpacing={0.12}>
        {plan.unit ? plan.unit.toUpperCase() : "SCOPE-BASED"}
      </Text>
      <Text font={FONT_MONO} fontSize={0.13} color="#b5ae9f" anchorX="left" anchorY="middle" position={[-1.88, -1.5, 0]} maxWidth={3.7} lineHeight={1.6}>
        {plan.cta}
      </Text>
      <Text font={FONT_MONO} fontSize={0.11} color="#6e6a61" anchorX="left" position={[-1.88, -2.35, 0]} letterSpacing={0.12}>
        NDE / NOIRDEMONS / PLANS
      </Text>
      {[0, 1].map((i) => (
        <mesh key={i} position={[-1.94, 2.28 - i * 4.68, 0]}>
          <boxGeometry args={[0.28, 0.02, 0.02]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function S07Plans() {
  const step = useRef(-1);
  const manual = useRef(false);
  const autoModeRef = useRef<PlanMode>("managed");
  const mobile = useMobile();
  const mode = useReel((s) => s.planMode);

  // A click on the managed/source toggle outranks the scroll choreography until
  // the reel leaves S07, so the visitor can inspect either pricing set by hand.
  useEffect(
    () =>
      useReel.subscribe((s, prev) => {
        if (s.planMode !== prev.planMode && s.planMode !== autoModeRef.current) {
          manual.current = true;
        }
      }),
    [],
  );

  useFrame(() => {
    const state = useReel.getState();
    const p = state.p;
    if (p < 0.755) {
      manual.current = false;
      step.current = -1;
    }
    const autoMode: PlanMode = p < PLAN_FLIP ? "managed" : "source";
    // Flip the deck first: setPlanMode resets activePlan, so the plan index for
    // the new face has to be recomputed in the same frame.
    if (!manual.current && state.planMode !== autoMode) {
      autoModeRef.current = autoMode;
      state.setPlanMode(autoMode);
      step.current = -1;
    }
    // Cycle the four cards across the active face's window, clamped so the
    // first and last plan hold at the edges instead of blanking.
    const modeNow: PlanMode = manual.current ? state.planMode : autoMode;
    const span = PLAN_SPAN[modeNow];
    const local = clamp01((p - span.from) / (span.to - span.from));
    const next = Math.min(3, Math.floor(local * 4));
    if (next !== step.current) {
      step.current = next;
      state.setActivePlan(next);
    }
  });
  return (
    <group>
      <ambientLight color="#a8d8d2" intensity={0.3} />
      <directionalLight color="#DFF7F1" intensity={1.6} position={[0, 8, -450]} />
      <Fluid />
      {!mobile && (
        <group name="plans_cards">
          {[0, 1, 2, 3].map((i) => (
            <PlanCard key={i} planIndex={i} mode={mode} />
          ))}
        </group>
      )}
      <Billboard position={[0, mobile ? 7.2 : 8.1, -482]} scale={mobile ? 0.58 : 1}>
        <Headline3D
          pStart={0.768}
          pEnd={0.905}
          maxWidth={30}
          anchorX="center"
          lines={[{ text: "Choose your terms.", size: 1.55, italic: true, color: "#EAF6F2", y: 0 }]}
        />
      </Billboard>
      <Text font={FONT_MONO} fontSize={0.18} color="#8bb5ad" position={[0, 6.4, -482]} anchorX="center" letterSpacing={0.3}>
        MANAGED OR OWNED / FOUR WAYS IN
      </Text>
      <Dust count={380} spread={[34, 14, 16]} origin={[0, 3, -480]} color="#bff0e3" size={0.03} />
      <pointLight color="#9FE6D8" intensity={22} distance={28} decay={2} position={[0, 4, -468]} />
      <pointLight color="#C9A24B" intensity={10} distance={20} decay={2} position={[-8, 7, -474]} />
    </group>
  );
}
