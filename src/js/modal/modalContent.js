// src/js/components/modalContent.js

/**
 * Главная функция.
 * Считывает текущее состояние ВСЕХ шкал со страницы
 * и возвращает DOM-узел для вставки в модалку.
 */
export function renderModalResults() {
  const container = document.createElement("div");
  container.className = "results";

  const scaleRows = document.querySelectorAll(".scale-row");

  scaleRows.forEach((row) => {
    const resultRow = renderResultRow(row);
    container.appendChild(resultRow);
  });

  return container;
}

/* =========================================================
   RENDERING
========================================================= */

/**
 * Рендер одной read-only строки результата
 */
function renderResultRow(rowSource) {
  const row = document.createElement("div");
  row.className = "result-row";

  /* -----------------------------
     SOURCE ELEMENTS
  ----------------------------- */

  const labelEl = rowSource.querySelector(".scale-label");
  const valueEl = rowSource.querySelector(".percent-value");
  const fillEl = rowSource.querySelector(".chart-fill");
  const trackEl = rowSource.querySelector(".chart-track");

  /* -----------------------------
     DATA
  ----------------------------- */

  const title = labelEl ? labelEl.textContent : "";
  const value = valueEl ? valueEl.textContent : "0";
  const fillWidth = fillEl?.style.width || "0%";

  /* -----------------------------
     BASE MARKUP
  ----------------------------- */

  row.innerHTML = `
    <div class="result-label">
      <span class="result-title">${title}</span>:
      <span class="result-value">${value}</span>
    </div>

    <div class="result-scale">
      <div class="chart-wrapper">
        <div class="chart-track">
          <div class="chart-fill" style="width: ${fillWidth}"></div>
        </div>
      </div>
    </div>
  `;

  /* -----------------------------
     CLONE ACTIVE MARKERS 1:1
  ----------------------------- */

  const targetTrack = row.querySelector(".chart-track");

  trackEl
    ?.querySelectorAll(".chart-marker.active")
    .forEach((marker) => {
      targetTrack.appendChild(marker.cloneNode(true));
    });

  return row;
}
