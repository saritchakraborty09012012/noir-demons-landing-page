import { create } from "zustand";

export type Quality = "ULTRA" | "HIGH" | "LITE";

type State = {
  p: number;
  setP: (p: number) => void;
  boot: number;
  booted: boolean;
  setBoot: (v: number) => void;
  finishBoot: () => void;
  quality: Quality;
  cycleQuality: () => void;
  setQuality: (q: Quality) => void;
  sound: boolean;
  setSound: (v: boolean) => void;
  reduced: boolean;
  setReduced: (v: boolean) => void;
  planMode: "managed" | "source";
  setPlanMode: (m: "managed" | "source") => void;
  activePlan: number;
  setActivePlan: (i: number) => void;
  focusProduct: number;
  setFocusProduct: (i: number) => void;
  chapter: string;
  setChapter: (id: string) => void;
  dive: boolean;
  openDive: () => void;
  closeDive: () => void;
};

const guessQuality = (): Quality => {
  if (typeof window === "undefined") return "HIGH";
  const mem = (navigator as any).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (window.innerWidth < 700 || mem <= 4 || cores <= 4) return "HIGH";
  return "HIGH";
};

export const useReel = create<State>((set, get) => ({
  p: 0,
  setP: (p) => set({ p }),
  boot: 0,
  booted: false,
  setBoot: (boot) => set({ boot }),
  finishBoot: () => set({ boot: 1, booted: true }),
  quality: guessQuality(),
  cycleQuality: () => {
    const order: Quality[] = ["ULTRA", "HIGH", "LITE"];
    const i = order.indexOf(get().quality);
    set({ quality: order[(i + 1) % order.length] });
  },
  setQuality: (quality) => set({ quality }),
  sound: false,
  setSound: (sound) => set({ sound }),
  reduced: false,
  setReduced: (reduced) => set({ reduced }),
  planMode: "managed",
  setPlanMode: (planMode) => set({ planMode, activePlan: 0 }),
  activePlan: 0,
  setActivePlan: (activePlan) => set({ activePlan }),
  focusProduct: 0,
  setFocusProduct: (focusProduct) => set({ focusProduct }),
  chapter: "S00",
  setChapter: (chapter) => set({ chapter }),
  dive: false,
  openDive: () => set({ dive: true }),
  closeDive: () => set({ dive: false }),
}));
