<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";

const currentTimeLabel = ref("--:-- GMT+8");

const footerNavLinks = [
  { id: "home", label: "首页", href: "#" },
  { id: "about", label: "我", href: "#about" },
  { id: "soul", label: "关于", href: "#soul" },
  { id: "works-gallery", label: "作品", href: "#works-gallery" },
] as const;

const frontQuoteLines = [
  "我听过一个关于小鱼的故事。",
  "他游到大鱼跟前说：“ 我正努力寻找他们口中的大海。”",
  "大鱼说：“大海？你现在就在海里。” ",
  "“这里？”小鱼说，“这里是水，我要找的是大海。”",
];

const backQuoteLines = [
  "你从哪里来的这些想法？",
  "火花可不是灵魂的目标。",
  "你们这些导师，还有你们所谓的激情、你们所谓的人生目标、你们所谓的人生意义……",
  "太低级了。",
];

const footerTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Shanghai",
});

const { playAnchorTransition } = usePageTransition();

const quoteRevealRef = ref<HTMLElement | null>(null);
const frontQuoteRef = ref<HTMLElement | null>(null);
const backQuoteRef = ref<HTMLElement | null>(null);

let footerTimeTimer: ReturnType<typeof setInterval> | null = null;
let quoteTl: gsap.core.Timeline | null = null;

const handleAnchorClick = (
  event: MouseEvent,
  link: (typeof footerNavLinks)[number],
) => {
  event.preventDefault();
  playAnchorTransition(link.href);
};

const updateFooterTime = () => {
  currentTimeLabel.value = `${footerTimeFormatter.format(new Date())} GMT+8`;
};

const playQuoteReveal = () => {
  quoteTl?.play();
};

const reverseQuoteReveal = () => {
  quoteTl?.reverse();
};

onMounted(() => {
  updateFooterTime();
  footerTimeTimer = setInterval(updateFooterTime, 1000);

  if (!quoteRevealRef.value || !frontQuoteRef.value || !backQuoteRef.value) {
    return;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const frontLines = Array.from(
    frontQuoteRef.value.querySelectorAll<HTMLElement>(".quote-line"),
  );
  const backLines = Array.from(
    backQuoteRef.value.querySelectorAll<HTMLElement>(".quote-line"),
  );

  gsap.set([frontQuoteRef.value, backQuoteRef.value], { opacity: 1 });
  gsap.set(frontLines, { opacity: 1, y: 0 });
  gsap.set(backLines, { opacity: 0, y: 18 });

  if (reduceMotion) return;

  quoteTl = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out" },
  });

  quoteTl
    .to(
      frontLines,
      {
        opacity: 0,
        y: -14,
        duration: 0.42,
        stagger: 0.055,
      },
      0,
    )
    .to(frontQuoteRef.value, { opacity: 0.35, duration: 0.45 }, 0.05)
    .to(
      backLines,
      {
        opacity: 1,
        y: 0,
        duration: 0.56,
        stagger: 0.065,
      },
      0.18,
    );
});

onBeforeUnmount(() => {
  if (footerTimeTimer) {
    clearInterval(footerTimeTimer);
    footerTimeTimer = null;
  }

  quoteTl?.kill();
  quoteTl = null;
});
</script>

