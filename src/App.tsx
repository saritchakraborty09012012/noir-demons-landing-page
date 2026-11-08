import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReel } from "./store/useReel";
import { bindLenis, setScrollEnabled } from "./lib/scroll";
import { chapterAt } from "./world/chapters";
import World from "./world/World";
import Rig from "./world/Rig";
import PostFX from "./world/PostFX";
import Header from "./components/Header";
import { HudClock, ProgressBar, Rail, ScrollHint } from "./components/HUD";
import Preloader from "./components/Preloader";
import StageDriver from "./components/StageDriver";
import OverlaysRoot from "./components/OverlaysRoot";
import DivePage from "./components/DivePage";
import PolicyPage from "./components/PolicyPage";
import { POLICIES } from "./lib/policies";
import SeoCopy from "./components/SeoCopy";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const booted = useReel((s) => s.booted);
  const dive = useReel((s) => s.dive);
  const policy = POLICIES.find((p) => p.slug === location.pathname);
  if (policy) return <PolicyPage />;
  const quality = useReel((s) => s.quality);
  const setBoot = useReel((s) => s.setBoot);
  const finishBoot = useReel((s) => s.finishBoot);
  const setReduced = useReel((s) => s.setReduced);
  const spacerRef = useRef<HTMLDivElement>(null);
  const diveWasOpen = useRef(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.body.classList.add("is-locked");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(motion.matches);
    const onMotion = (e: MediaQueryListEvent) => setReduced(e.matches);
    motion.addEventListener("change", onMotion);
    if (window.innerWidth < 760) useReel.getState().setQuality("LITE");

    const lenis = new Lenis({ duration: 1.18, smoothWheel: true, touchMultiplier: 1.35 });
    bindLenis(lenis);
    lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const trigger = ScrollTrigger.create({
      trigger: spacerRef.current,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const state = useReel.getState();
        state.setP(self.progress);
        const chapter = chapterAt(self.progress);
        if (state.chapter !== chapter.id) state.setChapter(chapter.id);
      },
    });

    let ready = false;
    void Promise.all([
      document.fonts.load('italic 400 16px "Instrument Serif"'),
      document.fonts.load('400 16px "Anton"'),
      document.fonts.load('400 16px "JetBrains Mono"'),
      document.fonts.load('400 16px "Inter"'),
    ])
      .catch(() => [])
      .then(() => {
        ready = true;
      });

    const started = performance.now();
    let frame = 0;
    let cancelled = false;
    const boot = () => {
      if (cancelled) return;
      const elapsed = (performance.now() - started) / 1900;
      const progress = Math.min(1, elapsed, ready ? 1 : 0.84);
      setBoot(progress);
      if (progress >= 1) {
        finishBoot();
        const state = useReel.getState();
        state.setChapter(chapterAt(state.p).id);
        document.body.classList.remove("is-locked");
        document.body.classList.add("is-booted");
        lenis.start();
        window.setTimeout(() => ScrollTrigger.refresh(), 120);
      } else {
        frame = requestAnimationFrame(boot);
      }
    };
    boot();

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      motion.removeEventListener("change", onMotion);
      trigger.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
      bindLenis(null);
      document.body.classList.remove("is-locked");
    };
  }, [setBoot, finishBoot, setReduced]);

  const dpr: [number, number] = quality === "ULTRA" ? [1, 2] : quality === "HIGH" ? [1, 1.65] : [0.8, 1];

  // Dive page lifecycle: freeze the film, sync the #/dive hash, unlock on close.
  // Only clear the hash when closing an open page — on first load it can be a
  // #/dive deep-link that the trigger effect below is about to open.
  useEffect(() => {
    if (dive) {
      diveWasOpen.current = true;
      setScrollEnabled(false);
      document.body.classList.add("is-locked");
      if (!location.hash.includes("dive")) history.replaceState(null, "", "#/dive");
    } else if (diveWasOpen.current) {
      diveWasOpen.current = false;
      setScrollEnabled(true);
      document.body.classList.remove("is-locked");
      if (location.hash.includes("dive")) history.replaceState(null, "", location.pathname + location.search);
    }
  }, [dive]);

  // Two to three downward scrolls at the very end of the reel open the 2D page.
  useEffect(() => {
    let hits = 0;
    let touchY: number | null = null;
    const down = () => {
      const st = useReel.getState();
      if (st.dive) return;
      if (st.p >= 0.998) {
        hits += 1;
        if (hits >= 3) {
          hits = 0;
          st.openDive();
        }
      } else if (st.p < 0.99) {
        hits = 0;
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) down();
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (touchY != null && y != null && touchY - y > 60) {
        down();
        touchY = y;
      }
    };
    const onHash = () => {
      if (location.hash.includes("dive")) useReel.getState().openDive();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return (
    <div className={`site ${booted ? "is-booted" : ""}`}>
      <a className="skip" href="#contact-access">
        Skip to contact
      </a>
      <div className="stage" aria-hidden="true">
        <Canvas
          dpr={dpr}
          gl={{ antialias: quality !== "LITE", alpha: false, stencil: false, powerPreference: "high-performance" }}
          camera={{ position: [0, 3.4, 26], fov: 52, near: 0.1, far: 400 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <Suspense fallback={null}>
            <World />
            <PostFX />
          </Suspense>
          <Rig />
        </Canvas>
      </div>

      <div className="letterbox top" />
      <div className="letterbox bottom" />
      <div className="vignette" />
      <div className="grain" />
      <div className="scanlines" />
      <div className="flash" />
      <div className="corners" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>

      <Header />
      <Rail />
      <HudClock />
      <ScrollHint />
      <ProgressBar />
      <OverlaysRoot />

      <div className="spacer" ref={spacerRef} />
      <SeoCopy />
      <Preloader />
      <StageDriver />
      {dive && <DivePage />}
    </div>
  );
}
