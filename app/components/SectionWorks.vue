<script setup lang="ts">
import { gsap } from 'gsap'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const projectRows = [
  [
    { title: '模仿页面', meta: 'Notion / Frontend Study', accent: 'blue' },
    { title: '界面实验', meta: 'UI Motion / Visual Draft', accent: 'sand' },
  ],
  [
    { title: '落地页设计', meta: 'Editorial / Web Layout', accent: 'green' },
    { title: '组件系统', meta: 'Design Tokens / Vue', accent: 'slate' },
    { title: '动效片段', meta: 'Micro Motion / Case Notes', accent: 'blue' },
  ],
  [
    { title: '卡片研究', meta: 'Display Panel / Archive', accent: 'sand' },
    { title: '排版练习', meta: 'Type / Grid / Rhythm', accent: 'slate' },
  ],
  [
    { title: '视觉采样', meta: 'Color / Texture / Mood', accent: 'green' },
    { title: '网页复刻', meta: 'Frontend / Study Clone', accent: 'blue' },
    { title: '交互草图', meta: 'Hover / Flow / Motion', accent: 'sand' },
  ]
] as const

type CanvasProject = (typeof projectRows)[number][number]

const canvasProjectPool = computed<CanvasProject[]>(() => [...projectRows.flat(), ...projectRows[0]])
const shuffledCanvasProjects = ref<CanvasProject[]>([])
const canvasViewportRef = ref<HTMLElement | null>(null)
const canvasTiles = [
  { id: 'tile-0', x: -1, y: -1 },
  { id: 'tile-1', x: 0, y: -1 },
  { id: 'tile-2', x: 1, y: -1 },
  { id: 'tile-3', x: -1, y: 0 },
  { id: 'tile-4', x: 0, y: 0 },
  { id: 'tile-5', x: 1, y: 0 },
  { id: 'tile-6', x: -1, y: 1 },
  { id: 'tile-7', x: 0, y: 1 },
  { id: 'tile-8', x: 1, y: 1 },
] as const

const testImageIds = [1015, 1018, 1024, 1027, 1035, 1039, 1043, 1050, 1067, 1074] as const

let destroyCanvasDrag: (() => void) | null = null

function shuffleProjects<T>(projects: T[]) {
  const shuffled = [...projects]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]
  }

  return shuffled
}

const activeCanvasProjects = computed(() =>
  shuffledCanvasProjects.value.length
    ? shuffledCanvasProjects.value
    : canvasProjectPool.value
)

const canvasCards = computed(() =>
  activeCanvasProjects.value.map((project, index) => {
    const imageId = testImageIds[index % testImageIds.length]
    const seed = (index * 123.45) % 1
    const shiftX = (seed * 60) - 30
    const shiftY = (((seed * 789) % 1) * 60) - 30
    const rotation = (seed * 6) - 3

    return {
      ...project,
      image: `https://picsum.photos/id/${imageId}/576/800`,
      baseX: (index % 4) * 420 + shiftX,
      baseY: Math.floor(index / 4) * 520 + shiftY,
      rotation,
      zIndex: index % 5,
      scale: 0.95 + (seed * 0.1),
    }
  })
)

const canvasTileCards = computed(() =>
  Object.fromEntries(
    canvasTiles.map((tile, tileIndex) => {
      const tileShift = (tileIndex * 3) % canvasCards.value.length
      const reorderedCards = [
        ...canvasCards.value.slice(tileShift),
        ...canvasCards.value.slice(0, tileShift),
      ]

      return [tile.id, reorderedCards.map((card, index) => {
        const tileSeed = (((tileIndex + 1) * 0.173) + ((index + 1) * 0.097)) % 1
        const tileShiftX = (tileSeed * 60) - 30
        const tileShiftY = (((tileSeed * 541) % 1) * 60) - 30

        return {
          ...card,
          baseX: card.baseX + tileShiftX,
          baseY: card.baseY + tileShiftY,
          rotation: card.rotation + ((tileSeed * 1.6) - 0.8),
          zIndex: (card.zIndex + tileIndex) % 5,
        }
      })]
    })
  )
)


onMounted(async () => {
  shuffledCanvasProjects.value = shuffleProjects(canvasProjectPool.value)
  await nextTick()

  if (!canvasViewportRef.value) {
    return
  }

  destroyCanvasDrag = await setupInfiniteCanvas(canvasViewportRef.value)
})

