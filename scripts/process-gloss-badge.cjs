const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const SRC = path.join(
  'C:/Users/arman/.cursor/projects/c-armando-develop-AndyArbeit/assets',
  'logo-3d-gloss-badge.png'
);
const OUT_PUBLIC = path.join('C:/armando/develop/AndyArbeit/public', 'logo-3d-gloss-badge.png');
const OUT_DIST = path.join('C:/armando/develop/AndyArbeit/dist', 'logo-3d-gloss-badge.png');

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l };
}

function idx(x, y, w) { return (y * w + x) * 4; }

const png = PNG.sync.read(fs.readFileSync(SRC));
const { width: w, height: h, data: buf } = png;
const n = w * h;

const protect = new Uint8Array(n);

// Pass 1: orange + mid silver/chrome (NOT flat near-white plate)
for (let i = 0; i < n; i++) {
  const o = i * 4;
  const r = buf[o], g = buf[o + 1], b = buf[o + 2];
  const { h: hue, s, l } = rgbToHsl(r, g, b);
  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  const spread = maxC - minC;

  const isOrange = hue >= 8 && hue <= 50 && s >= 0.3 && r > g && r > b;
  // Mid silver / metal: NOT orange, sat<=0.35, (l>=0.25 OR max>=90),
  // exclude flat near-white canvas (those are bg; speculars added in pass 2)
  const isMidChrome =
    !isOrange &&
    s <= 0.35 &&
    (l >= 0.25 || maxC >= 90) &&
    maxC >= 90 &&
    minC < 200; // mid silver, not bright-white plate

  // Bright specular with visible tint/spread (not flat #FEFEFE plate)
  const isSpecularTinted =
    !isOrange &&
    s <= 0.35 &&
    minC >= 200 &&
    spread >= 4;

  if (isOrange || isMidChrome || isSpecularTinted) protect[i] = 1;
}

// Pass 2: bright white speculars (min>=200) adjacent to protected metal/orange
// so chrome highlights stay; flat white canvas remains unprotected
{
  const add = new Uint8Array(n);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (protect[i]) continue;
      const o = i * 4;
      const r = buf[o], g = buf[o + 1], b = buf[o + 2];
      const minC = Math.min(r, g, b);
      const { h: hue, s } = rgbToHsl(r, g, b);
      const isOrange = hue >= 8 && hue <= 50 && s >= 0.3 && r > g && r > b;
      if (isOrange || s > 0.35 || minC < 200) continue;
      let near = false;
      for (let dy = -2; dy <= 2 && !near; dy++) {
        for (let dx = -2; dx <= 2 && !near; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (protect[ny * w + nx]) near = true;
        }
      }
      if (near) add[i] = 1;
    }
  }
  for (let i = 0; i < n; i++) if (add[i]) protect[i] = 1;
}

// Dilate protect by 1px only
const protectDilated = new Uint8Array(n);
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (protect[i]) { protectDilated[i] = 1; continue; }
    outer:
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (protect[ny * w + nx]) { protectDilated[i] = 1; break outer; }
      }
    }
  }
}
for (let i = 0; i < n; i++) protect[i] = protectDilated[i];

function isBgCandidate(r, g, b) {
  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  const avg = (r + g + b) / 3;
  const spread = maxC - minC;
  // User dark/charcoal criteria
  if (maxC <= 55) return true;
  if (spread <= 20 && avg >= 35 && avg <= 100) return true;
  if (spread <= 15 && avg <= 120) return true;
  // Flat near-white canvas (outer flood only — not a global delete)
  if (minC >= 200 && spread <= 12) return true;
  if (spread <= 15 && avg >= 200) return true;
  return false;
}

const cleared = new Uint8Array(n);
const queue = [];
function trySeed(x, y) {
  const i = y * w + x;
  if (protect[i] || cleared[i]) return;
  const o = i * 4;
  if (!isBgCandidate(buf[o], buf[o + 1], buf[o + 2])) return;
  cleared[i] = 1;
  queue.push(x, y);
}
for (let x = 0; x < w; x++) { trySeed(x, 0); trySeed(x, h - 1); }
for (let y = 0; y < h; y++) { trySeed(0, y); trySeed(w - 1, y); }

