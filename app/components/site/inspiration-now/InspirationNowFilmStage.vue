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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";

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
    !filmOverlayRef.value
  ) {
    return;
  }

  ctx = gsap.context(() => {
    const inspirationEl = inspirationWrapperRef.value;
    const nowEl = nowWrapperRef.value;
    const filmEl = filmOverlayRef.value;

    if (!inspirationEl || !nowEl || !filmEl) return;

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outerRef.value,
        start: "top top",

        // 整体转场长度：
        // 1. Ins 进入胶卷
        // 2. 胶卷跨页移动到 Now
        // 3. SVG 短暂停住
        // 4. Now 释放，SVG 放大离场
        end: "+=160%",

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
     * SVG 整体上移。
     * 当 y 到 -100vh 时，
     * SVG 底部刚好贴住视口底部。
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
     * SVG 底部贴住视口底部后，先固定停住一小段。
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
     * 离场前：
     * 把 SVG 的缩放中心切到第二帧中心。
     *
     * 进场时中心在上半部分：50% 25%
     * 离场时中心在下半部分：50% 75%
     */
    tl.set(
      filmEl,
      {
        transformOrigin: "50% 75%",
      },
      1.08,
    );

    /*
     * 第四段：
     * 释放 Now 页面。
     * Now 从胶卷第二帧 cutout 里的缩小状态恢复到原始大小。
     */
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

    /*
     * 第五段：
     * SVG 参考 Ins 进场方式反向离场。
     *
     * Ins 进场：
     * SVG scale: startScale -> 1
     *
     * Now 离场：
     * SVG scale: 1 -> startScale
     *
     * 注意：
     * 这里不再让 SVG 继续 y: -200vh 往上滑走。
     * 它保持在 y: -100vh，然后以第二帧为中心放大离场。
     */
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

/*
 * 固定舞台只保留 100vh。
 * SVG 是 200vh，由 GSAP 控制它跨越两个页面。
 */
.inspiration-film-stage__pinned {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.inspiration-film-stage__inspiration {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100vh;
  will-change: transform, opacity;
}

.inspiration-film-stage__now {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100vh;
  will-change: transform, opacity;
}

/*
 * film.svg 跨两个页面：
 * 第一帧对应 Inspiration
 * 第二帧对应 Now
 */
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
  will-change: transform, opacity;
}

.inspiration-film-stage__now-inner {
  width: 100%;
  height: 100%;
  padding-inline: 1.5rem;
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