onBeforeUnmount(() => {
  destroyCanvasDrag?.()
  destroyCanvasDrag = null
})

async function setupInfiniteCanvas(viewport: HTMLElement) {
  const clusters = Array.from(
    viewport.querySelectorAll<HTMLElement>('.works-canvas__cluster')
  )

  if (!clusters.length) {
    return () => {}
  }

  const [{ Draggable }, { InertiaPlugin }] = await Promise.all([
    import('gsap/Draggable'),
    import('gsap/InertiaPlugin'),
  ])

  gsap.registerPlugin(Draggable, InertiaPlugin)

  const proxy = document.createElement('div')
  const xSetters = clusters.map((cluster) => gsap.quickSetter(cluster, 'x', 'px'))
  const ySetters = clusters.map((cluster) => gsap.quickSetter(cluster, 'y', 'px'))
  const resizeObserver = new ResizeObserver(measure)

  let offsetX = 0
  let offsetY = 0
  let dragOriginX = 0
  let dragOriginY = 0
  let tileWidth = 0
  let tileHeight = 0
  let stepX = 0
  let stepY = 0
  let wrapX = gsap.utils.wrap(0, 1)
  let wrapY = gsap.utils.wrap(0, 1)
  let centerX = 0
  let centerY = 0

  function render() {
    clusters.forEach((cluster, index) => {
      const gridX = Number(cluster.dataset.gridX ?? 0)
      const gridY = Number(cluster.dataset.gridY ?? 0)

      xSetters[index](wrapX(centerX + gridX * stepX + offsetX))
      ySetters[index](wrapY(centerY + gridY * stepY + offsetY))
    })
  }

  function measure() {
    const firstCluster = clusters[0]

    if (!firstCluster) {
      return
    }

    const styles = window.getComputedStyle(viewport)
    const gapX = Number.parseFloat(styles.getPropertyValue('--works-cluster-gap-x')) || 120
    const gapY = Number.parseFloat(styles.getPropertyValue('--works-cluster-gap-y')) || 40
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0
    const paddingTop = Number.parseFloat(styles.paddingTop) || 0
    const innerWidth = viewport.clientWidth - paddingLeft * 2
    const innerHeight = viewport.clientHeight - paddingTop * 2

    tileWidth = firstCluster.offsetWidth
    tileHeight = firstCluster.offsetHeight
    stepX = tileWidth + gapX
    stepY = tileHeight + gapY
    centerX = paddingLeft + (innerWidth - tileWidth) / 2
    centerY = paddingTop + (innerHeight - tileHeight) / 2
    wrapX = gsap.utils.wrap(centerX - stepX * 1.5, centerX + stepX * 1.5)
    wrapY = gsap.utils.wrap(centerY - stepY * 1.5, centerY + stepY * 1.5)

    render()
  }

  const draggable = Draggable.create(proxy, {
    trigger: viewport,
    type: 'x,y',
    inertia: true,
    allowNativeTouchScrolling: false,
    onPressInit() {
      dragOriginX = offsetX
      dragOriginY = offsetY
      viewport.classList.add('works-canvas__frame--dragging')
      gsap.killTweensOf(proxy)
      gsap.set(proxy, { x: 0, y: 0 })
    },
    onDrag() {
      offsetX = dragOriginX + this.x
      offsetY = dragOriginY + this.y
      render()
    },
    onThrowUpdate() {
      offsetX = dragOriginX + this.x
      offsetY = dragOriginY + this.y
      render()
    },
    onRelease() {
      viewport.classList.remove('works-canvas__frame--dragging')

      if (!this.tween) {
        offsetX = dragOriginX + this.x
        offsetY = dragOriginY + this.y
        gsap.set(proxy, { x: 0, y: 0 })
        render()
      }
    },
    onThrowComplete() {
      viewport.classList.remove('works-canvas__frame--dragging')
      offsetX = dragOriginX + this.x
      offsetY = dragOriginY + this.y
      gsap.set(proxy, { x: 0, y: 0 })
      render()
    },
  })[0]

  measure()
  resizeObserver.observe(viewport)

  return () => {
    viewport.classList.remove('works-canvas__frame--dragging')
    resizeObserver.disconnect()
    draggable.kill()
    gsap.killTweensOf(proxy)
  }
}

</script>

