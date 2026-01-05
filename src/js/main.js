import { initScales } from "./scales/initScales.js";
import { initHeaderControls } from "./header/controls.js";
import { initModal } from "./modal/modal.js";

document.addEventListener("DOMContentLoaded", () => {
  initScales();
  initHeaderControls();
});
