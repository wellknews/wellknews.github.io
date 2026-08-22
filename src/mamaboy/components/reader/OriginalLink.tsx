import { mamaboy } from '../../content/site'
import styles from './Reader.module.css'

type Props = {
  href: string
  sourceName: string
}

/**
 * 원문으로 가는 문(§14, §30).
 *
 * 어떤 형태의 글이든 이 링크는 항상 있다. MAMABOY가 옮긴 것은 요약이거나
 * 번역이고, 원문은 늘 다른 곳에 있기 때문이다.
 *
 * 새 탭으로 연다 — 읽던 지면을 잃지 않게 하는 것이 목적이고, 그래서 낭독에도
 * 어디로 가는지가 함께 전해져야 한다.
 */
export function OriginalLink({ href, sourceName }: Props) {
  return (
    <a
      className={`label pressable ${styles.original}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {mamaboy.reader.readOriginal}
      <span aria-hidden="true">↗</span>
      <span className="visually-hidden">{`— ${sourceName}, 새 탭에서 열림`}</span>
    </a>
  )
}
