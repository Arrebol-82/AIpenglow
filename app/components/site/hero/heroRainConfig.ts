// ---------------------------------------------------------------------------
// Raindrop generation ranges (used in createRaindrop / seedRaindrops / renderRain)
// ---------------------------------------------------------------------------

export const HERO_RAIN = {
  LENGTH_MIN: 12,
  LENGTH_RANGE: 16,
  SPEED_MIN: 3.2,
  SPEED_RANGE: 4.8,
  OPACITY_MIN: 0.08,
  OPACITY_RANGE: 0.16,

  LINE_WIDTH: 1,
  LINE_CAP: "round" as const,
  ANGLE_X: 3,
  DRIFT_FACTOR: 0.18,

  DENSITY_FACTOR: 24000,
  MIN_DROPS: 36,

  RESET_MARGIN_X: 80,
  RESET_Y_MIN_BASE: -20,
  RESET_Y_RANGE: 120,
  BOUNDS_Y_OVERFLOW: 24,
  BOUNDS_X_OVERFLOW: -24,

  color: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
} as const;
