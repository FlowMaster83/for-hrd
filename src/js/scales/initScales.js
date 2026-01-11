// initScales.js

import { LABELS } from "../constants/labels.js";
import { createScaleRow } from "./createScaleRow.js";

export function initScales() {
  const container = document.getElementById("scales-container");
  const currentLang = "ua"; // позже будет меняться

  LABELS[currentLang].forEach((label) => {
    createScaleRow(label, container);
  });
}
