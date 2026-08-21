/**
 * 정적 이미지 자산을 생성한다. 로고의 단일 원본은 assets/logo.svg이며,
 * public 아래의 로고·파비콘·공유 카드 파생물은 저장소에 커밋한다.
 *
 *   node scripts/build-assets.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS_DIR = join(ROOT, 'assets')
const PUBLIC_DIR = join(ROOT, 'public')
const PRETENDARD_BOLD = join(
  ROOT,
  'node_modules',
  'pretendard',
  'dist',
  'public',
  'static',
  'alternative',
  'Pretendard-Bold.ttf',
)
const SCHIBSTED_GROTESK = join(
  ROOT,
  'node_modules',
  '@fontsource-variable',
  'schibsted-grotesk',
  'files',
  'schibsted-grotesk-latin-wght-normal.woff2',
)
const INSTRUMENT_SERIF = join(
  ROOT,
  'node_modules',
  '@fontsource',
  'instrument-serif',
  'files',
  'instrument-serif-latin-400-normal.woff2',
)

/** 화면에서는 SVG를 쓰지만 크롤러와 메타데이터용 PNG도 함께 제공한다. */
const LOGO_SIZE = 512
const APPLE_TOUCH_ICON_SIZE = 180
const APPLE_TOUCH_MARK_SIZE = 132

/**
 * SEMICOLON의 마크.
 *
 * 200x200 좌표계 안에 그린 세미콜론 하나. 파비콘과 공유 카드가 같은 작도를
 * 쓰도록 여기 한 곳에만 둔다. 웹폰트의 ';'를 그대로 쓰지 않는 이유는, 이 두
 * 자산이 글꼴을 내려받을 수 없는 자리(브라우저 탭, 메신저 미리보기)에
 * 놓이기 때문이다.
 */
const MARK = `
  <circle cx="100" cy="66" r="17"/>
  <circle cx="100" cy="120" r="17"/>
  <path d="M117 116 C 119 149 106 171 79 185 L 70 170 C 90 159 100 145 99 121 Z"/>
`

const SEMICOLON_BG = '#f4fafc'
const SEMICOLON_INK = '#101820'

/**
 * MAMABOY의 레터링.
 *
 * 화면에서는 src/mamaboy/components/Wordmark.tsx가 같은 작도를 그린다. 여기에
 * 한 번 더 두는 이유는 파비콘과 공유 카드가 글꼴을 내려받을 수 없는 자리(브라우저
 * 탭, 메신저 미리보기)에 놓이기 때문이다. 두 곳의 좌표는 같아야 한다 —
 * 기준선 150 · x-높이 60 · 어센더 26 · 디센더 188 · 획 두께 24.
 */
const MAMABOY_STROKE = 24
const MAMABOY_MILK = '#f7f4ee'
const MAMABOY_INK = '#191817'
const MAMABOY_PINK = '#f0b8c8'
const MAMABOY_BLUE = '#bfd8ed'

const glyph = {
  m: (x) =>
    `M ${x},150 V 88 A 28,28 0 0 1 ${x + 56},88 V 150 M ${x + 56},88 A 28,28 0 0 1 ${x + 112},88 V 150`,
  bowl: (x) => `M ${x},105 A 45,45 0 0 1 ${x + 90},105 A 45,45 0 0 1 ${x},105`,
  a: (x) => `${glyph.bowl(x)} M ${x + 90},60 V 150`,
  b: (x) => `${glyph.bowl(x)} M ${x},26 V 150`,
  y: (x) =>
    `M ${x},60 V 105 A 45,45 0 0 0 ${x + 90},105 M ${x + 90},60 V 158 A 30,30 0 0 1 ${x + 60},188`,
}

const MAMABOY_WORDMARK = [
  glyph.m(12),
  glyph.a(172),
  glyph.m(310),
  glyph.a(470),
  glyph.b(608),
  glyph.bowl(746),
  glyph.y(884),
]

