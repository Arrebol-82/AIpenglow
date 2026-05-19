<script setup lang="ts">
import { gsap } from 'gsap'

type Raindrop = {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
}

const sectionRef = ref<HTMLElement | null>(null)
const rainCanvasRef = ref<HTMLCanvasElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroTitleStillRef = ref<HTMLElement | null>(null)
const heroTitleBecomingRef = ref<HTMLElement | null>(null)
const heroSubtitleRef = ref<HTMLElement | null>(null)
const heroSubtitleWrappedMeasureRef = ref<HTMLElement | null>(null)
const heroIntroComplete = useState('hero-intro-complete', () => false)
const navbarIntroComplete = useState('navbar-intro-complete', () => false)
const heroBackgroundImage = "url('/images/Hero_image.jpg')"
const parallaxStyle = ref({
  '--hero-background-image': heroBackgroundImage,
  '--hero-parallax-x': '0px',
  '--hero-parallax-y': '0px'
})

let animationFrameId = 0
let resizeObserver: ResizeObserver | null = null
let heroTitleAnimationContext: gsap.Context | null = null
let drops: Raindrop[] = []
let viewportWidth = 0
let viewportHeight = 0
let isHeroTitleDocked = false

const heroSubtitleText = 'Tracing the soul in quiet lines, beneath the Ghibli breeze.'
const heroSubtitleWords = computed(() =>
  heroSubtitleText.split(' ').map((word, wordIndex) => ({
    id: `hero-subtitle-word-${wordIndex}`,
    word
  }))
)
const heroSubtitleLeadWords = computed(() => heroSubtitleWords.value.slice(0, -2))
const heroSubtitleTailWords = computed(() => heroSubtitleWords.value.slice(-2))

const prefersReducedMotion = () =>
  import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const updateParallax = (pointerX = window.innerWidth / 2, pointerY = window.innerHeight / 2) => {
  const xRatio = pointerX / window.innerWidth - 0.5
  const yRatio = pointerY / window.innerHeight - 0.5
  const scrollShift = Math.min(window.scrollY * 0.016, 7)

  parallaxStyle.value = {
    '--hero-background-image': heroBackgroundImage,
    '--hero-parallax-x': `${(xRatio * 7).toFixed(2)}px`,
    '--hero-parallax-y': `${(yRatio * 5 - scrollShift).toFixed(2)}px`
  }
}

const handlePointerMove = (event: MouseEvent) => {
  updateParallax(event.clientX, event.clientY)
}

const handleScroll = () => {
  updateParallax()
}

const createRaindrop = (canvasWidth: number, canvasHeight: number): Raindrop => ({
  x: Math.random() * canvasWidth,
  y: Math.random() * canvasHeight,
  length: 12 + Math.random() * 16,
  speed: 3.2 + Math.random() * 4.8,
  opacity: 0.08 + Math.random() * 0.16
})

const seedRaindrops = (canvasWidth: number, canvasHeight: number) => {
  const density = Math.max(36, Math.floor((canvasWidth * canvasHeight) / 24000))
  drops = Array.from({ length: density }, () => createRaindrop(canvasWidth, canvasHeight))
}

const resizeCanvas = () => {
  const canvas = rainCanvasRef.value
  const section = sectionRef.value

  if (!canvas || !section) {
    return
  }

  const rect = section.getBoundingClientRect()
  const devicePixelRatio = window.devicePixelRatio || 1
  viewportWidth = Math.max(rect.width, window.innerWidth)
  viewportHeight = Math.max(rect.height, window.innerHeight)

  canvas.width = Math.floor(viewportWidth * devicePixelRatio)
  canvas.height = Math.floor(viewportHeight * devicePixelRatio)
  canvas.style.width = `${viewportWidth}px`
  canvas.style.height = `${viewportHeight}px`

  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
  seedRaindrops(viewportWidth, viewportHeight)
}

const renderRain = () => {
  const canvas = rainCanvasRef.value
  const context = canvas?.getContext('2d')

  if (!canvas || !context) {
    return
  }

  context.clearRect(0, 0, viewportWidth, viewportHeight)
  context.lineWidth = 1
  context.lineCap = 'round'

  for (const drop of drops) {
    context.strokeStyle = `rgba(255, 255, 255, ${drop.opacity})`
    context.beginPath()
    context.moveTo(drop.x, drop.y)
    context.lineTo(drop.x - 3, drop.y + drop.length)
    context.stroke()

    drop.y += drop.speed
    drop.x -= drop.speed * 0.18

    if (drop.y > viewportHeight + 24 || drop.x < -24) {
      drop.x = Math.random() * (viewportWidth + 80)
      drop.y = -20 - Math.random() * 120
      drop.length = 12 + Math.random() * 16
      drop.speed = 3.2 + Math.random() * 4.8
      drop.opacity = 0.08 + Math.random() * 0.16
    }
  }

  animationFrameId = window.requestAnimationFrame(renderRain)
}

