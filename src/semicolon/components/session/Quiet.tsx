import type { ReactNode } from 'react'

import { useInView } from '../../motion/useInView'
import { useQuiet } from '../../motion/useQuiet'
import styles from './Quiet.module.css'

type Props = {
  children: ReactNode
}

/**
 * 색이 빠지는 구간.
 *
 * 어떤 문단은 연출을 얹으면 값싸진다. 그래서 여기서는 더하는 대신 뺀다.
 * 이 구간에 들어오면 판면 뒤에서 계속 밀리던 색면이 조용해지고, 화면은
 * 거의 흰 종이가 된다. 사진도 없고 움직이는 것도 없다. 그냥 글만 읽는다.
 *
 * 앞 구간 내내 색이 반응하고 이미지가 바뀌었기 때문에, 그것이 멈추는 것
 * 자체가 가장 큰 변화가 된다. 문장으로 «여기서부터 개인적인 이야기»라고
 * 적지 않아도 톤이 바뀐 것이 먼저 전해진다.
 *
 * 지나가면 색은 천천히 돌아온다. 이 구간이 이 기록의 끝은 아니기 때문이다.
 */
export function Quiet({ children }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.3, replay: true })

  useQuiet(inView)

  return (
    <div className={styles.quiet} ref={ref}>
      {children}
    </div>
  )
}
