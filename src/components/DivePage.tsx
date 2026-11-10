import { useEffect, useRef } from "react";
import {
  CONTACT_MAILTO,
  EMAIL,
  MAILTO,
  PRODUCTS,
  PRODUCT_PITCH,
  TEMPLATES,
  referenceMail,
} from "../content/content";
import { useReel } from "../store/useReel";
import { jumpTo } from "../lib/scroll";
import { POLICIES } from "../lib/policies";
import SolveGraph from "./SolveGraph";
import CompareStudy from "./CompareStudy";

const byName = (name: string) => PRODUCTS.find((p) => p.name === name);
const pitchOf = (name: string) => PRODUCT_PITCH[PRODUCTS.findIndex((p) => p.name === name)] ?? "";

const GROUPS: Array<{ id: string; title: string; sub: string; names: string[]; note?: string }> = [
  {
    id: "dive-samples",
    title: "Our Top Public Products",
    sub: "LIVE / 01–04",
    names: ["Solve NCERT", "Novexa", "BlitzData", "EconoMind AI"],
  },
  {
    id: "dive-3d",
    title: "Our 3D Service Samples",
    sub: "SERVICE / 01–07",
    note: "None of the products below belong to any original existing brand, nor are they sold or any brand's property — NDE (NoirDemons) is solely responsible for the development, maintenance, copyright and ownership of these samples. All names shown are fictional and any resemblance to real brands, products or persons is purely coincidental; trademarks belong to their respective owners. Samples are rendered for demonstration of NDE's capabilities only.",
    names: ["The Legendary Arc Reactor", "Woodcrest Co.", "Oakhaven Home", "Aether Studio", "KOKO Coconut Co.", "Aven Serum", "Asterion Builders"],
  },
  {
    id: "dive-2d",
    title: "Our 2D Site Services",
    sub: "SERVICE / 01",
    names: ["GlossDrive Co."],
  },
];

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const NAV: Array<[string, string]> = [
  ["Ecosystem", "dive-hero"],
  ["Services", "dive-compare"],
  ["Templates", "dive-templates"],
  ["Plans", "dive-plans"],
  ["Achievement", "dive-growth"],
  ["Contact", "dive-contact"],
];

export default function DivePage() {
  const closeDive = useReel((s) => s.closeDive);
  const topRef = useRef<HTMLDivElement>(null);

  // Lock the film scroll while the 2D page is open so the reel stays put behind it.
  useEffect(() => {
    topRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDive();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDive]);

  const backToFilm = () => {
    closeDive();
    jumpTo(1, 0.6);
  };

  return (
    <div className="dive" role="dialog" aria-modal="true" aria-label="Products and samples">
      <div className="dive__scroll" ref={topRef} tabIndex={-1} data-lenis-prevent>
        <header className="dive__header">
          <div className="dive__brand">
            <img className="dive__logo" src="/images/noirdemons.webp" alt="NDE: NoirDemons" />
            <span className="dive__word">
              NDE: NoirDemons <small>FORMERLY NOVEXA</small>
            </span>
          </div>
          <nav className="dive__nav" aria-label="Dive sections">
            {NAV.map(([label, id], i) => (
              <button key={id} onClick={() => go(id)}>
                <span className="dive__nav-no">0{i + 1}</span> {label}
              </button>
            ))}
          </nav>
          <div className="dive__head-actions">
            <button className="dive__back" onClick={backToFilm}>
              ← BACK TO FILM
            </button>
            <a className="dive__cta" href={CONTACT_MAILTO}>
              START A CONVERSATION ↗
            </a>
          </div>
        </header>

        <main className="dive__main">
          <section className="dive__hero" id="dive-hero">
            <p className="dive__eyebrow">PRODUCTS &amp; SAMPLES / 012</p>
            <h1>
              Twelve ways to <em>move forward.</em>
            </h1>
            <p className="dive__lede">
              One studio. An expanding constellation of products designed to make difficult things feel
              possible.
            </p>
          </section>

          {GROUPS.map((group) => (
            <section className="dive__section" id={group.id} key={group.id}>
              <div className="dive__section-head">
                <h2>{group.title}</h2>
                <span>{group.sub}</span>
              </div>
              {group.note ? (
                <aside className="dive__note">
                  <b>DISCLAIMER / NOTE</b>
                  <p>{group.note}</p>
                </aside>
              ) : null}
              <div className="dive__grid">
                {group.names.map((name) => {
                  const item = byName(name)!;
                  return (
                    <article key={item.name} className="dive__sample">
                      <span className="dive__sample-shot">
                        <img src={item.shot[0]} alt={`${item.name} product screenshot`} loading="lazy" />
                      </span>
                      <span className="dive__sample-meta">
                        <b>
                          {item.no} {item.name}
                        </b>
                        <i>{item.category}</i>
                      </span>
                      <p className="dive__sample-desc">{pitchOf(item.name)}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          <section className="dive__section" id="dive-templates">
            <div className="dive__section-head">
              <h2>
                The Proof <em>Reel</em>
              </h2>
              <span>TEMPLATES / 01–08</span>
            </div>
            <p className="dive__lede dive__lede--wrap">
              Eight builds, filmed end to end. Pick one, hit reference, and it opens your enquiry
              email with the clip already attached.
            </p>
            <div className="dive__reels">
              {TEMPLATES.map((item) => (
                <article className="dive__reel" key={item.no}>
                  <div className="dive__reel-video">
                    <video
                      src={item.video}
                      poster={item.poster}
                      controls
                      playsInline
                      preload="metadata"
                      aria-label={`${item.name} template walkthrough`}
                    />
                    <span className="dive__reel-no" aria-hidden="true">
                      {item.no}
                    </span>
                  </div>
                  <div className="dive__reel-body">
                    <div className="dive__sample-meta">
                      <b>{item.name}</b>
                      <i>{item.category}</i>
                    </div>
                    <p className="dive__sample-desc">{item.pitch}</p>
                    <a
                      className="dive__ref"
                      href={referenceMail(item.name, item.video)}
                      aria-label={`Reference ${item.name} in an enquiry email`}
                    >
                      <span aria-hidden="true">“</span> Reference this <i>↗</i>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <SolveGraph />

          <CompareStudy />

          <footer className="dive__foot" id="dive-contact">
            <div className="dive__brand">
              <img className="dive__logo" src="/images/noirdemons.webp" alt="NDE: NoirDemons" />
              <span className="dive__word">
                NDE: NoirDemons <small>FORMERLY NOVEXA</small>
              </span>
            </div>
            <a href={MAILTO}>{EMAIL}</a>
            <nav className="dive__policies" aria-label="Policy pages">
              {POLICIES.map((p) => (
                <a key={p.slug} href={p.slug}>
                  {p.title}
                </a>
              ))}
            </nav>
            <button className="dive__text-cta" onClick={backToFilm}>
              ← BACK TO FILM
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
