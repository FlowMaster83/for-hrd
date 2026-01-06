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

  scaleRows.forEach((row, index) => {
    const resultRow = renderResultRow(row, index + 1);
    container.appendChild(resultRow);
  });

  return container;
}


/* =========================================================
   DATA EXTRACTION
========================================================= */

/**
 * Извлекает состояние одной шкалы напрямую из DOM
 * (включая маркеры, даже если пользователь не менял значение)
 */
function extractScaleData(row) {
  const labelEl = row.querySelector(".label");
  const valueEl = row.querySelector(".percent-value");
  const fillEl = row.querySelector(".chart-fill");
  const markerEls = row.querySelectorAll(".chart-marker"); // ✅ ВАЖНО

  const title = labelEl
    ? labelEl.childNodes[0].textContent.trim().replace(":", "")
    : "";

  const value = valueEl ? Number(valueEl.textContent) : 0;

  const fillWidth = fillEl
    ? parseFloat(fillEl.style.width) || value
    : value;

  const markers = Array.from(markerEls)
    .map((marker) => ({
      value: Number(marker.dataset.value),
      className: marker.className,
      svg: marker.innerHTML,
    }))
    .filter((m) => !Number.isNaN(m.value));

  return {
    title,
    value,
    fillWidth,
    markers,
  };
}


/**
 * Определяет тип маркера из className
 * Пример: marker-star → star
 */
function extractMarkerType(markerEl) {
  const classList = Array.from(markerEl.classList);
  const markerClass = classList.find((cls) => cls.startsWith("marker-"));

  return markerClass ? markerClass.replace("marker-", "") : "";
}

/* =========================================================
   RENDERING
========================================================= */

/**
 * Рендер одной read-only строки результата
 */
function renderResultRow(rowSource, index) {
  const row = document.createElement("div");
  row.className = "result-row";

  const labelEl = rowSource.querySelector(".label");
  const valueEl = rowSource.querySelector(".percent-value");
  const fillEl = rowSource.querySelector(".chart-fill");
  const trackEl = rowSource.querySelector(".chart-track");

  const title = labelEl
    ? labelEl.childNodes[0].textContent.trim().replace(":", "")
    : "";

  const value = valueEl ? valueEl.textContent : "0";

  row.innerHTML = `
    <div class="result-label">
      <span class="result-title">${title}</span>:
      <span class="result-value">${value}</span>
    </div>

    <div class="result-scale">
      <div class="chart-wrapper">
        <div class="chart-track">
          <div class="chart-fill" style="width: ${fillEl?.style.width || "0%"}"></div>
        </div>
      </div>
    </div>
  `;

  /* 🔥 КЛОНИРУЕМ МАРКЕРЫ 1:1 */
  const targetTrack = row.querySelector(".chart-track");
  trackEl
    ?.querySelectorAll(".chart-marker.active")
    .forEach((marker) => {
      targetTrack.appendChild(marker.cloneNode(true));
    });

  return row;
}


/* =========================================================
   SUBPARTS
========================================================= */

/**
 * Рендер маркеров шкалы
 */
function renderMarkers(markers) {
  if (!markers.length) return "";

  return markers
    .map(
      ({ value, className, svg }) => `
        <div
          class="${className} active"
          style="left: ${value}%"
          data-value="${value}"
        >
          ${svg}
        </div>
      `
    )
    .join("");
}
