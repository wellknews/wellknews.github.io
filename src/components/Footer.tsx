import { copyright, site } from '../content/site'
import styles from './Footer.module.css'

const { footer } = site

export function Footer() {
  return (
    <footer className={styles.footer}>
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

        {/* 워드마크는 여기 한 번만 나온다. 저작권 표기가 이미 브랜드명을 담고 있어
            좌측에 로고를 따로 세우지 않는다. */}
        <p className={styles.copyright}>{copyright}</p>
      </div>
    </footer>
  )
}
