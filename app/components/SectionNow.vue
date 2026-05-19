<template>
  <section
    id="now"
    class="relative min-h-screen overflow-hidden bg-[#F6F1E7] font-sans text-[#1D1E18]"
  >
    <div
      class="future-watermark absolute -bottom-[3.125rem] -left-6 z-0 select-none pointer-events-none leading-none text-[calc(min(30vw,30vh)+6.875rem)] md:left-0"
    >
      未来
    </div>

    <div class="relative z-10 mx-auto grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div
        class="flex flex-col gap-6 pt-10 lg:col-span-4 lg:min-h-screen lg:justify-end lg:pb-[15vh]"
      >
        <div
          v-for="(entry, index) in futureEntries"
          :key="index"
          class="future-entry relative pb-3"
          :style="{
            '--future-solid-width': `${futureLineWidths[index % futureLineWidths.length]}%`,
          }"
        >
          <div
            class="mb-1 font-mono text-xs font-bold tracking-widest text-[#1D1E18]/80 md:text-sm"
          >
            [IDX-0{{ index + 1 }}]
          </div>
          <h4
            class="mb-1.5 text-[16px] font-bold tracking-wide text-[#111] md:text-[18px]"
          >
            {{ entry.title }}
          </h4>
          <p
            class="text-[13px] font-medium leading-relaxed text-[#1D1E18]/70 md:text-sm"
          >
            {{ entry.content }}
          </p>
        </div>
      </div>

      <div
        class="relative hidden min-h-[700px] justify-center overflow-hidden lg:col-span-2 lg:flex lg:min-h-screen"
      >
        <div
          class="relative ml-12 translate-x-[calc(2.5rem+35px)] h-full min-h-full w-[20px]"
        >
          <div class="absolute right-[calc(100%+0.375rem)] top-32">
            <div
              class="vertical-text whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.2em] text-[#1D1E18]/50"
            >
              <span class="translate-y-[5rem]">聪明一点点</span>
              <span>争取比昨天的自己</span>
            </div>
            <span
              aria-hidden="true"
              class="absolute bottom-0 left-0 text-[1rem] leading-none text-[#1D1E18]/50 [transform:translateX(-0.875rem)_translateY(6rem)_scaleY(-1)]"
            >
              「
            </span>
          </div>

          <div
            ref="scaleViewportRef"
            class="scale-bar-stack h-full min-h-full w-[20px]"
            aria-hidden="true"
            @pointerdown="handleScalePointerDown"
            @wheel.prevent="handleTimelineWheel"
          >
            <div ref="scaleTrackRef" class="scale-bar-track">
              <div ref="scaleCycleRef" class="scale-bar-cycle">
                <span
                  v-for="tick in scaleTicks"
                  :key="`scale-a-${tick.index}`"
                  class="scale-tick"
                  :class="[
                    tick.kind === 'major' && 'scale-tick--major',
                    tick.kind === 'middle' && 'scale-tick--middle',
                  ]"
                ></span>
              </div>
              <div class="scale-bar-cycle" aria-hidden="true">
                <span
                  v-for="tick in scaleTicks"
                  :key="`scale-b-${tick.index}`"
                  class="scale-tick"
                  :class="[
                    tick.kind === 'major' && 'scale-tick--major',
                    tick.kind === 'middle' && 'scale-tick--middle',
                  ]"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col pt-8 lg:col-span-6 lg:pt-16 lg:pl-6">
        <div class="stacked-board relative w-full">
          <div class="now-log-stack relative z-10">
            <div class="now-log-card now-log-card--1"></div>
            <div class="now-log-card now-log-card--2"></div>
            <div class="now-log-card now-log-card--3"></div>
            <div
              class="now-log-card now-log-card--4"
              @pointerdown="handleScalePointerDown"
              @wheel.prevent="handleTimelineWheel"
            >
              <div ref="logViewportRef" class="now-log-viewport">
                <div ref="logSheetRef" class="now-log-sheet">
                  <article
                    v-for="(log, index) in logs"
                    :key="`${log.date}-${index}`"
                    class="now-log-entry"
                  >
                    <p class="now-log-entry__date">{{ log.date }}</p>
                    <p class="now-log-entry__content">{{ log.content }}</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="relative z-20 mt-8 -translate-y-[20px] flex justify-end">
          <button
            class="group flex cursor-pointer items-center border-[2.5px] border-[#1D1E18] bg-[#F6F1E7] shadow-sm transition-colors duration-200 hover:bg-[#1D1E18] hover:text-[#F6F1E7]"
          >
            <span
              class="border-r-[2.5px] border-[#1D1E18] px-[0.5625rem] py-[0.6875rem] font-mono text-[1.125rem] font-bold leading-none group-hover:border-[#F6F1E7]"
              >↗</span
            >
            <span
              class="px-[0.875rem] py-[0.6875rem] font-mono text-xs font-bold uppercase tracking-widest md:text-sm"
            >
              View All Archive
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";

