// src/js/components/modalContent.js

/**
 * Утилита: проверка desktop-режима
 */
function isDesktop() {
  return window.matchMedia("(min-width: 768px)").matches;
}

/**
 * Главная функция.
 * Формирует DOM для тела модалки ТОЛЬКО на desktop.
 * На mobile возвращает null.
 */
export function renderModalResults() {
  if (!isDesktop()) {
    return null;
  }

  const container = document.createElement("div");
  container.className = "results";

  // header над шкалами
  container.appendChild(renderModalScaleHeader());

  // строки результатов
  const scaleRows = document.querySelectorAll(".scale-row");

  scaleRows.forEach((row) => {
    const resultRow = renderResultRow(row);
    container.appendChild(resultRow);
  });

  return container;
}

/* =========================================================
   SCALE HEADER (LOW / AVERAGE / HIGH)
========================================================= */

function renderModalScaleHeader() {
  const header = document.createElement("div");
  header.className = "modal-scale-head";

  header.innerHTML = `
    <div class="scale-head-grid">
      <div class="scale-head-spacer"></div>

      <div class="scale-head-content">
        <div class="scale-head-levels">
          <span class="level low">LOW</span>
          <span class="level average">AVERAGE</span>
          <span class="level high">HIGH</span>
        </div>

        <div class="scale-head-values">
          <span class="value v0">0%</span>
          <span class="value v33">33%</span>
          <span class="value v66">66%</span>
          <span class="value v100">100%</span>
        </div>
      </div>
    </div>
  `;

  return header;
}

/* =========================================================
   RESULT ROW (READ-ONLY)
========================================================= */

function renderResultRow(rowSource) {
  const row = document.createElement("div");
  row.className = "result-row";

  const labelEl = rowSource.querySelector(".scale-label");
  const valueEl = rowSource.querySelector(".percent-value");
  const fillEl = rowSource.querySelector(".chart-fill");
  const trackEl = rowSource.querySelector(".chart-track");

  const title = labelEl ? labelEl.textContent : "";
  const value = valueEl ? valueEl.textContent : "0";
  const fillWidth = fillEl?.style.width || "0%";

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

  const targetTrack = row.querySelector(".chart-track");

  trackEl
    ?.querySelectorAll(".chart-marker.active")
    .forEach((marker) => {
      targetTrack.appendChild(marker.cloneNode(true));
    });

  return row;
}
