import { useEffect, useRef, useState } from "react";
import { PLAN_GROUPS } from "../content/content";

type Row = { label: string; buy: string[]; saas: string[] };

const ROWS: Row[] = [
  {
    label: "Source code",
    buy: ["You manage", "You debug", "You fix the breakdown", "You change", "You upgrade", "You hire"],
    saas: ["Just tell us and we do it without any extra costs", "All included in the plan"],
  },
  {
    label: "Hosting",
    buy: ["You pay separately", "Telling us in this plan will again cost"],
    saas: ["Our service"],
  },
  {
    label: "Database infrastructure",
    buy: [
      "You run the infrastructure",
      "You pay",
      "Your security",
      "Your encryption",
      "We do not take the responsibility of any breaches",
    ],
    saas: [
      "Our renowned partners and services",
      "Their security",
      "Negligible chance of breaches",
      "We pay",
      "No extra costs, all included",
    ],
  },
  {
    label: "Customer data",
    buy: ["Always fully controlled by you"],
    saas: ["Always fully controlled by you"],
  },
  {
    label: "Updates",
    buy: ["Done by you or never actually done", "Codebase changes made by you", "Charged updates after handover"],
    saas: ["Continuous updates as per demand", "Regular security updates", "No extra costs"],
  },
  {
    label: "Bug fixes",
    buy: ["Separate contract"],
    saas: ["No extra costs", "All included", "Just tell us"],
  },
  {
    label: "New features",
    buy: ["Scoped separately", "Charged separately"],
    saas: ["All included", "Just drop the email or DM"],
  },
  {
    label: "Recurring payments",
    buy: ["None to us", "But yes to:", "Database", "Hosting infrastructure and domain"],
    saas: ["Only to us", "And the domain"],
  },
  {
    label: "Client independence",
    buy: ["High — you operate it yourself"],
    saas: ["Lower — just tell us, we do it for you"],
  },
  {
    label: "Watermark",
    buy: ["None — no watermark"],
    saas: ["None — no watermark"],
  },
  {
    label: "Your control",
    buy: ["Higher and stressful"],
    saas: ["Lower and peaceful"],
  },
  {
    label: "Your responsibility",
    buy: ["Higher and stressful"],
    saas: ["Lower and peaceful"],
  },
  {
    label: "Scalability",
    buy: ["Quite harder and unpractical"],
    saas: ["Seamless, hasslefree, quick and practical"],
  },
  {
    label: "Backend",
    buy: ["You own", "Your control", "Your responsibility", "Your costs"],
    saas: ["You steer, we run", "Just ask", "No extra costs", "All included"],
  },
];

const DOMAIN_POP =
  "Since the company is yours and the domain is always owned by the company, we can't buy the domain for you. However, on your request, we can help you buy the domain on your computer, or buy the domain for you on your computer — WITHOUT ANY EXTRA CHARGES.";

const priceBuy = (plan: { price: string }) =>
  plan.price.startsWith("Let's") ? plan.price : `${plan.price}/-`;
const priceSaas = (plan: { price: string }) =>
  plan.price.startsWith("Let's") ? plan.price : `${plan.price}/mo`;

/* Dive-page feature tweaks (the reel's plan copy stays verbatim). */
const DIVE_FEATURES: Record<string, string[]> = {
  "managed-01": ["Fully interactive and attractive landing page to attract users", "Forms, dashboards, and CRUD flows", "Database integration", "Responsive custom UI/UX", "Deployment, setup and documentation"],
  "source-01": ["Business website or landing system", "Forms, dashboards, and CRUD flows", "Database integration", "Deployed to your hosting", "Handover session & documentation"],
  "source-03": ["Full-featured custom applications", "Complex dashboards and management systems", "Advanced integrations and automation", "Multiple user roles", "Payments, notifications, and third-party services", "60 days of post-launch support"],
  "managed-03": ["Full-featured custom applications", "Complex dashboards and management systems", "Advanced integrations and automation", "Multiple user roles", "Payments, notifications, and third-party services", "Production deployment and full support"],
  "source-04": ["Institutional systems", "Startup MVPs", "Custom SaaS products", "Source & IP terms agreed up front", "Highly specialized software", "Complex requirements", "Long-term development partnership", "Optional managed handover"],
};

const featuresOf = (mode: "managed" | "source", plan: { no: string; features: string[] }) =>
  DIVE_FEATURES[`${mode}-${plan.no}`] ?? plan.features;

