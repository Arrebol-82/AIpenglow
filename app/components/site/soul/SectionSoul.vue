<template>
  <section
    ref="sectionRef"
    class="section-philosophy bg-[#f6f1e7] text-white pt-24 px-6 md:px-12 lg:px-24 min-h-screen relative z-30 overflow-hidden font-sans"
    @pointermove="handlePanelPointerMove"
    @pointerleave="handlePanelPointerLeave"
  >
    <div aria-hidden="true" class="section-dots soul-dots"></div>
    <div aria-hidden="true" class="section-dots section-dots--glow"></div>

    <div
      class="soul-watermark absolute right-0 top-[1.875rem] opacity-80 pointer-events-none select-none md:top-[2.375rem]"
    >
      <div
        class="watermark-text watermark-text--soul whitespace-nowrap tracking-[-0.03em] text-[6.5rem] md:text-[10rem] lg:text-[15rem]"
      >
        <span class="watermark-leading">S</span>OUL
      </div>
    </div>

    <div class="reflection-panel isolate relative z-10 max-w-[1400px] mx-auto">
      <div class="relative z-10 pb-10">
        <div
          class="soul-tag-top mb-16 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-white opacity-80 uppercase md:mb-24 md:text-xs"
        >
          <span>{{ SOUL_TAG_TOP }}</span>
        </div>

        <div
          class="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:min-h-[42rem] lg:gap-16 items-start"
        >
          <div
            ref="imageCardRef"
            class="relative z-10 translate-y-[1.75rem] pt-4 md:pt-10 lg:col-span-6 lg:col-start-1"
          >
            <div
              class="reflection-photo-shell relative w-[calc(88%_+_40px)] max-w-full mx-auto lg:mx-0"
            >
              <div
                class="image-corner absolute -top-4 -left-4 w-4 h-px bg-white opacity-30"
              ></div>
              <div
                class="image-corner absolute -top-4 -left-4 w-px h-4 bg-white opacity-30"
              ></div>

              <div
                class="soul-photo-card bg-white p-3 shadow-md border border-[#1D1E18]/10 rounded-sm rotate-[-1deg] transition-transform hover:rotate-0 duration-500 ease-out"
              >
                <div
                  class="reflection-photo-media bg-[#EAE7DF] w-full block h-[21.875rem] text-[#1D1E18]/40 border border-[#1D1E18]/5 border-dashed"
                >
                  <img
                    :src="SOUL_PHOTO_SRC"
                    :alt="SOUL_PHOTO_ALT"
                    class="soul-photo-img block w-full h-[21.875rem] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="relative z-10 flex translate-y-[1.75rem] flex-col justify-center pt-4 md:pt-10 lg:col-span-6 lg:col-start-7"
          >
            <h2
              class="soul-title text-[3rem] md:text-[3.75rem] leading-[1.22] text-white mb-12 tracking-[-0.03em]"
            >
              {{ SOUL_TITLE }}
            </h2>

            <div class="soul-copy-grid mt-6 text-[13px] md:mt-8 md:text-sm">
              <article
                class="soul-paragraph soul-copy-card soul-copy-card--left text-justify leading-relaxed font-medium text-white/80"
              >
                <div
                  class="mb-4 text-[10px] font-mono font-bold tracking-widest opacity-80"
                >
                  {{ SOUL_PARAGRAPH_1_LABEL }}
                </div>
                <p>
                  {{ SOUL_PARAGRAPH_1_TEXT }}
                </p>
              </article>
              <div aria-hidden="true" class="soul-copy-divider"></div>
              <article
                class="soul-paragraph soul-copy-card soul-copy-card--right text-justify leading-relaxed font-medium text-white/80"
              >
                <div
                  class="mb-4 text-[10px] font-mono font-bold tracking-widest opacity-80"
                >
                  {{ SOUL_PARAGRAPH_2_LABEL }}
                </div>
                <p>
                  {{ SOUL_PARAGRAPH_2_TEXT }}
                </p>
              </article>
            </div>
          </div>
        </div>
        <div
          class="soul-tag-bottom absolute inset-x-0 bottom-5 text-[10px] font-mono font-bold tracking-widest text-white opacity-80 uppercase md:text-xs"
        >
          <img
            src="/images/add.svg"
            alt=""
            aria-hidden="true"
            class="pointer-events-none absolute bottom-full right-0 mb-6 mr-3 hidden w-6 select-none opacity-60 lg:block"
          />
          <span class="absolute left-0 top-1/2 -translate-y-1/2">{{
            SOUL_TAG_BOTTOM_LEFT
          }}</span>
          <span class="block text-center">{{ SOUL_TAG_BOTTOM_CENTER }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { gsap } from "gsap";
import {
  SOUL_TITLE,
  SOUL_PARAGRAPH_1_LABEL,
  SOUL_PARAGRAPH_1_TEXT,
  SOUL_PARAGRAPH_2_LABEL,
  SOUL_PARAGRAPH_2_TEXT,
  SOUL_PHOTO_SRC,
  SOUL_PHOTO_ALT,
  SOUL_TAG_TOP,
  SOUL_TAG_BOTTOM_LEFT,
  SOUL_TAG_BOTTOM_CENTER,
} from "./soulData";
import {
  SCROLL_START,
  SCROLL_END,
  DOT_CLIP_START,
  DOT_CLIP_END,
  BG_COLOR_MID,
  BG_COLOR_FINAL,
  DOT_R_MID,
  DOT_R_LARGE,
} from "./soulConstants";

const sectionRef = ref<HTMLElement | null>(null);
const imageCardRef = ref<HTMLElement | null>(null);

const navOnDark = useState<boolean>("navbar-on-dark", () => false);

let ctx: gsap.Context | null = null;
let panelGlowFrame = 0;
let pendingPanelGlow: { x: string; y: string } | null = null;

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pointerHasPrecision = () =>
  import.meta.client && window.matchMedia("(pointer: fine)").matches;

function handlePanelPointerMove(event: PointerEvent) {
  if (!pointerHasPrecision()) return;

  pendingPanelGlow = {
    x: `${event.clientX}px`,
    y: `${event.clientY}px`,
  };

  if (panelGlowFrame) return;

  panelGlowFrame = requestAnimationFrame(() => {
    if (!pendingPanelGlow) {
      panelGlowFrame = 0;
      return;
    }

    document.querySelectorAll<HTMLElement>(".section-dots").forEach((el) => {
      el.style.setProperty("--dot-glow-x", pendingPanelGlow!.x);
      el.style.setProperty("--dot-glow-y", pendingPanelGlow!.y);
      el.style.setProperty("--dot-glow-opacity", "1");
    });
    pendingPanelGlow = null;
    panelGlowFrame = 0;
  });
}

function handlePanelPointerLeave() {
  if (panelGlowFrame) {
    cancelAnimationFrame(panelGlowFrame);
    panelGlowFrame = 0;
  }

  pendingPanelGlow = null;
  document
    .querySelectorAll<HTMLElement>(".section-dots")
    .forEach((el) => el.style.setProperty("--dot-glow-opacity", "0"));
}

onMounted(async () => {
  if (!sectionRef.value || prefersReducedMotion()) return;

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  await nextTick();

  ctx = gsap.context(() => {
    const titleEl = sectionRef.value!.querySelector(
      ".soul-title",
    ) as HTMLElement | null;
    if (titleEl && !titleEl.dataset.split) {
      const lines = titleEl.innerHTML.split(/<br\s*\/?>/);
      titleEl.innerHTML = lines
        .map((line) =>
          Array.from(line.trim())
            .map((ch) =>
              ch.trim()
                ? `<span class="soul-title-char" style="display:inline-block;will-change:transform">${ch}</span>`
                : ch,
            )
            .join(""),
        )
        .join("<br />");
      titleEl.dataset.split = "1";
    }

    const setDotsActive = (active: boolean) => {
      document
        .querySelectorAll<HTMLElement>(".section-dots")
        .forEach((el) => el.classList.toggle("is-active", active));
    };

    const soulDotsEl =
      sectionRef.value!.querySelector<HTMLElement>(".soul-dots");

    const soulTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: SCROLL_START,
        end: SCROLL_END,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        scrub: 1,
        onEnter: () => {
          setDotsActive(true);
          navOnDark.value = true;
        },
        onEnterBack: () => {
          setDotsActive(true);
          navOnDark.value = true;
        },
        onLeaveBack: () => {
          setDotsActive(false);
          navOnDark.value = false;
        },
        onLeave: () => {
          navOnDark.value = true;
        },
      },
    });

    ScrollTrigger.create({
      trigger: sectionRef.value,
      start: "bottom top",
      onEnter: () => {
        navOnDark.value = false;
      },
      onLeaveBack: () => {
        navOnDark.value = true;
      },
    });

    const fromBelow = () => window.innerHeight;

    soulTl
      .fromTo(
        soulDotsEl,
        { clipPath: DOT_CLIP_START },
        {
          clipPath: DOT_CLIP_END,
          ease: "power3.out",
          duration: 1.1,
        },
        0,
      )

      .to(
        sectionRef.value,
        {
          keyframes: [
            {
              backgroundColor: BG_COLOR_MID,
              "--dot-r": DOT_R_MID,
              duration: 0.6,
              ease: "power2.in",
            },
            {
              backgroundColor: BG_COLOR_FINAL,
              "--dot-r": DOT_R_LARGE,
              duration: 0.8,
              ease: "power2.out",
            },
          ],
        },
        "<0.6",
      )

      .from(
        ".soul-tag-top",
        {
          y: fromBelow,
          opacity: 0,
          ease: "power3.out",
          duration: 1.2,
        },
        ">-0.2",
      )

      .from(
        ".soul-watermark",
        {
          y: fromBelow,
          opacity: 0,
          ease: "power3.out",
          duration: 1.4,
        },
        "<0.3",
      )

      .from(
        ".soul-title-char",
        {
          y: fromBelow,
          opacity: 0,
          stagger: { each: 0.04, from: "start" },
          ease: "power3.out",
          duration: 1.1,
        },
        "<0.4",
      )

      .from(
        ".soul-copy-divider",
        {
          y: fromBelow,
          opacity: 0,
          ease: "power3.out",
          duration: 1,
        },
        ">0.2",
      )

      .from(
        ".soul-paragraph",
        {
          y: fromBelow,
          opacity: 0,
          stagger: 0.2,
          ease: "power3.out",
          duration: 1.1,
        },
        "<0.15",
      )

      .from(
        ".image-corner",
        {
          y: fromBelow,
          opacity: 0,
          stagger: 0.12,
          ease: "power3.out",
          duration: 0.9,
        },
        "<0.3",
      )

      .fromTo(
        ".soul-photo-card",
        { y: fromBelow },
        {
          y: 0,
          ease: "power3.out",
          duration: 1.3,
        },
        "<0.15",
      )

      .from(
        ".soul-tag-bottom",
        {
          y: fromBelow,
          opacity: 0,
          ease: "power3.out",
          duration: 1,
        },
        ">0.2",
      );
  }, sectionRef.value);
});

