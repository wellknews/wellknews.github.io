import { useEffect, useRef } from 'react'

/** Motion is decorative: content and official links remain available without it. */
export function useCampaignMotion() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const page = root.current
    if (!page) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let dispose = () => {}

    const setup = () => {
      dispose()
      if (preference.matches) return
      const animations = new Set<Animation>()
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            observer.unobserve(entry.target)
            const animation = entry.target.animate(
              [
                { opacity: 0, transform: 'translateY(22px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              { duration: 850, easing: 'cubic-bezier(.2,.7,.2,1)' },
            )
            animations.add(animation)
            animation.onfinish = () => animations.delete(animation)
          }
        },
        { threshold: 0.08 },
      )
      const seen = new WeakSet<Element>()
      const observeNewContent = () => {
        page.querySelectorAll('[data-reveal]').forEach((element) => {
          if (seen.has(element)) return
          seen.add(element)
          observer.observe(element)
        })
      }
      observeNewContent()
      const contentObserver = new MutationObserver(observeNewContent)
      contentObserver.observe(page, { childList: true, subtree: true })

      const progress = page.querySelector<HTMLElement>('.reading-line')!
      let scrollFrame = 0
      const updateProgress = () => {
        cancelAnimationFrame(scrollFrame)
        scrollFrame = requestAnimationFrame(() => {
          const height = document.documentElement.scrollHeight - window.innerHeight
          const amount = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0
          progress.style.transform = `scaleX(${amount})`
        })
      }
      window.addEventListener('scroll', updateProgress, { passive: true })
      window.addEventListener('resize', updateProgress)
      const resize = new ResizeObserver(updateProgress)
      resize.observe(page)
      updateProgress()
      dispose = () => {
        observer.disconnect()
        contentObserver.disconnect()
        resize.disconnect()
        animations.forEach((animation) => animation.cancel())
        cancelAnimationFrame(scrollFrame)
        progress.style.removeProperty('transform')
        window.removeEventListener('scroll', updateProgress)
        window.removeEventListener('resize', updateProgress)
      }
    }
    setup()
    preference.addEventListener('change', setup)
    return () => {
      dispose()
      preference.removeEventListener('change', setup)
    }
  }, [])

  return root
}
