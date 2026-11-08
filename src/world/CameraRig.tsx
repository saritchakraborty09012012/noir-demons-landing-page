import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, CatmullRomCurve3 } from "three";
import { useStore } from "../lib/store";

const positions = [
 new Vector3(0,0,8), new Vector3(0,0,2), new Vector3(2,0,-5),
 new Vector3(0,0,-12), new Vector3(-2,0,-20), new Vector3(0,0,-28),
];
const targets = [
 new Vector3(0,0,0), new Vector3(0,0,-3), new Vector3(0,0,-8),
 new Vector3(0,0,-15), new Vector3(0,0,-22), new Vector3(0,0,-30),
];
const posCurve = new CatmullRomCurve3(positions);
const tgtCurve = new CatmullRomCurve3(targets);

export default function CameraRig() {
  const { camera } = useThree();
  const disp = useRef(0);
  useFrame((_, dt) => {
    const p = useStore.getState().p;
    disp.current += (p - disp.current) * 0.08;
    const pt = posCurve.getPointAt(Math.min(0.999, disp.current));
    const tt = tgtCurve.getPointAt(Math.min(0.999, disp.current));
    camera.position.copy(pt);
    camera.lookAt(tt);
  });
  return null;
}