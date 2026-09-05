import { Publisher } from './Publisher'
export function CampaignPoster() {
  return (
    <figure className="campaign-figure about-poster" data-reveal>
      <div className="campaign-poster" aria-label="에카타 캠페인 안내 포스터">
        <div className="sheet-top">
          <span>EKATA</span>
          <span>실종아동 찾기 캠페인</span>
        </div>
        <div className="sheet-light" aria-hidden="true" />
        <div className="sheet-copy">
          <p>
            한 번 더,
            <br />
            기억해
            <br />
            <span>주세요.</span>
          </p>
        </div>
        <div className="sheet-publisher">
          <Publisher />
          <span>AN EKATA CAMPAIGN</span>
        </div>
      </div>
    </figure>
  )
}
