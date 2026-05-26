<template>
  <section
    id="inspiration"
    ref="sectionRef"
    class="relative min-h-screen overflow-hidden bg-[#F6F1E7] px-6 py-16 font-sans text-[#1D1E18] md:px-12 lg:px-20"
  >
    <div
      class="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
    >
      <div
        ref="leftColRef"
        class="relative z-10 flex justify-center lg:col-span-6 lg:justify-start"
      >
        <div
          class="relative aspect-square w-[105%] max-w-[400px] flex-shrink-0 sm:w-full md:w-[110%] md:max-w-[600px] lg:-ml-8 lg:w-[125%] lg:max-w-[750px] xl:-ml-16 xl:w-[135%] xl:max-w-[900px]"
        >
          <div
            ref="recordDiscRef"
            class="record-disc-shell absolute inset-0 m-auto h-[calc(100%-15rem)] w-[calc(100%-15rem)]"
          >
            <img
              src="/images/record.webp"
              alt="Vinyl record"
              class="block h-full w-full select-none object-contain drop-shadow-[0_28px_40px_rgba(29,30,24,0.18)]"
            />
            <div
              class="record-cover-reveal"
              :class="{ 'record-cover-reveal--active': !!activeTrack }"
            >
              <div class="record-cover-art">
                <img
                  :src="recentTrackCover"
                  :alt="`${recentTrackTitle} cover art`"
                  class="block h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <img
            src="/images/pointer.webp"
            alt="Record player tonearm"
            class="record-pointer pointer-events-none absolute right-[2%] top-[9%] w-[42%] origin-[88%_12%] select-none drop-shadow-[0_16px_24px_rgba(29,30,24,0.18)] md:w-[38%] lg:w-[34%] xl:w-[32%]"
            :style="pointerTransformStyle"
          />
        </div>
      </div>

      <div
        ref="rightColRef"
        class="relative z-0 flex w-full flex-col lg:col-span-6 lg:ml-auto lg:w-[calc(100%-3.125rem)] lg:pl-8 xl:pl-12"
      >
        <div
          class="group relative border-b border-[#1D1E18]/10 py-[1.875rem] md:py-[2.875rem]"
        >
          <div
            class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
          >
            <span
              class="watermark-outline translate-x-2 font-serif text-[6rem] font-semibold leading-none tracking-[0.08em] md:text-[8.5rem] lg:text-[10.25rem]"
            >
              MUSIC
            </span>
          </div>

          <img
            src="/images/add.svg"
            alt=""
            aria-hidden="true"
            class="pointer-events-none absolute left-0 top-0 z-0 hidden w-6 -translate-x-1/2 -translate-y-1/2 select-none opacity-60 lg:block"
          />
          <img
            src="/images/add.svg"
            alt=""
            aria-hidden="true"
            class="pointer-events-none absolute right-0 top-0 z-0 hidden w-6 translate-x-1/2 -translate-y-1/2 select-none opacity-60 lg:block"
          />

          <div class="relative z-10 flex flex-col gap-6 md:flex-row md:gap-12">
            <div
              class="flex flex-col justify-center md:min-h-[100px] md:w-5/12 md:pt-10"
            >
              <div ref="musicTitleViewportRef" class="music-title-marquee mb-2">
                <div
                  class="music-title-track"
                  :class="{
                    'music-title-track--scroll': isMusicTitleOverflowing,
                  }"
                  :style="musicTitleTrackStyle"
                >
                  <span
                    ref="musicTitleTextRef"
                    class="font-serif text-3xl font-bold tracking-wide text-[#111] md:text-4xl"
                  >
                    {{ recentTrackTitle }}
                  </span>
                  <template v-if="isMusicTitleOverflowing">
                    <span aria-hidden="true" class="music-title-gap"></span>
                    <span
                      aria-hidden="true"
                      class="font-serif text-3xl font-bold tracking-wide text-[#111] md:text-4xl"
                    >
                      {{ recentTrackTitle }}
                    </span>
                  </template>
                </div>
              </div>
              <p class="text-sm tracking-wider text-[#1D1E18]/70">
                {{ activeTrack?.artist || "未知歌手" }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-6 md:w-7/12">
              <div
                class="col-span-2 flex justify-end font-mono text-[9px] tracking-widest text-[#1D1E18]/60"
              >
                <span>{{ recentTrackPlayedAt }}</span>
              </div>

              <div
                class="col-span-2 mt-1 flex items-center justify-end gap-4 pr-3 md:pr-4"
              >
                <div
                  class="min-w-0 max-w-[11rem] text-right md:max-w-[13rem] lg:max-w-[15rem]"
                >
                  <span
                    class="block truncate font-mono text-[10px] tracking-[0.18em] text-[#1D1E18]/65"
                  >
                    {{ recentTrackAlbumText }}
                  </span>
                </div>
                <span
                  class="shrink-0 font-mono text-[11px] font-bold text-[#1D1E18]/72"
                >
                  ●
                </span>
                <div
                  class="h-[100px] w-[100px] shrink-0 overflow-hidden rounded-[1.25rem] border border-[#1D1E18]/10 bg-[#ECE5D8]"
                >
                  <img
                    :src="recentTrackCover"
                    :alt="`${recentTrackTitle} cover art`"
                    class="block h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="group relative border-b border-[#1D1E18]/10 py-[1.875rem] md:py-[2.875rem]"
        >
          <div
            class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
          >
            <span
              class="watermark-outline translate-x-4 font-serif text-[6rem] font-semibold leading-none tracking-[0.22em] md:text-[9rem] lg:text-[11rem]"
            >
              BOOK
            </span>
          </div>

          <div class="relative z-10 flex flex-col gap-6 md:flex-row md:gap-12">
            <div class="flex flex-col justify-center md:w-5/12">
              <h3
                class="font-serif text-3xl font-bold tracking-wide text-[#111] md:text-4xl"
              >
                穷查理宝典
              </h3>
            </div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-6 md:w-7/12">
              <div
                class="col-span-2 flex justify-end font-mono text-[9px] tracking-widest text-[#1D1E18]/60"
              >
                <div class="text-right">阅读时间: 10月 24日</div>
              </div>

              <div class="col-span-2">
                <h4
                  class="mb-1 text-xs font-bold tracking-widest text-[#1D1E18]/90"
                >
                  核心洞察
                </h4>
                <p
                  class="font-serif text-[13px] italic leading-relaxed text-[#1D1E18]/80"
                >
                  “反向思考，总是反向思考。”
                  一个解决问题的基本思维模型：专注于避免愚蠢而不是寻求辉煌。
                </p>
              </div>

              <div class="col-span-2 mt-2">
                <h4
                  class="mb-1 text-xs font-bold tracking-widest text-[#1D1E18]/90"
                >
                  阅读进度
                </h4>
                <div class="flex items-center gap-3">
                  <p class="font-mono text-[11px] text-[#1D1E18]/80">
                    {{ bookProgress }}% Through
                  </p>
                  <div
                    class="h-[4px] w-24 overflow-hidden rounded-full bg-[#1D1E18]/20 md:w-32"
                  >
                    <div
                      class="h-full rounded-full bg-[#1D1E18]/60"
                      :style="{ width: `${bookProgress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="group relative py-[1.875rem] md:py-[2.875rem]">
          <div
            class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
          >
            <span
              class="watermark-outline translate-x-4 font-serif text-[6rem] font-semibold leading-none tracking-[0.22em] md:text-[9rem] lg:text-[11rem]"
            >
              FILM
            </span>
          </div>

          <img
            src="/images/add.svg"
            alt=""
            aria-hidden="true"
            class="pointer-events-none absolute bottom-0 right-0 z-0 hidden w-6 translate-x-1/2 translate-y-1/2 select-none opacity-60 lg:block"
          />

          <div class="relative z-10 flex flex-col gap-6 md:flex-row md:gap-12">
            <div class="flex flex-col justify-center md:w-5/12">
              <h3
                class="font-serif text-lg font-medium tracking-[0.04em] text-[#1D1E18]/72 md:text-xl"
              >
                最近看过的电影
              </h3>
              <p
                class="mt-2 text-[17px] font-semibold text-[#111] md:text-[18px]"
              >
                片名：幽灵公主
              </p>
            </div>

            <div class="flex flex-col justify-end gap-3 pb-2 md:w-7/12">
              <div
                class="flex w-max items-center gap-3 border-b border-[#1D1E18]/20 pb-2 pr-6"
              >
                <span class="text-[13px] font-medium text-[#1D1E18]/80">
                  感受一：生きろ / ikiro
                </span>
              </div>
              <div
                class="flex w-max items-center gap-3 border-b border-[#1D1E18]/20 pb-2 pr-6"
              >
                <span class="text-[13px] font-medium text-[#1D1E18]/80">
                  感受二：很震撼，很贴近
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import { gsap } from "gsap";

type RecentTrack = {
  name: string;
  artist: string;
  album: string;
  image: string | null;
  images?: {
    small: string | null;
    medium: string | null;
    large: string | null;
    extralarge: string | null;
  };
  url: string | null;
  isNowPlaying: boolean;
  listenedAt: string | null;
};

type LastFmState = {
  ok: boolean;
  reason: string | null;
  track: RecentTrack | null;
};

const { data: lastfmData, refresh } = useFetch<LastFmState>("/api/lastfm", {
  key: "lastfm-recent-track",
  server: false,
  lazy: true,
  default: () => ({
    ok: false,
    reason: null,
    track: null,
  }),
});

const isPageVisible = ref(true);
const recentTrack = computed(() => lastfmData.value?.track ?? null);
const activeTrack = computed(() =>
  recentTrack.value?.isNowPlaying ? recentTrack.value : null,
);
const canPoll = computed(() => isPageVisible.value);
const pollDelay = computed(() => (activeTrack.value ? 15000 : 30000));
const bookProgress = 45;

let recentTrackRefreshTimer: ReturnType<typeof setTimeout> | null = null;
let musicTitleResizeObserver: ResizeObserver | null = null;
let recordSpinAnimationFrame: number | null = null;
let recordSpinLastTimestamp = 0;
let recordSpinRotation = 0;
let recordSpinVelocity = 0;
let revealCtx: gsap.Context | null = null;

const sectionRef = ref<HTMLElement | null>(null);
const leftColRef = ref<HTMLElement | null>(null);
const rightColRef = ref<HTMLElement | null>(null);
const musicTitleViewportRef = ref<HTMLElement | null>(null);
const musicTitleTextRef = ref<HTMLElement | null>(null);
const recordDiscRef = ref<HTMLElement | null>(null);
const isMusicTitleOverflowing = ref(false);
const musicTitleScrollDistance = ref(0);
const musicTitleScrollDuration = ref(12);

const clearRecentTrackRefreshTimer = () => {
  if (recentTrackRefreshTimer) {
    clearTimeout(recentTrackRefreshTimer);
    recentTrackRefreshTimer = null;
  }
};

const scheduleNextRefresh = () => {
  clearRecentTrackRefreshTimer();
  if (!canPoll.value) return;
  recentTrackRefreshTimer = setTimeout(() => {
    void refreshRecentTrack();
  }, pollDelay.value);
};

const refreshRecentTrack = async () => {
  clearRecentTrackRefreshTimer();
  if (!canPoll.value) return;
  await refresh();
  scheduleNextRefresh();
};

const handleVisibilityChange = () => {
  isPageVisible.value = document.visibilityState === "visible";
};

const updateMusicTitleOverflow = () => {
  const viewport = musicTitleViewportRef.value;
  const text = musicTitleTextRef.value;

  if (!viewport || !text) return;

  const gap = 40;
  const titleWidth = Math.ceil(text.scrollWidth);
  const viewportWidth = Math.floor(viewport.clientWidth);
  const hasOverflow = titleWidth > viewportWidth;

  isMusicTitleOverflowing.value = hasOverflow;

  if (!hasOverflow) {
    musicTitleScrollDistance.value = 0;
    musicTitleScrollDuration.value = 12;
    return;
  }

  const distance = titleWidth + gap;
  musicTitleScrollDistance.value = distance;
  musicTitleScrollDuration.value = Math.max(8, distance / 28);
};

watch(canPoll, (value) => {
  if (value) {
    void refreshRecentTrack();
    return;
  }
  clearRecentTrackRefreshTimer();
});

watch(pollDelay, () => {
  if (canPoll.value) scheduleNextRefresh();
});

const recentTrackTitle = computed(() => {
  if (activeTrack.value) return activeTrack.value.name;
  return "没有在听歌哦";
});

const recentTrackPlayedAt = computed(() => {
  const listenedAt = recentTrack.value?.listenedAt;

  if (recentTrack.value?.isNowPlaying) {
    const now = new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());

    return `播放时间: ${now}`;
  }

  if (!listenedAt) {
    return "播放时间: --:--";
  }

  const playedAt = new Date(listenedAt);

  if (Number.isNaN(playedAt.getTime())) {
    return "播放时间: --:--";
  }

  const formattedTime = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(playedAt);

  return `播放时间: ${formattedTime}`;
});

const recentTrackAlbumText = computed(() => {
  const album = recentTrack.value?.album?.trim();

  if (!album) {
    return "未知专辑";
  }

  return album;
});

const recentTrackCover = computed(() => {
  return (
    recentTrack.value?.images?.extralarge ||
    recentTrack.value?.images?.large ||
    recentTrack.value?.images?.medium ||
    recentTrack.value?.image ||
    "/images/record.webp"
  );
});

watch(recentTrackTitle, async () => {
  await nextTick();
  updateMusicTitleOverflow();
});

const musicTitleTrackStyle = computed(() => ({
  "--music-title-distance": `${musicTitleScrollDistance.value}px`,
  "--music-title-duration": `${musicTitleScrollDuration.value}s`,
}));

const pointerTransformStyle = computed(() => ({
  transform: activeTrack.value
    ? "translateX(-4rem) rotate(-1deg)"
    : "translateX(-2.8rem) translateY(-0.6rem) rotate(-15deg)",
}));

const updateRecordDiscTransform = () => {
  if (!recordDiscRef.value) return;
  recordDiscRef.value.style.transform = `translateX(-5rem) rotate(${recordSpinRotation}deg)`;
};

const stopRecordSpinLoop = () => {
  if (recordSpinAnimationFrame !== null) {
    cancelAnimationFrame(recordSpinAnimationFrame);
    recordSpinAnimationFrame = null;
  }
  recordSpinLastTimestamp = 0;
};

const stepRecordSpin = (timestamp: number) => {
  if (!recordDiscRef.value) {
    stopRecordSpinLoop();
    return;
  }

  if (!recordSpinLastTimestamp) {
    recordSpinLastTimestamp = timestamp;
  }

  const deltaSeconds = (timestamp - recordSpinLastTimestamp) / 1000;
  recordSpinLastTimestamp = timestamp;

  const targetVelocity = activeTrack.value ? 55.3846 : 0;
  const easing = activeTrack.value ? 4.2 : 2.15;
  const blend = Math.min(1, deltaSeconds * easing);

  recordSpinVelocity += (targetVelocity - recordSpinVelocity) * blend;

  if (!activeTrack.value && Math.abs(recordSpinVelocity) < 0.02) {
    recordSpinVelocity = 0;
  }

  recordSpinRotation =
    (recordSpinRotation + recordSpinVelocity * deltaSeconds) % 360;
  updateRecordDiscTransform();

  if (activeTrack.value || Math.abs(recordSpinVelocity) > 0.02) {
    recordSpinAnimationFrame = requestAnimationFrame(stepRecordSpin);
    return;
  }

  stopRecordSpinLoop();
};

const ensureRecordSpinLoop = () => {
  if (recordSpinAnimationFrame !== null) return;
  recordSpinAnimationFrame = requestAnimationFrame(stepRecordSpin);
};

watch(
  () => !!activeTrack.value,
  () => {
    ensureRecordSpinLoop();
  },
);

onMounted(() => {
  isPageVisible.value = document.visibilityState === "visible";
  document.addEventListener("visibilitychange", handleVisibilityChange);

  void nextTick(() => {
    updateMusicTitleOverflow();

    if (typeof ResizeObserver !== "undefined") {
      musicTitleResizeObserver = new ResizeObserver(() => {
        updateMusicTitleOverflow();
      });

      if (musicTitleViewportRef.value) {
        musicTitleResizeObserver.observe(musicTitleViewportRef.value);
      }

      if (musicTitleTextRef.value) {
        musicTitleResizeObserver.observe(musicTitleTextRef.value);
      }
    }

    if ("fonts" in document) {
      void document.fonts.ready.then(() => {
        updateMusicTitleOverflow();
      });
    }

    updateRecordDiscTransform();
    ensureRecordSpinLoop();
  });
});

onMounted(async () => {
  if (!import.meta.client) return;
  await nextTick();
  if (!sectionRef.value) return;
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  const prefersRM = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!isDesktop || prefersRM) return;

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  revealCtx = gsap.context(() => {
    const triggerConfig = {
      trigger: sectionRef.value,
      start: "top 85%",
      once: true,
    };
    gsap.from(leftColRef.value, {
      x: -120,
      autoAlpha: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: triggerConfig,
    });
    gsap.from(rightColRef.value, {
      x: 120,
      autoAlpha: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: triggerConfig,
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
});

onBeforeUnmount(() => {
  revealCtx?.revert();
  revealCtx = null;
  clearRecentTrackRefreshTimer();
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  musicTitleResizeObserver?.disconnect();
  musicTitleResizeObserver = null;
  stopRecordSpinLoop();
});
</script>

<style scoped>
.font-serif {
  font-family: "Cormorant Garamond", "Noto Serif SC", "Songti SC", serif;
}

.watermark-outline {
  color: transparent;
  -webkit-text-stroke: 1.35px rgba(29, 30, 24, 0.16);
  user-select: none;
}

.music-title-marquee {
  max-width: 100%;
  overflow: hidden;
}

.music-title-track {
  display: inline-flex;
  min-width: 100%;
  align-items: baseline;
  white-space: nowrap;
}

.music-title-track--scroll {
  min-width: max-content;
  animation: music-title-marquee var(--music-title-duration) linear infinite;
}

.music-title-gap {
  width: 2.5rem;
  flex: 0 0 2.5rem;
}

.record-disc-shell {
  position: absolute;
  transform-origin: center;
  transform: translateX(-5rem) rotate(0deg);
}

.record-cover-reveal {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.92);
  transition:
    opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.record-cover-reveal--active {
  opacity: 1;
  transform: scale(1);
}

.record-cover-art {
  width: 39%;
  height: 39%;
  overflow: hidden;
  border-radius: 9999px;
  border: 1.5px solid rgba(29, 30, 24, 0.18);
  box-shadow: 0 10px 20px rgba(29, 30, 24, 0.12);
}

.record-pointer {
  transition: transform 1.35s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes music-title-marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-1 * var(--music-title-distance)));
  }
}

@media (prefers-reduced-motion: reduce) {
  .music-title-track--scroll {
    animation: none;
  }
}
</style>
