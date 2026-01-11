// arrows/useArrowHold.js

const DEFAULTS = {
  startInterval: 200,
  minInterval: 40,
  acceleration: 0.85,
  holdDelay: 0,
};

export function useArrowHold({ button, onStep, options = {} }) {
  const {
    startInterval,
    minInterval,
    acceleration,
    holdDelay,
  } = { ...DEFAULTS, ...options };

  let holding = false;
  let rafId = null;
  let lastTime = 0;
  let interval = startInterval;

  const stop = () => {
    holding = false;
    lastTime = 0;
    interval = startInterval;

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const loop = (time) => {
    if (!holding) return;

    if (!lastTime) lastTime = time;

    if (time - lastTime >= interval) {
      onStep();
      lastTime = time;
      interval = Math.max(minInterval, interval * acceleration);
    }

    rafId = requestAnimationFrame(loop);
  };

  button.addEventListener("pointerdown", (e) => {
    e.preventDefault();

    holding = true;
    onStep(); // первый шаг сразу

    if (holdDelay > 0) {
      setTimeout(() => {
        if (holding) rafId = requestAnimationFrame(loop);
      }, holdDelay);
    } else {
      rafId = requestAnimationFrame(loop);
    }
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach((evt) => {
    button.addEventListener(evt, stop);
  });

  return { destroy: stop };
}
