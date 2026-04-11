<script setup lang="ts">
import heroImage from '~/assets/images/Hero_image.jpg'

type Raindrop = {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
}

const sectionRef = ref<HTMLElement | null>(null)
const rainCanvasRef = ref<HTMLCanvasElement | null>(null)
const parallaxStyle = ref({
  '--hero-parallax-x': '0px',
  '--hero-parallax-y': '0px',
  '--hero-overlay-shift-x': '0px',
  '--hero-overlay-shift-y': '0px'
})

let animationFrameId = 0
let resizeObserver: ResizeObserver | null = null
let drops: Raindrop[] = []
let viewportWidth = 0
let viewportHeight = 0

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

const updateParallax = (pointerX = window.innerWidth / 2, pointerY = window.innerHeight / 2) => {
  const xRatio = pointerX / window.innerWidth - 0.5
  const yRatio = pointerY / window.innerHeight - 0.5
  const scrollShift = Math.min(window.scrollY * 0.018, 8)

  parallaxStyle.value = {
    '--hero-parallax-x': `${(xRatio * 8).toFixed(2)}px`,
    '--hero-parallax-y': `${(yRatio * 6 - scrollShift).toFixed(2)}px`,
    '--hero-overlay-shift-x': `${(xRatio * 4).toFixed(2)}px`,
    '--hero-overlay-shift-y': `${(yRatio * 5 - scrollShift * 0.35).toFixed(2)}px`
  }
}

const handlePointerMove = (event: MouseEvent) => {
  updateParallax(event.clientX, event.clientY)
}

const handleScroll = () => {
  updateParallax()
}

