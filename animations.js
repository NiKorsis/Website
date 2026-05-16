const animatedHero = document.querySelector(".hero");
const animationRoot = document.documentElement;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const defaultCursorPosition = { x: 0.5, y: 0.48 };

let latestCursorPosition = defaultCursorPosition;
let cursorFrameRequest = 0;

/**
 * Ограничивает число в диапазоне, чтобы курсор не выводил световой слой за пределы героя.
 */
function clampCursorValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Переводит позицию указателя внутри главного экрана в относительные координаты.
 */
function getCursorPosition(event) {
  const heroRect = animatedHero.getBoundingClientRect();
  const x = clampCursorValue((event.clientX - heroRect.left) / heroRect.width, 0, 1);
  const y = clampCursorValue((event.clientY - heroRect.top) / heroRect.height, 0, 1);

  return { x, y };
}

/**
 * Передает координаты курсора в CSS-переменные для свечения и мягкого наклона контента.
 */
function paintCursorPosition(position) {
  const tiltX = (0.5 - position.y) * 4.8;
  const tiltY = (position.x - 0.5) * 6.2;

  animationRoot.style.setProperty("--cursor-x", `${(position.x * 100).toFixed(2)}%`);
  animationRoot.style.setProperty("--cursor-y", `${(position.y * 100).toFixed(2)}%`);
  animationRoot.style.setProperty("--cursor-tilt-x", `${tiltX.toFixed(2)}deg`);
  animationRoot.style.setProperty("--cursor-tilt-y", `${tiltY.toFixed(2)}deg`);
}

/**
 * Ставит перерисовку в следующий кадр, чтобы движение оставалось плавным и легким для браузера.
 */
function scheduleCursorPaint() {
  if (cursorFrameRequest) {
    return;
  }

  cursorFrameRequest = window.requestAnimationFrame(() => {
    paintCursorPosition(latestCursorPosition);
    cursorFrameRequest = 0;
  });
}

/**
 * Обновляет интерактивный фон при движении курсора по главному экрану.
 */
function trackHeroCursor(event) {
  latestCursorPosition = getCursorPosition(event);
  document.body.classList.remove("cursor-idle");
  scheduleCursorPaint();
}

/**
 * Возвращает подсветку в центр, когда курсор покидает главный экран.
 */
function resetCursorField() {
  latestCursorPosition = defaultCursorPosition;
  document.body.classList.add("cursor-idle");
  paintCursorPosition(defaultCursorPosition);
}

/**
 * Подключает интерактивный фон только когда на устройстве доступен курсор и разрешены анимации.
 */
function bindCursorField() {
  resetCursorField();

  if (!animatedHero || reducedMotionQuery.matches || !window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  animatedHero.addEventListener("pointermove", trackHeroCursor, { passive: true });
  animatedHero.addEventListener("pointerleave", resetCursorField);
}

bindCursorField();
