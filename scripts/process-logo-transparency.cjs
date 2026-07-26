const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const SOURCE = path.join(__dirname, '..', 'src', 'tmp', 'logoAndyVonLogoDesign.png');
const ROOT = path.join(__dirname, '..');
const RAW_COPY = path.join(ROOT, 'public', 'logo-from-design.png');
const DESTINATIONS = [
  path.join(ROOT, 'public', 'logo.png'),
  path.join(ROOT, 'public', 'logo-transparent.png'),
];

const NEAR_BLACK_MAX = 30; // RGB all <= 30
const COLOR_TOL = 25;

function idx(x, y, w) {
  return (y * w + x) << 2;
}

function getRGB(data, i) {
  return [data[i], data[i + 1], data[i + 2]];
}

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function chroma(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function isOrange(r, g, b) {
  return r > g + 20 && r > b + 20 && r >= 80;
}

function isChrome(r, g, b) {
  const L = luminance(r, g, b);
  const spread = chroma(r, g, b);
  // Silver/chrome: mid-to-high luminance, some channel spread, not orange
  return L > 90 && spread >= 8 && !isOrange(r, g, b);
}

function isNearBlack(r, g, b) {
  return r <= NEAR_BLACK_MAX && g <= NEAR_BLACK_MAX && b <= NEAR_BLACK_MAX;
}

function isLogoInk(r, g, b) {
  return isOrange(r, g, b) || isChrome(r, g, b);
}

function colorDist(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function collectCornerAndBorderSeeds(w, h, step) {
  const seeds = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
  ];
  for (let x = 0; x < w; x += step) {
    seeds.push([x, 0], [x, h - 1]);
  }
  for (let y = 0; y < h; y += step) {
    seeds.push([0, y], [w - 1, y]);
  }
  return seeds;
}

function floodFromSeeds(png, seeds, canVisit) {
  const { width: w, height: h, data } = png;
  const visited = new Uint8Array(w * h);
  const stack = [];

  for (const [sx, sy] of seeds) {
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
    const si = sy * w + sx;
    if (visited[si]) continue;
    const pi = si << 2;
    if (data[pi + 3] === 0) continue;
    const [sr, sg, sb] = getRGB(data, pi);
    if (!canVisit(sx, sy, sr, sg, sb)) continue;
    stack.push([sx, sy, sr, sg, sb]);
    visited[si] = 1;
  }

  let punched = 0;
  while (stack.length) {
    const [x, y, sr, sg, sb] = stack.pop();
    const pi = idx(x, y, w);
    data[pi + 3] = 0;
    punched++;

    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (visited[ni]) continue;
      const pni = ni << 2;
      if (data[pni + 3] === 0) {
        visited[ni] = 1;
        continue;
      }
      const [nr, ng, nb] = getRGB(data, pni);
      if (!canVisit(nx, ny, nr, ng, nb)) continue;
      if (colorDist(nr, ng, nb, sr, sg, sb) > COLOR_TOL) continue;
      visited[ni] = 1;
      stack.push([nx, ny, nr, ng, nb]);
    }
  }
  return punched;
}

/** Enclosed near-black regions in upper part (letter holes). */
function punchEnclosedHoles(png) {
  const { width: w, height: h, data } = png;
  const upperLimit = Math.floor(h * 0.6);
  const visited = new Uint8Array(w * h);
  let punched = 0;

  function expandable(r, g, b) {
    if (isLogoInk(r, g, b)) return false;
    return isNearBlack(r, g, b);
  }

  for (let y = 0; y < upperLimit; y++) {
    for (let x = 0; x < w; x++) {
      const si = y * w + x;
      if (visited[si]) continue;
      const pi = si << 2;
      if (data[pi + 3] === 0) {
        visited[si] = 1;
        continue;
      }
      const [r0, g0, b0] = getRGB(data, pi);
      if (!expandable(r0, g0, b0)) continue;

      const queue = [[x, y]];
      visited[si] = 1;
      const component = [];
      let touchesBorder = false;

      while (queue.length) {
        const [cx, cy] = queue.pop();
        component.push([cx, cy]);
        if (cx === 0 || cy === 0 || cx === w - 1 || cy === h - 1) touchesBorder = true;

        for (const [nx, ny] of [
          [cx - 1, cy],
          [cx + 1, cy],
          [cx, cy - 1],
          [cx, cy + 1],
        ]) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) {
            touchesBorder = true;
            continue;
          }
          const ni = ny * w + nx;
          if (visited[ni]) continue;
          const pni = ni << 2;
          if (data[pni + 3] === 0) {
            visited[ni] = 1;
            continue;
          }
          const [nr, ng, nb] = getRGB(data, pni);
          if (!expandable(nr, ng, nb)) continue;
          visited[ni] = 1;
          queue.push([nx, ny]);
        }
      }

      if (!touchesBorder && component.length > 0) {
        for (const [cx, cy] of component) {
          data[idx(cx, cy, w) + 3] = 0;
          punched++;
        }
      }
    }
  }
  return punched;
}

function processLogo(png) {
  const { width: w, height: h, data } = png;
  const step = Math.max(1, Math.floor(Math.min(w, h) / 40));
  const borderSeeds = collectCornerAndBorderSeeds(w, h, step);

  const outerPunched = floodFromSeeds(png, borderSeeds, (x, y, r, g, b) => {
    if (isLogoInk(r, g, b)) return false;
    return isNearBlack(r, g, b);
  });

  const enclosedPunched = punchEnclosedHoles(png);
  return { outerPunched, enclosedPunched };
}

function countTransparent(png) {
  const { width: w, height: h, data } = png;
  let t = 0;
  const total = w * h;
  for (let i = 0; i < total; i++) {
    if (data[(i << 2) + 3] === 0) t++;
  }
  return { transparent: t, total, fraction: t / total };
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('Source missing:', SOURCE);
    process.exit(1);
  }
  console.log('Source:', SOURCE);

  const rawBuf = fs.readFileSync(SOURCE);
  fs.mkdirSync(path.dirname(RAW_COPY), { recursive: true });
  fs.writeFileSync(RAW_COPY, rawBuf);
  console.log('Raw copy:', RAW_COPY, '(' + rawBuf.length + ' bytes)');

  const png = PNG.sync.read(rawBuf);
  console.log('Loaded RGBA: ' + png.width + 'x' + png.height);

  const before = countTransparent(png);
  console.log(
    'Before transparent: ' +
      before.transparent +
      '/' +
      before.total +
      ' (' +
      (before.fraction * 100).toFixed(2) +
      '%)'
  );

  const stats = processLogo(png);
  const after = countTransparent(png);

  const outBuf = PNG.sync.write(png);
  const dests = [...DESTINATIONS];
  const distDir = path.join(ROOT, 'dist');
  if (fs.existsSync(distDir)) {
    dests.push(path.join(distDir, 'logo.png'), path.join(distDir, 'logo-transparent.png'));
  }

  for (const dest of dests) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, outBuf);
    console.log('Wrote:', dest, '(' + outBuf.length + ' bytes)');
  }

  console.log('--- STATS ---');
  console.log(
    JSON.stringify(
      {
        width: png.width,
        height: png.height,
        outerPunched: stats.outerPunched,
        enclosedPunched: stats.enclosedPunched,
        transparentPixels: after.transparent,
        totalPixels: after.total,
        transparentFraction: Number(after.fraction.toFixed(6)),
        transparentPercent: Number((after.fraction * 100).toFixed(2)),
        outputBytes: outBuf.length,
      },
      null,
      2
    )
  );
}

main();
