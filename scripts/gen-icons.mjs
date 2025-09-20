import sharp from "sharp";

const tasks = [
  ["public/favicon.png", 32],
  ["app/icon.png", 512],
  ["app/apple-icon.png", 180],
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
  ["public/maskable-192.png", 192, { maskable: true }],
  ["public/maskable-512.png", 512, { maskable: true }],
];

const src = "public/logo.png";

for (const [out, size, opts] of tasks) {
  const img = sharp(src).resize(size, size, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  // For maskable, extend safe padding so Android can crop nicely
  const final = opts?.maskable
    ? img
        .extend({
          top: size * 0.1,
          bottom: size * 0.1,
          left: size * 0.1,
          right: size * 0.1,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .resize(size, size)
    : img;
  await final.png().toFile(out);
  console.log("wrote", out);
}
console.log("done");
