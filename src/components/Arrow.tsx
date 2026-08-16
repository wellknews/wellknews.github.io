import type { SVGProps } from 'react'

/**
 * 외부로 나가는 링크를 뜻하는 대각선 화살표.
 *
 * 사이트에서 쓰는 유일한 아이콘이다. 채널 목록에 플랫폼 로고를 붙이지 않은 것은
 * 바로 옆에 플랫폼 이름이 그대로 적혀 있어 같은 정보가 두 번 들어가기 때문이다.
 */
export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </svg>
  )
}
