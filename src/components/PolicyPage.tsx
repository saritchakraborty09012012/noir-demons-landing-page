import { useEffect } from "react";
import { EMAIL, MAILTO } from "../content/content";
import { POLICIES, type PolicyBlock } from "../lib/policies";

const Block = ({ block }: { block: PolicyBlock }) => (
  <>
    {block.h ? <h3>{block.h}</h3> : null}
    {block.p ? <p>{block.p}</p> : null}
    {block.ul ? (
      <ul>
        {block.ul.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : null}
  </>
);

export default function PolicyPage() {
  const policy = POLICIES.find((p) => p.slug === location.pathname) ?? POLICIES[0];

  useEffect(() => {
    document.title = `${policy.title} — NDE: NoirDemons`;
  }, [policy.title]);

  return (
    <div className="dive policy">
      <div className="dive__scroll" data-lenis-prevent>
        <header className="dive__header">
          <div className="dive__brand">
            <img className="dive__logo" src="/images/noirdemons.webp" alt="NDE: NoirDemons" />
            <span className="dive__word">
              NDE: NoirDemons <small>FORMERLY NOVEXA</small>
            </span>
          </div>
          <div className="dive__head-actions">
            <a className="dive__back" href="/">
              ← BACK TO SITE
            </a>
          </div>
        </header>

        <main className="dive__main">
          <section className="dive__hero">
            <p className="dive__eyebrow">NDE: NOIRDEMONS / POLICY</p>
            <h1>{policy.title}</h1>
            <p className="policy__dates">
              <b>Effective Date:</b> {policy.effective}
              <br />
              <b>Last Updated:</b> {policy.effective}
            </p>
          </section>

          <article className="policy__body">
            {policy.meta.map((block, i) => (
              <Block key={`m${i}`} block={block} />
            ))}
            {policy.sections.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </article>

          <nav className="policy__index" aria-label="All policies">
            {POLICIES.map((p) => (
              <a key={p.slug} href={p.slug} className={p.slug === policy.slug ? "is-on" : ""}>
                {p.title} ↗
              </a>
            ))}
          </nav>

          <footer className="dive__foot">
            <div className="dive__brand">
              <img className="dive__logo" src="/images/noirdemons.webp" alt="NDE: NoirDemons" />
              <span className="dive__word">
                NDE: NoirDemons <small>FORMERLY NOVEXA</small>
              </span>
            </div>
            <a href={MAILTO}>{EMAIL}</a>
            <a className="dive__text-cta" href="/">
              ← BACK TO SITE
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
