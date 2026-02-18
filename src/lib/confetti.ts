import confetti from "canvas-confetti";

/** Soft, beckoning palette: light teal and stone, like dust motes catching light */
const beckoningColors = [
  "#2dd4bf", // teal-400
  "#5eead4", // teal-300
  "#99f6e4", // teal-200
  "#ccfbf1", // teal-100
  "#a8a29e", // stone-400
  "#d6d3d1", // stone-300
  "#e7e5e4", // stone-200
  "#fafaf9", // stone-50
];

export function fireConfetti(origin: { x: number; y: number }) {
  // Beckoning: a gentle whisper of particles, drifting softly toward you
  confetti({
    particleCount: 16,
    spread: 22,
    startVelocity: 12,
    origin,
    colors: beckoningColors,
    shapes: ["star", "circle"],
    scalar: 0.6,
    gravity: 0.4,
    drift: 0.4,
    decay: 0.96,
    ticks: 55,
    disableForReducedMotion: true,
  });
}
