import styles from './Condition.module.css'

/** 눈금의 개수. 열 칸이면 «거의 다 찼다»와 «반쯤»이 한눈에 갈린다. */
const STEPS = 10

export type Reading = {
  label: string
  /** 0~10. 잴 수 없는 것은 숫자 대신 그 사실을 적는다. */
  value: number | string
}

type Props = {
  readings: readonly Reading[]
}

/**
 * 그때의 몸 상태.
 *
 * 게임의 체력 바처럼 만들지 않는다. 색도 아이콘도 없고 눈금은 잉크 한 가지로
 * 찍힌다. 이 장치가 웃긴 이유는 화려해서가 아니라, 하루 종일 예술과 철학을
 * 읽던 페이지가 갑자기 자기 몸을 계기판으로 재기 시작하기 때문이다.
 *
 * 잴 수 없는 항목은 비워 두지 않고 잴 수 없다고 적는다. 그 칸이 이 계기판에서
 * 제일 정직한 자리다.
 */
export function Condition({ readings }: Props) {
  return (
    <div className={styles.condition}>
      <p className={`mono ${styles.head}`}>CONDITION</p>

      <ul className={styles.rows} role="list">
        {readings.map((reading) => {
          /* 좁혀 둔 값을 따로 잡아 둔다. 콜백 안에서는 typeof 검사가 유지되지 않는다. */
          const level = typeof reading.value === 'number' ? reading.value : null

          return (
            <li key={reading.label}>
              <span className={`mono ${styles.label}`}>{reading.label}</span>

              {level === null ? (
                <span className={`mono ${styles.unknown}`}>{reading.value}</span>
              ) : (
                <>
                  <span className={styles.gauge} aria-hidden="true">
                    {Array.from({ length: STEPS }, (_, step) => (
                      <span key={step} data-filled={step < level} />
                    ))}
                  </span>

                  {/* 눈금은 그림이다. 읽어 주는 쪽에는 숫자를 그대로 남긴다. */}
                  <span className="visually-hidden">{`${level} / ${STEPS}`}</span>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