<template>
  <section id="works">
    <h2
      id="works-gallery"
      class="section-kicker mb-16 scroll-mt-32 text-accent"
    >
      作品 / 技术
    </h2>

    <div>
      <article class="works-archive group mx-auto w-full max-w-[100rem]">
        <div class="works-archive__panel">
          <div class="works-archive__artboard">
            <a
              aria-label="打开模仿页面项目"
              class="works-archive__image-link"
              href="https://notion-imitation.vercel.app/"
              rel="noreferrer"
              target="_blank"
            >
              <div class="works-archive__image-shell">
                <img
                  alt="模仿页面项目首页截图"
                  class="works-archive__image"
                  src="../assets/images/image.png"
                >
              </div>
            </a>
          </div>

          <div class="works-archive__meta">
            <h3 class="works-archive__title">
              Notion 练习页
            </h3>

            <p class="works-archive__lead">
              以 Notion 官网为参考完成的前端页面，主要用于练习 Flex 与 Grid 布局。
            </p>

            <div class="works-archive__specs">
              <div class="works-archive__spec">
                <span class="works-archive__label">技术栈</span>
                <div class="works-archive__stack-list">
                  <div class="works-archive__stack-pill">
                    <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:javascript" />
                    <span>JavaScript</span>
                  </div>
                  <div class="works-archive__stack-pill">
                    <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:html-5" />
                    <span>HTML5</span>
                  </div>
                  <div class="works-archive__stack-pill">
                    <Icon class="h-4 w-4 flex-none" mode="svg" name="logos:css-3" />
                    <span>CSS3</span>
                  </div>
                </div>
              </div>

              <div class="works-archive__spec">
                <span class="works-archive__label">年份</span>
                <span class="works-archive__value">2025</span>
              </div>
            </div>

            <p class="works-archive__note">
              这不是一个完整的项目，而是我在学习阶段的一次练习。它保留了我当时对页面布局与还原的理解。
            </p>

            <a
              aria-label="打开作品档案"
              class="works-archive__link"
              href="https://notion-imitation.vercel.app/"
              rel="noreferrer"
              target="_blank"
            >
              <span class="works-archive__link-text">查看档案</span>
              <span aria-hidden="true" class="works-archive__glyph">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.15"
                >
                  <path d="M6 18L18 6" />
                  <path d="M9 6H18V15" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </article>

      <section class="works-canvas mx-auto w-full" aria-label="作品画布">
        <div aria-hidden="true" class="works-canvas__marquee-slot">
          <div class="works-canvas__marquee-inner">
            <div class="works-canvas__marquee-strip works-canvas__marquee-strip--primary">
              <span
                v-for="index in 20"
                :key="`top-marquee-a-${index}`"
                class="works-canvas__marquee-item"
              >
                AIpenglow
              </span>
            </div>
            <div class="works-canvas__marquee-strip works-canvas__marquee-strip--secondary">
              <span
                v-for="index in 20"
                :key="`top-marquee-b-${index}`"
                class="works-canvas__marquee-item"
              >
                AIpenglow
              </span>
            </div>
          </div>
        </div>

        <div ref="canvasViewportRef" class="works-canvas__frame">
          <div
            v-for="tile in canvasTiles"
            :key="tile.id"
            class="works-canvas__cluster"
            :data-grid-x="tile.x"
            :data-grid-y="tile.y"
          >
            <div
              v-for="(card, cardIndex) in canvasTileCards[tile.id] || []"
              :key="`${tile.id}-card-${cardIndex}-${card.title}`"
              class="works-canvas__card-shell"
              :style="{
                position: 'absolute',
                left: `${card.baseX}px`,
                top: `${card.baseY}px`,
                zIndex: card.zIndex,
                '--card-scale': `${card.scale}`,
                transform: `rotate(${card.rotation}deg)`,
              }"
            >
              <article
                :class="[
                  'works-canvas__card',
                  `works-canvas__card--${card.accent}`,
                ]"
              >
                <div class="works-canvas__card-surface">
                  <div class="works-canvas__card-image-shell">
                    <img
                      :src="card.image"
                      :alt="card.title"
                      class="works-canvas__card-image"
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                  <div class="works-canvas__card-copy">
                    <p class="works-canvas__card-meta">
                      {{ card.meta }}
                    </p>
                    <h3 class="works-canvas__card-title">
                      {{ card.title }}
                    </h3>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          class="works-canvas__marquee-slot works-canvas__marquee-slot--slow"
        >
          <div class="works-canvas__marquee-inner">
            <div class="works-canvas__marquee-strip works-canvas__marquee-strip--primary">
              <span
                v-for="index in 20"
                :key="`bottom-marquee-a-${index}`"
                class="works-canvas__marquee-item"
              >
                AIpenglow
              </span>
            </div>
            <div class="works-canvas__marquee-strip works-canvas__marquee-strip--secondary">
              <span
                v-for="index in 20"
                :key="`bottom-marquee-b-${index}`"
                class="works-canvas__marquee-item"
              >
                AIpenglow
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.works-archive {
  position: relative;
}