const getElementFontSize = (element: HTMLElement | null, fallback: number) => {
  if (!element) {
    return fallback
  }

  const fontSize = Number.parseFloat(window.getComputedStyle(element).fontSize)
  return Number.isFinite(fontSize) ? fontSize : fallback
}

const getUntransformedRect = (element: HTMLElement) => {
  const previousTransform = element.style.transform
  const previousTransformOrigin = element.style.transformOrigin

  gsap.set(element, {
    x: 0,
    y: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    transformOrigin: 'top left'
  })

  const rect = element.getBoundingClientRect()

  element.style.transform = previousTransform
  element.style.transformOrigin = previousTransformOrigin

  return rect
}

const getHeroSubtitleWordShells = (root: HTMLElement | null = heroSubtitleRef.value) =>
  root
    ? Array.from(root.querySelectorAll<HTMLElement>('.hero-subtitle-word-shell'))
    : []

const getHeroSubtitleWordDockOffsets = () => {
  if (!heroSubtitleRef.value || !heroSubtitleWrappedMeasureRef.value) {
    return []
  }

  const liveWordShells = getHeroSubtitleWordShells(heroSubtitleRef.value)
  const measuredWordPositions = new Map(
    getHeroSubtitleWordShells(heroSubtitleWrappedMeasureRef.value).map((shell) => [
      shell.dataset.wordId ?? '',
      {
        left: shell.offsetLeft,
        top: shell.offsetTop
      }
    ] as const)
  )

  return liveWordShells.map((shell) => {
    const wordId = shell.dataset.wordId ?? ''
    const measuredPosition = measuredWordPositions.get(wordId)

    return {
      shell,
      x: measuredPosition ? measuredPosition.left - shell.offsetLeft : 0,
      y: measuredPosition ? measuredPosition.top - shell.offsetTop : 0
    }
  })
}

const getHeroDockMetrics = () => {
  if (!sectionRef.value || !heroTitleRef.value || !heroTitleStillRef.value || !heroSubtitleRef.value) {
    return null
  }

  const isMobile = window.innerWidth < 768
  const isDesktopWide = window.innerWidth >= 1280
  const titleRect = getUntransformedRect(heroTitleRef.value)
  const subtitleCurrentRect = getUntransformedRect(heroSubtitleRef.value)
  const subtitleMeasureRect = heroSubtitleWrappedMeasureRef.value?.getBoundingClientRect() ?? subtitleCurrentRect
  const targetStillFontSize = isMobile ? 84 : 145
  const targetSubtitleFontSize = isMobile ? 18 : 26
  const stillFontSize = getElementFontSize(heroTitleStillRef.value, targetStillFontSize)
  const subtitleFontSize = getElementFontSize(heroSubtitleWrappedMeasureRef.value ?? heroSubtitleRef.value, targetSubtitleFontSize)
  const titleScale = targetStillFontSize / stillFontSize
  const subtitleScale = targetSubtitleFontSize / subtitleFontSize
  const sideInset = isMobile ? 24 : (isDesktopWide ? 60 : 48)
  const bottomInset = isMobile ? 80 : 140
  const topFloor = isMobile ? 96 : 120
  const blockGap = isMobile ? 16 : 20
  const dockOffset = 20
  const titleWidth = titleRect.width * titleScale
  const titleHeight = titleRect.height * titleScale
  const subtitleWidth = subtitleMeasureRect.width * subtitleScale
  const subtitleHeight = subtitleMeasureRect.height * subtitleScale
  const blockHeight = titleHeight + blockGap + subtitleHeight
  const sectionRect = sectionRef.value.getBoundingClientRect()
  const sectionHeight = sectionRef.value.offsetHeight
  const blockTop = Math.max(topFloor, sectionHeight - bottomInset - blockHeight - dockOffset)
  const blockRight = window.innerWidth - sideInset - dockOffset
  const titleTargetLeft = Math.max(sideInset, blockRight - titleWidth)
  const subtitleTargetLeft = Math.max(sideInset, blockRight - subtitleWidth)
  const subtitleTargetTop = blockTop + titleHeight + blockGap

  return {
    titleX: titleTargetLeft - titleRect.left,
    titleY: blockTop - (titleRect.top - sectionRect.top),
    titleScale,
    subtitleX: subtitleTargetLeft - subtitleCurrentRect.left,
    subtitleY: subtitleTargetTop - (subtitleCurrentRect.top - sectionRect.top),
    subtitleScale
  }
}

