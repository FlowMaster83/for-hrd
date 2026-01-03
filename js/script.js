/**
 * HireBox™ Scale System - FINAL VERSION
 * Логіка: Взаємовиключні маркери (STAR, CIRCLE, DOTTED) - всі червоні та контурні.
 */

const LABELS = [
  "1. Передбачуваність", "2. Енергія", "3. Ентузіазм", "4. Наполегливість",
  "5. Самоконтроль", "6. Цілеспрямованість", "7. Комунікація", "8. Взаєморозуміння",
  "9. Впевненість в собі", "10. Об'єктивність", "11. Толерантність", "12. Організованість",
  "13. Інтерес", "14. Обмін", "15. Результати", "16. Кваліфікації",
  "17. Командний дух", "18. Основні принципи", "19. Тиск на роботі", "20. Готовність до роботи"
];

const container = document.getElementById("scales-container");

function createScaleRow(labelTitle) {
  const row = document.createElement("div");
  row.className = "scale-row";

  row.innerHTML = `
    <div class="label">${labelTitle}: <span class="percent-value">0</span></div>
    
    <div class="chart-wrapper">
      <div class="chart-track">
        <div class="chart-fill"></div>
      </div>
      
      <div class="chart-marker marker-solid"></div>
      <div class="chart-marker marker-dotted"></div>
      <div class="chart-marker marker-star"></div>
      
      <div class="ticks">
        <span class="tick" style="left:0%">0</span>
        <span class="tick" style="left:50%">50</span>
        <span class="tick" style="left:100%">100</span>
      </div>
    </div>

    <input class="user-input" type="number" placeholder="0" min="0" max="100">
    
    <button class="clear-btn" type="button">CLEAR</button>
    <button class="star-btn" type="button">STAR</button>
    <button class="circle-btn" type="button">CIRCLE</button>
    <button class="dotted-btn" type="button">DOTTED</button>
  `;

  const input = row.querySelector(".user-input");
  const fill = row.querySelector(".chart-fill");
  const percentLabel = row.querySelector(".percent-value");
  
  const mSolid = row.querySelector(".marker-solid");
  const mDotted = row.querySelector(".marker-dotted");
  const mStar = row.querySelector(".marker-star");
  
  const btnStar = row.querySelector(".star-btn");
  const btnCircle = row.querySelector(".circle-btn");
  const btnDotted = row.querySelector(".dotted-btn");
  const btnClear = row.querySelector(".clear-btn");

  // Автовиділення при фокусі
  input.addEventListener("focus", () => input.select());

  // Синхронізація шкали та маркерів
  const syncVisuals = () => {
    const val = input.value || 0;
    fill.style.width = `${val}%`;
    percentLabel.textContent = val;
    
    [mSolid, mDotted, mStar].forEach(m => {
      if (m.classList.contains("active")) m.style.left = `${val}%`;
    });
  };

  input.addEventListener("input", (e) => {
    let val = e.target.value;
    if (val !== "") {
      val = Math.min(100, Math.max(0, parseInt(val) || 0));
      e.target.value = val;
    }
    syncVisuals();
  });

  // Логіка Toggle для трьох маркерів
  const toggleMarker = (targetType) => {
    const val = input.value || 0;
    const activeColor = "#ffe6e6"; // Світло-червоний фон для активної кнопки
    
    const configs = {
      star:   { marker: mStar,   btn: btnStar },
      solid:  { marker: mSolid,  btn: btnCircle },
      dotted: { marker: mDotted, btn: btnDotted }
    };

    const target = configs[targetType];
    const isAlreadyActive = target.marker.classList.contains("active");

    // Скидаємо всі маркери та кнопки в цьому рядку
    [mSolid, mDotted, mStar].forEach(m => m.classList.remove("active"));
    [btnStar, btnCircle, btnDotted].forEach(b => {
      b.style.backgroundColor = "";
      b.style.borderColor = "";
    });

    // Якщо натиснута кнопка не була активною — вмикаємо її маркер
    if (!isAlreadyActive) {
      target.marker.classList.add("active");
      target.marker.style.left = `${val}%`;
      target.btn.style.backgroundColor = activeColor;
      target.btn.style.borderColor = "#ff0000";
    }
  };

  btnStar.addEventListener("click", () => toggleMarker('star'));
  btnCircle.addEventListener("click", () => toggleMarker('solid'));
  btnDotted.addEventListener("click", () => toggleMarker('dotted'));

  btnClear.addEventListener("click", () => {
    input.value = "";
    [mSolid, mDotted, mStar].forEach(m => m.classList.remove("active"));
    [btnStar, btnCircle, btnDotted].forEach(b => {
      b.style.backgroundColor = "";
      b.style.borderColor = "";
    });
    syncVisuals();
  });

  container.appendChild(row);
}

LABELS.forEach(l => createScaleRow(l));

// Глобальні кнопки (Header)
document.querySelector(".fill-btn").addEventListener("click", () => {
  const val = document.getElementById("main-select").value;
  document.querySelectorAll(".scale-row").forEach(row => {
    const inp = row.querySelector(".user-input");
    inp.value = val;
    inp.dispatchEvent(new Event('input'));
  });
});

document.querySelector(".clear-all-btn").addEventListener("click", () => {
  document.querySelectorAll(".scale-row").forEach(row => {
    row.querySelector(".clear-btn").click();
  });
});