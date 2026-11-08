import { useEffect, useMemo, useRef } from "react";
import { Billboard, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReel } from "../../store/useReel";
import { smooth } from "../chapters";
import { FONT_MONO } from "../fonts";
import { Headline3D } from "../common/Headline3D";
import { SoftPlate } from "../common/SoftPlate";
import { Starfield } from "../common/Particles";
import { useMobile } from "../useMobile";

const CENTER = new THREE.Vector3(0, 0, -552);

const particleVert = /* glsl */ `
uniform float t;
varying vec3 vColor;
void main(){
  float r = position.x;
  float an = position.y + t * 5.0 / pow(r, 1.5);
  vec3 p = vec3(cos(an) * r, position.z * r * 0.3, sin(an) * r);
  vColor = mix(vec3(1.0, 0.8, 0.4), vec3(0.3, 0.55, 1.0), smoothstep(3.0, 18.0, r)) * (1.0 + 0.7 * sin(an));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = clamp(1.0 * 60.0 / -mv.z, 1.0, 4.0);
  gl_Position = projectionMatrix * mv;
}`;

const particleFrag = /* glsl */ `
varying vec3 vColor;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, (1.0 - d * 2.0) * 0.9);
}`;

type DiscProps = {
  count: number;
  r0: number;
  r1: number;
  tilt: number;
  uniforms: { t: { value: number } };
};

function Disc({ count, r0, r1, tilt, uniforms }: DiscProps) {
  const geometry = useMemo(() => {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      points[i * 3] = r0 + Math.pow(Math.random(), 1.6) * (r1 - r0);
      points[i * 3 + 1] = Math.random() * Math.PI * 2;
      points[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(points, 3));
    return g;
  }, [count, r0, r1]);

  return (
    <points geometry={geometry} rotation={[tilt, 0, 0]} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function glowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,255,255,.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function BlackHole({ mobile }: { mobile: boolean }) {
  const uniforms = useMemo(() => ({ t: { value: 0 } }), []);
  const photon = useRef<THREE.Mesh>(null);
  const glowMap = useMemo(glowTexture, []);

  useFrame(({ clock }) => {
    uniforms.t.value = clock.elapsedTime;
    if (photon.current) photon.current.rotation.z = clock.elapsedTime;
  });

  return (
    <group position={CENTER} scale={mobile ? 0.62 : 1}>
      <mesh>
        <sphereGeometry args={[3, 48, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={photon}>
        <torusGeometry args={[3.15, 0.07, 8, 120]} />
        <meshBasicMaterial color="#FFF0CF" toneMapped={false} />
      </mesh>
      <sprite scale={[10, 10, 1]}>
        <spriteMaterial
          map={glowMap}
          color="#FFD58A"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </sprite>
      <sprite scale={[26, 26, 1]}>
        <spriteMaterial
          map={glowMap}
          color="#6FA8FF"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </sprite>
      <group rotation={[0.42, 0, 0]}>
        <Disc count={mobile ? 18000 : 42000} r0={4} r1={19} tilt={0.28} uniforms={uniforms} />
        <Disc
          count={mobile ? 6000 : 14000}
          r0={3.3}
          r1={5.4}
          tilt={Math.PI / 2 - 0.28}
          uniforms={uniforms}
        />
      </group>
    </group>
  );
}

export default function S08Vision() {
  const mobile = useMobile();
  const plateRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const title = useRef<THREE.Group>(null);
  const titlePos = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    title.current?.traverse((child: any) => {
      if (!child.material) return;
      child.material.depthTest = false;
      child.material.depthWrite = false;
      child.renderOrder = 30;
    });
  }, []);
  useFrame(() => {
    const p = useReel.getState().p;
    if (plateRef.current) {
      const a = smooth(0.9, 0.914, p) * (1 - smooth(0.948, 0.958, p));
      plateRef.current.uniforms.uOpacity.value = a * 0.98;
    }
    if (title.current) {
      titlePos
        .set(0, mobile ? 1.35 : 1.45, -5)
        .applyQuaternion(camera.quaternion)
        .add(camera.position);
      title.current.position.copy(titlePos);
    }
  });
  return (
    <group>
      <BlackHole mobile={mobile} />
      <Starfield count={2000} radius={34} size={0.07} opacity={0.55} speed={0.012} color="#cfe2ff" origin={[0, 0, -552]} />
      <Starfield count={480} radius={17} size={0.05} opacity={0.8} speed={-0.03} color="#ffe0ad" origin={[0, 0, -552]} />
      <group ref={title}>
        <Billboard scale={mobile ? 0.18 : 0.26}>
          <SoftPlate width={24} height={9.5} materialRef={plateRef} />
          <Headline3D
            pStart={0.896}
            pEnd={0.95}
            stagger={0.003}
            outAt={0.012}
            maxWidth={26}
            anchorX="center"
            lines={[
              { text: "A more", size: 1.05, italic: true, y: 2.2 },
              { text: "useful digital", size: 1.95, italic: true, y: 0.35, color: "#EBCB82" },
              { text: "world.", size: 1.65, italic: true, y: -1.5 },
            ]}
          />
        </Billboard>
      </group>
      <Text font={FONT_MONO} fontSize={0.19} color="#8f9bb1" position={[0, -7.2, -540]} anchorX="center" letterSpacing={0.3}>
        THE HORIZON IS A DOOR / KEEP FALLING
      </Text>
    </group>
  );
}
