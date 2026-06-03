<script setup lang="ts">
import { gsap } from "gsap";
import {
  preloaderPhase,
  preloaderProgress,
  markPreloaderReady,
  markPreloaderDone,
} from "~/composables/useAppPreloader";
import { useLenis } from "~/composables/useLenis";

const emits = defineEmits<{
  (e: "ready"): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const progressBarRef = ref<HTMLElement | null>(null);
const displayProgress = ref(0);
const startedExiting = ref(false);

const FONT_READY_TIMEOUT = 1200;
const KEY_IMAGE_TIMEOUT = 1800;

const prefersReduced = import.meta.client
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

onMounted(async () => {
  const lenis = useLenis();

  if (prefersReduced) {
    // Immediate: set progress to 100, skip animations
    preloaderProgress.value = 100;
    displayProgress.value = 100;
    await nextTick();
    finishLoading(lenis);
    return;
  }

  // 1. Pause scrolling
  if (lenis) {
    lenis.stop();
  } else {
    document.documentElement.style.overflow = "hidden";
  }

  // 2. Start fake progress from 0 → 85% over ~2.5s
  const fakeTween = gsap.to(preloaderProgress, {
    value: 85,
    duration: 2.5,
    ease: "power2.inOut",
  });

  // 3. Wait for real resources
  await Promise.all([
    nextTick(),
    waitWithTimeout(document.fonts.ready, FONT_READY_TIMEOUT),
    ...decodeKeyImages().map((promise) =>
      waitWithTimeout(promise, KEY_IMAGE_TIMEOUT),
    ),
  ]);

  // 4. Kill fake tween, snap to 100%
  fakeTween.kill();
  gsap.to(preloaderProgress, {
    value: 100,
    duration: 0.4,
    ease: "power2.out",
    onComplete: () => {
      finishLoading(lenis);
    },
  });
});

function decodeKeyImages(): Promise<void>[] {
  const images = document.querySelectorAll<HTMLImageElement>(
    'img[src*="main.webp"], img[src*="head_portrait"]',
  );
  const promises: Promise<void>[] = [];
  images.forEach((img) => {
    if (!img.complete) {
      promises.push(
        new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
      );
    }
  });
  return promises;
}

function waitWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T | void> {
  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => resolve(), timeout);

    promise
      .then((value) => resolve(value))
      .catch(() => resolve())
      .finally(() => window.clearTimeout(timeoutId));
  });
}

function finishLoading(lenis: ReturnType<typeof useLenis>) {
  if (startedExiting.value) return;
  startedExiting.value = true;

  markPreloaderReady();
  emits("ready");

  // 4. Exit animation
  if (!containerRef.value) {
    completeDone(lenis);
    return;
  }

  gsap.to(containerRef.value, {
    yPercent: -100,
    duration: 1.05,
    ease: "expo.inOut",
    onComplete: () => completeDone(lenis),
  });
}

function completeDone(lenis: ReturnType<typeof useLenis>) {
  markPreloaderDone();

  // 5. Restore scrolling
  if (lenis) {
    lenis.start();
  } else {
    document.documentElement.style.overflow = "";
  }

  // 6. Refresh ScrollTrigger
  nextTick(() => {
    import("gsap/ScrollTrigger").then((mod) => {
      if (mod.ScrollTrigger) {
        mod.ScrollTrigger.refresh();
      }
    });
  });
}

// Sync reactive progress to display value
watch(preloaderProgress, (val) => {
  displayProgress.value = Math.round(val);
});

// Clean up html overflow on unmount just in case
onBeforeUnmount(() => {
  if (!useLenis()) {
    document.documentElement.style.overflow = "";
  }
});
</script>

<template>
  <div
    v-if="preloaderPhase !== 'done'"
    ref="containerRef"
    class="app-preloader"
    :class="{ 'is-exiting': preloaderPhase === 'exiting' }"
  >
    <div class="app-preloader__inner">
      <p class="app-preloader__title">ALPENGLOW</p>
      <div class="app-preloader__progress-wrap">
        <div ref="progressBarRef" class="app-preloader__progress-bar">
          <div
            class="app-preloader__progress-fill"
            :style="{ width: displayProgress + '%' }"
          ></div>
        </div>
        <span class="app-preloader__progress-text">{{ displayProgress }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-preloader {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f1e7;
  pointer-events: all;
}

.app-preloader__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.app-preloader__title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: #1d1e18;
  user-select: none;
}

@media (min-width: 768px) {
  .app-preloader__title {
    font-size: 2.5rem;
  }
}

.app-preloader__progress-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 240px;
}

.app-preloader__progress-bar {
  flex: 1;
  height: 2px;
  background: rgba(29, 30, 24, 0.15);
  border-radius: 1px;
  overflow: hidden;
}

.app-preloader__progress-fill {
  height: 100%;
  background: #1d1e18;
  border-radius: 1px;
  width: 0%;
  transition: none;
}

.app-preloader__progress-text {
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1d1e18;
  min-width: 2.5rem;
  text-align: right;
}
</style>
