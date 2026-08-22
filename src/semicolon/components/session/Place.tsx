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
export function Place({ name, address, district, date }: Props) {
  const where = [district, date].filter(Boolean).join(' · ')

  return (
    <div className={styles.place}>
      <p className={styles.name}>{name}</p>

      {address ? (
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
