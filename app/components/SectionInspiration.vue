<script setup lang="ts">
type RecentTrack = {
  name: string
  artist: string
  album: string
  image: string | null
  url: string | null
  isNowPlaying: boolean
  listenedAt: string | null
}

type LastFmState = {
  ok: boolean
  reason: string | null
  track: RecentTrack | null
}

const { data: lastfmData, refresh } = useFetch<LastFmState>('/api/lastfm', {
  key: 'lastfm-recent-track',
  server: false,
  lazy: true,
  default: () => ({
    ok: false,
    reason: null,
    track: null
  })
})

const sectionRef = ref<HTMLElement | null>(null)
const isPageVisible = ref(true)
const isSectionInView = ref(false)
const recentTrack = computed(() => lastfmData.value?.track ?? null)
const activeTrack = computed(() => recentTrack.value?.isNowPlaying ? recentTrack.value : null)
const canPoll = computed(() => isPageVisible.value && isSectionInView.value)
const pollDelay = computed(() => activeTrack.value ? 15000 : 30000)
const vinylTrackTitle = computed(() => activeTrack.value?.name || '')

let recentTrackRefreshTimer: ReturnType<typeof setTimeout> | null = null
let sectionObserver: IntersectionObserver | null = null

const clearRecentTrackRefreshTimer = () => {
  if (recentTrackRefreshTimer) {
    clearTimeout(recentTrackRefreshTimer)
    recentTrackRefreshTimer = null
  }
}

const scheduleNextRefresh = () => {
  clearRecentTrackRefreshTimer()

  if (!canPoll.value) {
    return
  }

  recentTrackRefreshTimer = setTimeout(() => {
    void refreshRecentTrack()
  }, pollDelay.value)
}

const refreshRecentTrack = async () => {
  clearRecentTrackRefreshTimer()

  if (!canPoll.value) {
    return
  }

  await refresh()
  scheduleNextRefresh()
}

const handleVisibilityChange = () => {
  isPageVisible.value = document.visibilityState === 'visible'
}

watch(canPoll, (value) => {
  if (value) {
    void refreshRecentTrack()
    return
  }

  clearRecentTrackRefreshTimer()
})

watch(pollDelay, () => {
  if (canPoll.value) {
    scheduleNextRefresh()
  }
})

onMounted(() => {
  isPageVisible.value = document.visibilityState === 'visible'

  sectionObserver = new IntersectionObserver((entries) => {
    isSectionInView.value = entries[0]?.isIntersecting ?? false
  }, {
    threshold: 0.01
  })

  if (sectionRef.value) {
    sectionObserver.observe(sectionRef.value)
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  clearRecentTrackRefreshTimer()

  if (sectionObserver && sectionRef.value) {
    sectionObserver.unobserve(sectionRef.value)
  }

  sectionObserver?.disconnect()
  sectionObserver = null

  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

const recentTrackTitle = computed(() => {
  if (activeTrack.value) {
    return activeTrack.value.name
  }

  if (lastfmData.value?.reason === 'not_configured') {
    return '最近在听的声音'
  }

  return '暂无播放'
})

const recentTrackMeta = computed(() => {
  if (lastfmData.value?.reason === 'not_configured') {
    return '等你把 Last.fm 的 user 和 API key 配好后，这里就会自动显示最新播放。'
  }

  if (lastfmData.value?.reason === 'fetch_failed') {
    return '暂时没有拉到最近播放，稍后再试。'
  }

  if (activeTrack.value) {
    return [activeTrack.value.artist, activeTrack.value.album].filter(Boolean).join(' · ')
  }

  return '现在没有正在播放的歌曲。'
})

const recentTrackStatus = computed(() => {
  if (lastfmData.value?.reason === 'not_configured' || lastfmData.value?.reason === 'fetch_failed') {
    return 'LAST.FM'
  }

  if (activeTrack.value) {
    return 'NOW PLAYING'
  }

  return 'NO PLAYBACK'
})
</script>

<template>
  <section
    id="inspiration"
    ref="sectionRef"
    class="section-divider mx-[50px] scroll-mt-32"
  >
    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
      <div class="lg:col-span-7 lg:-ml-[50px]">
        <div class="inspiration-vinyl-stage">
          <div
            :class="[
              'inspiration-vinyl-record',
              { 'inspiration-vinyl-record--spinning': Boolean(activeTrack) }
            ]"
          >
            <div class="inspiration-vinyl-sheen"></div>
            <div class="inspiration-vinyl-grooves"></div>
            <div class="inspiration-vinyl-label">
              <p
                v-if="vinylTrackTitle"
                class="inspiration-vinyl-title"
              >
                {{ vinylTrackTitle }}
              </p>
            </div>
            <span class="inspiration-vinyl-spindle"></span>
          </div>
        </div>
      </div>

      <div class="space-y-4 lg:col-span-5 lg:-ml-[20px]">
        <div class="surface-card surface-card--compact font-chinese">
          <div class="mb-3 flex items-center gap-3 text-on-background/78">
            <span class="material-symbols-outlined text-[20px] text-accent">music_note</span>
            <span class="text-sm tracking-[0.18em] text-on-background/48">NOW PLAYING</span>
          </div>
          <h3 class="text-[1.55rem] leading-tight text-on-background">
            {{ recentTrackTitle }}
          </h3>
          <p class="mt-3 text-base leading-8 text-on-background/64">
            {{ recentTrackMeta }}
          </p>
          <div class="mt-5 border-t border-outline/30 pt-4">
            <span class="text-xs uppercase tracking-[0.2em] text-on-background/42">
              {{ recentTrackStatus }}
            </span>
          </div>
        </div>

        <div class="surface-card surface-card--compact font-chinese">
          <div class="mb-3 flex items-center gap-3 text-on-background/78">
            <span class="material-symbols-outlined text-[20px] text-accent">menu_book</span>
            <span class="text-sm tracking-[0.18em] text-on-background/48">CURRENTLY READING</span>
          </div>
          <h3 class="text-[1.55rem] leading-tight text-on-background">
            穷查理宝典
          </h3>
          <p class="mt-3 text-base leading-8 text-on-background/64">
            查理·芒格的智慧箴言录，最近在慢慢读，也顺手记下一些真正打动自己的句子。
          </p>
        </div>

        <div class="surface-card surface-card--compact film-card font-chinese">
          <div class="mb-2 flex items-center gap-2.5 text-on-background/60">
            <span class="material-symbols-outlined text-[17px] text-on-background/38">theaters</span>
            <span class="text-[10px] tracking-[0.18em] text-on-background/34">RECENT FILM</span>
          </div>
          <h3 class="text-[12px] font-medium tracking-[0.14em] text-on-background/34">
            最近看过的电影
          </h3>
          <div class="film-card-copy mt-3 space-y-2.5 text-sm leading-7 text-on-background/62">
            <p>片名：幽灵公主</p>
            <div class="flex flex-wrap gap-3 pt-1">
              <span class="rounded-full border border-outline/30 bg-background/58 px-3.5 py-1 text-[12px] leading-5 text-on-background/56">
                感受一：生きて / ikiro
              </span>
              <span class="rounded-full border border-outline/30 bg-background/58 px-3.5 py-1 text-[12px] leading-5 text-on-background/56">
                感受二：很震撼 , 忐忑
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