.works-archive__panel {
  position: relative;
  display: grid;
  gap: clamp(1.6rem, 3vw, 3.2rem);
  overflow: hidden;
  border: 1px solid rgb(122 156 182 / 0.16);
  border-radius: 12px;
  background: #fdfaf4;
  padding: clamp(1.1rem, 2.4vw, 1.7rem);
  box-shadow:
    0 28px 64px rgb(47 58 74 / 0.075),
    0 3px 10px rgb(47 58 74 / 0.03),
    inset 0 1px 0 rgb(255 255 255 / 0.82);
  transition:
    transform 500ms ease,
    box-shadow 500ms ease,
    border-color 500ms ease;
}

.works-archive__panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 16% 18%, rgb(255 255 255 / 0.32), transparent 24%),
    linear-gradient(180deg, rgb(255 255 255 / 0.22), transparent 38%);
  opacity: 0.85;
  pointer-events: none;
}

.works-archive__panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.16), transparent 26%),
    radial-gradient(circle at 82% 80%, rgb(47 58 74 / 0.025), transparent 20%);
  opacity: 0.7;
  pointer-events: none;
}

.works-archive:hover .works-archive__panel {
  border-color: rgb(122 156 182 / 0.26);
  box-shadow:
    0 34px 72px rgb(47 58 74 / 0.09),
    0 6px 14px rgb(47 58 74 / 0.04),
    inset 0 1px 0 rgb(255 255 255 / 0.9);
  transform: translateY(-4px);
}

.works-archive__artboard,
.works-archive__meta {
  position: relative;
  z-index: 1;
}

.works-archive__artboard {
  padding: 0;
}

.works-archive__image-link {
  display: block;
  text-decoration: none;
}

.works-archive__image-shell {
  position: relative;
  aspect-ratio: 15 / 9;
  overflow: hidden;
  border-radius: 20px;
  background: #fefefe;
  box-shadow:
    26px 30px 56px rgb(47 58 74 / 0.16),
    0 12px 20px rgb(47 58 74 / 0.05),
    inset 0 1px 0 rgb(255 255 255 / 0.72);
}

.works-archive__image-shell::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgb(47 58 74 / 0.05);
  pointer-events: none;
}

.works-archive__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  opacity: 0.97;
  transition:
    transform 1.6s ease,
    opacity 500ms ease,
    filter 500ms ease;
}

.works-archive:hover .works-archive__image {
  transform: scale(1.05);
  opacity: 1;
  filter: saturate(1.03);
}

.works-archive__meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  padding: 0 0 0 0.25rem;
  text-align: left;
}

.works-archive__title {
  margin: 0;
  max-width: none;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.45rem, 4vw, 3.6rem);
  font-weight: 600;
  line-height: 0.94;
  letter-spacing: -0.05em;
  color: #2f3a4a;
}

.works-archive__title::after {
  content: '';
  display: block;
  width: 4.5rem;
  height: 1px;
  margin-top: 0.72rem;
  background: linear-gradient(90deg, rgb(47 58 74 / 0.4), transparent);
}

.works-archive__lead {
  margin: 0;
  max-width: 27ch;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.9;
  color: rgb(47 58 74 / 0.75);
  text-align: left;
}

.works-archive__specs {
  display: grid;
  gap: 0.75rem;
  padding-top: 0.35rem;
}

.works-archive__spec {
  display: grid;
  grid-template-columns: minmax(4.2rem, 4.8rem) 1fr;
  gap: 1rem;
  align-items: center;
}

.works-archive__label {
  font-family: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #2f3a4a;
  line-height: 1;
}

