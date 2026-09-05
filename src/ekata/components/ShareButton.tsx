import { useState } from 'react'
import { shareCase } from '../lib/share'
export function ShareButton({ url, title }: { url: string; title: string }) {
  const [message, setMessage] = useState('')
  const [manual, setManual] = useState(false)
  async function share() {
    setMessage('')
    setManual(false)
    const result = await shareCase(
      { title, url },
      {
        share: navigator.share?.bind(navigator),
        copy: navigator.clipboard?.writeText.bind(navigator.clipboard),
      },
    )
    setManual(result === 'manual')
    setMessage(
      {
        shared: '공유를 완료했습니다.',
        copied: '주소를 복사했습니다.',
        manual: '아래 주소를 선택해 복사해 주세요.',
        cancelled: '',
      }[result],
    )
  }
  return (
    <div className="share-action">
      <button className="text-link" type="button" onClick={() => void share()}>
        공유 / 주소 복사 <span aria-hidden="true">↗</span>
      </button>
      <output className="copy-status" aria-live="polite">
        {message}
      </output>
      {manual && (
        <input
          className="copy-address"
          aria-label="복사할 주소"
          value={url}
          readOnly
          onFocus={(event) => event.target.select()}
        />
      )}
    </div>
  )
}
