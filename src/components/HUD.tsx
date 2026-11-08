import { useEffect, useRef } from "react";
import { useReel } from "../store/useReel";
import { jumpTo } from "../lib/scroll";
import { CHAPTERS } from "../world/chapters";

const pad = (n: number) => String(n).padStart(2, "0");

export function Rail() {
  const chapter = useReel((s) => s.chapter);
  const go = (i: number) => {
    const c = CHAPTERS[i];
    const target = c.pEnd <= c.pStart ? 0 : c.pStart + (c.pEnd - c.pStart) * 0.34;
    jumpTo(target, 1.55);
  };
  return (
    <nav className="rail" aria-label="Scenes">
      <span className="rail__line" />
      {CHAPTERS.map((c, i) => (
        <button
          key={c.id}
          className={chapter === c.id ? "is-active" : ""}
          onClick={() => go(i)}
          aria-label={`${c.id} ${c.label}`}
          aria-current={chapter === c.id ? "step" : undefined}
        >
          <span>
            {c.id} / {c.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

export function HudClock() {
  const time = useRef<HTMLSpanElement>(null);
  const chap = useReel((s) => s.chapter);
  useEffect(() => {
    let id = 0;
    const tick = () => {
      const p = useReel.getState().p;
      const total = p * 180;
      const m = Math.floor(total / 60);
      const s = Math.floor(total % 60);
      const f = Math.floor((total % 1) * 24);
      if (time.current) time.current.textContent = `00:${pad(m)}:${pad(s)}:${pad(f)}`;
      id = window.setTimeout(tick, 66);
    };
    tick();
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className="hud-clock">
      <span className="hud-clock__meta">{chap} / 35MM / 24FPS</span>
      <span className="hud-clock__rec">
        <i /> REC
      </span>
      <span className="hud-clock__time" ref={time}>
        00:00:00:00
      </span>
    </div>
  );
}

export function ScrollHint() {
  return (
    <button
      type="button"
      className="scroll-hint"
      onClick={() => jumpTo(0.03, 1.7)}
      aria-label="Scroll to begin the reel"
    >
      <span className="scroll-hint__bubble" aria-hidden="true">
        <i className="scroll-hint__arrow" />
      </span>
      <span className="scroll-hint__label">Scroll to begin</span>
    </button>
  );
}

export function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (bar.current) bar.current.style.width = `${useReel.getState().p * 100}%`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="hud-progress" aria-hidden="true">
      <div className="hud-progress__bar" ref={bar} />
    </div>
  );
}
