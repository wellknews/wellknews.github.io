import { useState } from 'react'
import { site } from '../content/site'
import { ArrowUpRight } from './Arrow'
import { Reveal } from './Reveal'
import { Section } from './Section'
import styles from './Channels.module.css'

const { channels } = site

export function Channels() {
  const [activeChannel, setActiveChannel] = useState(0)

  return (
    <Section id="channels" index={channels.index} label={channels.label}>
      {/*
        채널이 곧 제품이므로 설명 문구를 덧붙이지 않고 목록에 화면을 내준다.
        호버 시 흰 색면이 행 전체를 덮으면서 글자가 반전된다 — 장식을 더하는 대신
        면 자체를 뒤집는 방식이라 요소가 늘어나지 않는다.
      */}
      <div className={styles.layout}>
        <Reveal className={styles.preview} delay={0.08}>
          <div className={styles.previewFrame} data-channel={activeChannel} aria-hidden="true">
            <img
              className={styles.atlas}
              src="/media/channel-atlas.webp"
              alt=""
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
            />
            <span className={styles.previewLabel}>
              CHANNEL {String(activeChannel + 1).padStart(2, '0')}
            </span>
          </div>
        </Reveal>

        <ul className={styles.list} role="list">
          {channels.items.map((channel, index) => (
            <li key={channel.name} className={styles.item}>
              <Reveal delay={index * 0.06}>
                <a
                  className={styles.row}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${channel.name} 채널 (새 창)`}
                  onMouseEnter={() => setActiveChannel(index)}
                  onFocus={() => setActiveChannel(index)}
                >
                  <span className={styles.fill} aria-hidden="true" />
                  <span className={styles.content}>
                    <span className={styles.name}>{channel.name}</span>
                    <ArrowUpRight className={styles.arrow} />
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
