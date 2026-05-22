/**
 * Record a fresh-load homepage entrance animation as WebM via Puppeteer CDP
 * screencast, then return path to raw .webm. ffmpeg conversion happens
 * separately (see scripts/encode-hover.sh).
 *
 * Reuses puppeteer + Chromium from the sibling KZK project to avoid bloating
 * technityze-v2 node_modules with a 250MB browser download.
 *
 * Usage:
 *   node scripts/record-hover.mjs <slug> <url> [seconds=7]
 *
 * Example:
 *   node scripts/record-hover.mjs astroskop https://astroskop.rs 7
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(path.join(process.cwd(), "package.json"));

// Reuse KZK's puppeteer install + cached Chromium.
const KZK_PPT = "/Users/maki/Desktop/Work/Personal/kapsulezakafu/node_modules/puppeteer";

let puppeteer;
try {
  puppeteer = require(KZK_PPT);
} catch (e) {
  console.error(`Could not load puppeteer from KZK: ${e.message}`);
  process.exit(1);
}

const [, , slug, url, secondsRaw] = process.argv;
if (!slug || !url) {
  console.error("Usage: node scripts/record-hover.mjs <slug> <url> [seconds]");
  process.exit(1);
}
const seconds = Number(secondsRaw ?? 7);

const RAW_DIR = path.resolve("public/img/technityze/work/_raw");
await mkdir(RAW_DIR, { recursive: true });
const outPath = path.join(RAW_DIR, `${slug}.webm`);

console.log(`[${slug}] launching headless Chromium`);
const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  args: [
    "--no-sandbox",
    "--disable-blink-features=AutomationControlled",
    "--autoplay-policy=no-user-gesture-required",
    "--hide-scrollbars",
  ],
});

const page = await browser.newPage();

// Realistic UA so sites don't redirect to bot pages.
await page.setUserAgent(
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
);
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

console.log(`[${slug}] navigating to ${url}`);
await page.goto(url, { waitUntil: "load", timeout: 45000 });

// Give the entrance animation a single frame to mount before capture so
// we don't record a blank flash. Capture starts essentially at t=0 of
// the visible animation.
await new Promise((r) => setTimeout(r, 150));

const client = await page.target().createCDPSession();
await client.send("Page.startScreencast", {
  format: "jpeg",
  quality: 92,
  everyNthFrame: 1,
});

const frames = [];
let frameIdx = 0;
client.on("Page.screencastFrame", async (msg) => {
  frames.push({ data: msg.data, idx: frameIdx++ });
  try {
    await client.send("Page.screencastFrameAck", { sessionId: msg.sessionId });
  } catch {}
});

console.log(`[${slug}] recording ${seconds}s`);
await new Promise((r) => setTimeout(r, seconds * 1000));
await client.send("Page.stopScreencast");
await browser.close();

console.log(`[${slug}] captured ${frames.length} frames - writing to disk`);
const FRAMES_DIR = path.join(RAW_DIR, `${slug}_frames`);
await mkdir(FRAMES_DIR, { recursive: true });
await Promise.all(
  frames.map((f) =>
    writeFile(
      path.join(FRAMES_DIR, `f_${String(f.idx).padStart(5, "0")}.jpg`),
      Buffer.from(f.data, "base64"),
    ),
  ),
);

console.log(
  `[${slug}] done. Frames at ${FRAMES_DIR} (${frames.length} jpegs). ` +
    `Encode with: ./scripts/encode-hover.sh ${slug}`,
);
