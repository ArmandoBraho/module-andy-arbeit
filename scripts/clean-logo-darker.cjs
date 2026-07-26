/**
 * Clean logo alpha aggressively (checkerboard, speckles, plates)
 * and darken orange toward deep burnt target.
 */
const fs = require('fs')
const path = require('path')
const { PNG } = require('pngjs')

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(
  process.env.USERPROFILE || '',
  '.cursor/projects/c-armando-develop-AndyArbeit/assets/logo-3d-darker-clean.png',
)
const OUT = 'logo-3d-gloss-badge.png' // replace the in-use file
const TARGET = { r: 200, g: 72, b: 8 } // darker burnt orange

let BG_LOOSEN = 0

function load(p) {
  return PNG.sync.read(fs.readFileSync(p))
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: h * 360, s, l }
}

function hslToRgb(h, s, l) {
  h /= 360
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  let r
  let g
  let b
  if (s === 0) r = g = b = l
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return {
    r: Math.round(Math.min(255, Math.max(0, r * 255))),
    g: Math.round(Math.min(255, Math.max(0, g * 255))),
    b: Math.round(Math.min(255, Math.max(0, b * 255))),
  }
}

function isOrange(r, g, b) {
  const { h, s, l } = rgbToHsl(r, g, b)
  return h >= 6 && h <= 50 && s >= 0.28 && l >= 0.12 && l <= 0.82 && r > g && r > b
}

/** Mid chrome only — bright whites are chrome only via adjacency in buildProtect. */
function isChrome(r, g, b) {
  const { s, l } = rgbToHsl(r, g, b)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const spread = max - min
  // max<250 excludes pure white plate; min<185 keeps bright plate from seeding
  if (l >= 0.28 && s <= 0.28 && spread >= 8 && max < 250 && min < 185) return true
  return false
}

function isBrightSpecular(r, g, b) {
  const { s } = rgbToHsl(r, g, b)
  return Math.min(r, g, b) >= 185 && s <= 0.2
}

function isCheckerOrPlate(r, g, b, a) {
  if (a < 8) return true
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const avg = (r + g + b) / 3
  const spread = max - min
  const darkMax = 60 + BG_LOOSEN * 10
  const whiteMin = Math.max(175, 220 - BG_LOOSEN * 15)
  const greySpread = 28 + BG_LOOSEN * 8
  const greyAvgLo = Math.max(70, 100 - BG_LOOSEN * 15)
  const greyAvgHi = Math.min(250, 235 + BG_LOOSEN * 5)
  const darkAvg = 90 + BG_LOOSEN * 15
  const darkSpread = 35 + BG_LOOSEN * 10
  if (max <= darkMax) return true
  if (min >= whiteMin) return true
  if (spread <= greySpread && avg >= greyAvgLo && avg <= greyAvgHi && !isOrange(r, g, b)) return true
  if (avg <= darkAvg && spread <= darkSpread) return true
  return false
}

function buildProtect(png) {
  const { width, height, data } = png
  const seeds = new Uint8Array(width * height)

  // 1) orange
  for (let i = 0; i < width * height; i++) {
    const o = i << 2
    if (data[o + 3] < 10) continue
    if (isOrange(data[o], data[o + 1], data[o + 2])) seeds[i] = 1
  }

  // 2) mid chrome (not pure white plate)
  for (let i = 0; i < width * height; i++) {
    const o = i << 2
    if (data[o + 3] < 10) continue
    if (seeds[i]) continue
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    if (isCheckerOrPlate(r, g, b, data[o + 3])) continue
    if (isChrome(r, g, b)) seeds[i] = 1
  }

  const protect = new Uint8Array(seeds)

  // 3) bright speculars ONLY if within 2px of orange/mid-chrome seeds
  // (check seeds only — never chain through newly marked speculars)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      if (seeds[i]) continue
      const o = i << 2
      if (data[o + 3] < 10) continue
      if (!isBrightSpecular(data[o], data[o + 1], data[o + 2])) continue
      let near = false
      for (let dy = -2; dy <= 2 && !near; dy++) {
        for (let dx = -2; dx <= 2 && !near; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          if (seeds[ny * width + nx]) near = true
        }
      }
      if (near) protect[i] = 1
    }
  }

  // 4) dilate protect by 1px AFTER that
  const out = new Uint8Array(protect)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      if (!protect[i]) continue
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          out[ny * width + nx] = 1
        }
      }
    }
  }
  return out
}

function floodClear(png, protect, pred) {
  const { width, height, data } = png
  const visited = new Uint8Array(width * height)
  const q = []
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const idx = y * width + x
    if (visited[idx] || protect[idx]) return
    const o = idx << 2
    if (!pred(data[o], data[o + 1], data[o + 2], data[o + 3])) return
    visited[idx] = 1
    q.push(idx)
  }
  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    push(0, y)
    push(width - 1, y)
  }
  let n = 0
  while (q.length) {
    const idx = q.pop()
    data[(idx << 2) + 3] = 0
    n++
    const x = idx % width
    const y = (idx / width) | 0
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }
  return n
}

