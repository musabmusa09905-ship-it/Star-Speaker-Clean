import { homepageCopy, homepageLocales } from "../i18n/homepage-locales.mjs";

(() => {
  const body = document.body;
  const menuButton = document.querySelector(".stage-home-menu-toggle");
  const menu = document.querySelector(".stage-home-menu");
  const menuLinks = document.querySelectorAll(".stage-home-menu a");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const desktopQuery = window.matchMedia("(min-width: 1025px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const whatsappNumber = "905525247746";
  const currentLanguage = document.documentElement.lang === "en" ? "en" : "tr";
  const currentLocale = homepageLocales[currentLanguage];
  const query = new URLSearchParams(window.location.search);
  const deviceCategory = window.matchMedia("(max-width: 767px)").matches
    ? "mobile"
    : window.matchMedia("(max-width: 1024px)").matches
      ? "tablet"
      : "desktop";
  const campaign = Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((key) => [key, query.get(key)])
      .filter(([, value]) => value),
  );
  const trafficSource = campaign.utm_source || document.referrer || "direct";
  let activeSlide = 0;
  let slideTimer = 0;

  function trackHomepageEvent(event, details = {}) {
    const payload = {
      event,
      locale: currentLanguage,
      source: trafficSource,
      device_category: deviceCategory,
      page_path: window.location.pathname,
      ...campaign,
      ...details,
    };
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("star-speaker:analytics", { detail: payload }));
  }

  const supportedSectionHashes = new Set(["#programs", "#method", "#results", "#contact", "#faq"]);

  function syncLocaleLinks() {
    const sectionHash = supportedSectionHashes.has(window.location.hash) ? window.location.hash : "";
    document.querySelectorAll("[data-locale-link]").forEach((link) => {
      link.href = `/${link.dataset.localeLink}/${sectionHash}`;
    });
  }

  function alignCurrentSectionHash() {
    if (!supportedSectionHashes.has(window.location.hash)) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    const scrollMargin = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - scrollMargin;
    window.scrollTo({ top, behavior: "instant" });
  }

  function stabilizeInitialSectionHash() {
    if (!supportedSectionHashes.has(window.location.hash)) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;

    document.querySelectorAll("img").forEach((image) => {
      const targetFollowsImage = image.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING;
      if (targetFollowsImage && !image.complete) {
        image.addEventListener("load", alignCurrentSectionHash, { once: true });
      }
    });

    window.requestAnimationFrame(alignCurrentSectionHash);
    document.fonts?.ready.then(alignCurrentSectionHash);
  }

  function updateMenuLabel() {
    if (!menuButton) return;
    const isOpen = body.classList.contains("nav-open");
    menuButton.setAttribute(
      "aria-label",
      isOpen ? homepageCopy.menuClose[currentLanguage] : homepageCopy.menuOpen[currentLanguage],
    );
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("nav-open")) return;
    if (menu?.contains(event.target) || menuButton?.contains(event.target)) return;
    setMenu(false);
  });

  const faq = document.querySelector("[data-closing-faq]");
  const faqButtons = Array.from(faq?.querySelectorAll(".stage-closing-faq-button") || []);

  function setFaqItem(button, open) {
    const panelId = button.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    const item = button.closest(".stage-closing-faq-item");
    button.setAttribute("aria-expanded", String(open));
    if (panel) panel.hidden = !open;
    item?.classList.toggle("is-open", open);
  }

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const shouldOpen = button.getAttribute("aria-expanded") !== "true";
      faqButtons.forEach((candidate) => setFaqItem(candidate, shouldOpen && candidate === button));
      trackHomepageEvent("faq_interacted", {
        faq_question: button.querySelector(".stage-closing-faq-question")?.textContent?.trim() || "",
        faq_action: shouldOpen ? "opened" : "closed",
      });
    });
  });

  document.querySelectorAll("[data-home-event]").forEach((element) => {
    element.addEventListener("click", () => {
      const details = { location: element.dataset.homeLocation || "unknown" };
      trackHomepageEvent(element.dataset.homeEvent, details);
      if (element.hasAttribute("data-performance-link") && element.dataset.homeEvent !== "test_cta_clicked") {
        trackHomepageEvent("test_cta_clicked", details);
      }
      if (element.hasAttribute("data-whatsapp-link") && element.dataset.homeEvent !== "whatsapp_clicked") {
        trackHomepageEvent("whatsapp_clicked", details);
      }
    });
  });

  const programsSection = document.getElementById("programs");
  if (programsSection && "IntersectionObserver" in window) {
    const programsObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        trackHomepageEvent("program_section_viewed");
        programsObserver.disconnect();
      },
      { threshold: 0.25 },
    );
    programsObserver.observe(programsSection);
  }

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

  const resultsCarousel = document.querySelector(".stage-results-carousel");
  const resultsStories = currentLocale.stories;

  if (resultsCarousel) {
    const resultsStory = resultsCarousel.querySelector("[data-results-story]");
    const resultsCurrent = resultsCarousel.querySelector("[data-results-current]");
    const resultsCounter = resultsCarousel.querySelector(".stage-results-counter");
    const resultsInitials = resultsCarousel.querySelector("[data-results-initials]");
    const resultsName = resultsCarousel.querySelector("[data-results-name]");
    const resultsProfession = resultsCarousel.querySelector("[data-results-profession]");
    const resultsQuote = resultsCarousel.querySelector("[data-results-quote]");
    const resultsBefore = resultsCarousel.querySelector("[data-results-before]");
    const resultsFocus = resultsCarousel.querySelector("[data-results-focus]");
    const resultsChange = resultsCarousel.querySelector("[data-results-change]");
    const resultsPrevious = resultsCarousel.querySelector("[data-results-previous]");
    const resultsNext = resultsCarousel.querySelector("[data-results-next]");
    const resultsIndicators = Array.from(resultsCarousel.querySelectorAll("[data-results-indicator]"));
    const resultsUpcomingGroups = Array.from(resultsCarousel.querySelectorAll(".stage-results-upcoming"));
    const resultsTrack = resultsCarousel.querySelector("[data-results-track]");
    const resultsAnnouncement = resultsCarousel.querySelector("[data-results-announcement]");
    let activeResult = 0;
    let resultsTimer = 0;
    let resultsHovered = false;
    let resultsFocused = false;
    let touchStartX = 0;
    let touchStartY = 0;

    function stopResultsTimer() {
      window.clearTimeout(resultsTimer);
      resultsTimer = 0;
    }

    function canAdvanceResults() {
      return !reducedMotionQuery.matches && !document.hidden && !resultsHovered && !resultsFocused;
    }

    function scheduleResultsTimer() {
      stopResultsTimer();
      if (!canAdvanceResults()) return;
      resultsTimer = window.setTimeout(() => {
        showResult(activeResult + 1, false);
        scheduleResultsTimer();
      }, 8000);
    }

    function updateUpcomingResults() {
      resultsUpcomingGroups.forEach((group) => {
        Array.from(group.querySelectorAll("[data-results-upcoming]")).forEach((button, position) => {
          const targetIndex = (activeResult + position + 1) % resultsStories.length;
          const targetStory = resultsStories[targetIndex];
          button.dataset.resultsUpcoming = String(targetIndex);
          button.setAttribute("aria-label", currentLocale.carousel.showResult(targetStory.name));
          button.querySelector(".stage-results-upcoming-name").textContent = targetStory.name;
          button.querySelector(".stage-results-upcoming-role").textContent = targetStory.profession;
        });
      });
    }

    function showResult(index, manual = true) {
      activeResult = (index + resultsStories.length) % resultsStories.length;
      const result = resultsStories[activeResult];

      resultsCurrent.textContent = String(activeResult + 1).padStart(2, "0");
      resultsCounter.setAttribute(
        "aria-label",
        `${currentLocale.carousel.student} ${activeResult + 1} / ${resultsStories.length}`,
      );
      resultsInitials.textContent = result.initials;
      resultsName.textContent = result.name;
      resultsProfession.textContent = result.profession;
      resultsQuote.textContent = result.quote;
      resultsBefore.textContent = result.before;
      resultsFocus.textContent = result.focus;
      resultsChange.textContent = result.change;
      resultsTrack.style.width = `${((activeResult + 1) / resultsStories.length) * 100}%`;

      resultsIndicators.forEach((indicator, indicatorIndex) => {
        indicator.setAttribute("aria-current", String(indicatorIndex === activeResult));
      });
      updateUpcomingResults();

      resultsStory.classList.remove("is-changing");
      window.requestAnimationFrame(() => resultsStory.classList.add("is-changing"));

      if (manual) {
        resultsAnnouncement.textContent = currentLocale.carousel.announcement(result.name, result.profession);
        scheduleResultsTimer();
      }
    }

    resultsPrevious.addEventListener("click", () => showResult(activeResult - 1));
    resultsNext.addEventListener("click", () => showResult(activeResult + 1));

    resultsIndicators.forEach((indicator) => {
      indicator.addEventListener("click", () => showResult(Number(indicator.dataset.resultsIndicator)));
    });

    resultsUpcomingGroups.forEach((group) => {
      group.addEventListener("click", (event) => {
        const button = event.target.closest("[data-results-upcoming]");
        if (button) showResult(Number(button.dataset.resultsUpcoming));
      });
    });

    resultsCarousel.addEventListener("mouseenter", () => {
      resultsHovered = true;
      stopResultsTimer();
    });

    resultsCarousel.addEventListener("mouseleave", () => {
      resultsHovered = false;
      scheduleResultsTimer();
    });

    resultsCarousel.addEventListener("focusin", () => {
      resultsFocused = true;
      stopResultsTimer();
    });

    resultsCarousel.addEventListener("focusout", () => {
      window.setTimeout(() => {
        resultsFocused = resultsCarousel.contains(document.activeElement);
        scheduleResultsTimer();
      }, 0);
    });

    resultsCarousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showResult(activeResult - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showResult(activeResult + 1);
      }
    });

    resultsCarousel.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      },
      { passive: true },
    );

    resultsCarousel.addEventListener(
      "touchend",
      (event) => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        if (Math.abs(deltaX) < 52 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;
        showResult(activeResult + (deltaX < 0 ? 1 : -1));
      },
      { passive: true },
    );

    resultsCarousel.addEventListener("touchcancel", () => {
      touchStartX = 0;
      touchStartY = 0;
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopResultsTimer();
      else scheduleResultsTimer();
    });
    reducedMotionQuery.addEventListener("change", scheduleResultsTimer);
    window.addEventListener("pagehide", stopResultsTimer, { once: true });

    showResult(0, false);
    scheduleResultsTimer();
  }

  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(currentLocale.whatsappMessage)}`;
  });
  window.addEventListener("hashchange", () => {
    syncLocaleLinks();
    window.requestAnimationFrame(alignCurrentSectionHash);
  });
  window.addEventListener("load", stabilizeInitialSectionHash, { once: true });
  syncLocaleLinks();
  stabilizeInitialSectionHash();
  updateMenuLabel();
  syncSlideshow();
  trackHomepageEvent("homepage_viewed");
})();
