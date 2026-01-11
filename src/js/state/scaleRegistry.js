// scaleRegistry.js
// Глобальный реестр шкал для CLEAR ALL

const scales = new Set();

/**
 * Регистрирует шкалу
 * @param {{ reset: Function }} api
 */
export function registerScale(api) {
  if (!api || typeof api.reset !== "function") return;
  scales.add(api);
}

/**
 * Сбрасывает все шкалы:
 * - значения
 * - маркеры
 * - визуальное состояние
 */
export function resetAllScales() {
  scales.forEach((scale) => {
    scale.reset();
  });
}