const moveHeroTitleToDock = (immediate = false) => {
  if (!heroTitleRef.value || !heroSubtitleRef.value) {
    return
  }

  const shouldDockImmediately = immediate || prefersReducedMotion()
  const subtitleWordOffsets = getHeroSubtitleWordDockOffsets()
  const dockMetrics = getHeroDockMetrics()

  if (!dockMetrics) {
    return
  }

  const subtitleWordTargets = subtitleWordOffsets.map(({ shell, x, y }) => ({
    shell,
    x: dockMetrics.subtitleX + x * dockMetrics.subtitleScale,
    y: dockMetrics.subtitleY + y * dockMetrics.subtitleScale
  }))
  const subtitleWordDuration = 1.5
  const subtitleWordStagger = 0.065
  const titleStartDelay = subtitleWordDuration * 0.5

  isHeroTitleDocked = true
  gsap.killTweensOf([
    heroTitleRef.value,
    heroSubtitleRef.value,
    ...subtitleWordTargets.map(({ shell }) => shell)
  ])

  if (shouldDockImmediately) {
    gsap.set(heroSubtitleRef.value, {
      x: 0,
      y: 0,
      scale: 1,
      transformOrigin: 'top left'
    })
    gsap.set(heroTitleRef.value, {
      x: dockMetrics.titleX,
      y: dockMetrics.titleY,
      scale: dockMetrics.titleScale,
      transformOrigin: 'top left'
    })
    for (const { shell, x, y } of subtitleWordTargets) {
      gsap.set(shell, {
        x,
        y,
        scale: dockMetrics.subtitleScale,
        transformOrigin: 'top left'
      })
    }
    return
  }

  gsap.set(heroSubtitleRef.value, {
    x: 0,
    y: 0,
    scale: 1,
    transformOrigin: 'top left'
  })

  gsap.to(heroTitleRef.value, {
    x: dockMetrics.titleX,
    y: dockMetrics.titleY,
    scale: dockMetrics.titleScale,
    transformOrigin: 'top left',
    duration: 1.08,
    delay: titleStartDelay,
    ease: 'expo.inOut',
    force3D: true
  })

  gsap.to(subtitleWordTargets.map(({ shell }) => shell), {
    x: (index) => subtitleWordTargets[index]?.x ?? 0,
    y: (index) => subtitleWordTargets[index]?.y ?? 0,
    scale: dockMetrics.subtitleScale,
    transformOrigin: 'top left',
    duration: subtitleWordDuration,
    stagger: {
      each: subtitleWordStagger,
      from: 'end'
    },
    ease: 'expo.inOut',
    force3D: true,
    overwrite: 'auto'
  })
}

const setupHeroTitleAnimation = () => {
  if (
    !sectionRef.value
    || !heroTitleStillRef.value
    || !heroTitleBecomingRef.value
    || !heroSubtitleRef.value
    || prefersReducedMotion()
  ) {
    heroIntroComplete.value = true
    return
  }

  heroTitleAnimationContext = gsap.context(() => {
    const subtitleWords = gsap.utils.toArray<HTMLElement>('.hero-subtitle-word', heroSubtitleRef.value)
    const timeline = gsap.timeline({
      defaults: {
        ease: 'power4.out'
      }
    })

    timeline.from(heroTitleStillRef.value, {
      y: 42,
      autoAlpha: 0,
      scale: 1.045,
      filter: 'blur(16px)',
      duration: 1.18,
      ease: 'expo.out',
      clearProps: 'filter,opacity,transform'
    }, 0)

    timeline.from(heroTitleBecomingRef.value, {
      y: 54,
      x: 20,
      autoAlpha: 0,
      scale: 1.02,
      rotation: 2,
      filter: 'blur(12px)',
      duration: 1.28,
      ease: 'expo.out',
      clearProps: 'filter,opacity,transform'
    }, 0.08)

    timeline.call(() => {
      heroIntroComplete.value = true
    }, undefined, 1.4)

    timeline.from(subtitleWords, {
      yPercent: 125,
      autoAlpha: 0,
      duration: 0.78,
      stagger: 0.06,
      ease: 'power3.out',
      clearProps: 'opacity,transform'
    }, 0.32)
  }, sectionRef.value)
}

