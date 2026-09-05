export function EkataFooter() {
  return (
    <footer className="footer page-width">
      <span>
        EKATA <span className="footer-separator">/</span> WELLKNEWS
      </span>
      <a href="https://www.instagram.com/wellknews/" target="_blank" rel="noreferrer">
        Instagram<span className="sr-only"> (새 창)</span>
      </a>
      <a href="/ekata/policy/">운영 원칙</a>
      <span>© {new Date().getFullYear()} WELLKNEWS</span>
    </footer>
  )
}
