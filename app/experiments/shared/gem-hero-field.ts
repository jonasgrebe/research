type Vec2 = { x: number; y: number };

export const HERO_ANCHOR = { x: 95, y: 210 };
export const HERO_TARGET = { x: 285, y: 115 };
export const HERO_STUDENT = { x: 190, y: 265 };
export const HERO_ORIGIN = { x: 35, y: 335 };

// Four seconds at zero, then a twelve-second sweep in each direction.
// Ease out of the zero plateau without lingering at the upper endpoint.
export function heroEtaAtTime(seconds: number) {
  const cycle = ((seconds % 28) + 28) % 28;
  if (cycle <= 4) return 0;
  const progress = cycle <= 16 ? (cycle - 4) / 12 : (28 - cycle) / 12;
  return 5 * (progress < .12 ? progress * progress / .24 : progress - .06) / .94;
}

export function heroSignedLoss(point: Vec2, eta: number) {
  return (Math.hypot(point.x - HERO_ANCHOR.x, point.y - HERO_ANCHOR.y)
    - eta * Math.hypot(point.x - HERO_TARGET.x, point.y - HERO_TARGET.y)) / 100;
}
