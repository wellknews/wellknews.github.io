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

/** 공유 카드 규격 */
const OG_WIDTH = 1200
const OG_HEIGHT = 630
const OG_LOGO_SIZE = 300

/**
 * Semicolon(/;)의 표식.
 *
 * 글꼴에 의존하지 않도록 도형으로 그린다. 파비콘 SVG와 공유 카드가 같은 도형에서
 * 나오므로 모양을 고칠 일이 생기면 이 상수 하나만 고치면 된다.
 */
const SEMICOLON_BG = '#fafaf8'
const SEMICOLON_INK = '#151515'
const SEMICOLON_MARK = `
  <circle cx="100" cy="66" r="17"/>
  <path d="M100 105 L117 122 L88 172 Z"/>
  <circle cx="100" cy="122" r="17"/>
`

/** 공유 카드 안에서 표식이 차지할 높이 */
const SEMICOLON_OG_SIZE = 260

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
 * Semicolon의 파비콘과 공유 카드.
 *
 * 표식 하나만 놓고 문구를 얹지 않는 것은 WELLKNEWS 카드와 같은 이유다 —
 * 링크 미리보기에는 제목과 설명이 이미 텍스트로 붙는다.
 */
async function buildSemicolonAssets() {
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="${SEMICOLON_BG}"/>
  <g fill="${SEMICOLON_INK}">${SEMICOLON_MARK}</g>
</svg>
`

  await writeFile(join(PUBLIC_DIR, 'semicolon.svg'), favicon)
  console.log(`semicolon.svg    ${favicon.length} bytes`)

  const mark = await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <g fill="${SEMICOLON_INK}">${SEMICOLON_MARK}</g>
      </svg>`,
    ),
  )
    .resize(SEMICOLON_OG_SIZE, SEMICOLON_OG_SIZE, { fit: 'inside' })
    .png()
    .toBuffer()

  const output = await sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 4,
      background: SEMICOLON_BG,
    },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer()

  await writeFile(join(PUBLIC_DIR, 'semicolon-og.png'), output)
  console.log(`semicolon-og.png ${OG_WIDTH}x${OG_HEIGHT}, ${output.length} bytes`)
}

const logo = await buildLogo()
await buildOgImage(logo)
await buildSemicolonAssets()