type FutureEntry = {
  title: string;
  content: string;
};

type LogEntry = {
  date: string;
  content: string;
};

const futureEntries: FutureEntry[] = [
  {
    title: "把个人网站继续打磨完整",
    content: "把页面细节、节奏和内容慢慢收拢到更舒服的状态。",
  },
  {
    title: "补上后端基础能力",
    content: "把接口、鉴权、部署这些能力一点点补起来。",
  },
  {
    title: "提高英文阅读速度",
    content: "能更顺手地看文档、看博客，也能少一点停顿。",
  },
  {
    title: "做稳定的输出记录",
    content: "把学到的东西和每天的进展留下来，不再只停在脑子里。",
  },
  {
    title: "保持节奏，不急着证明什么",
    content: "先把眼前的事做好，再慢慢把路走宽。",
  },
];

const futureLineWidths = [60, 30];

const logs: LogEntry[] = [
  {
    date: "04 / 02",
    content:
      "在改个人网站的排版，把 Inspiration 和 Now 这两块重新搭得更顺一点。",
  },
  {
    date: "04 / 01",
    content:
      "看了一些 Nuxt 和服务端接口的写法，也顺手接了 Last.fm 的最近播放。",
  },
  {
    date: "03 / 31",
    content: "把最近想做的方向重新整理了一遍，尽量只留下真正会去做的事情。",
  },
  {
    date: "03 / 30",
    content: "花时间看了点后端知识，也在想怎么把学习过程写得更真诚一点。",
  },
  {
    date: "03 / 29",
    content:
      "把页面细节重新看了一遍，想让每个区块都更安静一点，也更像现在真正的状态。",
  },
  {
    date: "03 / 28",
    content:
      "晚上读了一些英文技术文章，速度还是慢，但比之前更愿意沉下心把它们看完。",
  },
  {
    date: "03 / 27",
    content: "把一些页面动效重新拆开想了一遍，先保证结构清楚，再慢慢补细节。",
  },
  {
    date: "03 / 26",
    content:
      "整理了最近写过的组件，发现很多问题不是技术难，而是节奏没有提前想好。",
  },
  {
    date: "03 / 25",
    content: "试着把每天做过的事情记下来，哪怕只是一点点，也比完全忘掉要好。",
  },
  {
    date: "03 / 24",
    content:
      "继续调整个人网站的视觉关系，让内容、留白和交互都更接近自己想要的状态。",
  },
  {
    date: "03 / 23",
    content: "看了一些前端动画案例，重点不是炫，而是让页面的移动逻辑更自然。",
  },
  {
    date: "03 / 22",
    content: "把项目目录重新过了一遍，准备把后面要补的模块按优先级排出来。",
  },
];

const scaleTicksPerLog = 16;
const scaleExtraLogSlots = 8;
const scaleTickCount = (logs.length + scaleExtraLogSlots) * scaleTicksPerLog;

const scaleTicks = Array.from({ length: scaleTickCount }, (_, index) => ({
  index,
  kind: index % 8 === 0 ? "major" : index % 4 === 0 ? "middle" : "minor",
}));

