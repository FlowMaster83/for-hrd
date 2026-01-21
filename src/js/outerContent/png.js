/* =========================================================
   PNG EXPORT — CANONICAL (ALL DEVICES)
   Fixed render width: 768px
   Independent from viewport
========================================================= */

/* global htmlToImage */

const EXPORT_WIDTH = 768;

export function exportResultsToPng() {
  // 🔑 Берём контент модалки, даже если UI mobile
  const source = document.querySelector(".modal__content");

  if (!source) {
    console.error("[PNG] .modal__content not found");
    return;
  }

  // --- CLONE ---
  const clone = source.cloneNode(true);

  // --- FORCE CANONICAL WIDTH ---
  clone.style.width = `${EXPORT_WIDTH}px`;
  clone.style.minWidth = `${EXPORT_WIDTH}px`;
  clone.style.maxWidth = `${EXPORT_WIDTH}px`;

  // --- UNLIMIT HEIGHT ---
  clone.style.maxHeight = "none";
  clone.style.height = "auto";
  clone.style.overflow = "visible";

  const body = clone.querySelector(".modal__body");
  if (body) {
    body.style.maxHeight = "none";
    body.style.height = "auto";
    body.style.overflow = "visible";
  }

  // --- REMOVE UI CONTROLS ---
  clone.querySelector(".modal-close-btn")?.remove();

  // --- SANDBOX ---
  const sandbox = document.createElement("div");
  sandbox.style.position = "fixed";
  sandbox.style.left = "-10000px";
  sandbox.style.top = "0";
  sandbox.style.width = `${EXPORT_WIDTH}px`;
  sandbox.style.pointerEvents = "none";
  sandbox.style.opacity = "0";

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  // --- EXPORT ---
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
      console.error("[PNG] export failed", err);
    })
    .finally(() => {
      sandbox.remove();
    });
}

/* =========================================================
   DOWNLOAD
========================================================= */

function downloadPng(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
