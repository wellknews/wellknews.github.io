import type { CSSProperties } from 'react'

import styles from './EmotionDial.module.css'

type Props = {
  /**
   * 원인을 찾는 동안 지나간 이름들. 마지막이 실제 원인이다.
   *
   * 앞의 것들이 틀린 답이라는 뜻은 아니다. 짜증도 사실이었고 벌이라는 생각도
   * 그때는 진심이었다. 다만 그 어느 것도 «왜 계속 가고 있는가»를 설명하지는
   * 못했고, 설명하지 못하는 이름은 붙여 봐야 지나간다.
   */
  candidates: readonly string[]
  /**
   * 원인을 알아낸 뒤의 상태.
   *
   * 후보가 아니다. 이것까지 다이얼에 걸어 두면 «다섯 개 중에 평정을 고르는
   * 일»이 되는데, 실제로 일어난 일은 고르는 것이 아니라 이름이 맞아떨어진
   * 다음에 저절로 온 것이다. 그래서 눈금 밖에 따로 앉는다.
   */
  after: string
}

/**
 * 감정에 이름을 붙이는 일.
 *
 * 기계식 다이얼이다. 가운데에 고정된 기준선이 하나 있고, 이름들이 옆으로
 * 지나가면서 그 선을 통과한다. 마지막 이름이 선에 걸리면 움직임이 멎는다.
 * 카메라의 조그 다이얼이 홈에 들어갈 때처럼, 마지막 몇 픽셀에서 한 번
 * 당겨지고 끝난다.
 *
 * 퀴즈가 아니다.
 *
 * 맞혔다고 알려 주는 화면을 만들면 이 장면은 심리검사가 되고, 그러면 읽는
 * 사람이 하는 일이 «정답 확인»이 된다. 실제로 일어난 일은 그것과 반대다 —
 * 정답이 있어서 찾은 것이 아니라, 정확한 이름을 찾고 나니 상태가 달라졌다.
 * 그래서 여기서 달라지는 것은 두 가지뿐이다. 잉크의 농도와, 기준선에
 * 맞아 들어가는 정렬. 색도 빛도 진동도 없다.
 *
 * 움직이는 것은 스크롤이다. 눌러야 돌아가는 다이얼로 만들면 읽는 데 필요한
 * 것을 손가락의 대가로 걸게 되고, 그러면 이 장면은 안 만진 사람에게 없는
 * 장면이 된다.
 *
 * 움직임이 없는 화면에서는 눈금이 통째로 펼쳐진다. 다이얼은 창 하나만
 * 보여 주는 물건이라 멎어 있으면 지나간 이름들이 창 밖에 남는데, 여기서는
 * 그 이름들이 내용이다. 그래서 이 판면의 기본은 «멎은 다이얼»이 아니라
 * «펼쳐진 눈금»이고, 다이얼은 움직일 수 있는 화면에서만 다이얼이 된다
 * (EmotionDial.module.css).
 *
 * 이름 하나하나는 문단이 아니다.
 *
 * 처음에는 목록의 항목으로 두었는데, 그러면 지면의 검사가 이름 하나하나를
 * «판면에 앉은 글 한 덩어리»로 보고 저마다 좌우 여백을 갖고 있는지 묻는다.
 * 창 밖으로 지나간 이름은 당연히 그 여백을 못 가지므로 매번 걸렸고, 사실
 * 그 지적이 맞았다 — 여백을 가져야 하는 것은 창이지 눈금이 아니다. 판면에
 * 자리를 갖는 덩어리는 창 하나이고, 이름들은 그 안을 지나가는 글자다.
 */
export function EmotionDial({ candidates, after }: Props) {
  /* 걸려야 할 자리. 마지막 이름이 몇 번째 칸인지가 곧 다이얼의 정지 위치다. */
  const target = candidates.length - 1

  return (
    <div className={styles.dial} style={{ '--target': target } as CSSProperties}>
      <p className={`mono ${styles.label}`}>CAUSE</p>

      <p className={styles.track}>
        <span className={styles.strip}>
          {candidates.map((word, index) => (
            <span
              key={word}
              className={styles.word}
              data-role={index === target ? 'name' : 'passed'}
            >
              {word}
            </span>
          ))}
        </span>

        {/* 기준선. 다이얼이 걸리는 홈이지 커서가 아니다. */}
        <span className={styles.notch} aria-hidden="true" />
      </p>

      <p className={`mono ${styles.label} ${styles.afterLabel}`}>AFTER</p>

      <p className={styles.after}>{after}</p>
    </div>
  )
}
