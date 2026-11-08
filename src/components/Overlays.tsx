import { useEffect, useState, type CSSProperties } from "react";
import { useReel } from "../store/useReel";
import { jumpTo } from "../lib/scroll";
import { PRODUCTS, PRODUCT_PITCH } from "../content/content";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

function useStep(start: number, end: number, count: number) {
  const [step, setStep] = useState(0);
  useEffect(
    () =>
      useReel.subscribe((s) => {
        const t = clamp((s.p - start) / (end - start));
        const next = Math.min(count - 1, Math.floor(t * count));
        setStep((prev) => (prev === next ? prev : next));
      }),
    [start, end, count],
  );
  return step;
}

export function HeroPanel() {
  return (
    <section className="panel hero-panel" aria-label="Introduction">
      <p className="eyebrow">Independent intelligence studio / 001</p>
      <p className="lede">
        NDE (NoirDemons) builds intelligent systems for the moments that matter — when an idea needs
        direction, data needs meaning, and ambition needs a way forward.
      </p>
      <div className="hero-actions interactive" data-live="hero">
        <button className="btn btn--gold" onClick={() => jumpTo(0.32, 1.7)}>
          Explore the ecosystem <i>↘</i>
        </button>
        <button className="btn" onClick={() => jumpTo(0.8, 1.7)}>
          View custom plans <i>↘</i>
        </button>
      </div>
      <p className="micro">One continuous camera / ten chapters / 1900vh</p>
    </section>
  );
}

export function PremisePanel() {
  return (
    <section className="panel premise-panel" aria-label="Premise">
      <p className="eyebrow">Premise / 002</p>
      <p className="lede">
        Constraints aren&apos;t stops — they&apos;re frames for sharper design, smarter systems and
        more meaningful outcomes.
      </p>
    </section>
  );
}

const TRACK = ["BREAK", "LEARN", "REBUILD", "RISE"];

export function ImpactPanel() {
  const active = useStep(0.2, 0.283, TRACK.length);
  return (
    <section className="panel impact-panel" aria-label="Impact to rise">
      <p className="eyebrow">Interlude / 003</p>
      <div className="impact-track">
        {TRACK.map((word, i) => (
          <span key={word} className={i <= active ? "is-on" : ""}>
            {word}
            {i < TRACK.length - 1 ? " /" : ""}
          </span>
        ))}
      </div>
    </section>
  );
}

export function ConstellationPanel() {
  const focus = useReel((s) => s.focusProduct);
  const product = PRODUCTS[focus] ?? PRODUCTS[0];
  const pitch = PRODUCT_PITCH[focus] ?? PRODUCT_PITCH[0];
  return (
    <section className="panel constellation-panel" aria-label="Ecosystem">
      <div className="constellation-intro">
        <p className="eyebrow">Ecosystem / 004</p>
        <p className="lede">
          One studio. An expanding constellation of products designed to make difficult things feel
          possible.
        </p>
      </div>
      <article
        className="product-card"
        data-live="constellation"
        style={{ "--accent": product.color } as CSSProperties}
      >
        <header className="product-card__head">
          <span className="product-card__no">{product.no}</span>
          <span className="product-card__cat">{product.category}</span>
        </header>
        <figure className={product.shot.length > 1 ? "product-shot is-duo" : "product-shot"} aria-hidden="true">
          {product.shot.map((src) => (
            <img key={src} src={src} alt="" loading="eager" />
          ))}
        </figure>
        <h3>{product.name}</h3>
        <p>{pitch}</p>
        <footer className="product-card__foot">
          <a
            href={product.url}
            target={product.url === "#" ? undefined : "_blank"}
            rel={product.url === "#" ? undefined : "noreferrer"}
            onClick={(e) => {
              if (product.url === "#") e.preventDefault();
            }}
            aria-label={`Visit ${product.name}`}
          >
            VISIT ↗
          </a>
          <div className="product-strip" aria-label="Select a product">
            {PRODUCTS.map((item, i) => (
              <button
                key={item.name}
                className={i === focus ? "is-on" : ""}
                onClick={() => jumpTo(0.318 + i * (0.09 / PRODUCTS.length), 1.1)}
                aria-label={`Focus ${item.name}`}
              />
            ))}
          </div>
        </footer>
      </article>
    </section>
  );
}

const ENGINE_STAGES = [
  { no: "01", title: "IDEA CORE", sub: "Vision · Problem · Design" },
  { no: "02", title: "DATA", sub: "Ingest · Structure · Learn" },
  { no: "03", title: "MODEL", sub: "Reason · Generate · Decide" },
  { no: "04", title: "INTERFACE", sub: "UX · Product · Experience" },
  { no: "05", title: "DEPLOY", sub: "Launch · Scale · Maintain" },
];

export function EnginePanel() {
  const active = useStep(0.452, 0.6, ENGINE_STAGES.length);
  return (
    <section className="panel engine-panel" aria-label="The engine">
      <div className="engine-copy">
        <p className="eyebrow">Services / 005</p>
        <p className="lede">
          From a raw idea to a living, scalable digital reality — our engine turns intent into
          impact.
        </p>
      </div>
      <div className="engine-stages" aria-label="Engine stages">
        {ENGINE_STAGES.map((stage, i) => (
          <div key={stage.title} className={`engine-stage ${i === active ? "is-on" : ""}`}>
            <b>{stage.no}</b>
            <span>{stage.title}</span>
            <small>{stage.sub}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