.works-archive__value {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.75;
  color: rgb(47 58 74 / 0.82);
}

.works-archive__stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.works-archive__stack-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid rgb(47 58 74 / 0.12);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.76);
  padding: 0.42rem 0.82rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1;
  color: rgb(47 58 74 / 0.84);
  box-shadow: 0 8px 20px rgb(47 58 74 / 0.04);
}

.works-archive__note {
  margin: 0;
  max-width: 27ch;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  line-height: 1.88;
  color: rgb(47 58 74 / 0.6);
  text-align: left;
}

.works-archive__link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  align-self: flex-start;
  margin-top: 0.25rem;
  text-decoration: none;
  color: #2f3a4a;
  transition:
    opacity 300ms ease,
    transform 300ms ease;
}

.works-archive__link:hover {
  opacity: 0.72;
  transform: translateX(1px);
}

.works-archive__link-text {
  font-family: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.works-archive__glyph {
  display: inline-flex;
  width: 1.25rem;
  height: 1.25rem;
  opacity: 1;
  transition:
    transform 300ms ease,
    opacity 300ms ease;
}

.works-archive__glyph svg {
  width: 100%;
  height: 100%;
}

.works-archive:hover .works-archive__glyph {
  opacity: 0.72;
  transform: translate(2px, -2px);
}

.works-canvas {
  --works-marquee-height: clamp(2rem, 3.2vw, 2.6rem);
  position: relative;
  margin-top: 12rem;
  display: grid;
  grid-template-rows: var(--works-marquee-height) minmax(0, 1fr) var(--works-marquee-height);
  width: 100vw;
  min-height: calc(100svh - 80px);
  min-height: calc(100dvh - 80px);
  max-width: none;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.works-canvas__marquee-slot {
  height: var(--works-marquee-height);
  --works-marquee-duration: 22s;
  position: relative;
  background: #fff;
  overflow: hidden;
}

.works-canvas__marquee-slot--slow {
  --works-marquee-duration: 26s;
}

.works-canvas__marquee-inner {
  position: relative;
  height: 100%;
  width: 100%;
}

.works-canvas__marquee-strip {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  min-width: max-content;
  height: 100%;
  align-items: center;
  flex-shrink: 0;
  will-change: transform;
}

.works-canvas__marquee-strip--primary {
  animation: works-canvas-marquee-primary var(--works-marquee-duration) linear infinite;
}

.works-canvas__marquee-strip--secondary {
  animation: works-canvas-marquee-secondary var(--works-marquee-duration) linear infinite;
}

.works-canvas__marquee-item {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding-right: clamp(1rem, 2.2vw, 1.9rem);
  font-family: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;
  font-size: clamp(0.72rem, 1vw, 0.84rem);
  font-weight: 500;
  letter-spacing: 0.26em;
  color: rgb(47 58 74 / 0.66);
}

@keyframes works-canvas-marquee-primary {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(calc(-100% + 1px), 0, 0);
  }
}

@keyframes works-canvas-marquee-secondary {
  from {
    transform: translate3d(calc(100% - 1px), 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

.works-canvas__frame {
  --works-cluster-gap-x: 120px;
  --works-cluster-gap-y: 80px;
  --works-card-gap: 95px;
  --works-card-width: 288px;
  --works-card-height: 400px;
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-height: calc(100svh - 80px - (var(--works-marquee-height) * 2));
  min-height: calc(100dvh - 80px - (var(--works-marquee-height) * 2));
  overflow: hidden;
  isolation: isolate;
  cursor: grab;
  touch-action: none;
  user-select: none;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: 0;
  background:
    linear-gradient(rgb(255 255 255 / 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 0.055) 1px, transparent 1px),
    #000;
  background-size:
    2rem 2rem,
    2rem 2rem,
    auto;
  background-position:
    -1px -1px,
    -1px -1px,
    0 0;
  padding-block: clamp(0rem, 0.2vw, 0.125rem);
  padding-inline: clamp(6.8rem, 13vw, 12rem);
  box-shadow:
    0 22px 48px rgb(0 0 0 / 0.22),
    inset 0 1px 0 rgb(255 255 255 / 0.08);
}

.works-canvas__frame--dragging {
  cursor: grabbing;
}

.works-canvas__frame::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background:
    linear-gradient(rgb(255 255 255 / 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 0.16) 1px, transparent 1px);
  background-size: 2rem 2rem;
  background-position: -1px -1px;
  pointer-events: none;
  -webkit-mask-image: radial-gradient(
    ellipse 74% 62% at 50% 50%,
    rgb(0 0 0 / 1) 0%,
    rgb(0 0 0 / 0.96) 28%,
    rgb(0 0 0 / 0.62) 66%,
    rgb(0 0 0 / 0.16) 86%,
    transparent 100%
  );
  mask-image: radial-gradient(
    ellipse 74% 62% at 50% 50%,
    rgb(0 0 0 / 1) 0%,
    rgb(0 0 0 / 0.96) 28%,
    rgb(0 0 0 / 0.62) 66%,
    rgb(0 0 0 / 0.16) 86%,
    transparent 100%
  );
}

.works-canvas__cluster {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 1600px;
  height: 1520px;
  will-change: transform;
}

.works-canvas__card-shell {
  position: absolute;
  width: var(--works-card-width);
  height: var(--works-card-height);
  transform-origin: center center;
}

.works-canvas__card-shell:hover {
  z-index: 2;
}

.works-canvas__card {
  width: var(--works-card-width);
  height: var(--works-card-height);
  min-height: var(--works-card-height);
  border-radius: 18px;
  padding: 1px;
  background: rgb(47 58 74 / 0.08);
  box-shadow: 0 10px 28px rgb(47 58 74 / 0.04);
  filter: drop-shadow(0 20px 30px rgb(0 0 0 / 0.2));
  transform: scale(var(--card-scale, 1));
  transform-origin: center center;
  will-change: transform, filter;
  transition:
    transform 280ms ease,
    filter 280ms ease,
    box-shadow 280ms ease,
    border-color 280ms ease;
}

.works-canvas__card:hover {
  transform: scale(calc(var(--card-scale, 1) + 0.015));
  filter: drop-shadow(0 24px 36px rgb(0 0 0 / 0.24));
  box-shadow: 0 16px 32px rgb(47 58 74 / 0.06);
}

.works-canvas__card-surface {
  display: grid;
  height: 100%;
  min-height: 0;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 0.78rem;
  overflow: hidden;
  border-radius: inherit;
  padding: 0.8rem 0.8rem 0.95rem;
  background: rgb(255 255 255 / 0.72);
}

.works-canvas__card-image-shell {
  min-height: 0;
  overflow: hidden;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.36);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.28),
    0 10px 20px rgb(47 58 74 / 0.08);
}

.works-canvas__card-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 520ms ease;
}

