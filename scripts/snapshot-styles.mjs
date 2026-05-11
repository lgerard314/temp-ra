// Crawls every element under <main> on /, captures the computed styles
// that the color-refactor could plausibly affect, and dumps a JSON
// keyed by a stable selector path. Run BEFORE and AFTER the refactor;
// the two outputs should diff to empty (or only contain documented
// intentional changes).
//
// Usage:
//   node scripts/snapshot-styles.mjs <output.json>
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const out = process.argv[2] ?? "snapshot.json";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1200 } });
const page = await ctx.newPage();

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(500); // allow late layout

const result = await page.evaluate(() => {
  const PROPS = [
    "color",
    "backgroundColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "borderTopWidth",
    "borderTopStyle",
    "outlineColor",
    "boxShadow",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "lineHeight",
    "letterSpacing",
    "textTransform",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "marginTop",
    "marginRight",
    "marginBottom",
    "marginLeft",
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomRightRadius",
    "borderBottomLeftRadius",
  ];
  const pathFor = (el) => {
    const segs = [];
    let cur = el;
    while (cur && cur !== document.documentElement) {
      const parent = cur.parentElement;
      if (!parent) break;
      const siblings = Array.from(parent.children).filter(
        (s) => s.tagName === cur.tagName
      );
      const idx = siblings.indexOf(cur);
      const cls = cur.className && typeof cur.className === "string"
        ? `.${cur.className.trim().split(/\s+/).join(".")}`
        : "";
      segs.unshift(`${cur.tagName.toLowerCase()}${cls}[${idx}]`);
      cur = parent;
    }
    return segs.join(" > ");
  };
  const all = Array.from(document.querySelectorAll("body *"));
  const data = {};
  for (const el of all) {
    if (!(el instanceof HTMLElement)) continue;
    const cs = window.getComputedStyle(el);
    const entry = {};
    for (const p of PROPS) entry[p] = cs[p];
    data[pathFor(el)] = entry;
  }
  return { count: all.length, data };
});

writeFileSync(out, JSON.stringify(result, null, 2));
console.log(`captured ${result.count} elements → ${out}`);
await browser.close();