const MAMABOY_WORDMARK_BOX = { width: 990, height: 214 }

/** 예시 데이터가 쓰는 추상 색면. 사진이 아니므로 인물·제품·장소를 담지 않는다. */
const PLATE_WIDTH = 1600
const PLATE_HEIGHT = 1000

/** 공유 카드 규격 */
const OG_WIDTH = 1200
const OG_HEIGHT = 630
const OG_LOGO_SIZE = 124

function addIntrinsicSize(source) {
  return source.replace('<svg ', `<svg width="${LOGO_SIZE}" height="${LOGO_SIZE}" `)
}

function addFaviconBackground(source) {
  const viewBox = source.match(/viewBox="([\d.\s-]+)"/)?.[1]

  if (!viewBox) {
    throw new Error('assets/logo.svg에 유효한 viewBox가 필요합니다.')
  }

  const [x, y, width, height] = viewBox.split(/\s+/).map(Number)
  const radius = Math.round(Math.min(width, height) * 0.22)
  const rootEnd = source.indexOf('>') + 1
  const background = `\n  <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="#000000"/>`

  return `${source.slice(0, rootEnd)}${background}${source.slice(rootEnd)}`
}

/**
 * OG 카피는 설치된 시스템 글꼴에 기대지 않고 프로젝트에 고정된 웹폰트로 래스터화한다.
 * 덕분에 macOS·Windows·CI에서 자산을 다시 만들어도 같은 브랜드 활자가 나온다.
 */
async function renderOgText({ text, font, fontfile, size, tracking = 0 }) {
  const letterSpacing = Math.round(tracking * 1024)
  const markup = `<span foreground="#f2f2ef" letter_spacing="${letterSpacing}">${text}</span>`

  return sharp({
    text: {
      text: markup,
      font: `${font} ${size}`,
      fontfile,
      dpi: 72,
      rgba: true,
    },
  })
    .png()
    .toBuffer()
}

async function buildLogo() {
  const canonical = await readFile(join(ASSETS_DIR, 'logo.svg'), 'utf8')
  const logoSvg = addIntrinsicSize(canonical)
  const faviconSvg = addFaviconBackground(canonical)

  await writeFile(join(PUBLIC_DIR, 'logo.svg'), logoSvg)
  await writeFile(join(PUBLIC_DIR, 'favicon.svg'), faviconSvg)

  const output = await sharp(Buffer.from(logoSvg), { density: 192 })
    .resize(LOGO_SIZE, LOGO_SIZE)
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer()

  await writeFile(join(PUBLIC_DIR, 'logo.png'), output)
  console.log(`logo.svg  ${Buffer.byteLength(logoSvg)} bytes (canonical derivative)`)
  console.log(`logo.png  ${LOGO_SIZE}x${LOGO_SIZE}, ${output.length} bytes`)

  const appleMark = await sharp(output)
    .resize(APPLE_TOUCH_MARK_SIZE, APPLE_TOUCH_MARK_SIZE, { fit: 'inside' })
    .png()
    .toBuffer()
  const appleTouchIcon = await sharp({
    create: {
      width: APPLE_TOUCH_ICON_SIZE,
      height: APPLE_TOUCH_ICON_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: appleMark, gravity: 'centre' }])
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer()

  await writeFile(join(PUBLIC_DIR, 'apple-touch-icon.png'), appleTouchIcon)
  console.log(`favicon.svg / apple-touch-icon.png generated from assets/logo.svg`)
  return output
}

