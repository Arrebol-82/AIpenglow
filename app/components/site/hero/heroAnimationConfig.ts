// ---------------------------------------------------------------------------
// GSAP animation constants for HeroSection
// All numeric values preserved exactly from the original component.
// ---------------------------------------------------------------------------

// --- Parallax ---
export const HERO_PARALLAX = {
  SCROLL_FACTOR: 0.016,
  SCROLL_CAP: 7,
  X_RANGE: 7,
  Y_RANGE: 5,
} as const;

// --- Title intro timeline ---
export const HERO_TITLE_INTRO = {
  STILL_DURATION: 1.18,
  STILL_Y: 42,
  STILL_SCALE: 1.045,
  STILL_BLUR: 16,
  STILL_EASE: "expo.out",
  STILL_POSITION: 0,

  BECOMING_DURATION: 1.28,
  BECOMING_Y: 54,
  BECOMING_X: 20,
  BECOMING_SCALE: 1.02,
  BECOMING_ROTATION: 2,
  BECOMING_BLUR: 12,
  BECOMING_EASE: "expo.out",
  BECOMING_POSITION: 0.08,

  COMPLETE_CALL_TIME: 1.4,
} as const;

// --- Subtitle intro ---
export const HERO_SUBTITLE = {
  DURATION: 0.78,
  STAGGER: 0.06,
  Y_PERCENT: 125,
  EASE: "power3.out",
  POSITION: 0.32,
} as const;

// --- Dock animation & layout ---
export const HERO_DOCK = {
  DURATION: 1.08,
  DELAY_FACTOR: 0.5,

  SUBTITLE_WORD_DURATION: 1.5,
  SUBTITLE_WORD_STAGGER: 0.065,
  SUBTITLE_WORD_EASE: "expo.inOut",

  OFFSET: 20,

  TARGET_STILL_FONT_SIZE: 145,
  TARGET_STILL_FONT_SIZE_MOBILE: 84,
  TARGET_SUBTITLE_FONT_SIZE: 26,
  TARGET_SUBTITLE_FONT_SIZE_MOBILE: 18,

  SIDE_INSET_MOBILE: 24,
  SIDE_INSET_DESKTOP: 48,
  SIDE_INSET_WIDE: 60,
  BOTTOM_INSET_MOBILE: 80,
  BOTTOM_INSET_DESKTOP: 140,
  TOP_FLOOR_MOBILE: 96,
  TOP_FLOOR_DESKTOP: 120,
  BLOCK_GAP_MOBILE: 16,
  BLOCK_GAP_DESKTOP: 20,

  BREAKPOINT_MOBILE: 768,
  BREAKPOINT_WIDE: 1280,
} as const;
