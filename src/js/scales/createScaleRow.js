// createScaleRow.js

import { createMarker } from "../components/markers.js";

const STEP_INPUT = 1;   // логика (инпут, стрелки)
const STEP_TICK = 10;   // визуальные метки
const MAX = 100;

export function createScaleRow(labelTitle, container) {
  const row = document.createElement("div");
  row.className = "scale-row";

  row.innerHTML = `
    <div class="label">
      <span class="scale-label">${labelTitle}</span>:
      <span class="percent-value">0</span>
    </div>

    <div class="value">
      <div class="chart-wrapper">
        <div class="chart-track">
          <div class="chart-fill"></div>
          <div class="ticks"></div>
        </div>
      </div>

      <input
        class="user-input"
        type="number"
        placeholder="0"
        min="0"
        max="100"
      />
    </div>

    <div class="actions">
      <button class="circle-btn" data-short="C" type="button">CIRCLE</button>
      <button class="dotted-btn" data-short="D" type="button">DASH</button>
      <button class="star-btn" data-short="S" type="button">STAR</button>
      <button class="check-btn" data-short="✓" type="button">CHECK</button>
      <button class="clear-btn" type="button">CLEAR</button>

      <!-- arrows (visible only ≤480 via CSS) -->
      <button class="arrow-btn arrow-left" type="button" aria-label="Decrease">←</button>
      <button class="arrow-btn arrow-right" type="button" aria-label="Increase">→</button>
    </div>
  `;

  /* =========================
     DOM
  ========================= */

  const input = row.querySelector(".user-input");
  const fill = row.querySelector(".chart-fill");
  const percentLabel = row.querySelector(".percent-value");
  const track = row.querySelector(".chart-track");
  const ticks = row.querySelector(".ticks");

  const arrowLeft = row.querySelector(".arrow-left");
  const arrowRight = row.querySelector(".arrow-right");

  /* =========================
     TICKS (VISUAL ONLY)
  ========================= */

  const lineNodes = [];

  for (let value = 0; value <= MAX; value += STEP_TICK) {
    const tick = document.createElement("div");
    tick.className = "tick";
    tick.textContent = value;

    if (value === 0 || value === 50 || value === 100) {
      tick.classList.add("tick--major");
    }

    if (value === 100) {
      tick.classList.add("tick--end");
    }

    tick.style.left = `${value}%`;
    ticks.appendChild(tick);

    if (value > 0 && value < 100) {
      const line = document.createElement("div");
      line.className = "tick-line";
      ticks.appendChild(line);
      lineNodes.push({ value, el: line });
    }
  }

  const layoutLines = () => {
    const width = track.clientWidth;
    if (!width) return;

    const stepPx = width / (MAX / STEP_TICK);

    lineNodes.forEach(({ value, el }) => {
      el.style.left = `${Math.round((value / STEP_TICK) * stepPx)}px`;
    });
  };

  requestAnimationFrame(layoutLines);
  new ResizeObserver(layoutLines).observe(track);

  /* =========================
     MARKERS
  ========================= */

  const markers = {
    solid: createMarker("solid"),
    dotted: createMarker("dotted"),
    star: createMarker("star"),
    check: createMarker("check"),
  };

  Object.values(markers).forEach((m) => track.appendChild(m));

  const buttons = {
    solid: row.querySelector(".circle-btn"),
    dotted: row.querySelector(".dotted-btn"),
    star: row.querySelector(".star-btn"),
    check: row.querySelector(".check-btn"),
  };

  /* =========================
     VALUE HELPERS
  ========================= */

  const getValue = () => {
    const num = Number(input.value);
    return Number.isFinite(num) && num > 0 ? Math.min(num, 100) : 0;
  };

  const setValue = (val) => {
    const next = Math.min(100, Math.max(0, val));
    input.value = next === 0 ? "" : next;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const syncVisuals = () => {
    const val = getValue();
    fill.style.width = `${val}%`;
    percentLabel.textContent = val;

    Object.entries(markers).forEach(([type, marker]) => {
      if (marker.classList.contains("active")) {
        marker.style.left =
          type === "check" ? `calc(${val}% + 8px)` : `${val}%`;
      }
    });
  };

  /* =========================
     INPUT (keyboard + wheel)
  ========================= */

  input.addEventListener("focus", () => input.select());

  input.addEventListener("input", () => {
    if (input.value < 0) input.value = "";
    if (input.value > 100) input.value = 100;
    syncVisuals();
  });

  input.addEventListener("blur", () => {
    if (input.value === "0") {
      input.value = "";
      syncVisuals();
    }
  });

  // wheel — для КАЖДОЙ шкалы
  input.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? STEP_INPUT : -STEP_INPUT;
      setValue(getValue() + delta);
    },
    { passive: false }
  );

  /* =========================
     ARROWS (C2, mobile only via CSS)
  ========================= */

  const HOLD_DELAY = 300;
  const START_INTERVAL = 180;
  const MIN_INTERVAL = 40;
  const ACCELERATION = 0.85;

  let holdTimeout = null;
  let holdTimer = null;
  let currentInterval = START_INTERVAL;

  const vibrate = () => navigator.vibrate?.(10);

  const changeBy = (delta) => {
    setValue(getValue() + delta);
  };

  const startHold = (delta) => {
    currentInterval = START_INTERVAL;

    holdTimeout = setTimeout(() => {
      const tick = () => {
        changeBy(delta);
        vibrate();

        currentInterval = Math.max(
          MIN_INTERVAL,
          currentInterval * ACCELERATION
        );

        holdTimer = setTimeout(tick, currentInterval);
      };

      tick();
    }, HOLD_DELAY);
  };

  const stopHold = () => {
    clearTimeout(holdTimeout);
    clearTimeout(holdTimer);
    holdTimeout = null;
    holdTimer = null;
  };

  arrowLeft.addEventListener("pointerdown", () => {
    changeBy(-STEP_INPUT);
    vibrate();
    startHold(-STEP_INPUT);
  });

  arrowRight.addEventListener("pointerdown", () => {
    changeBy(STEP_INPUT);
    vibrate();
    startHold(STEP_INPUT);
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach((evt) => {
    arrowLeft.addEventListener(evt, stopHold);
    arrowRight.addEventListener(evt, stopHold);
  });

  /* =========================
     MARKER TOGGLE
  ========================= */

  const toggleMarker = (type) => {
    Object.values(markers).forEach((m) => {
      m.classList.remove("active");
      m.style.left = "";
    });

    Object.values(buttons).forEach((b) => {
      b.style.backgroundColor = "";
      b.style.borderColor = "";
    });

    const marker = markers[type];
    const button = buttons[type];

    marker.classList.add("active");
    marker.style.left =
      type === "check"
        ? `calc(${getValue()}% + 8px)`
        : `${getValue()}%`;

    button.style.backgroundColor = "#ffe6e6";
    button.style.borderColor = "#ff0000";
  };

  buttons.solid.addEventListener("click", () => toggleMarker("solid"));
  buttons.dotted.addEventListener("click", () => toggleMarker("dotted"));
  buttons.star.addEventListener("click", () => toggleMarker("star"));
  buttons.check.addEventListener("click", () => toggleMarker("check"));

  /* =========================
     CLEAR
  ========================= */

  row.querySelector(".clear-btn").addEventListener("click", () => {
    setValue(0);

    Object.values(markers).forEach((m) => {
      m.classList.remove("active");
      m.style.left = "";
    });

    Object.values(buttons).forEach((b) => {
      b.style.backgroundColor = "";
      b.style.borderColor = "";
    });
  });

  container.appendChild(row);
}
