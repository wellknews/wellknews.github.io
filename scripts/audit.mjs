/**
 * 화면을 실제로 열어 보고 확인하는 검사.
 *
 * 타입 검사와 린트는 코드가 말이 되는지만 본다. 이 파일은 그리고 나서 눈에
 * 무엇이 보이는지, 손을 댔을 때 무엇이 일어나는지를 본다.
 *
 * 여기 있는 항목은 전부 한 번씩 실제로 배포까지 나간 적이 있는 잘못이다.
 * 공통점이 하나 있다 — 전부 «없어진 것»이고, 확인하던 틀 안에서는 없어진 것이
 * 보이지 않았다. 그래서 이 검사는 매번 없어졌을 자리까지 일부러 넓게 본다.
 *
 *   1. 잘린 잉크    잘라내기·마스크가 글자의 획을 먹고 있지 않은지.
 *                   세션 끝의 ';'가 쉼표 꼬리를 잘린 채 배포된 적이 있다.
 *                   요소 크기에 맞춰 찍으면 잘려 나간 잉크는 애초에 프레임
 *                   밖이라 보이지 않는다. 그래서 둘레를 넉넉히 두고 찍는다.
 *   2. 죽은 장치    만질 수 있게 만들어 둔 것이 마우스와 손가락 양쪽에
 *                   실제로 반응하는지. 한쪽만 되면 그 사람에게는 없는 기능이다.
 *                   좁은 화면의 반응을 통째로 없앤 채 배포된 적이 있다.
 *   3. 사라진 문장  좁은 판면이 넓은 판면의 문장과 이미지를 그대로 가지고
 *                   있는지. 배치가 달라지는 것은 되고, 내용이 줄어드는 것은
 *                   안 된다. 손으로 세어 확인하던 것을 여기로 옮겼다.
 *   4. 안 열린 글   움직임을 끈 사람에게 모든 문장이 실제로 보이는지.
 *                   스크롤로 열리는 글은 그 사람에게는 열리지 않는다.
 *   5. 한 번뿐인 장면  사건으로 만든 장면을 지나갔다 돌아왔을 때 다시 볼 수
 *                   있는지. 한 번 켜고 관찰을 끊어 버리면, 빠르게 지나간
 *                   사람은 그 장면을 영영 못 본다.
 *   6. 가로 넘침    어느 폭에서도 가로로 밀리지 않는지.
 *
 * 실행: npm run audit   (개발 서버가 떠 있어야 한다. 없으면 알아서 띄운다.)
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import sharp from 'sharp'
import { chromium } from 'playwright'

const PORT = Number(process.env.AUDIT_PORT ?? 5199)
const BASE = `http://localhost:${PORT}/;`

/** 검사할 화면. 세 판면 각각에서 같은 것을 본다. */
const SCREENS = [
  { name: 'compact', width: 390, height: 844, touch: true },
  { name: 'snug', width: 768, height: 1024, touch: true },
  { name: 'wide', width: 1440, height: 900, touch: false },
]

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'session', path: '/session/wellknews-1k' },
  { name: 'session-index', path: '/session' },
  { name: 'thread-index', path: '/thread' },
]

const failures = []

function fail(message) {
  failures.push(message)
  console.error(`  ✗ ${message}`)
}

function pass(message) {
  console.log(`  ✓ ${message}`)
}

/** 앞말의 받침에 따라 조사를 고른다. «표지 이미지이»가 아니라 «표지 이미지가»가 되도록. */
function josa(word, withFinal, withoutFinal) {
  const last = word.codePointAt(word.length - 1)
  const isHangul = last >= 0xac00 && last <= 0xd7a3

  return isHangul && (last - 0xac00) % 28 !== 0 ? withFinal : withoutFinal
}

/* ─────────────────────────────  1. 잘린 잉크  ───────────────────────────── */

/**
 * 요소 둘레를 넉넉히 잘라 찍고, 잉크가 있는 가로줄의 구간을 돌려준다.
 *
 * 요소 크기에 딱 맞춰 찍으면 상자 밖으로 나간 잉크가 애초에 프레임에 안 들어와
 * 잘린 것을 볼 수 없다. 그래서 반드시 여유를 두고 찍는다 — 이것을 안 해서
 * 세션 끝의 기호가 잘린 채 배포됐다.
 */
