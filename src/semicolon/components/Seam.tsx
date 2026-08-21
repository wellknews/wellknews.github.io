import { semicolon } from '../content/site'
import styles from './Seam.module.css'

/**
 * 두 개념 사이의 이음매.
 *
 * SESSION이 끝나고 THREAD가 시작하는 자리다. 히어로에서 커서가 하던 일을
 * 여기서는 스크롤이 한다 — 선이 갈라지고 그 사이에 ';'가 들어선다.
 * 끝났지만 끝나지 않은 자리이므로 마침표가 아니라 세미콜론이 온다.
 *
 * 저절로 도는 애니메이션이 아니다. 사람이 굴린 만큼만 열리고, 되감으면 다시
 * 닫힌다. 스크롤 타임라인을 모르는 브라우저에서는 열린 채로 서 있는다 —
 * 움직이지 못한다고 해서 아무것도 안 보이면 안 되기 때문이다.
 */
export function Seam() {
  return (
    <div className={styles.seam} aria-hidden="true">
      <span className={styles.rule} />
      <span className={styles.mark}>{semicolon.mark}</span>
      <span className={styles.rule} />
    </div>
  )
}
