const WELCOME_STORAGE_KEY = "korsdub-site:welcome-seen";
const WELCOME_EXIT_DELAY = 520;
const CONTACTS_STORAGE_KEY = "korsdub-site:contacts-data";
const ADMIN_SESSION_KEY = "korsdub-site:admin-session";
const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "admin";
const CURSOR_EASE = 0.12;
const CURSOR_SETTLE_DISTANCE = 0.0006;

const body = document.body;
const root = document.documentElement;
const welcomeScreen = document.querySelector("#welcomeScreen");
const enterSiteButton = document.querySelector("#enterSiteButton");
const navigationLinks = [...document.querySelectorAll('a[href^="#"]')];
const sectionTargets = [...document.querySelectorAll("#home, #about, #services, #portfolio, #demo, #contacts")];
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointerQuery = window.matchMedia("(pointer: fine)");

const contactCategories = [
  { id: "actors", title: "Актеры дубляжа" },
  { id: "sound", title: "Звукорежиссеры" },
  { id: "translators", title: "Переводчики" },
  { id: "editors", title: "Монтажеры" }
];

const defaultContactsData = {
  settings: {
    email: "nikorsis666@gmail.com",
    ctaTitle: "Есть задача? Свяжитесь с нами",
    ctaText: "Расскажите о проекте - подберем команду и предложим лучшее решение для вашей задачи.",
    ctaButtonText: "Обсудить проект",
    ctaButtonHref: "mailto:nikorsis666@gmail.com"
  },
  links: [
    { id: "telegram", title: "Telegram", url: "https://t.me/MAD_DUBING" },
    { id: "boosty", title: "Boosty", url: "https://boosty.to/mad_dub" },
    { id: "youtube", title: "YouTube", url: "https://www.youtube.com/@KORS_DUB" },
    { id: "discord", title: "Discord", url: "https://discord.gg/squtTpyJFT" }
  ],
  people: [
    { id: "anton-mironov", category: "actors", name: "Антон Миронов", role: "Актер дубляжа", telegram: "@antonvoice", email: "anton.mironov@studio.ru", phone: "+7 (985) 123-45-67", specialty: "Специализация: игровые персонажи, кино, рекламные ролики", avatar: "" },
    { id: "elizaveta-smirnova", category: "actors", name: "Елизавета Смирнова", role: "Актриса дубляжа", telegram: "@liza.voice", email: "elizaveta.smirnova@studio.ru", phone: "+7 (926) 234-56-78", specialty: "Специализация: женские роли, анимация, озвучка брендов", avatar: "" },
    { id: "igor-kovalev", category: "sound", name: "Игорь Ковалев", role: "Звукорежиссер", telegram: "@igor_kovalev_sound", email: "igor.kovalev@studio.ru", phone: "+7 (977) 345-67-89", specialty: "Специализация: сведение диалогов, шумодизайн, постпродакшн", avatar: "" },
    { id: "maria-vorontsova", category: "sound", name: "Мария Воронцова", role: "Звукорежиссер", telegram: "@maria_soundpro", email: "maria.vorontsova@studio.ru", phone: "+7 (968) 456-78-90", specialty: "Специализация: запись вокала, обработка, атмосферы", avatar: "" },
    { id: "alex-gromov", category: "translators", name: "Алексей Громов", role: "Переводчик", telegram: "@alex_gromov_trans", email: "alex.gromov@studio.ru", phone: "+7 (910) 567-89-01", specialty: "Специализация: локализация фильмов, сериалов, игр", avatar: "" },
    { id: "olga-belova", category: "translators", name: "Ольга Белова", role: "Переводчик", telegram: "@olga_translate", email: "olga.belova@studio.ru", phone: "+7 (915) 678-90-12", specialty: "Специализация: адаптация диалогов, креативный перевод", avatar: "" },
    { id: "dmitry-sokolov", category: "editors", name: "Дмитрий Соколов", role: "Монтажер", telegram: "@dmitry_edit", email: "dmitry.sokolov@studio.ru", phone: "+7 (916) 789-01-23", specialty: "Специализация: монтаж диалогов, тайминг, финальная сборка", avatar: "" },
    { id: "natalia-morozova", category: "editors", name: "Наталья Морозова", role: "Монтажер", telegram: "@morozova_edit", email: "natalia.morozova@studio.ru", phone: "+7 (925) 890-12-34", specialty: "Специализация: чистка звука, шумы, реставрация", avatar: "" }
  ]
};

