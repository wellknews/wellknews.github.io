/**
 * MAMABOY 화면을 실제로 열어 보고 확인하는 검사.
 *
 * `npm run audit`은 SEMICOLON의 판면을 본다. 이 파일은 마마보이를 같은 방식으로
 * 본다 — 타입 검사와 린트가 통과한 뒤에도 남는 잘못은 «열어 봐야만 보이는»
 * 종류이기 때문이다.
 *
 * 여기 있는 항목은 전부 이 지면을 만들면서 실제로 한 번씩 냈던 잘못이다.
 *
 *   1. 가로 넘침    어느 폭에서도 옆으로 밀리지 않는지. 화면보다 크게 잡아 둔
 *                   배경 겹이 밖으로 새어 스크롤을 만든 적이 있다.
 *   2. 작은 글자    12px 아래로 내려간 글자가 없는지. 라벨을 11px로 줄여
 *                   배포한 적이 있다.
 *   3. 작은 타깃    손가락으로 누를 것이 44px 아래로 작아지지 않았는지.
 *                   유리 안에 앉은 버튼이 36px에서 멈춰 있던 적이 있다.
 *   4. 겹친 타깃    누를 것들의 히트 영역이 서로 겹치지 않는지. 넓히기만 하고
 *                   간격을 보지 않으면 옆의 것이 눌린다.
 *   5. 안 열린 글   움직임을 끈 사람에게 모든 기사가 보이는지. 스크롤로 열리는
 *                   글은 그 사람에게는 열리지 않는다.
 *   6. 흐린 채 남음 스크롤을 내려도 화면 한가운데의 기사가 흐린 채 남지 않는지.
 *   7. 죽은 검색    «/»로 열리고, 치면 걸리고, 칩으로 좁혀지고, Escape로 닫히는지.
 *   8. 그림이 다 죽었을 때  이미지를 전부 막아도 지면이 남는지. 외부 이미지는
 *                   언제든 사라진다는 것이 이 매거진의 전제다.
 *   9. 무너진 구조  h1이 하나인지, 제목 단계를 건너뛰지 않는지, 이름 없는
 *                   링크와 버튼이 없는지. 눈으로는 멀쩡해 보이는 자리다.
 *  10. 낮은 대비    모든 글자가 배경 기준 6:1을 넘는지. 반투명한 유리 위의
 *                   글자는 아래 색까지 섞어서 재야 실제 대비가 나온다.
 *
 * 실행: npm run audit:mamaboy   (개발 서버가 없으면 알아서 띄운다.)
 */
import { spawn } from 'node:child_process'

import { chromium } from 'playwright'

const PORT = Number(process.env.AUDIT_PORT ?? 5299)
const BASE = `http://localhost:${PORT}/mamaboy`

/** 검사할 폭. 가장 좁은 화면과 가장 넓은 화면을 양 끝에 둔다. */
const SCREENS = [
  { name: 'tiny', width: 320, height: 700, touch: true },
  { name: 'compact', width: 390, height: 844, touch: true },
  { name: 'snug', width: 768, height: 1024, touch: true },
  { name: 'wide', width: 1440, height: 900, touch: false },
]

/*
 * 한 폭만 다시 보고 싶을 때가 있다 — 검사를 고치는 중에는 특히 그렇다.
 * AUDIT_SCREENS=tiny,wide 처럼 이름을 주면 그것만 본다.
 */
const only = (process.env.AUDIT_SCREENS ?? '')
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean)

const screens = only.length ? SCREENS.filter((screen) => only.includes(screen.name)) : SCREENS

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'skin', path: '/skin' },
  { name: 'age', path: '/age' },
  { name: 'culture', path: '/culture' },
  { name: 'sources', path: '/sources' },
  { name: 'not-found', path: '/없는주소' },
]

const failures = []

function fail(message) {
  failures.push(message)
  console.error(`  ✗ ${message}`)
}

function pass(message) {
  console.log(`  ✓ ${message}`)
}

/**
 * 한 화면에서 눈으로 확인할 것을 한 번에 걷어 온다.
 *
 * 브라우저 안에서 도는 함수라 바깥의 것을 참조하지 않는다.
 */
