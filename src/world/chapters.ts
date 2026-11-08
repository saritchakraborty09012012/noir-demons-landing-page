export const CHAPTERS = [
  { id: "S00", label: "LOADER", pStart: 0, pEnd: 0, holdStart: 0, holdEnd: 0, bg: "#050505", bloom: 0.6 },
  { id: "S01", label: "HERO / ACT I", pStart: 0.0, pEnd: 0.105, holdStart: 0.025, holdEnd: 0.075, bg: "#070504", bloom: 1.0 },
  { id: "S02", label: "PREMISE", pStart: 0.105, pEnd: 0.195, holdStart: 0.125, holdEnd: 0.17, bg: "#060606", bloom: 0.8 },
  { id: "S03", label: "IMPACT → RISE", pStart: 0.195, pEnd: 0.285, holdStart: 0.215, holdEnd: 0.255, bg: "#030405", bloom: 1.3 },
  { id: "S04", label: "CONSTELLATION", pStart: 0.285, pEnd: 0.435, holdStart: 0.325, holdEnd: 0.395, bg: "#030407", bloom: 1.4 },
  { id: "S05", label: "THE ENGINE", pStart: 0.435, pEnd: 0.615, holdStart: 0.47, holdEnd: 0.56, bg: "#02040a", bloom: 1.8 },
  { id: "S06", label: "KEYS VS DRIVE", pStart: 0.615, pEnd: 0.765, holdStart: 0.65, holdEnd: 0.72, bg: "#040507", bloom: 1.2 },
  { id: "S07", label: "PLANS", pStart: 0.765, pEnd: 0.90, holdStart: 0.79, holdEnd: 0.86, bg: "#031012", bloom: 1.1 },
  { id: "S08", label: "VISION", pStart: 0.90, pEnd: 0.965, holdStart: 0.915, holdEnd: 0.945, bg: "#020307", bloom: 1.2 },
  { id: "S09", label: "OUTRO", pStart: 0.965, pEnd: 1.0, holdStart: 0.985, holdEnd: 1.0, bg: "#040302", bloom: 0.55 },
] as const;

export const BOUNDARIES = [0.105, 0.195, 0.285, 0.435, 0.615, 0.765, 0.9, 0.965];

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / Math.max(0.00001, b - a));
  return t * t * (3 - 2 * t);
};

export function chapterAt(p: number) {
  for (let i = CHAPTERS.length - 1; i >= 0; i -= 1) {
    if (p >= CHAPTERS[i].pStart) return CHAPTERS[i];
  }
  return CHAPTERS[0];
}

export function flashAt(p: number) {
  let best = 0;
  for (const b of BOUNDARIES) {
    const d = Math.abs(p - b);
    if (d < 0.0045) best = Math.max(best, 1 - d / 0.0045);
  }
  return best;
}

export const RANGES = {
  hero: [0.0, 0.122],
  premise: [0.104, 0.2],
  impact: [0.194, 0.29],
  constellation: [0.282, 0.44],
  engine: [0.432, 0.62],
  keys: [0.612, 0.772],
  plans: [0.762, 0.905],
  vision: [0.898, 0.968],
  outro: [0.958, 1.0],
} as const;
