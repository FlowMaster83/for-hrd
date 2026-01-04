export function createHeaderControls(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return null;

  const wrapper = document.createElement("div");
  wrapper.className = "header-options";

  // label
  const labelText = document.createElement("p");
  labelText.textContent = "Fill all:";

  // select
  const select = document.createElement("select");
  select.className = "user-select";
  select.id = "main-select";

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

  wrapper.append(
    labelText,
    select,
    fillBtn,
    clearBtn
  );

  root.appendChild(wrapper);

  return { select, fillBtn, clearBtn };
}
