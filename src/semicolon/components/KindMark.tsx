import styles from './KindMark.module.css'

export type Kind = 'session' | 'thread' | 'code'

type Props = {
  kind: Kind
}

/**
 * 세 종류의 콘텐츠가 어떻게 다른지 글자 대신 선으로 말한다.
 *
 *   SESSION  |————————|   양쪽이 닫혀 있고 안은 하나다. 경계를 가진 경험.
 *   THREAD   |—————· · ·  한쪽이 열려 있다. 아직 이어지는 중인 생각.
 *   CODE     |—|—|—|—|—|  닫혀 있는데 안이 나뉘어 있다. 커밋으로 이루어진 변경.
 *
 * 셋은 늘 같은 화면에 나란히 놓인다. 하나만 보면 무슨 뜻인지 알 수 없지만
 * 셋을 나란히 보면 설명이 필요 없다 — 하나는 통째로 있고, 하나는 끝나지 않고,
 * 하나는 조각으로 되어 있다.
 *
 * 다가갔을 때 점이 움직이는 방식까지 셋이 다르다. 세션의 점은 미끄러져 가
 * 벽 앞에 서고, 스레드의 점들은 판을 넘어 흘러 나가고, 코드의 점은 눈금과
 * 눈금 사이를 건너뛴다. 코드에는 «중간»이 없다 — 커밋과 커밋 사이의 상태는
 * 어디에도 존재한 적이 없다. 그 사실을 문장으로 적는 대신 점이 연기한다.
 *
 * 눈금 자리는 CSS와 함께 정해져 있다(global.css의 .kindStep). 여기서 x를
 * 옮기면 그쪽의 이동 거리도 같이 옮겨야 점이 눈금 위에 선다.
 */
export function KindMark({ kind }: Props) {
  return (
    <svg
      className={styles.mark}
      viewBox="0 0 64 12"
      width="64"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      /* 흘러 나가는 점이 판 밖으로 나갈 수 있어야 한다. */
      overflow="visible"
    >
      <path d="M0.5 1.5 V10.5" />

      {kind === 'session' ? (
        <>
          <path d="M0.5 6.5 H63.5" />
          <path d="M63.5 1.5 V10.5" />
          <circle
            className="kindRunner"
            cx="0.5"
            cy="6.5"
            r="1.5"
            fill="currentColor"
            stroke="none"
          />
        </>
      ) : kind === 'code' ? (
        <>
          <path d="M0.5 6.5 H63.5" />
          <path d="M63.5 1.5 V10.5" />

          {/*
            안쪽의 눈금.
            바깥의 두 벽보다 짧다. 범위를 정하는 것은 여전히 양 끝이고,
            눈금은 그 안이 한 덩어리가 아니라는 사실만 말한다.
          */}
          <g opacity="0.55">
            <path d="M14.5 4 V9" />
            <path d="M28.5 4 V9" />
            <path d="M42.5 4 V9" />
            <path d="M56.5 4 V9" />
          </g>

          <circle
            className="kindStep"
            cx="0.5"
            cy="6.5"
            r="1.5"
            fill="currentColor"
            stroke="none"
          />
        </>
      ) : (
        <>
          <path d="M0.5 6.5 H44" />
          <g className="kindTrail">
            <circle cx="50" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
            <circle cx="56" cy="6.5" r="0.75" fill="currentColor" stroke="none" opacity="0.55" />
            <circle cx="62" cy="6.5" r="0.75" fill="currentColor" stroke="none" opacity="0.25" />
          </g>
        </>
      )}
    </svg>
  )
}
