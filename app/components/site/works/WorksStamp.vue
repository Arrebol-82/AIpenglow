<template>
  <div
    v-show="stampVisible"
    ref="stampRef"
    class="blueprint-stamp relative z-20 flex w-[170px] flex-col gap-1 bg-white/90 px-3 py-1 backdrop-blur-sm"
  >
    <span
      aria-hidden="true"
      data-stamp-edge="h"
      class="absolute left-[-8px] right-[-8px] top-[-0.65px] h-[1.3px] bg-[#1D1E18]/80"
    ></span>
    <span
      aria-hidden="true"
      data-stamp-edge="h"
      class="absolute bottom-[-0.65px] left-[-8px] right-[-8px] h-[1.3px] bg-[#1D1E18]/80"
    ></span>
    <span
      aria-hidden="true"
      data-stamp-edge="v"
      class="absolute bottom-[-8px] left-[-0.65px] top-[-8px] w-[1.3px] bg-[#1D1E18]/80"
    ></span>
    <span
      aria-hidden="true"
      data-stamp-edge="v"
      class="absolute bottom-[-8px] right-[-0.65px] top-[-8px] w-[1.3px] bg-[#1D1E18]/80"
    ></span>
    <div
      class="relative -mx-3 -mt-1 flex items-center justify-between gap-3 pl-3 pr-0 pb-[1.3px] pt-[1.3px] font-mono text-[9px] uppercase tracking-[0.14em] text-[#1D1E18]"
    >
      <span
        aria-hidden="true"
        class="absolute bottom-0 left-0 right-0 h-[1.3px] bg-[#1D1E18]"
      ></span>
      <span>{{ WORKS_STAMP_TIME_LABEL }}</span>
      <div
        class="relative flex h-[15px] w-[18px] cursor-pointer items-center justify-center"
        @click="handleStampClose"
      >
        <span
          aria-hidden="true"
          class="absolute -top-[1.3px] -bottom-[1.3px] left-0 w-[1.3px] bg-[#1D1E18]"
        ></span>
        <svg
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          class="mx-[3px] h-3 w-3 rotate-45 select-none"
        >
          <path
            d="M896 480H544.8V128h-65.6v352H128v66.4h351.2V896h65.6V546.4H896z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
    <div
      class="relative px-3 py-1 text-center font-bold text-[13px] md:text-sm tracking-[0.1em] text-[#1D1E18]"
    >
      <span
        class="absolute -left-[6px] -top-[4px] text-[11px] font-black leading-none text-[#1D1E18]/75"
        >+</span
      >
      <span
        class="absolute -right-[6px] -top-[4px] text-[11px] font-black leading-none text-[#1D1E18]/75"
        >+</span
      >
      <span
        class="absolute -bottom-[4px] -left-[6px] text-[11px] font-black leading-none text-[#1D1E18]/75"
        >+</span
      >
      <span
        class="absolute -bottom-[4px] -right-[6px] text-[11px] font-black leading-none text-[#1D1E18]/75"
        >+</span
      >
      <div>{{ WORKS_STAMP_CONTENT }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from "vue";
import { gsap } from "gsap";
import {
  WORKS_STAMP_TIME_LABEL,
  WORKS_STAMP_CONTENT,
} from "~/components/site/works/worksData";

const stampRef = ref<HTMLElement | null>(null);
const stampVisible = ref(true);

let stampReturnTimer: ReturnType<typeof window.setTimeout> | null = null;

const clearStampReturnTimer = () => {
  if (stampReturnTimer !== null) {
    window.clearTimeout(stampReturnTimer);
    stampReturnTimer = null;
  }
};

const animateStampIn = (stampEl: HTMLElement) => {
  gsap.killTweensOf(stampEl);
  gsap.killTweensOf(stampEl.querySelectorAll("[data-stamp-edge]"));
  gsap.killTweensOf(stampEl.querySelectorAll(":scope > div"));
  gsap.set(stampEl.querySelectorAll('[data-stamp-edge="h"]'), { scaleX: 0 });
  gsap.set(stampEl.querySelectorAll('[data-stamp-edge="v"]'), { scaleY: 0 });
  gsap.set(stampEl.querySelectorAll(":scope > div"), { opacity: 0 });

  const tl = gsap.timeline();
  tl.to(
    stampEl.querySelectorAll('[data-stamp-edge="h"]'),
    { scaleX: 1, duration: 0.45, ease: "power2.out" },
    0,
  );
  tl.to(
    stampEl.querySelectorAll('[data-stamp-edge="v"]'),
    { scaleY: 1, duration: 0.45, ease: "power2.out" },
    0,
  );
  tl.to(
    stampEl.querySelectorAll(":scope > div"),
    { opacity: 1, duration: 0.3, ease: "power2.out" },
    0.12,
  );
};

const showStampAgain = async () => {
  stampVisible.value = true;
  await nextTick();

  const stampEl = stampRef.value;
  if (stampEl) {
    animateStampIn(stampEl);
  }
};

const scheduleStampReturn = () => {
  stampReturnTimer = window.setTimeout(() => {
    stampReturnTimer = null;
    void showStampAgain();
  }, 5000);
};

const handleStampClose = () => {
  clearStampReturnTimer();

  const stampEl = stampRef.value;
  if (!stampEl) {
    stampVisible.value = false;
    scheduleStampReturn();
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      stampVisible.value = false;
      scheduleStampReturn();
    },
  });

  tl.to(
    stampEl.querySelectorAll('[data-stamp-edge="h"]'),
    { scaleX: 0, duration: 0.45, ease: "power2.in" },
    0,
  );
  tl.to(
    stampEl.querySelectorAll('[data-stamp-edge="v"]'),
    { scaleY: 0, duration: 0.45, ease: "power2.in" },
    0,
  );
  tl.to(
    stampEl.querySelectorAll(":scope > div"),
    { opacity: 0, duration: 0.3, ease: "power2.in" },
    0,
  );
};

onBeforeUnmount(() => {
  clearStampReturnTimer();
  if (stampRef.value) {
    gsap.killTweensOf(stampRef.value);
    gsap.killTweensOf(stampRef.value.querySelectorAll("[data-stamp-edge]"));
    gsap.killTweensOf(stampRef.value.querySelectorAll(":scope > div"));
  }
});
</script>

<style scoped>
.blueprint-stamp {
  position: absolute;
  right: calc(var(--blueprint-frame-inset) + 1.9rem);
  bottom: calc(var(--blueprint-frame-inset) + 1.85rem);
}
</style>
