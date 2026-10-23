// Render del reel con Playwright + ffmpeg.
//   node reel/render.mjs beats   → un cuadro por pulso en reel/salida/pulsos/ (para revisar)
//   node reel/render.mjs full    → reel/salida/bandonear-reel.mp4 (60 fps, desenfoque por subcuadros, audio)
// Necesita playwright-core (npm i playwright-core) y ffmpeg. Usa el Chrome del sistema.
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(process.env.PLAYWRIGHT_DIR ? join(process.env.PLAYWRIGHT_DIR, 'x.js') : import.meta.url);
const { chromium } = require('playwright-core');
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'salida');
const FPS = 60, SUB = 3, DUR = 15;
const mode = process.argv[2] || 'beats';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome-stable', args: ['--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(HERE, 'index.html')).href + '?render');
await page.evaluate(() => window.ready);
const shot = async (t, type = 'png') => { await page.evaluate((tt) => window.seek(tt), t); return page.screenshot({ type, quality: type === 'jpeg' ? 95 : undefined }); };

if (mode === 'beats') {
  const dir = join(OUT, 'pulsos');
  mkdirSync(dir, { recursive: true });
  // Un cuadro por pulso, a mitad del movimiento de entrada (+0,2 s), más el primero y el último
  const times = [...Array.from({ length: 30 }, (_, b) => b * 0.5 + 0.2), 0, 14.99];
  for (const [i, t] of times.entries()) writeFileSync(join(dir, `p${String(i).padStart(2, '0')}_${t.toFixed(2)}.png`), await shot(t));
  console.log('Pulsos en', dir);
} else {
  // Audio
  const b64 = await page.evaluate(() => window.renderAudio());
  const wav = join(OUT, 'banda.wav');
  writeFileSync(wav, Buffer.from(b64, 'base64'));
  // Video: 180 subcuadros por segundo → tmix de 3 → 60 fps
  const silent = join(OUT, 'video-sin-audio.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS * SUB), '-i', '-',
    '-vf', `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/(${FPS}*TB)`, '-r', String(FPS),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = FPS * DUR * SUB;
  for (let i = 0; i < total; i++) {
    const t = i / (FPS * SUB);
    const buf = await shot(t, 'jpeg');
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 180 === 0) console.log(`  ${Math.round((i / total) * 100)} %  (t = ${t.toFixed(2)} s)`);
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on('close', (c) => (c ? j(new Error('ffmpeg ' + c)) : r())));
  const final = join(OUT, 'bandonear-reel.mp4');
  await new Promise((r, j) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', final], { stdio: 'inherit' })
    .on('close', (c) => (c ? j(new Error('mux ' + c)) : r())));
  console.log('Listo:', final);
}
await browser.close();
