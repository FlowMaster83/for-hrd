// header/createHeaderControls.js
export function createHeaderControls(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return null;

  root.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "header-options";

  // label
  const label = document.createElement("p");
  label.className = "header-label";
  label.textContent = "Fill all:";

  // select
  const select = document.createElement("select");
  select.className = "user-select";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "— select % —";
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

  // buttons
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

  wrapper.append(
    label,
    select,
    fillBtn,
    clearBtn,
    resultBtn
  );

  root.appendChild(wrapper);

  return {
    select,
    fillBtn,
    clearBtn,
    resultBtn,
  };
}
