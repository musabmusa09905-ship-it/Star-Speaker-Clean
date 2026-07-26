(() => {
  const body = document.body;
  const menuButton = document.querySelector(".stage-home-menu-toggle");
  const menu = document.querySelector(".stage-home-menu");
  const menuLinks = document.querySelectorAll(".stage-home-menu a");
  const languageButtons = document.querySelectorAll("[data-language]");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const desktopQuery = window.matchMedia("(min-width: 1025px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const languageStorageKey = "starSpeakerLanguage";
  const whatsappNumber = "905525247746";
  const whatsappMessages = {
    en: "Hi, I’d like to start my free Star Speaker speaking analysis.",
    tr: "Merhaba, Star Speaker için ücretsiz konuşma analizimi başlatmak istiyorum.",
  };
  let currentLanguage = "tr";
  let activeSlide = 0;
  let slideTimer = 0;

  function storedLanguage() {
    try {
      return window.localStorage.getItem(languageStorageKey);
    } catch {
      return null;
    }
  }

  function detectedLanguage() {
    const queryLanguage = new URLSearchParams(window.location.search).get("lang");
    if (queryLanguage === "en" || queryLanguage === "tr") return queryLanguage;
    const savedLanguage = storedLanguage();
    if (savedLanguage === "en" || savedLanguage === "tr") return savedLanguage;
    return navigator.language?.toLowerCase().startsWith("tr") ? "tr" : "en";
  }

  function translatedValue(element, language) {
    return element.dataset[language] || element.dataset.tr || element.dataset.en;
  }

  function applyLanguage(language, persist = false) {
    currentLanguage = language === "tr" ? "tr" : "en";
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll("[data-en][data-tr]").forEach((element) => {
      const translation = translatedValue(element, currentLanguage);
      if (translation) element.textContent = translation;
    });

    document.querySelectorAll("[data-aria-en][data-aria-tr]").forEach((element) => {
      const translation = currentLanguage === "tr" ? element.dataset.ariaTr : element.dataset.ariaEn;
      if (translation) element.setAttribute("aria-label", translation);
    });

    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = translatedValue(description, currentLanguage);

    languageButtons.forEach((button) => {
      const isActive = button.dataset.language === currentLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessages[currentLanguage])}`;
    });

    updateMenuLabel();

    if (persist) {
      try {
        window.localStorage.setItem(languageStorageKey, currentLanguage);
      } catch {
        // Language switching remains functional when storage is unavailable.
      }
    }

    window.dispatchEvent(new CustomEvent("starSpeakerLanguageChange", { detail: { language: currentLanguage } }));
  }

  function updateMenuLabel() {
    if (!menuButton) return;
    const isOpen = body.classList.contains("nav-open");
    const labelKey = isOpen
      ? currentLanguage === "tr" ? "closeTr" : "closeEn"
      : currentLanguage === "tr" ? "openTr" : "openEn";
    menuButton.setAttribute("aria-label", menuButton.dataset[labelKey]);
  }

  function setMenu(open) {
    body.classList.toggle("nav-open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    updateMenuLabel();
  }

  menuButton?.addEventListener("click", () => {
    setMenu(!body.classList.contains("nav-open"));
  });

  menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  languageButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language, true));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("nav-open")) return;
    if (menu?.contains(event.target) || menuButton?.contains(event.target)) return;
    setMenu(false);
  });

  function loadDesktopSlides() {
    slides.slice(1).forEach((slide) => {
      if (!slide.getAttribute("src") && slide.dataset.src) slide.src = slide.dataset.src;
    });
  }

  function showSlide(index) {
    activeSlide = index;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeSlide);
    });
  }

  function stopSlideshow() {
    window.clearTimeout(slideTimer);
    slideTimer = 0;
  }

  function scheduleNextSlide() {
    stopSlideshow();
    if (!desktopQuery.matches || reducedMotionQuery.matches || document.hidden || slides.length < 2) return;
    slideTimer = window.setTimeout(() => {
      showSlide((activeSlide + 1) % slides.length);
      scheduleNextSlide();
    }, 6000);
  }

  function syncSlideshow() {
    stopSlideshow();
    showSlide(0);
    if (!desktopQuery.matches || reducedMotionQuery.matches) return;
    loadDesktopSlides();
    scheduleNextSlide();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSlideshow();
    else scheduleNextSlide();
  });

  desktopQuery.addEventListener("change", syncSlideshow);
  reducedMotionQuery.addEventListener("change", syncSlideshow);

  applyLanguage(detectedLanguage());
  syncSlideshow();
})();
