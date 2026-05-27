<template>
  <section
    ref="sectionRef"
    class="relative z-10 left-1/2 flex min-h-screen w-screen max-w-none -translate-x-1/2 flex-col overflow-hidden bg-[#F3EFE7] font-sans text-[#1D1E18]"
  >
    <div
      class="archive-grid pointer-events-none absolute inset-0 opacity-60"
    ></div>

    <div
      class="archive-band relative z-10 flex h-[3.25rem] items-center overflow-hidden border-b border-[#1D1E18]/15 bg-[#F3EFE7] md:h-[3.5rem]"
    >
      <div
        ref="topTrackRef"
        class="archive-band-track font-mono text-[20px] tracking-[0.2em] text-[#1D1E18]/40"
      >
        <span
          v-for="copy in marqueeCopies"
          :key="`top-${copy}`"
          class="px-4 uppercase"
        >
          {{ MARQUEE_TEXT }}
        </span>
      </div>
    </div>

    <div class="relative z-10 flex h-full w-full flex-1">
      <div
        class="hidden w-24 items-center justify-center border-r border-[#1D1E18]/15 bg-[#F3EFE7] py-12 md:flex lg:w-40"
      >
        <h2
          ref="watermarkRef"
          class="watermark-outline vertical-text select-none font-serif font-bold text-[6rem] tracking-widest lg:text-[8rem]"
        >
          ARCHIVE
        </h2>
      </div>

      <div
        ref="contentRef"
        class="relative flex flex-1 flex-col justify-center py-[1.125rem] md:py-[4.125rem]"
      >
        <ul
          class="flex w-full flex-col"
          @pointerover="handleListPointerOver"
          @pointermove="handleListPointerMove"
          @pointerleave="handleListPointerLeave"
        >
          <li
            v-for="(project, index) in projects"
            :key="project.title"
            :ref="(el) => setItemRef(el, index)"
            :data-archive-index="index"
            class="group archive-item relative flex cursor-pointer items-center justify-between px-6 py-6 transition-colors duration-200 hover:bg-[#E5DFD3] md:px-12 md:py-8 lg:px-24"
          >
            <span
              v-if="index !== 0"
              aria-hidden="true"
              class="archive-item-line absolute left-0 top-0 h-px bg-[#1D1E18]/20"
            ></span>

            <h3
              class="w-1/2 font-serif text-3xl text-[#111] transition-transform duration-300 group-hover:translate-x-4 md:text-5xl"
            >
              <span class="archive-title inline-flex flex-wrap">
                <span
                  v-for="(char, charIndex) in splitTitle(project.title)"
                  :key="`${project.title}-${charIndex}`"
                  class="char-mask overflow-hidden pb-[0.08em]"
                >
                  <span class="char inline-block">{{ char }}</span>
                </span>
              </span>
            </h3>

            <span
              class="archive-role w-1/4 text-left font-serif text-lg text-[#1D1E18]/80 md:text-2xl"
            >
              {{ project.role }}
            </span>

            <span
              class="archive-year w-1/4 text-right font-serif text-[1.75rem] text-[#111] md:text-[2.125rem]"
            >
              {{ project.year }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div
      ref="previewRef"
      class="archive-preview pointer-events-none absolute left-0 top-0 z-[60] opacity-0"
    >
      <div
        v-if="activePreviewProject"
        :key="activePreviewIndex ?? 0"
        ref="previewCardRef"
        class="relative w-[240px] md:w-[320px]"
      >
        <img
          :src="activePreviewProject.image"
          :alt="activePreviewProject.title"
          class="block h-[162px] w-full rounded-[0.45rem] object-cover shadow-[0_24px_48px_rgba(29,30,24,0.14)] md:h-[224px]"
        />
      </div>
    </div>

    <div
      class="archive-band relative z-10 flex h-[3.25rem] items-center overflow-hidden border-t border-[#1D1E18]/15 bg-[#F3EFE7] md:h-[3.5rem]"
    >
      <div
        ref="bottomTrackRef"
        class="archive-band-track font-mono text-[20px] tracking-[0.2em] text-[#1D1E18]/40"
      >
        <span
          v-for="copy in marqueeCopies"
          :key="`bottom-${copy}`"
          class="px-4 uppercase"
        >
          {{ MARQUEE_TEXT }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { projects } from "./archiveData";
import {
  MARQUEE_TEXT,
  MARQUEE_COPIES,
  MARQUEE_DURATION,
  ENTRANCE_WATERMARK,
  ENTRANCE_LINES,
  ENTRANCE_CHARS,
  ENTRANCE_META,
  PREVIEW_INITIAL,
  PREVIEW_POSITION_TWEEN,
  PREVIEW_FIRST_SHOW_CONTAINER,
  PREVIEW_FIRST_SHOW_CARD,
  PREVIEW_SWITCH_CARD,
  PREVIEW_LEAVE,
} from "./archiveConstants";

// ---------------------------------------------------------------------------
// Derived constants
// ---------------------------------------------------------------------------

const marqueeCopies = Array.from(
  { length: MARQUEE_COPIES },
  (_, index) => index,
);

// ---------------------------------------------------------------------------
// Template refs
// ---------------------------------------------------------------------------

const sectionRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const watermarkRef = ref<HTMLElement | null>(null);
const topTrackRef = ref<HTMLElement | null>(null);
const bottomTrackRef = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);
const previewRef = ref<HTMLElement | null>(null);
const previewCardRef = ref<HTMLElement | null>(null);
const activePreviewIndex = ref<number | null>(null);

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

const activePreviewProject = computed(() =>
  activePreviewIndex.value === null ? null : projects[activePreviewIndex.value],
);

// ---------------------------------------------------------------------------
// Internal state (non-reactive)
// ---------------------------------------------------------------------------

let ctx: gsap.Context | null = null;
let marqueeTweens: gsap.core.Tween[] = [];
let previewVisible = false;

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const splitTitle = (value: string) =>
  [...value].map((char) => (char === " " ? "\u00A0" : char));

const setItemRef = (element: unknown, index: number) => {
  if (element instanceof HTMLElement) {
    itemRefs.value[index] = element;
  }
};

// ---------------------------------------------------------------------------
// Entrance animation (called externally via defineExpose)
// ---------------------------------------------------------------------------

const triggerEntrance = () => {
  if (!sectionRef.value || prefersReducedMotion()) return;

  const root = sectionRef.value;

  if (watermarkRef.value) {
    gsap.fromTo(
      watermarkRef.value,
      ENTRANCE_WATERMARK.from,
      ENTRANCE_WATERMARK.to,
    );
  }

  const items = itemRefs.value.filter(Boolean);
  if (items.length) {
    const itemLines = Array.from(
      root.querySelectorAll<HTMLElement>(".archive-item-line"),
    );
    const chars = Array.from(root.querySelectorAll<HTMLElement>(".char"));
    const meta = Array.from(
      root.querySelectorAll<HTMLElement>(".archive-role, .archive-year"),
    );

    gsap
      .timeline()
      .fromTo(itemLines, ENTRANCE_LINES.from, ENTRANCE_LINES.to)
      .fromTo(
        chars,
        ENTRANCE_CHARS.from,
        ENTRANCE_CHARS.to,
        ENTRANCE_CHARS.offset,
      )
      .fromTo(meta, ENTRANCE_META.from, ENTRANCE_META.to, ENTRANCE_META.offset);
  }
};

defineExpose({ sectionRef, triggerEntrance });

// ---------------------------------------------------------------------------
// Preview helpers
// ---------------------------------------------------------------------------

const positionPreview = (event: PointerEvent, immediate = false) => {
  if (!previewRef.value || !contentRef.value) return;

  const bounds = contentRef.value.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  if (immediate) {
    gsap.set(previewRef.value, { x, y });
    return;
  }

  gsap.to(previewRef.value, {
    x,
    y,
    ...PREVIEW_POSITION_TWEEN,
  });
};

const showPreview = async (event: PointerEvent, index: number) => {
  const preview = previewRef.value;
  if (!preview) return;

  const isFirstShow = !previewVisible;
  const isSameIndex = activePreviewIndex.value === index;

  positionPreview(event, isFirstShow);

  if (isFirstShow) {
    activePreviewIndex.value = index;
    await nextTick();

    if (!previewCardRef.value) return;

    gsap.killTweensOf(preview);
    previewVisible = true;
    gsap.fromTo(
      preview,
      PREVIEW_FIRST_SHOW_CONTAINER.from,
      PREVIEW_FIRST_SHOW_CONTAINER.to,
    );
    gsap.fromTo(
      previewCardRef.value,
      PREVIEW_FIRST_SHOW_CARD.from,
      PREVIEW_FIRST_SHOW_CARD.to,
    );
    return;
  }

  if (isSameIndex) return;

  activePreviewIndex.value = index;
  await nextTick();

  if (!previewCardRef.value) return;

  gsap.killTweensOf(previewCardRef.value);
  gsap.fromTo(
    previewCardRef.value,
    PREVIEW_SWITCH_CARD.from,
    PREVIEW_SWITCH_CARD.to,
  );
};

const getHoveredArchiveIndex = (event: PointerEvent) => {
  const target = event.target;
  const row =
    target instanceof HTMLElement
      ? target.closest<HTMLElement>("[data-archive-index]")
      : null;

  if (!row) {
    return null;
  }

  const index = Number(row.dataset.archiveIndex);
  if (Number.isNaN(index)) {
    return null;
  }

  return index;
};

// ---------------------------------------------------------------------------
// Pointer event handlers
// ---------------------------------------------------------------------------

const handleListPointerOver = (event: PointerEvent) => {
  const index = getHoveredArchiveIndex(event);
  if (index === null) return;

  void showPreview(event, index);
};

const handleListPointerMove = (event: PointerEvent) => {
  const index = getHoveredArchiveIndex(event);
  if (index === null) {
    handleListPointerLeave();
    return;
  }

  void showPreview(event, index);
};

const handleListPointerLeave = () => {
  const preview = previewRef.value;

  if (!preview || !previewVisible) return;

  previewVisible = false;
  gsap.killTweensOf(preview);
  if (previewCardRef.value) {
    gsap.killTweensOf(previewCardRef.value);
  }
  gsap.to(preview, {
    ...PREVIEW_LEAVE.to,
    onComplete: () => {
      if (!previewVisible) {
        activePreviewIndex.value = null;
      }
    },
  });
};

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(async () => {
  await nextTick();

  if (!sectionRef.value) return;

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  ctx = gsap.context(() => {
    const items = itemRefs.value.filter(Boolean);

    if (previewRef.value) {
      gsap.set(previewRef.value, PREVIEW_INITIAL);
    }

    if (prefersReducedMotion()) return;

    if (topTrackRef.value) {
      marqueeTweens.push(
        gsap.fromTo(
          topTrackRef.value,
          { xPercent: 0 },
          {
            xPercent: -50,
            duration: MARQUEE_DURATION,
            ease: "none",
            repeat: -1,
          },
        ),
      );
    }

    if (bottomTrackRef.value) {
      marqueeTweens.push(
        gsap.fromTo(
          bottomTrackRef.value,
          { xPercent: -50 },
          { xPercent: 0, duration: MARQUEE_DURATION, ease: "none", repeat: -1 },
        ),
      );
    }

    if (watermarkRef.value) {
      gsap.set(watermarkRef.value, ENTRANCE_WATERMARK.from);
    }

    if (items.length) {
      const root = sectionRef.value!;
      const itemLines = Array.from(
        root.querySelectorAll<HTMLElement>(".archive-item-line"),
      );
      const chars = Array.from(root.querySelectorAll<HTMLElement>(".char"));
      const meta = Array.from(
        root.querySelectorAll<HTMLElement>(".archive-role, .archive-year"),
      );

      gsap.set(items, { autoAlpha: 1, y: 0 });
      gsap.set(itemLines, ENTRANCE_LINES.from);
      gsap.set(chars, ENTRANCE_CHARS.from);
      gsap.set(meta, ENTRANCE_META.from);
    }

    // Refresh required: ensures WorksArchiveStage's pin spacer recalculates
    // after SectionArchive content renders into archiveWrapper, otherwise the
    // pin height stays at pre-render value (0 or stale) and offsets all
    // subsequent scroll positions.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, sectionRef.value);
});

onBeforeUnmount(() => {
  marqueeTweens.forEach((tween) => tween.kill());
  marqueeTweens = [];
  ctx?.revert();
  ctx = null;
  previewVisible = false;
  if (previewRef.value) {
    gsap.killTweensOf(previewRef.value);
  }
  if (previewCardRef.value) {
    gsap.killTweensOf(previewCardRef.value);
  }
});
</script>

<style scoped>
.font-serif {
  font-family: "Cormorant Garamond", "Noto Serif SC", "Songti SC", serif;
}

.archive-grid {
  background-image:
    linear-gradient(rgba(29, 30, 24, 0.08) 1.5px, transparent 1.5px),
    linear-gradient(90deg, rgba(29, 30, 24, 0.08) 1.5px, transparent 1.5px),
    linear-gradient(rgba(29, 30, 24, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29, 30, 24, 0.05) 1px, transparent 1px);
  background-size:
    84px 56px,
    84px 56px,
    52px 88px,
    52px 88px;
  background-position:
    0 0,
    0 0,
    0 28px,
    26px 0;
}

.archive-band-track {
  display: inline-flex;
  min-width: max-content;
  white-space: nowrap;
  will-change: transform;
}

.archive-item {
  will-change: transform, opacity, background-color;
}

.archive-preview {
  will-change: transform, opacity;
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.watermark-outline {
  color: transparent;
  -webkit-text-stroke: 1px rgba(29, 30, 24, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .archive-band-track,
  .archive-item,
  .archive-preview {
    will-change: auto;
  }
}
</style>
