import { copyright, site } from '../content/site'
import styles from './Footer.module.css'

const { footer } = site

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.endPlate}>
        <picture>
          <source media="(max-width: 639px)" srcSet="/media/hero-newsroom-mobile.webp" />
          <img
            src="/media/hero-newsroom.webp"
            alt=""
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
          />
        </picture>

        <div className={`shell ${styles.plateInner}`}>
          <a className={styles.topLink} href="#top" aria-label="TOP — 페이지 맨 위로 이동">
            <span>TOP</span>
            <span aria-hidden="true">↑</span>
          </a>

          <div className={styles.masthead} aria-hidden="true">
            <img src="/logo.svg" alt="" width={512} height={512} />
            <span>{site.name}</span>
          </div>
        </div>
      </div>

      <div className={`shell ${styles.inner}`}>
        <div className={styles.credit}>
          <span className={styles.label}>{footer.creditLabel}</span>

          <ul className={styles.contacts} role="list">
            {footer.contacts.map((contact) => (
              <li key={contact.href}>
                <a
                  className={styles.link}
                  href={contact.href}
                  aria-label={contact.external ? `${contact.label} (새 창)` : undefined}
                  {...(contact.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {contact.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.copyright}>{copyright}</p>
      </div>
    </footer>
  )
}
