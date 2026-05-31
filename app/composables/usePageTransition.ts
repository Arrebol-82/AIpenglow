import { useLenis } from "~/composables/useLenis";

export type TransitionPhase = "idle" | "covering" | "scrolling" | "revealing";

const phase = ref<TransitionPhase>("idle");
const targetHref = ref<string | null>(null);
let resolveScrollComplete: (() => void) | null = null;

export const usePageTransition = () => {
  const isTransitioning = computed(() => phase.value !== "idle");

  const trigger = (href: string) => {
    if (phase.value !== "idle") return;
    targetHref.value = href;
    phase.value = "covering";
  };

  const onCoverComplete = () => {
    phase.value = "scrolling";
  };

  const onScrollComplete = () => {
    phase.value = "revealing";
    resolveScrollComplete?.();
  };

  const waitForScrollPhase = (): Promise<void> => {
    return new Promise((resolve) => {
      resolveScrollComplete = resolve;
    });
  };

  const onRevealComplete = () => {
    phase.value = "idle";
    targetHref.value = null;
    resolveScrollComplete = null;
  };

  /**
   * Full orchestrated transition triggered by navigation clicks:
   * 1. Cover the page with overlay animation
   * 2. Scroll to target immediately (behind the overlay)
   * 3. Reveal the new section by animating overlay out
   *
   * Prefers-reduced-motion: skips overlay and scrolls directly.
   */
  const playAnchorTransition = async (href: string) => {
    if (!import.meta.client) return;

    // Respect user motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const lenis = useLenis();
      if (href && href !== "#") {
        const target = document.querySelector(href);
        if (target) {
          if (lenis) {
            lenis.scrollTo(target as HTMLElement, {
              immediate: true,
              force: true,
            });
          } else {
            target.scrollIntoView();
          }
        }
      } else {
        if (lenis) {
          lenis.scrollTo(0, { immediate: true, force: true });
        } else {
          window.scrollTo({ top: 0 });
        }
      }
      return;
    }

    if (phase.value !== "idle") return;

    // 1. Trigger cover animation
    trigger(href);

    // 2. Wait for cover to fully obscure the page
    await new Promise<void>((resolve) => {
      const unwatch = watch(phase, (p) => {
        if (p === "scrolling") {
          unwatch();
          resolve();
        }
      });
    });

    // 3. Pause smooth scrolling engine, jump to target immediately
    const lenis = useLenis();
    lenis?.stop();

    if (href && href !== "#") {
      const target = document.querySelector(href);
      if (target) {
        if (lenis) {
          lenis.scrollTo(target as HTMLElement, {
            immediate: true,
            force: true,
          });
        } else {
          target.scrollIntoView();
        }
      }
    } else {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: 0 });
      }
    }

    // 4. On the next frame, resume Lenis and trigger reveal
    requestAnimationFrame(() => {
      lenis?.start();
      onScrollComplete();
    });
  };

  return {
    phase,
    targetHref,
    isTransitioning,
    trigger,
    onCoverComplete,
    onScrollComplete,
    waitForScrollPhase,
    onRevealComplete,
    playAnchorTransition,
  };
};