async function inkRows(page, locator, file, pad = 48) {
  const box = await locator.boundingBox()

  if (!box) return null

  const clip = {
    x: Math.max(0, box.x - pad),
    y: Math.max(0, box.y - pad),
    width: box.width + pad * 2,
    height: box.height + pad * 2,
  }

  await page.screenshot({ path: file, clip })

  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true })
  const rows = []

  for (let y = 0; y < info.height; y += 1) {
    let n = 0
    for (let x = 0; x < info.width; x += 1) if (data[y * info.width + x] < 210) n += 1
    rows.push(n)
  }

  const inked = rows.map((n, i) => (n > 0 ? i : -1)).filter((i) => i >= 0)
  const groups = []

  if (inked.length) {
    let start = inked[0]
    for (let i = 1; i < inked.length; i += 1) {
      if (inked[i] !== inked[i - 1] + 1) {
        groups.push([start, inked[i - 1]])
        start = inked[i]
      }
    }
    groups.push([start, inked.at(-1)])
  }

  return groups
}

/** 잘라내기를 껐다 켜서 실제로 먹힌 잉크가 있는지 본다. */
async function auditClipping(page, screen, dir) {
  const marks = page.locator('[class*="Ending-module__mark"]')

  if ((await marks.count()) === 0) return

  const mark = marks.first()

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(1600)

  const open = await inkRows(page, mark, join(dir, `${screen.name}-end-open.png`))

  const natural = await page.evaluate(() => {
    const el = document.querySelector('[class*="Ending-module__mark"]')
    const before = el.style.clipPath
    el.style.clipPath = 'none'
    return before
  })
  await page.waitForTimeout(200)

  const uncut = await inkRows(page, mark, join(dir, `${screen.name}-end-uncut.png`))

  await page.evaluate((before) => {
    document.querySelector('[class*="Ending-module__mark"]').style.clipPath = before
  }, natural)

  if (!open || !uncut) return

  const cutTop = open[0][0] - uncut[0][0]
  const cutBottom = uncut.at(-1)[1] - open.at(-1)[1]

  if (cutTop > 1 || cutBottom > 1) {
    fail(
      `${screen.name} 세션 끝의 ';'가 잘린다 — 위 ${cutTop}px, 아래 ${cutBottom}px. ` +
        `상자가 잉크보다 작다(Ending.module.css의 padding-block을 키운다).`,
    )
  } else {
    pass(`${screen.name} 세션 끝의 ';'가 온전하다 (잘린 잉크 없음)`)
  }

  /* 닫힌 상태는 아래 획만 보여야 한다. 두 덩어리면 위 점이 남은 것이고, 그러면 변화가 없다. */
  await page.evaluate(() => {
    document.querySelector('[class*="Ending-module__ending"]').dataset.open = 'false'
  })
  await page.waitForTimeout(1200)

  const closed = await inkRows(page, mark, join(dir, `${screen.name}-end-closed.png`))

  if (!closed) return

  if (closed.length !== 1) {
    fail(
      `${screen.name} 세션 끝의 ';'가 닫혔을 때 잉크가 ${closed.length}덩어리다 — ` +
        `자르는 위치가 두 획 사이가 아니다(clip-path의 백분율을 다시 잰다).`,
    )
  } else {
    pass(`${screen.name} 세션 끝의 ';'가 닫혔을 때 아래 획만 남는다`)
  }
}

/* ─────────────────────────────  2. 죽은 장치  ───────────────────────────── */

/**
 * 만질 수 있게 만든 것이 실제로 반응하는지.
 *
 * 각 항목은 «어디를 건드리면 어떤 표시가 바뀌어야 하는가»로 적는다. 마우스가
 * 있는 화면에서는 hover로, 없는 화면에서는 탭으로 확인한다. 한쪽만 되면
 * 그 입력을 쓰는 사람에게는 없는 기능이므로 실패로 본다.
 *
 * 반응의 크기를 줄이는 것은 여기서 걸리지 않는다. 좁은 화면에서 움직임을 얌전하게
 * 만드는 것은 판단이고, 아예 없애는 것은 기능을 지우는 것이다. 이 검사가 지키는
 * 선이 그 사이다.
 */