let latestCursorPosition = { x: 0.5, y: 0.48 };
let paintedCursorPosition = { ...latestCursorPosition };
let cursorFrameRequest = 0;
let navigationTimer = 0;
let avatarDraft = "";
let editingPersonId = "";

/** Проверяет, видел ли посетитель приветственный экран. */
function hasSeenWelcome() {
  try {
    return window.localStorage.getItem(WELCOME_STORAGE_KEY) === "true";
  } catch (error) {
    return false;
  }
}

/** Сохраняет отметку о первом входе на сайт. */
function rememberWelcomeSeen() {
  try {
    window.localStorage.setItem(WELCOME_STORAGE_KEY, "true");
  } catch (error) {
    return false;
  }
  return true;
}

/** Синхронизирует состояние приветственного экрана с localStorage. */
function applyWelcomeState() {
  const shouldHideWelcome = hasSeenWelcome();
  body.classList.toggle("welcome-seen", shouldHideWelcome);
  body.classList.remove("welcome-exiting");
  body.classList.toggle("welcome-visible", !shouldHideWelcome);
  welcomeScreen?.setAttribute("aria-hidden", String(shouldHideWelcome));
}

/** Запускает плавное скрытие приветственного экрана. */
function hideWelcomeScreen() {
  body.classList.add("welcome-exiting");
  body.classList.remove("welcome-visible");
  welcomeScreen?.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    body.classList.add("welcome-seen");
    body.classList.remove("welcome-exiting");
  }, WELCOME_EXIT_DELAY);
}

/** Запоминает вход и закрывает приветственный экран. */
function enterSite() {
  rememberWelcomeSeen();
  hideWelcomeScreen();
}

/** Ограничивает значение координаты курсора. */
function clampCursorValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Передает сглаженную позицию курсора в CSS-переменные фона. */
function paintCursorPosition(position) {
  const distanceX = position.x - 0.5;
  const distanceY = position.y - 0.5;
  root.style.setProperty("--cursor-x", `${(position.x * 100).toFixed(2)}%`);
  root.style.setProperty("--cursor-y", `${(position.y * 100).toFixed(2)}%`);
  root.style.setProperty("--cursor-screen-x", `${(position.x * window.innerWidth).toFixed(1)}px`);
  root.style.setProperty("--cursor-screen-y", `${(position.y * window.innerHeight).toFixed(1)}px`);
  root.style.setProperty("--cursor-tilt-x", `${((0.5 - position.y) * 2.8).toFixed(2)}deg`);
  root.style.setProperty("--cursor-tilt-y", `${((position.x - 0.5) * 3.6).toFixed(2)}deg`);
  root.style.setProperty("--cursor-parallax-x", `${(distanceX * 1.65).toFixed(2)}rem`);
  root.style.setProperty("--cursor-parallax-y", `${(distanceY * 1.25).toFixed(2)}rem`);
  root.style.setProperty("--cursor-grid-x", `${(distanceX * 22).toFixed(1)}px`);
  root.style.setProperty("--cursor-grid-y", `${(distanceY * 18).toFixed(1)}px`);
}

/** Возвращает расстояние между текущей и целевой точкой курсора. */
function getCursorDistance(currentPosition, targetPosition) {
  return Math.hypot(currentPosition.x - targetPosition.x, currentPosition.y - targetPosition.y);
}

/** Плавно приближает фон к реальной позиции курсора. */
function easeCursorPosition() {
  paintedCursorPosition = {
    x: paintedCursorPosition.x + (latestCursorPosition.x - paintedCursorPosition.x) * CURSOR_EASE,
    y: paintedCursorPosition.y + (latestCursorPosition.y - paintedCursorPosition.y) * CURSOR_EASE
  };

  if (getCursorDistance(paintedCursorPosition, latestCursorPosition) <= CURSOR_SETTLE_DISTANCE) {
    paintedCursorPosition = { ...latestCursorPosition };
    paintCursorPosition(paintedCursorPosition);
    cursorFrameRequest = 0;
    return;
  }

  paintCursorPosition(paintedCursorPosition);
  cursorFrameRequest = window.requestAnimationFrame(easeCursorPosition);
}

/** Планирует перерисовку интерактивного фона. */
function scheduleCursorPaint() {
  if (!cursorFrameRequest) {
    cursorFrameRequest = window.requestAnimationFrame(easeCursorPosition);
  }
}

