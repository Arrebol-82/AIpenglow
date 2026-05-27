/** Number of marquee copies rendered in each band track */
export const MARQUEE_COPIES = 6;

/** Text repeated in the marquee band */
export const MARQUEE_TEXT =
  "AIPENGLOW \u2022 ARCHIVE \u2022 SELECTED WORKS \u2022";

// ---------------------------------------------------------------------------
// Entrance animation parameters (triggerEntrance)
// ---------------------------------------------------------------------------

export const ENTRANCE_WATERMARK = {
  from: { autoAlpha: 0, x: -28 },
  to: { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" as const },
} as const;

export const ENTRANCE_LINES = {
  from: { width: 0 },
  to: {
    width: "100%",
    duration: 1.5,
    ease: "power3.inOut" as const,
    stagger: 0.1,
  },
} as const;

export const ENTRANCE_CHARS = {
  from: { y: "100%", autoAlpha: 0 },
  to: {
    y: "0%",
    autoAlpha: 1,
    duration: 0.8,
    ease: "power2.out" as const,
    stagger: 0.015,
  },
  offset: "-=1",
} as const;

export const ENTRANCE_META = {
  from: { autoAlpha: 0, y: 16 },
  to: {
    autoAlpha: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out" as const,
    stagger: 0.08,
  },
  offset: "-=0.65",
} as const;

// ---------------------------------------------------------------------------
// Marquee animation parameters
// ---------------------------------------------------------------------------

export const MARQUEE_DURATION = 24;

// ---------------------------------------------------------------------------
// Preview animation parameters
// ---------------------------------------------------------------------------

export const PREVIEW_INITIAL = {
  autoAlpha: 0,
  scale: 0.92,
  rotate: 0,
  xPercent: -50,
  yPercent: -50,
  x: 0,
  y: 0,
  transformOrigin: "50% 50%",
} as const;

export const PREVIEW_POSITION_TWEEN = {
  duration: 0.6,
  ease: "power3.out" as const,
  overwrite: "auto" as const,
} as const;

export const PREVIEW_FIRST_SHOW_CONTAINER = {
  from: { autoAlpha: 0, scale: 0.92, rotate: 0 },
  to: {
    autoAlpha: 1,
    scale: 1,
    rotate: -3,
    duration: 0.42,
    ease: "power3.out" as const,
  },
} as const;

export const PREVIEW_FIRST_SHOW_CARD = {
  from: { autoAlpha: 0, scale: 0.94, y: 12 },
  to: {
    autoAlpha: 1,
    scale: 1,
    y: 0,
    duration: 0.4,
    ease: "power2.out" as const,
  },
} as const;

export const PREVIEW_SWITCH_CARD = {
  from: { autoAlpha: 0, scale: 0.94, y: 12, rotate: -1 },
  to: {
    autoAlpha: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    duration: 0.4,
    ease: "power2.out" as const,
  },
} as const;

export const PREVIEW_LEAVE = {
  to: {
    autoAlpha: 0,
    scale: 0.92,
    rotate: 0,
    duration: 0.32,
    ease: "power2.out" as const,
  },
} as const;