onMounted(() => {
  resizeCanvas()
  updateParallax()
  renderRain()

  resizeObserver = new ResizeObserver(() => {
    resizeCanvas()
  })

  if (sectionRef.value) {
    resizeObserver.observe(sectionRef.value)
  }

  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('mousemove', handlePointerMove, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrameId)
  resizeObserver?.disconnect()
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', handlePointerMove)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="hero-section relative flex min-h-screen w-full flex-col items-end justify-end overflow-hidden px-6 pb-20 text-right md:px-12 md:pb-24 xl:px-[60px]"
    :style="parallaxStyle"
  >
    <div class="hero-image-stage absolute inset-0 z-0">
      <img
        alt="painterly forest landscape at dusk with layered mist and soft cinematic light"
        class="hero-image"
        data-alt="Dreamy painterly forest scene with mist, rainfall, and soft atmospheric light in a Ghibli-inspired anime background style"
        :src="heroImage"
      >
      <div class="hero-light hero-light--glow"></div>
      <div class="hero-light hero-light--lift"></div>
      <div class="hero-light hero-light--mist"></div>
      <div class="hero-image-vignette"></div>
      <canvas ref="rainCanvasRef" class="hero-rain-layer" aria-hidden="true"></canvas>
    </div>
    <div class="z-10 max-w-4xl">
      <h1
        class="hero-title mb-5 font-headline text-7xl font-bold leading-none tracking-tighter md:text-[8.5rem]"
      >
        <span class="font-medium italic text-primary">Still</span> Becoming
      </h1>
      <p
        class="hero-subtitle ml-auto max-w-2xl font-body text-lg font-light italic tracking-tight md:text-[1.75rem]"
      >
        Tracing the soul in quiet lines, beneath the Ghibli breeze.
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
.hero-section {
  background: #e9e1d5;
  isolation: isolate;
}

.hero-image-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  inset: -10px;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  max-width: none;
  display: block;
  object-fit: cover;
  transform: translate3d(var(--hero-parallax-x), var(--hero-parallax-y), 0) scale(1.01);
  transform-origin: center;
  filter: brightness(0.9) saturate(1.02);
  animation: hero-breathing 9s ease-in-out infinite;
  transition: transform 280ms ease-out;
}

.hero-image-vignette {
  position: absolute;
  inset: -8%;
  background:
    radial-gradient(circle at 24% 22%, rgb(255 255 255 / 0.16), transparent 32%),
    linear-gradient(180deg, rgb(16 24 20 / 0.06) 0%, rgb(16 24 20 / 0.26) 100%);
  transform: translate3d(var(--hero-overlay-shift-x), var(--hero-overlay-shift-y), 0);
  transition: transform 320ms ease-out;
  pointer-events: none;
}

.hero-light {
  position: absolute;
  pointer-events: none;
  mix-blend-mode: screen;
}

.hero-light--glow {
  top: 7%;
  right: 5%;
  width: min(34vw, 440px);
  height: min(48vh, 360px);
  background: radial-gradient(circle at 42% 40%, rgb(255 245 220 / 0.34), rgb(255 226 169 / 0.12) 42%, transparent 72%);
  filter: blur(18px);
  opacity: 0.9;
  transform: translate3d(calc(var(--hero-overlay-shift-x) * 0.7), calc(var(--hero-overlay-shift-y) * 0.7), 0);
  animation: hero-glow-drift 12s ease-in-out infinite;
}

.hero-light--lift {
  inset: 0;
  background:
    radial-gradient(circle at 74% 26%, rgb(255 244 214 / 0.18), transparent 22%),
    radial-gradient(circle at 70% 42%, rgb(255 247 227 / 0.12), transparent 26%);
  mix-blend-mode: screen;
  opacity: 0.72;
  transform: translate3d(calc(var(--hero-overlay-shift-x) * 0.45), calc(var(--hero-overlay-shift-y) * 0.45), 0);
  animation: hero-lift-breathe 11s ease-in-out infinite;
}

.hero-light--mist {
  top: 22%;
  right: 6%;
  width: min(34vw, 360px);
  height: min(28vh, 210px);
  background:
    linear-gradient(110deg, transparent 0%, rgb(255 252 243 / 0.06) 28%, rgb(255 249 234 / 0.14) 48%, rgb(247 242 232 / 0.08) 64%, transparent 100%),
    radial-gradient(circle at 58% 48%, rgb(255 252 244 / 0.12), transparent 62%);
  filter: blur(26px);
  opacity: 0.62;
  transform: translate3d(calc(var(--hero-overlay-shift-x) * 0.9), calc(var(--hero-overlay-shift-y) * 0.9), 0);
  animation: hero-mist-stream 18s ease-in-out infinite;
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
  color: #e8ddd0;
}

.hero-subtitle {
  color: rgb(232 221 208 / 0.78);
}

@keyframes hero-breathing {
  0%,
  100% {
    filter: brightness(0.88) saturate(1.02);
  }

  50% {
    filter: brightness(1.04) saturate(1.08);
  }
}

@keyframes hero-glow-drift {
  0%,
  100% {
    opacity: 0.82;
  }

  50% {
    opacity: 1;
  }
}

@keyframes hero-lift-breathe {
  0%,
  100% {
    opacity: 0.54;
    transform: translate3d(calc(var(--hero-overlay-shift-x) * 0.35), calc(var(--hero-overlay-shift-y) * 0.35), 0);
  }

  50% {
    opacity: 0.84;
    transform: translate3d(calc(var(--hero-overlay-shift-x) * 0.55), calc(var(--hero-overlay-shift-y) * 0.55), 0);
  }
}

@keyframes hero-mist-stream {
  0%,
  100% {
    opacity: 0.42;
    transform: translate3d(calc(var(--hero-overlay-shift-x) * 0.75 - 12px), calc(var(--hero-overlay-shift-y) * 0.8), 0) rotate(-4deg);
  }

  50% {
    opacity: 0.68;
    transform: translate3d(calc(var(--hero-overlay-shift-x) * 1.1 + 16px), calc(var(--hero-overlay-shift-y) * 0.95 - 6px), 0) rotate(2deg);
  }
}

@media (max-width: 767px) {
  .hero-image {
    inset: -8px;
    width: calc(100% + 16px);
    height: calc(100% + 16px);
  }

  .hero-rain-layer {
    opacity: 0.58;
  }

  .hero-light--glow {
    top: 10%;
    right: -6%;
    width: 220px;
    height: 220px;
    opacity: 0.72;
  }

  .hero-light--lift {
    opacity: 0.58;
  }

  .hero-light--mist {
    top: 24%;
    right: 2%;
    width: 220px;
    height: 120px;
    opacity: 0.46;
  }
}
</style>