const DEVICES = [
  {
    page: 'home',
    label: '히어로의 선',
    target: '[class*="Rift-module__rift"]',
    read: () =>
      document.querySelector('[class*="Rift-module__rift"]')?.style.getPropertyValue('--mark-ink'),
    changed: (before, after) => Number(after) > Number(before) + 0.05,
  },
  {
    page: 'session',
    label: '표지 이미지',
    target: '[class*="Materialize-module__materialize"]',
    read: () => document.querySelector('[class*="Materialize-module__materialize"]')?.dataset.lit,
    changed: (before, after) => before !== after && after === 'true',
  },
  {
    page: 'session',
    label: '앞뒤 시안 뒤집기',
    target: '[class*="Faces-module__flip"]',
    read: () => document.querySelector('[class*="Faces-module__faces"]')?.dataset.back,
    changed: (before, after) => before !== after,
    click: true,
  },
]

/** 요소를 찍어 회색조 픽셀로 돌려준다. 두 번 찍어 비교하기 위한 것. */
async function pixels(page, locator, file, pad = 8) {
  const box = await locator.boundingBox()

  if (!box) return null

  await page.screenshot({
    path: file,
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: box.width + pad * 2,
      height: box.height + pad * 2,
    },
  })

  const { data } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true })

  return data
}

/** 두 장 사이에서 실제로 달라진 픽셀의 비율. */
function movedFraction(before, after) {
  if (!before || !after || before.length !== after.length) return null

  let n = 0

  for (let i = 0; i < before.length; i += 1) if (Math.abs(before[i] - after[i]) > 6) n += 1

  return n / before.length
}

/** 눈에 보이는 변화로 인정하는 최소 비율. 이보다 작으면 아무 일도 안 일어난 것과 같다. */
const VISIBLE = 0.001

async function auditDevices(page, screen, pageName, dir) {
  const devices = DEVICES.filter((d) => d.page === pageName)

  if (devices.length === 0) return

  /*
   * 재는 동안만 색면을 치운다.
   *
   * 색면은 커서를 따라 스스로 밀려나므로, 켜 둔 채로 앞뒤를 비교하면 장치가
   * 죽어 있어도 배경이 달라져서 «반응했다»로 읽힌다. 종이만 남겨 두고 재야
   * 달라진 것이 이 장치인지 알 수 있다.
   */
  const masked = await page.addStyleTag({
    content: '[class*="Field-module__field"] { display: none !important; }',
  })

  for (const device of devices) {
    const target = page.locator(device.target).first()

    if ((await target.count()) === 0) continue

    await target.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)

    const stem = join(dir, `${screen.name}-${pageName}-${devices.indexOf(device)}`)
    const before = await page.evaluate(device.read)
    const beforePixels = await pixels(page, target, `${stem}-before.png`)
    const box = await target.boundingBox()

    if (!box) continue

    const x = box.x + box.width / 2
    const y = box.y + box.height / 2

    if (screen.touch) {
      await page.touchscreen.tap(x, y)
    } else if (device.click) {
      await page.mouse.click(x, y)
    } else {
      await page.mouse.move(x, y, { steps: 12 })
    }

    await page.waitForTimeout(700)

    const after = await page.evaluate(device.read)
    const afterPixels = await pixels(page, target, `${stem}-after.png`)
    const moved = movedFraction(beforePixels, afterPixels)
    const subject = `${device.label}${josa(device.label, '이', '가')}`
    const input = screen.touch ? '탭' : '커서'

    /* 상태가 바뀌었는가. */
    if (!device.changed(before, after)) {
      fail(
        `${screen.name} ${subject} ${input}에 반응하지 않는다 (${before} → ${after}). ` +
          `이 입력을 쓰는 사람에게는 없는 기능이다.`,
      )
      continue
    }

    /*
     * 그래서 눈에 보이는가.
     *
     * 상태만 보고 넘어가면 속성은 바뀌는데 화면은 그대로인 것을 «된다»고 적게
     * 된다. 잘린 기호를 내보낸 것이 정확히 그런 확인이었다 — 대신 볼 수 있는
     * 것을 보고 실제로 보이는 것을 안 봤다.
     */
    if (moved !== null && moved < VISIBLE) {
      fail(
        `${screen.name} ${subject} ${input}에 상태만 바뀌고 화면은 그대로다 ` +
          `(달라진 픽셀 ${(moved * 100).toFixed(3)}%). 사람에게는 아무 일도 안 일어난 것이다.`,
      )
      continue
    }

    pass(
      `${screen.name} ${subject} ${input}에 반응한다` +
        (moved === null ? '' : ` (화면의 ${(moved * 100).toFixed(1)}%가 달라진다)`),
    )
  }

  await masked.evaluate((el) => el.remove())
}

