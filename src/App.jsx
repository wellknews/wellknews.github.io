import './App.css'

const channels = [
  { name: 'Instagram', href: 'https://instagram.com/wellknews' },
  { name: 'Threads', href: 'https://threads.net/wellknews' },
  { name: 'YouTube', href: 'https://www.youtube.com/@wellknews' },
  { name: 'Facebook', href: 'https://facebook.com/wellknewskr' },
]

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>
}

function Header() {
  return (
    <header className="header">
      <a href="#top" className="brand" aria-label="WELLKNEWS home">
        <img
          src="/logo.png"
          alt="WELLKNEWS logo"
          className="brand-logo"
        />
      </a>

      <nav className="nav" aria-label="Primary navigation">
        <a href="#report">REPORT</a>
        <a href="#channels">CHANNELS</a>
        <a href="#about">ABOUT</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-logo-wrap">
        <img
          src="/logo.png"
          alt="WELLKNEWS logo"
          className="hero-logo"
        />
      </div>

      <div className="hero-bottom">
        <h1 className="hero-copy">
          <span>EVERY NEWS,</span>
          <span>WELL KNEW.</span>
        </h1>

        <span className="scroll-label">
          SCROLL ↓
        </span>
      </div>
    </section>
  )
}

function Report() {
  return (
    <section className="section report" id="report">
      <div className="section-index">
        01 / REPORT
      </div>

      <div className="report-grid">
        <h2 className="section-heading">
          세상에 알려야 할
          <br />
          이야기가 있다면.
        </h2>

        <div className="report-meta">
          <p>
            WELLKNEWS는 기사화를 위한
            <br />
            다양한 제보를 기다립니다.
          </p>

          <div className="report-types">
            <span>사진</span>
            <span>영상</span>
            <span>문서</span>
            <span>링크</span>
          </div>
        </div>
      </div>

      <a
        className="editorial-link report-link"
        href="#"
        onClick={(event) => event.preventDefault()}
      >
        <span>제보하기</span>
        <Arrow />
      </a>
    </section>
  )
}

function Channels() {
  return (
    <section className="section" id="channels">
      <div className="section-index">
        02 / CHANNELS
      </div>

      <div className="channels">
        {channels.map((channel) => (
          <a
            className="editorial-link channel-link"
            href={channel.href}
            key={channel.name}
            target="_blank"
            rel="noreferrer"
          >
            <span>{channel.name}</span>
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="section-index">
        03 / ABOUT
      </div>

      <div className="about-grid">
        <h2 className="about-name">
          WELLKNEWS
        </h2>

        <p className="about-copy">
          Every news,
          <br />
          well knew.
        </p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <span>WELLKNEWS</span>
      <div className="footer-meta">
        <a className="footer-link" href="https://instagram.com/muishiz" target="_blank" rel="noreferrer" aria-label="Developer Instagram @muishiz">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
          </svg>
          <span>@muishiz</span>
        </a>
        <a className="footer-link" href="mailto:muishizen51@gmail.com" aria-label="Developer email muishizen51@gmail.com">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4.5 7l7.5 6 7.5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>muishizen51@gmail.com</span>
        </a>
      </div>
      <span>© 2026 WELLKNEWS</span>
    </footer>
  )
}

function App() {
  return (
    <div className="site">
      <Header />

      <main>
        <Hero />
        <Report />
        <Channels />
        <About />
      </main>

      <Footer />
    </div>
  )
}

export default App
