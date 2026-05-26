<template>
  <section
    id="reflections"
    class="section-code bg-[#f6f1e7] text-[#1D1E18] pt-12 pb-24 px-6 md:px-12 lg:px-24 relative overflow-hidden font-sans"
  >
    <div class="reflection-panel isolate relative z-10 max-w-[1400px] mx-auto">
      <div class="relative z-10 pb-12 md:pb-14 lg:min-h-[36rem]">
        <!-- 巨大的透明描边水印文字：CODE (水平方向) -->
        <div
          class="watermark-text absolute -top-16 md:-top-32 right-0 opacity-80 pointer-events-none select-none tracking-[-0.03em] text-[8.625rem] md:text-[14rem] lg:text-[18rem]"
        >
          <span class="watermark-leading">C</span>ODE
        </div>

        <!-- 顶部标签栏 -->
        <div
          class="relative z-10 mb-6 flex -translate-y-12 items-center justify-between text-[10px] font-mono font-bold tracking-widest text-[#1D1E18] opacity-80 uppercase md:mb-8 md:text-xs"
        >
          <span>STACK_MODULE</span>
        </div>

        <div
          class="relative z-10 grid translate-y-[5rem] grid-cols-1 gap-y-12 items-start md:grid-cols-12 md:gap-x-12"
        >
          <!-- 大标题 -->
          <h2
            class="code-title text-[3rem] md:text-[3.75rem] leading-[1.22] text-[#111] md:col-span-12 tracking-[-0.03em]"
          >
            我从前端出发，也在继续学习后端
          </h2>

          <!-- 内容分栏 -->
          <div class="md:col-span-12 mt-0 md:mt-2">
            <div
              class="grid grid-cols-1 md:grid-cols-12 md:gap-x-12 gap-y-12 items-start"
            >
              <!-- 左侧列：说明文字与技术栈标签 -->
              <div class="md:col-span-6 lg:col-span-5">
                <p
                  class="font-medium text-[15px] md:text-[1.0625rem] leading-[1.9] text-[#1D1E18]/80 text-justify mb-8"
                >
                  我是一名前端开发者，目前也在学习后端相关的知识，并慢慢向更完整的开发方向靠近。除了日常学习，我也会经常折腾各种有意思的东西。最近也在关注
                  AI 相关的内容，并尝试让它更好地辅助我的开发。
                </p>

                <!-- 技术标签 -->
                <ul
                  ref="tagsRef"
                  class="reflection-tags"
                  aria-label="Tech stack"
                >
                  <li
                    v-for="tag in techTags"
                    :key="tag.label"
                    :class="[
                      'reflection-tag',
                      `reflection-tag--${tag.variant}`,
                    ]"
                  >
                    <Icon
                      v-if="tag.type === 'icon'"
                      class="reflection-tag-icon"
                      mode="svg"
                      :name="tag.icon"
                    />
                    <img
                      v-else
                      :src="tag.icon"
                      alt=""
                      aria-hidden="true"
                      class="reflection-tag-icon"
                    />
                    <span>{{ tag.label }}</span>
                  </li>
                </ul>
              </div>

              <!-- 右侧列：GitHub 卡片 -->
              <div
                class="md:col-span-6 lg:col-span-6 lg:col-start-7 flex items-end justify-end"
              >
                <div
                  class="github-card-wrapper w-full max-w-lg bg-white/50 border border-[#1D1E18]/10 rounded-2xl px-6 py-[14px] md:px-8 md:py-[22px] backdrop-blur-md shadow-sm relative group cursor-pointer"
                  @mouseenter="handleGithubCardHover(true)"
                  @mouseleave="handleGithubCardHover(false)"
                >
                  <span
                    ref="githubArrowRef"
                    class="material-symbols-outlined absolute right-6 top-[14px] text-xl text-[#1D1E18]/40 transition-opacity group-hover:text-[#1D1E18] md:top-[22px]"
                  >
                    arrow_outward
                  </span>

                  <a
                    class="flex w-full items-start gap-4 mt-2"
                    href="https://github.com/Arrebol-82/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon
                      class="h-8 w-8 flex-none text-[#1D1E18]/80 mt-1"
                      mode="svg"
                      name="mdi:github"
                    />
                    <p
                      class="github-copy text-[13px] md:text-sm leading-relaxed text-[#1D1E18]/70 font-medium"
                    >
                      GitHub 是我存放项目的地方。<br />
                      这里放着我正在做的项目、代码练习，还有最近折腾的一些东西。
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="absolute bottom-0 right-0 text-[10px] font-mono font-bold tracking-widest text-[#1D1E18] opacity-80 uppercase md:text-xs"
        >
          BUILD_LOG
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import geminiColorIcon from "./Icons/gemini-color.svg";

