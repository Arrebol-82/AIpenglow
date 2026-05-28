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

      <!-- 唯一的 Now 页面 -->
      <div ref="nowWrapperRef" class="inspiration-film-stage__now">
        <div class="inspiration-film-stage__now-inner">
          <SectionNow v-if="showNow" />
        </div>
      </div>

      <img
        ref="filmOverlayRef"
        :src="filmSvg"
        alt=""
        aria-hidden="true"
        class="inspiration-film-stage__film-overlay"
      />

      <!-- Footer 覆盖层 -->
      <div ref="footerCoverRef" class="inspiration-film-stage__footer-cover">
        <TheFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";

import TheFooter from "~/components/layout/TheFooter.vue";
import SectionInspiration from "~/components/site/inspiration/SectionInspiration.vue";
import SectionNow from "~/components/site/now/SectionNow.vue";
import filmSvg from "~/assets/images/film.svg";

// --- film.svg constants ---
// viewBox: 0 0 716 914
// First cutout: x=56 y=31 w=604 h=412
// Second cutout: x=56 y=477 w=604 h=399
const SVG_VB_W = 716;
const SVG_VB_H = 914;

const CUTOUT1_W = 604;
const CUTOUT1_H = 412;

const CUTOUT2_W = 604;
const CUTOUT2_H = 399;

const SAFE_PADDING = 0.96;

const reducedMotion = ref(false);
const showNow = ref(true);

const outerRef = ref<HTMLElement | null>(null);
const pinnedRef = ref<HTMLElement | null>(null);
const inspirationWrapperRef = ref<HTMLElement | null>(null);
const nowWrapperRef = ref<HTMLElement | null>(null);
const filmOverlayRef = ref<HTMLImageElement | null>(null);
const footerCoverRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

let startScale = 1.3;
let inspirationScaleEnd = 0.94;
let nowScaleEnd = 0.94;

function computeLayout() {
  const viewportW = window.innerWidth;

  startScale = Math.min(1.8, Math.max(1.15, 1 + (viewportW / 1440) * 0.3));

  const ratioW1 = CUTOUT1_W / SVG_VB_W;
  const ratioH1 = (CUTOUT1_H / SVG_VB_H) * 2;

  inspirationScaleEnd = Math.min(ratioW1, ratioH1) * SAFE_PADDING;

  const ratioW2 = CUTOUT2_W / SVG_VB_W;
  const ratioH2 = (CUTOUT2_H / SVG_VB_H) * 2;

  nowScaleEnd = Math.min(ratioW2, ratioH2) * SAFE_PADDING;
}

