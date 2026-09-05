import { Publisher, Arrow } from './Publisher'
export function EkataHeader({ policy = false }: { policy?: boolean }) {
  return (
    <header className="masthead page-width">
      <div className="masthead-top">
        <a href="/" aria-label="웰뉴스 홈페이지">
          <Publisher />
        </a>
        <a className="header-contact" href={policy ? '/ekata/' : '#report'}>
          {policy ? '캠페인으로' : '제보 안내'} <Arrow />
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
      <div className="edition-line">
        <span>한 번 더, 기억해 주세요.</span>
      </div>
    </header>
  )
}
