import { Easing, interpolate, spring } from "remotion";

// Curves from the animate skill. Never ease-in.
export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);
export const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const tween = (
  frame: number,
  range: [number, number],
  out: [number, number],
  easing = easeOut,
) => interpolate(frame, range, out, { ...clamp, easing });

/** 0 → 1 → 0 over `len` frames starting at `at` (eyelid close). */
export const blink = (frame: number, at: number, len = 6) => {
  const t = frame - at;
  if (t < 0 || t > len) return 0;
  return 1 - Math.abs(t - len / 2) / (len / 2);
};

/** Settling spring, 0 before `at`. Carries overshoot for a living feel. */
export const springAt = (
  frame: number,
  fps: number,
  at: number,
  config = { damping: 12, stiffness: 180, mass: 0.7 },
) => (frame < at ? 0 : spring({ frame: frame - at, fps, config }));

export type Pose = { dy: number; sx: number; sy: number; air: number };

const ANTIC = 5;
const AIR = 16;
const HEIGHT = 230;

/**
 * One hop as additive deltas: anticipation squash → stretched airtime on a
 * parabola → spring-damped landing squash. Deltas sum, so overlapping hops
 * blend without a pop.
 */
export const hop = (frame: number, fps: number, at: number): Pose => {
  const t = frame - at;
  const none = { dy: 0, sx: 0, sy: 0, air: 0 };
  if (t < 0) return none;

  if (t < ANTIC) {
    const s = tween(t, [0, ANTIC], [0, 1]);
    return { dy: 0, sx: 0.1 * s, sy: -0.14 * s, air: 0 };
  }
  if (t < ANTIC + AIR) {
    const p = (t - ANTIC) / AIR;
    const edge = Math.abs(2 * p - 1); // 1 at takeoff/landing, 0 at apex
    return {
      dy: -HEIGHT * 4 * p * (1 - p),
      sx: -0.07 * edge,
      sy: 0.1 * edge,
      air: 1 - edge * edge,
    };
  }
  const land = 1 - springAt(t, fps, ANTIC + AIR, { damping: 9, stiffness: 260, mass: 0.6 });
  return { dy: 0, sx: 0.13 * land, sy: -0.18 * land, air: 0 };
};
