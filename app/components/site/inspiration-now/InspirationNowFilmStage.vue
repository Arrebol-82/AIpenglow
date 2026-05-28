<template>
  <div v-if="reducedMotion" class="inspiration-film-stage">
    <SectionInspiration />
  </div>
  <div
    v-else
    ref="outerRef"
    class="inspiration-film-stage inspiration-film-stage--full-bleed"
  >
    <div ref="pinnedRef" class="inspiration-film-stage__pinned">
      <div
        ref="inspirationWrapperRef"
        class="inspiration-film-stage__inspiration"
      >
        <SectionInspiration />
      </div>
      <img
        ref="filmOverlayRef"
        :src="filmSvg"
        alt=""
        aria-hidden="true"
        class="inspiration-film-stage__film-overlay"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import SectionInspiration from "~/components/site/inspiration/SectionInspiration.vue";
import filmSvg from "~/assets/images/film.svg";

// --- film.svg constants ---
// viewBox: 0 0 716 914
// First cutout: x=56 y=31 w=604 h=412
const SVG_VB_W = 716;
const SVG_VB_H = 914;
const CUTOUT1_W = 604;
const CUTOUT1_H = 412;
const SAFE_PADDING = 0.96;

const reducedMotion = ref(false);
const outerRef = ref<HTMLElement | null>(null);
const pinnedRef = ref<HTMLElement | null>(null);
const inspirationWrapperRef = ref<HTMLElement | null>(null);
const filmOverlayRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;
let startScale = 1.3;
let inspirationScaleEnd = 0.94;

function computeLayout() {
  const viewportW = window.innerWidth;

  // Dynamic film start scale — wider viewport = larger initial zoom
  startScale = Math.min(1.8, Math.max(1.15, 1 + (viewportW / 1440) * 0.3));
  // 1440px → 1.3, 1920px → 1.4, 2560px → 1.53, 1024px → 1.21

  /*
   * Film overlay is 100vw × 200vh with object-fit: fill.
   * Cutout screen dimensions:
   *   cutoutScreenW = (CUTOUT1_W / SVG_VB_W) × 100vw
   *   cutoutScreenH = (CUTOUT1_H / SVG_VB_H) × 200vh
   *
   * Inspiration is 100vw × ≈100vh (fills the pinned container).
   * To fit inspiration inside the cutout:
   *   ratioW = cutoutScreenW / 100vw = CUTOUT1_W / SVG_VB_W
   *   ratioH = cutoutScreenH / 100vh = (CUTOUT1_H / SVG_VB_H) × 2
   */
  const ratioW = CUTOUT1_W / SVG_VB_W;
  const ratioH = (CUTOUT1_H / SVG_VB_H) * 2;

  inspirationScaleEnd = Math.min(ratioW, ratioH) * SAFE_PADDING;
}

function setupAnimation() {
  if (
    !outerRef.value ||
    !pinnedRef.value ||
    !inspirationWrapperRef.value ||
    !filmOverlayRef.value
  ) {
    return;
  }

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outerRef.value,
        start: "top top",
        end: "+=140%",
        pin: pinnedRef.value,
        pinSpacing: true,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Both run simultaneously from start

    tl.to(
      inspirationWrapperRef.value,
      { scale: inspirationScaleEnd, ease: "none" },
      0,
    );

    tl.set(filmOverlayRef.value, { opacity: 1 }, 0);
    tl.fromTo(
      filmOverlayRef.value,
      { scale: startScale },
      { scale: 1, ease: "none" },
      0,
    );
  }, outerRef.value);
}

function handleResize() {
  ctx?.revert();
  ctx = null;
  computeLayout();
  setupAnimation();
}

onMounted(async () => {
  if (!import.meta.client) return;

  const prefersRM = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersRM) {
    reducedMotion.value = true;
    return;
  }

  if (
    !outerRef.value ||
    !pinnedRef.value ||
    !inspirationWrapperRef.value ||
    !filmOverlayRef.value
  ) {
    return;
  }

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  computeLayout();
  setupAnimation();

  window.addEventListener("resize", handleResize);
  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
  });
});

onBeforeUnmount(() => {
  ctx?.revert();
  ctx = null;
});
</script>

<style scoped>
.inspiration-film-stage {
  width: 100%;
}

.inspiration-film-stage--full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

.inspiration-film-stage__pinned {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.inspiration-film-stage__inspiration {
  width: 100%;
  will-change: transform;
}

.inspiration-film-stage__film-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 200vh;
  object-fit: fill;
  object-position: top center;
  pointer-events: none;
  opacity: 0;
  transform-origin: 50% 25%;
}
</style>