const Lines = ({ items }: { items: string[] }) => (
  <ul className="cmp__lines">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

export default function CompareStudy() {
  const [domainOpen, setDomainOpen] = useState(false);
  const source = PLAN_GROUPS.source.plans;
  const managed = PLAN_GROUPS.managed.plans;

  // Keep every plan at the same vertical level on both sides: feature counts
  // differ per mode, so equalise each Starter/Business/Pro/Custom pair's height.
  const pairRefs = useRef<Array<[HTMLDivElement | null, HTMLDivElement | null]>>([]);
  useEffect(() => {
    const equalise = () => {
      pairRefs.current.forEach(([a, b]) => {
        if (!a || !b) return;
        const h = Math.max(a.offsetHeight, b.offsetHeight);
        a.style.minHeight = `${h}px`;
        b.style.minHeight = `${h}px`;
      });
    };
    equalise();
    const t = window.setTimeout(equalise, 300);
    window.addEventListener("resize", equalise);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", equalise);
    };
  }, [source, managed]);

  return (
    <>
      <section className="cmp" id="dive-compare" aria-label="Comparative study">
        <div className="cmp__head">
          <h3>
            Own the source code <em>vs</em> SaaS
          </h3>
          <span>COMPARATIVE STUDY / 13 POINTS + PLANS</span>
        </div>

        <div className="cmp__wrap">
        <table className="cmp__table">
          <thead>
            <tr>
              <th scope="col">What changes</th>
              <th scope="col">Own the source code</th>
              <th scope="col" className="cmp__saas">
                SaaS — Run it as our service (Recommended)
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>
                  <Lines items={row.buy} />
                </td>
                <td className="cmp__saas">
                  {row.label === "Recurring payments" ? (
                    <>
                      <Lines items={row.saas.slice(0, -1)} />
                      <button className="cmp__domain" onClick={() => setDomainOpen(true)}>
                        And the domain
                      </button>
                    </>
                  ) : (
                    <Lines items={row.saas} />
                  )}
                </td>
              </tr>
            ))}
            {source.map((plan, i) => (
              <tr key={plan.no} className="cmp__planrow">
                <th scope="row">
                  {plan.no} {plan.name} — price
                </th>
                <td>{priceBuy(plan)}</td>
                <td className="cmp__saas">{priceSaas(managed[i])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {domainOpen && (
        <div className="cmp__pop-backdrop" role="dialog" aria-modal="true" aria-label="Domain ownership note">
          <div className="cmp__pop">
            <b>ABOUT THE DOMAIN</b>
            <p>{DOMAIN_POP}</p>
            <button className="cmp__domain" onClick={() => setDomainOpen(false)}>
              GOT IT
            </button>
          </div>
        </div>
      )}
      </section>

      <section className="cmp cmp--plans" id="dive-plans" aria-label="Plans and pricing">
        <div className="cmp__head">
          <h3>
            Plans <em>and pricing</em>
          </h3>
          <span>FOUR PLANS / BOTH MODES</span>
        </div>
        <div className="cmp__plans-cols">
          <article className="cmp__plan-card">
            <h4>Own the source code</h4>
            {source.map((plan, i) => (
              <div
                className="cmp__plan"
                key={plan.no}
                ref={(el) => {
                  pairRefs.current[i] = [el, pairRefs.current[i]?.[1] ?? null];
                }}
              >
                <div className="cmp__plan-top">
                  <b>
                    {plan.no} {plan.name}
                  </b>
                  <span>{priceBuy(plan)}</span>
                </div>
                <ul>
                  {featuresOf("source", plan).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a className="cmp__plan-cta" href={plan.href}>
                  {plan.cta} ↗
                </a>
              </div>
            ))}
          </article>
          <article className="cmp__plan-card cmp__plan-card--saas">
            <h4>SaaS — Run it as our service</h4>
            {managed.map((plan, i) => (
              <div
                className="cmp__plan"
                key={plan.no}
                ref={(el) => {
                  pairRefs.current[i] = [pairRefs.current[i]?.[0] ?? null, el];
                }}
              >
                <div className="cmp__plan-top">
                  <b>
                    {plan.no} {plan.name}
                  </b>
                  <span>{priceSaas(plan)}</span>
                </div>
                <ul>
                  {featuresOf("managed", plan).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a className="cmp__plan-cta" href={plan.href}>
                  {plan.cta} ↗
                </a>
              </div>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
