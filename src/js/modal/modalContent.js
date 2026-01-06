/**
 * Главная точка входа.
 * Собирает текущее состояние ВСЕХ шкал на странице
 * и возвращает DOM-узел с результатами для модалки.
 */
export function renderModalResults() {
  const container = document.createElement("div");
  container.className = "results";

  const scaleRows = document.querySelectorAll(".scale-row");

  scaleRows.forEach((row, index) => {
    const scaleData = extractScaleData(row);
    const resultRow = renderResultRow(scaleData, index + 1);
    container.appendChild(resultRow);
  });

  return container;
}

/* =========================================================
   DATA EXTRACTION
========================================================= */

/**
 * Считывает состояние ОДНОЙ шкалы прямо из DOM
 * Даже если пользователь её не трогал
 */
function extractScaleData(row) {
  const titleEl = row.querySelector(".label");
  const valueEl = row.querySelector(".percent-value");
  const fillEl = row.querySelector(".chart-fill");
  const markerEls = row.querySelectorAll(".marker");

  const title = titleEl
    ? titleEl.childNodes[0].textContent.trim().replace(":", "")
    : "";

  const value = valueEl ? Number(valueEl.textContent) : 0;

  const fillWidth = fillEl
    ? parseFloat(fillEl.style.width) || value
    : value;

  const markers = Array.from(markerEls).map((marker) =>
    parseFloat(marker.style.left)
  );

  return {
    title,
    value,
    fillWidth,
    markers,
  };
}

/* =========================================================
   RENDERING
========================================================= */

/**
 * Рендер одной read-only строки результата
 */
function renderResultRow(scale, index) {
  const row = document.createElement("div");
  row.className = "result-row";

  row.innerHTML = `
    <div class="result-label">
      <span class="result-title">${scale.title}</span>:
      <span class="result-value">${scale.value}</span>
    </div>

    <div class="result-scale">
      <div class="chart-wrapper">
        <div class="chart-track">
          <div
            class="chart-fill"
            style="width: ${scale.fillWidth}%"
          ></div>

          <div class="ticks"></div>

          ${renderMarkers(scale.markers)}
        </div>

        ${renderLabels()}
      </div>
    </div>
  `;

  return row;
}

/* =========================================================
   SUBPARTS
========================================================= */

function renderMarkers(markers) {
  if (!markers || !markers.length) return "";

  return markers
    .map(
      (value) =>
        `<div class="marker" style="left: ${value}%"></div>`
    )
    .join("");
}

function renderLabels() {
  const labels = [];

  for (let i = 0; i <= 100; i += 10) {
    labels.push(
      `<span${i === 50 ? ' class="mid"' : ""}>${i}</span>`
    );
  }

  return `<div class="chart-labels">${labels.join("")}</div>`;
}