const INSPECT = () => {
  const viewportWidth = document.documentElement.clientWidth
  const overflow = document.documentElement.scrollWidth - viewportWidth

  /*
   * 스스로 자르거나 굴리는 조상 안에 있으면 밖으로 나가도 사고가 아니다.
   *
   * 다만 #root와 <body>·<html>은 세지 않는다. 이 지면은 #root에 overflow-x:
   * clip을 두고 있어서 무엇이 얼마나 새든 스크롤은 생기지 않는다. 그것까지
   * «자르는 조상»으로 치면 검사는 아무것도 잡지 못한다 — 실제로 2000px짜리
   * 요소를 넣어 봤더니 그대로 통과했다. 뿌리의 clip은 사고를 막아 주는 장치이지
   * 사고가 없다는 증거가 아니다. 그래서 여기서는 «굴러가는가»가 아니라 «잘려
   * 나가는가»를 본다.
   */
  const clipped = (element) => {
    for (
      let parent = element.parentElement;
      parent &&
      parent.id !== 'root' &&
      parent !== document.body &&
      parent !== document.documentElement;
      parent = parent.parentElement
    ) {
      const style = getComputedStyle(parent)
      const values = [style.overflow, style.overflowX]

      if (values.some((value) => ['hidden', 'clip', 'auto', 'scroll'].includes(value))) return true
    }

    return false
  }

  const shown = (element) => {
    const box = element.getBoundingClientRect()
    const style = getComputedStyle(element)

    return box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.opacity !== '0'
  }

  const outside = []
  const small = []
  const tight = []
  const targets = []

  for (const element of document.querySelectorAll('main *, header *, footer *')) {
    if (!shown(element)) continue

    const box = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    const name = `${element.tagName}.${String(element.className).slice(0, 26)}`

    /* 글자 크기는 그 요소가 직접 들고 있는 글에만 묻는다. 부모까지 세면 같은 글을 여러 번 센다. */
    const ownsText = [...element.childNodes].some(
      (node) => node.nodeType === 3 && node.textContent.trim(),
    )
    const carriesContent = ownsText || element.matches('img, a, button, input, summary')

    /*
     * 색면과 젤은 일부러 판면보다 크게 잡혀 있고 그것이 이 지면의 소재다.
     * 잃을 것이 있는 것 — 글자·그림·누를 것 — 만 사고로 센다.
     */
    if (
      box.right > viewportWidth + 1 &&
      style.position !== 'fixed' &&
      carriesContent &&
      !clipped(element)
    )
      outside.push(name)

    if (ownsText && parseFloat(style.fontSize) < 12) small.push(`${style.fontSize} ${name}`)

    if (element.matches('a, button, input, summary, [role="button"]')) {
      const label = (element.textContent ?? '').trim().slice(0, 14)

      if (box.height < 44) tight.push(`${Math.round(box.height)}px «${label}»`)

      targets.push({ box, label })
    }
  }

  /* 히트 영역이 서로 겹치면 옆의 것이 눌린다. 하나가 다른 하나를 통째로 감싼 경우는 뺀다. */
  const overlaps = []

  for (let i = 0; i < targets.length; i += 1) {
    for (let j = i + 1; j < targets.length; j += 1) {
      const a = targets[i].box
      const b = targets[j].box
      const vertical = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
      const horizontal = Math.min(a.right, b.right) - Math.max(a.left, b.left)
      const nested =
        (a.top <= b.top && a.bottom >= b.bottom) || (b.top <= a.top && b.bottom >= a.bottom)

      if (vertical > 2 && horizontal > 2 && !nested)
        overlaps.push(`«${targets[i].label}»×«${targets[j].label}» ${Math.round(vertical)}px`)
    }
  }

  return {
    overflow,
    outside: [...new Set(outside)],
    small: [...new Set(small)],
    tight: [...new Set(tight)],
    overlaps: [...new Set(overlaps)],
  }
}

async function auditLayout(page, screen, pageName) {
  const found = await page.evaluate(INSPECT)

  if (found.overflow > 0) fail(`${screen.name} ${pageName} 가로로 ${found.overflow}px 넘친다`)
  else pass(`${screen.name} ${pageName} 가로 넘침 없음`)

  for (const name of found.outside) fail(`${screen.name} ${pageName} ${name}이 화면 밖으로 나간다`)
  for (const item of found.small) fail(`${screen.name} ${pageName} 글자가 12px 아래다 — ${item}`)
  for (const item of found.tight) fail(`${screen.name} ${pageName} 타깃이 44px 아래다 — ${item}`)
  for (const item of found.overlaps) fail(`${screen.name} ${pageName} 타깃끼리 겹친다 — ${item}`)

  if (!found.outside.length && !found.small.length && !found.tight.length && !found.overlaps.length)
    pass(`${screen.name} ${pageName} 12px · 44px 하한 통과`)
}

