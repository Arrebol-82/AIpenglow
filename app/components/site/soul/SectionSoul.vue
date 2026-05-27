<template>
  <section
    ref="sectionRef"
    class="section-philosophy bg-[#f6f1e7] text-white pt-24 px-6 md:px-12 lg:px-24 min-h-screen relative z-30 overflow-hidden font-sans"
  >
    <canvas
      ref="starCanvas"
      class="absolute inset-0 w-full h-full pointer-events-none"
      style="z-index: 2; opacity: 0"
      aria-hidden="true"
    ></canvas>

    <div
      class="soul-black-overlay absolute inset-0 bg-black pointer-events-none"
      style="z-index: 1"
    ></div>

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
import { SCROLL_START, SCROLL_END } from "./soulConstants";

interface Star {
  distance: number;
  angle: number;
  speed: number;
  size: number;
  phase: number;
  twinkleSpeed: number;
  baseAlpha: number;
  variance: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  thickness: number;
  life: number;
  maxLife: number;
}

const sectionRef = ref<HTMLElement | null>(null);
const imageCardRef = ref<HTMLElement | null>(null);
const starCanvas = ref<HTMLCanvasElement | null>(null);

const navOnDark = useState<boolean>("navbar-on-dark", () => false);

let ctx: gsap.Context | null = null;
let cleanupCanvas: (() => void) | null = null;

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const initParticleSystem = (): (() => void) | null => {
  const canvas = starCanvas.value;
  if (!canvas) return null;

  const ctx2d = canvas.getContext("2d");
  if (!ctx2d) return null;

  const section = sectionRef.value;
  if (!section) return null;

  let width = section.offsetWidth;
  let height = section.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  let particles: Star[] = [];
  let meteors: Meteor[] = [];
  let animationFrameId: number | null = null;
  let nextMeteorTime: number = Date.now() + Math.random() * 3000;

  const pivotX = () => width;
  const pivotY = () => height;

  const initStars = () => {
    particles = [];
    meteors = [];
    const maxDistance = Math.sqrt(width * width + height * height) * 1.1;
    const circleArea = Math.PI * maxDistance * maxDistance;
    const particleCount = Math.floor(circleArea / 22000);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        distance: Math.sqrt(Math.random()) * maxDistance,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0001 + 0.0001,
        size: Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        baseAlpha: Math.random() * 0.4 + 0.5,
        variance: Math.random() * 0.2 + 0.2,
      });
    }
  };

  const spawnMeteor = () => {
    const baseSpeed = Math.random() * 3 + 4;
    meteors.push({
      x: Math.random() * width * 1.5,
      y: -50,
      vx: -baseSpeed * 1.0,
      vy: baseSpeed * 1.5,
      length: Math.random() * 400 + 350,
      thickness: Math.random() * 1.2 + 1.2,
      life: 0,
      maxLife: 140 + Math.random() * 60,
    });
  };

  const draw = () => {
    if (!ctx2d) return;
    ctx2d.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p) continue;

      p.phase += p.twinkleSpeed;
      p.angle += p.speed;
      const currentAlpha = Math.max(
        0.15,
        Math.min(1, p.baseAlpha + Math.sin(p.phase) * p.variance),
      );
      const x = pivotX() + Math.cos(p.angle) * p.distance;
      const y = pivotY() + Math.sin(p.angle) * p.distance;

      if (x > -10 && x < width + 10 && y > -10 && y < height + 10) {
        ctx2d.beginPath();
        ctx2d.arc(Math.round(x), Math.round(y), p.size, 0, Math.PI * 2);
        ctx2d.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx2d.fill();
      }
    }

    const now = Date.now();
    if (now > nextMeteorTime) {
      const count = Math.random() < 0.15 ? 2 : 1;
      for (let k = 0; k < count; k++) spawnMeteor();
      nextMeteorTime = now + (Math.random() * 5000 + 1000);
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      if (!m) continue;

      m.x += m.vx;
      m.y += m.vy;
      m.life++;

      const opacity = Math.max(0, 1 - m.life / m.maxLife);

      if (
        m.life >= m.maxLife ||
        opacity <= 0 ||
        m.x < -400 ||
        m.y > height + 400
      ) {
        meteors.splice(i, 1);
        continue;
      }

      const speedScale = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
      const tailX = m.x - (m.vx / speedScale) * m.length;
      const tailY = m.y - (m.vy / speedScale) * m.length;

      const gradient = ctx2d.createLinearGradient(m.x, m.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.7})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx2d.beginPath();
      ctx2d.moveTo(m.x, m.y);
      ctx2d.lineTo(tailX, tailY);
      ctx2d.strokeStyle = gradient;
      ctx2d.lineWidth = m.thickness;
      ctx2d.lineCap = "round";
      ctx2d.stroke();

      ctx2d.beginPath();
      ctx2d.arc(m.x, m.y, m.thickness * 1.5, 0, Math.PI * 2);
      ctx2d.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx2d.fill();
    }
    animationFrameId = requestAnimationFrame(draw);
  };

  initStars();
  draw();

  const onResize = () => {
    if (!section) return;
    width = section.offsetWidth;
    height = section.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
  };

  window.addEventListener("resize", onResize);
  return () => {
    window.removeEventListener("resize", onResize);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
};

onMounted(async () => {
  if (!sectionRef.value) return;

  if (!prefersReducedMotion()) {
    cleanupCanvas = initParticleSystem();
  }

  if (prefersReducedMotion()) return;

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

    gsap.set(starCanvas.value, { opacity: 0 });

    const soulTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: SCROLL_START,
        end: SCROLL_END,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        scrub: 1,
        refreshPriority: 20,
        onEnter: () => {
          navOnDark.value = true;
        },
        onEnterBack: () => {
          navOnDark.value = true;
        },
        onLeaveBack: () => {
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
      .to(
        starCanvas.value,
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.in",
        },
        0,
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

  if (cleanupCanvas) {
    cleanupCanvas();
    cleanupCanvas = null;
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