const scaleViewportRef = ref<HTMLElement | null>(null);
const scaleTrackRef = ref<HTMLElement | null>(null);
const scaleCycleRef = ref<HTMLElement | null>(null);
const logViewportRef = ref<HTMLElement | null>(null);
const logSheetRef = ref<HTMLElement | null>(null);
const timelineOffsetY = ref(0);
const scaleOffsetY = ref(0);
const scalePhaseOffsetY = ref(0);
const scaleCycleHeight = ref(0);
const timelineMinOffsetY = ref(0);
const timelineMaxOffsetY = ref(0);
const isScaleDragging = ref(false);
let scaleDragStartY = 0;
let timelineDragStartOffset = 0;
let scaleResizeObserver: ResizeObserver | null = null;
let timelineResizeObserver: ResizeObserver | null = null;
let logSheetQuickY: gsap.QuickToFunc | null = null;
let scaleTrackQuickY: gsap.QuickToFunc | null = null;
let updateLogEntryReveal: (() => void) | null = null;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const createLogEntryRevealUpdater = () => {
  return () => {
    if (!logViewportRef.value || !logSheetRef.value) {
      return;
    }

    const viewportRect = logViewportRef.value.getBoundingClientRect();
    const entries =
      logSheetRef.value.querySelectorAll<HTMLElement>(".now-log-entry");
    const fadeDistance = 92;
    const lastIndex = entries.length - 1;

    const distFromTopBoundary = timelineMaxOffsetY.value - timelineOffsetY.value;
    const distFromBottomBoundary = timelineOffsetY.value - timelineMinOffsetY.value;

    entries.forEach((entry, index) => {
      const entryRect = entry.getBoundingClientRect();
      const entryCenterY = entryRect.top + entryRect.height / 2;
      const distanceToVisibleArea = Math.min(
        entryCenterY - viewportRect.top,
        viewportRect.bottom - entryCenterY,
      );

      const naturalReveal = clamp01(distanceToVisibleArea / fadeDistance);
      const topBoundaryReveal = index === 0
        ? clamp01(1 - distFromTopBoundary / fadeDistance)
        : 0;
      const bottomBoundaryReveal = index === lastIndex
        ? clamp01(1 - distFromBottomBoundary / fadeDistance)
        : 0;
      const revealProgress = Math.max(naturalReveal, topBoundaryReveal, bottomBoundaryReveal);

      gsap.set(entry, {
        autoAlpha: revealProgress,
        scale: 0.965 + revealProgress * 0.035,
        overwrite: "auto",
      });
    });
  };
};

const renderTimeline = (immediate = false) => {
  if (immediate) {
    if (logSheetRef.value) {
      gsap.set(logSheetRef.value, { y: timelineOffsetY.value });
    }

    if (scaleTrackRef.value) {
      gsap.set(scaleTrackRef.value, { y: scaleOffsetY.value });
    }

    return;
  }

  logSheetQuickY?.(timelineOffsetY.value);
  scaleTrackQuickY?.(scaleOffsetY.value);
};

const normalizeScaleOffset = (value: number, previous = scaleOffsetY.value) => {
  const cycleHeight = scaleCycleHeight.value;

  if (!cycleHeight) {
    return value;
  }

  let normalized = value;

  while (normalized - previous > cycleHeight / 2) {
    normalized -= cycleHeight;
  }

  while (normalized - previous < -cycleHeight / 2) {
    normalized += cycleHeight;
  }

  return normalized;
};

const clampTimelineOffset = (value: number) => {
  return Math.min(
    timelineMaxOffsetY.value,
    Math.max(timelineMinOffsetY.value, value),
  );
};

const syncScaleOffset = () => {
  const prev = scaleOffsetY.value;
  scaleOffsetY.value = normalizeScaleOffset(
    timelineOffsetY.value + scalePhaseOffsetY.value,
    prev,
  );
  const wrapped =
    scaleCycleHeight.value > 0 &&
    Math.abs(scaleOffsetY.value - prev) > scaleCycleHeight.value / 2;

  logSheetQuickY?.(timelineOffsetY.value);
  if (wrapped) {
    if (scaleTrackRef.value) {
      gsap.killTweensOf(scaleTrackRef.value);
      gsap.set(scaleTrackRef.value, { y: scaleOffsetY.value });
      scaleTrackQuickY = gsap.quickTo(scaleTrackRef.value, "y", {
        duration: 0.42,
        ease: "power4.out",
      });
    }
  } else {
    scaleTrackQuickY?.(scaleOffsetY.value);
  }
  updateLogEntryReveal?.();
};

