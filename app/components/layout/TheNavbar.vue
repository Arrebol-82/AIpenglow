<script setup lang="ts">
import { gsap } from "gsap";
import type { ComponentPublicInstance } from "vue";

const navLinks = [
  { id: "home", label: "首页", href: "#" },
  { id: "about", label: "我", href: "#about" },
  { id: "works-gallery", label: "作品", href: "#works-gallery" },
  { id: "now", label: "方向", href: "#now" },
] as const;

const activeSection = ref("home");
const hasScrolledPastHome = ref(false);
const isColorSwitchComplete = ref(false);
const isNavbarVisible = ref(true);
const hoveredSection = ref("");
const headerRef = ref<HTMLElement | null>(null);
const heroIntroComplete = useState("hero-intro-complete", () => false);
const navbarIntroComplete = useState("navbar-intro-complete", () => false);
const navOnDark = useState<boolean>("navbar-on-dark", () => false);
const indicatorStyle = ref({
  opacity: "0",
  transform: "translateX(0)",
  width: "0px",
});
const navLinkRefs = new Map<string, HTMLAnchorElement>();
let lastScrollY = 0;
let navbarIntroTween: gsap.core.Tween | null = null;
let colorSwitchCompleteTimer: ReturnType<typeof setTimeout> | null = null;
let homeEdgeTrigger: import("gsap/ScrollTrigger").ScrollTrigger | null = null;

const smoothScrollTo = useSmoothAnchor();

const setNavLinkRef = (
  id: string,
  el: Element | ComponentPublicInstance | null,
) => {
  if (el instanceof HTMLAnchorElement) {
    navLinkRefs.set(id, el);
    return;
  }

  navLinkRefs.delete(id);
};

const updateIndicator = () => {
  const currentId = hoveredSection.value || activeSection.value;
  const currentLink = navLinkRefs.get(currentId);

  if (!currentLink) {
    indicatorStyle.value = {
      opacity: "0",
      transform: "translateX(0)",
      width: "0px",
    };
    return;
  }

  const indicatorWidth = Math.max(currentLink.offsetWidth - 18, 18);
  const indicatorOffset =
    currentLink.offsetLeft + (currentLink.offsetWidth - indicatorWidth) / 2;

  indicatorStyle.value = {
    opacity: "1",
    transform: `translateX(${indicatorOffset}px)`,
    width: `${indicatorWidth}px`,
  };
};

const syncActiveSection = () => {
  const currentScrollY = window.scrollY;
  const scrollDelta = currentScrollY - lastScrollY;

  if (!isColorSwitchComplete.value) {
    isNavbarVisible.value = true;
  } else if (scrollDelta > 1) {
    isNavbarVisible.value = false;
  } else if (scrollDelta < -1) {
    isNavbarVisible.value = true;
  }

  lastScrollY = currentScrollY;

  if (currentScrollY < 120) {
    activeSection.value = "home";
    return;
  }

  const scrollPosition = currentScrollY + 160;
  let currentSection = "home";

  for (const link of navLinks) {
    if (link.id === "home") {
      continue;
    }

    const section = document.getElementById(link.id);

    if (section && scrollPosition >= section.offsetTop) {
      currentSection = link.id;
    }
  }

  activeSection.value =
    currentSection || window.location.hash.replace("#", "") || "home";
};

const handleLinkClick = (link: (typeof navLinks)[number], event: MouseEvent) => {
  event.preventDefault();
  activeSection.value = link.id;
  smoothScrollTo(link.href);
};

const handleLinkHover = (id: string) => {
  hoveredSection.value = id;
};

const handleNavLeave = () => {
  hoveredSection.value = "";
};

const handleResize = () => {
  syncActiveSection();
  updateIndicator();
};

