import { useEffect, useState } from "react";
import { useReel } from "../store/useReel";
import { jumpTo, setScrollEnabled } from "../lib/scroll";
import { setAmbient } from "../lib/sound";
import { CONTACT_MAILTO, EMAIL, NAV } from "../content/content";

export default function Header() {
  const sound = useReel((s) => s.sound);
  const setSound = useReel((s) => s.setSound);
  const quality = useReel((s) => s.quality);
  const cycleQuality = useReel((s) => s.cycleQuality);
  const booted = useReel((s) => s.booted);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    void setAmbient(sound);
  }, [sound]);

  useEffect(() => {
    if (!menu) return;
    if (booted) setScrollEnabled(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (booted) setScrollEnabled(true);
    };
  }, [menu, booted]);

  const go = (p: number) => {
    setMenu(false);
    jumpTo(p, 1.6);
  };

  return (
    <>
      <header className="header">
        <button className="brand" onClick={() => go(0)} aria-label="NDE: NoirDemons — back to the beginning">
          <img className="brand__logo" src="/images/noirdemons.webp" alt="NDE: NoirDemons" />
          <span className="brand__stack">
            <span className="brand__word">NDE: NoirDemons</span>
            <span className="brand__sub">formerly Novexa</span>
          </span>
        </button>
        <nav className="header__nav" aria-label="Primary">
          {NAV.map((item) => (
            <button key={item.label} onClick={() => go(item.p)}>
              <span>{item.no}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="header__right">
          <button className="hud-btn" onClick={cycleQuality} aria-label={`Render quality: ${quality}. Change quality.`}>
            QUALITY <b>{quality}</b>
          </button>
          <button
            className={`hud-btn ${sound ? "is-on" : ""}`}
            onClick={() => setSound(!sound)}
            aria-pressed={sound}
            aria-label="Ambient sound"
          >
            <span className="dot" />
            SOUND <b>{sound ? "ON" : "OFF"}</b>
          </button>
          <a className="header__cta" href={CONTACT_MAILTO}>
            Start a conversation <i>↗</i>
          </a>
          <button
            className="hud-menu-btn"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label={menu ? "Close menu" : "Open menu"}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`menu ${menu ? "is-open" : ""}`} aria-hidden={!menu}>
        <div className="menu__top">
          <span className="brand__word">NDE: NoirDemons</span>
          <button className="menu__close" onClick={() => setMenu(false)}>
            CLOSE ✕
          </button>
        </div>
        <nav className="menu__nav" aria-label="Mobile">
          {NAV.map((item) => (
            <button key={item.label} onClick={() => go(item.p)}>
              {item.label} <small>{item.no}</small>
            </button>
          ))}
        </nav>
        <div className="menu__foot">
          <div className="menu__tools">
            <button
              className={sound ? "is-on" : ""}
              onClick={() => setSound(!sound)}
              aria-pressed={sound}
            >
              <span className="dot" />
              Sound {sound ? "on" : "off"}
            </button>
            <button onClick={cycleQuality}>Quality {quality}</button>
          </div>
          <a href={CONTACT_MAILTO}>Start a conversation ↗</a>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <span className="micro">NDE: NoirDemons, formerly Novexa</span>
        </div>
      </div>
    </>
  );
}
