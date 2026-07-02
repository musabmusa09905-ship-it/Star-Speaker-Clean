(() => {
  const languageStorageKey = "starSpeakerLanguage";
  const form = document.querySelector("#pressure-test-form");
  const status = document.querySelector("#pressure-test-status");
  const whatsappLinks = document.querySelectorAll(".js-whatsapp-link");
  const whatsappNumber = "905525247746";
  const fallbackLanguageStorage = new Map();

  const messages = {
    en: {
      required: "Please complete this field.",
      email: "Please enter a valid email address or leave it blank.",
      success: "Your application message is ready in WhatsApp. Please send it to complete your request.",
      whatsapp: "Hi, I'm interested in the 30-Day Star Speaker Daily Speaking Program. Can I ask a question?",
      notProvided: "Not provided",
    },
    tr: {
      required: "L\u00fctfen bu alan\u0131 doldur.",
      email: "L\u00fctfen ge\u00e7erli bir e-posta adresi girin veya bu alan\u0131 bo\u015f b\u0131rak\u0131n.",
      success: "Ba\u015fvurunu WhatsApp \u00fczerinden g\u00f6ndermek i\u00e7in devam et.",
      whatsapp: "Merhaba, 30 G\u00fcnl\u00fck Star Speaker Konu\u015fma Program\u0131 hakk\u0131nda bilgi almak istiyorum. Bir soru sorabilir miyim?",
      notProvided: "Belirtilmedi",
    },
  };

  function getLanguage() {
    return window.starSpeakerI18n?.getLanguage?.() === "tr" ? "tr" : "en";
  }

  function storeLanguage(language) {
    fallbackLanguageStorage.set(languageStorageKey, language);
    try {
      window.localStorage?.setItem(languageStorageKey, language);
    } catch {
      // Embedded browsers can block storage; language still updates for the current page view.
    }
  }

  function setLocalizedContent(language) {
    document.querySelectorAll("[data-en][data-tr]").forEach((element) => {
      const textTarget = element.querySelector(".copy-text");
      if (textTarget) {
        textTarget.textContent = element.dataset[language] || element.dataset.en || "";
        return;
      }
      element.textContent = element.dataset[language] || element.dataset.en || "";
    });

    document.querySelectorAll("option[data-en][data-tr]").forEach((option) => {
      option.textContent = option.dataset[language] || option.dataset.en || "";
    });
  }

  function buildWhatsappUrl(message) {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function updateWhatsappLinks(language) {
    whatsappLinks.forEach((link) => {
      link.href = buildWhatsappUrl(messages[language].whatsapp);
    });
  }

  function initHeroSlideshow() {
    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const indicators = Array.from(document.querySelectorAll(".hero-slide-progress span"));
    if (slides.length <= 1) return;

    slides.slice(1).forEach((slide) => {
      const image = new Image();
      image.src = slide.currentSrc || slide.src;
    });

    let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (activeIndex < 0) activeIndex = 0;

    function setSlide(nextIndex) {
      activeIndex = nextIndex % slides.length;
      slides.forEach((slide, index) => slide.classList.toggle("is-active", index === activeIndex));
      indicators.forEach((indicator, index) => indicator.classList.toggle("is-active", index === activeIndex));
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSlide(activeIndex);
      return;
    }

    window.setInterval(() => setSlide(activeIndex + 1), 7000);
  }

  function initLandingReveal() {
    const revealTargets = document.querySelectorAll([
      ".landing-section .section-head",
      ".premium-panel",
      ".audience-grid article",
      ".method-steps article",
      ".feature-grid span",
      ".price-card",
      ".bonus-grid article",
      ".guarantee-pills span",
      ".pressure-form",
      ".faq-grid details",
      ".cta-band",
    ].join(","));

    if (!revealTargets.length) return;

    revealTargets.forEach((element) => element.classList.add("landing-reveal"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    function revealVisible() {
      revealTargets.forEach((element) => {
        if (element.classList.contains("is-visible")) return;
        if (element.getBoundingClientRect().top < window.innerHeight * 0.88) {
          element.classList.add("is-visible");
        }
      });
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.14,
      });

      revealTargets.forEach((element) => observer.observe(element));
    }

    revealVisible();
    window.addEventListener("scroll", revealVisible, { passive: true });
    window.addEventListener("resize", revealVisible);
  }

  function setStatus(message, type = "success") {
    if (!status) return;
    status.textContent = message;
    status.classList.remove("is-error", "is-loading");
    status.classList.add("is-visible");
    if (type === "error") status.classList.add("is-error");
    if (type === "loading") status.classList.add("is-loading");
  }

  function getErrorElement(field) {
    return field.closest(".form-field")?.querySelector(".field-error") || null;
  }

  function setFieldError(field, message) {
    const wrapper = field.closest(".form-field");
    const error = getErrorElement(field);
    wrapper?.classList.toggle("has-error", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
  }

  function validateField(field) {
    const language = getLanguage();
    const value = field.value.trim();
    if (field.required && !value) return messages[language].required;
    if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return messages[language].email;
    }
    return "";
  }

  function getField(selector) {
    return form?.querySelector(selector);
  }

  function getFieldText(selector) {
    const field = getField(selector);
    if (!field) return "";
    if (field.tagName === "SELECT") {
      return field.selectedOptions?.[0]?.textContent?.trim() || field.value.trim();
    }
    return field.value.trim();
  }

  function buildApplicationMessage(language) {
    const fallback = messages[language].notProvided;
    const values = {
      name: getFieldText("#full-name"),
      whatsapp: getFieldText("#whatsapp"),
      email: getFieldText("#email") || fallback,
      level: getFieldText("#english-level"),
      goal: getFieldText("#main-goal"),
      timeline: getFieldText("#start-timeline"),
      contactLanguage: getFieldText("#contact-language"),
    };

    if (language === "tr") {
      return [
        "Merhaba, \u00dccretsiz Konu\u015fma Analizimi ba\u015flatmak istiyorum.",
        "",
        `Ad Soyad: ${values.name}`,
        `WhatsApp: ${values.whatsapp}`,
        `E-posta: ${values.email}`,
        `\u0130ngilizce seviyem: ${values.level}`,
        `Ana hedefim: ${values.goal}`,
        `\u0130ngilizceye ne zaman ihtiyac\u0131m var: ${values.timeline}`,
        `Tercih etti\u011fim ileti\u015fim dili: ${values.contactLanguage}`,
      ].join("\n");
    }

    return [
      "Hello, I want to start my Free Speaking Analysis.",
      "",
      `Name: ${values.name}`,
      `WhatsApp: ${values.whatsapp}`,
      `Email: ${values.email}`,
      `Current English level: ${values.level}`,
      `Main goal: ${values.goal}`,
      `When I need English: ${values.timeline}`,
      `Preferred contact language: ${values.contactLanguage}`,
    ].join("\n");
  }

  function applyLandingLanguage() {
    const language = getLanguage();
    storeLanguage(language);
    setLocalizedContent(language);
    updateWhatsappLinks(language);
  }

  document.addEventListener("click", (event) => {
    const link = event.target?.closest?.('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    document.body.classList.remove("nav-open");
    document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
    history.pushState(null, "", targetId);
    const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, true);

  form?.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      setFieldError(field, validateField(field));
      status?.classList.remove("is-visible");
    });

    field.addEventListener("change", () => {
      setFieldError(field, validateField(field));
      status?.classList.remove("is-visible");
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = Array.from(form.querySelectorAll("input, select, textarea"));
    const invalid = [];
    fields.forEach((field) => {
      const error = validateField(field);
      setFieldError(field, error);
      if (error) invalid.push(field);
    });

    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const language = getLanguage();
    window.open(buildWhatsappUrl(buildApplicationMessage(language)), "_blank", "noopener");
    setStatus(messages[language].success, "success");
  });

  window.addEventListener("starSpeakerLanguageChange", applyLandingLanguage);
  initHeroSlideshow();
  initLandingReveal();
  applyLandingLanguage();
})();
