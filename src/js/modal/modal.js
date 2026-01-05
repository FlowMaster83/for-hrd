export function initModal() {
  createModalMarkup();
  bindModalEvents();
}

function createModalMarkup() {
  const modalHTML = `
    <div class="modal-backdrop" id="resultModal" hidden>
      <div class="modal">
        <div class="modal-viewport" id="modalViewport"></div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function bindModalEvents() {
  const modal = document.getElementById("resultModal");
  const viewport = document.getElementById("modalViewport");

  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-open-modal]")) {
      renderSnapshot(viewport);
      modal.hidden = false;
    }

    if (e.target === modal) {
      closeModal(modal, viewport);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) {
      closeModal(modal, viewport);
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.hidden = true;
      viewport.innerHTML = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) {
      modal.hidden = true;
      viewport.innerHTML = "";
    }
  });
}

function closeModal(modal, viewport) {
  modal.hidden = true;
  viewport.innerHTML = "";
}

function renderSnapshot(viewport) {
  const source = document.getElementById("scales-container");
  if (!source) return;

  const clone = source.cloneNode(true);
  clone.classList.add("view-only");

  viewport.innerHTML = "";
  viewport.appendChild(clone);
}
