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
 *   6. 화면에 닿은 글  판면의 여백이 실제로 있는지. 넘치지는 않지만 글자가
 *                   화면 양쪽 끝에 붙어 버린 구간이 배포된 적이 있다.
 *   7. 가려진 링크  보이는 링크를 실제로 누를 수 있는지. 투명한 장식 층이
 *                   위를 덮고 있으면 화면은 멀쩡해 보이는데 눌리지 않는다.
 *   8. 가로 넘침    어느 폭에서도 가로로 밀리지 않는지.
 *   9. 기울어진 목록  기호를 그리지 않는 목록이 없는 기호의 자리만큼
 *                   들여쓰여 있지 않은지. 브라우저 기본 들여쓰기 40px가
 *                   남으면 가운데 맞춤 장치의 잉크가 통째로 20px 밀린다.
 *                   Course와 Breakdown이 그렇게 밀린 채 배포된 적이 있다.
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

/**
 * 열어 볼 화면.
 *
 * kind는 «이 화면에 무엇이 있을 수 있는가»를 말한다. 기록이 늘어날 때마다
 * 검사 항목을 하나씩 옮겨 적지 않기 위한 것이다 — 새 기록은 여기 한 줄만
 * 더하면 그 기록에 실제로 있는 장치만 골라서 검사한다.
 */
const PAGES = [
  { name: 'home', path: '/', kind: 'home' },
  { name: 'session/wellknews-1k', path: '/session/wellknews-1k', kind: 'session' },
  { name: 'session/only-myself', path: '/session/only-myself', kind: 'session' },
  { name: 'session/divide-and-conquer', path: '/session/divide-and-conquer', kind: 'session' },
  {
    name: 'session/pleasure-is-not-a-sin',
    path: '/session/pleasure-is-not-a-sin',
    kind: 'session',
  },
  {
    name: 'session/seongsu-plan-collapse',
    path: '/session/seongsu-plan-collapse',
    kind: 'session',
  },
  { name: 'session-index', path: '/session', kind: 'index' },
  { name: 'thread-index', path: '/thread', kind: 'index' },
  { name: 'thread/related-but-unresolved', path: '/thread/related-but-unresolved', kind: 'index' },
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

  const open = await inkRows(page, mark, join(dir, `${screen.name}-${Date.now()}-end-open.png`))

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
 *
 * 누르는 자리와 달라지는 자리가 다를 수 있다. 코스에서 하나를 고르면 달라지는
 * 것은 나머지이고, 한 번 더 나누면 새 선은 누른 자리 위에 생긴다. 그런 장치는
 * `watch`에 «어디를 보아야 하는가»를 따로 적는다. 안 적으면 누르는 자리를 본다.
 */
const DEVICES = [
  {
    kind: 'home',
    label: '히어로의 선',
    target: '[class*="Rift-module__rift"]',
    read: () =>
      document.querySelector('[class*="Rift-module__rift"]')?.style.getPropertyValue('--mark-ink'),
    changed: (before, after) => Number(after) > Number(before) + 0.05,
  },
  {
    kind: 'session',
    label: '표지 이미지',
    target: '[class*="Materialize-module__materialize"]',
    read: () => document.querySelector('[class*="Materialize-module__materialize"]')?.dataset.lit,
    changed: (before, after) => before !== after && after === 'true',
  },
  {
    kind: 'session',
    label: '앞뒤 시안 뒤집기',
    target: '[class*="Faces-module__flip"]',
    read: () => document.querySelector('[class*="Faces-module__faces"]')?.dataset.back,
    changed: (before, after) => before !== after,
    click: true,
  },
  {
    kind: 'session',
    label: '본문의 사진',
    target: '[class*="Plate-module__frame"]',
    read: () => document.querySelector('[class*="Plate-module__frame"]')?.dataset.lit,
    changed: (before, after) => before !== after && after === 'true',
  },
  {
    kind: 'session',
    label: '잴 수 없는 칸',
    target: '[class*="Condition-module__guess"]',
    read: () => document.querySelector('[class*="Condition-module__guess"]')?.textContent,
    changed: (before, after) => before !== after,
    click: true,
  },
  {
    kind: 'session',
    label: '코스의 한 단위',
    target: '[class*="Course-module__name"]',
    watch: '[class*="Course-module__course"]',
    read: () => document.querySelector('[class*="Course-module__course"]')?.dataset.attending,
    changed: (before, after) => before !== after && after === 'true',
    click: true,
  },
  {
    kind: 'session',
    label: '한 번 더 나누기',
    target: '[class*="Breakdown-module__further"]',
    watch: '[class*="Breakdown-module__breakdown"]',
    read: () => document.querySelectorAll('[class*="Breakdown-module__stack"] li').length,
    changed: (before, after) => Number(after) > Number(before),
    click: true,
  },
  {
    kind: 'session',
    label: '움직이지 않는 0.00%',
    target: '[class*="Drift-module__meter"]',
    watch: '[class*="Drift-module__drift"]',
    read: () => getComputedStyle(document.querySelector('[class*="Drift-module__states"]')).color,
    changed: (before, after) => before !== after,
    /* 눌러 봐도 숫자는 그대로다. 달라지는 것은 그 위의 낱말이라 watch가 따로 있다. */
    hold: true,
  },
  {
    kind: 'session',
    label: '쥐고 있는 다음 다리',
    target: '[class*="Bridge-module__bridge"]',
    read: () =>
      getComputedStyle(document.querySelector('[class*="Bridge-module__reach"]')).backgroundColor,
    changed: (before, after) => before !== after,
    hold: true,
  },
  {
    kind: 'session',
    label: '붙잡는 계획 한 줄',
    target: '[class*="PlanStage-module__name"]',
    watch: '[class*="PlanStage-module__track"]',
    /* 붙잡은 줄이 아니라 나머지가 물러난다. 그래서 두 번째 줄의 잉크를 잰다. */
    read: () =>
      getComputedStyle(document.querySelectorAll('[class*="PlanStage-module__name"]')[1]).color,
    changed: (before, after) => before !== after,
  },
  {
    kind: 'session',
    label: '눈에 준 힘',
    /*
     * 누르는 자리는 이 구간 안이면 어디든 되지만, 구간 자체는 화면 몇 개를
     * 덮을 만큼 넓어서 그 한가운데를 짚으면 화면 밖이 된다. 그래서 안쪽의
     * 작은 자리를 눌러 위로 올려 보낸다 — 사람이 하는 일도 그것이다.
     */
    target: '[class*="Cue-module__cue"]',
    watch: '[class*="Cue-module__state"]',
    read: () => getComputedStyle(document.querySelector('[class*="Cue-module__state"]')).color,
    changed: (before, after) => before !== after,
    hold: true,
  },
  {
    kind: 'session',
    label: '붙잡는 51%',
    target: '[class*="Threshold-module__numeral"]',
    read: () =>
      getComputedStyle(document.querySelector('[class*="Threshold-module__numeral"]')).color,
    changed: (before, after) => before !== after,
    /*
     * 쥐고 있는 동안에만 색이 바뀐다. 눌렀다 떼면 원래대로 돌아오므로,
     * 손가락에서는 누른 채로 재야 한다.
     */
    hold: true,
  },
]

/**
 * 요소를 찍어 색이 그대로 있는 픽셀로 돌려준다. 두 번 찍어 비교하기 위한 것.
 *
 * 회색조로 바꾸지 않는다. 채도만 바뀌는 장치는 밝기가 거의 그대로여서, 회색조로
 * 재면 «아무 일도 안 일어났다»로 읽힌다. 실제로 사진의 색이 돌아오는 장치를
 * 그 방식으로 놓칠 뻔했다.
 */
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

  const { data } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true })

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

