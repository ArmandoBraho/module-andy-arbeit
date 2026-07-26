/**
 * Build brand logo from official design file:
 * - true alpha (no baked checkerboard / black plate)
 * - recolor orange faces + wordmark toward reference AA sample
 * - keep chrome/silver bevels
 */
const fs = require('fs')
const path = require('path')
const { PNG } = require('pngjs')

const ROOT = path.resolve(__dirname, '..')
const DESIGN = path.join(ROOT, 'src/tmp/logoAndyVonLogoDesign.png')
const REF = path.join(
  process.env.USERPROFILE || '',
  '.cursor/projects/c-armando-develop-AndyArbeit/assets',
  'image-a6310769-af98-4689-b22a-9362bf7bda3b.png',
)
const OUT_NAME = 'logo-andyarbeit-brand.png'

function loadPng(filePath) {
  const buf = fs.readFileSync(filePath)
  return PNG.sync.read(buf)
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
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6
      break
    case g:
      h = ((b - r) / d + 2) / 6
      break
    default:
      h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s, l }
}

function hslToRgb(h, s, l) {
  h /= 360
  let r
  let g
  let b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
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
  // Orange / amber hue band, enough chroma, not chrome highlight
  return h >= 8 && h <= 48 && s >= 0.35 && l >= 0.18 && l <= 0.78 && r > g && r > b
}

function isChromeLike(r, g, b) {
  const { s, l } = rgbToHsl(r, g, b)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const avg = (r + g + b) / 3
  const spread = max - min
  // Darker metals + classic chrome bevels
  if (l >= 0.18 && s <= 0.25 && spread >= 8) return true
  // Flat / soft metal greys (not pure black)
  if (avg >= 50 && avg <= 230 && spread <= 40 && s <= 0.2 && max > 25) return true
  return false
}

/** Outer flood / crumbs: near black/white or flat grey; never mid greys that could be metal. */
function isClearableBackground(r, g, b, a, protectedPixel) {
  if (protectedPixel) return false
  if (a < 12) return true
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const avg = (r + g + b) / 3
  const spread = max - min
  const loose =
    max <= 28 || min >= 240 || (spread <= 12 && avg <= 210)
  if (!loose) return false
  // Stricter: only near-black, near-white, or very dark flat grey
  return max <= 35 || min >= 245 || (spread <= 10 && avg < 90)
}

/**
 * Letter counters (holes inside A's): near-pure black only.
 * Ignores protect mask — chrome dilation covers counters, but black ≠ chrome.
 * Skips grey metal (avg > 40).
 */
function isBlackCounterPixel(r, g, b, a) {
  if (a < 12) return false
  const max = Math.max(r, g, b)
  const avg = (r + g + b) / 3
  if (max > 32) return false
  if (avg > 40) return false
  return true
}

function buildProtectMask(png) {
  const { width, height, data } = png
  const seed = new Uint8Array(width * height)
  for (let i = 0; i < width * height; i++) {
    const o = i << 2
    if (data[o + 3] < 12) continue
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    if (isOrange(r, g, b) || isChromeLike(r, g, b)) seed[i] = 1
  }
  // Dilate by 2px Chebyshev so bevel edges next to orange stay
  const protect = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      if (!seed[idx]) continue
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          protect[ny * width + nx] = 1
        }
      }
    }
  }
  return protect
}

function sampleTargetOrange(refPng) {
  const { width, height, data } = refPng
  let sumR = 0
  let sumG = 0
  let sumB = 0
  let n = 0
  // Sample central region where orange fill lives
  const x0 = Math.floor(width * 0.25)
  const x1 = Math.floor(width * 0.75)
  const y0 = Math.floor(height * 0.25)
  const y1 = Math.floor(height * 0.75)
  for (let y = y0; y < y1; y += 2) {
    for (let x = x0; x < x1; x += 2) {
      const i = (width * y + x) << 2
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      if (!isOrange(r, g, b) || isChromeLike(r, g, b)) continue
      // Prefer mid-bright orange (skip deep shadows and pure white speculars)
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
      if (lum < 0.35 || lum > 0.7) continue
      sumR += r
      sumG += g
      sumB += b
      n++
    }
  }
  if (n < 50) {
    // Fallback: known vibrant gloss orange from reference description
    return { r: 239, g: 90, b: 0 }
  }
  const avg = {
    r: sumR / n,
    g: sumG / n,
    b: sumB / n,
  }
  // Blend 40% toward vivid gloss orange so target stays bright
  const vivid = { r: 235, g: 95, b: 10 }
  return {
    r: Math.round(avg.r * 0.6 + vivid.r * 0.4),
    g: Math.round(avg.g * 0.6 + vivid.g * 0.4),
    b: Math.round(avg.b * 0.6 + vivid.b * 0.4),
  }
}

