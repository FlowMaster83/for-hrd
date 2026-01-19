// src/js/header/createHeaderControls.js

import { createThemeToggleButton } from "../theme/themeButton.js";
import { resetAllScales } from "../state/scaleRegistry.js";

const MAX = 100;
const STEP = 1;
const MODAL_MIN_WIDTH = 641;

/* =========================================================
   UTILS
========================================================= */

function isModalAllowed() {
  return window.innerWidth >= MODAL_MIN_WIDTH;
}

function setResultState(button, state) {
  // state: "normal" | "active" | "disabled"
  button.classList.remove("is-active");
  button.disabled = false;
  button.setAttribute("aria-disabled", "false");

  if (state === "active") {
    button.classList.add("is-active");
  }

  if (state === "disabled") {
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
  }
}

function normalizeValue(raw) {
  if (raw === "") return null;

  const value = Number(raw);
  if (Number.isNaN(value)) return null;

  if (value <= 0) return 0;
  return Math.min(value, MAX);
}

function applyValueToAllScales(value) {
  document.querySelectorAll(".scale-row").forEach((row) => {
    const input = row.querySelector(".user-input");
    if (!input) return;

    input.value = value === 0 ? "" : value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

/* =========================================================
   HEADER CONTROLS
========================================================= */

export function createHeaderControls(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return null;

  root.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "header-options";

  const label = document.createElement("p");
  label.className = "header-label";
  label.textContent = "Fill all:";

  const input = document.createElement("input");
  input.className = "user-input";
  input.type = "number";
  input.inputMode = "numeric";
  input.placeholder = "0";

  const resultBtn = document.createElement("button");
  resultBtn.className = "header-result-btn";
  resultBtn.type = "button";
  resultBtn.textContent = "RESULT";
  resultBtn.dataset.openModal = "true";

  const clearBtn = document.createElement("button");
  clearBtn.className = "clear-all-btn";
  clearBtn.type = "button";
  clearBtn.textContent = "CLEAR ALL";

  const langBtn = document.createElement("button");
  langBtn.className = "lang-toggle-btn button";
  langBtn.type = "button";
  langBtn.textContent = "UA";

  const themeContainer = document.createElement("div");
  themeContainer.className = "theme-toggle";
  createThemeToggleButton(themeContainer);

  /* INITIAL STATE */

  if (isModalAllowed()) {
    setResultState(resultBtn, "normal");
  } else {
    setResultState(resultBtn, "disabled");
  }

  /* MODAL EVENTS */

  document.addEventListener("modal:open", () => {
    setResultState(resultBtn, "active");
  });

  document.addEventListener("modal:close", () => {
    if (!isModalAllowed()) {
      setResultState(resultBtn, "disabled");
    } else {
      setResultState(resultBtn, "normal");
    }
  });

  /* RESIZE */

  window.addEventListener("resize", () => {
    if (!isModalAllowed()) {
      setResultState(resultBtn, "disabled");
    } else {
      // при возврате >640 — всегда normal
      setResultState(resultBtn, "normal");
    }
  });

  /* INPUT HANDLERS */

  input.addEventListener("input", () => {
    const value = normalizeValue(input.value);

    if (value === null || value === 0) {
      input.value = "";
      applyValueToAllScales(0);
      return;
    }

    input.value = value;
    applyValueToAllScales(value);
  });

  input.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      const current = normalizeValue(input.value) ?? 0;
      const delta = e.deltaY < 0 ? STEP : -STEP;
      const next = normalizeValue(current + delta);

      if (next === 0) {
        input.value = "";
        applyValueToAllScales(0);
        return;
      }

      input.value = next;
      applyValueToAllScales(next);
    },
    { passive: false }
  );

  clearBtn.addEventListener("click", () => {
    resetAllScales();
    input.value = "";
  });

  wrapper.append(
    label,
    input,
    resultBtn,
    clearBtn,
    langBtn,
    themeContainer
  );

  root.appendChild(wrapper);

  return { input, clearBtn, resultBtn, langBtn };
}
