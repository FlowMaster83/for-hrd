import { renderModalResults } from "./modalContent.js";

/* =========================================================
   UTILS
========================================================= */

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
  if (!contentNode) return;

  const modal = createModal();
  const body = modal.querySelector(".modal__body");

  body.innerHTML = "";
  body.appendChild(contentNode);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

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
    const resultsNode = renderModalResults();
    if (!resultsNode) return;

    openModal(resultsNode);
    return;
  }

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
