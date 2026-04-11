<script setup lang="ts">
import { gsap } from 'gsap'
import { onBeforeUnmount, ref } from 'vue'
import geminiColorIcon from './Icons/gemini-color.svg'

const githubArrowRef = ref<HTMLElement | null>(null)
let githubArrowTween: gsap.core.Tween | null = null

function handleGithubCardHover(isHovering: boolean) {
  if (!githubArrowRef.value) {
    return
  }

  githubArrowTween?.kill()
  githubArrowTween = gsap.to(githubArrowRef.value, {
    x: isHovering ? 3 : 0,
    y: isHovering ? -3 : 0,
    duration: isHovering ? 0.46 : 0.32,
    ease: isHovering ? 'back.out(1.7)' : 'power2.out',
    overwrite: 'auto',
  })
}

onBeforeUnmount(() => {
  githubArrowTween?.kill()
  githubArrowTween = null
})
</script>

<template>
  <section
    id="reflections"
    class="section-divider grid grid-cols-1 items-start gap-y-10 md:grid-cols-12 md:gap-x-12"
  >
    <h2 class="section-title reflections-heading mx-auto w-full max-w-none text-center font-chinese tracking-[0.05em] opacity-90 md:col-span-12">
      我从前端出发，也在继续学习后端。
    </h2>

    <div class="mt-[40px] md:col-span-12">
      <div class="mx-[60px] grid grid-cols-1 items-start gap-y-10 md:grid-cols-12 md:gap-x-12">
        <div class="md:col-span-5">
          <div class="max-w-xl font-chinese text-lg leading-8 text-on-surface-variant/80">
            我是一名前端开发者，目前也在学习后端相关的知识，并慢慢向更完整的开发方向靠近。
除了日常学习，我也会经常折腾各种有意思的东西。最近也在关注 AI 相关的内容，并尝试让它更好地辅助我的开发。
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <div
              class="reflection-tag reflection-tag--javascript inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-white px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:javascript" />
              <span>JavaScript</span>
            </div>

            <div
              class="reflection-tag reflection-tag--vue inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-white px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:vue" />
              <span>Vue</span>
            </div>

            <div
              class="reflection-tag reflection-tag--nuxt inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-white px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:nuxt-icon" />
              <span>Nuxt</span>
            </div>

            <div
              class="reflection-tag reflection-tag--typescript inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-white px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:typescript-icon" />
              <span>TypeScript</span>
            </div>

            <div
              class="reflection-tag reflection-tag--vite inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-white px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:vitejs" />
              <span>Vite</span>
            </div>

            <div
              class="reflection-tag reflection-tag--gpt inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-white px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:openai-icon" />
              <span>GPT</span>
            </div>

            <div
              class="reflection-tag reflection-tag--gemini inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-white px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <img :src="geminiColorIcon" alt="" class="h-4 w-4 flex-none" />
              <span>Gemini</span>
            </div>
          </div>
        </div>

        <div class="md:col-span-6 md:col-start-7">
          <div
            class="surface-card surface-card--compact reflections-github-card group relative min-h-[130px] font-chinese"
            @mouseenter="handleGithubCardHover(true)"
            @mouseleave="handleGithubCardHover(false)"
          >
            <span
              ref="githubArrowRef"
              class="material-symbols-outlined reflections-github-arrow pointer-events-none absolute right-6 top-4 text-sm text-on-background/58"
            >
              arrow_outward
            </span>
            <a
              class="flex w-full items-start gap-4 pt-5"
              href="https://github.com/Arrebol-82/"
              target="_blank"
              rel="noreferrer"
            >
              <Icon class="mt-1 h-6 w-6 flex-none text-on-background/72" mode="svg" name="mdi:github" />
              <p class="reflections-github-copy text-xl text-on-background/88">
                GitHub 是我存放项目的地方。
这里放着我正在做的项目、代码练习，还有最近折腾的一些东西。
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reflection-tag {
  --tag-glow: rgb(47 58 74 / 0.25);
  transition:
    filter 280ms ease,
    box-shadow 280ms ease,
    transform 280ms ease;
}

.reflection-tag:hover {
  filter: drop-shadow(0 0 12px var(--tag-glow));
  box-shadow: 0 14px 30px rgb(47 58 74 / 0.08);
  transform: translateY(-1px);
}

.reflection-tag--javascript {
  --tag-glow: rgb(247 223 30 / 0.38);
}

.reflection-tag--vue {
  --tag-glow: rgb(65 184 131 / 0.34);
}

.reflection-tag--nuxt {
  --tag-glow: rgb(0 220 130 / 0.32);
}

.reflection-tag--typescript {
  --tag-glow: rgb(49 120 198 / 0.34);
}

.reflection-tag--vite {
  --tag-glow: rgb(139 92 246 / 0.32);
}

.reflection-tag--gpt {
  --tag-glow: rgb(16 163 127 / 0.3);
}

.reflection-tag--gemini {
  --tag-glow: rgb(83 130 255 / 0.3);
}

.reflections-github-card {
  filter: drop-shadow(0 20px 40px rgb(0 0 0 / 0.05));
}

.reflections-github-copy {
  line-height: 1.8;
  opacity: 0.6;
  transition: opacity 420ms cubic-bezier(0.4, 0, 0.2, 1);
}

.reflections-github-card:hover .reflections-github-copy {
  opacity: 1;
}

.reflections-github-arrow {
  will-change: transform, opacity;
}
</style>
