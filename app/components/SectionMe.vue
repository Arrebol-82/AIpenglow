<template>
  <section ref="sectionRef" class="section-divider section-divider--near">
    <div id="about" class="mb-24 scroll-mt-32 md:mb-[14rem]">
      <h2 class="section-kicker mb-16 text-accent md:mb-[9rem]">
        关于我
      </h2>
      <div class="space-y-10 md:space-y-12">
        <div class="section-me-heading">
          <h3 class="section-title max-w-none font-chinese leading-[1.32] md:leading-[1.38] text-[#2F3A4A]">
            我想在漫长的
            <span class="keyword growth">成长</span>
            里，
            慢慢看清
            <span class="keyword self-1">自己</span>
            ，
            也慢慢成为
            <span class="keyword self-2">自己</span>
            。
          </h3>
        </div>
        <div class="section-me-copy-grid !mt-[88px] grid grid-cols-1 items-start gap-[72px] md:!mt-[96px] md:grid-cols-2 md:gap-[120px]">
          <div class="copy-column copy-column--left description-container description-container--left">
            <p class="description-text description-text--emphasis">
              我是一个挺复杂的人。因为我其实并不了解自己。我不知道自己真正热爱什么，却总会逼着自己往前走，所以也常常被情绪和环境拉住。我不是那种稳定、清晰的人，常常会分心、迟疑，也会自我怀疑。直到现在，我还在学着和自己相处，也还在慢慢弄清楚，我到底想成为什么样的人。
            </p>
          </div>
          <div class="copy-column copy-column--right description-container description-container--right">
            <p class="description-text description-text--secondary">
              这个网站对我来说，不只是一个展示页，而是一个真正属于我自己的空间。我想把它打造成我喜欢的样子，既有让我着迷的视觉和交互，也能慢慢装下我的想法、作品和成长的痕迹。在这个快餐式的时代里，我更想守住自己的内心，也想借这个网站，让别人更了解我，也让我更了解我自己。
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const target = sectionRef.value

  if (!target) {
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) {
        return
      }

      target.classList.add('is-active')
      observer?.disconnect()
      observer = null
    },
    {
      threshold: 0.35,
      rootMargin: '0px 0px -10% 0px',
    },
  )

  observer.observe(target)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.keyword {
  display: inline-block;
  position: relative;
  transform: translateY(0) scale(1);
  margin-inline: -0.08em;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-size: 200% 100%;
  background-position: 100% 0;
  filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
  transition:
    background-position 1.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    filter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.growth {
  background-image: linear-gradient(90deg, #1d8348 0%, #56c596 50%, #2f3a4a 51%, #2f3a4a 100%);
}

.self-1 {
  background-image: linear-gradient(90deg, #56c596 0%, #4fa6ce 50%, #2f3a4a 51%, #2f3a4a 100%);
}

.self-2 {
  background-image: linear-gradient(90deg, #85c1e9 0%, #2f3a4a 50%, #2f3a4a 51%, #2f3a4a 100%);
}

.is-active .growth {
  background-position: 0 0;
  transition-delay: 0.5s;
}

.is-active .self-1 {
  background-position: 0 0;
  transition-delay: 1.7s;
}

.is-active .self-2 {
  background-position: 0 0;
  transition-delay: 2.9s;
}

.section-me-heading:hover .keyword {
  transform: translateY(-2px) scale(1.08);
}

.section-me-heading:hover .growth {
  filter: drop-shadow(0 6px 14px rgba(86, 197, 150, 0.3));
}

.section-me-heading:hover .self-1 {
  filter: drop-shadow(0 6px 14px rgba(79, 166, 206, 0.28));
}

.section-me-heading:hover .self-2 {
  filter: drop-shadow(0 6px 14px rgba(133, 193, 233, 0.26));
}

.copy-column {
  width: 100%;
}

.copy-column--left {
  max-width: 42rem;
}

.copy-column--right {
  max-width: 34rem;
  padding-left: 1.25rem;
  border-left: 1px solid rgba(47, 58, 74, 0.14);
}

.description-container {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.description-container .description-text {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.description-container--left {
  opacity: 0.8;
}

.description-container--right {
  opacity: 0.6;
}

.section-me-copy-grid:has(.description-container:hover) .description-container:not(:hover) {
  opacity: 0.3;
}

.section-me-copy-grid:has(.description-container:hover) .description-container:hover {
  opacity: 1;
}

.section-me-copy-grid:has(.description-container:hover) .description-container:hover .description-text {
  letter-spacing: 0.02em;
}

.description-text {
  font-family: Inter, 'PingFang SC', -apple-system, sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 2;
  letter-spacing: 0.03em;
  color: #2f3a4a;
  text-align: justify;
}

.description-text--emphasis {
  font-size: 20px;
  font-weight: 600;
}

.description-text--secondary {
  font-size: 18px;
  line-height: 2.2;
  letter-spacing: 0.05em;
}

@media (min-width: 768px) {
  .section-me-copy-grid {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  }

  .copy-column--right {
    margin-top: 4rem;
    padding-left: 2rem;
  }
}

@media (max-width: 767px) {
  .copy-column--right {
    padding-left: 0.9rem;
  }

  .section-me-copy-grid:has(.description-container:hover) .description-container:not(:hover),
  .section-me-copy-grid:has(.description-container:hover) .description-container:hover {
    opacity: unset;
  }
}
</style>