const calibrateScalePhase = () => {
  renderTimeline(true);
  const firstLogEntry =
    logSheetRef.value?.querySelector<HTMLElement>(".now-log-entry");
  const majorTicks = scaleViewportRef.value
    ? Array.from(
        scaleViewportRef.value.querySelectorAll<HTMLElement>(
          ".scale-tick--major",
        ),
      )
    : [];

  if (!firstLogEntry || !majorTicks.length) {
    return;
  }

  const logRect = firstLogEntry.getBoundingClientRect();
  const logCenterY = logRect.top + logRect.height / 2;
  const closestMajorTick = majorTicks.reduce((closest, tick) => {
    const closestRect = closest.getBoundingClientRect();
    const tickRect = tick.getBoundingClientRect();
    const closestDistance = Math.abs(
      logCenterY - (closestRect.top + closestRect.height / 2),
    );
    const tickDistance = Math.abs(
      logCenterY - (tickRect.top + tickRect.height / 2),
    );

    return tickDistance < closestDistance ? tick : closest;
  });
  const tickRect = closestMajorTick.getBoundingClientRect();
  const tickCenterY = tickRect.top + tickRect.height / 2;

  scalePhaseOffsetY.value += logCenterY - tickCenterY;
  syncScaleOffset();
  renderTimeline(true);
};

const measureScaleCycle = () => {
  if (!scaleCycleRef.value) {
    return;
  }

  scaleCycleHeight.value = scaleCycleRef.value.offsetHeight;
  syncScaleOffset();
};

const measureTimelineBounds = () => {
  if (!logViewportRef.value || !logSheetRef.value) {
    return;
  }

  const overflowY = Math.max(
    0,
    logSheetRef.value.scrollHeight - logViewportRef.value.clientHeight,
  );
  timelineMinOffsetY.value = -overflowY;
  timelineMaxOffsetY.value = 0;
  timelineOffsetY.value = clampTimelineOffset(timelineOffsetY.value);
  syncScaleOffset();
  renderTimeline(true);
};

const handleScalePointerMove = (event: PointerEvent) => {
  if (!isScaleDragging.value) {
    return;
  }

  timelineOffsetY.value = clampTimelineOffset(
    timelineDragStartOffset + event.clientY - scaleDragStartY,
  );
  syncScaleOffset();
};

const handleTimelineWheel = (event: WheelEvent) => {
  timelineOffsetY.value = clampTimelineOffset(
    timelineOffsetY.value - event.deltaY,
  );
  syncScaleOffset();
};

const handleScalePointerUp = () => {
  isScaleDragging.value = false;
};

const handleScalePointerDown = (event: PointerEvent) => {
  isScaleDragging.value = true;
  scaleDragStartY = event.clientY;
  timelineDragStartOffset = timelineOffsetY.value;
  (event.currentTarget as HTMLElement | null)?.setPointerCapture(
    event.pointerId,
  );
};

onMounted(async () => {
  await nextTick();
  if (logSheetRef.value) {
    logSheetQuickY = gsap.quickTo(logSheetRef.value, "y", {
      duration: 0.42,
      ease: "power4.out",
    });
  }

  if (scaleTrackRef.value) {
    scaleTrackQuickY = gsap.quickTo(scaleTrackRef.value, "y", {
      duration: 0.42,
      ease: "power4.out",
    });
  }

  updateLogEntryReveal = createLogEntryRevealUpdater();
  gsap.ticker.add(updateLogEntryReveal);
  renderTimeline(true);
  updateLogEntryReveal();
  measureScaleCycle();
  measureTimelineBounds();
  calibrateScalePhase();

  if (scaleCycleRef.value) {
    scaleResizeObserver = new ResizeObserver(() => {
      measureScaleCycle();
      calibrateScalePhase();
    });
    scaleResizeObserver.observe(scaleCycleRef.value);
  }

  if (logViewportRef.value && logSheetRef.value) {
    timelineResizeObserver = new ResizeObserver(() => {
      measureTimelineBounds();
      calibrateScalePhase();
    });
    timelineResizeObserver.observe(logViewportRef.value);
    timelineResizeObserver.observe(logSheetRef.value);
  }

  window.addEventListener("pointermove", handleScalePointerMove);
  window.addEventListener("pointerup", handleScalePointerUp);
  window.addEventListener("pointercancel", handleScalePointerUp);
});

