// header/controls.js
import { createHeaderControls } from "./createHeaderControls.js";

export function initHeaderControls() {
  const controls = createHeaderControls("header-controls-root");
  if (!controls) return;

  const { select, fillBtn, clearBtn } = controls;

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

  clearBtn.addEventListener("click", () => {
    document
      .querySelectorAll(".scale-row .clear-btn")
      .forEach((btn) => btn.click());

    select.value = "";
    updateFillButtonState();
  });
}
