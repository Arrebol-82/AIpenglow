<template>
  <!-- 容器：带有复古点阵背景 -->
  <section
    ref="sectionRef"
    class="section-philosophy bg-[#f6f1e7] text-[#1D1E18] py-24 px-6 md:px-12 lg:px-24 min-h-screen relative overflow-hidden font-sans"
    @pointermove="handlePanelPointerMove"
    @pointerleave="handlePanelPointerLeave"
  >
    <!-- 点阵直接放在 section 里：pin 期间 section 锁定在视口顶部，absolute 等价于 fixed，
         并且能自然地被后面的 .reflection-panel (z-10) 盖在上面，不会再挡住内容 -->
    <div aria-hidden="true" class="section-dots soul-dots"></div>
    <div aria-hidden="true" class="section-dots section-dots--glow"></div>

    <!-- 巨大的透明描边水印文字：SOUL (垂直方向) -->
    <div
      class="soul-watermark absolute right-0 top-[1.875rem] opacity-80 pointer-events-none select-none md:top-[2.375rem]"
    >
      <div
        class="watermark-text watermark-text--soul whitespace-nowrap tracking-[-0.03em] text-[6.5rem] md:text-[10rem] lg:text-[15rem]"
      >
        <span class="watermark-leading">S</span>OUL
      </div>
    </div>

    <!-- ================= 01. SOUL 部分 ================= -->
    <div
      class="reflection-panel isolate relative z-10 max-w-[1400px] mx-auto"
    >
      <div class="relative z-10 pb-10">
        <!-- 顶部标签栏 -->
        <div
          class="soul-tag-top mb-16 flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-[#1D1E18] opacity-80 uppercase md:mb-24 md:text-xs"
        >
          <span>PHILOSOPHY_MODULE</span>
        </div>

        <div
          class="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:min-h-[42rem] lg:gap-16 items-start"
        >
          <!-- 左侧：图片占位卡片 -->
          <div
            ref="imageCardRef"
            class="relative z-10 translate-y-[1.75rem] pt-4 md:pt-10 lg:col-span-6 lg:col-start-1"
          >
            <div
              class="reflection-photo-shell relative w-[calc(88%_+_40px)] max-w-full mx-auto lg:mx-0"
            >
              <!-- 边框小装饰 -->
              <div
                class="image-corner absolute -top-4 -left-4 w-4 h-px bg-[#1D1E18] opacity-30"
              ></div>
              <div
                class="image-corner absolute -top-4 -left-4 w-px h-4 bg-[#1D1E18] opacity-30"
              ></div>

              <div
                class="soul-photo-card bg-white p-3 shadow-md border border-[#1D1E18]/10 rounded-sm rotate-[-1deg] transition-transform hover:rotate-0 duration-500 ease-out"
              >
                <div
                  class="reflection-photo-media bg-[#EAE7DF] w-full block h-[21.875rem] text-[#1D1E18]/40 border border-[#1D1E18]/5 border-dashed"
                >
                  <img
                    src="/images/Geminit.jpg"
                    alt="Gemini"
                    class="soul-photo-img block w-full h-[21.875rem] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：文字内容 -->
          <div
            class="relative z-10 flex translate-y-[1.75rem] flex-col justify-center pt-4 md:pt-10 lg:col-span-6 lg:col-start-7"
          >
            <h2
              class="soul-title text-[3rem] md:text-[3.75rem] leading-[1.22] text-[#111] mb-12 tracking-[-0.03em]"
            >
              这个网站对我来说，不只是一个展示页
            </h2>

            <div class="soul-copy-grid mt-6 text-[13px] md:mt-8 md:text-sm">
              <article
                class="soul-paragraph soul-copy-card soul-copy-card--left text-justify leading-relaxed font-medium text-[#1D1E18]/80"
              >
                <div
                  class="mb-4 text-[10px] font-mono font-bold tracking-widest opacity-80"
                >
                  [soul-01]
                </div>
                <p>
                  它是一个真正属于我自己的空间。我想把它打造成我喜欢的样子，既有让我着迷的视觉和交互，也能慢慢装下我的想法、作品和成长的痕迹。
                </p>
              </article>
              <div aria-hidden="true" class="soul-copy-divider"></div>
              <article
                class="soul-paragraph soul-copy-card soul-copy-card--right text-justify leading-relaxed font-medium text-[#1D1E18]/80"
              >
                <div
                  class="mb-4 text-[10px] font-mono font-bold tracking-widest opacity-80"
                >
                  [soul-02]
                </div>
                <p>
                  在这个快餐式的时代里，我更想守住自己的内心，也想借这个网站，让别人更了解我，也让我更了解我自己。
                </p>
              </article>
            </div>
          </div>
        </div>
        <div
          class="soul-tag-bottom absolute inset-x-0 bottom-0 text-[10px] font-mono font-bold tracking-widest text-[#1D1E18] opacity-80 uppercase md:text-xs"
        >
          <img
            src="/images/add.svg"
            alt=""
            aria-hidden="true"
            class="pointer-events-none absolute bottom-full right-0 mb-6 mr-3 hidden w-6 select-none opacity-60 lg:block"
          />
          <span class="absolute left-0 top-1/2 -translate-y-1/2"
            >SYSTEM_IO : 8927</span
          >
          <span class="block text-center">SECTION_02 // ARCHIVE</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { gsap } from "gsap";