onMounted(() => {
  heroIntroComplete.value = false
  navbarIntroComplete.value = false
  isHeroTitleDocked = false
  resizeCanvas()
  updateParallax()
  renderRain()
  setupHeroTitleAnimation()

  resizeObserver = new ResizeObserver(() => {
    resizeCanvas()
  })

  if (sectionRef.value) {
    resizeObserver.observe(sectionRef.value)
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handlePointerMove, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })
})

watch(navbarIntroComplete, async (isComplete) => {
  if (!isComplete) {
    return
  }

  await nextTick()
  moveHeroTitleToDock()
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrameId)
  resizeObserver?.disconnect()
  heroTitleAnimationContext?.revert()
  heroTitleAnimationContext = null
  gsap.killTweensOf([heroTitleRef.value, heroSubtitleRef.value, ...getHeroSubtitleWordShells()])
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handlePointerMove)
  window.removeEventListener('scroll', handleScroll)
})

const handleResize = () => {
  resizeCanvas()

  if (isHeroTitleDocked && navbarIntroComplete.value) {
    moveHeroTitleToDock(true)
  }
}
</script>

<template>
  <section
    ref="sectionRef"
    class="hero-section relative left-1/2 flex min-h-screen w-screen max-w-none -translate-x-1/2 flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-28 text-center md:px-12 md:pb-24 md:pt-32 xl:px-[60px]"
    :style="parallaxStyle"
  >
    <div class="hero-image-stage absolute inset-0 z-0">
      <NuxtImg
        alt="painterly forest landscape at dusk with layered mist and soft cinematic light"
        class="hero-image"
        data-alt="Dreamy painterly forest scene with mist, rainfall, and soft atmospheric light in a Ghibli-inspired anime background style"
        loading="eager"
        src="/images/Hero_image.jpg"
      />
      <canvas ref="rainCanvasRef" class="hero-rain-layer" aria-hidden="true"></canvas>
    </div>
    <div class="hero-copy z-10">
      <span class="hero-title-shell">
        <h1
          ref="heroTitleRef"
          class="hero-title"
        >
          <span
            ref="heroTitleStillRef"
            class="hero-title-part hero-title-part--serif"
          >
            Still
          </span>
          <span
            ref="heroTitleBecomingRef"
            class="hero-title-part hero-title-part--contrast"
          >
            Becoming
          </span>
        </h1>
      </span>
      <p
        ref="heroSubtitleRef"
        class="hero-subtitle font-body text-lg font-light italic tracking-tight md:text-[1.75rem]"
      >
        <template v-for="word in heroSubtitleWords" :key="word.id">
          <span class="hero-subtitle-word-shell" :data-word-id="word.id">
            <span class="hero-subtitle-word">{{ word.word }}</span>
          </span>
        </template>
      </p>
      <p
        ref="heroSubtitleWrappedMeasureRef"
        aria-hidden="true"
        class="hero-subtitle hero-subtitle--wrapped hero-subtitle--measure font-body text-lg font-light italic tracking-tight md:text-[1.75rem]"
      >
        <span class="hero-subtitle-line hero-subtitle-line--lead">
          <template v-for="word in heroSubtitleLeadWords" :key="`measure-${word.id}`">
            <span class="hero-subtitle-word-shell" :data-word-id="word.id">
              <span class="hero-subtitle-word">{{ word.word }}</span>
            </span>
          </template>
        </span>
        <span class="hero-subtitle-line hero-subtitle-line--tail">
          <template v-for="word in heroSubtitleTailWords" :key="`measure-tail-${word.id}`">
            <span class="hero-subtitle-word-shell" :data-word-id="word.id">
              <span class="hero-subtitle-word">{{ word.word }}</span>
            </span>
          </template>
        </span>
      </p>
    </div>
    <div class="hero-scroll-cue absolute bottom-10 left-6 z-10 text-on-background md:bottom-12 md:left-12 xl:left-[60px]">
      <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'wght' 200;">
        keyboard_double_arrow_down
      </span>
    </div>
  </section>
</template>

