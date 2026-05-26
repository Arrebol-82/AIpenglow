<script setup lang="ts">
import { gsap } from "gsap";
import topEdgeImage from "~/assets/images/main.webp";

let revealAnimationContext: gsap.Context | null = null;
let destroyPageScroll: (() => void) | null = null;

const revealStageRef = ref<HTMLElement | null>(null);
const heroLayerRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (!revealStageRef.value || !heroLayerRef.value) {
    return;
  }

  const pageScroll = await initPageScroll();
  if (!pageScroll) {
    return;
  }

  destroyPageScroll = pageScroll.destroy;

  revealAnimationContext = gsap.context(() => {
    const getHeroParallaxStart = () =>
      window.innerWidth < 768 ? "-2.5rem" : "-3.5rem";
    const getHeroParallaxEnd = () =>
      window.innerWidth < 768 ? "2rem" : "3rem";
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: revealStageRef.value,
        start: "top top",
        end: () => `+=${window.innerHeight}`,
        scrub: 0.9,
        pin: heroLayerRef.value,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline.fromTo(
      heroLayerRef.value,
      {
        "--hero-cover-parallax-y": getHeroParallaxStart,
      },
      {
        "--hero-cover-parallax-y": getHeroParallaxEnd,
        ease: "none",
      },
      0,
    );

    const dividerLines = gsap.utils.toArray<HTMLElement>(".divider-line");
    if (dividerLines.length) {
      gsap.fromTo(
        dividerLines,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".divider-01-02",
            start: "top bottom",
            end: "center center",
            scrub: true,
          },
        },
      );
    }
  }, revealStageRef.value);

  pageScroll.refresh();
});

onBeforeUnmount(() => {
  revealAnimationContext?.revert();
  revealAnimationContext = null;
  destroyPageScroll?.();
  destroyPageScroll = null;
});
</script>

<template>
  <div class="page-shell home-page-shell">
    <div class="grain-overlay"></div>

    <TheNavbar />

    <div ref="revealStageRef" class="home-reveal-stage">
      <div ref="heroLayerRef" class="home-hero-layer">
        <HeroSection />
      </div>

      <div class="home-content-layer">
        <div class="paper-transition relative w-full" aria-hidden="true">
          <img
            :src="topEdgeImage"
            alt=""
            aria-hidden="true"
            class="torn-edge-image pointer-events-none absolute inset-x-0 bottom-0 block select-none"
          />
        </div>

        <main
          class="paper-main relative w-full px-6 pt-0 pb-24 md:px-12 md:pt-0 md:pb-28 xl:px-[60px]"
        >
          <div class="relative z-10 space-y-36 md:space-y-40">
            <SectionMe />

            <SectionSoul />

            <div
              class="divider-01-02 relative z-10 -mx-6 flex w-auto items-center justify-center gap-4 md:-mx-12 xl:-mx-[60px]"
            >
              <div
                class="divider-line divider-line--left h-px flex-1 bg-[#1D1E18] opacity-30"
              ></div>
              <div
                class="whitespace-nowrap font-mono text-[10px] font-bold tracking-widest text-[#1D1E18] opacity-80 uppercase md:text-xs"
              >
                [ 01 &gt; 02 ]
              </div>
              <div
                class="divider-line divider-line--right h-px flex-1 bg-[#1D1E18] opacity-30"
              ></div>
            </div>

            <SectionCode />

            <WorksArchiveStage />

            <SectionInspiration />
          </div>
        </main>
      </div>
    </div>

    <NowFooterStage />
  </div>
</template>

<style scoped>
:global(html),
:global(body) {
  background: transparent;
}

.paper-transition {
  overflow: hidden;
  height: 5.75rem;
  margin-bottom: -2px;
  background-color: transparent;
}

.home-page-shell {
  background: transparent;
}

.home-reveal-stage {
  position: relative;
  isolation: isolate;
}

.home-hero-layer {
  position: relative;
  left: 50%;
  z-index: 0;
  width: 100vw;
  max-width: none;
  transform: translateX(-50%);
  overflow: hidden;
  --hero-cover-parallax-y: -3.5rem;
  will-change: transform;
}

.home-content-layer {
  position: relative;
  z-index: 10;
}

@media (min-width: 768px) {
  .paper-transition {
    height: 6.75rem;
  }
}

@media (max-width: 767px) {
  .home-hero-layer {
    --hero-cover-parallax-y: -2.5rem;
  }
}

@media (min-width: 1280px) {
  .paper-transition {
    height: 17rem;
  }
}

.paper-main {
  margin-top: -2px;
  padding-top: 0;
  background: #f6f1e7;
}

.torn-edge-image {
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center bottom;
}

.divider-line {
  will-change: transform;
}
.divider-line--left {
  transform-origin: right center;
}
.divider-line--right {
  transform-origin: left center;
}
</style>
