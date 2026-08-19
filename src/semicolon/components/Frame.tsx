import styles from './Frame.module.css'

/**
 * 판면(版面)을 표시하는 선.
 *
 * 인쇄물의 지면에는 글이 앉는 영역의 경계가 있다. 화면에는 그것이 없어서
 * 여백이 '넓다'가 아니라 '비었다'로 읽히기 쉽다. 본문 좌우 끝에 아주 옅은
 * 세로선을 세워 그 경계를 되돌려 준다.
 *
 * 네 모서리의 '+'는 그 선이 어디서 시작하고 끝나는지 표시하는 기준점이다.
 * 도면에서 가져온 기호이고, 이 공간에서 개발자의 문법이 드러나는 방식이기도 하다.
 *
 * 화면에 고정되어 있어 스크롤과 무관하게 지면의 틀로 남는다. 좁은 화면에서는
 * 여백 자체가 좁아 틀이 오히려 답답해지므로 그리지 않는다.
 */
export function Frame() {
  return (
    <div className={styles.frame} aria-hidden="true">
      <div className={`shell ${styles.inner}`}>
        <span className={`${styles.line} ${styles.left}`} />
        <span className={`${styles.line} ${styles.right}`} />

        <span className={`${styles.tick} ${styles.topLeft}`}>+</span>
        <span className={`${styles.tick} ${styles.topRight}`}>+</span>
        <span className={`${styles.tick} ${styles.bottomLeft}`}>+</span>
        <span className={`${styles.tick} ${styles.bottomRight}`}>+</span>
      </div>
    </div>
  )
}