/* ─────────────────────────────  3. 사라진 문장  ───────────────────────────── */

/**
 * 그려진 화면에서 문장과 이미지를 그대로 걷어 온다.
 *
 * 원본 데이터가 아니라 실제 DOM에서 걷는 것이 핵심이다. 코드에 문장이 남아
 * 있어도 화면에 안 나오면 없는 것이고, 이 검사가 잡아야 하는 것이 정확히 그
 * 경우다.
 */
const HARVEST = () => {
  const BLOCKS = 'p, h1, h2, h3, li, blockquote, figcaption'
  const sentences = new Set()

  for (const el of document.querySelectorAll(BLOCKS)) {
    /* 문단 안에 문단이 있으면 바깥쪽은 두 문장이 붙은 가짜 문자열이 된다. */
    if (el.querySelector(BLOCKS)) continue

    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()

    /* 한글이 든 것만 «문장»으로 본다. 쪽수·빗금·경로·날짜에는 한글이 없다. */
    if (/[가-힣]/.test(text)) sentences.add(text)
  }

  const images = new Set()

  for (const img of document.querySelectorAll('img')) {
    images.add(new URL(img.currentSrc || img.src, location.href).pathname)
  }

  return { sentences: [...sentences], images: [...images] }
}

/**
 * 좁은 판면이 넓은 판면의 내용을 다 가지고 있는지.
 *
 * 배치가 달라지는 것은 이 사이트가 하기로 한 일이다. 장면 수가 스무 개에서
 * 열한 개로 줄어도 된다. 줄면 안 되는 것은 문장과 이미지 — 좁은 화면으로 온
 * 사람이 기록의 일부를 못 보게 되는 것이다.
 *
 * 한 방향으로만 본다. 넓은 쪽에 있는 것이 좁은 쪽에 없으면 실패다.
 */
function auditParity(harvest) {
  const wide = harvest.get('wide')

  if (!wide) return

  for (const screen of SCREENS) {
    if (screen.name === 'wide') continue

    const narrow = harvest.get(screen.name)

    if (!narrow) continue

    for (const target of PAGES) {
      const from = wide.get(target.name)
      const to = narrow.get(target.name)

      if (!from || !to) continue

      const lostText = from.sentences.filter((s) => !to.sentences.includes(s))
      const lostImages = from.images.filter((s) => !to.images.includes(s))

      if (lostText.length === 0 && lostImages.length === 0) {
        pass(
          `${screen.name} ${target.name}에 wide의 문장 ${from.sentences.length}개와 ` +
            `이미지 ${from.images.length}개가 그대로 있다`,
        )
        continue
      }

      if (lostText.length) {
        fail(
          `${screen.name} ${target.name}에서 문장 ${lostText.length}개가 사라진다 — ` +
            `예: «${lostText[0].slice(0, 40)}…». 배치는 달라져도 되지만 내용은 줄면 안 된다.`,
        )
      }

      if (lostImages.length) {
        fail(
          `${screen.name} ${target.name}에서 이미지가 사라진다 — ${lostImages.join(', ')}. ` +
            `배치는 달라져도 되지만 내용은 줄면 안 된다.`,
        )
      }
    }
  }
}

/* ─────────────────────────────  4. 안 열린 글  ───────────────────────────── */

