import fs from "node:fs";
import path from "node:path";

const tokens = fs.readFileSync("app/styles/tokens.css", "utf8");
const page = fs.readFileSync("app/page.tsx", "utf8");
const compDir = "app/_components";
const comps = fs.readdirSync(compDir)
  .map((f) => fs.readFileSync(path.join(compDir, f), "utf8"))
  .join("\n");
const allJsx = page + "\n" + comps;

// classes defined as selectors in tokens.css
const defined = new Set();
const reDef = /\.(gd-[a-zA-Z0-9_-]+)/g;
let m;
while ((m = reDef.exec(tokens))) defined.add(m[1]);

// classes actually rendered in JSX: scan className= attributes/expressions
const rendered = new Set();
// pull all string and template-literal contents and look for gd-* tokens inside
const reStr = /(["'`])((?:\\.|(?!\1).)*)\1/g;
while ((m = reStr.exec(allJsx))) {
  const body = m[2];
  // only count tokens that look like raw class names (no dot, no quote)
  for (const t of body.split(/[\s,]+/)) {
    if (/^gd-[a-zA-Z0-9_-]+$/.test(t)) rendered.add(t);
  }
}

const missing = [...defined].filter((c) => !rendered.has(c)).sort();
console.log(
  "=== .gd-* classes DEFINED in tokens.css but NEVER appear as a plain class token in JSX (" +
    missing.length +
    ") ==="
);
missing.forEach((c) => console.log("  " + c));