function setupAnimation() {
  if (
    !outerRef.value ||
    !pinnedRef.value ||
    !inspirationWrapperRef.value ||
    !nowWrapperRef.value ||
    !filmOverlayRef.value ||
    !footerCoverRef.value
  ) {
    return;
  }

  ctx = gsap.context(() => {
    const inspirationEl = inspirationWrapperRef.value;
    const nowEl = nowWrapperRef.value;
    const filmEl = filmOverlayRef.value;
    const footerEl = footerCoverRef.value;

    if (!inspirationEl || !nowEl || !filmEl || !footerEl) return;

    gsap.set(inspirationEl, {
      scale: 1,
      y: 0,
      opacity: 1,
      transformOrigin: "50% 50%",
    });

    gsap.set(nowEl, {
      scale: nowScaleEnd,
      y: "100vh",
      opacity: 0,
      transformOrigin: "50% 50%",
    });

    gsap.set(filmEl, {
      scale: startScale,
      y: 0,
      opacity: 1,
      transformOrigin: "50% 25%",
    });

    gsap.set(footerEl, {
      y: "100vh",
      opacity: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outerRef.value,
        start: "top top",

        /*
         * 这里拉长 pin 的距离：
         * 前面：Ins -> Now 胶卷转场
         * 中间：Now 恢复全屏
         * 后面：Now 固定，Footer 覆盖
         */
        end: "+=260%",

        pin: pinnedRef.value,
        pinSpacing: true,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    /*
     * 第一段：
     * SVG 从大变小，Inspiration 被框进第一帧。
     */
    tl.to(
      inspirationEl,
      {
        scale: inspirationScaleEnd,
        duration: 0.55,
        ease: "none",
      },
      0,
    );

    tl.to(
      filmEl,
      {
        scale: 1,
        duration: 0.55,
        ease: "none",
      },
      0,
    );

    /*
     * 第二段：
     * SVG 上移，Now 进入第二帧。
     */
    tl.to(
      filmEl,
      {
        y: "-100vh",
        duration: 0.35,
        ease: "none",
      },
      0.55,
    );

    tl.to(
      inspirationEl,
      {
        y: "-100vh",
        opacity: 0,
        duration: 0.35,
        ease: "none",
      },
      0.55,
    );

    tl.to(
      nowEl,
      {
        y: 0,
        opacity: 1,
        scale: nowScaleEnd,
        duration: 0.35,
        ease: "none",
      },
      0.55,
    );

    /*
     * 第三段：
     * SVG 底部贴住视口底部，短暂停住。
     */
    tl.to(
      filmEl,
      {
        y: "-100vh",
        scale: 1,
        opacity: 1,
        duration: 0.18,
        ease: "none",
      },
      0.9,
    );

    tl.to(
      nowEl,
      {
        y: 0,
        opacity: 1,
        scale: nowScaleEnd,
        duration: 0.18,
        ease: "none",
      },
      0.9,
    );

    /*
     * 第四段：
     * Now 恢复全屏。
     * SVG 参考 Ins 进场方式反向放大离场。
     */
    tl.set(
      filmEl,
      {
        transformOrigin: "50% 75%",
      },
      1.08,
    );

    tl.to(
      nowEl,
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: "none",
      },
      1.08,
    );

    tl.to(
      filmEl,
      {
        scale: startScale,
        y: "-100vh",
        opacity: 0,
        duration: 0.45,
        ease: "none",
      },
      1.08,
    );

    /*
     * 第五段：
     * 这就是 Now 的 pin 效果。
     *
     * 注意：
     * 这里不是重新 pin nowEl。
     * 而是因为 pinnedRef 已经固定，
     * 所以只要 nowEl 保持 y: 0 / scale: 1，
     * 视觉上 Now 就是固定不动的。
     */
    tl.to(
      nowEl,
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "none",
      },
      1.53,
    );

    /*
     * 第六段：
     * Footer 从底部往上覆盖固定住的 Now 页面。
     */
    tl.to(
      footerEl,
      {
        y: 0,
        duration: 0.75,
        ease: "none",
      },
      1.75,
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

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  computeLayout();
  setupAnimation();

  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  ctx?.revert();
  ctx = null;

  if (import.meta.client) {
    window.removeEventListener("resize", handleResize);
  }
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
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.inspiration-film-stage__inspiration {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100vh;
  will-change: transform, opacity;
}

.inspiration-film-stage__now {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100vh;
  background: #f6f1e7;
  will-change: transform, opacity;
}

.inspiration-film-stage__now-inner {
  width: 100%;
  height: 100%;
  padding-inline: 1.5rem;
}

.inspiration-film-stage__film-overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100vw;
  height: 200vh;
  object-fit: fill;
  object-position: top center;
  pointer-events: none;
  opacity: 0;
  will-change: transform, opacity;
}

.inspiration-film-stage__footer-cover {
  position: absolute;
  inset: 0;
  z-index: 20;
  width: 100vw;
  min-height: 100vh;
  will-change: transform;
}

@media (min-width: 768px) {
  .inspiration-film-stage__now-inner {
    padding-inline: 3rem;
  }
}

@media (min-width: 1280px) {
  .inspiration-film-stage__now-inner {
    padding-inline: 60px;
  }
}
</style>
