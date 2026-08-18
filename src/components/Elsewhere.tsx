import { site } from '../content/site'
import { Reveal } from './Reveal'
import { Section } from './Section'
import styles from './Elsewhere.module.css'

const { elsewhere } = site

/**
 * 이 루트에서 갈라져 나온 프로젝트들로 나가는 문.
 *
 * 프로젝트 하나를 위한 전용 구간이 아니라 앞으로 늘어날 가지 전체를 받는 목록이다.
 * 새 프로젝트가 생기면 site.elsewhere.items에 한 줄을 더하면 끝난다.
 *
 * 화살표 아이콘을 붙이지 않는다. 오른쪽에 경로가 이미 적혀 있어 같은 정보가 두 번
 * 들어가고, 그 아이콘은 이 사이트에서 '바깥 플랫폼으로 나간다'는 뜻으로만 쓰인다.
 */
export function Elsewhere() {
  return (
    <Section id="elsewhere" index={elsewhere.index} label={elsewhere.label}>
      <ul className={styles.list} role="list">
        {elsewhere.items.map((branch, index) => (
          <li key={branch.href} className={styles.item}>
            <Reveal delay={index * 0.06}>
              <a className={styles.row} href={branch.href}>
                <span className={styles.head}>
                  <span className={styles.name}>{branch.name}</span>
                  {/* 경로 자체가 이 프로젝트의 이름값을 한다. 주소창에 보일 그대로 적는다. */}
                  <span className={styles.path}>{branch.path}</span>
                </span>

                <span className={styles.description}>{branch.description}</span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
