import { CONTACT_MAILTO, EMAIL, MAILTO, NAV } from "../content/content";
import { jumpTo } from "../lib/scroll";
import { useReel } from "../store/useReel";

export function VisionPanel() {
  return (
    <section className="panel vision-panel" aria-label="Vision">
      <p className="eyebrow">Our vision / 008</p>
      <p className="lede">
        Products that work. Systems that think. Experiences that feel. A creative-technical studio
        for what&apos;s next.
      </p>
    </section>
  );
}

export function OutroPanel() {
  const openDive = useReel((s) => s.openDive);
  return (
    <section className="panel outro-panel" aria-label="Contact">
      <div className="outro-actions" data-live="outro">
        <a className="btn btn--gold" href={CONTACT_MAILTO}>
          Start a conversation <i>↗</i>
        </a>
        <button className="btn outro-dive-btn" onClick={openDive}>
          Dive deeper <i>↓</i>
        </button>
      </div>
      <footer className="outro-foot" data-live="outro">
        <div className="outro-foot__brand">
          <img src="/images/noirdemons.webp" alt="NDE: NoirDemons" />
          <span>NDE: NoirDemons, formerly Novexa</span>
        </div>
        <nav aria-label="Footer">
          {NAV.map((item) => (
            <button key={item.label} onClick={() => jumpTo(item.p, 1.4)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="outro-foot__right">
          <a href={MAILTO}>{EMAIL}</a>
          <button className="outro-foot__replay" onClick={() => jumpTo(0, 2.2)} aria-label="Replay the reel">
            <i /> REPLAY
          </button>
        </div>
      </footer>
    </section>
  );
}
