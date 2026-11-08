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
  const go = () => {
    const state = useReel.getState();
    // At the very end, the down arrow dives into the 2D page; anywhere else it
    // scrolls one scene-length forward.
    if (state.p >= 0.998) state.openDive();
    else jumpTo(Math.min(1, state.p + 0.035), 1.4);
  };
  return (
    <button type="button" className="scroll-hint" onClick={go} aria-label="Scroll down">
      <span className="scroll-hint__bubble" aria-hidden="true">
        <i className="scroll-hint__arrow" />
      </span>
      <span className="scroll-hint__label">Scroll</span>
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