<style scoped>
@font-face {
  font-family: 'Golden Plains Demo';
  src: url('~/assets/fonts/Golden Plains - Demo.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

.hero-section {
  background: #e9e1d5;
  isolation: isolate;
}

.hero-image-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #e9e1d5 var(--hero-background-image) center 62% / cover no-repeat;
  --hero-cover-parallax-buffer: clamp(3.5rem, 6vh, 4.75rem);
}

.hero-image {
  position: absolute;
  top: calc(var(--hero-cover-parallax-buffer) * -1);
  right: -6px;
  bottom: calc(var(--hero-cover-parallax-buffer) * -1);
  left: -6px;
  width: calc(100% + 12px);
  height: calc(100% + var(--hero-cover-parallax-buffer) * 2);
  max-width: none;
  display: block;
  object-fit: cover;
  transform: translate3d(
    var(--hero-parallax-x),
    calc(var(--hero-parallax-y) + var(--hero-cover-parallax-y, 0px)),
    0
  ) scale(1.004);
  transform-origin: center;
  transition: transform 280ms ease-out;
}

@media (max-width: 767px) {
  .hero-image {
    right: -4px;
    left: -4px;
    width: calc(100% + 8px);
  }
}

.hero-rain-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.72;
  mix-blend-mode: screen;
}

.hero-title,
.hero-subtitle,
.hero-scroll-cue {
  position: relative;
  text-shadow: 0 10px 28px rgb(32 42 36 / 0.14);
}

.hero-title {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: center;
  column-gap: clamp(1rem, 1.9vw, 1.8rem);
  row-gap: 0.22rem;
  color: #e8ddd0;
  line-height: 0.84;
  will-change: transform, filter, opacity;
}

.hero-title-shell {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0.38em 0.22em 0.78em;
  margin: -0.12em -0.08em -0.2em;
  vertical-align: top;
}

.hero-copy {
  width: min(100%, 85.75rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-inline: auto;
  margin-top: clamp(0.9rem, 5.8vh, 3.8rem);
  text-align: center;
}

.hero-title-part {
  display: inline-block;
  will-change: transform, filter, opacity;
}

.hero-title-part--serif {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(7.95rem, 16.2vw, 14.85rem);
  font-weight: 600;
  letter-spacing: -0.06em;
}

.hero-title-part--contrast {
  font-family: 'Golden Plains Demo', cursive;
  font-size: clamp(7.25rem, 15.2vw, 14rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  margin-left: clamp(0.68rem, 1.35vw, 1.32rem);
  transform: translate(0.08em, -0.02em);
}

.hero-subtitle {
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: center;
  width: auto;
  max-width: none;
  margin-inline: auto;
  margin-top: -0.24rem;
  color: rgb(232 221 208 / 0.78);
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.012em;
  line-height: 1.3;
  white-space: nowrap;
  transform: none;
}

.hero-subtitle--wrapped {
  flex-direction: column;
  align-items: stretch;
  width: fit-content;
  row-gap: 0.02em;
  white-space: normal;
}

.hero-subtitle--measure {
  position: fixed;
  top: -10000px;
  left: -10000px;
  margin: 0;
  visibility: hidden;
  pointer-events: none;
  transform: none !important;
}

.hero-subtitle-line {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.hero-subtitle-line--lead {
  justify-content: center;
}

.hero-subtitle-line--tail {
  justify-content: flex-end;
}

.hero-subtitle-word-shell {
  display: inline-block;
  overflow: hidden;
  padding: 0.04em 0.14em 0.14em 0.06em;
  vertical-align: top;
}

.hero-subtitle-word {
  display: inline-block;
  will-change: transform, opacity;
}

@media (max-width: 767px) {
  .hero-rain-layer {
    opacity: 0.58;
  }

  .hero-copy {
    margin-top: clamp(0.65rem, 4.6vh, 2.1rem);
  }

  .hero-title {
    column-gap: 0.52rem;
    row-gap: 0.15rem;
    line-height: 0.88;
  }

  .hero-title-shell {
    padding: 0.32em 0.14em 0.66em;
    margin: -0.1em -0.04em -0.16em;
  }

  .hero-title-part--serif {
    font-size: clamp(4.6rem, 20vw, 6.3rem);
  }

  .hero-title-part--contrast {
    font-size: clamp(4rem, 18vw, 5.6rem);
    margin-left: 0.34rem;
    transform: translate(0.05em, -0.01em);
  }

  .hero-subtitle {
    display: flex;
    margin-top: 0;
    width: min(100%, 24rem);
    justify-content: center;
    white-space: normal;
    transform: none;
  }

  .hero-subtitle--wrapped {
    width: min(100%, 24rem);
  }

  .hero-subtitle:not(.hero-subtitle--wrapped):not(.hero-subtitle--measure) {
    flex-wrap: wrap;
    transform: none;
  }
}
</style>
