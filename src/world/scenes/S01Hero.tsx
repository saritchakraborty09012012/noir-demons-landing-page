import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { useReel } from "../../store/useReel";
import { smooth } from "../chapters";
import { FONT_SERIF_IT, FONT_MONO } from "../fonts";
import { Dust, GodRay } from "../common/Particles";
import { HeroTitle } from "../common/Headline3D";

const stone = { color: "#211d18", roughness: 0.95, metalness: 0.03 };
const darkStone = { color: "#15120f", roughness: 0.98, metalness: 0.02 };

function Flag() {
  const cloth = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(3.4, 2.1, 24, 14), []);
  const base = useMemo(() => {
    const pos = geo.attributes.position;
    return Float32Array.from(pos.array as Float32Array);
  }, [geo]);
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 320;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0d0c0b";
    ctx.fillRect(0, 0, 512, 320);
    ctx.strokeStyle = "rgba(201,162,75,.65)";
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, 476, 284);
    ctx.fillStyle = "#d9b769";
    ctx.font = "italic 132px serif";
    ctx.textAlign = "center";
    ctx.fillText("NDE", 256, 180);
    ctx.fillStyle = "rgba(236,231,221,.55)";
    ctx.font = "22px monospace";
    ctx.letterSpacing = "8px";
    ctx.fillText("NOIRDEMONS", 256, 235);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useFrame(({ clock }) => {
    if (!cloth.current) return;
    const pos = cloth.current.geometry.attributes.position;
    const t = clock.elapsedTime;
    for (let i = 0; i < pos.count; i += 1) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const wave = Math.sin(x * 2.2 + t * 2.1) * 0.2 + Math.cos(y * 2.8 + t * 1.7) * 0.07;
      pos.setZ(i, wave * ((x + 1.7) / 3.4));
    }
    pos.needsUpdate = true;
    cloth.current.geometry.computeVertexNormals();
  });

  return (
    <group position={[5.4, 4.5, -13.5]}>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 9.8, 10]} />
        <meshStandardMaterial color="#2b2620" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0.35, 9.2, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#c9a24b" metalness={1} roughness={0.25} />
      </mesh>
      <mesh ref={cloth} geometry={geo} position={[1.9, 8.2, 0]}>
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Figure() {
  return (
    <group name="figure" position={[0.4, 0, -6.2]} rotation={[0, -0.18, 0]}>
      <mesh position={[0, 1.35, 0]} castShadow>
        <coneGeometry args={[1.22, 3.1, 18, 1, true]} />
        <meshStandardMaterial color="#0d0c0b" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 2.55, 0.15]}>
        <sphereGeometry args={[0.44, 18, 16]} />
        <meshStandardMaterial color="#0a0908" roughness={0.88} />
      </mesh>
      <mesh position={[0, 2.52, -0.08]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.62, 1.1, 14, 1, true]} />
        <meshStandardMaterial color="#080706" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.72, 1.5, 0.32]} rotation={[0.5, 0, -0.85]}>
        <capsuleGeometry args={[0.16, 1.1, 5, 8]} />
        <meshStandardMaterial color="#0d0c0b" roughness={0.9} />
      </mesh>
      <mesh position={[0.72, 1.5, 0.32]} rotation={[0.5, 0, 0.85]}>
        <capsuleGeometry args={[0.16, 1.1, 5, 8]} />
        <meshStandardMaterial color="#0d0c0b" roughness={0.9} />
      </mesh>
      <pointLight color="#ffb35e" intensity={9} distance={5} position={[0.8, 2.3, 1.4]} />
    </group>
  );
}