function clearEnclosedChecker(png, protect) {
  const { width, height, data } = png
  const visited = new Uint8Array(width * height)
  let n = 0
  const isHole = (o, idx) => {
    if (protect[idx]) return false
    if (data[o + 3] < 8) return false
    return isCheckerOrPlate(data[o], data[o + 1], data[o + 2], data[o + 3])
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x
      if (visited[start]) continue
      const so = start << 2
      if (!isHole(so, start)) {
        visited[start] = 1
        continue
      }
      const region = []
      const q = [start]
      visited[start] = 1
      let border = false
      while (q.length) {
        const idx = q.pop()
        region.push(idx)
        const cx = idx % width
        const cy = (idx / width) | 0
        if (cx === 0 || cy === 0 || cx === width - 1 || cy === height - 1) border = true
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = cx + dx
          const ny = cy + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          const nidx = ny * width + nx
          if (visited[nidx]) continue
          const no = nidx << 2
          if (!isHole(no, nidx)) {
            visited[nidx] = 1
            continue
          }
          visited[nidx] = 1
          q.push(nidx)
        }
      }
      if (!border) {
        for (const idx of region) {
          data[(idx << 2) + 3] = 0
          n++
        }
      }
    }
  }
  return n
}

function darkenOrange(png) {
  const { width, height, data } = png
  const th = rgbToHsl(TARGET.r, TARGET.g, TARGET.b)
  let n = 0
  for (let i = 0; i < width * height; i++) {
    const o = i << 2
    if (data[o + 3] < 20) continue
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    if (isChrome(r, g, b)) continue
    if (!isOrange(r, g, b)) continue
    const hsl = rgbToHsl(r, g, b)
    const newH = th.h * 0.7 + hsl.h * 0.3
    const newS = Math.min(0.95, Math.max(0.55, th.s * 0.55 + hsl.s * 0.45 + 0.05))
    const newL = Math.min(0.62, Math.max(0.16, hsl.l * 0.55 + th.l * 0.45))
    const finalL = hsl.l > 0.7 ? hsl.l * 0.85 + newL * 0.15 : newL
    const rgb = hslToRgb(newH, newS, finalL)
    data[o] = rgb.r
    data[o + 1] = rgb.g
    data[o + 2] = rgb.b
    n++
  }
  return n
}

function crumbSweep(png, protect) {
  const { width, height, data } = png
  let n = 0
  for (let i = 0; i < width * height; i++) {
    if (protect[i]) continue
    const o = i << 2
    if (data[o + 3] < 8) continue
    if (isCheckerOrPlate(data[o], data[o + 1], data[o + 2], data[o + 3])) {
      data[o + 3] = 0
      n++
    }
  }
  return n
}

function countOpaqueClasses(png) {
  const { width, height, data } = png
  let orangeOpaque = 0
  let chromeOpaque = 0
  for (let i = 0; i < width * height; i++) {
    const o = i << 2
    if (data[o + 3] < 12) continue
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    if (isOrange(r, g, b)) orangeOpaque++
    else if (isChrome(r, g, b) || isBrightSpecular(r, g, b)) chromeOpaque++
  }
  return { orangeOpaque, chromeOpaque }
}

function processOnce(srcPath) {
  const png = load(srcPath)
  let protect = buildProtect(png)

  const outer = floodClear(png, protect, (r, g, b, a) => isCheckerOrPlate(r, g, b, a))
  const holes = clearEnclosedChecker(png, protect)
  protect = buildProtect(png)
  const crumbs = crumbSweep(png, protect)
  const darkened = darkenOrange(png)

  protect = buildProtect(png)
  const crumbs2 = crumbSweep(png, protect)

  let transparent = 0
  let checkerLeft = 0
  for (let i = 0; i < png.width * png.height; i++) {
    const o = i << 2
    if (png.data[o + 3] < 12) transparent++
    else if (
      isCheckerOrPlate(png.data[o], png.data[o + 1], png.data[o + 2], png.data[o + 3]) &&
      !protect[i]
    )
      checkerLeft++
  }

  const { orangeOpaque, chromeOpaque } = countOpaqueClasses(png)
  const corners = [
    png.data[3],
    png.data[((png.width - 1) << 2) + 3],
    png.data[((png.width * (png.height - 1)) << 2) + 3],
    png.data[((png.width * png.height - 1) << 2) + 3],
  ]

  return {
    png,
    stats: {
      srcPath,
      size: `${png.width}x${png.height}`,
      BG_LOOSEN,
      outer,
      holes,
      crumbs: crumbs + crumbs2,
      darkened,
      transparent,
      transparentFraction: +(transparent / (png.width * png.height)).toFixed(4),
      checkerLeftUnprotected: checkerLeft,
      corners,
      orangeOpaque,
      chromeOpaque,
    },
  }
}

function main() {
  const srcPath = fs.existsSync(SRC)
    ? SRC
    : path.join(ROOT, 'public', 'logo-3d-gloss-badge.png')

  let result = null
  for (let loosen = 0; loosen <= 5; loosen++) {
    BG_LOOSEN = loosen
    result = processOnce(srcPath)
    const ok =
      result.stats.corners.every((a) => a === 0) && result.stats.transparentFraction > 0.55
    if (ok) break
  }

  const outPath = path.join(ROOT, 'public', OUT)
  fs.writeFileSync(outPath, PNG.sync.write(result.png))
  const alt = path.join(ROOT, 'public', 'logo-3d-darker-clean.png')
  fs.copyFileSync(outPath, alt)

  const dist = path.join(ROOT, 'dist')
  if (fs.existsSync(dist)) {
    fs.copyFileSync(outPath, path.join(dist, OUT))
    fs.copyFileSync(alt, path.join(dist, 'logo-3d-darker-clean.png'))
  }

  result.stats.outPath = outPath
  result.stats.altPath = alt
  console.log(JSON.stringify(result.stats, null, 2))
}

main()