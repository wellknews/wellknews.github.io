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

const logo = await buildLogo()
await buildOgImage(logo)
