import { gsap } from "gsap";
import type LenisType from "lenis";

export const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const initPageScroll = async () => {
  if (!import.meta.client || prefersReducedMotion()) {
    return null;
  }

  const [{ ScrollTrigger }, { default: Lenis }] = await Promise.all([
    import("gsap/ScrollTrigger"),
    import("lenis"),
  ]);

  gsap.registerPlugin(ScrollTrigger);

  const lenis: LenisType = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  setLenis(lenis);
  lenis.on("scroll", ScrollTrigger.update);

  const lenisRafHandler = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(lenisRafHandler);
  gsap.ticker.lagSmoothing(0);

  const refresh = () => ScrollTrigger.refresh();
  let refreshTimer: ReturnType<typeof setTimeout> | null = setTimeout(refresh, 300);

  refresh();

  if ("fonts" in document) {
    document.fonts.ready.then(refresh);
  }

  window.addEventListener("load", refresh, { once: true });

  return {
    refresh,
    destroy: () => {
      window.removeEventListener("load", refresh);
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }
      gsap.ticker.remove(lenisRafHandler);
      lenis.destroy();
      setLenis(null);
    },
  };
};
