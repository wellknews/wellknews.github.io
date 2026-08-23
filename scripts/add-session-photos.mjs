/**
 * 기록에 사진을 들인다.
 *
 *   node scripts/add-session-photos.mjs <slug> <사진이 있는 폴더>
 *
 * 이 저장소의 사진은 손으로 넣어 왔다. 그때마다 같은 것을 다시 판단하게
 * 되는데, 판단이 필요한 자리가 아니라 규칙이 이미 정해진 자리다.
 *
 *   · 이미 webp면 다시 인코딩하지 않는다. 손실 압축을 두 번 겹치면 원본에
 *     없던 열화가 생긴다.
 *   · 긴 변을 1600px로 제한한다. 판면 최대 폭이 1240px이라 그보다 큰 화소는
 *     내려받는 사람만 손해다.
 *   · width·height를 실제 파일에서 재서 알려 준다. 이 값은 사진이 늦게
 *     도착해도 글이 밀리지 않게 하는 자리 예약이라, 실제와 다르면 읽는
 *     도중에 지면이 한 번 흔들린다. 눈대중으로 적으면 반드시 틀린다.
 *
 * 파일을 옮기고 나서 붙여 넣을 Cover 객체를 그대로 찍어 준다. alt는 사람이
 * 채운다 — 무엇이 찍혀 있는지는 그 자리에 있던 사람만 안다.
 */
import { mkdir, readdir, copyFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname, basename } from 'node:path'

import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/** 판면 최대 폭이 1240px이다. 그 위로는 화면에서 쓸 일이 없다. */
const MAX_EDGE = 1600

const [slug, from] = process.argv.slice(2)

if (!slug || !from) {
  console.error('사용법: node scripts/add-session-photos.mjs <slug> <사진이 있는 폴더>')
  process.exit(1)
}

const into = join(ROOT, 'public', 'media', 'session', slug)
await mkdir(into, { recursive: true })

const names = (await readdir(from))
  .filter((name) => /\.(jpe?g|png|webp|heic|avif)$/i.test(name))
  .sort()

if (names.length === 0) {
  console.error(`${from} 에 사진이 없다.`)
  process.exit(1)
}

const covers = []

for (const [index, name] of names.entries()) {
  const source = join(from, name)
  const stem = basename(name, extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    /* 이미 번호가 붙어 있으면 그것을 쓴다. 앞에 또 붙이면 01-01-이 된다. */
    .replace(/^\d+-/, '')
    .replace(/^-|-$/g, '')
  const out = `${String(index + 1).padStart(2, '0')}-${stem}.webp`
  const target = join(into, out)

  const image = sharp(source)
  const { width = 0, height = 0 } = await image.metadata()
  const long = Math.max(width, height)
  const alreadyWebp = extname(name).toLowerCase() === '.webp'

  if (alreadyWebp && long <= MAX_EDGE) {
    /* 손댈 이유가 없다. 그대로 옮긴다. */
    await copyFile(source, target)
  } else {
    const resized =
      long > MAX_EDGE
        ? image.resize({
            width: long === width ? MAX_EDGE : undefined,
            height: long === height ? MAX_EDGE : undefined,
          })
        : image
    await writeFile(target, await resized.webp({ quality: 82 }).toBuffer())
  }

  const final = await sharp(target).metadata()

  covers.push({ out, width: final.width, height: final.height })
  console.log(`  ${name}  →  ${out}  ${final.width}×${final.height}`)
}

console.log('\n─── 붙여 넣을 것 (alt는 직접 채운다) ───\n')

for (const { out, width, height } of covers) {
  const name = out
    .replace(/^\d+-/, '')
    .replace(/\.webp$/, '')
    .replace(/-(\w)/g, (_, c) => c.toUpperCase())
  console.log(`const ${name}: Cover = {`)
  console.log(`  src: '/media/session/${slug}/${out}',`)
  console.log(`  alt: '',`)
  console.log(`  width: ${width},`)
  console.log(`  height: ${height},`)
  console.log(`}\n`)
}
