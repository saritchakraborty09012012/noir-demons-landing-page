import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Group, MeshBasicMaterial } from "three";
import { useReel } from "../../store/useReel";
import { smooth } from "../chapters";
import { FONT_SERIF_IT, FONT_SERIF, FONT_DISPLAY, FONT_MONO } from "../fonts";
import { useMobile } from "../useMobile";

export type Line = {
  text: string;
  size: number;
  color?: string;
  x?: number;
  y?: number;
  z?: number;
  italic?: boolean;
  display?: boolean;
  letterSpacing?: number;
  rotation?: [number, number, number];
};

type Props = {
  lines: Line[];
  pStart: number;
  pEnd: number;
  delay?: number;
  stagger?: number;
  maxWidth?: number;
  anchorX?: "left" | "center" | "right";
  outAt?: number;
};

export function Headline3D({
  lines,
  pStart,
  pEnd,
  delay = 0,
  stagger = 0.025,
  maxWidth = 40,
  anchorX = "center",
  outAt = 0.02,
}: Props) {
  const refs = useRef<(Group | null)[]>([]);

  useFrame(() => {
    const p = useReel.getState().p;
    refs.current.forEach((group, i) => {
      if (!group) return;
      const start = pStart + delay + i * stagger;
      const enter = smooth(start, start + 0.018, p);
      const leave = 1 - smooth(pEnd - outAt, pEnd, p);
      const a = Math.min(enter, leave);
      group.visible = a > 0.002;
      group.position.y = (lines[i].y ?? 0) + (1 - enter) * 0.55;
      group.traverse((child: any) => {
        if (child.material && "opacity" in child.material) {
          child.material.transparent = true;
          child.material.opacity = a;
          child.material.toneMapped = false;
        }
      });
    });
  });

  return (
    <>
      {lines.map((line, i) => (
        <group
          key={`${line.text}-${i}`}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[line.x ?? 0, line.y ?? 0, line.z ?? 0]}
          rotation={line.rotation ?? [0, 0, 0]}
        >
          <Text
            font={line.display ? FONT_DISPLAY : line.italic ? FONT_SERIF_IT : FONT_SERIF}
            fontSize={line.size}
            color={line.color ?? "#ECE7DD"}
            anchorX={anchorX}
            anchorY="middle"
            maxWidth={maxWidth}
            lineHeight={0.9}
            letterSpacing={line.letterSpacing ?? -0.015}
            textAlign={anchorX}
          >
            {line.text}
          </Text>
        </group>
      ))}
    </>
  );
}

export function HeroTitle() {
  const mobile = useMobile();
  return (
    <group position={[mobile ? -0.4 : -1.2, mobile ? 6.9 : 0, 0]} scale={mobile ? 0.32 : 1}>
      <Headline3D
        pStart={0}
        pEnd={0.115}
        delay={0.002}
        stagger={0.007}
        lines={[
          { text: "Make the", size: 1.55, x: -3.4, y: 6.6, z: 3.6, italic: true, letterSpacing: -0.01 },
          { text: "impossible", size: 3.1, x: 0, y: 4.25, z: -7.5, italic: true, color: "#EBCB82" },
          { text: "useful.", size: 2.9, x: 2.6, y: 1.55, z: 7.2, italic: true },
        ]}
      />
    </group>
  );
}

export function SmallMono3D({
  text,
  position,
  size = 0.22,
  color = "#C9A24B",
  pStart,
  pEnd,
}: {
  text: string;
  position: [number, number, number];
  size?: number;
  color?: string;
  pStart: number;
  pEnd: number;
}) {
  const ref = useRef<any>(null);
  useFrame(() => {
    const p = useReel.getState().p;
    if (!ref.current) return;
    const a = Math.min(smooth(pStart, pStart + 0.02, p), 1 - smooth(pEnd - 0.01, pEnd, p));
    ref.current.material.transparent = true;
    ref.current.material.opacity = a;
    ref.current.visible = a > 0.01;
  });
  return (
    <Text ref={ref} font={FONT_MONO} position={position} fontSize={size} color={color} anchorX="center" anchorY="middle" letterSpacing={0.12}>
      {text}
    </Text>
  );
}

export function setOpacity(obj: any, a: number) {
  if (!obj) return;
  obj.traverse?.((c: any) => {
    if (c.material) {
      c.material.transparent = true;
      c.material.opacity = a;
    }
  });
}

export type { MeshBasicMaterial };
