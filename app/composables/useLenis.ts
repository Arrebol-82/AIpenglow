import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance
}

export function useLenis(): Lenis | null {
  return lenisInstance
}