async function auditDevices(page, screen, where, dir) {
  const devices = DEVICES.filter((d) => d.kind === where.kind)

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

    /*
     * 재기 전에 커서를 판 밖으로 치운다.
     *
     * 앞 장치를 만진 자리에 커서가 남아 있으면, 스크롤한 뒤 그 자리에 온 다음
     * 장치가 이미 켜진 채로 «처음» 상태를 재게 된다. 그러면 살아 있는 장치가
     * 죽은 것으로 나온다.
     */
    await page.mouse.move(0, 0)
    await target.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)

    /* 화면 이름에 슬래시가 들어가므로 파일 이름으로 쓰기 전에 바꾼다. */
    const stem = join(
      dir,
      `${screen.name}-${where.name.replace(/\//g, '-')}-${devices.indexOf(device)}`,
    )
    /* 달라지는 자리가 누르는 자리와 다를 수 있다. */
    const seen = device.watch ? page.locator(device.watch).first() : target

    const before = await page.evaluate(device.read)
    const beforePixels = await pixels(page, seen, `${stem}-before.png`)
    const box = await target.boundingBox()

    if (!box) continue

    const x = box.x + box.width / 2
    const y = box.y + box.height / 2

    if (device.hold) {
      /* 놓으면 되돌아가는 장치는 쥔 채로 잰다. */
      await page.mouse.move(x, y)
      await page.mouse.down()
    } else if (screen.touch) {
      await page.touchscreen.tap(x, y)
    } else if (device.click) {
      await page.mouse.click(x, y)
    } else {
      await page.mouse.move(x, y, { steps: 12 })
    }

    await page.waitForTimeout(700)

    const after = await page.evaluate(device.read)
    const afterPixels = await pixels(page, seen, `${stem}-after.png`)

    if (device.hold) await page.mouse.up()
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
        /* 잰 자리의 크기 자체가 달라지면 픽셀을 맞대어 볼 수 없다. 그것도 눈에 보이는 변화다. */
        (moved === null
          ? ' (차지하는 자리가 달라진다)'
          : ` (화면의 ${(moved * 100).toFixed(1)}%가 달라진다)`),
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
    kind: 'session',
    label: '999 → 1,000 장면',
    target: '[class*="Counter-module__counter"]',
    read: (el) => el.dataset.reached,
  },
  {
    kind: 'session',
    label: '끝의 기호',
    target: '[class*="Ending-module__ending"]',
    read: (el) => el.dataset.open,
  },
]

