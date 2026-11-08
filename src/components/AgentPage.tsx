import { EMAIL, MAILTO, PRODUCTS, PRODUCT_PITCH, PLAN_GROUPS, DECISION_HEAD, DECISION_ROWS } from "../content/content";
import { POLICIES } from "../lib/policies";

/**
 * Agent surface: a plain, semantic, dependency-free rendering of the whole
 * site for crawlers and AI agents. Same facts as the human film, structured
 * for machines (headings, tables, lists) instead of WebGL.
 */
export default function AgentPage() {
  const source = PLAN_GROUPS.source.plans;
  const managed = PLAN_GROUPS.managed.plans;

  return (
    <main className="agent">
      <header>
        <h1>NDE: NoirDemons</h1>
        <p>
          Formerly Novexa. An independent intelligence studio building intelligent systems for ideas,
          finance, analytics, education and the future of development. Tagline: Make the impossible
          useful. Email: <a href={MAILTO}>{EMAIL}</a>
        </p>
      </header>

      <section aria-label="Top public products">
        <h2>Top public products</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>What it is for</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.slice(0, 4).map((p, i) => (
              <tr key={p.no}>
                <td>
                  {p.no} {p.name}
                </td>
                <td>{p.category}</td>
                <td>{PRODUCT_PITCH[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-label="All products and samples">
        <h2>All products and samples</h2>
        <ul>
          {PRODUCTS.map((p, i) => (
            <li key={p.no}>
              <strong>
                {p.no} {p.name}
              </strong>{" "}
              ({p.category}) — {PRODUCT_PITCH[i]}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Growth proof">
        <h2>Growth proof — Solve NCERT</h2>
        <p>
          Grown with zero promotion in 3 months: no advertisements, no social media, no promotion.
          Search Console (27 Aug – 3 Nov): 478 total clicks, 5.06K total impressions, 9.4% average
          CTR, average position 8.4. It spread by sharing with one struggling student; soon every
          Class 9 student in his school was using it.
        </p>
      </section>

      <section aria-label="Comparative study">
        <h2>Comparative study: own the source code vs SaaS</h2>
        <table>
          <thead>
            <tr>
              {DECISION_HEAD.map((cell) => (
                <th key={cell}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DECISION_ROWS.map(([what, buy, saas]) => (
              <tr key={what}>
                <td>{what}</td>
                <td>{buy}</td>
                <td>{saas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-label="Plans and pricing">
        <h2>Plans and pricing</h2>
        <table>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Own the source code (one-time)</th>
              <th>SaaS — run it as a service (monthly)</th>
            </tr>
          </thead>
          <tbody>
            {source.map((plan, i) => (
              <tr key={plan.no}>
                <td>
                  {plan.no} {plan.name}
                </td>
                <td>
                  {plan.price}/- — {plan.features.join("; ")}
                </td>
                <td>
                  {managed[i].price}/mo — {managed[i].features.join("; ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>No watermark in any plan, on either model.</p>
      </section>

      <section aria-label="Policies">
        <h2>Policies</h2>
        <ul>
          {POLICIES.map((p) => (
            <li key={p.slug}>
              <a href={p.slug}>{p.title}</a>
            </li>
          ))}
        </ul>
      </section>

      <footer>
        <p>
          NDE: NoirDemons, formerly Novexa. Contact: <a href={MAILTO}>{EMAIL}</a>. All product
          screenshots in the human version are samples; NDE owns the copyright of its samples. Every
          deliverable is watermark-free.
        </p>
      </footer>
    </main>
  );
}