while (queue.length) {
  const y = queue.pop();
  const x = queue.pop();
  for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
    const ni = ny * w + nx;
    if (protect[ni] || cleared[ni]) continue;
    const o = ni * 4;
    if (!isBgCandidate(buf[o], buf[o + 1], buf[o + 2])) continue;
    cleared[ni] = 1;
    queue.push(nx, ny);
  }
}

for (let i = 0; i < n; i++) {
  if (cleared[i] && !protect[i]) buf[i * 4 + 3] = 0;
}

// Letter holes: enclosed near-black/dark-grey in upper 65%
const holeVisited = new Uint8Array(n);
const upperLimit = Math.floor(h * 0.65);

function isHolePixel(i) {
  const o = i * 4;
  const maxC = Math.max(buf[o], buf[o + 1], buf[o + 2]);
  const a = buf[o + 3];
  if (maxC > 50 && a > 0) return false;
  // unprotected or already mostly dark
  return maxC <= 50 && (!protect[i] || maxC <= 50);
}

for (let y = 0; y < upperLimit; y++) {
  for (let x = 0; x < w; x++) {
    const start = y * w + x;
    if (holeVisited[start]) continue;
    if (!isHolePixel(start)) continue;

    const region = [];
    const q = [start];
    holeVisited[start] = 1;
    let touchesImageBorder = false;

    while (q.length) {
      const i = q.pop();
      region.push(i);
      const px = i % w;
      const py = (i / w) | 0;
      if (px === 0 || py === 0 || px === w - 1 || py === h - 1) touchesImageBorder = true;
      for (const [nx, ny] of [[px - 1, py], [px + 1, py], [px, py - 1], [px, py + 1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (ny >= upperLimit) continue;
        const ni = ny * w + nx;
        if (holeVisited[ni]) continue;
        if (!isHolePixel(ni)) continue;
        holeVisited[ni] = 1;
        q.push(ni);
      }
    }

    if (!touchesImageBorder) {
      for (const i of region) {
        // clear dark hole fills; never clear bright protected chrome
        const o = i * 4;
        if (Math.max(buf[o], buf[o + 1], buf[o + 2]) <= 50) buf[o + 3] = 0;
      }
    }
  }
}

const outBuf = PNG.sync.write(png);
fs.writeFileSync(OUT_PUBLIC, outBuf);
if (fs.existsSync(path.dirname(OUT_DIST))) fs.writeFileSync(OUT_DIST, outBuf);

let transparent = 0, chromeOrSpecularOpaque = 0, orangeOpaque = 0;
for (let i = 0; i < n; i++) {
  const o = i * 4;
  const r = buf[o], g = buf[o + 1], b = buf[o + 2], a = buf[o + 3];
  if (a === 0) transparent++;
  if (Math.min(r, g, b) >= 180 && a > 200) chromeOrSpecularOpaque++;
  const { h: hue, s } = rgbToHsl(r, g, b);
  if (a > 200 && hue >= 8 && hue <= 50 && s >= 0.3 && r > g && r > b) orangeOpaque++;
}
const cornerA = (x, y) => buf[idx(x, y, w) + 3];
console.log(JSON.stringify({
  size: { width: w, height: h },
  transparentFraction: transparent / n,
  chromeOrSpecularOpaqueCount: chromeOrSpecularOpaque,
  orangeOpaqueCount: orangeOpaque,
  cornersAlpha: { tl: cornerA(0,0), tr: cornerA(w-1,0), bl: cornerA(0,h-1), br: cornerA(w-1,h-1) },
  outputBytes: outBuf.length,
  wrotePublic: OUT_PUBLIC,
  wroteDist: fs.existsSync(OUT_DIST),
}, null, 2));
