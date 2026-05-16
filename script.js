const WELCOME_STORAGE_KEY = "korsdub-site:welcome-seen";
const WELCOME_EXIT_DELAY = 520;

const body = document.body;
const welcomeScreen = document.querySelector("#welcomeScreen");
const enterSiteButton = document.querySelector("#enterSiteButton");

/**
 * Проверяет, сохранен ли признак уже показанного приветственного экрана.
 */
function hasSeenWelcome() {
  try {
    return window.localStorage.getItem(WELCOME_STORAGE_KEY) === "true";
  } catch (error) {
    return false;
  }
}

/**
 * Безопасно сохраняет признак входа, если браузер разрешает работу с localStorage.
 */
function rememberWelcomeSeen() {
  try {
    window.localStorage.setItem(WELCOME_STORAGE_KEY, "true");
  } catch (error) {
    return false;
  }

  return true;
}

/**
 * Показывает приветственный экран только тем посетителям, которые еще не входили на сайт.
 */
function applyWelcomeState() {
  const shouldHideWelcome = hasSeenWelcome();

  body.classList.toggle("welcome-seen", shouldHideWelcome);
  body.classList.remove("welcome-exiting");
  body.classList.toggle("welcome-visible", !shouldHideWelcome);
  welcomeScreen?.setAttribute("aria-hidden", String(shouldHideWelcome));
}

/**
 * Запускает визуальное закрытие приветственного экрана и фиксирует финальное состояние.
 */
function hideWelcomeScreen() {
  body.classList.add("welcome-exiting");
  body.classList.remove("welcome-visible");
  welcomeScreen?.setAttribute("aria-hidden", "true");

  window.setTimeout(() => {
    body.classList.add("welcome-seen");
    body.classList.remove("welcome-exiting");
  }, WELCOME_EXIT_DELAY);
}

/**
 * Запоминает первый вход посетителя и плавно скрывает приветственный экран.
 */
function enterSite() {
  rememberWelcomeSeen();
  hideWelcomeScreen();
}

applyWelcomeState();
enterSiteButton?.addEventListener("click", enterSite);