/**
 * 움직임을 끈 사람에게 문장이 실제로 보이는지.
 *
 * 이 사이트의 글은 스크롤을 따라 열린다. 움직임을 끄면 그 열림이 일어나지
 * 않으므로, 열린 상태를 따로 적어 두지 않은 곳은 투명한 채로 남는다. 코드만
 * 봐서는 어느 곳을 빠뜨렸는지 알 수 없어서 실제로 계산된 값을 확인한다.
 */
async function auditReducedMotion(page, screen, pageName) {
  const hidden = await page.evaluate(() => {
    const BLOCKS = 'p, h1, h2, h3, li, blockquote, figcaption'
    const out = []

    for (const el of document.querySelectorAll(BLOCKS)) {
      if (el.querySelector(BLOCKS)) continue

      const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()

      if (!/[가-힣]/.test(text)) continue

      let node = el
      let opacity = 1
      let gone = false

      while (node instanceof Element) {
        const style = getComputedStyle(node)

        if (style.display === 'none' || style.visibility === 'hidden') gone = true
        opacity *= Number(style.opacity)
        node = node.parentElement
      }

      if (gone) continue /* 아예 안 그린 것은 다른 배치의 몫이다. */
      if (opacity < 0.05) out.push({ text: text.slice(0, 40), opacity: opacity.toFixed(3) })
    }

    return out
  })

  if (hidden.length) {
    fail(
      `${screen.name} ${pageName}에서 움직임을 끄면 문장 ${hidden.length}개가 투명하다 — ` +
        `예: «${hidden[0].text}…» (opacity ${hidden[0].opacity}). ` +
        `열림을 스크롤에만 맡기고 끝 상태를 안 적어 둔 곳이다.`,
    )
  } else {
    pass(`${screen.name} ${pageName} 움직임을 꺼도 모든 문장이 보인다`)
  }
}

/* ─────────────────────────────  5. 한 번뿐인 장면  ───────────────────────────── */

/**
 * 사건으로 만든 장면이 다시 볼 수 있는 상태인지.
 *
 * 999가 1,000이 되는 것처럼 «변화 자체가 내용»인 장면은, 한 번 지나가면 다시
 * 볼 방법이 없어지기 쉽다. 관성 스크롤로 빠르게 지나간 사람은 바뀐 뒤의 숫자만
 * 보고 무슨 일이 일어났는지 모른 채로 남는다. 돌아왔을 때 처음이어야 한다.
 *
 * 세 가지를 본다. 들어오면 켜지는가, 경계에서 깜빡이지 않는가(일부만 보이는
 * 동안에는 켜진 채로 있어야 한다), 완전히 벗어났다 돌아오면 다시 일어나는가.
 */
const REPLAYS = [
  {
    page: 'session',
    label: '999 → 1,000 장면',
    target: '[class*="Counter-module__counter"]',
    read: (el) => el.dataset.reached,
  },
  {
    page: 'session',
    label: '끝의 기호',
    target: '[class*="Ending-module__ending"]',
    read: (el) => el.dataset.open,
  },
]

async function auditReplay(page, screen, pageName) {
  for (const scene of REPLAYS.filter((r) => r.page === pageName)) {
    const target = page.locator(scene.target).first()

    if ((await target.count()) === 0) continue

    const state = async () => page.evaluate(scene.read, await target.elementHandle())
    const subject = `${scene.label}${josa(scene.label, '이', '가')}`

    /* 1. 들어오면 켜진다. */
    await target.scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)

    if ((await state()) !== 'true') {
      fail(`${screen.name} ${subject} 화면 가운데 와도 일어나지 않는다.`)
      continue
    }

    /* 2. 살짝 물러나 일부만 보이는 동안에는 켜진 채로 있어야 한다. */
    await target.evaluate((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY

      /* 아래쪽 20px만 화면에 걸치게 둔다. 아직 사라진 것은 아니다. */
      window.scrollTo(0, top - window.innerHeight + 20)
    })
    await page.waitForTimeout(900)

    if ((await state()) !== 'true') {
      fail(
        `${screen.name} ${subject} 조금 물러났을 뿐인데 처음으로 돌아간다 — ` +
          `경계에서 껐다 켜지면 사건이 아니라 깜빡이는 화면이 된다.`,
      )
      continue
    }

    /* 3. 완전히 벗어났다 돌아오면 다시 일어난다. */
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(900)

    if ((await state()) !== 'false') {
      fail(
        `${screen.name} ${subject} 지나가고 나면 다시 볼 수 없다 — ` +
          `되감아 올려도 처음으로 돌아가지 않는다(useInView의 replay).`,
      )
      continue
    }

    await target.scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)

    if ((await state()) !== 'true') {
      fail(`${screen.name} ${subject} 되돌아간 뒤 다시 내려가도 일어나지 않는다.`)
      continue
    }

    pass(`${screen.name} ${subject} 지나갔다 돌아오면 다시 일어난다`)
  }
}

