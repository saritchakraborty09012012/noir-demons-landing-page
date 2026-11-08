/**
 * Final acceptance sweep for NDE Reel.
 * Requires the dev server: npm run dev
 * Run: node tools/qa/final-shots.cjs
 */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const TARGET = process.env.NDE_URL || "http://127.0.0.1:5200/";
const OUT = path.resolve(__dirname, "../../docs/shots");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const EMAIL = "nde.noirdemons@atomicmail.io";

fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const DESKTOP = [
  [0, "00-start"],
  [0.026, "01-hero"],
  [0.15, "02-premise"],
  [0.218, "03-impact"],
  [0.265, "03b-rise"],
  [0.36, "04-constellation"],
  [0.52, "05-engine"],
  [0.695, "06-keys"],
  [0.81, "07-plans-managed"],
  [0.93, "08-vision"],
  [0.985, "09-outro"],
  [0.105, "10-transition"],
];

const MOBILE = [
  [0, "m00-start"],
  [0.026, "m01-hero"],
  [0.15, "m02-premise"],
  [0.218, "m03-impact"],
  [0.36, "m04-constellation"],
  [0.52, "m05-engine"],
  [0.695, "m06-keys"],
  [0.75, "m07-table"],
  [0.81, "m08-plans"],
  [0.93, "m09-vision"],
  [0.985, "m10-outro"],
];

async function scrollTo(page, p) {
  await page.evaluate((progress) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(progress * max));
  }, p);
  await sleep(2000);
}