function floodTransparent(png, predicate) {
  const { width, height, data } = png
  const visited = new Uint8Array(width * height)
  const queue = []

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const idx = y * width + x
    if (visited[idx]) return
    const i = idx << 2
    if (!predicate(data[i], data[i + 1], data[i + 2], data[i + 3], x, y)) return
    visited[idx] = 1
    queue.push(idx)
  }

  // Seeds: full border
  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    push(0, y)
    push(width - 1, y)
  }

  let punched = 0
  while (queue.length) {
    const idx = queue.pop()
    const i = idx << 2
    data[i + 3] = 0
    punched++
    const x = idx % width
    const y = (idx / width) | 0
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }
  return punched
}

/**
 * Punch enclosed near-black letter counters to alpha=0.
 * Runs AFTER protect-aware clearing; ignores protect (black counters are not chrome).
 */
function punchEnclosedBackground(png) {
  const { width, height, data } = png
  const visited = new Uint8Array(width * height)
  let punched = 0

  const isBg = (idx) => {
    const i = idx << 2
    return isBlackCounterPixel(data[i], data[i + 1], data[i + 2], data[i + 3])
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x
      if (visited[start]) continue
      if (!isBg(start)) {
        visited[start] = 1
        continue
      }

      // Flood this region; if it never touches border, it's a hole -> clear
      const region = []
      const q = [start]
      visited[start] = 1
      let touchesBorder = false

      while (q.length) {
        const idx = q.pop()
        region.push(idx)
        const cx = idx % width
        const cy = (idx / width) | 0
        if (cx === 0 || cy === 0 || cx === width - 1 || cy === height - 1) {
          touchesBorder = true
        }
        const neighbors = [idx + 1, idx - 1, idx + width, idx - width]
        for (const n of neighbors) {
          if (n < 0 || n >= width * height) continue
          if (visited[n]) continue
          const nx = n % width
          const ny = (n / width) | 0
          if (Math.abs(nx - cx) + Math.abs(ny - cy) !== 1) continue
          if (!isBg(n)) {
            visited[n] = 1
            continue
          }
          visited[n] = 1
          q.push(n)
        }
      }

      if (!touchesBorder) {
        for (const idx of region) {
          data[(idx << 2) + 3] = 0
          punched++
        }
      }
    }
  }
  return punched
}

function recolorOranges(png, target) {
  const { width, height, data } = png
  const targetHsl = rgbToHsl(target.r, target.g, target.b)
  let changed = 0

  for (let i = 0; i < width * height; i++) {
    const o = i << 2
    const a = data[o + 3]
    if (a < 20) continue
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    if (isChromeLike(r, g, b)) continue
    if (!isOrange(r, g, b)) continue

    const hsl = rgbToHsl(r, g, b)
    // Pull hue/sat toward reference; keep relative lightness for gloss
    const newH = targetHsl.h * 0.75 + hsl.h * 0.25
    const newS = Math.min(0.95, Math.max(0.55, targetHsl.s * 0.65 + hsl.s * 0.35 + 0.08))
    // Map lightness slightly toward richer reference while keeping highlights
    const newL = Math.min(0.72, Math.max(0.22, hsl.l * 0.7 + targetHsl.l * 0.3))
    const rgb = hslToRgb(newH, newS, newL)
    data[o] = rgb.r
    data[o + 1] = rgb.g
    data[o + 2] = rgb.b
    changed++
  }
  return changed
}

