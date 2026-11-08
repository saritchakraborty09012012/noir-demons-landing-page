import Lenis from "lenis";

let lenis: Lenis | null = null;

export function bindLenis(instance: Lenis | null) {
  lenis = instance;
}

export function setScrollEnabled(on: boolean) {
  if (!lenis) return;
  if (on) lenis.start();
  else lenis.stop();
}

export function progressTarget(p: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(1, p)) * max;
}

export function jumpTo(p: number, duration = 1.9) {
  if (!lenis) {
    window.scrollTo({ top: progressTarget(p), behavior: "smooth" });
    return;
  }
  lenis.scrollTo(progressTarget(p), {
    duration,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
  });
}