/** 생성형 배경에는 글자나 로고를 넣지 않고, 이 단계에서 canonical 자산과 정확한 카피를 합성한다. */
async function buildOgImage(logo) {
  const background = await readFile(join(ASSETS_DIR, 'og-background-v2.webp'))
  const mark = await sharp(logo)
    .resize(OG_LOGO_SIZE, OG_LOGO_SIZE, { fit: 'inside' })
    .png()
    .toBuffer()
  const wordmark = await renderOgText({
    text: 'WELLKNEWS',
    font: 'Pretendard',
    fontfile: PRETENDARD_BOLD,
    size: 30,
    tracking: 7,
  })
  const headlineOne = await renderOgText({
    text: 'EVERY NEWS,',
    font: 'Instrument Serif',
    fontfile: INSTRUMENT_SERIF,
    size: 96,
    tracking: -2,
  })
  const headlineTwo = await renderOgText({
    text: 'WELL KNEW.',
    font: 'Instrument Serif',
    fontfile: INSTRUMENT_SERIF,
    size: 96,
    tracking: -2,
  })

  const shade = Buffer.from(`
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#000000" stop-opacity="0.54" />
          <stop offset="0.58" stop-color="#000000" stop-opacity="0.12" />
          <stop offset="1" stop-color="#000000" stop-opacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shade)" />
    </svg>
  `)

  const rule = Buffer.from(`
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <line x1="76" y1="574" x2="1124" y2="574" stroke="#f2f2ef" stroke-opacity="0.3" />
    </svg>
  `)

  const output = await sharp(background)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover' })
    .composite([
      { input: shade, left: 0, top: 0 },
      { input: mark, left: 76, top: 72 },
      { input: wordmark, left: 234, top: 128 },
      { input: headlineOne, left: 76, top: 344 },
      { input: headlineTwo, left: 76, top: 442 },
      { input: rule, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer()

  await writeFile(join(PUBLIC_DIR, 'og.png'), output)
  console.log(`og.png    ${OG_WIDTH}x${OG_HEIGHT}, ${output.length} bytes`)
}

/**
 * 브라우저 탭에 걸리는 아이콘. 16px에서도 두 점이 붙어 보이지 않아야 한다.
 */
async function buildSemicolonFavicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="${SEMICOLON_BG}"/>
  <g fill="${SEMICOLON_INK}">${MARK}</g>
</svg>
`

  await writeFile(join(PUBLIC_DIR, 'semicolon.svg'), svg)
  console.log(`semicolon.svg  ${svg.length} bytes`)
}

/** iOS 홈 화면에 걸릴 때 쓰는 아이콘. 규격이 180px 고정이다. */
async function buildSemicolonTouchIcon() {
  const size = 180

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="${SEMICOLON_BG}"/>
  <g fill="${SEMICOLON_INK}">${MARK}</g>
</svg>
`

  const output = await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer()

  await writeFile(join(PUBLIC_DIR, 'semicolon-touch.png'), output)
  console.log(`semicolon-touch.png  ${size}x${size}, ${output.length} bytes`)
}

/** 메신저 카드에도 홈의 '삽입된 구간' 이미지와 canonical 마크를 그대로 쓴다. */
async function buildSemicolonOgImage() {
  const background = await readFile(join(PUBLIC_DIR, 'media', 'semicolon-interval-cool.webp'))
  const mark =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 200 200">
  <g fill="${SEMICOLON_INK}">${MARK}</g>
</svg>`)
  const wash =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${SEMICOLON_BG}" stop-opacity="0.96" />
      <stop offset="0.28" stop-color="${SEMICOLON_BG}" stop-opacity="0.72" />
      <stop offset="0.62" stop-color="${SEMICOLON_BG}" stop-opacity="0.08" />
      <stop offset="1" stop-color="${SEMICOLON_BG}" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#wash)" />
</svg>`)

  const output = await sharp(background)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover' })
    .composite([
      { input: wash, left: 0, top: 0 },
      { input: mark, left: 76, top: 72 },
    ])
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer()

  await writeFile(join(PUBLIC_DIR, 'semicolon-og-cool.png'), output)
  console.log(`semicolon-og-cool.png  ${OG_WIDTH}x${OG_HEIGHT}, ${output.length} bytes`)
}

function mamaboyPaths(color = MAMABOY_INK) {
  return `<g fill="none" stroke="${color}" stroke-width="${MAMABOY_STROKE}" stroke-linecap="round" stroke-linejoin="round">${MAMABOY_WORDMARK.map(
    (d) => `<path d="${d}"/>`,
  ).join('')}</g>`
}

/**
 * 브라우저 탭에 걸리는 아이콘.
 *
 * 레터링 전체를 넣으면 16px에서 글자가 뭉개진다. 첫 글자 하나만 쓴다 —
 * 아치 두 개의 리듬이 이 브랜드에서 가장 먼저 알아보게 되는 형태다.
 * viewBox를 글자의 잉크에 맞춰 잘라서 여백을 사방으로 같게 만든다.
 */
function mamaboyMarkSvg(size) {
  const box = { x: -32, y: 17, size: 176 }
  const dimensions = size ? ` width="${size}" height="${size}"` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg"${dimensions} viewBox="${box.x} ${box.y} ${box.size} ${box.size}">
  <rect x="${box.x}" y="${box.y}" width="${box.size}" height="${box.size}" rx="40" fill="${MAMABOY_MILK}"/>
  <g fill="none" stroke="${MAMABOY_INK}" stroke-width="${MAMABOY_STROKE}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${glyph.m(0)}"/>
  </g>
</svg>
`
}

async function buildMamaboyFavicon() {
  const svg = mamaboyMarkSvg()

  await writeFile(join(PUBLIC_DIR, 'mamaboy.svg'), svg)
  console.log(`mamaboy.svg  ${svg.length} bytes`)
}

/** iOS 홈 화면에 걸릴 때 쓰는 아이콘. 규격이 180px 고정이다. */
async function buildMamaboyTouchIcon() {
  const size = 180
  const output = await sharp(Buffer.from(mamaboyMarkSvg(size)), { density: 288 })
    .resize(size, size)
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer()

  await writeFile(join(PUBLIC_DIR, 'mamaboy-touch.png'), output)
  console.log(`mamaboy-touch.png  ${size}x${size}, ${output.length} bytes`)
}

/**
 * 젤·코팅면의 표면감(§22).
 *
 * 무엇을 찍은 사진이 아니라 브랜드의 색면이다. 예시 데이터의 대표 이미지로만
 * 쓰이고, 실제 RSS가 붙으면 각 매체의 이미지가 그 자리를 가져간다.
 */
function plateSvg({ pink, blue, highlight }) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${PLATE_WIDTH}" height="${PLATE_HEIGHT}" viewBox="0 0 ${PLATE_WIDTH} ${PLATE_HEIGHT}">
  <defs>
    <radialGradient id="pink" cx="${pink.x}" cy="${pink.y}" r="${pink.r}">
      <stop offset="0" stop-color="${MAMABOY_PINK}" stop-opacity="${pink.alpha}"/>
      <stop offset="1" stop-color="${MAMABOY_PINK}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blue" cx="${blue.x}" cy="${blue.y}" r="${blue.r}">
      <stop offset="0" stop-color="${MAMABOY_BLUE}" stop-opacity="${blue.alpha}"/>
      <stop offset="1" stop-color="${MAMABOY_BLUE}" stop-opacity="0"/>
    </radialGradient>
    <!-- 반사광은 도형이 아니라 빛이다. 가장자리가 보이는 순간 광택이 아니라
         무늬가 되므로, 경계에서 완전히 투명해지는 방사형으로만 만든다. -->
    <radialGradient id="gloss">
      <stop offset="0" stop-color="#ffffff" stop-opacity="${highlight}"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="${(highlight * 0.42).toFixed(3)}"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="${MAMABOY_MILK}"/>
  <rect width="100%" height="100%" fill="url(#pink)"/>
  <rect width="100%" height="100%" fill="url(#blue)"/>
  <ellipse cx="${PLATE_WIDTH * 0.42}" cy="${PLATE_HEIGHT * 0.3}" rx="${PLATE_WIDTH * 0.62}" ry="${PLATE_HEIGHT * 0.34}" fill="url(#gloss)" transform="rotate(-14 ${PLATE_WIDTH * 0.42} ${PLATE_HEIGHT * 0.3})"/>
</svg>`)
}

