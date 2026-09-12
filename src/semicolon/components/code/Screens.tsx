import styles from './Screens.module.css'

/** 화면 안에 놓이는 것의 생김새. 무엇인지가 아니라 어떻게 앉는지를 고른다. */
type PartKind = 'bar' | 'list' | 'pill'

type Part = {
  kind: PartKind
  /** 이 자리에 실제로 적혀 있는 말. 앱이 쓰는 낱말을 그대로 옮긴다. */
  says: string
  /** 이번에 없어진 자리. 자리는 남기고 안을 비운다. */
  gone?: boolean
}

type Frame = {
  /** '전', '후', 혹은 화면 이름. */
  when: string
  parts: readonly Part[]
  /** 틀 아래에 붙는 한 줄. 없으면 붙지 않는다. */
  caption?: string
}

type Props = {
  frames: readonly Frame[]
}

/**
 * 화면이 어떻게 생겼는가.
 *
 * 이 게시판에 그림이 하나도 없다는 말을 듣고 만들었다. 장치가 여섯 개 있었지만
 * 전부 «글자를 상자에 넣은 것»이었고, 그래서 잰 값과 빗나간 겨냥은 보여 줄 수
 * 있어도 «그래서 화면이 어떻게 달라졌는데»에는 답하지 못했다.
 *
 * 스크린샷을 쓰지 않는 이유는 module.css에 적었다. 여기서는 다른 것을 적어 둔다 —
 * 이 장치는 **정확하지 않다.** 실제 화면에는 여기 없는 것이 더 많고, 크기 비율도
 * 맞지 않는다. 그린 것은 배치뿐이고, 배치만 맞으면 «위에 있던 전환 스위치가
 * 두 갈래에서 두 갈래로 바뀌었고 아래에 없던 것이 하나 생겼다»는 문장이 필요
 * 없어진다. 그 이상을 이 그림에서 읽으면 안 된다.
 *
 * 그래서 `says`에는 앱에 실제로 적혀 있는 낱말만 넣는다. 지면을 위해 고쳐 쓴
 * 문구를 넣으면 이 그림은 배치도 아니고 스크린샷도 아닌 것이 된다.
 */
export function Screens({ frames }: Props) {
  return (
    <div className={styles.screens}>
      {frames.map((frame) => (
        <figure key={frame.when} className={styles.frame}>
          <span className={`mono ${styles.when}`}>{frame.when}</span>

          <div className={styles.body}>
            {frame.parts.map((part) => (
              <span
                key={part.says}
                className={`${styles.part} ${styles[part.kind]} ${part.gone ? styles.gone : ''}`}
              >
                {part.says}
              </span>
            ))}
          </div>

          {frame.caption ? (
            <figcaption className={styles.caption}>{frame.caption}</figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  )
}