export default function S01Hero() {
  const debris = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        i,
        p: [
          (Math.random() - 0.5) * 14,
          0.6 + Math.random() * 7.5,
          -12 + (Math.random() - 0.5) * 12,
        ] as [number, number, number],
        s: 0.18 + Math.random() * 0.6,
        speed: 0.25 + Math.random() * 0.6,
      })),
    [],
  );
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const p = useReel.getState().p;
    group.current.children.forEach((child, i) => {
      if (!child.name.startsWith("debris_")) return;
      const d = debris[i];
      if (!d) return;
      child.position.y = d.p[1] + Math.sin(clock.elapsedTime * d.speed + i) * 0.22 + p * 0.4;
      child.rotation.x += 0.0008 * d.speed;
      child.rotation.y += 0.0011 * d.speed;
    });
  });

  return (
    <group>
      <ambientLight color="#7b6c55" intensity={0.55} />
      <directionalLight color="#ffd39a" intensity={2.4} position={[-6, 12, 8]} />
      <spotLight color="#ffbf70" intensity={130} angle={0.55} penumbra={1} position={[0, 16, 2]} distance={50} decay={1.6} />
      <pointLight color="#d87825" intensity={70} distance={25} decay={2} position={[4, 3, -17]} />
      <pointLight color="#5a7d95" intensity={30} distance={22} decay={2} position={[-8, 2, 2]} />
      <GodRay position={[-1.2, 10, -8]} scale={[1.1, 1.2, 1.1]} opacity={0.09} />
      <GodRay position={[3.5, 9.5, -14]} scale={[0.7, 1, 0.7]} opacity={0.05} color="#ffe4b0" />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, -10]} receiveShadow>
        <planeGeometry args={[90, 80, 40, 40]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      {Array.from({ length: 22 }).map((_, i) => (
        <mesh
          key={i}
          position={[(Math.random() - 0.5) * 15, Math.random() * 0.3, -10 + (Math.random() - 0.5) * 13]}
          rotation={[Math.random(), Math.random(), Math.random()]}
          scale={0.16 + Math.random() * 0.55}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#1b1814" roughness={0.98} />
        </mesh>
      ))}

      {/* arch */}
      <group name="arch_ruins" position={[0, 0, -13]}>
        <RoundedBox args={[2.3, 9.6, 2.3]} radius={0.12} smoothness={3} position={[-5.3, 4.6, 0]}>
          <meshStandardMaterial {...stone} />
        </RoundedBox>
        <RoundedBox args={[2.6, 1, 2.6]} radius={0.1} position={[-5.3, 0.4, 0]}>
          <meshStandardMaterial {...darkStone} />
        </RoundedBox>
        <RoundedBox args={[2.3, 8.4, 2.3]} radius={0.12} smoothness={3} position={[5.3, 4, 0]}>
          <meshStandardMaterial {...stone} />
        </RoundedBox>
        <RoundedBox args={[2.7, 1.1, 2.7]} radius={0.1} position={[5.3, 0.45, 0]}>
          <meshStandardMaterial {...darkStone} />
        </RoundedBox>
        <RoundedBox args={[7.2, 1.8, 2.2]} radius={0.12} smoothness={3} position={[-1.9, 9.3, 0]} rotation={[0, 0, 0.03]}>
          <meshStandardMaterial {...stone} />
        </RoundedBox>
        <RoundedBox args={[3.6, 1.6, 2.2]} radius={0.1} smoothness={3} position={[3.1, 8.7, 0]} rotation={[0, 0, -0.12]}>
          <meshStandardMaterial {...stone} />
        </RoundedBox>
        <RoundedBox args={[1.4, 4.4, 2]} radius={0.08} smoothness={3} position={[-4.4, 11.2, 0]} rotation={[0, 0, 0.18]}>
          <meshStandardMaterial {...darkStone} />
        </RoundedBox>
        <pointLight color="#ffc16b" intensity={22} distance={12} position={[0, 6, 2.2]} />
      </group>

      <group ref={group}>
        {debris.map((d) => (
          <mesh key={d.i} name={`debris_${d.i}`} position={d.p} scale={d.s}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#251f18" roughness={0.92} metalness={0.04} />
          </mesh>
        ))}
      </group>

      <Figure />
      <Flag />
      <Dust count={1400} spread={[22, 12, 26]} origin={[0, 5, -8]} color="#ffcf8d" size={0.03} />

      <HeroTitle />
      <Text
        font={FONT_MONO}
        fontSize={0.2}
        color="#C9A24B"
        position={[0, 9.6, -13]}
        anchorX="center"
        letterSpacing={0.4}
      >
        NDE — NOIRDEMONS / ACT I
      </Text>
      <Text
        font={FONT_SERIF_IT}
        fontSize={0.28}
        color="#d7cbb7"
        position={[0, -0.2, -3]}
        anchorX="center"
        letterSpacing={0.06}
      >
        THE FALL &amp; THE BUILD
      </Text>
    </group>
  );
}
