// header/createHeaderControls.js
export function createHeaderControls(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return null;

  root.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "header-options";

  /* -----------------------------
     LABEL
  ----------------------------- */

  const label = document.createElement("p");
  label.className = "header-label";
  label.textContent = "Fill all:";

  /* -----------------------------
     SELECT
  ----------------------------- */

  const select = document.createElement("select");
  select.className = "user-select";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "select %";
  placeholder.disabled = true;
  placeholder.hidden = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  for (let value = 10; value <= 100; value += 10) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = `${value}%`;
    select.appendChild(option);
  }

  /* -----------------------------
     BUTTONS
  ----------------------------- */

  const fillBtn = document.createElement("button");
  fillBtn.className = "fill-btn";
  fillBtn.type = "button";
  fillBtn.disabled = true;
  fillBtn.textContent = "FILL";

  const clearBtn = document.createElement("button");
  clearBtn.className = "clear-all-btn";
  clearBtn.type = "button";
  clearBtn.textContent = "CLEAR ALL";

  const resultBtn = document.createElement("button");
  resultBtn.className = "header-result-btn";
  resultBtn.type = "button";
  resultBtn.textContent = "RESULT";
  resultBtn.dataset.openModal = "true";

  /* -----------------------------
     LANGUAGE TOGGLE
  ----------------------------- */

  const langBtn = document.createElement("button");
  langBtn.className = "lang-toggle-btn";
  langBtn.type = "button";
  langBtn.textContent = "UA"; // стартовый язык

  /* -----------------------------
     APPEND
  ----------------------------- */

  wrapper.append(label, select, fillBtn, clearBtn, resultBtn, langBtn);

  root.appendChild(wrapper);

  return {
    select,
    fillBtn,
    clearBtn,
    resultBtn,
    langBtn,
  };
}
