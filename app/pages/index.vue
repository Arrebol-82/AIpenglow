<script setup lang="ts">
import { gsap } from "gsap";
import topEdgeImage from "~/assets/images/main.webp";

let revealAnimationContext: gsap.Context | null = null;
let smoother: import("gsap/ScrollSmoother").ScrollSmoother | null = null;

const revealStageRef = ref<HTMLElement | null>(null);
const heroLayerRef = ref<HTMLElement | null>(null);

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

onMounted(async () => {
  if (prefersReducedMotion() || !revealStageRef.value || !heroLayerRef.value) {
    return;
  }

  const [{ ScrollTrigger }, { ScrollSmoother }] = await Promise.all([
    import("gsap/ScrollTrigger"),
    import("gsap/ScrollSmoother"),
  ]);

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 2,
    effects: true,
    normalizeScroll: true,
  });

  ScrollTrigger.refresh();

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
  }, revealStageRef.value);
});

onBeforeUnmount(() => {
  revealAnimationContext?.revert();
  revealAnimationContext = null;
  smoother?.kill();
  smoother = null;
});
</script>

<template>
  <div class="page-shell home-page-shell">
    <div class="grain-overlay"></div>

    <TheNavbar />

    <div id="smooth-wrapper">
      <div id="smooth-content">
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
                  class="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-center gap-4 px-6 md:px-12 lg:px-24"
                >
                  <div class="h-px flex-1 bg-[#1D1E18] opacity-30"></div>
                  <div
                    class="whitespace-nowrap font-mono text-[10px] font-bold tracking-widest text-[#1D1E18] opacity-80 uppercase md:text-xs"
                  >
                    [ 01 &gt; 02 ]
                  </div>
                  <div class="h-px flex-1 bg-[#1D1E18] opacity-30"></div>
                </div>

                <SectionCode />

                <SectionWorks />

                <SectionArchive />

                <SectionInspiration />

                <SectionNow />
              </div>
            </main>
          </div>
        </div>

        <TheFooter />
      </div>
    </div>
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
  padding-top: 0;
  background: #f6f1e7;
}

.torn-edge-image {
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center bottom;
}
</style>
