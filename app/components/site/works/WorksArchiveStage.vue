<template>
  <div class="works-archive-stage">
    <div ref="worksWrapperRef" class="works-wrapper">
      <SectionWorks />
    </div>
    <div ref="archiveWrapperRef" class="archive-wrapper">
      <SectionArchive ref="archiveRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import SectionWorks from "~/components/site/works/WorksSection.vue";
import SectionArchive from "~/components/site/archive/SectionArchive.vue";

const worksWrapperRef = ref<HTMLElement | null>(null);
const archiveWrapperRef = ref<HTMLElement | null>(null);
const archiveRef = ref<InstanceType<typeof SectionArchive> | null>(null);

let stageCtx: gsap.Context | null = null;

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

onMounted(async () => {
  await nextTick();

  const worksWrapper = worksWrapperRef.value;
  const archiveWrapper = archiveWrapperRef.value;
  if (!worksWrapper || !archiveWrapper) return;

  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  if (!isDesktop || prefersReducedMotion()) return;

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  stageCtx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: archiveWrapper,
      start: "top top",
      end: "+=200%",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    gsap.set(archiveWrapper, { autoAlpha: 0 });

    let entranceTriggered = false;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: archiveWrapper,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!entranceTriggered && self.progress >= 0.23) {
            entranceTriggered = true;
            archiveRef.value?.triggerEntrance();
          }
        },
      },
    });

    tl.to(archiveWrapper, { autoAlpha: 1, duration: 0.001 }, 0.3);
    tl.to(worksWrapper, { yPercent: -100, ease: "none", duration: 1.0 }, 0.3);

    // Refresh required: ensures the pin spacer height is calculated after
    // SectionArchive content renders inside archiveWrapper. Without this the
    // pin height may be stale (0 or pre-render), breaking all downstream
    // scroll offsets and the sticky worksWrapper boundary.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
});

onBeforeUnmount(() => {
  stageCtx?.revert();
  stageCtx = null;
});
</script>

<style scoped>
.works-archive-stage {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

.works-wrapper {
  position: sticky;
  top: 0;
  z-index: 10;
  will-change: transform;
}

.archive-wrapper {
  position: relative;
  z-index: 0;
}

@media (prefers-reduced-motion: reduce) {
  .works-wrapper {
    will-change: auto;
  }
}
</style>
