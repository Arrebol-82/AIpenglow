<script setup lang="ts">
import { gsap } from "gsap";

const navLinks = [
  { id: "home", label: "首页", href: "#" },
  { id: "about", label: "我", href: "#about" },
  { id: "soul", label: "关于", href: "#soul" },
  { id: "works-gallery", label: "作品", href: "#works-gallery" },
  { id: "now", label: "方向", href: "#now" },
] as const;

const activeSection = ref("home");
const hasScrolledPastHome = ref(false);
const isColorSwitchComplete = ref(false);
const isNavbarVisible = ref(true);

const headerRef = ref<HTMLElement | null>(null);
const capsuleRef = ref<HTMLElement | null>(null);
const brandRef = ref<HTMLElement | null>(null);
const linksRef = ref<HTMLElement | null>(null);

const heroIntroComplete = useState("hero-intro-complete", () => false);
const navbarIntroComplete = useState("navbar-intro-complete", () => false);
const navOnDark = useState<boolean>("navbar-on-dark", () => false);

let lastScrollY = 0;
let navbarIntroTween: gsap.core.Tween | null = null;
let capsuleTween: gsap.core.Tween | null = null;
let colorSwitchCompleteTimer: ReturnType<typeof setTimeout> | null = null;
let homeEdgeTrigger: import("gsap/ScrollTrigger").ScrollTrigger | null = null;

const { playAnchorTransition } = usePageTransition();

const getCapsuleTargetWidth = () => {
  if (!brandRef.value || !linksRef.value) {
    return "min(720px, calc(100vw - 6rem))";
  }

  const brandWidth = brandRef.value.offsetWidth;
  const linksWidth = linksRef.value.offsetWidth;

  // 20px 是 AIpenglow 和导航项之间的距离
  // 40px 是左右 padding：1.25rem + 1.25rem
  const targetWidth = brandWidth + linksWidth + 21 + 40;

  return `${Math.ceil(targetWidth)}px`;
};

const animateNavbarCapsule = () => {
  if (!capsuleRef.value) return;

  capsuleTween?.kill();

  const isCapsule = hasScrolledPastHome.value || navOnDark.value;
  const isDark = navOnDark.value;

  if (!isCapsule) {
    capsuleTween = gsap.to(capsuleRef.value, {
      width: "100%",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: "14px",
      backgroundColor: "rgba(255, 255, 255, 0)",
      borderColor: "rgba(29, 30, 24, 0)",
      boxShadow: "0 0 0 rgba(29, 30, 24, 0)",
      duration: 0.58,
      ease: "power3.out",
    });

    return;
  }

  capsuleTween = gsap.to(capsuleRef.value, {
    width: getCapsuleTargetWidth(),
    paddingTop: "0.55rem",
    paddingBottom: "0.55rem",
    paddingLeft: "1.25rem",
    paddingRight: "1.25rem",
    borderRadius: "14px",
    backgroundColor: isDark
      ? "rgba(0, 0, 0, 0.92)"
      : "rgba(255, 252, 247, 0.94)",
    borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(29, 30, 24, 0.08)",
    boxShadow: isDark
      ? "0 18px 45px rgba(0, 0, 0, 0.4)"
      : "0 12px 32px rgba(29, 30, 24, 0.075)",
    duration: 0.72,
    ease: "expo.out",
  });
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

    if (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;

      if (scrollPosition >= sectionTop) {
        currentSection = link.id;
      }
    }
  }

  activeSection.value =
    currentSection || window.location.hash.replace("#", "") || "home";
};

const handleLinkClick = (
  link: (typeof navLinks)[number],
  event: MouseEvent,
) => {
  event.preventDefault();
  activeSection.value = link.id;
  playAnchorTransition(link.href);
};

const handleResize = () => {
  syncActiveSection();
  animateNavbarCapsule();
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

  await nextTick();

  gsap.set(capsuleRef.value, {
    width: "100%",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    borderRadius: "14px",
    backgroundColor: "rgba(255, 252, 247, 0)",
    borderColor: "rgba(29, 30, 24, 0)",
    boxShadow: "0 0 0 rgba(29, 30, 24, 0)",
  });

  animateNavbarCapsule();

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

  capsuleTween?.kill();
  capsuleTween = null;

  homeEdgeTrigger?.kill();
  homeEdgeTrigger = null;

  if (colorSwitchCompleteTimer) {
    clearTimeout(colorSwitchCompleteTimer);
    colorSwitchCompleteTimer = null;
  }
});

watch(hasScrolledPastHome, async (isPastHome) => {
  if (colorSwitchCompleteTimer) {
    clearTimeout(colorSwitchCompleteTimer);
    colorSwitchCompleteTimer = null;
  }

  if (!isPastHome) {
    isColorSwitchComplete.value = false;
    isNavbarVisible.value = true;

    await nextTick();
    animateNavbarCapsule();

    return;
  }

  isNavbarVisible.value = true;

  colorSwitchCompleteTimer = setTimeout(() => {
    isColorSwitchComplete.value = true;
    colorSwitchCompleteTimer = null;
  }, 360);

  await nextTick();
  animateNavbarCapsule();
});

watch(navOnDark, async () => {
  await nextTick();
  animateNavbarCapsule();
});

