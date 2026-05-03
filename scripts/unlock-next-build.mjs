#!/usr/bin/env node
/**
 * Removes a stale `.next/lock` left after a crashed/interrupted `next build`,
 * which otherwise yields "Another next build process is already running".
 * Safe no-op if the file does not exist.
 */
import fs from "node:fs";
import path from "node:path";

const lock = path.join(process.cwd(), ".next", "lock");

try {
  fs.unlinkSync(lock);
  console.info("[unlock-next-build] removed .next/lock");
} catch (e) {
  const err = /** @type {NodeJS.ErrnoException} */ (e);
  if (err.code !== "ENOENT") throw err;
}
