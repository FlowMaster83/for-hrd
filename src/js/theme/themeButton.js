import { toggleTheme, getTheme } from "./dark.js";

/**
 * Создаёт кнопку переключения темы
 * ⚠️ Контейнер ОБЯЗАТЕЛЕН
 */
export function createThemeToggleButton(container) {
  if (!container) return;

  // защита от дублирования
  if (container.querySelector("[data-toggle-theme]")) return;

  const button = document.createElement("button");

  button.type = "button";
  button.setAttribute("aria-label", "Toggle theme");
  button.dataset.toggleTheme = "";

  updateButtonLabel(button);

  button.addEventListener("click", () => {
    toggleTheme();
    updateButtonLabel(button);
  });

  container.appendChild(button);
}

function updateButtonLabel(button) {
  const isDark = getTheme() === "dark";
  button.textContent = isDark ? "☀️" : "🌙";
}
