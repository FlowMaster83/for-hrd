import { renderModalResults } from "./modalContent.js";

const MODAL_BREAKPOINT = 768;

/* =========================================================
   UTILS
========================================================= */

function isModalAllowed() {
  return window.innerWidth >= MODAL_BREAKPOINT;
}

/* =========================================================
   STATE
========================================================= */

let modalRoot = null;

/* =========================================================
   MODAL CREATION
========================================================= */

function createModal() {
  if (modalRoot) return modalRoot;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div class="modal__overlay" data-close-modal></div>

    <div class="modal__content" role="dialog" aria-modal="true">
      <section class="modal__body"></section>
    </div>
  `;

  document.body.appendChild(modal);
  modalRoot = modal;

  return modalRoot;
}

/* =========================================================
   OPEN / CLOSE
========================================================= */

export function openModal(contentNode) {
  if (!isModalAllowed()) return;
  if (!contentNode) return;

  const modal = createModal();
  const body = modal.querySelector(".modal__body");

  body.innerHTML = "";
  body.appendChild(contentNode);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  // optional: блокируем скролл страницы
  document.body.style.overflow = "hidden";
}

export function closeModal() {
  if (!modalRoot) return;

  modalRoot.classList.remove("is-open");
  modalRoot.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

/* =========================================================
   GLOBAL EVENTS
========================================================= */

document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open-modal]");

  if (openBtn) {
    // ⛔ mobile: модалки не существует
    if (!isModalAllowed()) return;

    const resultsNode = renderModalResults();
    if (!resultsNode) return;

    openModal(resultsNode);
    return;
  }

  // закрытие ТОЛЬКО по клику на backdrop
  if (e.target.closest("[data-close-modal]")) {
    closeModal();
  }
});

/* =========================================================
   SAFETY: RESIZE
========================================================= */

window.addEventListener("resize", () => {
  if (!isModalAllowed()) {
    closeModal();
  }
});
