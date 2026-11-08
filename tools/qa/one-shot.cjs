const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const OUT = path.resolve(__dirname, "../../.debug-shots");
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
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
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(120000);
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.NDE_URL || "http://127.0.0.1:5200/", { waitUntil: "load" });
  await page.waitForSelector(".rail button", { state: "attached" });
  await sleep(5500);
  const frames = (process.env.FRAMES || "0.985,0.93").split(",").map(Number);
  for (const p of frames) {
    await page.evaluate((progress) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.round(progress * max));
    }, p);
    await sleep(2600);
    await page.screenshot({ path: path.join(OUT, `p-${Math.round(p * 1000)}.png`) });
  }
  console.log(JSON.stringify({ errors }));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
