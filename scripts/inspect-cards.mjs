import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

const results = await page.evaluate(() => {
  const section = document.getElementById("card-variants");
  if (!section) return { error: "no card-variants section" };
  const cards = Array.from(section.querySelectorAll(".gd-card"));
  return {
    cards: cards.map((c) => {
      const photo = c.querySelector(".gd-ratio");
      const photoRect = photo?.getBoundingClientRect();
      return {
        class: c.className,
        rect: { w: c.offsetWidth, h: c.offsetHeight },
        photo: photoRect
          ? { w: Math.round(photoRect.width), h: Math.round(photoRect.height) }
          : null,
        children: Array.from(c.children).map((ch) => ({
          tag: ch.tagName,
          class: ch.className,
          h: ch.offsetHeight,
        })),
      };
    }),
    viewport: { w: window.innerWidth, h: window.innerHeight },
    imageMaxH: getComputedStyle(document.documentElement).getPropertyValue("--gd-image-max-h"),
  };
});

console.log(JSON.stringify(results, null, 2));
await browser.close();
