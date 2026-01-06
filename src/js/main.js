import { initScales } from "./scales/initScales.js";
import { initHeaderControls } from "./header/controls.js";
import "./modal/modal.js"; // важно: просто импорт, чтобы навесились обработчики

document.addEventListener("DOMContentLoaded", () => {
  initScales();
  initHeaderControls();
});

initHeaderControls();
