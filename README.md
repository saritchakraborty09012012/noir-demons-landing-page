# NDE — NoirDemons

> **NDE** (short for *NoirDemons*) is the public-facing brand of **NoirDemons**, formerly known as **Novexa** — an independent intelligence studio that builds intelligent systems for ideas, finance, analytics, education, and the future of development.

**Make the impossible useful.**

[![Live site](https://img.shields.io/badge/live-noir--demons.vercel.app-000000?style=flat-square&logo=vercel)](https://noir-demons.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

---

## Table of Contents

- [About](#about)
- [The Brand](#the-brand)
- [Products](#products)
- [Build Studio Plans](#build-studio-plans)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [SEO & Discoverability](#seo--discoverability)
- [Customization](#customization)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [FAQ](#faq)
- [Contact](#contact)
- [License](#license)

---

## About

NDE is the marketing and brand surface of NoirDemons — a single-page marketing site that introduces the studio, showcases its product ecosystem, and routes interested visitors to a directly human sales channel (email) instead of a generic contact form.

The site is intentionally fast, dependency-light, and heavily optimized for search: static prerendering, semantic metadata, structured data, and a custom canvas starfield that renders the wordmark.

**What this repo is:**

- A production marketing site (deployed on Vercel)
- A single-page experience built with the Next.js App Router
- A fully hand-rolled SEO layer (metadata, Open Graph, Twitter cards, JSON-LD, robots, sitemap)

**What this repo is not:**

- A backend — there is no server, database, or auth. Every interactive element is client-side, and every conversion path is a `mailto:` link.
- A CMS — content is edited directly in `app/page.tsx`.

---

## The Brand

The brand exists in two layers, and both appear everywhere on the site:

| Layer | Name | Role |
| --- | --- | --- |
| **Short name** | **NDE** | Public-facing, easy to say, spell, remember, and type. Used in the logo lockup, titles, and copy. |
| **Full name** | **NoirDemons** | The formal company/entity name. Kept everywhere for clarity, trust, and search. |
| **Former name** | **Novexa** | The studio's previous name. Retained as a tagline ("formerly Novexa") and in metadata so legacy searches still land here. |

**Logo lockup** (used in the nav and the footer):

```text
[◎]  NDE
     NOIRDEMONS
     formerly Novexa
```

> **Note on search casing:** people type the short name in every imaginable casing — `NDE`, `NDe`, `nDE`, `NdE`, `nde`. All of these variants are intentionally registered in the site's `keywords` and JSON-LD `alternateName` so that any casing still resolves to this site.

---

## Products

NDE ships a growing constellation of products. Each is selectable on the Ecosystem section and links out to its live deployment.

| # | Product | Category | Description | Status |
| --- | --- | --- | --- | --- |
| 01 | **Novexa** | Idea validation | Turn raw ideas into structured, investable opportunities with AI-guided strategy. | Live |
| 02 | **EconoMind AI** | Finance intelligence | Understand money, markets, and business decisions through a calm, intelligent lens. | Live |
| 03 | **BlitzData** | Business analytics | Move from complex datasets to clear, actionable decisions in minutes. | Live |
| 04 | **Solve NCERT** | Learning systems | Build stronger understanding with verified explanations and adaptive study tools. | Live |
| 05 | **Novexis** | AI-native development | A new environment for thinking, building, and shipping with intelligent agents. | In the making |

Product data (name, category, description, URL, status) is defined once in `app/page.tsx` and drives both the product list and the product card.

---

## Build Studio Plans

NDE also operates a custom development studio. Four negotiable plans are presented, each routed to a pre-filled email so a lead never has to start from a blank message.

| # | Plan | Price | Best for |
| --- | --- | --- | --- |
| 01 | **Starter** | ±₹5,000 | Institutions and small businesses ready to launch. |
| 02 | **Business** | ±₹10,000 | Teams that need a dependable digital operation. |
| 03 | **Pro** | ±₹20,000 | Ambitious products with real operational complexity. |
| 04 | **Custom** | Let's discuss | Large systems, SaaS products, and specialized software. |

Each plan's "action" button opens a `mailto:` with the plan name pre-filled in both the subject and the body.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Language:** TypeScript 5.7 (strict, path-aliased via `@/*`)
- **Styling:** Tailwind CSS 4 (via PostCSS) plus a hand-authored `globals.css` design system
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics (production only)
- **UI primitives:** shadcn/ui-style components (Base UI + CVA + `cn` util)
- **Package manager:** pnpm (npm also works)

---

## Features

- **Canvas galaxy starfield** — a custom `<canvas>` particle field that reconstructs the NDE / NoirDemons wordmark from ~5,200 deterministic particles (seeded PRNG, DPR-aware, requestAnimationFrame-driven, `prefers-reduced-motion` respected).
- **Interactive product ecosystem** — tab-style product selector with animated card transitions and outbound links.
- **Scroll-driven navigation** — sticky, blurred nav with a mobile drawer, smooth scrolling, and section anchors.
- **Conversion-focused CTAs** — every plan and contact path is a pre-filled email, removing form friction.
- **Fully static output** — the entire site is prerendered at build time.
- **Responsive by default** — mobile, tablet, and desktop layouts from a single stylesheet.
- **Accessible** — semantic landmarks, `aria-*` attributes, keyboard-friendly native controls, and reduced-motion support.
- **Zero backend** — no server, no database, no auth, no environment variables required to run.

---

## Project Structure

```text
.
├── app/
│   ├── layout.tsx        # Root layout: all metadata, OG/Twitter cards, JSON-LD, Analytics
│   ├── page.tsx          # The entire landing page (client component)
│   ├── globals.css       # Design system, layout, responsive rules, animations
│   ├── robots.ts         # /robots.txt
│   └── sitemap.ts        # /sitemap.xml
├── components/
│   └── ui/
│       └── button.tsx    # Reusable button primitive (shadcn-style, CVA variants)
├── lib/
│   └── utils.ts          # `cn()` class-name utility
├── public/
│   ├── images/noirdemons.png
│   ├── apple-icon.png
│   ├── icon-light-32x32.png
│   └── icon-dark-32x32.png
├── next.config.mjs       # images.unoptimized, typescript.ignoreBuildErrors
├── postcss.config.mjs    # Tailwind v4 PostCSS plugin
├── components.json       # shadcn/ui configuration
├── tsconfig.json         # TypeScript + `@/*` path aliases
└── package.json
```

### Key files at a glance

| File | Responsibility |
| --- | --- |
| `app/layout.tsx` | Every SEO decision: title, description, keywords, verification, canonical, robots directives, Open Graph, Twitter card, app metadata, and two JSON-LD graphs. |
| `app/page.tsx` | All page content and interactivity: starfield, nav, hero, manifesto, ecosystem, plans, contact, footer. |
| `app/globals.css` | The entire visual language — colors, type scale, grid, glows, marquee, responsive breakpoints. |
| `app/robots.ts` | Crawl rules, `Host`, and the sitemap pointer. |
| `app/sitemap.ts` | Single canonical URL with monthly change frequency. |

---

## Getting Started

### Prerequisites

- **Node.js 18+** (Node 20+ recommended)
- **pnpm** (recommended) or npm

### Install & run

```bash
# with pnpm
pnpm install
pnpm dev

# or with npm
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
pnpm build     # type-checks and produces an optimized production build
pnpm start     # serves the production build locally
```

---

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the development server with hot reload. |
| `pnpm build` | Create an optimized production build. |
| `pnpm start` | Serve the production build. |

For a strict type check on its own (the build relaxes errors by design, see `next.config.mjs`):

```bash
npx tsc --noEmit
```

---

## SEO & Discoverability

SEO is a first-class concern in this project, not an afterthought. Everything below lives in `app/layout.tsx` unless noted.

- **Title:** `NDE — NoirDemons | Make the impossible useful | formerly Novexa`, with a `%s — NDE NoirDemons | formerly Novexa` template for sub-pages.
- **Description:** Leads with the short name and the full name together.
- **Keywords:** `NDE, NDe, nDE, NdE, nde, NoirDemons, Noir Demons, NDE NoirDemons, Novexa,` plus product and service terms.
- **Canonical URL:** `https://noir-demons.vercel.app/`.
- **Google verification:** an existing `google-site-verification` meta tag.
- **Open Graph & Twitter:** large-image card, branded `site_name` (`NDE · NoirDemons`), and the logo as the share image.
- **Robots:** index/follow with `max-image-preview: large` and full snippet length.
- **App metadata:** `application-name`, `apple-mobile-web-app-title`, and theme colors for light/dark.
- **Structured data (JSON-LD):**
  - `Organization` — with `alternateName` covering every short-name casing and the former name "Novexa".
  - `WebSite` — with a publisher link back to the `Organization` via `@id`.
- **`robots.txt`** (`app/robots.ts`) — allows all crawlers, declares the `Host`, and points to the sitemap.
- **`sitemap.xml`** (`app/sitemap.ts`) — the canonical URL, refreshed on each build.

> Keeping both the short name (`NDE`) and the full name (`NoirDemons`) in the title, description, and structured data is deliberate: it maximizes match against the many ways people type the brand while never hiding the real entity name.

---

## Customization

Most content and branding can be changed without touching component logic.

- **Brand names, title, description, keywords, JSON-LD** → `app/layout.tsx`.
- **Products, plans, and the sales email** → the `products`, `plans`, and `planEmail` definitions at the top of `app/page.tsx`.
- **Colors, type, spacing, breakpoints, animations** → `app/globals.css`.
- **Logo, favicons, share image** → drop new files into `public/` and update the paths in `app/layout.tsx` and `app/page.tsx`.
- **Contact address** → search for `nde.noirdemons@atomicmail.io` across `app/`.
- **Starfield density and palette** → the `GALAXY_STARS`, `WORDMARK_STARS`, and `AMBIENT_STARS` constants in `app/page.tsx`.

---

## Deployment

The site is deployed on **Vercel** at **https://noir-demons.vercel.app**.

Because the project is a standard Next.js App Router app, it works with any platform that supports Next.js:

- **Vercel** — import the repo, accept the defaults, deploy.
- **Any Node host** — run `pnpm build && pnpm start` behind a reverse proxy.

There is nothing to configure: no database, no secrets, no environment variables.

---

## Environment Variables

This project has **no required environment variables**. Vercel Analytics is automatically disabled outside production, so local development needs nothing at all.

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-change`.
3. Commit with a clear message: `git commit -m "Add your change"`.
4. Push and open a pull request.

Please keep the existing code style, run `pnpm build` before opening a PR, and preserve the brand rules above (short name `NDE`, full name `NoirDemons`).

---

## FAQ

**Is NDE the same as NoirDemons?**
Yes. NDE is the short, public-facing name for NoirDemons. They are the same company.

**What happened to Novexa?**
Novexa is the studio's former name. NDE is the current brand, and the site notes "formerly Novexa" so existing links and recognition carry over.

**Where do I get the products?**
Each product links directly to its live deployment from the Ecosystem section.

**How do I hire NDE for a custom build?**
Pick a plan in the Build Studio section and use its action button — it opens a pre-filled email to the team.

---

## Contact

- **Email:** [nde.noirdemons@atomicmail.io](mailto:nde.noirdemons@atomicmail.io)
- **Live site:** [https://noir-demons.vercel.app](https://noir-demons.vercel.app)

---

## License

All rights reserved. © 2026 NDE · NoirDemons — *Make the impossible useful.*