/**
 * 스크롤로 열리는 글이 실제로 열리는가.
 *
 * 화면 한가운데에 와 있는데도 흐린 채 남아 있으면 그 사람에게는 없는 기사다.
 */
async function auditReveal(page, screen, pageName) {
  const height = await page.evaluate(() => document.body.scrollHeight)
  let worst = 0

  for (let y = 0; y <= height; y += 300) {
    await page.evaluate((to) => window.scrollTo(0, to), y)
    await page.waitForTimeout(110)

    worst = Math.max(
      worst,
      await page.evaluate(() => {
        const middle = innerHeight

        return [...document.querySelectorAll('main .reveal, main article, main li')].filter(
          (element) => {
            const box = element.getBoundingClientRect()
            const inView = box.top < middle * 0.8 && box.bottom > middle * 0.2

            return inView && parseFloat(getComputedStyle(element).opacity) < 0.5
          },
        ).length
      }),
    )
  }

  await page.evaluate(() => window.scrollTo(0, 0))

  if (worst > 0) fail(`${screen.name} ${pageName} 화면 한가운데에서 흐린 채 남은 기사 ${worst}건`)
  else pass(`${screen.name} ${pageName} 스크롤 내내 흐린 채 남는 기사 없음`)
}

/** 움직임을 끈 사람에게 모든 기사가 보이는가. */
async function auditReducedMotion(page, screen, pageName) {
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll('main article, main li, main .reveal')].filter((element) => {
        const style = getComputedStyle(element)

        return parseFloat(style.opacity) < 0.9 || style.visibility === 'hidden'
      }).length,
  )

  if (hidden > 0) fail(`${screen.name} ${pageName} 움직임을 끈 화면에서 안 보이는 기사 ${hidden}건`)
  else pass(`${screen.name} ${pageName} 움직임을 꺼도 전부 보인다`)
}

/**
 * 눈으로는 멀쩡해 보이는 구조.
 *
 * 제목 단계와 이름은 화면에서 확인할 수 없다. 그것이 무너져 있으면 스크린리더로
 * 읽는 사람에게만 지면이 다르게 보인다.
 */
async function auditStructure(page, screen, pageName) {
  const found = await page.evaluate(() => {
    const issues = []
    const headings = [...document.querySelectorAll('main h1, main h2, main h3, main h4')]
    const ones = headings.filter((heading) => heading.tagName === 'H1')

    if (ones.length !== 1) issues.push(`h1이 ${ones.length}개다`)

    let previous = 0

    for (const heading of headings) {
      const level = Number(heading.tagName[1])

      if (previous && level > previous + 1)
        issues.push(
          `제목 단계를 건너뛴다 h${previous}→h${level} «${heading.textContent.trim().slice(0, 18)}»`,
        )

      previous = level
    }

    for (const tag of ['main', 'header', 'footer'])
      if (!document.querySelector(tag)) issues.push(`${tag}가 없다`)

    if (document.documentElement.lang !== 'ko') issues.push('html의 lang이 ko가 아니다')

    for (const image of document.querySelectorAll('img'))
      if (image.getAttribute('alt') === null) issues.push('alt를 적지 않은 그림이 있다')

    for (const element of document.querySelectorAll('a, button')) {
      const box = element.getBoundingClientRect()

      if (box.width === 0 || box.height === 0) continue

      const name = (element.textContent ?? '').trim() || element.getAttribute('aria-label')

      if (!name) issues.push(`이름이 없는 ${element.tagName === 'A' ? '링크' : '버튼'}`)
    }

    return [...new Set(issues)]
  })

  for (const issue of found) fail(`${screen.name} ${pageName} ${issue}`)

  if (!found.length) pass(`${screen.name} ${pageName} 구조 — h1 하나 · 단계 · 이름 · 랜드마크`)
}

