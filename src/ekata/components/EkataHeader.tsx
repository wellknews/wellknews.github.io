import { Publisher, Arrow } from './Publisher'

type EkataPage = 'campaign' | 'why' | 'policy'

const navigation: { page: EkataPage; label: string; href: string }[] = [
  { page: 'campaign', label: '캠페인', href: '/ekata/' },
  { page: 'why', label: 'WHY', href: '/ekata/why/' },
  { page: 'policy', label: '운영 원칙', href: '/ekata/policy/' },
]

export function EkataHeader({ page }: { page: EkataPage }) {
  return (
    <header className="masthead page-width">
      <div className="masthead-top">
        <a href="/" aria-label="웰뉴스 홈페이지">
          <Publisher />
        </a>
        <a className="header-contact" href="tel:182" aria-label="실종아동 제보 182 전화 연결">
          <span className="header-contact-label">실종아동 제보</span>
          <strong>182</strong> <Arrow />
        </a>
      </div>
      <div className="masthead-title">
        <a href="/ekata/" className="ekata-wordmark" aria-label="에카타 홈">
          EKATA<span aria-hidden="true">.</span>
        </a>
        <p>
          실종아동 찾기
          <br />
          웰뉴스 캠페인
        </p>
      </div>
      <nav className="campaign-nav" aria-label="에카타 메뉴">
        {navigation.map((item) => (
          <a
            key={item.page}
            href={item.href}
            aria-current={page === item.page ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
