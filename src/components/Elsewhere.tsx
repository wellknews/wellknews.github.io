import { site } from '../content/site'
import { Reveal } from './Reveal'
import { Section } from './Section'
import styles from './Elsewhere.module.css'

const { elsewhere } = site

/**
 * 이 도메인에서 갈라져 나간 다른 관심사로 가는 문.
 *
 * 특정 프로젝트를 위한 섹션이 아니라 목록이라는 점이 핵심이다. 프로젝트가 늘어나도
 * site.elsewhere.items에 한 줄이 추가될 뿐 이 컴포넌트는 그대로다.
 *
 * 목적지의 디자인을 미리 끌어오지 않는다. SEMICOLON이 백색 기반이라고 해서 여기에
 * 흰 색면을 만들지 않는 이유다 — 문을 통과하기 전까지는 WELLKNEWS의 언어만 쓴다.
 * 채널 목록의 색면 반전을 재사용하지 않는 것도 같은 이유다. 저쪽은 목적지 자체가
 * 제품이라 화면을 내주지만, 여기서는 문이 주인공이 되면 안 된다.
 */
export function Elsewhere() {
  return (
    <Section id="elsewhere" index={elsewhere.index} label={elsewhere.label}>
      <ul className={styles.list} role="list">
        {elsewhere.items.map((item, index) => (
          <li key={item.path} className={styles.item}>
            <Reveal delay={index * 0.06}>
              <a className={styles.row} href={item.path}>
                <span className={styles.head}>
                  <span className={styles.name}>{item.name}</span>
                  {/* 경로를 그대로 보여준다. 목적지를 설명하는 가장 짧은 방법이다. */}
                  <span className={styles.path}>{item.path}</span>
                </span>
                <span className={styles.summary}>{item.summary}</span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