<template>
  <footer
    class="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#f7f1e7] px-[0.75rem] pt-8 pb-[0.125rem] text-[#1D1E18] md:px-[1.75rem] md:pt-12 md:pb-[1.125rem] lg:px-[3.75rem] lg:pt-16 lg:pb-[2.125rem]"
  >
    <div
      class="pointer-events-none absolute inset-0 z-0 flex items-start justify-center overflow-hidden pt-[2vh] select-none md:pt-[1vh]"
    >
      <h1
        class="font-serif text-[18vw] leading-none font-bold tracking-tight whitespace-nowrap text-[#1D1E18] opacity-[0.04] md:text-[23vw]"
      >
        AIpenglow
      </h1>
    </div>

    <div
      class="relative z-10 mt-12 flex flex-1 translate-y-[10rem] items-center justify-center md:mt-0 md:translate-y-[11rem]"
    >
      <div
        ref="quoteRevealRef"
        class="footer-quote-reveal"
        aria-label="Footer quote reveal"
        tabindex="0"
        @pointerenter="playQuoteReveal"
        @pointerleave="reverseQuoteReveal"
        @focusin="playQuoteReveal"
        @focusout="reverseQuoteReveal"
      >
        <p ref="frontQuoteRef" class="footer-quote footer-quote--front">
          <span v-for="line in frontQuoteLines" :key="line" class="quote-line">
            {{ line }}
          </span>
        </p>

        <p ref="backQuoteRef" class="footer-quote footer-quote--back">
          <span v-for="line in backQuoteLines" :key="line" class="quote-line">
            {{ line }}
          </span>
        </p>
      </div>
    </div>

    <div
      class="relative z-10 mt-24 flex w-full items-end justify-between md:mt-0"
    >
      <nav class="flex flex-col gap-3 pb-2">
        <a
          v-for="link in footerNavLinks"
          :key="link.id"
          :href="link.href"
          class="nav-link"
          @click="handleAnchorClick($event, link)"
        >
          {{ link.label }}
        </a>
      </nav>

      <div
        class="flex translate-x-[1.25rem] flex-col items-end gap-6 md:translate-x-[1.5rem]"
      >
        <div class="group relative h-32 w-32 cursor-pointer md:h-40 md:w-40">
          <div
            class="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <img
              src="/images/AIpenglow.svg"
              alt="Alpenglow Badge"
              class="footer-badge-spin block h-[13.125rem] w-[13.125rem] opacity-90 transition-opacity group-hover:opacity-100 md:h-[15rem] md:w-[15rem]"
            />
          </div>

          <div class="absolute inset-0 flex items-center justify-center">
            <img
              src="/images/role.svg"
              alt="Role Avatar"
              class="block h-[5.25rem] w-[5.25rem] rounded-full object-cover md:h-[6.25rem] md:w-[6.25rem]"
            />
          </div>
        </div>

        <div
          class="pr-1 font-mono text-[10px] font-bold tracking-[0.15em] text-[#1D1E18]/80 uppercase md:text-xs"
        >
          {{ currentTimeLabel }}
        </div>
      </div>
    </div>

    <div
      class="relative z-10 mt-2 flex w-full justify-center pb-2 md:pb-0 md:mt-[10px]"
    >
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-stone-500 hover:underline"
      >
        粤ICP备2026039863号
      </a>
    </div>
  </footer>
</template>

<style scoped>
.font-serif {
  font-family: "Cormorant Garamond", "Noto Serif SC", "Songti SC", serif;
}

.nav-link {
  position: relative;
  width: fit-content;
  padding-bottom: 3px;
  font-family:
    "Noto Serif SC", "Source Han Serif SC", "Songti SC", "SimSun", serif;
  font-size: clamp(0.9rem, 1.1vw, 1rem);
  font-weight: 500;
  letter-spacing: 0.18em;
  text-decoration: none;
  color: rgba(29, 30, 24, 0.72);
  transition:
    color 280ms ease,
    letter-spacing 280ms ease,
    transform 280ms ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(29, 30, 24, 0.86);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 280ms ease;
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

.footer-quote-reveal {
  position: relative;
  display: grid;
  place-items: center;
  width: min(54ch, calc(100vw - 2rem));
  min-height: 12rem;
  padding: 1rem;
  cursor: default;
  outline: none;
}

.footer-quote-reveal:focus-visible {
  outline: 1px solid rgba(29, 30, 24, 0.28);
  outline-offset: 0.75rem;
  border-radius: 1rem;
}

.footer-quote {
  grid-area: 1 / 1;
  max-width: 54ch;
  text-align: center;
  font-family: "Cormorant Garamond", "Noto Serif SC", "Songti SC", serif;
  font-size: 1rem;
  line-height: 1.72;
  color: rgba(29, 30, 24, 0.9);
  pointer-events: none;
}

.footer-quote--front {
  position: relative;
  z-index: 2;
}

.footer-quote--back {
  position: relative;
  z-index: 3;
  color: rgba(29, 30, 24, 0.88);
}

.quote-line {
  display: block;
  will-change: transform, opacity;
}

@media (min-width: 768px) {
  .footer-quote {
    font-size: 1.125rem;
    line-height: 1.76;
  }

  .footer-quote-reveal {
    min-height: 12.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-badge-spin {
    animation: none;
  }
}
</style>