.works-canvas__card:hover .works-canvas__card-image {
  transform: scale(1.035);
}

.works-canvas__card-copy {
  display: flex;
  flex-direction: column;
  gap: 0.34rem;
  padding-inline: 0.08rem;
}

.works-canvas__card-meta {
  margin: 0;
  font-family: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgb(47 58 74 / 0.45);
}

.works-canvas__card-title {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.56rem, 2vw, 1.92rem);
  font-weight: 600;
  line-height: 0.94;
  letter-spacing: -0.03em;
  color: #2f3a4a;
}

.works-canvas__card--blue .works-canvas__card-surface {
  background: linear-gradient(180deg, rgb(244 249 252 / 0.96), rgb(233 242 248 / 0.82));
}

.works-canvas__card--sand .works-canvas__card-surface {
  background: linear-gradient(180deg, rgb(251 247 239 / 0.96), rgb(244 235 220 / 0.84));
}

.works-canvas__card--green .works-canvas__card-surface {
  background: linear-gradient(180deg, rgb(243 250 246 / 0.96), rgb(230 241 234 / 0.84));
}

.works-canvas__card--slate .works-canvas__card-surface {
  background: linear-gradient(180deg, rgb(246 247 249 / 0.96), rgb(234 237 241 / 0.84));
}

@media (min-width: 900px) {
  .works-archive__panel {
    grid-template-columns: minmax(0, 1.24fr) minmax(18rem, 0.76fr);
    align-items: start;
    min-height: calc(35rem - 60px);
    padding: clamp(1.25rem, 2.5vw, 1.8rem);
  }

  .works-archive__meta {
    align-self: stretch;
    padding-top: 0;
    padding-left: clamp(0.75rem, 1.8vw, 1.6rem);
  }

  .works-archive__title {
    max-width: 14ch;
  }
}
</style>
