// src/js/modal/modal.js
import { renderModalResults } from "./modalContent.js";

const MODAL_MIN_WIDTH = 641;

let modalRoot = null;
let lastFocusedElement = null;

function isModalAllowed() {
  return window.innerWidth >= MODAL_MIN_WIDTH;
}

function isModalOpen() {
  return modalRoot?.classList.contains("is-open");
}

function createModal() {
  if (modalRoot) return modalRoot;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div class="modal__overlay" data-close-modal></div>
    <div class="modal__wrap">
      <div class="modal__content" role="dialog" aria-modal="true">
        <button class="modal-close-btn" data-close-modal>×</button>
        <section class="modal__body"></section>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modalRoot = modal;
  return modalRoot;
}

let scrollY = 0;

export function openModal() {
  if (!isModalAllowed()) return;

  scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";

  lastFocusedElement = document.activeElement;

  const modal = createModal();
  const body = modal.querySelector(".modal__body");

  body.innerHTML = "";
  body.appendChild(renderModalResults().content);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  modal.querySelector(".modal-close-btn")?.focus();

  document.dispatchEvent(new Event("modal:open"));
}

export function closeModal() {
  if (!isModalOpen()) return;

  // 1. Если фокус внутри модалки — убираем его
  const active = document.activeElement;
  if (modalRoot.contains(active)) {
    active.blur();
  }

  // 2. Возвращаем фокус туда, откуда пришли
  if (lastFocusedElement?.focus) {
    lastFocusedElement.focus();
  }

  // 3. Теперь безопасно скрываем модалку
  modalRoot.classList.remove("is-open");
  modalRoot.setAttribute("aria-hidden", "true");

  modalRoot.querySelector(".modal__body").innerHTML = "";

  // 4. Восстанавливаем скролл
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);

  document.dispatchEvent(new Event("modal:close"));
}

/* GLOBAL EVENTS */

document.addEventListener("click", (e) => {
  if (e.target.closest("[data-open-modal]")) openModal();
  if (e.target.closest("[data-close-modal]")) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isModalOpen()) closeModal();
});

window.addEventListener("resize", () => {
  if (!isModalAllowed() && isModalOpen()) {
    closeModal();
  }
});
