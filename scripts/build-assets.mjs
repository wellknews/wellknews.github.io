/**
 * 정적 이미지 자산을 생성한다. 로고의 단일 원본은 assets/logo.svg이며,
 * public 아래의 로고·파비콘·공유 카드 파생물은 저장소에 커밋한다.
 *
 *   node scripts/build-assets.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS_DIR = join(ROOT, 'assets')
const PUBLIC_DIR = join(ROOT, 'public')

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

const SEMICOLON_BG = '#fafaf8'
const SEMICOLON_INK = '#111111'

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
  const background = await readFile(join(ASSETS_DIR, 'og-background.webp'))
  const mark = await sharp(logo)
    .resize(OG_LOGO_SIZE, OG_LOGO_SIZE, { fit: 'inside' })
    .png()
    .toBuffer()

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

  const copy = Buffer.from(`
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <text x="234" y="151" fill="#f2f2ef" font-family="Arial, sans-serif" font-size="30"
        font-weight="700" letter-spacing="7">WELLKNEWS</text>
      <text x="76" y="430" fill="#f2f2ef" font-family="Georgia, serif" font-size="88"
        letter-spacing="-3">EVERY NEWS,</text>
      <text x="76" y="522" fill="#f2f2ef" font-family="Georgia, serif" font-size="88"
        letter-spacing="-3">WELL KNEW.</text>
      <line x1="76" y1="574" x2="1124" y2="574" stroke="#f2f2ef" stroke-opacity="0.3" />
    </svg>
  `)

  const output = await sharp(background)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover' })
    .composite([
      { input: shade, left: 0, top: 0 },
      { input: mark, left: 76, top: 72 },
      { input: copy, left: 0, top: 0 },
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

/**
 * 메신저로 /; 링크가 오갈 때 뜨는 카드.
 *
 * 제목과 설명은 플랫폼이 메타태그에서 가져와 옆에 붙여 준다. 그래서 카드에는
 * 글자를 얹지 않고 마크와 판면선만 남긴다 — 사이트에서 쓰는 것과 같은 요소다.
 */
async function buildSemicolonOgImage() {
  const inset = 72
  const mark = 300
  const tick = 9

  const corner = (x, y) =>
    `<path d="M${x - tick} ${y} H${x + tick} M${x} ${y - tick} V${y + tick}"/>`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="${SEMICOLON_BG}"/>
  <g stroke="${SEMICOLON_INK}" stroke-width="1" opacity="0.16" fill="none">
    <path d="M${inset} 0 V${OG_HEIGHT} M${OG_WIDTH - inset} 0 V${OG_HEIGHT}"/>
  </g>
  <g stroke="${SEMICOLON_INK}" stroke-width="1" opacity="0.34" fill="none">
    ${corner(inset, inset)}
    ${corner(OG_WIDTH - inset, inset)}
    ${corner(inset, OG_HEIGHT - inset)}
    ${corner(OG_WIDTH - inset, OG_HEIGHT - inset)}
  </g>
  <g fill="${SEMICOLON_INK}" transform="translate(${inset + 48} ${(OG_HEIGHT - mark) / 2}) scale(${mark / 200})">${MARK}</g>
</svg>
`

  const output = await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer()

  await writeFile(join(PUBLIC_DIR, 'semicolon-og.png'), output)
  console.log(`semicolon-og.png  ${OG_WIDTH}x${OG_HEIGHT}, ${output.length} bytes`)
}

const logo = await buildLogo()
await buildOgImage(logo)
await buildSemicolonFavicon()
await buildSemicolonTouchIcon()
await buildSemicolonOgImage()
