import styles from './KindMark.module.css'

type Props = {
  kind: 'session' | 'thread'
}

/**
 * 두 종류의 콘텐츠가 어떻게 다른지 글자 대신 선으로 말한다.
 *
 *   SESSION  |————————|   양쪽이 닫혀 있다. 경계를 가진 경험.
 *   THREAD   |—————· · ·  한쪽이 열려 있다. 아직 이어지는 중인 생각.
 *
 * 둘은 늘 같은 화면에 나란히 놓인다. 하나만 보면 무슨 뜻인지 알 수 없지만
 * 둘을 나란히 보면 설명이 필요 없다.
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