/** Обновляет цель движения фона по координатам курсора. */
function trackCursor(event) {
  latestCursorPosition = {
    x: clampCursorValue(event.clientX / window.innerWidth, 0, 1),
    y: clampCursorValue(event.clientY / window.innerHeight, 0, 1)
  };
  body.classList.remove("cursor-idle");
  scheduleCursorPaint();
}

/** Возвращает фон в спокойное центральное состояние. */
function resetCursorField() {
  latestCursorPosition = { x: 0.5, y: 0.48 };
  body.classList.add("cursor-idle");
  scheduleCursorPaint();
}

/** Обновляет пиксельные координаты свечения после изменения окна. */
function refreshCursorViewport() {
  paintCursorPosition(paintedCursorPosition);
}

/** Подключает интерактивный фон для устройств с точным курсором. */
function bindCursorField() {
  resetCursorField();
  if (reducedMotionQuery.matches || !finePointerQuery.matches) return;
  window.addEventListener("pointermove", trackCursor, { passive: true });
  window.addEventListener("pointerleave", resetCursorField);
  window.addEventListener("resize", refreshCursorViewport, { passive: true });
}

/** Безопасно получает секцию из hash-ссылки. */
function getSectionFromHash(hash) {
  if (!hash || hash === "#") return null;
  try {
    return document.querySelector(hash);
  } catch (error) {
    return null;
  }
}

/** Плавно переводит страницу к выбранному разделу. */
function handleSmoothNavigation(event) {
  const target = getSectionFromHash(event.currentTarget.hash);
  if (!target) return;
  event.preventDefault();
  body.classList.add("is-navigating");
  window.clearTimeout(navigationTimer);
  target.scrollIntoView({ behavior: reducedMotionQuery.matches ? "auto" : "smooth", block: "start" });
  history.pushState(null, "", event.currentTarget.hash);
  navigationTimer = window.setTimeout(() => body.classList.remove("is-navigating"), 900);
}

/** Подсвечивает текущий пункт меню. */
function setActiveNavigation(sectionId) {
  navigationLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${sectionId}`));
}

/** Следит за видимым разделом и обновляет навигацию. */
function bindSectionObserver() {
  if (!sectionTargets.length || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    const visibleEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visibleEntry?.target?.id) setActiveNavigation(visibleEntry.target.id);
  }, { threshold: [0.24, 0.42, 0.62], rootMargin: "-18% 0px -42%" });
  sectionTargets.forEach((section) => observer.observe(section));
}

/** Клонирует данные, чтобы не мутировать шаблон напрямую. */
function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

/** Загружает сохраненные контакты администратора. */
function loadContactsData() {
  try {
    const savedData = JSON.parse(window.localStorage.getItem(CONTACTS_STORAGE_KEY));
    return savedData ? mergeContactsData(savedData) : cloneData(defaultContactsData);
  } catch (error) {
    return cloneData(defaultContactsData);
  }
}

/** Склеивает сохраненные данные с базовой структурой сайта. */
function mergeContactsData(savedData) {
  return {
    settings: { ...defaultContactsData.settings, ...(savedData.settings || {}) },
    links: Array.isArray(savedData.links) ? savedData.links : cloneData(defaultContactsData.links),
    people: Array.isArray(savedData.people) ? savedData.people : cloneData(defaultContactsData.people)
  };
}

let contactsData = loadContactsData();

/** Сохраняет контакты в браузере администратора. */
function saveContactsData() {
  window.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contactsData));
}

/** Возвращает значение или понятную заглушку. */
function valueOrFallback(value, fallback = "Не указано") {
  return value && String(value).trim() ? value : fallback;
}

/** Создает DOM-элемент с классом и текстом. */
function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

/** Делает безопасный href для ссылок и контактов. */
function normalizeHref(value, type = "link") {
  const cleanValue = String(value || "").trim();
  if (!cleanValue) return "#";
  if (type === "email") return `mailto:${cleanValue}`;
  if (type === "phone") return `tel:${cleanValue.replace(/[^+\d]/g, "")}`;
  if (type === "telegram" && cleanValue.startsWith("@")) return `https://t.me/${cleanValue.slice(1)}`;
  if (/^(https?:|mailto:|tel:)/i.test(cleanValue)) return cleanValue;
  return `https://${cleanValue}`;
}

