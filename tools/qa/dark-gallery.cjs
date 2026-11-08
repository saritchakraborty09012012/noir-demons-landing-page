/**
 * Builds a labelled dark-mode contact sheet from the acceptance screenshots.
 * Requires the dev server. Run: node tools/qa/dark-gallery.cjs
 */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const OUT = path.resolve(__dirname, "../../docs/shots");
const TARGET = process.env.NDE_URL || "http://127.0.0.1:5200";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const DESKTOP = [
  ["00-start.png", "S00", "START / LOADER", "0.000"],
  ["01-hero.png", "S01", "HERO / ACT I", "0.026"],
  ["02-premise.png", "S02", "PREMISE", "0.150"],
  ["03-impact.png", "S03", "IMPACT", "0.218"],
  ["03b-rise.png", "S03", "RISE", "0.265"],
  ["04-constellation.png", "S04", "CONSTELLATION", "0.360"],
  ["05-engine.png", "S05", "THE ENGINE", "0.520"],
  ["06-keys.png", "S06", "KEYS VS DRIVE", "0.695"],
  ["07-plans-managed.png", "S07", "PLANS / MANAGED", "0.810"],
  ["07-plans-source.png", "S07", "PLANS / SOURCE", "0.810"],
  ["08-vision.png", "S08", "VISION / BLACK HOLE", "0.930"],
  ["09-outro.png", "S09", "OUTRO / CONTACT", "0.985"],
  ["10-transition.png", "S03", "PORTAL TRANSITION", "0.105"],
];

const MOBILE = [
  ["m00-start.png", "S00", "START", "0.000"],
  ["m01-hero.png", "S01", "HERO", "0.026"],
  ["m02-premise.png", "S02", "PREMISE", "0.150"],
  ["m03-impact.png", "S03", "IMPACT", "0.218"],
  ["m04-constellation.png", "S04", "CONSTELLATION", "0.360"],
  ["m05-engine.png", "S05", "THE ENGINE", "0.520"],
  ["m06-keys.png", "S06", "KEYS VS DRIVE", "0.695"],
  ["m07-table.png", "S06", "DECISION TABLE", "0.750"],
  ["m08-plans.png", "S07", "PLANS", "0.810"],
  ["m09-vision.png", "S08", "VISION", "0.930"],
  ["m10-outro.png", "S09", "OUTRO", "0.985"],
];

