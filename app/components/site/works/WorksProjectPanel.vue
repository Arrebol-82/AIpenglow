<template>
  <div class="mx-auto flex w-full max-w-[520px] flex-col gap-8">
    <div class="blueprint-block relative mb-4">
      <div
        class="absolute -top-6 -left-12 text-[9px] font-mono text-[#1D1E18]/40 leading-tight"
      >
        X 128,<br />Y 45
      </div>
      <div
        class="absolute -bottom-2 -left-8 text-[9px] font-mono text-[#1D1E18]/40"
      >
        B-2
      </div>
      <div
        class="cad-hook-tl"
        style="border-color: #000; width: 20px; height: 20px; top: -11px"
      ></div>
      <div
        class="cad-hook-tr"
        style="border-color: #000; width: 20px; height: 20px; top: -11px"
      ></div>
      <div
        class="cad-hook-bl"
        style="border-color: #000; width: 20px; height: 20px"
      ></div>
      <div
        class="cad-hook-br"
        style="border-color: #000; width: 20px; height: 20px"
      ></div>
      <h2
        class="works-title-wordmark pl-2 text-left text-[5.375rem] md:text-[7.875rem] leading-[0.68] font-black font-sans watermark-outline tracking-tighter -mb-3 md:-mb-5"
      >
        {{ WORKS_TITLE_WATERMARK }}
      </h2>
      <h3
        class="relative z-10 text-4xl md:text-5xl font-black text-[#111] tracking-widest pl-2"
      >
        {{ WORKS_TITLE }}
      </h3>
    </div>

    <div
      class="blueprint-block relative border border-[#1D1E18]/20 bg-transparent px-[0.6875rem] py-[0.4375rem] md:px-[0.9375rem] md:py-[0.6875rem]"
    >
      <div
        class="absolute -top-4 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
      >
        X 4.1
      </div>
      <div class="cad-hook-tr"></div>
      <div
        class="font-mono text-[11px] uppercase tracking-[0.15em] mb-3 font-bold text-[#1D1E18]/70"
      >
        {{ WORKS_DESCRIPTION_LABEL }}
      </div>
      <p
        class="text-[13px] md:text-sm font-medium leading-relaxed text-[#1D1E18]/90"
      >
        {{ WORKS_DESCRIPTION }}
      </p>
    </div>

    <div
      class="blueprint-block relative border border-[#1D1E18]/20 bg-transparent px-[0.6875rem] py-[0.4375rem] md:px-[0.9375rem] md:py-[0.6875rem]"
    >
      <div
        class="absolute -top-2 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
      >
        X 8-2
      </div>
      <div
        class="absolute -bottom-2 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
      >
        X 5-2
      </div>
      <div
        class="absolute -top-2 -right-6 text-[9px] font-mono text-[#1D1E18]/40"
      >
        B-2
      </div>
      <div
        class="font-mono text-[11px] uppercase tracking-[0.15em] mb-4 font-bold text-[#1D1E18]/70"
      >
        {{ WORKS_TECH_STACK_LABEL }}
      </div>
      <div class="flex flex-wrap gap-2 md:gap-3">
        <span v-for="tech in WORKS_TECH_STACK" :key="tech" class="tech-pill">
          <span class="tech-dot"></span>{{ tech }}
        </span>
      </div>
    </div>

    <div
      class="blueprint-block relative border border-[#1D1E18]/20 bg-transparent px-[0.6875rem] py-[0.4375rem] md:px-[0.9375rem] md:py-[0.6875rem]"
    >
      <div
        class="absolute -top-2 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
      >
        X 6-3
      </div>
      <div
        class="absolute -bottom-2 -left-12 text-[9px] font-mono text-[#1D1E18]/40"
      >
        X 129
      </div>
      <div
        class="font-mono text-[11px] uppercase tracking-[0.15em] mb-2 font-bold text-[#1D1E18]/70"
      >
        {{ WORKS_ROLE_LABEL }}
      </div>
      <p class="text-[13px] md:text-sm font-bold text-[#1D1E18]">
        {{ WORKS_ROLE }}
      </p>
    </div>

    <div
      class="blueprint-block relative border border-[#1D1E18]/20 bg-transparent px-[0.6875rem] py-[0.4375rem] md:px-[0.9375rem] md:py-[0.6875rem] mb-12"
    >
      <div
        class="absolute -top-2 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
      >
        X 8-1
      </div>
      <div
        class="absolute -bottom-6 -left-10 text-[9px] font-mono text-[#1D1E18]/40"
      >
        X 4-5
      </div>
      <div
        class="absolute -top-2 -right-6 text-[9px] font-mono text-[#1D1E18]/40"
      >
        B-2
      </div>
      <div class="cad-hook-bl"></div>
      <div
        class="font-mono text-[11px] uppercase tracking-[0.15em] mb-2 font-bold text-[#1D1E18]/70"
      >
        {{ WORKS_YEAR_LABEL }}
      </div>
      <p class="text-[13px] md:text-sm font-bold text-[#1D1E18]">
        {{ WORKS_YEAR }}
      </p>
    </div>

    <WorksStamp />
  </div>
</template>

<script setup lang="ts">
import {
  WORKS_TITLE_WATERMARK,
  WORKS_TITLE,
  WORKS_DESCRIPTION_LABEL,
  WORKS_DESCRIPTION,
  WORKS_TECH_STACK_LABEL,
  WORKS_TECH_STACK,
  WORKS_ROLE_LABEL,
  WORKS_ROLE,
  WORKS_YEAR_LABEL,
  WORKS_YEAR,
} from "~/components/site/works/worksData";
import WorksStamp from "~/components/site/works/WorksStamp.vue";
</script>

<style scoped>
.watermark-outline {
  color: transparent;
  -webkit-text-stroke: 2px rgba(17, 17, 17, 0.95);
}

.works-title-wordmark {
  display: block;
  width: 100%;
  white-space: nowrap;
  letter-spacing: 0.015em;
  transform: translateY(0.3125rem) scaleX(0.72) scaleY(1);
  transform-origin: top left;
  will-change: transform;
}

@media (max-width: 767px) {
  .works-title-wordmark {
    transform: translateY(0.1875rem) scaleX(0.7) scaleY(1);
  }
}

.cad-hook-tl {
  position: absolute;
  top: -6px;
  left: -6px;
  width: 10px;
  height: 10px;
  border-top: 1px solid rgba(29, 30, 24, 0.4);
  border-left: 1px solid rgba(29, 30, 24, 0.4);
}
.cad-hook-tr {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 10px;
  height: 10px;
  border-top: 1px solid rgba(29, 30, 24, 0.4);
  border-right: 1px solid rgba(29, 30, 24, 0.4);
}
.cad-hook-bl {
  position: absolute;
  bottom: -6px;
  left: -6px;
  width: 10px;
  height: 10px;
  border-bottom: 1px solid rgba(29, 30, 24, 0.4);
  border-left: 1px solid rgba(29, 30, 24, 0.4);
}
.cad-hook-br {
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 10px;
  height: 10px;
  border-bottom: 1px solid rgba(29, 30, 24, 0.4);
  border-right: 1px solid rgba(29, 30, 24, 0.4);
}

.tech-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid rgba(29, 30, 24, 0.15);
  border-radius: 999px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(29, 30, 24, 0.85);
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.tech-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1px solid rgba(29, 30, 24, 0.5);
}
</style>
