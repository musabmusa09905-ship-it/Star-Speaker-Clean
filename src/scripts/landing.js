(() => {
  const languageStorageKey = "starSpeakerLanguage";
  const form = document.querySelector("#pressure-test-form");
  const status = document.querySelector("#pressure-test-status");
  const submitButton = form?.querySelector('button[type="submit"]');
  const whatsappLinks = document.querySelectorAll(".js-whatsapp-link");
  const whatsappPlaceholderNumber = "900000000000";

  const messages = {
    en: {
      required: "Please complete this field.",
      email: "Please enter a valid email address or leave it blank.",
      loading: "Submitting your request...",
      success: "Thank you. Your Free English Speaking Analysis request has been received. We will contact you on WhatsApp to confirm your time.",
      error: "We could not submit this right now. Please try again or contact us directly.",
      whatsapp: "Hi, I'm interested in the 30-Day Speak Under Pressure Program. Can I ask a question?",
    },
    tr: {
      required: "Lütfen bu alanı doldurun.",
      email: "Lütfen geçerli bir e-posta adresi girin veya bu alanı boş bırakın.",
      loading: "Başvurunuz gönderiliyor...",
      success: "Teşekkürler. Ücretsiz İngilizce Konuşma Analizi talebiniz alındı. Saatinizi onaylamak için WhatsApp üzerinden iletişime geçeceğiz.",
      error: "Şu anda gönderim yapılamadı. Lütfen tekrar deneyin veya bizimle doğrudan iletişime geçin.",
      whatsapp: "Merhaba, 30-Day Speak Under Pressure Program hakkında bilgi almak istiyorum. Bir soru sorabilir miyim?",
    },
  };

  function getLanguage() {
    return window.starSpeakerI18n?.getLanguage?.() === "tr" ? "tr" : "en";
  }

  function setLocalizedContent(language) {
    document.querySelectorAll("[data-en][data-tr]").forEach((element) => {
      element.textContent = element.dataset[language] || element.dataset.en || "";
    });

    document.querySelectorAll("option[data-en][data-tr]").forEach((option) => {
      option.textContent = option.dataset[language] || option.dataset.en || "";
    });
  }

  function updateWhatsappLinks(language) {
    const text = encodeURIComponent(messages[language].whatsapp);
    whatsappLinks.forEach((link) => {
      link.href = `https://wa.me/${whatsappPlaceholderNumber}?text=${text}`;
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

  function buildPayload() {
    const goal = getField("#main-goal")?.value || "";
    const timeline = getField("#start-timeline")?.value || "";
    const contactLanguage = getField("#contact-language")?.value || "";
    const currentLevel = getField("#english-level")?.value || "";

    return {
      full_name: getField("#full-name")?.value.trim() || "",
      whatsapp_number: getField("#whatsapp")?.value.trim() || "",
      email: getField("#email")?.value.trim() || null,
      current_level: currentLevel,
      main_goal: goal,
      biggest_speaking_problem: `Free English Speaking Analysis request. Goal: ${goal}. Timeline: ${timeline}. Current level: ${currentLevel}.`,
      preferred_program: "Not sure",
      start_timeline: timeline,
      preferred_consultation_window: "free_mini_pressure_test",
      preferred_consultation_date: null,
      preferred_consultation_language: contactLanguage.toLowerCase() || "not_sure",
      short_message: `Preferred contact language: ${contactLanguage || "Not specified"}`,
      source: "homepage_pressure_test",
      status: "new",
    };
  }

  function applyLandingLanguage() {
    const language = getLanguage();
    localStorage.setItem(languageStorageKey, language);
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

  form?.addEventListener("submit", async (event) => {
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
    const payload = buildPayload();

    try {
      submitButton?.setAttribute("disabled", "true");
      setStatus(messages[language].loading, "loading");
      await window.starSpeakerSupabase.insertApplySubmission(payload);
      setStatus(messages[language].success, "success");
      form.reset();
    } catch (error) {
      console.warn("Pressure test submission failed:", error);
      localStorage.setItem("starSpeakerLatestPressureTestSubmission", JSON.stringify({
        ...payload,
        savedAt: new Date().toISOString(),
        submitError: error?.message || String(error),
      }));
      setStatus(messages[language].error, "error");
    } finally {
      submitButton?.removeAttribute("disabled");
    }
  });

  window.addEventListener("starSpeakerLanguageChange", applyLandingLanguage);
  initHeroSlideshow();
  applyLandingLanguage();
})();