/** Получает инициалы для аватарки без изображения. */
function getInitials(name) {
  return String(name || "?").trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
}

/** Создает строку контакта в карточке человека. */
function createContactRow(value, type) {
  const row = createElement("a", "contact-card__row", valueOrFallback(value));
  row.href = normalizeHref(value, type);
  if (type !== "email" && type !== "phone") row.target = "_blank";
  if (type !== "email" && type !== "phone") row.rel = "noreferrer";
  return row;
}

/** Создает аватарку человека из изображения или инициалов. */
function createAvatar(person) {
  const avatar = createElement("span", "contact-card__avatar");
  if (person.avatar) {
    avatar.style.backgroundImage = `url(${person.avatar})`;
    avatar.setAttribute("aria-label", `Аватар: ${person.name}`);
  } else {
    avatar.textContent = getInitials(person.name);
  }
  return avatar;
}

/** Создает публичную карточку контакта. */
function createPersonCard(person) {
  const card = createElement("article", "contact-card");
  const head = createElement("div", "contact-card__head");
  const info = createElement("div", "contact-card__info");
  info.append(createElement("h4", "", valueOrFallback(person.name)), createElement("p", "", valueOrFallback(person.role)));
  head.append(createAvatar(person), info);
  card.append(head, createContactRow(person.telegram, "telegram"), createContactRow(person.email, "email"), createContactRow(person.phone, "phone"));
  card.append(createElement("p", "contact-card__specialty", valueOrFallback(person.specialty, "Специализация не указана")));
  return card;
}

/** Рендерит публичные контакты и ссылки. */
function renderContacts() {
  const grid = document.querySelector("#contactsGrid");
  const linksList = document.querySelector("#contactsLinksList");
  if (grid) {
    grid.innerHTML = "";
    contactCategories.forEach((category) => {
      const column = createElement("section", "contact-category");
      column.append(createElement("h3", "contact-category__title", category.title));
      contactsData.people.filter((person) => person.category === category.id).forEach((person) => column.append(createPersonCard(person)));
      grid.append(column);
    });
  }
  if (linksList) {
    linksList.innerHTML = "";
    contactsData.links.forEach((link) => {
      const item = createElement("a", "contacts-links__item", link.title);
      item.href = normalizeHref(link.url);
      item.target = "_blank";
      item.rel = "noreferrer";
      linksList.append(item);
    });
  }
  renderPublicSettings();
}

/** Обновляет публичные тексты контактного блока. */
function renderPublicSettings() {
  const email = contactsData.settings.email;
  const emailLink = document.querySelector("#contactsEmail");
  const ctaTitle = document.querySelector("#contactsCtaTitle");
  const ctaText = document.querySelector("#contactsCtaText");
  const ctaButton = document.querySelector("#contactsCtaButton");
  if (emailLink) {
    emailLink.textContent = valueOrFallback(email, "email не указан");
    emailLink.href = normalizeHref(email, "email");
  }
  if (ctaTitle) ctaTitle.textContent = contactsData.settings.ctaTitle;
  if (ctaText) ctaText.textContent = contactsData.settings.ctaText;
  if (ctaButton) {
    ctaButton.href = normalizeHref(contactsData.settings.ctaButtonHref);
    ctaButton.querySelector("span").textContent = contactsData.settings.ctaButtonText;
  }
}

/** Показывает статус в панели администратора. */
function setAdminStatus(message) {
  const status = document.querySelector("#adminStatus");
  if (status) status.textContent = message || "";
}