const techTags = [
  {
    label: "JavaScript",
    variant: "javascript",
    type: "icon",
    icon: "logos:javascript",
  },
  { label: "Vue", variant: "vue", type: "icon", icon: "logos:vue" },
  { label: "Nuxt", variant: "nuxt", type: "icon", icon: "logos:nuxt-icon" },
  {
    label: "TypeScript",
    variant: "typescript",
    type: "icon",
    icon: "logos:typescript-icon",
  },
  { label: "Vite", variant: "vite", type: "icon", icon: "logos:vitejs" },
  { label: "GPT", variant: "gpt", type: "icon", icon: "logos:openai-icon" },
  {
    label: "Gemini",
    variant: "gemini",
    type: "image",
    icon: geminiColorIcon,
  },
] as const;

const tagsRef = ref<HTMLElement | null>(null);
const githubArrowRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;
let githubArrowTween: gsap.core.Tween | null = null;

function handleGithubCardHover(isHovering: boolean) {
  if (!githubArrowRef.value) return;

  githubArrowTween?.kill();
  githubArrowTween = gsap.to(githubArrowRef.value, {
    x: isHovering ? 4 : 0,
    y: isHovering ? -4 : 0,
    opacity: isHovering ? 1 : 0.6,
    duration: isHovering ? 0.4 : 0.3,
    ease: isHovering ? "back.out(1.7)" : "power2.out",
    overwrite: "auto",
  });
}

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

onMounted(async () => {
  if (prefersReducedMotion()) return;

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  ctx = gsap.context(() => {
    gsap.from(".code-title", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: "#reflections", start: "top 80%", once: true },
    });

    if (tagsRef.value) {
      const tags = gsap.utils.toArray<HTMLElement>(
        ".reflection-tag",
        tagsRef.value,
      );
      gsap.from(tags, {
        scale: 0.8,
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: tagsRef.value,
          start: "top 85%",
          once: true,
        },
      });
    }

    gsap.from(".github-card-wrapper", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".github-card-wrapper",
        start: "top 90%",
        once: true,
      },
    });
  });
});

onBeforeUnmount(() => {
  ctx?.revert();
  githubArrowTween?.kill();
});
</script>

<style scoped>
.code-title {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-weight: 600;
  text-wrap: balance;
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

.watermark-leading {
  display: inline-block;
  margin-right: 0.05em;
}

.reflection-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  column-gap: 1.5rem;
  row-gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.reflection-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(29, 30, 24, 0.22);
  border-radius: 9999px;
  background: transparent;
  padding: 0.4rem 0.75rem;
  font-family:
    ui-monospace, "SFMono-Regular", Menlo, Consolas, "Liberation Mono",
    monospace;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(29, 30, 24, 0.85);
  transition:
    border-color 240ms ease,
    background-color 240ms ease,
    color 240ms ease;
}

.reflection-tag-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex: none;
}

.reflection-tag:hover {
  border-color: rgba(29, 30, 24, 0.55);
  background-color: rgba(29, 30, 24, 0.04);
  color: rgba(29, 30, 24, 1);
}

@media (min-width: 768px) {
  .reflection-tag {
    font-size: 0.75rem;
    padding: 0.45rem 0.875rem;
  }

  .reflection-tag-icon {
    width: 1rem;
    height: 1rem;
  }
}

.github-card-wrapper {
  transition:
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.4s ease,
    background-color 0.4s ease;
}

.github-card-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  background-color: rgba(255, 255, 255, 0.8);
}

.github-copy {
  transition:
    opacity 420ms cubic-bezier(0.4, 0, 0.2, 1),
    color 420ms ease;
}

.github-card-wrapper:hover .github-copy {
  opacity: 1;
  color: rgba(29, 30, 24, 0.95);
}
</style>
