<script setup lang="ts">
const currentTimeLabel = ref('--:-- GMT+8')

const footerTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Shanghai',
})

let footerTimeTimer: ReturnType<typeof setInterval> | null = null

const smoothScrollTo = useSmoothAnchor()

const handleAnchorClick = (event: MouseEvent, href: string) => {
  event.preventDefault()
  smoothScrollTo(href)
}

const updateFooterTime = () => {
  currentTimeLabel.value = `${footerTimeFormatter.format(new Date())} GMT+8`
}

onMounted(() => {
  updateFooterTime()
  footerTimeTimer = setInterval(updateFooterTime, 1000)
})

onBeforeUnmount(() => {
  if (footerTimeTimer) {
    clearInterval(footerTimeTimer)
    footerTimeTimer = null
  }
})
</script>

<template>
  <footer class="relative min-h-screen bg-[#f7f1e7] text-[#1D1E18] overflow-hidden flex flex-col justify-between px-[0.75rem] pt-8 pb-[0.125rem] md:px-[1.75rem] md:pt-12 md:pb-[1.125rem] lg:px-[3.75rem] lg:pt-16 lg:pb-[2.125rem]">
    <div class="absolute inset-0 z-0 flex items-start justify-center overflow-hidden pointer-events-none select-none pt-[2vh] md:pt-[1vh]">
      <h1 class="font-serif text-[18vw] md:text-[23vw] font-bold leading-none opacity-[0.04] text-[#1D1E18] tracking-tight whitespace-nowrap">
        AIpenglow
      </h1>
    </div>

    <div class="relative z-10 flex-1 flex items-center justify-center mt-12 translate-y-[10rem] md:mt-0 md:translate-y-[11rem]">
      <p class="font-serif max-w-[46ch] text-center text-[1rem] md:text-[1.125rem] leading-[1.6] md:leading-[1.65] text-[#1D1E18]/90">
        Colophon: Crafted with intention in the digital realm,<br>
        a testament to quiet luxury and thoughtful design.<br>
        This site is a curated experience, born from moments<br>
        of alpenglow and the pursuit of timeless aesthetics.<br>
        May it inspire your journey.
      </p>
    </div>

    <div class="relative z-10 flex justify-between items-end w-full mt-24 md:mt-0">
      <nav class="flex flex-col gap-3 pb-2">
        <a href="#" class="nav-link" @click="handleAnchorClick($event, '#')">HOME</a>
        <a href="#works" class="nav-link" @click="handleAnchorClick($event, '#works')">WORK</a>
        <a href="#about" class="nav-link" @click="handleAnchorClick($event, '#about')">ABOUT</a>
        <a href="#contact" class="nav-link" @click="handleAnchorClick($event, '#contact')">CONTACT</a>
        <a href="#archive" class="nav-link" @click="handleAnchorClick($event, '#archive')">ARCHIVE</a>
      </nav>

      <div class="flex flex-col items-end gap-6 translate-x-[1.25rem] md:translate-x-[1.5rem]">
        <div class="relative w-32 h-32 md:w-40 md:h-40 group cursor-pointer">
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src="/images/AIpenglow.svg"
              alt="Alpenglow Badge"
              class="footer-badge-spin block w-[13.125rem] h-[13.125rem] md:w-[15rem] md:h-[15rem] opacity-90 transition-opacity group-hover:opacity-100"
            />
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <img
              src="/images/role.svg"
              alt="Role Avatar"
              class="block w-[5.25rem] h-[5.25rem] md:w-[6.25rem] md:h-[6.25rem] rounded-full object-cover"
            />
          </div>
        </div>

        <div class="pr-1 font-mono font-bold text-[10px] md:text-xs tracking-[0.15em] text-[#1D1E18]/80 uppercase">
          {{ currentTimeLabel }}
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.font-serif {
  font-family: 'Cormorant Garamond', 'Noto Serif SC', 'Songti SC', serif;
}

.nav-link {
  position: relative;
  width: fit-content;
  padding-bottom: 2px;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(0.75rem, 1vw, 0.85rem);
  letter-spacing: 0.05em;
  text-decoration: none;
  color: rgba(29, 30, 24, 0.7);
  transition: color 280ms ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(29, 30, 24, 0.9);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 280ms ease;
}

.nav-link:hover {
  color: rgba(29, 30, 24, 1);
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.footer-badge-spin {
  transform-origin: center;
  animation: footer-badge-rotate 18s linear infinite;
  will-change: transform;
}

@keyframes footer-badge-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