const sectionRef = ref<HTMLElement | null>(null);
const imageCardRef = ref<HTMLElement | null>(null);

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

  // 点阵 fixed 铺满视口，使用 clientX/Y 直接作为视口坐标
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

    document
      .querySelectorAll<HTMLElement>(".section-dots")
      .forEach((el) => {
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

  // 父组件 index.vue 在自己的 onMounted 里创建 ScrollSmoother。
  // Vue 里子组件 onMounted 早于父组件，这里等一帧让 smoother 先就位，
  // 然后再创建带 pin 的 ScrollTrigger，避免 trigger 先绑到 window、再被迁移到 smoother。
  await nextTick();

  ctx = gsap.context(() => {
    // 把 SOUL 标题拆成单字 span，方便"逐字拼合"动画
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

    // 切换点阵层可见性（已 Teleport 到 body，需直接查 document）
    const setDotsActive = (active: boolean) => {
      document
        .querySelectorAll<HTMLElement>(".section-dots")
        .forEach((el) => el.classList.toggle("is-active", active));
    };

    // 点阵已 Teleport 到 body，跳过 gsap.context 的 scope，直接拿元素
    const soulDotsEl = document.querySelector<HTMLElement>(".soul-dots");

    // SOUL 主时间线：pin 整个 section，所有元素跟随滚动依次进场
    const soulTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top top",
        end: "+=3500",
        pin: true,
        scrub: 1,
        onEnter: () => setDotsActive(true),
        onEnterBack: () => setDotsActive(true),
        // onLeave 故意不熄灭：让 dots 保留最终灰白态，直到 section 自身随滚动离开视口
        onLeaveBack: () => setDotsActive(false),
      },
    });

    // 所有 SOUL 元素统一从"页面底部"滑到各自位置
    const fromBelow = () => window.innerHeight;

    soulTl
      // 1. 背景点阵从视口正中心向四周扩散
      .fromTo(
        soulDotsEl,
        { clipPath: "circle(0vmax at 50% 50%)" },
        {
          clipPath: "circle(70vmax at 50% 50%)",
          ease: "power2.out",
          duration: 1,
        },
        0,
      )

      // 2. PHILOSOPHY_MODULE 从页面底部滑上来
      .from(
        ".soul-tag-top",
        {
          y: fromBelow,
          opacity: 0,
          ease: "power3.out",
          duration: 1.2,
        },
        ">0.1",
      )

      // 3. SOUL 水印
      .from(
        ".soul-watermark",
        {
          y: fromBelow,
          opacity: 0,
          ease: "power3.out",
          duration: 1.4,
        },
        "<0.4",
      )

      // 4. 标题逐字
      .from(
        ".soul-title-char",
        {
          y: fromBelow,
          opacity: 0,
          stagger: { each: 0.04, from: "start" },
          ease: "power3.out",
          duration: 1.1,
        },
        "<0.5",
      )

      // 5. 中间分隔线
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

      // 6. [soul-01] [soul-02]
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

      // 7. 图片左上角的两条小装饰
      .from(
        ".image-corner",
        {
          y: fromBelow,
          opacity: 0,
          stagger: 0.12,
          ease: "power3.out",
          duration: 0.9,
        },
        ">0.2",
      )

      // 8. 白色相框（图片作为子元素一起跟上来）
      //    注意：故意不加 opacity，否则父级 opacity:0 会把图片也藏起来，刷新就看不到
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

      // 9. 底部 SECTION_02 标签
      .from(
        ".soul-tag-bottom",
        {
          y: fromBelow,
          opacity: 0,
          ease: "power3.out",
          duration: 1,
        },
        ">0.2",
      )

      // 10. 点阵颜色从纯黑渐变到暖灰 —— 和上面 2~8 号 slide-up 并行
      //     position 用绝对时间 1.1（≈ soul-tag-top 起始位置），放在链尾不打乱前面所有 ">0.x" 相对引用
      //     duration 5 让颜色推进基本覆盖整段 slide-up
      //     终色 #c4b8a3：降饱和的暖灰，色相与米色底同源，只靠明度差体现存在感，
      //     既看得见点阵纹理，又不和 #1D1E18 黑色正文争夺注意力
      .fromTo(
        sectionRef.value,
        { "--dot-color": "#000000" },
        {
          "--dot-color": "#c4b8a3",
          ease: "none",
          duration: 5,
        },
        1.1,
      );
  }, sectionRef.value);
});

onBeforeUnmount(() => {
  ctx?.revert();

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
  background-color: rgba(29, 30, 24, 0.18);
}

/* --- section 级别点阵背景 --- */
.section-philosophy {
  --dot-glow-x: 50%;
  --dot-glow-y: 50%;
  --dot-glow-opacity: 0;
  /* 起始纯黑；GSAP 时间线会在滚动过程中把它推到 #d4d4d4 灰白色 */
  --dot-color: #000000;
}

.section-dots {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;
  background-image: radial-gradient(
    var(--dot-color) 1.8px,
    transparent 1.8px
  );
  background-size: 38px 38px;
  background-position: center;
}

.section-dots.is-active {
  opacity: 1;
}

.section-dots--glow {
  /* glow 层颜色固定 —— 不跟着 --dot-color 走，确保基础点阵变浅后
     鼠标聚光的"深色点"仍然清晰可见，hover 效果不丢 */
  background-image: radial-gradient(
    #1d1e18 2px,
    transparent 2px
  );
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

/* --- 图片相框 --- */
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
  -webkit-text-stroke: 2px rgba(29, 30, 24, 0.36);
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
