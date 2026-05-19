import { ScrollSmoother } from 'gsap/ScrollSmoother'

export function useSmoothAnchor() {
  return (href: string) => {
    if (!import.meta.client) return

    const smoother = ScrollSmoother.get()
    if (!smoother) {
      if (href && href !== '#') {
        const target = document.querySelector(href)
        target?.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    if (href === '#' || href === '') {
      smoother.scrollTo(0, true)
      return
    }

    const target = document.querySelector(href)
    if (!target) return

    smoother.scrollTo(target as HTMLElement, true)
  }
}