onUnmounted(() => {
  scaleResizeObserver?.disconnect();
  timelineResizeObserver?.disconnect();
  if (updateLogEntryReveal) {
    gsap.ticker.remove(updateLogEntryReveal);
  }
  gsap.killTweensOf([logSheetRef.value, scaleTrackRef.value]);
  window.removeEventListener("pointermove", handleScalePointerMove);
  window.removeEventListener("pointerup", handleScalePointerUp);
  window.removeEventListener("pointercancel", handleScalePointerUp);
});
</script>

<style scoped>
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.vertical-text span {
  display: block;
}

.scale-bar-stack {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 24px;
  transform: translateX(-50%);
  cursor: grab;
  overflow-x: visible;
  overflow-y: hidden;
  touch-action: none;
  user-select: none;
}

.scale-bar-stack:active {
  cursor: grabbing;
}

.scale-bar-track {
  position: absolute;
  inset-inline: 0;
  top: 0;
  will-change: transform;
}

.scale-bar-cycle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4.625px;
  padding-block: 3px;
}

.scale-tick {
  display: block;
  width: 10px;
  height: 2px;
  flex: 0 0 auto;
  border-radius: 999px;
  background-color: rgba(29, 30, 24, 0.54);
}

.scale-tick--middle {
  width: 14px;
  background-color: rgba(29, 30, 24, 0.64);
}

.scale-tick--major {
  width: 20px;
  height: 2px;
  background-color: rgba(29, 30, 24, 0.86);
}

.future-watermark {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
  font-weight: 700;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(29, 30, 24, 0.1);
}

.now-log-stack {
  min-height: 51.625rem;
}

.now-log-card {
  position: absolute;
  width: 33.75rem;
  height: 42.5rem;
  border: 1.5px solid rgba(29, 30, 24, 0.68);
  background: linear-gradient(
    180deg,
    rgba(238, 229, 217, 0.62),
    rgba(219, 208, 194, 0.5)
  );
  box-shadow:
    0 18px 30px rgba(29, 30, 24, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);
  -webkit-backdrop-filter: blur(18px) saturate(125%);
  backdrop-filter: blur(18px) saturate(125%);
  opacity: var(--now-card-opacity, 1);
}

.now-log-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid rgba(29, 30, 24, 0.14);
  transform: translate(7px, 7px);
  z-index: -1;
}

.now-log-card--1 {
  top: 3.125rem;
  right: 0;
  z-index: 1;
  --now-card-opacity: 1;
}

.now-log-card--1::before {
  transform: translate(4px, 4px);
}

.now-log-card--2 {
  top: 4.3125rem;
  right: 0.6875rem;
  z-index: 2;
  border-color: rgba(29, 30, 24, 0.1);
  --now-card-opacity: 0.72;
}

.now-log-card--2::before {
  border-color: rgba(29, 30, 24, 0.06);
}

.now-log-card--3 {
  top: 5.5rem;
  right: 1.375rem;
  z-index: 3;
  --now-card-opacity: 0.56;
}

