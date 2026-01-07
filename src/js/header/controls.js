// header/controls.js
import { createHeaderControls } from "./createHeaderControls.js";
import { LABELS } from "../constants/labels.js";

let currentLang = "ua";

/**
 * Обновляет подписи шкал без пересоздания DOM
 */
function updateScaleLabels() {
  const labels = LABELS[currentLang];
  const nodes = document.querySelectorAll(".scale-label");

  nodes.forEach((el, index) => {
    el.textContent = labels[index];
  });
}

export function initHeaderControls() {
  const controls = createHeaderControls("header-controls-root");
  if (!controls) return;

  const { select, fillBtn, clearBtn, langBtn } = controls;

  /* -----------------------------
     FILL BUTTON LOGIC
  ----------------------------- */

  const updateFillButtonState = () => {
    fillBtn.disabled = !select.value || Number(select.value) < 1;
  };

  select.addEventListener("change", updateFillButtonState);
  updateFillButtonState();

  fillBtn.addEventListener("click", () => {
    const value = Number(select.value);
    if (!value) return;

    document.querySelectorAll(".scale-row").forEach((row) => {
      const input = row.querySelector(".user-input");
      if (!input) return;

      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("blur", { bubbles: true }));
    });
  });

  /* -----------------------------
     CLEAR BUTTON LOGIC
  ----------------------------- */

  clearBtn.addEventListener("click", () => {
    document
      .querySelectorAll(".scale-row .clear-btn")
      .forEach((btn) => btn.click());

    select.value = "";
    updateFillButtonState();
  });

  /* -----------------------------
     LANGUAGE TOGGLE
  ----------------------------- */

  if (langBtn) {
    langBtn.textContent = currentLang.toUpperCase();

    langBtn.addEventListener("click", () => {
      currentLang = currentLang === "ua" ? "en" : "ua";
      langBtn.textContent = currentLang.toUpperCase();

      updateScaleLabels();
    });
  }
}
