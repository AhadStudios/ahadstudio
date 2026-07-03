/**
 * Frozen default layout for the beige creative board.
 * Source of truth — do not auto-generate or persist drag positions.
 * Refresh always resets every element to these exact coordinates.
 */
export const SHOWCASE_DEFAULTS = Object.freeze({
  "person-center": Object.freeze({
    x: 44,
    y: 100,
    xPercent: -40,
    yPercent: -100,
    rotation: 0,
    scale: 1,
  }),
  "person-left": Object.freeze({
    x: 24,
    y: 90,
    xPercent: -50,
    yPercent: -100,
    rotation: -5,
    scale: 0.94,
  }),
  "person-lower": Object.freeze({
    x: 56,
    y: 24,
    xPercent: -50,
    yPercent: -50,
    rotation: -5,
    scale: 0.9,
  }),
  "rubber-duck": Object.freeze({
    x: 11,
    y: 10,
    xPercent: -50,
    yPercent: -50,
    rotation: -10,
    scale: 1,
  }),
  vscode: Object.freeze({
    x: 84,
    y: 12,
    xPercent: -50,
    yPercent: -50,
    rotation: 8,
    scale: 1.08,
  }),
  github: Object.freeze({
    x: 8,
    y: 40,
    xPercent: -50,
    yPercent: -50,
    rotation: -7,
    scale: 1,
  }),
  terminal: Object.freeze({
    x: 89,
    y: 36,
    xPercent: -50,
    yPercent: -50,
    rotation: 11,
    scale: 0.95,
  }),
  coffee: Object.freeze({
    x: 13,
    y: 76,
    xPercent: -50,
    yPercent: -50,
    rotation: 6,
    scale: 1,
  }),
  "pixel-heart": Object.freeze({
    x: 21,
    y: 18,
    xPercent: -50,
    yPercent: -50,
    rotation: -5,
    scale: 0.92,
  }),
  javascript: Object.freeze({
    x: 18,
    y: 58,
    xPercent: -50,
    yPercent: -50,
    rotation: 9,
    scale: 1,
  }),
  react: Object.freeze({
    x: 86,
    y: 70,
    xPercent: -50,
    yPercent: -50,
    rotation: -9,
    scale: 1.05,
  }),
  typescript: Object.freeze({
    x: 77,
    y: 22,
    xPercent: -50,
    yPercent: -50,
    rotation: -6,
    scale: 1,
  }),
  docker: Object.freeze({
    x: 10,
    y: 24,
    xPercent: -50,
    yPercent: -50,
    rotation: 7,
    scale: 0.98,
  }),
  linux: Object.freeze({
    x: 74,
    y: 84,
    xPercent: -50,
    yPercent: -50,
    rotation: 5,
    scale: 1,
  }),
  "ctrl-z": Object.freeze({
    x: 91,
    y: 54,
    xPercent: -50,
    yPercent: -50,
    rotation: -11,
    scale: 1,
  }),
  "npm-install": Object.freeze({
    x: 80,
    y: 90,
    xPercent: -50,
    yPercent: -50,
    rotation: 7,
    scale: 1,
  }),
  "404-sleep": Object.freeze({
    x: 11,
    y: 32,
    xPercent: -50,
    yPercent: -50,
    rotation: -4,
    scale: 1,
  }),
  "it-works": Object.freeze({
    x: 23,
    y: 88,
    xPercent: -50,
    yPercent: -50,
    rotation: -6,
    scale: 1,
  }),
  nextjs: Object.freeze({
    x: 48,
    y: 46,
    xPercent: -50,
    yPercent: -50,
    rotation: 8,
    scale: 0.96,
  }),
  tailwind: Object.freeze({
    x: 38,
    y: 38,
    xPercent: -50,
    yPercent: -50,
    rotation: -7,
    scale: 0.94,
  }),
  gsap: Object.freeze({
    x: 66,
    y: 62,
    xPercent: -50,
    yPercent: -50,
    rotation: 6,
    scale: 0.95,
  }),
});

export function getShowcaseDefault(id) {
  const defaults = SHOWCASE_DEFAULTS[id];
  if (!defaults) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Missing showcase default position for "${id}"`);
    }
    return {
      x: 50,
      y: 50,
      xPercent: -50,
      yPercent: -50,
      rotation: 0,
      scale: 1,
    };
  }
  return defaults;
}
