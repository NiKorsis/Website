(() => {
  const CONTACTS_STORAGE_KEY = "korsdub-site:contacts-data";
  const ADMIN_SESSION_KEY = "korsdub-site:admin-session";
  const ADMIN_LOGIN = "admin";
  const ADMIN_PASSWORD = "admin";

  const categories = [
    { id: "actors", title: "Актёры дубляжа" },
    { id: "sound", title: "Звукорежиссёры" },
    { id: "translators", title: "Переводчики" },
    { id: "editors", title: "Монтажёры" }
  ];

  const defaultData = {
    settings: {
      email: "nikorsis666@gmail.com",
      ctaTitle: "Есть задача? Свяжитесь с нами",
      ctaText: "Расскажите о проекте — подберём команду и предложим лучшее решение для вашей задачи.",
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
      {
        id: "anton-mironov",
        category: "actors",
        name: "Антон Миронов",
        role: "Актёр дубляжа",
        telegram: "@antonvoice",
        email: "anton.mironov@studio.ru",
        phone: "+7 (985) 123-45-67",
        specialty: "Специализация: игровые персонажи, кино, рекламные ролики",
        avatar: ""
      },
      {
        id: "elizaveta-smirnova",
        category: "actors",
        name: "Елизавета Смирнова",
        role: "Актриса дубляжа",
        telegram: "@liza.voice",
        email: "elizaveta.smirnova@studio.ru",
        phone: "+7 (926) 234-56-78",
        specialty: "Специализация: женские роли, анимация, озвучка брендов",
        avatar: ""
      },
      {
        id: "igor-kovalev",
        category: "sound",
        name: "Игорь Ковалёв",
        role: "Звукорежиссёр",
        telegram: "@igor_kovalev_sound",
        email: "igor.kovalev@studio.ru",
        phone: "+7 (977) 345-67-89",
        specialty: "Специализация: сведение диалогов, шумодизайн, постпродакшн",
        avatar: ""
      },
      {
        id: "maria-vorontsova",
        category: "sound",
        name: "Мария Воронцова",
        role: "Звукорежиссёр",
        telegram: "@maria_soundpro",
        email: "maria.vorontsova@studio.ru",
        phone: "+7 (968) 456-78-90",
        specialty: "Специализация: запись вокала, обработка, атмосферы",
        avatar: ""
      },
      {
        id: "alex-gromov",
        category: "translators",
        name: "Алексей Громов",
        role: "Переводчик",
        telegram: "@alex_gromov_trans",
        email: "alex.gromov@studio.ru",
        phone: "+7 (910) 567-89-01",
        specialty: "Специализация: локализация фильмов, сериалов, игр",
        avatar: ""
      },
      {
        id: "olga-belova",
        category: "translators",
        name: "Ольга Белова",
        role: "Переводчик",
        telegram: "@olga_translate",
        email: "olga.belova@studio.ru",
        phone: "+7 (915) 678-90-12",
        specialty: "Специализация: адаптация диалогов, креативный перевод",
        avatar: ""
      },
      {
        id: "dmitry-sokolov",
        category: "editors",
        name: "Дмитрий Соколов",
        role: "Монтажёр",
        telegram: "@dmitry_edit",
        email: "dmitry.sokolov@studio.ru",
        phone: "+7 (916) 789-01-23",
        specialty: "Специализация: монтаж диалогов, тайминг, финальная сборка",
        avatar: ""
      },
      {
        id: "natalia-morozova",
        category: "editors",
        name: "Наталья Морозова",
        role: "Монтажёр",
        telegram: "@morozova_edit",
        email: "natalia.morozova@studio.ru",
        phone: "+7 (925) 890-12-34",
        specialty: "Специализация: чистка звука, шумы, реставрация",
        avatar: ""
      }
    ]
  };

  const state = {
    data: loadContactsData(),
    avatarDraft: "",
    editingPersonId: "",
    isAdmin: window.localStorage.getItem(ADMIN_SESSION_KEY) === "true"
  };

  const contactsGrid = document.querySelector("#contactsGrid");
  const contactsLinks = document.querySelector("#contactsLinks");
  const contactsLinksList = document.querySelector("#contactsLinksList");
  const contactsEmail = document.querySelector("#contactsEmail");
  const contactsCtaTitle = document.querySelector("#contactsCtaTitle");
  const contactsCtaText = document.querySelector("#contactsCtaText");
  const contactsCtaButton = document.querySelector("#contactsCtaButton");
  const adminOpenButton = document.querySelector("#adminOpenButton");
  const adminPanel = document.querySelector("#adminPanel");
  const adminLoginForm = document.querySelector("#adminLoginForm");
  const adminLogin = document.querySelector("#adminLogin");
  const adminPassword = document.querySelector("#adminPassword");
  const adminStatus = document.querySelector("#adminStatus");
  const adminLoginBox = document.querySelector("#adminLoginBox");
  const adminWorkspace = document.querySelector("#adminWorkspace");
  const siteSettingsForm = document.querySelector("#siteSettingsForm");
  const contactEmailInput = document.querySelector("#contactEmailInput");
  const ctaTitleInput = document.querySelector("#ctaTitleInput");
  const ctaTextInput = document.querySelector("#ctaTextInput");
  const ctaButtonTextInput = document.querySelector("#ctaButtonTextInput");
  const ctaButtonHrefInput = document.querySelector("#ctaButtonHrefInput");
  const linkForm = document.querySelector("#linkForm");
  const linkTitleInput = document.querySelector("#linkTitleInput");
  const linkUrlInput = document.querySelector("#linkUrlInput");
  const adminLinksList = document.querySelector("#adminLinksList");
  const personForm = document.querySelector("#personForm");
  const personIdInput = document.querySelector("#personIdInput");
  const personCategoryInput = document.querySelector("#personCategoryInput");
  const personNameInput = document.querySelector("#personNameInput");
  const personRoleInput = document.querySelector("#personRoleInput");
  const personTelegramInput = document.querySelector("#personTelegramInput");
  const personEmailInput = document.querySelector("#personEmailInput");
  const personPhoneInput = document.querySelector("#personPhoneInput");
  const personSpecialtyInput = document.querySelector("#personSpecialtyInput");
  const personAvatarInput = document.querySelector("#personAvatarInput");
  const avatarPreview = document.querySelector("#avatarPreview");
  const adminPeopleList = document.querySelector("#adminPeopleList");
  const personResetButton = document.querySelector("#personResetButton");
  const adminLogoutButton = document.querySelector("#adminLogoutButton");
  const adminResetButton = document.querySelector("#adminResetButton");

  /**
   * Создает глубокую копию данных, чтобы базовый набор контактов не менялся по ссылке.
   */
  function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * Загружает сохраненные контакты из браузера или возвращает стартовый набор.
   */
  function loadContactsData() {
    try {
      const savedData = window.localStorage.getItem(CONTACTS_STORAGE_KEY);

      if (!savedData) {
        return cloneData(defaultData);
      }

      return mergeContactsData(JSON.parse(savedData));
    } catch (error) {
      return cloneData(defaultData);
    }
  }

  /**
   * Объединяет сохраненные данные с базовой структурой, если в новой версии сайта появились поля.
   */
  function mergeContactsData(savedData) {
    return {
      settings: { ...defaultData.settings, ...(savedData.settings || {}) },
      links: Array.isArray(savedData.links) ? savedData.links : cloneData(defaultData.links),
      people: Array.isArray(savedData.people) ? savedData.people : cloneData(defaultData.people)
    };
  }

  /**
   * Сохраняет текущие данные контактов в браузере администратора.
   */
  function saveContactsData() {
    window.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(state.data));
  }

  /**
   * Возвращает безопасный текст для пустых полей, чтобы интерфейс не разваливался.
   */
  function valueOrFallback(value, fallback = "Не указано") {
    return String(value || "").trim() || fallback;
  }

  /**
   * Делает человекочитаемые инициалы из имени для карточек без аватарки.
   */
  function getInitials(name) {
    return valueOrFallback(name, "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  /**
   * Формирует простой уникальный идентификатор для новых контактов и ссылок.
   */
  function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  }

  /**
   * Превращает почту, телефон или ссылку в корректный href для клика.
   */
  function normalizeHref(value, type = "link") {
    const trimmedValue = String(value || "").trim();

    if (!trimmedValue) {
      return "#";
    }

    if (type === "email") {
      return `mailto:${trimmedValue}`;
    }

    if (type === "phone") {
      return `tel:${trimmedValue.replace(/[^+\d]/g, "")}`;
    }

    if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://") || trimmedValue.startsWith("mailto:") || trimmedValue.startsWith("tel:")) {
      return trimmedValue;
    }

    return `https://${trimmedValue}`;
  }

  /**
   * Создает DOM-элемент с классом и текстом без небезопасной HTML-вставки.
   */
  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  /**
   * Рисует строку контакта с иконкой-точкой и кликабельным значением.
   */
  function createContactRow(value, type) {
    const row = createElement("div", "contact-card__row");
    const icon = createElement("span", "contact-card__row-icon");
    const link = createElement("a", "", valueOrFallback(value));

    link.href = normalizeHref(value, type);
    row.append(icon, link);

    return row;
  }

  /**
   * Рисует аватарку контакта или инициалы, если изображение не загружено.
   */
  function createAvatar(person) {
    const avatar = createElement("div", "contact-card__avatar");

    if (person.avatar) {
      const image = document.createElement("img");
      image.src = person.avatar;
      image.alt = `Аватар ${valueOrFallback(person.name, "контакта")}`;
      avatar.append(image);
      return avatar;
    }

    avatar.textContent = getInitials(person.name);
    return avatar;
  }

  /**
   * Рисует одну карточку человека на странице контактов.
   */
  function createPersonCard(person) {
    const card = createElement("article", "contact-card");
    const header = createElement("div", "contact-card__header");
    const name = createElement("h3", "contact-card__name", valueOrFallback(person.name, "Новый контакт"));
    const role = createElement("p", "contact-card__role", valueOrFallback(person.role, "Участник команды"));
    const body = createElement("div", "contact-card__body");
    const specialty = createElement("p", "contact-card__specialty", valueOrFallback(person.specialty, "Специализация пока не указана"));

    header.append(name, role);
    body.append(
      createContactRow(person.telegram, "link"),
      createContactRow(person.email, "email"),
      createContactRow(person.phone, "phone"),
      specialty
    );
    card.append(createAvatar(person), header, body);

    return card;
  }

  /**
   * Рисует все группы контактов в порядке категорий из макета.
   */
  function renderContacts() {
    contactsGrid.replaceChildren();

    categories.forEach((category) => {
      const section = createElement("section", "contact-category");
      const title = createElement("h3", "contact-category__title");
      const mark = createElement("span", "contact-category__mark");
      const titleText = createElement("span", "", category.title);
      const list = createElement("div", "contact-category__list");
      const people = state.data.people.filter((person) => person.category === category.id);

      title.append(mark, titleText);
      people.forEach((person) => list.append(createPersonCard(person)));

      if (!people.length) {
        list.append(createElement("p", "contact-card__specialty", "Пока в этой группе нет контактов."));
      }

      section.append(title, list);
      contactsGrid.append(section);
    });
  }

  /**
   * Обновляет общую почту, призыв к действию и дополнительные ссылки на странице контактов.
   */
  function renderPublicSettings() {
    const { settings, links } = state.data;

    contactsEmail.textContent = valueOrFallback(settings.email, defaultData.settings.email);
    contactsEmail.href = normalizeHref(settings.email, "email");
    contactsCtaTitle.textContent = valueOrFallback(settings.ctaTitle, defaultData.settings.ctaTitle);
    contactsCtaText.textContent = valueOrFallback(settings.ctaText, defaultData.settings.ctaText);
    contactsCtaButton.href = normalizeHref(settings.ctaButtonHref || settings.email, settings.ctaButtonHref ? "link" : "email");
    contactsCtaButton.querySelector("span").textContent = valueOrFallback(settings.ctaButtonText, defaultData.settings.ctaButtonText);

    contactsLinks.classList.toggle("is-visible", links.length > 0);
    contactsLinksList.replaceChildren();
    links.forEach((link) => {
      const anchor = createElement("a", "contacts-links__item", valueOrFallback(link.title, "Ссылка"));
      anchor.href = normalizeHref(link.url);
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      contactsLinksList.append(anchor);
    });
  }

  /**
   * Рисует публичную страницу контактов целиком.
   */
  function renderPublicContacts() {
    renderContacts();
    renderPublicSettings();
  }

  /**
   * Заполняет поля настройки сайта актуальными значениями.
   */
  function hydrateSettingsForm() {
    contactEmailInput.value = state.data.settings.email || "";
    ctaTitleInput.value = state.data.settings.ctaTitle || "";
    ctaTextInput.value = state.data.settings.ctaText || "";
    ctaButtonTextInput.value = state.data.settings.ctaButtonText || "";
    ctaButtonHrefInput.value = state.data.settings.ctaButtonHref || "";
  }

  /**
   * Рисует список добавленных ссылок в панели администратора.
   */
  function renderAdminLinks() {
    adminLinksList.replaceChildren();

    state.data.links.forEach((link) => {
      const item = createElement("div", "admin-list__item");
      const content = createElement("div");
      const title = createElement("p", "admin-list__title", valueOrFallback(link.title, "Ссылка"));
      const meta = createElement("p", "admin-list__meta", valueOrFallback(link.url, "URL не указан"));
      const actions = createElement("div", "admin-list__actions");
      const removeButton = createElement("button", "admin-button admin-button--danger", "Удалить");

      removeButton.type = "button";
      removeButton.dataset.linkRemove = link.id;
      content.append(title, meta);
      actions.append(removeButton);
      item.append(content, actions);
      adminLinksList.append(item);
    });
  }

  /**
   * Рисует список людей в панели администратора с кнопками редактирования.
   */
  function renderAdminPeople() {
    adminPeopleList.replaceChildren();

    state.data.people.forEach((person) => {
      const category = categories.find((item) => item.id === person.category);
      const item = createElement("div", "admin-list__item");
      const content = createElement("div");
      const title = createElement("p", "admin-list__title", valueOrFallback(person.name, "Без имени"));
      const meta = createElement("p", "admin-list__meta", `${valueOrFallback(person.role, "Роль не указана")} · ${category?.title || "Категория не указана"}`);
      const actions = createElement("div", "admin-list__actions");
      const editButton = createElement("button", "admin-button", "Редактировать");
      const removeButton = createElement("button", "admin-button admin-button--danger", "Удалить");

      editButton.type = "button";
      editButton.dataset.personEdit = person.id;
      removeButton.type = "button";
      removeButton.dataset.personRemove = person.id;
      content.append(title, meta);
      actions.append(editButton, removeButton);
      item.append(content, actions);
      adminPeopleList.append(item);
    });
  }

  /**
   * Обновляет все части админ-панели после изменения данных.
   */
  function renderAdminPanel() {
    hydrateSettingsForm();
    renderAdminLinks();
    renderAdminPeople();
    renderAvatarPreview();
  }

  /**
   * Отображает текущее состояние входа администратора.
   */
  function renderAdminState() {
    adminLoginBox.hidden = state.isAdmin;
    adminWorkspace.hidden = !state.isAdmin;

    if (state.isAdmin) {
      renderAdminPanel();
    }
  }

  /**
   * Открывает модальное окно администратора и переносит фокус в нужное поле.
   */
  function openAdminPanel() {
    adminPanel.classList.add("is-open");
    adminPanel.setAttribute("aria-hidden", "false");
    renderAdminState();
    window.setTimeout(() => {
      (state.isAdmin ? personNameInput : adminLogin).focus();
    }, 80);
  }

  /**
   * Закрывает модальное окно администратора.
   */
  function closeAdminPanel() {
    adminPanel.classList.remove("is-open");
    adminPanel.setAttribute("aria-hidden", "true");
  }

  /**
   * Показывает короткое сообщение о результате действия администратора.
   */
  function setAdminStatus(message) {
    adminStatus.textContent = message;
  }

  /**
   * Проверяет логин и пароль администратора для локального доступа к панели.
   */
  function handleAdminLogin(event) {
    event.preventDefault();

    if (adminLogin.value.trim() === ADMIN_LOGIN && adminPassword.value === ADMIN_PASSWORD) {
      state.isAdmin = true;
      window.localStorage.setItem(ADMIN_SESSION_KEY, "true");
      adminPassword.value = "";
      setAdminStatus("Вы вошли в профиль администратора.");
      renderAdminState();
      return;
    }

    setAdminStatus("Неверный логин или пароль.");
  }

  /**
   * Завершает локальную сессию администратора.
   */
  function handleAdminLogout() {
    state.isAdmin = false;
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminStatus("Вы вышли из профиля администратора.");
    renderAdminState();
  }

  /**
   * Сохраняет настройки общей контактной информации.
   */
  function handleSettingsSave(event) {
    event.preventDefault();

    state.data.settings = {
      email: contactEmailInput.value.trim(),
      ctaTitle: ctaTitleInput.value.trim(),
      ctaText: ctaTextInput.value.trim(),
      ctaButtonText: ctaButtonTextInput.value.trim(),
      ctaButtonHref: ctaButtonHrefInput.value.trim()
    };
    saveContactsData();
    renderPublicContacts();
    setAdminStatus("Контактная информация обновлена.");
  }

  /**
   * Добавляет новую внешнюю ссылку на страницу контактов.
   */
  function handleLinkAdd(event) {
    event.preventDefault();

    const title = linkTitleInput.value.trim();
    const url = linkUrlInput.value.trim();

    if (!title || !url) {
      setAdminStatus("Заполните название и URL ссылки.");
      return;
    }

    state.data.links.push({ id: createId("link"), title, url });
    saveContactsData();
    linkForm.reset();
    renderAdminLinks();
    renderPublicSettings();
    setAdminStatus("Ссылка добавлена.");
  }

  /**
   * Удаляет ссылку из списка администратора.
   */
  function removeLink(linkId) {
    state.data.links = state.data.links.filter((link) => link.id !== linkId);
    saveContactsData();
    renderAdminLinks();
    renderPublicSettings();
    setAdminStatus("Ссылка удалена.");
  }

  /**
   * Заполняет форму контакта данными выбранного человека для редактирования.
   */
  function editPerson(personId) {
    const person = state.data.people.find((item) => item.id === personId);

    if (!person) {
      return;
    }

    state.editingPersonId = person.id;
    state.avatarDraft = person.avatar || "";
    personIdInput.value = person.id;
    personCategoryInput.value = person.category || categories[0].id;
    personNameInput.value = person.name || "";
    personRoleInput.value = person.role || "";
    personTelegramInput.value = person.telegram || "";
    personEmailInput.value = person.email || "";
    personPhoneInput.value = person.phone || "";
    personSpecialtyInput.value = person.specialty || "";
    personAvatarInput.value = "";
    renderAvatarPreview();
    personNameInput.focus();
    setAdminStatus("Контакт открыт для редактирования.");
  }

  /**
   * Очищает форму добавления человека и возвращает режим создания.
   */
  function resetPersonForm() {
    state.editingPersonId = "";
    state.avatarDraft = "";
    personForm.reset();
    personIdInput.value = "";
    personCategoryInput.value = categories[0].id;
    renderAvatarPreview();
  }

  /**
   * Собирает данные человека из формы администратора.
   */
  function getPersonFromForm() {
    return {
      id: state.editingPersonId || createId("person"),
      category: personCategoryInput.value,
      name: personNameInput.value.trim(),
      role: personRoleInput.value.trim(),
      telegram: personTelegramInput.value.trim(),
      email: personEmailInput.value.trim(),
      phone: personPhoneInput.value.trim(),
      specialty: personSpecialtyInput.value.trim(),
      avatar: state.avatarDraft
    };
  }

  /**
   * Создает нового человека или сохраняет изменения существующего контакта.
   */
  function handlePersonSave(event) {
    event.preventDefault();

    const person = getPersonFromForm();

    if (!person.name || !person.role) {
      setAdminStatus("Укажите имя и роль человека.");
      return;
    }

    if (state.editingPersonId) {
      state.data.people = state.data.people.map((item) => (item.id === state.editingPersonId ? person : item));
      setAdminStatus("Контакт обновлен.");
    } else {
      state.data.people.push(person);
      setAdminStatus("Контакт добавлен.");
    }

    saveContactsData();
    renderPublicContacts();
    renderAdminPeople();
    resetPersonForm();
  }

  /**
   * Удаляет человека из списка контактов.
   */
  function removePerson(personId) {
    state.data.people = state.data.people.filter((person) => person.id !== personId);
    saveContactsData();
    renderPublicContacts();
    renderAdminPeople();
    resetPersonForm();
    setAdminStatus("Контакт удален.");
  }

  /**
   * Уменьшает загруженную аватарку до компактного квадратного изображения для localStorage.
   */
  function resizeAvatar(dataUrl) {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        const size = 320;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const minSide = Math.min(image.width, image.height);
        const sourceX = (image.width - minSide) / 2;
        const sourceY = (image.height - minSide) / 2;

        canvas.width = size;
        canvas.height = size;
        context.drawImage(image, sourceX, sourceY, minSide, minSide, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.onerror = () => resolve(dataUrl);
      image.src = dataUrl;
    });
  }

  /**
   * Читает выбранный файл аватарки и готовит его для предпросмотра и сохранения.
   */
  function readAvatarFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        resolve(await resizeAvatar(reader.result));
      };
      reader.onerror = () => reject(new Error("Не удалось прочитать изображение."));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Обрабатывает загрузку аватарки в форме контакта.
   */
  async function handleAvatarChange(event) {
    const [file] = event.target.files;

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAdminStatus("Выберите файл изображения.");
      return;
    }

    try {
      state.avatarDraft = await readAvatarFile(file);
      renderAvatarPreview();
      setAdminStatus("Аватарка готова к сохранению.");
    } catch (error) {
      setAdminStatus("Не получилось загрузить аватарку.");
    }
  }

  /**
   * Рисует предпросмотр аватарки в форме администратора.
   */
  function renderAvatarPreview() {
    avatarPreview.replaceChildren();

    if (state.avatarDraft) {
      const image = document.createElement("img");
      image.src = state.avatarDraft;
      image.alt = "Предпросмотр аватарки";
      avatarPreview.append(image);
      return;
    }

    avatarPreview.textContent = "Нет";
  }

  /**
   * Сбрасывает локальные изменения администратора к стартовым данным сайта.
   */
  function resetAllContactsData() {
    state.data = cloneData(defaultData);
    saveContactsData();
    renderPublicContacts();
    renderAdminPanel();
    resetPersonForm();
    setAdminStatus("Данные сброшены к исходным.");
  }

  /**
   * Обрабатывает клики внутри списков администратора через делегирование событий.
   */
  function handleAdminListClick(event) {
    const linkRemoveButton = event.target.closest("[data-link-remove]");
    const personEditButton = event.target.closest("[data-person-edit]");
    const personRemoveButton = event.target.closest("[data-person-remove]");

    if (linkRemoveButton) {
      removeLink(linkRemoveButton.dataset.linkRemove);
      return;
    }

    if (personEditButton) {
      editPerson(personEditButton.dataset.personEdit);
      return;
    }

    if (personRemoveButton) {
      removePerson(personRemoveButton.dataset.personRemove);
    }
  }

  /**
   * Подключает события страницы контактов и панели администратора.
   */
  function bindContactsEvents() {
    adminOpenButton.addEventListener("click", openAdminPanel);
    adminPanel.addEventListener("click", (event) => {
      if (event.target.closest("[data-admin-close]")) {
        closeAdminPanel();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && adminPanel.classList.contains("is-open")) {
        closeAdminPanel();
      }
    });
    adminLoginForm.addEventListener("submit", handleAdminLogin);
    adminLogoutButton.addEventListener("click", handleAdminLogout);
    siteSettingsForm.addEventListener("submit", handleSettingsSave);
    linkForm.addEventListener("submit", handleLinkAdd);
    personForm.addEventListener("submit", handlePersonSave);
    personResetButton.addEventListener("click", resetPersonForm);
    personAvatarInput.addEventListener("change", handleAvatarChange);
    adminLinksList.addEventListener("click", handleAdminListClick);
    adminPeopleList.addEventListener("click", handleAdminListClick);
    adminResetButton.addEventListener("click", resetAllContactsData);
  }

  /**
   * Запускает страницу контактов, если нужная разметка присутствует на странице.
   */
  function initContactsPage() {
    if (!contactsGrid || !adminPanel) {
      return;
    }

    renderPublicContacts();
    bindContactsEvents();

    if (window.location.hash === "#admin") {
      openAdminPanel();
    }
  }

  initContactsPage();
})();