onBeforeUnmount(() => {
  ctx?.revert();
  navOnDark.value = false;

  if (panelGlowFrame) {
    cancelAnimationFrame(panelGlowFrame);
  }
});
</script>

<style scoped>
.soul-title {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-weight: 600;
  text-wrap: balance;
}

.soul-copy-grid {
  display: grid;
  gap: 2rem;
}

.soul-copy-card {
  width: 100%;
}

.soul-copy-divider {
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.22);
}

.section-philosophy {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  --dot-glow-x: 50%;
  --dot-glow-y: 50%;
  --dot-glow-opacity: 0;
  --dot-color: #000000;
  --dot-r: 1.8px;
}

.section-dots {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;
  background-size: 38px 38px;
  background-position: center;
}

.soul-dots {
  background-image: radial-gradient(
    var(--dot-color) var(--dot-r),
    transparent var(--dot-r)
  );
}

.section-dots.is-active {
  opacity: 1;
}

.section-dots--glow {
  background-image: radial-gradient(#1d1e18 2px, transparent 2px);
  opacity: 0;
  transition: opacity 220ms ease;
  -webkit-mask-image: radial-gradient(
    circle 165px at var(--dot-glow-x) var(--dot-glow-y),
    black 0%,
    rgba(0, 0, 0, 0.96) 22%,
    rgba(0, 0, 0, 0.72) 52%,
    transparent 78%
  );
  mask-image: radial-gradient(
    circle 165px at var(--dot-glow-x) var(--dot-glow-y),
    black 0%,
    rgba(0, 0, 0, 0.96) 22%,
    rgba(0, 0, 0, 0.72) 52%,
    transparent 78%
  );
}

@media (min-width: 768px) {
  .section-dots {
    background-size: 44px 44px;
  }
  .section-dots--glow {
    -webkit-mask-image: radial-gradient(
      circle 190px at var(--dot-glow-x) var(--dot-glow-y),
      black 0%,
      rgba(0, 0, 0, 0.96) 24%,
      rgba(0, 0, 0, 0.72) 54%,
      transparent 80%
    );
    mask-image: radial-gradient(
      circle 190px at var(--dot-glow-x) var(--dot-glow-y),
      black 0%,
      rgba(0, 0, 0, 0.96) 24%,
      rgba(0, 0, 0, 0.72) 54%,
      transparent 80%
    );
  }
}

.section-dots--glow.is-active {
  opacity: var(--dot-glow-opacity);
}

@media (pointer: coarse) {
  .section-dots--glow {
    display: none;
  }
}

.reflection-photo-shell {
  container-type: inline-size;
}

.reflection-photo-media {
  height: 21.875rem;
  overflow: hidden;
}

@font-face {
  font-family: "HelveticaforTarget";
  src: url("~/assets/fonts/HelveticaforTarget.woff") format("woff");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "HelveticaforTarget";
  src: url("~/assets/fonts/HelveticaforTarget-Bold.woff") format("woff");
  font-weight: 700;
  font-style: normal;
}

.reflection-panel {
  --dot-glow-x: 50%;
  --dot-glow-y: 50%;
  --dot-glow-opacity: 0;
}

@media (min-width: 768px) {
  .soul-copy-grid {
    grid-template-columns: minmax(0, 1fr) 2px minmax(0, 1fr);
    align-items: stretch;
    column-gap: 0;
    row-gap: 0;
  }

  .soul-copy-card {
    width: calc(100% - 80px);
  }

  .soul-copy-card--left {
    justify-self: start;
    margin-right: 0;
  }

  .soul-copy-card--right {
    justify-self: start;
    margin-left: 0;
    transform: translateX(-20px);
  }

  .soul-copy-divider {
    width: 2px;
    height: 100%;
    justify-self: stretch;
    transform: translateX(-40px);
  }
}

.watermark-text {
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, 0.4);
  paint-order: stroke fill;
  font-family:
    "HelveticaforTarget", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.watermark-text--soul {
  display: inline-block;
  transform: translateX(100%) rotate(90deg);
  transform-origin: top left;
}

.watermark-leading {
  display: inline-block;
  margin-right: 0.05em;
}
</style>
