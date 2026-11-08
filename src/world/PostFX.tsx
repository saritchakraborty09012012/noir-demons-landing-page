import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useReel } from "../store/useReel";
import { chapterAt, flashAt } from "../world/chapters";

export default function PostFX() {
  const quality = useReel((s) => s.quality);
  const bloom = useRef<any>(null);
  const ca = useRef<any>(null);
  const dof = useRef<any>(null);

  useFrame(() => {
    const p = useReel.getState().p;
    const f = flashAt(p);
    const chapter = chapterAt(p);
    if (bloom.current) bloom.current.intensity = chapter.bloom * (1 + f * 1.6) + 0.12;
    if (ca.current) ca.current.offset.set(0.0007 + f * 0.007, 0.0005 + f * 0.005);
    if (dof.current) dof.current.bokehScale = 2 + (1 - f) * 1.5;
  });

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom ref={bloom} mipmapBlur intensity={1.1} luminanceThreshold={0.52} luminanceSmoothing={0.3} radius={0.72} />
      {quality !== "LITE" && (
        <ChromaticAberration ref={ca} offset={[0.0008, 0.0006]} radialModulation modulationOffset={0.35} />
      )}
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.055} />
      <Vignette eskil={false} offset={0.16} darkness={0.86} />
      {quality === "ULTRA" && (
        <DepthOfField ref={dof} focusDistance={0.012} focalLength={0.05} bokehScale={2.8} />
      )}
    </EffectComposer>
  );
}