const card = ([file, id, name, p]) => `
  <a class="card" href="./${file}" target="_blank" rel="noopener">
    <span class="shot"><img src="./${file}" alt="${id} ${name}" loading="eager" /></span>
    <span class="meta">
      <span class="id">${id}</span>
      <span class="name">${name}</span>
      <span class="p">p ${p}</span>
    </span>
  </a>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>NDE Reel — dark mode scene index</title>
<style>
  @font-face { font-family: "Instrument Serif"; src: url("/fonts/InstrumentSerif-Regular.ttf") format("truetype"); font-style: normal; font-display: swap; }
  @font-face { font-family: "Instrument Serif"; src: url("/fonts/InstrumentSerif-Italic.ttf") format("truetype"); font-style: italic; font-display: swap; }
  @font-face { font-family: "JetBrains Mono"; src: url("/fonts/JetBrainsMono.ttf") format("truetype"); font-weight: 100 900; font-display: swap; }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #050505; color: #ece7dd; }
  body { font-family: "JetBrains Mono", Consolas, monospace; padding: 34px 38px 30px; }
  .serif { font-family: "Instrument Serif", Georgia, serif; font-weight: 400; }
  .gold { color: #ebcb82; }
  header { display: flex; align-items: center; gap: 18px; padding-bottom: 20px; border-bottom: 1px solid rgba(201,162,75,.35); }
  header img { width: 58px; height: 58px; object-fit: cover; border: 1px solid rgba(201,162,75,.5); }
  header h1 { margin: 0; font-size: 34px; line-height: 1; font-weight: 400; }
  header .sub { margin-top: 7px; font-size: 8px; letter-spacing: .26em; color: #8f8a7e; }
  header .right { margin-left: auto; text-align: right; font-size: 8px; letter-spacing: .2em; color: #8f8a7e; line-height: 1.8; }
  section { padding-top: 26px; }
  .section-head { display: flex; align-items: baseline; gap: 14px; margin-bottom: 16px; }
  .section-head h2 { margin: 0; font-size: 26px; font-weight: 400; }
  .section-head span { font-size: 8px; letter-spacing: .24em; color: #8f8a7e; }
  .grid { display: grid; gap: 16px 16px; }
  .desktop .grid { grid-template-columns: repeat(3, 520px); }
  .mobile .grid { grid-template-columns: repeat(4, 270px); }
  .card { display: block; text-decoration: none; color: inherit; border: 1px solid rgba(201,162,75,.26); background: #08080a; transition: border-color .2s; }
  .card:hover { border-color: rgba(201,162,75,.8); }
  .shot { display: block; background: #000; }
  .shot img { display: block; width: 100%; height: auto; }
  .meta { display: grid; grid-template-columns: auto 1fr auto; align-items: baseline; gap: 10px; padding: 9px 11px 10px; border-top: 1px solid rgba(201,162,75,.2); }
  .id { font-size: 8px; letter-spacing: .14em; color: #ebcb82; }
  .name { font-family: "Instrument Serif", Georgia, serif; font-size: 18px; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .p { font-size: 7px; letter-spacing: .12em; color: #7a7469; }
  .mobile .name { font-size: 15px; }
  .mobile .meta { grid-template-columns: auto 1fr; gap: 2px 8px; padding: 8px 9px; }
  .mobile .p { grid-column: 1 / -1; }
  footer { margin-top: 26px; padding-top: 14px; border-top: 1px solid rgba(201,162,75,.2); display: flex; justify-content: space-between; font-size: 7px; letter-spacing: .18em; color: #7a7469; }
</style>
</head>
<body>
<header>
  <img src="/images/noirdemons.webp" alt="NDE NoirDemons" />
  <div>
    <h1 class="serif">NDE Reel <em class="gold">— dark mode</em></h1>
    <div class="sub">NOIRDEMONS / EVERY SCENE / NO LIGHT THEME</div>
  </div>
  <div class="right">DESKTOP 1440 × 900<br />MOBILE 390 × 844<br />LITE WEBGL</div>
</header>

<section id="desktop" class="desktop">
  <div class="section-head"><h2 class="serif">Desktop <em class="gold">scene index</em></h2><span>13 STATES · 1440 × 900</span></div>
  <div class="grid">${DESKTOP.map(card).join("")}</div>
</section>

<section id="mobile" class="mobile">
  <div class="section-head"><h2 class="serif">Mobile <em class="gold">scene index</em></h2><span>11 STATES · 390 × 844</span></div>
  <div class="grid">${MOBILE.map(card).join("")}</div>
</section>

<footer><span>CAPTURED FROM LOCALHOST:5200</span><span>DARK THEME ONLY · SOFTWARE WEBGL</span></footer>
</body>
</html>`;

async function shoot(page, selector, file) {
  const el = page.locator(selector);
  await el.screenshot({ path: path.join(OUT, file), timeout: 120000 });
  console.log(file, `${Math.round(fs.statSync(path.join(OUT, file)).size / 1024)} KB`);
}

(async () => {
  fs.writeFileSync(path.join(OUT, "gallery.html"), html);
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  });
  const context = await browser.newContext({ viewport: { width: 1720, height: 1200 }, deviceScaleFactor: 1.5 });
  const page = await context.newPage();
  await page.goto(`${TARGET}/docs/shots/gallery.html`, { waitUntil: "load", timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(
    () => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
    null,
    { timeout: 120000 },
  );
  await page.waitForTimeout(400);
  await shoot(page, "#desktop", "collage-dark-desktop.png");
  await shoot(page, "#mobile", "collage-dark-mobile.png");
  await browser.close();
})().catch((e) => {
  console.error("GALLERY FAILED", e);
  process.exit(1);
});
