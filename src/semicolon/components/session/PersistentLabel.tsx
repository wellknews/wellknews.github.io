import styles from './PersistentLabel.module.css'

type Props = {
  /** '17:28' */
  at: string
  /** 'SEOUL' */
  where: string
}

/**
 * 하루가 끝나기로 되어 있는 시각.
 *
 * 첫 화면부터 거기 있는다. 계획이 몇 번 바뀌든 이 숫자만은 바뀌지 않았고,
 * 그날 실제로 그랬다 — 열차 시간은 협상 대상이 아니었다.
 *
 * 여백 안쪽에 세로로 선다. 판면 바깥의 빈 자리라 어떤 문장도 가리지 않고,
 * 스크롤해도 자리에서 움직이지 않는다. 크기도 변하지 않는다. 시간이 가까워질
 * 때 글자가 커지거나 흔들리면 그것은 시간이 아니라 경고가 된다.
 *
 * 대신 잉크가 짙어진다.
 *
 * 네 단으로 끊어서 짙어지고 그 사이에는 아무 일도 없다. 시간이 연속적으로
 * 다가오는 느낌은 사실이 아니다 — 실제로는 한참 잊고 있다가 문득 한 번씩
 * 생각났다.
 *
 * 투명도로 하지 않는 이유는 이 저장소의 다른 자리와 같다. 제일 옅은 단에서도
 * 종이 대비 6.85:1이라 처음부터 읽을 수 있다. 읽히지 않는 글자를 화면에
 * 띄워 두는 것은 압박이 아니라 그냥 노이즈다.
 */
export function PersistentLabel({ at, where }: Props) {
  return (
    <p className={`mono ${styles.label}`}>
      <span>{at}</span>
      <span className={styles.where}>{where}</span>
    </p>
  )
}
