export function EkataFooter() {
  return (
    <footer className="footer page-width">
      <span>
        EKATA <span className="footer-separator">/</span> WELLKNEWS
      </span>
      <a href="/ekata/why/">만든 이유</a>
      <a href="/ekata/policy/">운영 원칙</a>
      <a href="https://www.instagram.com/wellknews/" target="_blank" rel="noreferrer">
        Instagram<span className="sr-only"> (새 창)</span>
      </a>
      <span>© {new Date().getFullYear()} WELLKNEWS</span>
    </footer>
  )
}
