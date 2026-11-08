/**
 * Mobile adaptation sweep: overflow, clipping and overlap at phone sizes.
 * Requires the dev server. Run: node tools/qa/mobile-audit.cjs
 */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const TARGET = process.env.NDE_URL || "http://127.0.0.1:5200/";
const OUT = path.resolve(__dirname, "../../.debug-shots/mobile");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIEWS = [
  [320, 568, "320"],
  [360, 640, "360"],
  [390, 844, "390"],
  [430, 932, "430"],
  [844, 390, "land844"],
  [568, 320, "land568"],
];

const FRAMES = [0, 0.026, 0.36, 0.52, 0.695, 0.75, 0.81, 0.93, 0.985];
const SHOT = new Set([0, 0.026, 0.695, 0.75, 0.81, 0.93, 0.985]);

async function scrollTo(page, p) {
  await page.evaluate((progress) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(progress * max));
  }, p);
  await sleep(1300);
}

async function measure(page) {
  return page.evaluate(() => {
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      let eff = 1;
      let node = el;
      while (node) {
        eff *= Number(getComputedStyle(node).opacity);
        node = node.parentElement;
      }
      return {
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
        top: Math.round(r.top), right: Math.round(r.right),
        bottom: Math.round(r.bottom), left: Math.round(r.left),
        opacity: Number(cs.opacity), eff: Number(eff.toFixed(3)), display: cs.display,
        overflowX: el.scrollWidth - el.clientWidth,
        overflowY: el.scrollHeight - el.clientHeight,
      };
    };
    return {
      docW: document.documentElement.scrollWidth,
      winW: innerWidth,
      winH: innerHeight,
      hint: rect(".scroll-hint"),
      clock: rect(".hud-clock"),
      header: rect(".header"),
      rail: rect(".rail"),
      hero: rect(".hero-panel"),
      premise: rect(".premise-panel"),
      impact: rect(".impact-panel"),
      intro: rect(".constellation-intro"),
      card: rect(".product-card"),
      engineCopy: rect(".engine-copy"),
      engineStages: rect(".engine-stages"),
      choice: rect(".choice-card.is-managed"),
      table: rect(".table-wrap"),
      plans: rect(".plans-hud"),
      vision: rect(".vision-panel"),
      actions: rect(".outro-actions"),
      foot: rect(".outro-foot"),
      footRight: rect(".outro-foot__right"),
      menuBtn: rect(".hud-menu-btn"),
    };
  });
}

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
    ],
  });
  const out = { errors: [], views: [] };
  for (const [w, h, name] of VIEWS) {
    const context = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    page.on("console", (m) => m.type() === "error" && out.errors.push(name + " CONSOLE " + m.text()));
    page.on("pageerror", (e) => out.errors.push(name + " PAGEERROR " + e.message));
    page.setDefaultTimeout(120000);
    await page.goto(TARGET, { waitUntil: "load", timeout: 120000 });
    await page.waitForSelector(".rail button", { state: "attached", timeout: 240000 });
    await sleep(4500);

    const frames = [];
    for (const p of FRAMES) {
      await scrollTo(page, p);
      const m = await measure(page);
      frames.push({ p, ...m });
      if (SHOT.has(p)) {
        await page.screenshot({ path: path.join(OUT, `${name}-${Math.round(p * 1000)}.png`) });
      }
    }
    const issues = [];
    for (const f of frames) {
      if (f.docW > f.winW + 1) issues.push(`p=${f.p} horizontal overflow ${f.docW}>${f.winW}`);
      const keys = ["hint", "clock", "header", "rail", "hero", "premise", "impact", "intro", "card",
        "engineCopy", "engineStages", "choice", "table", "plans", "vision", "actions", "foot"];
      for (const k of keys) {
        const r = f[k];
        if (!r || r.display === "none" || r.eff < 0.15 || r.w === 0) continue;
        if (r.left < -1 || r.right > f.winW + 1 || r.top < -1 || r.bottom > f.winH + 1) {
          issues.push(`p=${f.p} ${k} outside ${JSON.stringify([r.left, r.top, r.right, r.bottom])}`);
        }
        if (r.overflowX > 1) issues.push(`p=${f.p} ${k} inner-x-overflow ${r.overflowX}`);
      }
      const visible = (r) => r && r.display !== "none" && r.eff >= 0.15 && r.w > 0;
      const overlap = (a, b) =>
        visible(a) && visible(b) &&
        a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      if (overlap(f.hint, f.clock)) issues.push(`p=${f.p} hint/clock overlap`);
      if (overlap(f.clock, f.foot)) issues.push(`p=${f.p} clock/foot overlap`);
      if (overlap(f.clock, f.choice)) issues.push(`p=${f.p} clock/choice overlap`);
      if (overlap(f.clock, f.table)) issues.push(`p=${f.p} clock/table overlap`);
      if (overlap(f.clock, f.plans)) issues.push(`p=${f.p} clock/plans overlap`);
      if (overlap(f.header, f.hero)) issues.push(`p=${f.p} header/hero overlap`);
      if (overlap(f.header, f.intro)) issues.push(`p=${f.p} header/intro overlap`);
      if (overlap(f.header, f.plans)) issues.push(`p=${f.p} header/plans overlap`);
      if (overlap(f.header, f.choice)) issues.push(`p=${f.p} header/choice overlap`);
      if (overlap(f.header, f.table)) issues.push(`p=${f.p} header/table overlap`);
      if (overlap(f.hint, f.hero) && f.hint && f.hint.eff > 0.15) issues.push(`p=${f.p} hint/hero overlap`);
      if (overlap(f.hint, f.header) && f.hint && f.hint.eff > 0.15) issues.push(`p=${f.p} hint/header overlap`);
      if (overlap(f.actions, f.foot)) issues.push(`p=${f.p} actions/foot overlap`);
      if (overlap(f.rail, f.footRight)) issues.push(`p=${f.p} rail/footRight overlap`);
      if (overlap(f.rail, f.clock)) issues.push(`p=${f.p} rail/clock overlap`);
    }
    out.views.push({ name, w, h, frames, issues: [...new Set(issues)] });
    console.log(name, JSON.stringify([...new Set(issues)]));
    await page.close();
    await context.close();
  }
  fs.writeFileSync(path.join(OUT, "audit.json"), JSON.stringify(out, null, 2));
  console.log("ERRORS", out.errors);
  await browser.close();
})().catch((e) => {
  console.error("AUDIT FAILED", e);
  process.exit(1);
});
