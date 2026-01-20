/* =========================================================
   PNG EXPORT — A4.1 (DESKTOP / MODAL ≥641)
   DOM-clone approach
   SPEC: A3 → A4
========================================================= */

/* global htmlToImage */

export function exportResultsToPng() {
  const root = document.querySelector(".modal__content");

  if (!root) {
    console.error("[PNG] .modal__content not found");
    return;
  }

  // --- CLONE ROOT ---
  const clone = root.cloneNode(true);

  const rect = root.getBoundingClientRect();

  clone.style.width = `${rect.width}px`;
  clone.style.maxWidth = "none";

  // --- FORCE FULL-HEIGHT RENDER ---
  clone.style.maxHeight = "none";
  clone.style.height = "auto";

  const body = clone.querySelector(".modal__body");
  if (body) {
    body.style.maxHeight = "none";
    body.style.height = "auto";
    body.style.overflow = "visible";
  }

  // --- REMOVE UI CONTROLS FROM CLONE ---
  const closeBtn = clone.querySelector(".modal-close-btn");
  if (closeBtn) closeBtn.remove();

  // --- SANDBOX ---
  const sandbox = document.createElement("div");
  sandbox.style.position = "fixed";
  sandbox.style.left = "-10000px";
  sandbox.style.top = "0";
  sandbox.style.pointerEvents = "none";
  sandbox.style.opacity = "0";

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  // --- EXPORT PNG ---
  htmlToImage
    .toPng(clone, {
      pixelRatio: 2,
      cacheBust: false,
      skipFonts: true,
    })
    .then((dataUrl) => {
      downloadPng(dataUrl, "results.png");
    })
    .catch((err) => {
      console.error("[PNG][A4.1] export failed", err);
    })
    .finally(() => {
      sandbox.remove();
    });
}

/* =========================================================
   PNG EXPORT — A4.2 (MOBILE / DEVICE ≤640)
   DOM-root: #scales-container
   SPEC: A4.2
========================================================= */

export function exportResultsToPngMobile() {
  const root = document.querySelector("#scales-container");

  if (!root) {
    console.error("[PNG][A4.2] #scales-container not found");
    return;
  }

  // --- CLONE ROOT ---
  const clone = root.cloneNode(true);

  // --- COPY THEME FROM DOCUMENT (LIGHT / DARK) ---
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme) {
    clone.setAttribute("data-theme", theme);
  }

  // --- REMOVE UI CONTROLS FROM EACH SCALE ---
  clone.querySelectorAll(".actions").forEach((el) => el.remove());
  clone.querySelectorAll(".user-input").forEach((el) => el.remove());

  // --- REMOVE SCALE TICKS (0 / 50 / 100) ---
  clone.querySelectorAll(".tick, .tick-line").forEach((el) => el.remove());

  clone.querySelectorAll(".scale-row").forEach((row) => {
    row.style.margin = "0";
    row.style.rowGap = "0";
  });

  // --- FIXED VERTICAL RHYTHM FOR DOCUMENT ---
  clone.style.display = "flex";
  clone.style.flexDirection = "column";
  clone.style.gap = "10px";

  // --- REMOVE HEIGHT / SCROLL LIMITS ---
  clone.style.maxHeight = "none";
  clone.style.height = "auto";
  clone.style.overflow = "visible";

  // --- SANDBOX ---
  const sandbox = document.createElement("div");
  sandbox.style.position = "fixed";
  sandbox.style.left = "-10000px";
  sandbox.style.top = "0";
  sandbox.style.pointerEvents = "none";
  sandbox.style.opacity = "0";

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  // --- EXPORT PNG ---
  htmlToImage
    .toPng(clone, {
      pixelRatio: 2,
      cacheBust: false,
      skipFonts: true,
    })
    .then((dataUrl) => {
      downloadPng(dataUrl, "results_device.png");
    })
    .catch((err) => {
      console.error("[PNG][A4.2] export failed", err);
    })
    .finally(() => {
      sandbox.remove();
    });
}

/* =========================================================
   DOWNLOAD HELPER
========================================================= */

function downloadPng(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