async function auditReplay(page, screen, where) {
  for (const scene of REPLAYS.filter((r) => r.kind === where.kind)) {
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

/* ─────────────────────────────  6. 화면에 닿은 글  ───────────────────────────── */

/**
 * 판면의 여백이 실제로 있는지.
 *
 * 가로 넘침 검사는 이것을 못 잡는다. 글이 화면 폭에 딱 맞으면 넘치지는 않지만
 * 글자가 양쪽 끝에 그대로 붙고, 좁은 화면에서는 읽는 동안 손가락에 문장이 가린다.
 * 실제로 Scene 밖에 놓인 구간 하나가 여백 없이 배포되어 있었다.
 *
 * 사진은 여백까지 쓰기로 한 것이 있으므로 보지 않는다. 여기서 보는 것은 글이다.
 */
const MIN_GUTTER = 8

async function auditGutter(page, screen, pageName) {
  const touching = await page.evaluate((min) => {
    const BLOCKS = 'p, h1, h2, h3, li, blockquote, figcaption'
    const out = []

    for (const el of document.querySelectorAll(BLOCKS)) {
      if (el.querySelector(BLOCKS)) continue

      const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()

      if (!/[가-힣]/.test(text)) continue

      const box = el.getBoundingClientRect()

      if (box.width === 0 || box.height === 0) continue

      const left = Math.round(box.left)
      const right = Math.round(window.innerWidth - box.right)

      if (left < min || right < min) out.push({ text: text.slice(0, 32), left, right })
    }

    return out
  }, MIN_GUTTER)

  if (touching.length) {
    const worst = touching[0]

    fail(
      `${screen.name} ${pageName}에서 글 ${touching.length}곳이 화면 끝에 닿는다 — ` +
        `예: «${worst.text}…» (왼쪽 ${worst.left}px, 오른쪽 ${worst.right}px). ` +
        `판면 밖에 놓인 구간은 여백을 스스로 가져야 한다.`,
    )
  } else {
    pass(`${screen.name} ${pageName} 글이 화면 끝에 닿지 않는다`)
  }
}

/* ─────────────────────────────  7. 가려진 링크  ───────────────────────────── */

/**
 * 링크를 실제로 누를 수 있는지.
 *
 * 화면에 보이고 주소도 맞는데 눌리지 않는 링크가 있다. 위에 다른 무언가가
 * 덮고 있으면 그렇게 된다. 이 공간에는 판면 밖으로 새어 나가는 장식용 색면이
 * 여럿 있어서, 그중 하나가 항목 밖으로 나가 앞 구간의 링크를 삼킨 채로
 * 배포된 적이 있다 — 홈의 «/;/thread →»가 눌리지 않았다.
 *
 * 눈으로는 알 수 없다. 덮은 쪽이 투명하면 화면은 아무 이상이 없어 보인다.
 * 그래서 각 링크의 한가운데에서 실제로 무엇이 잡히는지 물어본다.
 */
async function auditReach(page, screen, pageName) {
  const blocked = await page.evaluate(() => {
    const out = []

    for (const link of document.querySelectorAll('a[href]')) {
      const box = link.getBoundingClientRect()

      if (box.width === 0 || box.height === 0) continue

      /* 화면 안으로 들여놓고 재야 한다. 밖에 있으면 아무것도 안 잡힌다. */
      link.scrollIntoView({ block: 'center', behavior: 'instant' })

      const rect = link.getBoundingClientRect()
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)

      /*
       * 아무것도 안 잡히면 그 지점이 화면 밖이라는 뜻이다. 덮인 것이 아니다.
       * 본문으로 건너뛰는 링크처럼 포커스를 받기 전까지 화면 밖에 두는 것이 있다.
       */
      if (!hit) continue

      /* 링크 자신이거나 그 안의 글자면 된다. */
      if (hit === link || link.contains(hit) || hit.contains(link)) continue

      const name = (el) =>
        !el
          ? '아무것도'
          : el.tagName.toLowerCase() +
            (typeof el.className === 'string' && el.className
              ? `.${el.className.split(' ')[0]}`
              : '')

      out.push({ href: link.getAttribute('href'), by: name(hit) })
    }

    return out
  })

  if (blocked.length) {
    const worst = blocked[0]

    fail(
      `${screen.name} ${pageName}에서 링크 ${blocked.length}개가 눌리지 않는다 — ` +
        `예: «${worst.href}»를 ${worst.by}가 덮고 있다. ` +
        `장식용 층에는 pointer-events: none을 준다.`,
    )
  } else {
    pass(`${screen.name} ${pageName}의 링크가 전부 눌린다`)
  }
}

/* ─────────────────────────────  8. 가로 넘침  ───────────────────────────── */

async function auditOverflow(page, screen, pageName) {
  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )

  if (over > 0) fail(`${screen.name} ${pageName}에서 가로로 ${over}px 넘친다`)
  else pass(`${screen.name} ${pageName} 가로 넘침 없음`)
}