function countTransparent(png) {
  const { width, height, data } = png
  let t = 0
  for (let i = 0; i < width * height; i++) {
    if (data[(i << 2) + 3] < 12) t++
  }
  return t
}

function countChromeOpaque(png) {
  const { width, height, data } = png
  let n = 0
  for (let i = 0; i < width * height; i++) {
    const o = i << 2
    if (data[o + 3] < 12) continue
    if (isChromeLike(data[o], data[o + 1], data[o + 2])) n++
  }
  return n
}

function cornerAlphas(png) {
  const { width, height, data } = png
  const at = (x, y) => data[((y * width + x) << 2) + 3]
  return {
    tl: at(0, 0),
    tr: at(width - 1, 0),
    bl: at(0, height - 1),
    br: at(width - 1, height - 1),
  }
}

function sampleLeftACounter(png) {
  // Counter interior (bbox center); 0.35/0.28 lands on orange face of this asset
  const x = Math.floor(png.width * 0.377)
  const y = Math.floor(png.height * 0.281)
  const o = (y * png.width + x) << 2
  const userX = Math.floor(png.width * 0.35)
  const userY = Math.floor(png.height * 0.28)
  const uo = (userY * png.width + userX) << 2
  return {
    x,
    y,
    rgba: [png.data[o], png.data[o + 1], png.data[o + 2], png.data[o + 3]],
    nearUserHint: {
      x: userX,
      y: userY,
      rgba: [png.data[uo], png.data[uo + 1], png.data[uo + 2], png.data[uo + 3]],
      note: '0.35,0.28 is on orange A face for this logo',
    },
  }
}

function main() {
  if (!fs.existsSync(DESIGN)) {
    throw new Error(`Missing design logo: ${DESIGN}`)
  }
  if (!fs.existsSync(REF)) {
    console.warn('Reference AA not found, using fallback orange #EF5A00')
  }

  const png = loadPng(DESIGN)
  const ref = fs.existsSync(REF) ? loadPng(REF) : null
  const target = ref ? sampleTargetOrange(ref) : { r: 239, g: 90, b: 0 }
  console.log('Target orange RGB:', target)

  // Ensure alpha channel usable
  for (let i = 0; i < png.width * png.height; i++) {
    const o = i << 2
    if (png.data[o + 3] === undefined) png.data[o + 3] = 255
  }

  // Protect orange + chrome (dilated) BEFORE any flood/punch
  const protect = buildProtectMask(png)

  const outer = floodTransparent(png, (r, g, b, a, x, y) => {
    const idx = y * png.width + x
    return isClearableBackground(r, g, b, a, protect[idx])
  })
  // After protect-aware outer clear: punch black letter counters even if protected
  const holes = punchEnclosedBackground(png)
  const recolored = recolorOranges(png, target)

  // Second pass: clear leftover flat grey/black crumbs (never protected)
  let crumbs = 0
  for (let i = 0; i < png.width * png.height; i++) {
    const o = i << 2
    if (png.data[o + 3] < 12) continue
    if (protect[i]) continue
    const r = png.data[o]
    const g = png.data[o + 1]
    const b = png.data[o + 2]
    if (isClearableBackground(r, g, b, png.data[o + 3], false)) {
      png.data[o + 3] = 0
      crumbs++
    }
  }

  const transparent = countTransparent(png)
  const total = png.width * png.height
  const chromeOpaqueCount = countChromeOpaque(png)
  const corners = cornerAlphas(png)
  const leftACounter = sampleLeftACounter(png)
  const outPath = path.join(ROOT, 'public', OUT_NAME)
  fs.writeFileSync(outPath, PNG.sync.write(png))

  const distDir = path.join(ROOT, 'dist')
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(outPath, path.join(distDir, OUT_NAME))
  }

  console.log(
    JSON.stringify(
      {
        outPath,
        size: `${png.width}x${png.height}`,
        targetOrange: target,
        outer,
        holes,
        crumbs,
        recolored,
        transparent,
        transparentFraction: +(transparent / total).toFixed(4),
        chromeOpaqueCount,
        corners,
        leftACounter,
      },
      null,
      2,
    ),
  )
}

main()
