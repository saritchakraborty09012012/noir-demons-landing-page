import { useEffect } from "react";
import gsap from "gsap";
import { useReel } from "../store/useReel";
import { flashAt } from "../world/chapters";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, p: number) => {
  const t = clamp((p - a) / Math.max(0.00001, b - a));
  return t * t * (3 - 2 * t);
};
const win = (p: number, a: number, b: number, c: number, d: number) =>
  Math.min(smooth(a, b, p), 1 - smooth(c, d, p));

export const ALPHA_WINDOWS = {
  hero: [0.004, 0.03, 0.086, 0.103],
  premise: [0.111, 0.125, 0.178, 0.192],
  impact: [0.199, 0.213, 0.272, 0.283],
  constellation: [0.296, 0.312, 0.41, 0.429],
  engine: [0.448, 0.462, 0.592, 0.609],
  keys: [0.622, 0.638, 0.736, 0.754],
  plans: [0.77, 0.786, 0.888, 0.9],
  vision: [0.905, 0.915, 0.949, 0.96],
  outro: [0.968, 0.98, 1.002, 1.003],
  table: [0.736, 0.746, 0.757, 0.766],
  build: [0.652, 0.664, 0.705, 0.715],
  managed: [0.711, 0.721, 0.743, 0.752],
} as const;

export default function StageDriver() {
  useEffect(() => {
    const root = document.documentElement;
    const hint = document.querySelector<HTMLElement>(".scroll-hint");
    const table = document.querySelector<HTMLElement>(".table-wrap");
    let live: HTMLElement[] = [];
    const collect = () => {
      live = Array.from(document.querySelectorAll<HTMLElement>("[data-live]"));
    };
    collect();
    const timer = window.setTimeout(collect, 800);

    const tick = () => {
      const p = useReel.getState().p;
      root.style.setProperty("--p", p.toFixed(4));
      root.style.setProperty("--flash", flashAt(p).toFixed(4));
      const alphas: Record<string, number> = {};
      for (const [key, w] of Object.entries(ALPHA_WINDOWS)) {
        const a = win(p, w[0], w[1], w[2], w[3]);
        alphas[key] = a;
        root.style.setProperty(`--a-${key}`, a.toFixed(3));
      }
      if (hint) {
        const gone = p > 0.0045;
        hint.classList.toggle("is-gone", gone);
        hint.inert = gone;
      }
      if (table) table.classList.toggle("is-in", alphas.table > 0.35);
      for (const el of live) {
        const key = el.dataset.live || "";
        const a = alphas[key] ?? 0;
        el.style.pointerEvents = a > 0.3 ? "auto" : "none";
        el.inert = a <= 0.3;
      }
    };
    tick();
    gsap.ticker.add(tick);
    return () => {
      window.clearTimeout(timer);
      gsap.ticker.remove(tick);
    };
  }, []);
  return null;
}
