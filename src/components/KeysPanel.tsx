import { CONTACT_MAILTO } from "../content/content";

export default function KeysPanel() {
  return (
    <section className="panel keys-panel" aria-label="Keys or drive">
      <article className="choice-card is-build" data-live="build">
        <div className="choice-card__kicker">
          <span>01 · BUY THE BUILD</span>
          <em>ONE-TIME</em>
        </div>
        <h3>Own the source.</h3>
        <div className="choice-card__price">Starts at ₹10,000 · one-time</div>
        <ul>
          <li>You own the source code outright</li>
          <li>One-time payment, nothing recurring</li>
          <li>Host it on any server you choose</li>
          <li>Full control · full responsibility</li>
        </ul>
        <p>
          You purchase the software and every line behind it. We design it, build it, ship it, then
          hand over the keys — it is yours to host, edit, scale and resell, with no one holding the
          licence.
        </p>
        <a className="btn" href={CONTACT_MAILTO}>
          Enquire about the build <i>↗</i>
        </a>
      </article>

      <article className="choice-card is-managed" data-live="managed">
        <div className="choice-card__kicker">
          <span>02 · MANAGED SERVICE</span>
          <em>RECOMMENDED</em>
        </div>
        <h3>Run it with us.</h3>
        <div className="choice-card__price">Starts at ₹2,000 · recurring</div>
        <ul>
          <li>We run the infrastructure for you</li>
          <li>Updates and bug fixes included</li>
          <li>New features roll straight into your plan</li>
          <li>Predictable recurring plan · easy to scale</li>
        </ul>
        <p>
          We keep the infrastructure, databases, updates and fixes on our plate while you keep
          serving customers. The product quietly gets better every month — without a single ticket
          landing on your desk.
        </p>
        <a className="btn btn--gold" href={CONTACT_MAILTO}>
          Start a managed service <i>↗</i>
        </a>
      </article>
    </section>
  );
}
