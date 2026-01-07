// scripts/optimize-images.mjs
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/images/";
const OUT = "public/images/optimized/";
const qJpg = 82;

for (const f of await fs.readdir(SRC)) {
  const src = path.join(SRC, f);
  const base = f.replace(/\.(jpe?g|png)$/i, "");
  const img = sharp(src).rotate();

  await img
    .avif({ quality: 55 })
    .toFile(path.join(OUT, `${base}.avif`))
    .catch(() => {});
  await img
    .webp({ quality: 70 })
    .toFile(path.join(OUT, `${base}.webp`))
    .catch(() => {});
  await img
    .jpeg({ quality: qJpg, mozjpeg: true })
    .toFile(path.join(OUT, `${base}.jpeg`))
    .catch(() => {});
  console.log("optimized:", base);
}
