import { useLenis } from "~/composables/useLenis";

export type TransitionPhase = "idle" | "covering" | "scrolling" | "revealing";

const phase = ref<TransitionPhase>("idle");
const targetHref = ref<string | null>(null);
let resolveScrollComplete: (() => void) | null = null;

const getAnchorTarget = (href: string) => {
  if (!import.meta.client) return null;

  if (!href || href === "#") {
    return null;
  }

  const targetId = href.startsWith("#") ? href.slice(1) : href;

  if (!targetId) return null;

  return document.getElementById(targetId);
};

const jumpToAnchorOnce = (href: string) => {
  if (!import.meta.client) return;

  const lenis = useLenis();

  if (!href || href === "#") {
    if (lenis) {
      lenis.scrollTo(0, {
        immediate: true,
        force: true,
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }

    window.history.replaceState(null, "", window.location.pathname);
    return;
  }

  const target = getAnchorTarget(href);

  if (!target) return;

  if (lenis) {
    lenis.scrollTo(target, {
      immediate: true,
      force: true,
    });
  } else {
    target.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "auto",
    });
  }

  window.history.replaceState(null, "", href);
};

const jumpToAnchorStable = async (href: string) => {
  jumpToAnchorOnce(href);

  await nextTick();

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });

  jumpToAnchorOnce(href);
};

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

  const playAnchorTransition = async (href: string) => {
    if (!import.meta.client) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      await jumpToAnchorStable(href);
      return;
    }

    if (phase.value !== "idle") return;

    trigger(href);

    await new Promise<void>((resolve) => {
      const unwatch = watch(phase, (p) => {
        if (p === "scrolling") {
          unwatch();
          resolve();
        }
      });
    });

    const lenis = useLenis();

    lenis?.stop();

    await jumpToAnchorStable(href);

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
