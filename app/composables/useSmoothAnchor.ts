export function useSmoothAnchor() {
  return (href: string) => {
    if (!import.meta.client) return

    const lenis = useLenis()

    if (!lenis) {
      if (href && href !== '#') {
        const target = document.querySelector(href)
        target?.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    if (href === '#' || href === '') {
      lenis.scrollTo(0)
      return
    }

    const target = document.querySelector(href)
    if (!target) return

    lenis.scrollTo(target as HTMLElement)
  }
}