/**
 * 대비.
 *
 * 이 지면의 유리와 젤은 반투명이라 배경색 하나만 보면 실제 대비가 나오지 않는다.
 * 조상의 반투명한 겹을 바깥에서 안쪽으로 차례로 섞은 뒤에 잰다.
 */
async function auditContrast(page, screen, pageName) {
  const low = await page.evaluate(() => {
    const paper = [245, 239, 228]

    /* rgb()와 color(srgb …)를 모두 0..255로 읽는다. 후자의 성분은 0..1 실수다. */
    const channels = (value) => {
      const numbers = (value.match(/-?\d*\.?\d+/g) ?? []).map(Number)

      return value.startsWith('color(')
        ? numbers.slice(0, 3).map((n) => n * 255)
        : numbers.slice(0, 3)
    }
    const alpha = (value) => {
      const numbers = (value.match(/-?\d*\.?\d+/g) ?? []).map(Number)

      return numbers.length > 3 ? numbers[3] : 1
    }
    const luminance = ([r, g, b]) => {
      const f = (c) => {
        const v = c / 255

        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
      }

      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }

    const out = []

    for (const element of document.querySelectorAll('main *, header *, footer *')) {
      if (![...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim()))
        continue

      const style = getComputedStyle(element)
      const box = element.getBoundingClientRect()

      if (box.width === 0 || style.visibility === 'hidden' || style.opacity === '0') continue

      const layers = []

      for (let parent = element; parent; parent = parent.parentElement) {
        const background = getComputedStyle(parent).backgroundColor

        if (background && background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent')
          layers.push(background)
      }

      let behind = paper

      for (const layer of layers.reverse()) {
        const color = channels(layer)
        const a = alpha(layer)

        behind = color.map((value, index) => value * a + behind[index] * (1 - a))
      }

      const front = luminance(channels(style.color))
      const back = luminance(behind)
      const ratio = (Math.max(front, back) + 0.05) / (Math.min(front, back) + 0.05)

      if (ratio < 6)
        out.push(
          `${ratio.toFixed(2)}:1 «${element.textContent.trim().slice(0, 18)}» ${Math.round(parseFloat(style.fontSize))}px`,
        )
    }

    return [...new Set(out)]
  })

  for (const item of low) fail(`${screen.name} ${pageName} 대비가 6:1 아래다 — ${item}`)

  if (!low.length) pass(`${screen.name} ${pageName} 모든 글자가 6:1 이상`)
}

/** 검색이 열리고, 걸리고, 좁혀지고, 닫히는가. */
async function auditSearch(page, screen) {
  await page.keyboard.press('/')
  await page.waitForTimeout(300)

  if (!(await page.evaluate(() => document.querySelector('dialog')?.open ?? false))) {
    fail(`${screen.name} «/»를 눌러도 검색이 열리지 않는다`)
    return
  }

  const starters = await page.locator('dialog ul li').count()

  if (starters === 0) fail(`${screen.name} 검색을 열었을 때 아무것도 건네지 않는다`)

  await page.fill('#mamaboy-search', '피부')
  await page.waitForTimeout(250)

  const matched = await page.locator('dialog ul li').count()

  if (matched === 0) {
    fail(`${screen.name} «피부»로 걸리는 것이 없다`)
  } else {
    const chips = page.locator('dialog fieldset button')

    if ((await chips.count()) > 1) {
      await chips.nth(1).click()
      await page.waitForTimeout(250)

      const narrowed = await page.locator('dialog ul li').count()

      if (narrowed > matched || narrowed === 0)
        fail(`${screen.name} 칩으로 좁혔는데 ${matched}건이 ${narrowed}건이 됐다`)
    }
  }

  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)

  if (await page.evaluate(() => document.querySelector('dialog')?.open ?? false))
    fail(`${screen.name} Escape로 검색이 닫히지 않는다`)
  else pass(`${screen.name} 검색 — 열림 · ${matched}건 · 좁히기 · 닫힘`)
}

/**
 * 그림이 전부 죽었을 때.
 *
 * 외부 이미지는 언제든 사라진다(§37). 그때 회색 상자가 남는 것이 아니라 기사가
 * 타이포그래피 카드로 바뀌어야 하고, 지면 자체는 그대로 있어야 한다.
 */