async function capture(page, frames, prefix = "") {
  const got = {};
  for (const [p, name] of frames) {
    await scrollTo(page, p);
    const shot = path.join(OUT, prefix + name + ".png");
    await page.screenshot({ path: shot, timeout: 120000 });
    got[name] = {
      p: await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--p").trim(),
      ),
      file: path.relative(path.resolve(__dirname, "../.."), shot).replaceAll("\\", "/"),
    };
  }
  return got;
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
      "--disable-gpu-sandbox",
    ],
  });

  const errors = [];
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push("CONSOLE: " + m.text()));
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("requestfailed", (r) => errors.push("REQFAIL: " + r.url() + " " + (r.failure() || {}).errorText));

  page.setDefaultTimeout(120000);
  await page.goto(TARGET, { waitUntil: "load", timeout: 120000 });
  await page.waitForSelector(".rail button", { state: "attached", timeout: 240000 });
  await sleep(5500);
  const hintDesktop = await page.evaluate(() => {
    const hint = document.querySelector(".scroll-hint");
    return { exists: !!hint, visible: !!document.querySelector(".scroll-hint:not(.is-gone)"), text: hint?.textContent?.trim() || "" };
  });
  const desktopFrames = await capture(page, DESKTOP);

  const desktop = await page.evaluate((email) => {
    const links = Array.from(document.querySelectorAll('a[href^="mailto:"]')).map((a) =>
      a.getAttribute("href"),
    );
    return {
      canvasCount: document.querySelectorAll("canvas").length,
      railButtons: document.querySelectorAll(".rail button").length,
      tableRows: document.querySelectorAll(".decision tbody tr").length,
      mailtoCount: links.length,
      allMailtoUseEmail: links.every((h) => h && h.includes(email)),
      bodyText: document.body.innerText,
      quality: document.body.innerText.match(/QUALITY\s+(ULTRA|HIGH|LITE)/)?.[1] || null,
    };
  }, EMAIL);

  await scrollTo(page, 0.81);
  const collectPlanLinks = async () => {
    const n = await page.evaluate(() => document.querySelectorAll(".plan-tabs button").length);
    const hrefs = [];
    for (let i = 0; i < n; i += 1) {
      await page.evaluate((idx) => {
        const button = document.querySelectorAll(".plan-tabs button")[idx];
        if (button) button.click();
      }, i);
      await sleep(600);
      hrefs.push(await page.evaluate(() => document.querySelector(".plan-cta")?.getAttribute("href")));
    }
    return hrefs;
  };
  const managed = await collectPlanLinks();
  await page.evaluate(() => {
    const toggle = document.querySelector(".plan-toggle__inner button:nth-child(2)");
    if (toggle) toggle.click();
  });
  await sleep(900);
  const source = await collectPlanLinks();
  await page.evaluate(() => {
    const button = document.querySelectorAll(".plan-tabs button")[1];
    if (button) button.click();
  });
  await sleep(700);
  await page.screenshot({ path: path.join(OUT, "07-plans-source.png"), timeout: 120000 });
  const sourceText = await page.evaluate(() => document.body.innerText);
  const planText = desktop.bodyText + "\n" + sourceText;

  const planLinks = [...managed, ...source];
  const subjects = planLinks.map((href) => {
    try {
      return new URL(href).searchParams.get("subject") || "";
    } catch {
      return "";
    }
  });
  const planChecks = {
    managedCount: managed.length,
    sourceCount: source.length,
    uniqueSubjects: new Set(subjects).size,
    allPersonalised: planLinks.every((href) => {
      try {
        const u = new URL(href);
        return Boolean(u.searchParams.get("subject") && u.searchParams.get("body"));
      } catch {
        return false;
      }
    }),
    managedSubjects: subjects.slice(0, 4).every((s) => s.includes("SaaS")),
    sourceSubjects: subjects.slice(4).every((s) => s.includes("Source-code")),
  };

  const requiredCopy = [
    EMAIL,
    "13 DECISION POINTS",
    "±₹2,000",
    "±₹6,000",
    "±₹10,000",
    "₹10,000",
    "₹20,000",
    "₹30,000",
    "Run it as a service",
    "Own the source code",
  ];
  const copyChecks = Object.fromEntries(
    requiredCopy.map((s) => [s, planText.includes(s)]),
  );

  await page.close();
  await context.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on("console", (m) => m.type() === "error" && errors.push("MOBILE CONSOLE: " + m.text()));
  mobilePage.on("pageerror", (e) => errors.push("MOBILE PAGEERROR: " + e.message));
  mobilePage.on("requestfailed", (r) => errors.push("MOBILE REQFAIL: " + r.url() + " " + (r.failure() || {}).errorText));
  await mobilePage.goto(TARGET, { waitUntil: "load", timeout: 120000 });
  await mobilePage.waitForSelector(".rail button", { state: "attached", timeout: 240000 });
  await sleep(5500);
  const hintMobile = await mobilePage.evaluate(() => ({
    visible: !!document.querySelector(".scroll-hint:not(.is-gone)"),
    text: document.querySelector(".scroll-hint")?.textContent?.trim() || "",
  }));
  const mobileFrames = await capture(mobilePage, MOBILE, "");
  const mobile = await mobilePage.evaluate((email) => {
    const clock = document.querySelector(".hud-clock")?.getBoundingClientRect();
    const foot = document.querySelector(".outro-foot")?.getBoundingClientRect();
    const table = document.querySelector(".table-wrap");
    return {
      docWidth: document.documentElement.scrollWidth,
      winWidth: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      clockTop: clock?.top,
      footBottom: foot?.bottom,
      clearance: clock && foot ? Math.round(clock.top - foot.bottom) : null,
      tableScrollHeight: table?.scrollHeight,
      emailVisible: document.body.innerText.includes(email),
      canvasCount: document.querySelectorAll("canvas").length,
      railButtons: document.querySelectorAll(".rail button").length,
      tableRows: document.querySelectorAll(".decision tbody tr").length,
    };
  }, EMAIL);

  await mobilePage.close();
  await mobileContext.close();

  const reducedContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reducedContext.newPage();
  reducedPage.on("pageerror", (e) => errors.push("REDUCED PAGEERROR: " + e.message));
  await reducedPage.goto(TARGET, { waitUntil: "load", timeout: 120000 });
  await reducedPage.waitForSelector(".rail button", { state: "attached", timeout: 240000 });
  await sleep(3500);
  const reduced = await reducedPage.evaluate(() => ({
    canvasCount: document.querySelectorAll("canvas").length,
    p: getComputedStyle(document.documentElement).getPropertyValue("--p").trim(),
  }));

  const checks = {
    zeroErrors: errors.length === 0,
    oneCanvas: desktop.canvasCount === 1 && mobile.canvasCount === 1,
    tenRailItems: desktop.railButtons === 10 && mobile.railButtons === 10,
    thirteenDecisionRows: desktop.tableRows === 13 && mobile.tableRows === 13,
    emailEverywhere: desktop.allMailtoUseEmail && mobile.emailVisible,
    planLinks:
      planChecks.managedCount === 4 &&
      planChecks.sourceCount === 4 &&
      planChecks.allPersonalised &&
      planChecks.uniqueSubjects === 8 &&
      planChecks.managedSubjects &&
      planChecks.sourceSubjects,
    verbatimCopy: Object.values(copyChecks).every(Boolean),
    mobileNoOverflow: !mobile.overflow,
    mobileFooterClearance: mobile.clearance !== null && mobile.clearance >= 8,
    reducedMotionLoads: reduced.canvasCount === 1,
    scrollHint:
      hintDesktop.visible &&
      hintMobile.visible &&
      hintDesktop.text.toLowerCase().includes("scroll") &&
      hintMobile.text.toLowerCase().includes("scroll"),
  };

  const report = {
    generatedAt: new Date().toISOString(),
    url: TARGET,
    viewport: { desktop: "1440x900", mobile: "390x844" },
    note: "Software WebGL (SwiftShader) renders at LITE quality; timings are not representative of GPU performance.",
    desktop,
    desktopFrames,
    mobile,
    mobileFrames,
    planChecks,
    copyChecks,
    hint: { desktop: hintDesktop, mobile: hintMobile },
    reduced,
    checks,
    errors,
  };
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ checks, planChecks, mobile, errors }, null, 2));
  await browser.close();
  if (!Object.values(checks).every(Boolean)) process.exit(1);
})().catch((e) => {
  console.error("QA FAILED", e);
  process.exit(1);
});
