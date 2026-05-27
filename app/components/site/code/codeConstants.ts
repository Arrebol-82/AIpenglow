// ---------------------------------------------------------------------------
// Scroll-triggered entrance animation parameters
// ---------------------------------------------------------------------------

export const TITLE_ANIM = {
  y: 30,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
} as const;

export const TITLE_SCROLL_TRIGGER = {
  trigger: "#reflections",
  start: "top 80%",
  once: true,
} as const;

export const TAGS_ANIM = {
  scale: 0.8,
  opacity: 0,
  y: 20,
  duration: 0.6,
  stagger: 0.05,
  ease: "back.out(1.5)",
} as const;

export const TAGS_SCROLL_TRIGGER_START = "top 85%" as const;

export const GITHUB_CARD_ANIM = {
  y: 40,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out",
} as const;

export const GITHUB_CARD_SCROLL_TRIGGER = {
  trigger: ".github-card-wrapper",
  start: "top 90%",
  once: true,
} as const;

// ---------------------------------------------------------------------------
// GitHub arrow hover animation parameters
// ---------------------------------------------------------------------------

export const GITHUB_ARROW_HOVER = {
  x: 4,
  y: -4,
  opacity: 1,
  duration: 0.4,
  ease: "back.out(1.7)",
} as const;

export const GITHUB_ARROW_REST = {
  x: 0,
  y: 0,
  opacity: 0.6,
  duration: 0.3,
  ease: "power2.out",
} as const;