watch(heroIntroComplete, async (isComplete) => {
  if (!isComplete) {
    navbarIntroComplete.value = false;
    return;
  }

  await nextTick();

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
    <nav class="navbar-shell">
      <div ref="capsuleRef" class="navbar-capsule">
        <div
          ref="brandRef"
          class="site-brand font-headline text-[1.52rem] font-bold tracking-[-0.035em] md:text-[1.65rem]"
        >
          AIpenglow
        </div>

        <span class="navbar-divider" aria-hidden="true"></span>

        <div
          ref="linksRef"
          class="nav-links hidden items-center gap-7 md:flex lg:gap-8"
        >
          <a
            v-for="link in navLinks"
            :key="link.id"
            :class="[
              'nav-link font-chinese text-[15.5px] font-medium tracking-[0.18em] md:text-[16px]',
              activeSection === link.id
                ? 'nav-link--active'
                : 'nav-link--normal',
            ]"
            :href="link.href"
            @click="handleLinkClick(link, $event)"
          >
            <span class="nav-link__mask">
              <span class="nav-link__text nav-link__text--default">
                {{ link.label }}
              </span>

              <span
                class="nav-link__text nav-link__text--hover"
                aria-hidden="true"
              >
                {{ link.label }}
              </span>
            </span>
          </a>
        </div>

        <div class="md:hidden">
          <span
            class="material-symbols-outlined cursor-pointer text-on-background"
          >
            menu
          </span>
        </div>
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
  overflow: visible;
  background-color: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: 1px solid transparent;
  transform: translateY(0);
  transition:
    transform 180ms ease-out,
    border-color 220ms ease;
}

.site-header::before {
  content: none;
}

.site-header--hidden {
  transform: translateY(calc(-100% - 12px));
}

.navbar-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0.625rem 1.5rem;
}

.navbar-capsule {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  width: 100%;
  margin-inline: auto;

  padding: 0;
  border: 1px solid transparent;
  border-radius: 14px;

  background: transparent;
  box-shadow: none;

  will-change:
    width, padding, background-color, border-color, box-shadow, border-radius;
}

.navbar-past-home {
  border-bottom-color: transparent;
}

.site-brand {
  flex-shrink: 0;
  color: rgb(248 246 241 / 0.96);
  text-shadow: 0 1px 10px rgb(21 30 40 / 0.18);
  transition:
    color 220ms ease,
    text-shadow 220ms ease;
}

.navbar-divider {
  display: none;
  width: 1px;
  height: 1.1rem;
  flex-shrink: 0;
  background: rgba(29, 30, 24, 0.14);
}

.navbar-past-home .navbar-divider {
  display: block;
}

.navbar-on-dark .navbar-divider {
  display: block;
  background: rgba(255, 255, 255, 0.18);
}

.navbar-past-home .site-brand {
  color: rgb(29 30 24 / 0.96);
  text-shadow: none;
}

.nav-links {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.nav-link {
  position: relative;
  display: inline-flex;
  padding: 0 0.1rem 0.32rem;
  line-height: 1.25;
  text-decoration: none;
  overflow: hidden;
}

.nav-link__mask {
  position: relative;
  display: block;
  overflow: hidden;
  line-height: 1.25;
}

.nav-link__text {
  display: block;
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.nav-link__text--default {
  transform: translateY(0);
}

.nav-link__text--hover {
  position: absolute;
  left: 0;
  top: 0;
  transform: translateY(-115%);
}

.nav-link:hover .nav-link__text--default,
.nav-link:focus-visible .nav-link__text--default {
  transform: translateY(115%);
}

.nav-link:hover .nav-link__text--hover,
.nav-link:focus-visible .nav-link__text--hover {
  transform: translateY(0);
}

.site-header:not(.navbar-past-home) .nav-link--normal {
  color: rgb(232 221 208 / 0.84);
  text-shadow: 0 1px 10px rgb(21 30 40 / 0.18);
}

.site-header:not(.navbar-past-home) .nav-link--active {
  color: rgb(232 221 208 / 0.84);
  text-shadow: 0 1px 10px rgb(21 30 40 / 0.18);
}

.navbar-past-home .nav-link--normal {
  color: rgb(29 30 24 / 0.68);
  text-shadow: none;
}

.navbar-past-home .nav-link--active {
  color: rgb(29 30 24 / 0.96);
  text-shadow: none;
}

.nav-link--active {
  font-weight: 600;
}

.site-header:not(.navbar-past-home) .material-symbols-outlined {
  color: rgb(248 246 241 / 0.92);
  text-shadow: 0 1px 10px rgb(21 30 40 / 0.18);
}

.navbar-on-dark .site-brand {
  color: #fff;
  text-shadow: none;
}

.navbar-on-dark .nav-link--normal {
  color: rgb(255 255 255 / 0.82);
  text-shadow: none;
}

.navbar-on-dark .nav-link--active {
  color: #fff;
  text-shadow: none;
}

.navbar-on-dark .material-symbols-outlined {
  color: #fff;
  text-shadow: none;
}

@media (min-width: 768px) {
  .navbar-shell {
    padding-inline: 3rem;
  }
}

@media (min-width: 1280px) {
  .navbar-shell {
    padding-inline: 60px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-link__text {
    transition: none;
  }

  .nav-link:hover .nav-link__text--default,
  .nav-link:focus-visible .nav-link__text--default,
  .nav-link:hover .nav-link__text--hover,
  .nav-link:focus-visible .nav-link__text--hover {
    transform: translateY(0);
  }

  .nav-link__text--hover {
    display: none;
  }
}
</style>
