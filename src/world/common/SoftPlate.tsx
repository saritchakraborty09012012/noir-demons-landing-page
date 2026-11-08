import type { RefObject } from "react";
import * as THREE from "three";

const vert = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const frag = /* glsl */ `
uniform float uOpacity;
varying vec2 vUv;
void main(){
  vec2 p = (vUv - 0.5) * vec2(1.0, 1.18);
  float d = length(p);
  float a = (1.0 - smoothstep(0.24, 0.62, d)) * uOpacity;
  gl_FragColor = vec4(0.008, 0.011, 0.022, a);
}`;

type Props = {
  width: number;
  height: number;
  position?: [number, number, number];
  opacity?: number;
  materialRef?: RefObject<THREE.ShaderMaterial | null>;
};

export function SoftPlate({
  width,
  height,
  position = [0, 0, -0.9],
  opacity = 0,
  materialRef,
}: Props) {
  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{ uOpacity: { value: opacity } }}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