async function auditWithoutImages(browser, screen) {
  const context = await browser.newContext({
    viewport: { width: screen.width, height: screen.height },
    isMobile: screen.touch,
    hasTouch: screen.touch,
  })

  await context.route('**/*', (route) =>
    route.request().resourceType() === 'image' ? route.abort() : route.continue(),
  )

  const page = await context.newPage()

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  /*
   * 끝까지 한 번 내려갔다 온다.
   *
   * 지면의 그림은 첫 화면의 것만 즉시 받고 나머지는 지연 로드다(§36). 내려가
   * 보지 않으면 화면 밖의 그림은 아직 요청조차 하지 않은 상태라 실패할 기회도
   * 없고, «죽은 그림이 자리를 차지한 채 남아 있다»는 판정이 거짓으로 나온다.
   */
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
  })
  await page.waitForTimeout(900)

  const state = await page.evaluate(() => ({
    stories: document.querySelectorAll('main a[href*="/article/"]').length,
    images: document.querySelectorAll('main img').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }))

  if (state.stories === 0) fail(`${screen.name} 그림이 전부 죽으면 지면에 기사가 남지 않는다`)
  else if (state.images > 0)
    fail(`${screen.name} 죽은 그림 ${state.images}개가 자리를 차지한 채 남아 있다`)
  else if (state.overflow > 0) fail(`${screen.name} 그림 없는 지면이 가로로 넘친다`)
  else pass(`${screen.name} 그림이 전부 죽어도 기사 ${state.stories}건이 글로 남는다`)

  await context.close()
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

let server

if (await waitForServer(`${BASE}/`, 1)) {
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

function watch(page, label) {
  page.on('pageerror', (error) => fail(`${label} 콘솔 예외: ${error.message}`))
  page.on('requestfailed', (request) => {
    /*
     * 우리 것이 실패했을 때만 센다.
     *
     * 지면에 걸리는 그림은 남의 서버에 있고, 그것이 죽는 것은 이 매거진의
     * 전제다(§37) — 죽었을 때 지면이 어떻게 되는지는 아래 auditWithoutImages가
     * 따로 본다. 게다가 이 저장소의 개발 환경은 바깥으로 나가는 요청을 막아
     * 두어서, 바깥 주소까지 세면 검사가 «전부 실패»만 말하게 된다.
     */
    const url = request.url()

    if (url.startsWith(BASE.replace('/mamaboy', '')) && !url.includes('/@vite'))
      fail(`${label} 요청 실패: ${url}`)
  })
}

for (const screen of screens) {
  console.log(`\n── ${screen.name} (${screen.width}px) ──`)

  const context = {
    viewport: { width: screen.width, height: screen.height },
    deviceScaleFactor: 2,
    isMobile: screen.touch,
    hasTouch: screen.touch,
  }

  const page = await browser.newPage(context)

  watch(page, screen.name)

  for (const target of PAGES) {
    await page.goto(`${BASE}${target.path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    await auditLayout(page, screen, target.name)
    await auditStructure(page, screen, target.name)
    await auditContrast(page, screen, target.name)

    if (target.name === 'home') await auditReveal(page, screen, target.name)
  }

  /* 기사 화면은 주소를 외우지 않고 지면에서 눌러 들어간다. slug가 바뀌어도 따라간다. */
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.locator('main a[href*="/article/"]').first().click()
  await page.waitForTimeout(600)
  await auditLayout(page, screen, 'article')
  await auditStructure(page, screen, 'article')
  await auditContrast(page, screen, 'article')

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await auditSearch(page, screen)

  await page.close()

  /* 같은 폭을 움직임 없이 한 번 더 본다. 여기서만 보이는 잘못이 따로 있다. */
  const still = await browser.newPage({ ...context, reducedMotion: 'reduce' })

  watch(still, `${screen.name}(정지)`)

  for (const target of PAGES) {
    await still.goto(`${BASE}${target.path}`, { waitUntil: 'networkidle' })
    await still.waitForTimeout(400)

    await auditReducedMotion(still, screen, target.name)
  }

  await still.close()

  await auditWithoutImages(browser, screen)
}

await browser.close()
server?.kill()

console.log('')

if (failures.length) {
  console.error(`검사 실패 ${failures.length}건`)
  process.exit(1)
}

console.log('검사 통과')