const PLATES = [
  {
    pink: { x: '22%', y: '24%', r: '68%', alpha: 0.95 },
    blue: { x: '86%', y: '84%', r: '58%', alpha: 0.5 },
    highlight: 0.8,
  },
  {
    pink: { x: '88%', y: '18%', r: '52%', alpha: 0.5 },
    blue: { x: '18%', y: '72%', r: '72%', alpha: 0.95 },
    highlight: 0.72,
  },
  {
    pink: { x: '10%', y: '88%', r: '62%', alpha: 0.8 },
    blue: { x: '72%', y: '12%', r: '66%', alpha: 0.8 },
    highlight: 0.86,
  },
  {
    pink: { x: '52%', y: '108%', r: '58%', alpha: 0.9 },
    blue: { x: '50%', y: '-14%', r: '48%', alpha: 0.42 },
    highlight: 0.64,
  },
]

async function buildMamaboyPlates() {
  await mkdir(join(PUBLIC_DIR, 'mamaboy'), { recursive: true })

  for (const [index, plate] of PLATES.entries()) {
    const output = await sharp(plateSvg(plate), { density: 96 })
      .webp({ quality: 78, effort: 6 })
      .toBuffer()

    await writeFile(join(PUBLIC_DIR, 'mamaboy', `plate-${index + 1}.webp`), output)
    console.log(
      `mamaboy/plate-${index + 1}.webp  ${PLATE_WIDTH}x${PLATE_HEIGHT}, ${output.length} bytes`,
    )
  }
}

