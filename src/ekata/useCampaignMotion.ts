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
      page.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))

      const sheet = page.querySelector<HTMLElement>('.story-sheet')!
      const progress = page.querySelector<HTMLElement>('.reading-line')!
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
      let pointerFrame = 0
      let scrollFrame = 0
      const reset = () => {
        cancelAnimationFrame(pointerFrame)
        sheet.style.removeProperty('--light-x')
        sheet.style.removeProperty('--light-y')
        sheet.style.removeProperty('--turn-x')
        sheet.style.removeProperty('--turn-y')
        sheet.removeAttribute('data-looking')
      }
      const move = (event: PointerEvent) => {
        if (!finePointer.matches || event.pointerType === 'touch') return
        const { left, top, width, height } = sheet.getBoundingClientRect()
        const x = Math.max(0, Math.min(1, (event.clientX - left) / width))
        const y = Math.max(0, Math.min(1, (event.clientY - top) / height))
        cancelAnimationFrame(pointerFrame)
        pointerFrame = requestAnimationFrame(() => {
          sheet.setAttribute('data-looking', '')
          sheet.style.setProperty('--light-x', `${x * 100}%`)
          sheet.style.setProperty('--light-y', `${y * 100}%`)
          sheet.style.setProperty('--turn-x', `${(0.5 - y) * 2}deg`)
          sheet.style.setProperty('--turn-y', `${(x - 0.5) * 2}deg`)
        })
      }
      const updateProgress = () => {
        cancelAnimationFrame(scrollFrame)
        scrollFrame = requestAnimationFrame(() => {
          const height = document.documentElement.scrollHeight - window.innerHeight
          const amount = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0
          progress.style.transform = `scaleX(${amount})`
        })
      }
      sheet.addEventListener('pointermove', move)
      sheet.addEventListener('pointerleave', reset)
      sheet.addEventListener('pointercancel', reset)
      window.addEventListener('scroll', updateProgress, { passive: true })
      window.addEventListener('resize', updateProgress)
      const resize = new ResizeObserver(updateProgress)
      resize.observe(page)
      updateProgress()
      dispose = () => {
        observer.disconnect()
        resize.disconnect()
        animations.forEach((animation) => animation.cancel())
        reset()
        cancelAnimationFrame(scrollFrame)
        progress.style.removeProperty('transform')
        sheet.removeEventListener('pointermove', move)
        sheet.removeEventListener('pointerleave', reset)
        sheet.removeEventListener('pointercancel', reset)
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