onMounted(async () => {
  lastScrollY = window.scrollY;
  navbarIntroComplete.value = false;
  syncActiveSection();

  if (headerRef.value && !heroIntroComplete.value) {
    gsap.set(headerRef.value, {
      y: -24,
      autoAlpha: 0,
    });
  }

  window.addEventListener("scroll", syncActiveSection, { passive: true });
  window.addEventListener("hashchange", syncActiveSection);
  window.addEventListener("resize", handleResize);

  if (heroIntroComplete.value) {
    nextTick(updateIndicator);
  }

  await nextTick();
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  const transitionEl = document.querySelector<HTMLElement>(".paper-transition");
  if (transitionEl) {
    homeEdgeTrigger = ScrollTrigger.create({
      trigger: transitionEl,
      start: "center top",
      onEnter: () => {
        hasScrolledPastHome.value = true;
      },
      onLeaveBack: () => {
        hasScrolledPastHome.value = false;
      },
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", syncActiveSection);
  window.removeEventListener("hashchange", syncActiveSection);
  window.removeEventListener("resize", handleResize);
  navbarIntroTween?.kill();
  navbarIntroTween = null;
  homeEdgeTrigger?.kill();
  homeEdgeTrigger = null;
  if (colorSwitchCompleteTimer) {
    clearTimeout(colorSwitchCompleteTimer);
    colorSwitchCompleteTimer = null;
  }
});

watch([activeSection, hoveredSection], async () => {
  await nextTick();
  updateIndicator();
});

watch(hasScrolledPastHome, (isPastHome) => {
  if (colorSwitchCompleteTimer) {
    clearTimeout(colorSwitchCompleteTimer);
    colorSwitchCompleteTimer = null;
  }

  if (!isPastHome) {
    isColorSwitchComplete.value = false;
    isNavbarVisible.value = true;
    return;
  }

  isNavbarVisible.value = true;
  colorSwitchCompleteTimer = setTimeout(() => {
    isColorSwitchComplete.value = true;
    colorSwitchCompleteTimer = null;
  }, 360);
});

watch(heroIntroComplete, async (isComplete) => {
  if (!isComplete) {
    navbarIntroComplete.value = false;
    return;
  }

  await nextTick();
  updateIndicator();

  if (!headerRef.value) {
    return;
  }

  navbarIntroTween?.kill();
  gsap.set(headerRef.value, {
    y: -24,
    autoAlpha: 0,
  });

  navbarIntroTween = gsap.to(headerRef.value, {
    y: 0,
    autoAlpha: 1,
    duration: 0.72,
    ease: "power3.out",
    clearProps: "transform,opacity,visibility",
    onComplete: () => {
      navbarIntroComplete.value = true;
    },
  });
});
</script>

<template>
  <header
    ref="headerRef"
    :class="[
      'site-header fixed top-0 z-50 w-full',
      {
        'navbar-past-home': hasScrolledPastHome,
        'navbar-on-dark': navOnDark,
        'site-header--hidden': !isNavbarVisible,
      },
    ]"
  >
    <nav
      class="flex w-full items-center justify-between px-6 py-2.5 md:px-12 xl:px-[60px]"
    >
      <div
        class="site-brand font-headline text-[1.35rem] font-semibold tracking-[-0.04em]"
      >
        Alpenglow
      </div>
      <div
        class="nav-links hidden items-center gap-7 md:flex lg:gap-8"
        @mouseleave="handleNavLeave"
      >
        <a
          v-for="link in navLinks"
          :key="link.id"
          :ref="(el) => setNavLinkRef(link.id, el)"
          :class="[
            'nav-link font-chinese text-[15px] font-medium tracking-[0.18em] transition-colors duration-300',
            activeSection === link.id
              ? 'nav-link--active'
              : 'text-on-background/75 hover:text-primary',
          ]"
          :href="link.href"
          @click="handleLinkClick(link, $event)"
          @mouseenter="handleLinkHover(link.id)"
          @focus="handleLinkHover(link.id)"
        >
          {{ link.label }}
        </a>
        <span class="nav-indicator" :style="indicatorStyle"></span>
      </div>
      <div class="md:hidden">
        <span
          class="material-symbols-outlined cursor-pointer text-on-background"
          >menu</span
        >
      </div>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: 1px solid transparent;
  transform: translateY(0);
  transition:
    transform 180ms ease-out,
    box-shadow 220ms ease,
    border-color 220ms ease;
  overflow: hidden;
}

.site-header::before {
  content: "";
  position: absolute;
  inset: 0;
  height: 100%;
  background-color: rgb(var(--background-rgb, 246 241 233) / 1);
  clip-path: inset(100% 0 0 0);
  transition: clip-path 360ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: clip-path;
  z-index: 0;
}

.site-header--hidden {
  transform: translateY(calc(-100% - 12px));
}

.navbar-past-home {
  border-bottom-color: rgb(216 206 192 / 0.28);
  box-shadow: 0 12px 28px rgb(47 58 74 / 0.06);
}

.navbar-past-home::before {
  clip-path: inset(0 0 0 0);
}

.nav-links {
  position: relative;
  z-index: 1;
}

.nav-link {
  position: relative;
  padding: 0 0.1rem 0.32rem;
}

.site-header:not(.navbar-past-home) .nav-link {
  color: rgb(232 221 208 / 0.84);
  text-shadow: 0 1px 10px rgb(21 30 40 / 0.18);
}

.site-header:not(.navbar-past-home) .nav-link:hover {
  color: rgb(var(--soft-primary-rgb) / 0.96);
}

.site-header:not(.navbar-past-home) .nav-link--active {
  color: rgb(var(--soft-primary-rgb) / 0.9);
}

.site-header:not(.navbar-past-home) .material-symbols-outlined {
  color: rgb(248 246 241 / 0.92);
  text-shadow: 0 1px 10px rgb(21 30 40 / 0.18);
}

nav {
  position: relative;
  z-index: 1;
}

.site-brand {
  color: rgb(248 246 241 / 0.96);
  text-shadow: 0 1px 10px rgb(21 30 40 / 0.18);
  transition:
    color 220ms ease,
    text-shadow 220ms ease;
}

.navbar-past-home .site-brand {
  color: rgb(var(--soft-primary-rgb) / 0.98);
  text-shadow: none;
}

.nav-link--active {
  color: rgb(var(--soft-primary-rgb) / 0.9);
  font-weight: 600;
}

.nav-indicator {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1px;
  background: rgb(var(--soft-primary-rgb) / 0.9);
  pointer-events: none;
  border-radius: 999px;
  transition:
    transform 320ms ease,
    width 320ms ease,
    opacity 320ms ease;
}

.navbar-on-dark::before {
  background-color: #000;
  clip-path: inset(0 0 0 0);
  transition:
    clip-path 360ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 360ms ease;
}

.navbar-on-dark {
  border-bottom-color: rgb(255 255 255 / 0.08);
  box-shadow: 0 12px 28px rgb(0 0 0 / 0.4);
}

.navbar-on-dark .site-brand {
  color: rgb(248 246 241 / 0.96);
  text-shadow: none;
}

.navbar-on-dark .nav-link {
  color: rgb(232 221 208 / 0.78);
  text-shadow: none;
}

.navbar-on-dark .nav-link:hover {
  color: #fff;
}

.navbar-on-dark .nav-link--active {
  color: #fff;
}

.navbar-on-dark .nav-indicator {
  background: #fff;
}

.navbar-on-dark .material-symbols-outlined {
  color: rgb(248 246 241 / 0.92);
  text-shadow: none;
}
</style>
