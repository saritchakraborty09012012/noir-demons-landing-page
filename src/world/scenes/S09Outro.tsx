import { useRef } from "react";
import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EMAIL, MAILTO } from "../../content/content";
import { FONT_MONO, FONT_SERIF_IT } from "../fonts";
import { Dust } from "../common/Particles";
import PortalGate from "../common/PortalGate";
import { Headline3D } from "../common/Headline3D";
import { useMobile } from "../useMobile";

function Bridge() {
  const pylons = Array.from({ length: 7 }, (_, i) => i);
  return (
    <group>
      <mesh position={[0, -0.2, -592]}>
        <boxGeometry args={[10, 0.45, 62]} />
        <meshStandardMaterial color="#070707" metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.045, -592]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.6, 61]} />
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.98} roughness={0.08} envMapIntensity={1.6} />
      </mesh>
      {[-4.7, 4.7].map((x) => (
        <mesh key={x} position={[x, 0.03, -592]}>
          <boxGeometry args={[0.06, 0.03, 61]} />
          <meshBasicMaterial color="#E8C77E" toneMapped={false} />
        </mesh>
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={i} position={[0, 0.035, -562 - i * 3.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9.4, 0.015]} />
          <meshBasicMaterial color="#4a4234" transparent opacity={0.6} />
        </mesh>
      ))}
      {pylons.map((i) => (
        <group key={i} position={[0, 0, -566 - i * 7.2]}>
          {[-5.4, 5.4].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh position={[0, 1.1, 0]}>
                <boxGeometry args={[0.32, 2.4, 0.32]} />
                <meshStandardMaterial color="#0d0c0a" metalness={0.8} roughness={0.3} />
              </mesh>
              <mesh position={[0, 2.35, 0]}>
                <boxGeometry args={[0.42, 0.08, 0.42]} />
                <meshBasicMaterial color="#F3DDA0" toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      <PortalGate z={-620} y={4.2} scale={1.45} color="#FFDDA2" ribs={44} glowIntensity={2.1} coreIntensity={0.02} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, -620]}>
        <circleGeometry args={[16, 92]} />
        <meshStandardMaterial color="#030303" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
}

function ContactSculpture() {
  const mobile = useMobile();
  const glow = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.06 + Math.sin(clock.elapsedTime * 1.2) * 0.018;
      glow.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 0.9) * 0.02);
    }
  });
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={glow} position={[0, 4.2, -615.5]}>
        <circleGeometry args={[6.2, 64]} />
        <meshBasicMaterial color="#C9A24B" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <Text
        font={FONT_SERIF_IT}
        fontSize={mobile ? 0.58 : 1.28}
        color="#F2E9D7"
        anchorX="center"
        anchorY="middle"
        position={[0, 4.2, -614]}
        letterSpacing={-0.01}
        onClick={() => {
          window.location.href = MAILTO;
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        {EMAIL}
      </Text>
      <mesh position={[0, 2.95, -614]}>
        <boxGeometry args={[14.6, 0.018, 0.018]} />
        <meshBasicMaterial color="#C9A24B" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <Text font={FONT_MONO} fontSize={0.26} color="#C9A24B" position={[0, 6.5, -614]} anchorX="center" letterSpacing={0.28}>
        PROJECT INQUIRIES &amp; COLLABORATIONS
      </Text>
      <Text font={FONT_MONO} fontSize={0.19} color="#8b8579" position={[0, 1.7, -614]} anchorX="center" letterSpacing={0.22}>
        PRODUCTS / SYSTEMS / EXPERIENCES / COLLABORATIONS
      </Text>
      <Text font={FONT_MONO} fontSize={0.14} color="#5e5a51" position={[0, 0.9, -614]} anchorX="center" letterSpacing={0.18}>
        NDE — NOIRDEMONS, FORMERLY NOVEXA
      </Text>
    </group>
  );
}

export default function S09Outro() {
  const mobile = useMobile();
  return (
    <group>
      <ambientLight color="#c7ab7c" intensity={0.4} />
      <directionalLight color="#FFE0AE" intensity={1.4} position={[0, 12, -590]} />
      <pointLight color="#FFD9A0" intensity={24} distance={32} decay={2} position={[0, 4, -617]} />
      <pointLight color="#7FB7E8" intensity={16} distance={20} decay={2} position={[-5, 1, -588]} />
      <Bridge />
      <ContactSculpture />
      <Billboard position={[0, mobile ? 8.2 : 9.6, -608]} scale={mobile ? 0.52 : 1}>
        <Headline3D
          pStart={0.968}
          pEnd={1.0}
          maxWidth={30}
          anchorX="center"
          lines={[{ text: "The door is open.", size: 1.45, italic: true, color: "#EBCB82", y: 0 }]}
        />
      </Billboard>
      <Dust count={700} spread={[18, 9, 34]} origin={[0, 4, -594]} color="#FFD79A" size={0.04} />
    </group>
  );
}
