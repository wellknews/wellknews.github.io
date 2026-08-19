/**
 * 정적 이미지 자산을 생성한다. 결과물(public/logo.png, public/og.png)은 저장소에
 * 커밋되므로 평소 빌드에서는 실행되지 않는다. 원본 로고가 바뀔 때만 다시 돌린다.
 *
 *   node scripts/build-assets.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = join(ROOT, 'public')

/** 로고가 화면에 그려지는 최대 크기는 240px이므로 2배인 512면 충분하다. */
const LOGO_SIZE = 512

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
const OG_LOGO_SIZE = 300

async function buildLogo() {
  const source = await readFile(join(PUBLIC_DIR, 'logo.png'))

  const output = await sharp(source)
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer()

  await writeFile(join(PUBLIC_DIR, 'logo.png'), output)
  console.log(`logo.png  ${source.length} -> ${output.length} bytes`)
  return output
}

/**
 * 공유 카드는 검은 색면 위에 로고만 놓는다.
 * 문구를 얹지 않는 이유는 링크 미리보기에 제목과 설명이 이미 텍스트로 붙기 때문이다.
 */
async function buildOgImage(logo) {
  const mark = await sharp(logo)
    .resize(OG_LOGO_SIZE, OG_LOGO_SIZE, { fit: 'inside' })
    .png()
    .toBuffer()

  const output = await sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: mark, gravity: 'centre' }])
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
