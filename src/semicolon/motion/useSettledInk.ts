import { useEffect } from 'react'

/**
 * 지나간 문단의 잉크를 가라앉히는 일 — 스크롤 타임라인이 없는 브라우저용.
 *
 * 규칙 자체는 CSS에 있다(global.css의 .reading p). 그런데 그 문법은 아직
 * 크로미움 계열에만 있어서, 사파리와 파이어폭스에서는 @supports 때문에 아무
 * 일도 일어나지 않는다. 규칙이 «어떤 사람에게는 있고 어떤 사람에게는 없는 것»이
 * 되면 그건 규칙이 아니라 운이다.
 *
 * 그래서 없는 쪽에서만 같은 일을 손으로 한다. 있는 쪽에서는 이 파일이 첫 줄에서
 * 물러난다 — 두 벌이 동시에 돌면 서로를 덮어쓴다.
 *
 * 진행도 계산은 CSS의 cover 구간을 그대로 옮긴 것이다. 값을 다르게 잡으면
 * 브라우저에 따라 다른 화면이 나오고, 그러면 한쪽을 고칠 때 다른 쪽이 조용히
 * 어긋난다.
 */

/** CSS의 animation-range와 같은 구간. 한쪽만 고치면 두 화면이 갈라진다. */
const FROM = 0.48
const TO = 0.76

type Ink = [number, number, number]

type Tracked = {
  /** 물려받은 잉크. 이미 물러나 있는 자리는 자기 색에서 시작해야 한다. */
  from: Ink
  to: Ink
}

/**
 * 색 한 개를 숫자 셋으로.
 *
 * getComputedStyle이 돌려주는 color는 늘 rgb(...) 꼴이라 숫자만 뽑으면 된다.
 * 토큰은 다르다 — 저장된 그대로(#3d3d39) 나온다. 여기에 같은 규칙을 쓰면
 * «3, 3, 39»라는 엉뚱한 색이 나오고, 실제로 그렇게 나왔다. 잉크가 옅어지는
 * 대신 새파랗게 어두워졌다.
 *
 * 그래서 토큰은 브라우저에게 한 번 물어보고 나서 읽는다.
 */
function readInk(value: string): Ink {
  const parts = value.trim().startsWith('rgb') ? value.match(/[\d.]+/g) : null

  if (!parts || parts.length < 3) return [17, 17, 17]

  return [Number(parts[0]), Number(parts[1]), Number(parts[2])]
}

/** 어떤 표기로 적혀 있든 브라우저가 rgb로 바꿔 주게 한다. */
function resolveInk(value: string): Ink {
  const probe = document.createElement('span')

  probe.style.color = value.trim()
  probe.style.display = 'none'
  document.body.append(probe)

  const ink = readInk(getComputedStyle(probe).color)

  probe.remove()

  return ink
}

export function useSettledInk(routeKey: string): void {
  useEffect(() => {
    /* 브라우저가 스스로 하는 일이면 손대지 않는다. */
    if (typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')) return

    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (quiet.matches) return

    const settled = resolveInk(
      getComputedStyle(document.documentElement).getPropertyValue('--color-text-muted'),
    )

    /* 화면 안에 있는 문단만 갖고 있는다. 대개 열 몇 개라 매 프레임 훑어도 싸다. */
    const seen = new Map<HTMLElement, Tracked>()

    const watch = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement

        if (!entry.isIntersecting) {
          seen.delete(el)
          el.style.removeProperty('color')
          continue
        }

        if (seen.has(el)) continue

        /*
         * 물려받은 색은 자기 색을 지우고 나서 읽어야 한다. 앞서 칠해 둔 값이
         * 남아 있으면 그 값을 시작점으로 삼고, 스크롤할 때마다 조금씩 더
         * 가라앉아 결국 읽을 수 없게 된다.
         */
        el.style.removeProperty('color')

        seen.set(el, { from: readInk(getComputedStyle(el).color), to: settled })
      }

      paint()
    })

    let frame: number | undefined

    function paint() {
      if (frame !== undefined) return

      frame = requestAnimationFrame(() => {
        frame = undefined

        const height = window.innerHeight

        for (const [el, ink] of seen) {
          const box = el.getBoundingClientRect()

          /*
           * CSS의 cover 진행도. 문단의 위 모서리가 판면 아래에 닿는 순간이 0,
           * 아래 모서리가 판면 위로 빠져나가는 순간이 1이다.
           */
          const travel = height + box.height
          const cover = travel > 0 ? (height - box.top) / travel : 0
          const t = Math.min(1, Math.max(0, (cover - FROM) / (TO - FROM)))

          const [r, g, b] = ink.from
          const [dr, dg, db] = ink.to

          el.style.color = `rgb(${Math.round(r + (dr - r) * t)} ${Math.round(
            g + (dg - g) * t,
          )} ${Math.round(b + (db - b) * t)})`
        }
      })
    }

    for (const el of document.querySelectorAll<HTMLElement>('.reading p')) watch.observe(el)

    window.addEventListener('scroll', paint, { passive: true })
    window.addEventListener('resize', paint)

    return () => {
      watch.disconnect()
      window.removeEventListener('scroll', paint)
      window.removeEventListener('resize', paint)

      if (frame !== undefined) cancelAnimationFrame(frame)

      for (const el of seen.keys()) el.style.removeProperty('color')
    }
    /* 라우트가 바뀌면 문단이 통째로 갈리므로 다시 건다. */
  }, [routeKey])
}
