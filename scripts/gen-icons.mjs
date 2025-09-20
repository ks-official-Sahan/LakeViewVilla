// scripts/gen-icons.mjs
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Prefer logo.png; fall back to alternatives if needed.
const srcCandidates = [
  "public/logo.png",
  "public/LAKE VIEW.png",
  "public/placeholder-logo.png",
].map((p) => path.join(ROOT, p));

let SRC = null;
for (const p of srcCandidates) {
  try {
    await fs.access(p);
    SRC = p;
    break;
  } catch {}
}
if (!SRC) {
  throw new Error(
    `No source icon found. Expected one of:\n${srcCandidates
      .map((p) => ` - ${p}`)
      .join("\n")}`
  );
}

const tasks = [
  ["public/favicon.png", 32],
  ["app/icon.png", 512],
  ["app/apple-icon.png", 180],
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
  ["public/maskable-192.png", 192, { maskable: true }],
  ["public/maskable-512.png", 512, { maskable: true }],
];

for (const [relOut, size, opts] of tasks) {
  const out = path.join(ROOT, relOut);
  await fs.mkdir(path.dirname(out), { recursive: true });

  let img = sharp(SRC).resize(size, size, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (opts?.maskable) {
    // 10% safe padding for maskable icons; use integers
    const pad = Math.round(size * 0.1);
    img = img
      .extend({
        top: pad,
        bottom: pad,
        left: pad,
        right: pad,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .resize(size, size);
  }

  await img.png().toFile(out);
  console.log("wrote", relOut);
}
console.log(`done: ${path.relative(ROOT, SRC)} → icons`);