.now-log-card--4 {
  top: 6.6875rem;
  right: 2.0625rem;
  z-index: 4;
  --now-card-opacity: 1;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.now-log-card--4:active {
  cursor: grabbing;
}

.now-log-viewport {
  --now-log-mask-bleed-left: 0px;
  --now-log-mask-bleed-right: 0px;
  position: absolute;
  top: 0;
  right: calc(var(--now-log-mask-bleed-right) * -1);
  bottom: 0;
  left: calc(var(--now-log-mask-bleed-left) * -1);
  overflow: hidden;
}

.now-log-sheet {
  display: flex;
  width: calc(
    100% - var(--now-log-mask-bleed-left) - var(--now-log-mask-bleed-right)
  );
  min-height: 100%;
  margin-left: var(--now-log-mask-bleed-left);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 26px;
  padding: 1.6rem 1.5rem;
  will-change: transform;
}

.now-log-entry {
  position: relative;
  display: flex;
  width: calc(100% + 5rem);
  height: 80px;
  flex: 0 0 80px;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  gap: 0.32rem;
  border: 2.5px solid rgba(29, 30, 24, 0.82);
  background: linear-gradient(
    180deg,
    rgba(244, 239, 231, 0.92),
    rgba(236, 230, 220, 0.9)
  );
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.38);
  padding: 0 0.85rem;
  transform-origin: center;
  will-change: opacity, transform;
}

.now-log-entry::before,
.now-log-entry::after {
  content: none;
}

.now-log-entry__date {
  font-family: "IBM Plex Mono", "SFMono-Regular", "Consolas", monospace;
  font-size: 1.3125rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.08em;
  color: rgba(17, 17, 17, 0.92);
}

.now-log-entry__content {
  font-size: 1.0325rem;
  font-weight: 600;
  line-height: 1.2;
  color: rgba(17, 17, 17, 0.9);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media (max-width: 1023px) {
  .now-log-stack {
    min-height: 34.5rem;
  }

  .now-log-card {
    width: min(100%, 16.25rem);
    height: 30.25rem;
  }

  .now-log-card--1 {
    right: 0;
  }

  .now-log-card--2 {
    top: 0.9rem;
    right: 0.5rem;
  }

  .now-log-card--3 {
    top: 1.8rem;
    right: 1rem;
  }

  .now-log-card--4 {
    top: 2.7rem;
    right: 1.5rem;
  }

  .now-log-sheet {
    gap: 0.65rem;
    padding: 1rem 0.9rem;
  }

  .now-log-entry {
    height: 2.8rem;
    flex-basis: 2.8rem;
    gap: 0.22rem;
    padding: 0 0.55rem;
  }

  .now-log-entry__date {
    font-size: 1.2125rem;
  }

  .now-log-entry__content {
    font-size: 0.9625rem;
    line-height: 1.15;
  }
}

@media (min-width: 1024px) {
  .now-log-viewport {
    --now-log-mask-bleed-left: 15.75rem;
    --now-log-mask-bleed-right: 3rem;
  }

  .now-log-entry {
    --now-connector-gap: 0.55rem;
    --now-connector-width: 12rem;
    --now-connector-dot: 0.68rem;
  }

  .now-log-entry::before,
  .now-log-entry::after {
    content: "";
    position: absolute;
    top: 50%;
    pointer-events: none;
  }

  .now-log-entry::before {
    left: calc((var(--now-connector-width) + var(--now-connector-gap)) * -1);
    width: var(--now-connector-width);
    height: 0.55rem;
    transform: translateY(-50%);
    background-image: radial-gradient(
      circle,
      rgba(29, 30, 24, 0.52) 1.35px,
      transparent 1.55px
    );
    background-position: calc(var(--now-connector-dot) + 0.35rem) center;
    background-size: 0.55rem 0.55rem;
    background-repeat: repeat-x;
  }

  .now-log-entry::after {
    left: calc((var(--now-connector-width) + var(--now-connector-gap)) * -1);
    width: var(--now-connector-dot);
    height: var(--now-connector-dot);
    border-radius: 999px;
    background-color: rgba(17, 17, 17, 0.95);
    box-shadow: 0 0 0 2px rgba(246, 241, 231, 0.72);
    transform: translateY(-50%);
  }
}

.future-entry::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 78%;
  border-bottom: 2.5px dotted rgba(29, 30, 24, 0.4);
}

.future-entry::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: var(--future-solid-width);
  border-bottom: 2.5px solid rgba(29, 30, 24, 0.78);
  z-index: 1;
}

.stacked-board {
  position: relative;
  background-color: transparent;
}

.stacked-board::before,
.stacked-board::after {
  content: none;
}
</style>
