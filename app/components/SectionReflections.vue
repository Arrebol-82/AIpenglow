<script setup lang="ts">
import geminiColorIcon from './Icons/gemini-color.svg'
</script>

<template>
  <section
    id="reflections"
    class="section-divider grid grid-cols-1 items-start gap-y-10 md:grid-cols-12 md:gap-x-12"
  >
    <h2 class="section-title reflections-heading mx-auto w-full max-w-none text-center font-chinese md:col-span-12">
      我是一名前端，正在学习后端的工程师
    </h2>

    <div class="mt-[40px] md:col-span-12">
      <div class="mx-[60px] grid grid-cols-1 items-start gap-y-10 md:grid-cols-12 md:gap-x-12">
        <div class="md:col-span-5">
          <div class="max-w-xl font-chinese text-lg leading-8 text-on-surface-variant/80">
            我是一个前端工程师，目前正在学习后端的知识，往全栈方向发展。并且经常折腾各种乱七八糟的东西。
            最近在研究 AI 相关的内容，也在尝试使用 AI 来辅助我的开发。
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <div
              class="inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-background/75 px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:javascript" />
              <span>JavaScript</span>
            </div>

            <div
              class="inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-background/75 px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:vue" />
              <span>Vue</span>
            </div>

            <div
              class="inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-background/75 px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:nuxt-icon" />
              <span>Nuxt</span>
            </div>

            <div
              class="inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-background/75 px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:typescript-icon" />
              <span>TypeScript</span>
            </div>

            <div
              class="inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-background/75 px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:vitejs" />
              <span>Vite</span>
            </div>

            <div
              class="inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-background/75 px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:openai-icon" />
              <span>GPT</span>
            </div>

            <div
              class="inline-flex items-center gap-2 rounded-[999px] border border-outline/45 bg-background/75 px-[18px] py-[8px] text-sm font-medium text-on-background shadow-[0_8px_24px_rgb(47_58_74_/_0.05)] backdrop-blur-sm"
            >
              <img :src="geminiColorIcon" alt="" class="h-4 w-4 flex-none" />
              <span>Gemini</span>
            </div>
          </div>
        </div>

        <div class="md:col-span-6 md:col-start-7">
          <div class="surface-card surface-card--compact group relative min-h-[130px] font-chinese">
            <span
              class="material-symbols-outlined pointer-events-none absolute right-6 top-4 text-sm text-on-background/58 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
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
              <p class="text-xl leading-8 text-on-background/88 ">
                这里是我的 GitHub 主页，点击这里可以跳到我的 GitHub 页面，查看我正在做的项目、代码练习，以及最近在折腾的内容。
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