/**
 * 공유 카드.
 *
 * 배경으로 쓸 생성 이미지를 두지 않는다. 이 브랜드의 표면은 색면과 반사광이고,
 * 그것은 여기서 그대로 합성할 수 있다. 글자는 레터링(경로)과 라틴 한 줄뿐이라
 * 운영체제의 대체 글꼴에 영향받지 않는다.
 */
async function buildMamaboyOgImage() {
  const background = plateSvg({
    pink: { x: '16%', y: '18%', r: '66%', alpha: 0.85 },
    blue: { x: '88%', y: '86%', r: '62%', alpha: 0.7 },
    highlight: 0.78,
  })

  const wordmarkWidth = 620
  const wordmarkHeight = Math.round(
    (wordmarkWidth / MAMABOY_WORDMARK_BOX.width) * MAMABOY_WORDMARK_BOX.height,
  )
  const wordmark = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${wordmarkWidth}" height="${wordmarkHeight}" viewBox="0 0 ${MAMABOY_WORDMARK_BOX.width} ${MAMABOY_WORDMARK_BOX.height}">${mamaboyPaths()}</svg>`,
  )

  const formula = await sharp({
    text: {
      text: `<span foreground="${MAMABOY_INK}" letter_spacing="${Math.round(0.16 * 1024)}">CARE + CURIOSITY</span>`,
      font: 'Schibsted Grotesk 26',
      fontfile: SCHIBSTED_GROTESK,
      dpi: 72,
      rgba: true,
    },
  })
    .png()
    .toBuffer()

  const output = await sharp(background, { density: 96 })
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover' })
    .composite([
      { input: wordmark, left: 96, top: 236 },
      { input: formula, left: 100, top: 400 },
    ])
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer()

  await writeFile(join(PUBLIC_DIR, 'mamaboy-og.png'), output)
  console.log(`mamaboy-og.png  ${OG_WIDTH}x${OG_HEIGHT}, ${output.length} bytes`)
}

const logo = await buildLogo()
await buildOgImage(logo)
await buildSemicolonFavicon()
await buildSemicolonTouchIcon()
await buildSemicolonOgImage()
await buildMamaboyFavicon()
await buildMamaboyTouchIcon()
await buildMamaboyPlates()
await buildMamaboyOgImage()
