<template>
  <section
    id="works-gallery"
    ref="sectionRef"
    class="blueprint-section relative z-20 left-1/2 flex min-h-screen w-screen max-w-none -translate-x-1/2 flex-col overflow-hidden font-sans text-[#1D1E18] lg:h-screen lg:min-h-0 lg:flex-row"
    :class="{ 'works-pre-anim': !animationReady }"
  >
    <div
      ref="leftStageRef"
      class="works-left-stage relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden bg-[#F6F4F0] lg:min-h-screen lg:w-[65%] lg:shrink-0"
    >
      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
      >
        <span
          ref="wordmarkRef"
          class="works-wordmark"
          :style="worksWordmarkStyle"
          >{{ worksWordmark }}</span
        >
      </div>
      <WorksCard3D
        :enable="animationReady"
        :section-el="sectionRef"
        :stage-el="leftStageRef"
        :final-x-ratio="worksCardFinalXRatio"
        :timeline-start="worksCardTimelineStart"
        :timeline-end="worksCardTimelineEnd"
        :final-x-at="worksCardFinalXAt"
      />
    </div>

    <div
      ref="rightPanelRef"
      class="blueprint-grid blueprint-frame relative flex w-full flex-col justify-center bg-white p-8 md:p-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[35%] lg:shrink-0 lg:px-24 lg:py-20 border-l border-[#1D1E18]/10"
    >
      <span
        aria-hidden="true"
        class="blueprint-frame-corner blueprint-frame-corner--bl"
        >└</span
      >
      <span
        aria-hidden="true"
        class="blueprint-frame-corner blueprint-frame-corner--br"
        >┘</span
      >
      <WorksProjectPanel />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { gsap } from "gsap";
import {
  WORKS_CARD_FINAL_X_RATIO,
  WORKS_CARD_TIMELINE_START,
  WORKS_CARD_TIMELINE_END,
  WORKS_CARD_FINAL_X_AT,
  WORKS_WORDMARK,
} from "~/components/site/works/worksConstants";
import WorksCard3D from "~/components/site/works/card3d/WorksCard3D.vue";
import WorksProjectPanel from "~/components/site/works/WorksProjectPanel.vue";

const sectionRef = ref<HTMLElement | null>(null);
const leftStageRef = ref<HTMLElement | null>(null);
const rightPanelRef = ref<HTMLElement | null>(null);
const wordmarkRef = ref<HTMLElement | null>(null);
const worksCardFinalXRatio = WORKS_CARD_FINAL_X_RATIO;
const worksCardTimelineStart = WORKS_CARD_TIMELINE_START;
const worksCardTimelineEnd = WORKS_CARD_TIMELINE_END;
const worksCardFinalXAt = WORKS_CARD_FINAL_X_AT;

const worksWordmark = ref(WORKS_WORDMARK);
const worksWordmarkStyle = ref<Record<string, string>>({});
const animationReady = ref(false);

let gsapCtx: gsap.Context | null = null;
let wordmarkResizeObserver: ResizeObserver | null = null;
let handleWordmarkFontsReady: (() => void) | null = null;

defineExpose({ sectionRef });

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const syncWorksWordmarkFit = () => {
  if (!leftStageRef.value || !wordmarkRef.value) return;
  const cw = leftStageRef.value.clientWidth;
  const ch = leftStageRef.value.clientHeight;
  if (!cw || !ch) return;
  const nw = wordmarkRef.value.offsetWidth;
  const nh = wordmarkRef.value.offsetHeight;
  if (!nw || !nh) return;
  worksWordmarkStyle.value = {
    transform: `scale(${(cw / nw) * 0.96}, ${(ch / nh) * 0.92})`,
  };
};