/** Проверяет активна ли админ-сессия. */
function isAdminActive() {
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

/** Переключает видимость рабочего пространства админки. */
function renderAdminState() {
  const loginForm = document.querySelector("#adminLoginForm");
  const workspace = document.querySelector("#adminWorkspace");
  const isAdmin = isAdminActive();
  if (loginForm) loginForm.hidden = isAdmin;
  if (workspace) workspace.hidden = !isAdmin;
  if (isAdmin) {
    hydrateSettingsForm();
    renderAdminLists();
  }
}

/** Открывает модальное окно администратора. */
function openAdminPanel() {
  const panel = document.querySelector("#adminPanel");
  if (!panel) return;
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  renderAdminState();
}

/** Закрывает модальное окно администратора. */
function closeAdminPanel() {
  const panel = document.querySelector("#adminPanel");
  if (!panel) return;
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  setAdminStatus("");
}

/** Заполняет форму настроек текущими данными. */
function hydrateSettingsForm() {
  const map = {
    contactEmailInput: contactsData.settings.email,
    ctaTitleInput: contactsData.settings.ctaTitle,
    ctaTextInput: contactsData.settings.ctaText,
    ctaButtonTextInput: contactsData.settings.ctaButtonText,
    ctaButtonHrefInput: contactsData.settings.ctaButtonHref
  };
  Object.entries(map).forEach(([id, value]) => {
    const input = document.querySelector(`#${id}`);
    if (input) input.value = value || "";
  });
}

/** Создает короткий id для новых элементов. */
function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Рендерит списки ссылок и людей в админке. */
function renderAdminLists() {
  const linksList = document.querySelector("#adminLinksList");
  const peopleList = document.querySelector("#adminPeopleList");
  if (linksList) {
    linksList.innerHTML = "";
    contactsData.links.forEach((link) => {
      const item = createElement("div", "admin-list__item");
      item.innerHTML = `<span>${link.title}</span><small>${link.url}</small><button class="admin-mini" data-remove-link="${link.id}" type="button">Удалить</button>`;
      linksList.append(item);
    });
  }
  if (peopleList) {
    peopleList.innerHTML = "";
    contactsData.people.forEach((person) => {
      const item = createElement("div", "admin-list__item");
      item.innerHTML = `<span>${person.name}</span><small>${person.role}</small><button class="admin-mini" data-edit-person="${person.id}" type="button">Изменить</button><button class="admin-mini" data-remove-person="${person.id}" type="button">Удалить</button>`;
      peopleList.append(item);
    });
  }
}

/** Выполняет вход в админку. */
function handleAdminLogin(event) {
  event.preventDefault();
  const login = document.querySelector("#adminLogin")?.value.trim();
  const password = document.querySelector("#adminPassword")?.value.trim();
  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    window.localStorage.setItem(ADMIN_SESSION_KEY, "true");
    setAdminStatus("Вход выполнен.");
    renderAdminState();
    return;
  }
  setAdminStatus("Неверный логин или пароль.");
}

/** Выходит из админки. */
function handleAdminLogout() {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
  renderAdminState();
  setAdminStatus("Вы вышли из профиля.");
}

/** Сохраняет публичные настройки контактов. */
function handleSettingsSave(event) {
  event.preventDefault();
  contactsData.settings = {
    email: document.querySelector("#contactEmailInput")?.value.trim() || "",
    ctaTitle: document.querySelector("#ctaTitleInput")?.value.trim() || defaultContactsData.settings.ctaTitle,
    ctaText: document.querySelector("#ctaTextInput")?.value.trim() || defaultContactsData.settings.ctaText,
    ctaButtonText: document.querySelector("#ctaButtonTextInput")?.value.trim() || defaultContactsData.settings.ctaButtonText,
    ctaButtonHref: document.querySelector("#ctaButtonHrefInput")?.value.trim() || "#contacts"
  };
  saveContactsData();
  renderContacts();
  setAdminStatus("Контактная информация сохранена.");
}

/** Добавляет новую ссылку. */
function handleLinkAdd(event) {
  event.preventDefault();
  const titleInput = document.querySelector("#linkTitleInput");
  const urlInput = document.querySelector("#linkUrlInput");
  const title = titleInput?.value.trim();
  const url = urlInput?.value.trim();
  if (!title || !url) return setAdminStatus("Введите название и ссылку.");
  contactsData.links.push({ id: createId("link"), title, url });
  titleInput.value = "";
  urlInput.value = "";
  saveContactsData();
  renderContacts();
  renderAdminLists();
}

/** Подставляет человека в форму редактирования. */
function editPerson(personId) {
  const person = contactsData.people.find((item) => item.id === personId);
  if (!person) return;
  editingPersonId = person.id;
  avatarDraft = person.avatar || "";
  const fields = {
    personIdInput: person.id,
    personCategoryInput: person.category,
    personNameInput: person.name,
    personRoleInput: person.role,
    personTelegramInput: person.telegram,
    personEmailInput: person.email,
    personPhoneInput: person.phone,
    personSpecialtyInput: person.specialty
  };
  Object.entries(fields).forEach(([id, value]) => {
    const input = document.querySelector(`#${id}`);
    if (input) input.value = value || "";
  });
  renderAvatarPreview();
}

