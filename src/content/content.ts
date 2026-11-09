export const EMAIL = "nde.noirdemons@atomicmail.io";
export const MAILTO = `mailto:${EMAIL}`;
export const CONTACT_MAILTO =
  "mailto:nde.noirdemons@atomicmail.io?subject=Project%20enquiry%20%E2%80%94%20NDE%20NoirDemons";

export type PlanMode = "managed" | "source";

export type Plan = {
  no: string;
  kicker: string;
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  recommended?: boolean;
};

const mail = (mode: PlanMode, plan: string) => {
  const managed = mode === "managed";
  const subject = managed
    ? `NDE NoirDemons SaaS ${plan} plan enquiry`
    : `NDE NoirDemons Source-code ${plan} plan enquiry`;
  const service = managed ? "managed service / SaaS" : "one-time source code purchase";
  const body = `Hello NDE (NoirDemons) team,\n\nI am interested in the ${plan} plan (${service}).\n\nKindly mention your Custom Features:\n\n`;
  return `${MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const managed = (
  no: string,
  name: string,
  price: string,
  desc: string,
  features: string[],
  cta: string,
  recommended = false,
): Plan => ({
  no,
  kicker: "NEGOTIABLE BY SCOPE",
  name,
  price,
  unit: "negotiable",
  desc,
  features,
  cta,
  href: mail("managed", name),
  recommended,
});

const source = (
  no: string,
  name: string,
  price: string,
  desc: string,
  features: string[],
  cta: string,
): Plan => ({
  no,
  kicker: "ONE-TIME · YOU OWN IT",
  name,
  price,
  unit: name === "Custom" ? "" : "one-time",
  desc,
  features,
  cta,
  href: mail("source", name),
});

export const PLAN_GROUPS: Record<
  PlanMode,
  { label: string; short: string; badge: string; blurb: string; plans: Plan[] }
> = {
  managed: {
    label: "Run it as a service (Popular)",
    short: "RUN IT AS A SERVICE",
    badge: "POPULAR",
    blurb:
      "Hosted, patched and updated by us — you focus on customers, we handle the machinery. What most teams choose.",
    plans: [
      managed(
        "01",
        "Starter",
        "±₹2,000",
        "For institutions and small businesses ready to launch.",
        [
          "Basic website or web app",
          "Forms, dashboards, and CRUD flows",
          "Basic database integration",
          "Responsive custom UI/UX",
          "Deployment and setup",
        ],
        "Start your build",
      ),
      managed(
        "02",
        "Business",
        "±₹6,000",
        "For teams that need a dependable digital operation.",
        [
          "Advanced business applications",
          "Authentication and user roles",
          "Admin dashboards",
          "Database and API integrations",
          "Automated workflows",
          "Deployment and configuration",
        ],
        "Plan my application",
        true,
      ),
      managed(
        "03",
        "Pro",
        "±₹10,000",
        "For ambitious products with real operational complexity.",
        [
          "Full-featured custom applications",
          "Complex dashboards and management systems",
          "Advanced integrations and automation",
          "Multiple user roles",
          "Payments, notifications, and third-party services",
          "Production deployment",
        ],
        "Build something serious",
      ),
      managed(
        "04",
        "Custom",
        "Let's discuss",
        "For large systems, SaaS products, and specialized software.",
        [
          "Institutional systems",
          "Startup MVPs",
          "Custom SaaS products",
          "Highly specialized software",
          "Complex requirements",
          "Long-term development partnership",
        ],
        "Discuss your vision",
      ),
    ],
  },
  source: {
    label: "Own the source code",
    short: "BUY THE BUILD",
    badge: "ONE-TIME",
    blurb:
      "Built, delivered and handed over to you — one payment, total ownership, hosting on your terms.",
    plans: [
      source(
        "01",
        "Starter",
        "₹10,000",
        "A polished presence you own outright — code included.",
        [
          "Full source code handover",
          "Business website or landing system",
          "Forms, dashboards, and CRUD flows",
          "Database integration",
          "Deployed to your hosting",
          "Handover session & documentation",
        ],
        "Own your starter",
      ),
      source(
        "02",
        "Business",
        "₹20,000",
        "A working operation that runs on your servers, not ours.",
        [
          "Advanced business applications",
          "Authentication and user roles",
          "Admin dashboards",
          "Database and API integrations",
          "Deployed to your infrastructure",
          "30 days of post-launch support",
        ],
        "Claim the build",
      ),
      source(
        "03",
        "Pro",
        "₹30,000",
        "Serious software, delivered with the keys in your hand.",
        [
          "Full-featured custom applications",
          "Complex dashboards and management systems",
          "Advanced integrations and automation",
          "Payments, notifications, and third-party services",
          "Complete source & build pipeline",
          "60 days of post-launch support",
        ],
        "Take it all",
      ),
      source(
        "04",
        "Custom",
        "Let's discuss",
        "For large systems and products with specialised ownership terms.",
        [
          "Institutional systems",
          "Startup MVPs",
          "Custom SaaS products",
          "Source & IP terms agreed up front",
          "Long-term development partnership",
          "Optional managed handover",
        ],
        "Discuss your vision",
      ),
    ],
  },
};

export const DECISION_HEAD = [
  "What changes",
  "Buy the software & source code",
  "Run it as our service (Recommended)",
];

export const DECISION_ROWS: [string, string, string][] = [
  ["Source code", "Yours — full handover", "Maintained by our team"],
  ["Hosting", "Your servers", "Our team"],
  ["Database infrastructure", "You run it", "We run it"],
  ["Customer data", "Yours, always", "Yours, always"],
  ["Updates", "Quoted per change", "Continuous and included"],
  ["Bug fixes", "Separate contract", "Handled by our team"],
  ["New features", "Scoped separately", "Roll into your plan"],
  ["Recurring payments", "None", "Yes — one simple plan"],
  ["Client independence", "High — you operate it yourself", "Lower — we operate it for you"],
  ["Your control", "Higher", "Lower"],
  ["Your responsibility", "Higher", "Lower"],
  ["Scalability", "Harder", "Much easier"],
  ["Backend", "You own and control it", "We run it — you steer it"],
];

/*
 * Numbering restarts inside every group, site-wide:
 *   Top public products 01–04 · 3D service samples 01–07 · 2D site services 01.
 * The array order is the arrangement order (it drives the film orbit, the dive
 * grids and the agent list), so pitches below stay index-aligned.
 */
export const PRODUCTS: Array<{
  no: string;
  name: string;
  category: string;
  color: string;
  url: string;
  shot: string[];
}> = [
  { no: "01", name: "Solve NCERT", category: "Learning Systems", color: "#8FE7A5", url: "#", shot: ["/shots/product-04-solvencert.jpg"] },
  { no: "02", name: "Novexa", category: "Idea Platforms", color: "#B7A6FF", url: "#", shot: ["/shots/product-01-novexa-1.jpg", "/shots/product-01-novexa-2.jpg"] },
  { no: "03", name: "BlitzData", category: "Data & Analytics", color: "#6EF2FF", url: "#", shot: ["/shots/product-03-blitzdata.jpg"] },
  { no: "04", name: "EconoMind AI", category: "Economic Intelligence", color: "#74C7FF", url: "#", shot: ["/shots/product-02-economind.jpg"] },
  { no: "01", name: "The Legendary Arc Reactor", category: "Interactive 3D Experiences", color: "#4DD8FF", url: "https://the-lgenedary-arc-reactor-nde.vercel.app/", shot: ["/shots/product-12-arc-reactor.jpg"] },
  { no: "02", name: "Woodcrest Co.", category: "Commerce & Craft", color: "#D7A55A", url: "#", shot: ["/shots/product-05-woodcrest.jpg"] },
  { no: "03", name: "Oakhaven Home", category: "Interiors & Living", color: "#F1E3CB", url: "#", shot: ["/shots/product-07-oakhaven.jpg"] },
  { no: "04", name: "Aether Studio", category: "Web Experiences", color: "#9FD8FF", url: "https://aether-studio-nde.vercel.app/", shot: ["/shots/product-08-aether.jpg"] },
  { no: "05", name: "KOKO Coconut Co.", category: "Food & Beverage", color: "#DDF6C8", url: "https://koko-coconut-co-nde.vercel.app/", shot: ["/shots/product-09-koko.jpg"] },
  { no: "06", name: "Aven Serum", category: "Beauty & Skin", color: "#FFB1C4", url: "https://aven-serum-nde.vercel.app/", shot: ["/shots/product-10-aven.jpg"] },
  { no: "07", name: "Asterion Builders", category: "Real Estate & Construction", color: "#A3B87C", url: "https://asterion-builders-nde.vercel.app/", shot: ["/shots/product-11-asterion.jpg"] },
  { no: "01", name: "GlossDrive Co.", category: "Automotive Care", color: "#D8DEE8", url: "#", shot: ["/shots/product-06-glossdrive.jpg"] },
];

export const PRODUCT_PITCH = [
  "Answers that teach the next question instead of ending the conversation.",
  "Where raw ideas become testable — before the world gets a vote.",
  "Raw data, turned into a clear and defensible line of sight.",
  "Macro signals, decoded into decisions a human can actually make.",
  "A miniature fusion reactor, taken apart and rebuilt for the scroll.",
  "Considered goods, quietly sold. Commerce with its voice down.",
  "Spaces that feel inevitable — and the systems that keep them that way.",
  "Websites that behave like worlds, not brochures.",
  "Hydration the way the tree intended. Brand, commerce and sunshine.",
  "A formula you can feel working, presented with the drama it deserves.",
  "A skyline in the making — construction rendered as a world you can walk through.",
  "A showroom shine, engineered as a repeatable digital service.",
];

export const NAV = [
  { label: "Ecosystem", p: 0.32, no: "01" },
  { label: "Services", p: 0.50, no: "02" },
  { label: "Plans", p: 0.81, no: "03" },
  { label: "Our vision", p: 0.925, no: "04" },
  { label: "Contact", p: 0.985, no: "05" },
];

export const FOOTER_LINKS = ["Ecosystem", "Services", "Plans", "Our vision", "Contact"];
