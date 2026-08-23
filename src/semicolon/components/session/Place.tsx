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
 * 한 줄을 글자 단위로 쪼갠다.
 *
 * 물음표가 여러 번 반복되므로 글자만으로는 서로를 구분할 수 없다. 몇 번째
 * 자리인가가 곧 그 글자의 정체라, 자리를 이름에 넣어 둔다. step은 그 글자가
 * 몇 번째로 눌릴지를 정한다.
 */
function toGlyphs(line: string) {
  return [...line].map((glyph, index) => ({ id: `${index}:${glyph}`, glyph, step: index }))
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
            {toGlyphs(address).map(({ id, glyph, step }) =>
              glyph === ' ' ? (
                ' '
              ) : (
                <span key={id} className={styles.glyph} style={{ '--step': step } as CSSProperties}>
                  {glyph}
                </span>
              ),
            )}
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
