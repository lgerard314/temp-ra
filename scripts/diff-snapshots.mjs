// Compares snapshot-before.json vs snapshot-after.json and prints
// every element whose computed style differs (path + props that changed).
import { readFileSync } from "node:fs";

const before = JSON.parse(readFileSync(process.argv[2] ?? "snapshot-before.json", "utf8"));
const after  = JSON.parse(readFileSync(process.argv[3] ?? "snapshot-after.json",  "utf8"));

const paths = new Set([...Object.keys(before.data), ...Object.keys(after.data)]);
let diffs = 0;
for (const p of paths) {
  const a = before.data[p];
  const b = after.data[p];
  if (!a) { console.log(`+ NEW: ${p}`); diffs++; continue; }
  if (!b) { console.log(`- GONE: ${p}`); diffs++; continue; }
  const props = new Set([...Object.keys(a), ...Object.keys(b)]);
  const changed = [];
  for (const k of props) {
    if (a[k] !== b[k]) changed.push(`${k}: ${a[k]} → ${b[k]}`);
  }
  if (changed.length) {
    diffs++;
    console.log(`Δ ${p}`);
    for (const c of changed) console.log(`   ${c}`);
  }
}
console.log(`\n${diffs} elements differ (out of ${paths.size} total)`);