onMounted(async () => {
  await nextTick();
  syncWorksWordmarkFit();

  wordmarkResizeObserver = new ResizeObserver(syncWorksWordmarkFit);
  if (leftStageRef.value) wordmarkResizeObserver.observe(leftStageRef.value);
  if (wordmarkRef.value) wordmarkResizeObserver.observe(wordmarkRef.value);

  if (import.meta.client && "fonts" in document) {
    handleWordmarkFontsReady = syncWorksWordmarkFit;
    void document.fonts.ready.then(syncWorksWordmarkFit);
    document.fonts.addEventListener?.("loadingdone", handleWordmarkFontsReady);
  }

  if (!sectionRef.value) return;

  if (leftStageRef.value)
    gsap.set(leftStageRef.value, {
      clearProps: "clipPath,transform,opacity,width",
    });
  if (rightPanelRef.value)
    gsap.set(rightPanelRef.value, {
      clearProps: "transform,opacity,width,overflow,right",
    });

  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

  if (!isDesktop || prefersReducedMotion()) {
    animationReady.value = true;
    return;
  }

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  gsapCtx = gsap.context(() => {
    gsap.set(leftStageRef.value, {
      clipPath: "inset(100% 0% 0% 0%)",
      width: "100%",
    });
    if (rightPanelRef.value) {
      gsap.set(rightPanelRef.value, {
        width: "35%",
        right: "-35%",
      });
    }
    gsap.set(wordmarkRef.value, { opacity: 0 });

    animationReady.value = true;

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: "top bottom",
          end: "+=150%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      .to(
        leftStageRef.value,
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.667 },
        0,
      )
      .to(wordmarkRef.value, { opacity: 0.84, duration: 0.7 }, 0.15);

    const layoutTl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: "top top",
        end: "+=100%",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    layoutTl.to(
      leftStageRef.value,
      { width: "65%", duration: 0.3, ease: "power2.inOut" },
      0.7,
    );

    if (rightPanelRef.value) {
      layoutTl.to(
        rightPanelRef.value,
        {
          right: "0%",
          duration: 0.3,
          ease: "power2.inOut",
        },
        0.7,
      );
    }

    // Refresh required: ensures the two timelines (clipPath reveal + layout)
    // measure correct trigger positions based on final section height. Without
    // this the start/end values may use stale measurements from before
    // interior content (wordmark, card, panel) fully renders.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, sectionRef.value);
});

watch(worksWordmark, async () => {
  await nextTick();
  syncWorksWordmarkFit();
});

onBeforeUnmount(() => {
  gsapCtx?.revert();
  wordmarkResizeObserver?.disconnect();
  if (import.meta.client && handleWordmarkFontsReady && "fonts" in document) {
    document.fonts.removeEventListener?.(
      "loadingdone",
      handleWordmarkFontsReady,
    );
  }
});
</script>

<style scoped>
.blueprint-grid {
  background-image:
    linear-gradient(rgba(29, 30, 24, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29, 30, 24, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  background-position: center center;
}

.blueprint-frame {
  --blueprint-frame-inset: 0.875rem;
}

.blueprint-frame::before {
  content: "";
  position: absolute;
  inset: var(--blueprint-frame-inset);
  border: 1.5px solid rgba(29, 30, 24, 0.18);
  pointer-events: none;
}

.blueprint-frame-corner {
  position: absolute;
  bottom: calc(var(--blueprint-frame-inset) + 0.45rem);
  z-index: 1;
  font-family: "Georgia", "Times New Roman", "Book Antiqua", serif;
  font-size: 1.35rem;
  line-height: 1;
  color: rgba(29, 30, 24, 0.38);
  pointer-events: none;
  user-select: none;
}

.blueprint-frame-corner--bl {
  left: calc(var(--blueprint-frame-inset) + 0.3rem);
}
.blueprint-frame-corner--br {
  right: calc(var(--blueprint-frame-inset) + 0.3rem);
}

.works-wordmark {
  display: block;
  text-align: center;
  white-space: nowrap;
  text-transform: uppercase;
  font-family: "Georgia", "Times New Roman", "Book Antiqua", serif;
  font-weight: 500;
  font-size: 16rem;
  line-height: 0.82;
  letter-spacing: -0.035em;
  color: #e7dfd2;
  opacity: 0.84;
  transform-origin: center center;
  will-change: transform;
}

@media (min-width: 1024px) {
  .works-pre-anim .works-left-stage {
    width: 100%;
  }
  .works-pre-anim .blueprint-frame {
    width: 35%;
    right: -35%;
  }
}

.works-left-stage {
  background-color: #f6f4f0;
  background-image:
    radial-gradient(
      circle at 18% 18%,
      rgba(255, 255, 255, 0.78) 0,
      rgba(255, 255, 255, 0) 36%
    ),
    radial-gradient(
      circle at 82% 24%,
      rgba(233, 224, 210, 0.36) 0,
      rgba(233, 224, 210, 0) 28%
    ),
    linear-gradient(135deg, rgba(29, 30, 24, 0.03) 0%, rgba(29, 30, 24, 0) 42%),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.24) 0,
      rgba(255, 255, 255, 0.24) 1px,
      transparent 1px,
      transparent 24px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(29, 30, 24, 0.018) 0,
      rgba(29, 30, 24, 0.018) 1px,
      transparent 1px,
      transparent 24px
    );
  background-position: center center;
  background-size:
    auto,
    auto,
    auto,
    24px 24px,
    24px 24px;
}

@media (min-width: 768px) {
  .blueprint-frame {
    --blueprint-frame-inset: 1.5rem;
  }
  .blueprint-frame::before {
    inset: var(--blueprint-frame-inset);
  }
}

@media (min-width: 1024px) {
  .blueprint-frame {
    --blueprint-frame-inset: 2rem;
  }
  .blueprint-frame::before {
    inset: var(--blueprint-frame-inset);
  }
}
</style>
