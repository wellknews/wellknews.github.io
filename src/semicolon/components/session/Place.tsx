import type { CSSProperties } from 'react'

import styles from './Place.module.css'

type Props = {
  /** 'WHANKI MUSEUM' — 라틴 대문자로 짧게. */
  name: string
  /** '서울 종로구 자하문로40길 63' */
  address?: string
  /** 'BUAM-DONG' — 동네가 바뀐 것을 알린다. */
  district?: string
  /** '2026.08.22' — 하루짜리 기록에서는 처음 한 번이면 충분하다. */
  date?: string
  /**
   * 주소를 끝내 몰랐던 자리.
   *
   * 자리를 비우는 것과 모르는 것은 다르다. 비우면 아직 안 채운 칸으로 보이고,
   * 모른다고 적으면 그날의 상태가 된다. 그래서 주소 줄을 지우지 않고 주소의
   * 모양만 남긴다 — 어디가 구이고 어디가 도로명이고 어디가 번호인지는
   * 그대로 보이는데, 그 자리에 들어갈 것을 하나도 읽지 못한 상태다.
   *
   * 지도로는 걸지 않는다. 링크가 하나 생기는 순간 «모르는 곳»이 «찾아갈 수
   * 있는 곳»이 된다.
   */
  unknown?: boolean
}

/**
 * 그날 간판에 있던 글자들.
 *
 * 러시아어인지 몽골어인지 끝내 몰랐다. 두 문자가 원래 비슷해서 구분하지
 * 못한 것인지도 몰랐다. 그래서 아무 기호나 쓰지 않고 실제로 그때 눈앞에
 * 있었을 법한 글자를 쓴다 — 읽히지 않는 것이 요점이지 낯설어 보이는 것이
 * 요점이 아니다.
 *
 * 고정폭 글자체(IBM Plex Mono)가 이 글자들을 전부 가지고 있어서 물음표와
 * 폭이 정확히 같다. 폭이 흔들리면 줄이 늘었다 줄었다 하며 옆 글자를 민다.
 */
const FOREIGN = 'ЖЩЫЭЮЯФДЛЦЧШБГИП'

/** 한 자리가 지나가는 낯선 글자의 수. */
const PASSES = 4

/**
 * 한 줄을 글자 단위로 쪼갠다.
 *
 * 물음표만 낯선 글자로 흩어진다. 서울과 구와 로는 가만히 있는다 — 주소의
 * 골격은 알고 있었고 거기 들어갈 값을 못 읽은 것이지, 주소라는 사실 자체를
 * 몰랐던 것은 아니다.
 *
 * 자리마다 다른 글자를 뽑는다. 같은 글자가 나란히 지나가면 흩어지는 것이
 * 아니라 무늬가 된다.
 */
function toGlyphs(line: string) {
  return [...line].map((glyph, index) => ({
    id: `${index}:${glyph}`,
    glyph,
    step: index,
    masked: glyph === '?',
    passes: Array.from({ length: PASSES }, (_, pass) => ({
      id: `${index}:${pass}`,
      pass,
      foreign: FOREIGN[(index * 5 + pass * 3) % FOREIGN.length],
    })),
  }))
}

/**
 * 주소를 정보가 아니라 활자로 쓴다.
 *
 * 여행기에서 주소를 본문처럼 적으면 그 페이지는 관광 안내가 된다. 그래서
 * 여기서는 주소를 «장소가 바뀌었다»는 사실만 알리는 판면의 메타데이터로 둔다.
 * 핀 아이콘도, 지도 조각도, 테두리 상자도 두지 않는다. 이 셋 중 하나만 있어도
 * 기록이 지도 앱의 한 화면처럼 보이기 시작한다.
 *
 * 주소는 지도로 연결되지만 링크처럼 꾸미지 않는다. 밑줄도 색도 주지 않고,
 * 커서를 올렸을 때만 작은 화살표가 뒤에 선다. 손가락에는 그 화살표를 두지
 * 않는다 — 힌트를 줄 수 없는 자리에 힌트 자리만 비워 두면 그게 더 어수선하다.
 */
export function Place({ name, address, district, date, unknown = false }: Props) {
  const where = [district, date].filter(Boolean).join(' · ')

  return (
    <div className={styles.place}>
      <p className={styles.name}>{name}</p>

      {unknown && address ? (
        <p className={`mono ${styles.address} ${styles.unknown}`}>
          {/* 읽어 주는 쪽에는 한 줄로 전한다. 글자를 쪼개는 것은 화면에서만 하는 일이다. */}
          <span className="visually-hidden">{address}</span>

          <span aria-hidden="true">
            {toGlyphs(address).map(({ id, glyph, step, masked, passes }) => {
              if (glyph === ' ') return ' '
              if (!masked) return <span key={id}>{glyph}</span>

              return (
                <span key={id} className={styles.slot} style={{ '--step': step } as CSSProperties}>
                  {passes.map(({ id: passId, pass, foreign }) => (
                    <span
                      key={passId}
                      className={styles.pass}
                      style={{ '--pass': pass } as CSSProperties}
                    >
                      {foreign}
                    </span>
                  ))}

                  <span className={styles.settled}>{glyph}</span>
                </span>
              )
            })}
          </span>
        </p>
      ) : null}

      {!unknown && address ? (
        <p className={`mono ${styles.address}`}>
          <a
            className={styles.link}
            href={`https://map.naver.com/p/search/${encodeURIComponent(address)}`}
            target="_blank"
            rel="noreferrer"
          >
            {address}
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </a>
        </p>
      ) : null}

      {where ? <p className={`mono ${styles.where}`}>{where}</p> : null}
    </div>
  )
}