/* ─────────────────────────────  6. 가로 넘침  ───────────────────────────── */

async function auditOverflow(page, screen, pageName) {
  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )

  if (over > 0) fail(`${screen.name} ${pageName}에서 가로로 ${over}px 넘친다`)
  else pass(`${screen.name} ${pageName} 가로 넘침 없음`)
}

/* ─────────────────────────────  실행  ───────────────────────────── */

async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return true
    } catch {
      /* 아직 안 떴다 */
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  return false
}

const dir = await mkdtemp(join(tmpdir(), 'semicolon-audit-'))
let server

if (await waitForServer(`${BASE}/`, 1)) {
  /*
   * 이미 떠 있는 서버를 그대로 쓴다. 대신 그 사실을 밝힌다 — 오래 띄워 둔
   * 서버는 모듈 그래프가 낡아 있을 수 있고, 그러면 코드가 멀쩡한데도 요청이
   * 무더기로 실패한다. 결과가 이상하면 서버를 내리고 다시 돌리면 된다.
   */
  console.log(`포트 ${PORT}에 이미 떠 있는 서버를 쓴다. (결과가 이상하면 내리고 다시 돌린다)`)
} else {
  console.log(`개발 서버를 띄운다 (포트 ${PORT})…`)
  server = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
  if (!(await waitForServer(`${BASE}/`))) {
    console.error('개발 서버를 띄우지 못했다.')
    process.exit(1)
  }
}

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? '/opt/pw-browsers/chromium',
})

/** screen.name → (page.name → 걷어 온 내용) */
const harvest = new Map()

function watch(page, label) {
  page.on('pageerror', (error) => fail(`${label} 콘솔 예외: ${error.message}`))
  page.on('requestfailed', (request) => {
    /* 개발 서버의 HMR 소켓은 검사 대상이 아니다. */
    if (!request.url().includes('/@vite')) fail(`${label} 요청 실패: ${request.url()}`)
  })
}

for (const screen of SCREENS) {
  console.log(`\n── ${screen.name} (${screen.width}px) ──`)

  const context = {
    viewport: { width: screen.width, height: screen.height },
    deviceScaleFactor: 2,
    isMobile: screen.touch,
    hasTouch: screen.touch,
  }

  const page = await browser.newPage(context)
  const collected = new Map()

  harvest.set(screen.name, collected)
  watch(page, screen.name)

  for (const target of PAGES) {
    await page.goto(`${BASE}${target.path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)

    await auditOverflow(page, screen, target.name)
    await auditDevices(page, screen, target.name, dir)

    collected.set(target.name, await page.evaluate(HARVEST))

    await auditReplay(page, screen, target.name)

    if (target.name === 'session') await auditClipping(page, screen, dir)
  }

  await page.close()

  /* 같은 폭을 움직임 없이 한 번 더 본다. 여기서만 보이는 잘못이 따로 있다. */
  const still = await browser.newPage({ ...context, reducedMotion: 'reduce' })

  watch(still, `${screen.name}(정지)`)

  for (const target of PAGES) {
    await still.goto(`${BASE}${target.path}`, { waitUntil: 'networkidle' })
    await still.waitForTimeout(600)

    await auditReducedMotion(still, screen, target.name)
  }

  await still.close()
}

console.log('\n── 좁은 판면이 내용을 잃지 않았는가 ──')
auditParity(harvest)

await browser.close()
server?.kill()
await rm(dir, { recursive: true, force: true })

console.log('')

if (failures.length) {
  console.error(`검사 실패 ${failures.length}건`)
  process.exit(1)
}

console.log('검사 통과')