/* ─────────────────────────────  9. 기울어진 목록  ───────────────────────────── */

/**
 * 그리지도 않는 기호의 자리를 비워 둔 목록이 없는지.
 *
 * 브라우저는 <ul>과 <ol>에 기본으로 40px의 들여쓰기를 준다. 점이나 번호를
 * 놓을 자리다. 이 공간의 목록은 그 기호를 하나도 그리지 않는다 — 항목을
 * grid나 contents로 놓기 때문에 애초에 그려질 수가 없다. 그런데 자리는
 * 남는다. reset.css는 role="list"가 붙은 목록만 지우므로, role을 빠뜨린
 * 목록 하나가 조용히 40px 밀린 채로 남는다.
 *
 * 밀린 목록이 «가운데 맞춤»이라고 선언한 장치 안에 있으면, 장치의 잉크
 * 전체가 판면 중심에서 정확히 20px — 들여쓰기의 절반 — 어긋난다. Course와
 * Breakdown이 그렇게 어긋난 채로 배포됐다.
 *
 * 이런 어긋남은 눈으로 잡히지 않는다. 20px은 «틀렸다»로 보이지 않고 «어딘가
 * 어색하다»로만 보이며, 어느 요소가 원인인지는 끝까지 보이지 않는다. 그래서
 * 픽셀이 아니라 규칙으로 본다 — 기호를 그리지 않는 목록은 들여쓰기도 없다.
 */
async function auditListIndent(page, screen, pageName) {
  const leaning = await page.evaluate(() => {
    const out = []

    for (const list of document.querySelectorAll('ul, ol')) {
      const style = getComputedStyle(list)
      const start = Number.parseFloat(style.paddingInlineStart) || 0
      const end = Number.parseFloat(style.paddingInlineEnd) || 0

      if (start === 0 && end === 0) continue

      /*
       * 기호가 실제로 그려지는지는 목록이 아니라 항목에게 물어야 한다.
       * <ol>의 list-style-type이 decimal이어도 항목이 list-item으로 놓이지
       * 않으면 번호는 그려지지 않는다 — 그리고 자리만 남는다. 바로 그 상태가
       * 배포됐었다.
       */
      const drawsMarker = [...list.children].some((item) => {
        if (item.tagName !== 'LI') return false

        const itemStyle = getComputedStyle(item)

        return itemStyle.display.includes('list-item') && itemStyle.listStyleType !== 'none'
      })

      if (drawsMarker) continue

      out.push({
        tag: list.tagName.toLowerCase(),
        cls: typeof list.className === 'string' ? list.className : '(없음)',
        role: list.getAttribute('role') ?? '(없음)',
        start,
        end,
      })
    }

    return out
  })

  if (leaning.length) {
    const worst = leaning[0]

    fail(
      `${screen.name} ${pageName}에 그리지도 않는 기호의 자리를 비워 둔 목록이 ` +
        `${leaning.length}개 있다 — 예: <${worst.tag} class="${worst.cls}" ` +
        `role="${worst.role}">가 앞 ${worst.start}px, 뒤 ${worst.end}px. ` +
        `가운데 맞춤 안에서는 이 차이의 절반만큼 잉크 전체가 옆으로 밀린다.`,
    )
  } else {
    pass(`${screen.name} ${pageName}의 목록이 없는 기호의 자리를 비워 두지 않는다`)
  }
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

    /* 손대기 전에 걷는다. 눌러 본 뒤에 걷으면 눌린 결과를 원문으로 착각한다. */
    collected.set(target.name, await page.evaluate(HARVEST))

    await auditOverflow(page, screen, target.name)
    await auditGutter(page, screen, target.name)
    await auditReach(page, screen, target.name)
    await auditListIndent(page, screen, target.name)
    await auditDevices(page, screen, target, dir)
    await auditReplay(page, screen, target)

    if (target.kind === 'session') await auditClipping(page, screen, dir)
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
