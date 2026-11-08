// Capture dark-mode homepage screenshots for the S04 ecosystem product cards.
const { chromium } = require("playwright-core");
const path = require("node:path");

const OUT = path.join(__dirname, "..", "..", "public", "shots");
const SITES = [
  ["product-04-solvencert.jpg", "http://127.0.0.1:5304/"],
  ["product-08-aether.jpg", "https://aether-studio-nde.vercel.app/"],
  ["product-09-koko.jpg", "https://koko-coconut-co-nde.vercel.app/"],
  ["product-10-aven.jpg", "https://aven-serum-nde.vercel.app/"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  require("node:fs").mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  });
  for (const [file, url] of SITES) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      colorScheme: "dark",
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
    // Dismiss any welcome/cookie modal so the shot shows the site, not a popup.
    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press("Escape").catch(() => {});
      const ok = page.getByRole("button", { name: /^OK$/ });
      if ((await ok.count()) === 0) break;
      await ok.first().click().catch(() => {});
      await sleep(500);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(6000);
    if (file.includes("koko")) {
      // KOKO opens behind a "lift the curtain" intro — scroll to reveal the site.
      await page.mouse.wheel(0, 1600);
      await sleep(5000);
    }
    await page.screenshot({ path: path.join(OUT, file), type: "jpeg", quality: 82 });
    console.log("captured", file, await page.title());
    await context.close();
  }
  await browser.close();
})().catch((e) => {
  console.error("FAIL", e);
  process.exit(1);
});