/** Очищает форму человека. */
function resetPersonForm() {
  editingPersonId = "";
  avatarDraft = "";
  document.querySelector("#personForm")?.reset();
  renderAvatarPreview();
}

/** Собирает данные человека из формы. */
function getPersonFromForm() {
  return {
    id: editingPersonId || createId("person"),
    category: document.querySelector("#personCategoryInput")?.value || "actors",
    name: document.querySelector("#personNameInput")?.value.trim() || "Без имени",
    role: document.querySelector("#personRoleInput")?.value.trim() || "Роль не указана",
    telegram: document.querySelector("#personTelegramInput")?.value.trim() || "",
    email: document.querySelector("#personEmailInput")?.value.trim() || "",
    phone: document.querySelector("#personPhoneInput")?.value.trim() || "",
    specialty: document.querySelector("#personSpecialtyInput")?.value.trim() || "",
    avatar: avatarDraft
  };
}

/** Сохраняет нового или отредактированного человека. */
function handlePersonSave(event) {
  event.preventDefault();
  const person = getPersonFromForm();
  const index = contactsData.people.findIndex((item) => item.id === person.id);
  if (index >= 0) contactsData.people[index] = person;
  else contactsData.people.push(person);
  saveContactsData();
  renderContacts();
  renderAdminLists();
  resetPersonForm();
  setAdminStatus("Контакт сохранен.");
}

/** Рендерит предпросмотр аватарки в форме. */
function renderAvatarPreview() {
  const preview = document.querySelector("#avatarPreview");
  if (!preview) return;
  preview.style.backgroundImage = avatarDraft ? `url(${avatarDraft})` : "";
  preview.textContent = avatarDraft ? "" : "Нет";
}

/** Читает выбранную аватарку как data URL. */
function readAvatarFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Сохраняет выбранное изображение в черновик аватарки. */
async function handleAvatarChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  avatarDraft = await readAvatarFile(file);
  renderAvatarPreview();
}

/** Сбрасывает локально сохраненные контакты. */
function resetAllContactsData() {
  contactsData = cloneData(defaultContactsData);
  window.localStorage.removeItem(CONTACTS_STORAGE_KEY);
  resetPersonForm();
  renderContacts();
  renderAdminState();
  setAdminStatus("Локальные данные сброшены.");
}

/** Обрабатывает клики по спискам администратора. */
function handleAdminListClick(event) {
  const removeLinkId = event.target.dataset.removeLink;
  const editPersonId = event.target.dataset.editPerson;
  const removePersonId = event.target.dataset.removePerson;
  if (removeLinkId) contactsData.links = contactsData.links.filter((link) => link.id !== removeLinkId);
  if (editPersonId) return editPerson(editPersonId);
  if (removePersonId) contactsData.people = contactsData.people.filter((person) => person.id !== removePersonId);
  if (removeLinkId || removePersonId) {
    saveContactsData();
    renderContacts();
    renderAdminLists();
  }
}

/** Подключает события панели администратора. */
function bindAdminEvents() {
  document.querySelector("#adminOpenButton")?.addEventListener("click", openAdminPanel);
  document.querySelectorAll("[data-admin-close]").forEach((item) => item.addEventListener("click", closeAdminPanel));
  document.querySelector("#adminLoginForm")?.addEventListener("submit", handleAdminLogin);
  document.querySelector("#adminLogoutButton")?.addEventListener("click", handleAdminLogout);
  document.querySelector("#siteSettingsForm")?.addEventListener("submit", handleSettingsSave);
  document.querySelector("#linkForm")?.addEventListener("submit", handleLinkAdd);
  document.querySelector("#personForm")?.addEventListener("submit", handlePersonSave);
  document.querySelector("#personResetButton")?.addEventListener("click", resetPersonForm);
  document.querySelector("#personAvatarInput")?.addEventListener("change", handleAvatarChange);
  document.querySelector("#adminResetButton")?.addEventListener("click", resetAllContactsData);
  document.querySelector("#adminPanel")?.addEventListener("click", handleAdminListClick);
}

/** Запускает поведение сайта. */
function initSite() {
  applyWelcomeState();
  bindCursorField();
  bindSectionObserver();
  renderContacts();
  bindAdminEvents();
  navigationLinks.forEach((link) => link.addEventListener("click", handleSmoothNavigation));
  enterSiteButton?.addEventListener("click", enterSite);
}

initSite();