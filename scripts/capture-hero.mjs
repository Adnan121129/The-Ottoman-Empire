#!/usr/bin/env node
/**
 * Pre-renders the hero's 3D Constantinople scene into a seamless looping
 * background video (WebM + MP4) plus a poster, used on low-power devices,
 * without WebGL, or with reduced motion.
 *
 * Requirements: a running dev or preview server, Playwright and ffmpeg.
 *   npm i -D playwright && npx playwright install chromium
 *   npm run dev            # in another terminal
 *   node scripts/capture-hero.mjs [baseUrl]
 *
 * The scene supports a capture mode (`/?capture`): time is driven by
 * `window.__CAPTURE_T`, so every frame is deterministic regardless of speed.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const FPS = 24;
const SECONDS = 10;
const FADE = 1; // seconds of crossfade that make the loop seamless
const W = 1280;
const H = 720;
const OUT = join(process.cwd(), 'public', 'videos');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const frames = mkdtempSync(join(tmpdir(), 'hero-frames-'));
const total = (SECONDS + FADE) * FPS;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.addInitScript(() => {
  window.__CAPTURE_T = 60;
});
await page.goto(`${BASE}/?capture`, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: 'header, footer, nextjs-portal{display:none !important}' });
await page.waitForSelector('canvas');
await page.waitForTimeout(8000); // let the camera rig settle
for (let i = 0; i < total; i++) {
  await page.evaluate((t) => (window.__CAPTURE_T = t), 60 + i / FPS);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.screenshot({ path: join(frames, `f${String(i).padStart(4, '0')}.png`), clip: { x: 0, y: 0, width: W, height: H } });
  if (i % 48 === 0) console.log(`frame ${i}/${total}`);
}
await browser.close();

// The last FADE seconds cross-fade into the first ones, so frame N-1 flows into frame 0.
const n = SECONDS * FPS;
const loop = `[0]split[x][y];[x]trim=start_frame=${n}:end_frame=${total},setpts=PTS-STARTPTS[tail];[y]trim=start_frame=0:end_frame=${n},setpts=PTS-STARTPTS[head];[tail][head]xfade=transition=fade:duration=${FADE}:offset=0,format=yuv420p[v]`;
const input = ['-y', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'), '-filter_complex', loop, '-map', '[v]', '-an'];
mkdirSync(OUT, { recursive: true });
execFileSync('ffmpeg', [...input, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '40', '-row-mt', '1', '-deadline', 'good', join(OUT, 'hero.webm')], { stdio: 'inherit' });
execFileSync('ffmpeg', [...input, '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-movflags', '+faststart', join(OUT, 'hero.mp4')], { stdio: 'inherit' });
execFileSync('ffmpeg', ['-y', '-i', join(OUT, 'hero.mp4'), '-frames:v', '1', '-q:v', '4', join(OUT, 'hero-poster.jpg')], { stdio: 'inherit' });
rmSync(frames, { recursive: true, force: true });
console.log(`Wrote hero.webm, hero.mp4 and hero-poster.jpg to ${OUT}`);
