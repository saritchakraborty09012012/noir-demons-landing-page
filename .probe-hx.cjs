const { chromium } = require("playwright-core");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = async (p, path) => { try { await p.screenshot({ path, timeout: 90000 }); return "ok"; } catch (e) { return String(e).split("\n")[0]; } };
(async () => {
  const b = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  });
  const c = await b.newContext({ viewport: { width: 365, height: 700 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await c.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));

  await p.goto("http://127.0.0.1:5200/#/dive", { waitUntil: "load", timeout: 120000 });
  await sleep(4000);

  const measure = () => p.evaluate(() => {
    const hdr = document.querySelector(".dive__header").getBoundingClientRect();
    const nav = document.querySelector(".dive__nav");
    const navR = nav.getBoundingClientRect();
    const items = [...document.querySelectorAll(".dive__nav button")].map((e) => {
      const r = e.getBoundingClientRect();
      return { t: e.textContent.trim().slice(0, 14), y: Math.round(r.y) };
    });
    const ys = new Set(items.map((i) => i.y));
    const before = nav.scrollLeft;
    nav.scrollLeft = 9999;
    const got = nav.scrollLeft;
    nav.scrollLeft = before;
    const s = document.querySelector(".dive__scroll");
    const pageBefore = s.scrollLeft;
    s.scrollLeft = 9999;
    const pageGot = s.scrollLeft;
    s.scrollLeft = pageBefore;
    return {
      win: innerWidth,
      headerH: Math.round(hdr.height),
      oneLine: ys.size === 1,
      itemYs: [...ys],
      navScrollW: nav.scrollWidth,
      navClientW: nav.clientWidth,
      navScrolledRight: got,
      pageSW: s.scrollWidth,
      pageCW: s.clientWidth,
      pageScrolledRight: pageGot,
      docSW: document.documentElement.scrollWidth,
    };
  });

  const at365 = await measure();
  const s1 = await shot(p, "docs/shots/_hx-dive-mob.jpg");

  await p.setViewportSize({ width: 760, height: 800 });
  await sleep(900);
  const at760 = await measure();
  const s2 = await shot(p, "docs/shots/_hx-dive-760.jpg");

  console.log(JSON.stringify({ at365, s1, at760, s2, errors }, null, 1));
  await b.close();
})().catch((e) => { console.log("FAIL", String(e)); process.exit(1); });
