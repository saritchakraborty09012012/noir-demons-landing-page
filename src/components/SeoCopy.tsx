import {
  DECISION_HEAD,
  DECISION_ROWS,
  EMAIL,
  MAILTO,
  PLAN_GROUPS,
  PRODUCTS,
  PRODUCT_PITCH,
} from "../content/content";

export default function SeoCopy() {
  return (
    <div className="sr-only">
      <h1>Make the impossible useful.</h1>
      <p>
        NDE (NoirDemons) builds intelligent systems for the moments that matter — when an idea needs
        direction, data needs meaning, and ambition needs a way forward.
      </p>

      <h2>A door, not a wall.</h2>
      <p>
        Constraints aren&apos;t stops — they&apos;re frames for sharper design, smarter systems and
        more meaningful outcomes.
      </p>

      <h2>Twelve ways to move forward.</h2>
      <p>
        One studio. An expanding constellation of products designed to make difficult things feel
        possible.
      </p>
      <ul>
        {PRODUCTS.map((product, i) => (
          <li key={product.name}>
            {product.no} {product.name} — {product.category}. {PRODUCT_PITCH[i]}.
            {product.url !== "#" ? (
              <>
                {" "}
                <a href={product.url}>Visit {product.name}.</a>
              </>
            ) : null}
          </li>
        ))}
      </ul>

      <h2>The Engine.</h2>
      <p>
        From a raw idea to a living, scalable digital reality — our engine turns intent into impact.
      </p>
      <ol>
        <li>Idea core — Vision, Problem, Design.</li>
        <li>Data — Ingest, Structure, Learn.</li>
        <li>Model — Reason, Generate, Decide.</li>
        <li>Interface — UX, Product, Experience.</li>
        <li>Deploy — Launch, Scale, Maintain.</li>
      </ol>

      <h2>Take the keys, or let us drive.</h2>
      <p>
        Buy the build, one-time: own the source code outright, one-time payment, host it on any
        server you choose, full control and full responsibility. Starts at ₹10,000.
      </p>
      <p>
        Managed service, recurring: we run the infrastructure, updates and bug fixes included, new
        features roll into your plan, predictable recurring plan. Starts at ₹2,000.
      </p>

      <h2>Side by side — no fine print.</h2>
      <p>13 decision points.</p>
      <ul>
        {DECISION_ROWS.map((row) => (
          <li key={row[0]}>
            {row[0]}: {DECISION_HEAD[1]} — {row[1]}; {DECISION_HEAD[2]} — {row[2]}.
          </li>
        ))}
      </ul>

      <h2>Plans</h2>
      {(["managed", "source"] as const).map((mode) => (
        <section key={mode}>
          <h3>{PLAN_GROUPS[mode].label}</h3>
          <p>{PLAN_GROUPS[mode].blurb}</p>
          {PLAN_GROUPS[mode].plans.map((plan) => (
            <article key={plan.no}>
              <h4>
                {plan.no} {plan.name} — {plan.price} {plan.unit}
              </h4>
              <p>{plan.desc}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p>{plan.kicker}</p>
              <p>{plan.cta}</p>
            </article>
          ))}
        </section>
      ))}

      <h2>A more useful digital world.</h2>
      <p>
        Products that work. Systems that think. Experiences that feel. A creative-technical studio
        for what&apos;s next.
      </p>

      <section id="contact-access">
        <h2>Project inquiries &amp; collaborations</h2>
        <p>Products / Systems / Experiences / Collaborations</p>
        <a href={MAILTO}>{EMAIL}</a>
        <p>NDE — NoirDemons, formerly Novexa</p>
      </section>
    </div>
  );
}
