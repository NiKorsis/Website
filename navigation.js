(() => {
  const navigationLinks = [...document.querySelectorAll('a[href^="#"]')];
  const sections = [...document.querySelectorAll("[data-section]")];
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let navigationTimer = 0;

  /**
   * Ищет секцию по якорю ссылки и возвращает null, если якорь служебный или отсутствует.
   */
  function getSectionFromHash(hash) {
    if (!hash || hash === "#") {
      return null;
    }

    try {
      return document.querySelector(hash);
    } catch (error) {
      return null;
    }
  }

  /**
   * Плавно переводит посетителя к выбранному разделу без резкого скачка страницы.
   */
  function handleSmoothNavigation(event) {
    const target = getSectionFromHash(event.currentTarget.hash);

    if (!target) {
      return;
    }

    event.preventDefault();
    document.body.classList.add("is-navigating");
    window.clearTimeout(navigationTimer);
    target.scrollIntoView({ behavior: reducedMotionQuery.matches ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", event.currentTarget.hash);
    navigationTimer = window.setTimeout(() => document.body.classList.remove("is-navigating"), 820);
  }

  /**
   * Подсвечивает активный пункт меню во всех навигационных блоках сайта.
   */
  function setActiveNavigation(sectionId) {
    navigationLinks.forEach((link) => {
      link.classList.toggle("is-active", link.hash === `#${sectionId}`);
    });
  }

  /**
   * Следит за текущим экраном и обновляет активный пункт навигации.
   */
  function bindSectionObserver() {
    if (!sections.length || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveNavigation(visibleEntry.target.id);
        }
      },
      { threshold: [0.28, 0.44, 0.62], rootMargin: "-12% 0px -34%" }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /**
   * Запускает мягкое появление карточек и текстовых блоков при прокрутке.
   */
  function bindRevealObserver() {
    if (!revealItems.length || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8%" }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  /**
   * Подключает плавные переходы по якорям сайта.
   */
  function bindNavigationEvents() {
    navigationLinks.forEach((link) => link.addEventListener("click", handleSmoothNavigation));
  }

  bindNavigationEvents();
  bindSectionObserver();
  bindRevealObserver();
})();
