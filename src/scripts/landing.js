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

  const resultsCarousel = document.querySelector(".stage-results-carousel");
  const resultsStories = [
    {
      name: "Ömer Karademir",
      profession: "Makine Mühendisi",
      initials: "ÖK",
      quote:
        "“Benim en büyük problemim toplantılarda ne söyleyeceğimi bulamamaktı. Kafamda önce Türkçe düşünüp sonra İngilizceye çevirmeye çalışıyordum ve bu yüzden çok yavaş kalıyordum. Burada yaptığımız çalışmalar bana İngilizce düşünmeyi ve fikirlerimi daha hızlı toparlamayı öğretti. Artık toplantılarda kendimi daha net ifade edebiliyorum ve konuşurken eskisi kadar donup kalmıyorum.”",
      before:
        "Toplantılarda fikir bulamıyor, Türkçeden İngilizceye çeviri yaparken yavaşlıyor ve donup kalıyordu.",
      focus: "Doğrudan İngilizce düşünme, hızlı fikir oluşturma ve toplantı senaryolarında konuşma pratiği.",
      change: "Toplantılarda fikirlerini daha hızlı toparlıyor ve kendini daha net ifade edebiliyor.",
    },
    {
      name: "Ceren Aksu",
      profession: "Elektrik Mühendisi",
      initials: "CA",
      quote:
        "“İngilizcem kötü değildi ama konuşmam gerektiğinde çok geriliyordum. Bildiğim şeyleri bile stres yüzünden kullanamıyordum. Derslerde farklı insanlarla konuşmak, gerçek hayat senaryolarında pratik yapmak ve hata yapmaktan korkmadan konuşmak bana çok iyi geldi. Şimdi daha kontrollü, daha rahat ve daha özgüvenli konuşabiliyorum.”",
      before:
        "İngilizcesi iyi olmasına rağmen konuşurken yoğun stres yaşıyor ve bildiklerini kullanmakta zorlanıyordu.",
      focus:
        "Farklı insanlarla gerçek hayat senaryoları, kademeli konuşma pratiği ve hata yapma korkusunu azaltan güvenli uygulamalar.",
      change: "Farklı insanlarla daha kontrollü, rahat ve özgüvenli şekilde konuşabiliyor.",
    },
    {
      name: "Yaren Ulaş",
      profession: "Endüstri Mühendisi",
      initials: "YU",
      quote:
        "“Reading, listening ve writing tarafında kendime güveniyordum ama IELTS Speaking benim için çok stresliydi. Cevaplarım bazen dağınık oluyordu ve sınavda nasıl daha düzenli konuşmam gerektiğini bilmiyordum. Burada özellikle IELTS’e uygun cevap kurmayı, fikirlerimi organize etmeyi ve daha net konuşmayı öğrendim. Şimdi sınav formatına çok daha hazır hissediyorum.”",
      before:
        "Diğer İngilizce becerilerine güvenmesine rağmen IELTS Speaking cevapları dağınık kalıyor ve sınav stresi performansını etkiliyordu.",
      focus:
        "IELTS’e uygun cevap yapıları, fikir organizasyonu ve sınav formatında düzenli konuşma uygulamaları.",
      change:
        "Cevaplarını daha düzenli ve net oluşturuyor; kendisini IELTS Speaking formatına çok daha hazır hissediyor.",
    },
  ];

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
          button.setAttribute("aria-label", `${targetStory.name} sonucunu göster`);
          button.querySelector(".stage-results-upcoming-name").textContent = targetStory.name;
          button.querySelector(".stage-results-upcoming-role").textContent = targetStory.profession;
        });
      });
    }

    function showResult(index, manual = true) {
      activeResult = (index + resultsStories.length) % resultsStories.length;
      const result = resultsStories[activeResult];

      resultsCurrent.textContent = String(activeResult + 1).padStart(2, "0");
      resultsCounter.setAttribute("aria-label", `Öğrenci ${activeResult + 1} / ${resultsStories.length}`);
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
        resultsAnnouncement.textContent = `${result.name}, ${result.profession} sonucu gösteriliyor.`;
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

  applyLanguage(detectedLanguage());
  syncSlideshow();
})();
