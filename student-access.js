(() => {
  const languageStorageKey = "starSpeakerLanguage";
  const workspacePage = "student-workspace.html";
  const loginPage = "login.html";

  const copy = {
    en: {
      checking: "Checking your private Star Speaker access.",
      signingIn: "Checking your student access...",
      missingEmail: "Please enter your email.",
      missingPassword: "Please enter your password.",
      invalidLogin: "We could not log you in. Please check your email and password.",
      notConfigured: "Student access is not configured yet. Please contact Star Speaker.",
      denied: "Your portal access is not active yet. Please contact Star Speaker.",
      profilePreparing: "Your profile is being prepared.",
      welcome: (name) => `Welcome back, ${name}.`,
      active: "Active",
      checkingPill: "Checking",
      readyPill: "Active",
      loggingOut: "Signing out...",
      signedOut: "You have been signed out.",
      workspaceSubtitle: "Your private Star Speaker workspace is ready.",
    },
    tr: {
      checking: "Özel Star Speaker erişiminiz kontrol ediliyor.",
      signingIn: "Öğrenci erişiminiz kontrol ediliyor...",
      missingEmail: "Lütfen e-posta adresinizi girin.",
      missingPassword: "Lütfen şifrenizi girin.",
      invalidLogin: "Giriş yapılamadı. Lütfen e-posta ve şifrenizi kontrol edin.",
      notConfigured: "Öğrenci erişimi henüz yapılandırılmadı. Lütfen Star Speaker ile iletişime geçin.",
      denied: "Portal erişiminiz henüz aktif değil. Lütfen Star Speaker ile iletişime geçin.",
      profilePreparing: "Profiliniz hazırlanıyor.",
      welcome: (name) => `Tekrar hoş geldin, ${name}.`,
      active: "Aktif",
      checkingPill: "Kontrol",
      readyPill: "Aktif",
      loggingOut: "Çıkış yapılıyor...",
      signedOut: "Çıkış yaptınız.",
      workspaceSubtitle: "Özel Star Speaker çalışma alanınız hazır.",
    },
  };

  function getLanguage() {
    return localStorage.getItem(languageStorageKey) === "tr" ? "tr" : "en";
  }

  function t(key, ...args) {
    const value = copy[getLanguage()][key] || copy.en[key] || key;
    return typeof value === "function" ? value(...args) : value;
  }

  function getPageName() {
    return window.location.pathname.split("/").pop() || "index.html";
  }

  function getRelativeUrl(fileName, params = {}) {
    const url = new URL(fileName, window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.href;
  }

  function setStatus(element, message, type = "") {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("is-error", type === "error");
    element.classList.toggle("is-success", type === "success");
  }

  function setFieldError(input, element, message) {
    if (!input || !element) return;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    element.textContent = message || "";
  }

  async function getSessionUser() {
    const session = await window.starSpeakerSupabase?.getSession?.();
    return session?.user || null;
  }

  async function getActiveProfile(user) {
    const profile = await window.starSpeakerSupabase?.getStudentProfile?.(user);
    if (!profile || profile.access_status !== "active") {
      return { profile, active: false };
    }

    return { profile, active: true };
  }

  async function denyAccess(user, reason, profile = null) {
    await window.starSpeakerSupabase?.insertPortalEvent?.(user, "login_denied", {
      reason,
      access_status: profile?.access_status || null,
    });
    await window.starSpeakerSupabase?.signOutStudent?.();
  }

  async function markSuccessfulLogin(user, profile) {
    await window.starSpeakerSupabase?.insertPortalEvent?.(user, "login_success", {
      program: profile.program || null,
    });

    if (!profile.first_login_at) {
      await window.starSpeakerSupabase?.insertPortalEvent?.(user, "first_login", {
        program: profile.program || null,
      });
    }

    await window.starSpeakerSupabase?.updateStudentLoginTimestamps?.(profile, user);
  }

  function initLoginPage() {
    const form = document.querySelector("#student-login-form");
    const emailInput = document.querySelector("#student-email");
    const passwordInput = document.querySelector("#student-password");
    const emailError = document.querySelector("#student-email-error");
    const passwordError = document.querySelector("#student-password-error");
    const status = document.querySelector("#student-login-status");
    const button = document.querySelector("#student-login-button");

    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "denied") {
      setStatus(status, t("denied"), "error");
    }

    if (!window.starSpeakerSupabase?.isConfigured?.()) {
      setStatus(status, t("notConfigured"), "error");
    } else {
      getSessionUser()
        .then(async (user) => {
          if (!user) return;
          const { profile, active } = await getActiveProfile(user);
          if (active) {
            window.location.replace(getRelativeUrl(workspacePage));
            return;
          }
          await denyAccess(user, "inactive_or_missing_profile", profile);
          setStatus(status, t("denied"), "error");
        })
        .catch((error) => {
          console.warn("Existing student session check failed:", error);
        });
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      let hasError = false;
      let signedInUser = null;

      setFieldError(emailInput, emailError, "");
      setFieldError(passwordInput, passwordError, "");
      setStatus(status, "");

      if (!email) {
        setFieldError(emailInput, emailError, t("missingEmail"));
        hasError = true;
      }

      if (!password) {
        setFieldError(passwordInput, passwordError, t("missingPassword"));
        hasError = true;
      }

      if (hasError) {
        (email ? passwordInput : emailInput).focus();
        return;
      }

      try {
        button?.setAttribute("disabled", "true");
        setStatus(status, t("signingIn"), "success");

        const auth = await window.starSpeakerSupabase.signInStudent(email, password);
        const user = auth?.user || auth?.session?.user;
        if (!user) {
          throw new Error("No Supabase user returned.");
        }
        signedInUser = user;

        const { profile, active } = await getActiveProfile(user);
        if (!active) {
          await denyAccess(user, profile ? "inactive_profile" : "profile_missing", profile);
          setStatus(status, t("denied"), "error");
          return;
        }

        await markSuccessfulLogin(user, profile);
        window.location.href = getRelativeUrl(workspacePage);
      } catch (error) {
        console.warn("Student login failed:", error);
        if (signedInUser) {
          try {
            await window.starSpeakerSupabase?.signOutStudent?.();
          } catch (signOutError) {
            console.warn("Student cleanup sign out failed:", signOutError);
          }
        }
        setStatus(status, t("invalidLogin"), "error");
      } finally {
        button?.removeAttribute("disabled");
      }
    });
  }

  function renderWorkspace(profile) {
    const name = profile?.full_name || t("profilePreparing");
    const program = profile?.program || t("profilePreparing");
    const week = profile?.current_week ? String(profile.current_week) : t("profilePreparing");
    const focus = profile?.current_focus || t("profilePreparing");

    const title = document.querySelector("#workspace-title");
    const subtitle = document.querySelector("#workspace-subtitle");
    const pill = document.querySelector("#workspace-status-pill");
    const programElement = document.querySelector("#workspace-program");
    const weekElement = document.querySelector("#workspace-week");
    const focusElement = document.querySelector("#workspace-focus");
    const statusElement = document.querySelector("#workspace-access-status");
    const note = document.querySelector("#workspace-profile-note");

    if (title) title.textContent = profile?.full_name ? t("welcome", name) : t("profilePreparing");
    if (subtitle) subtitle.textContent = t("workspaceSubtitle");
    if (pill) pill.textContent = t("readyPill");
    if (programElement) programElement.textContent = program;
    if (weekElement) weekElement.textContent = week;
    if (focusElement) focusElement.textContent = focus;
    if (statusElement) statusElement.textContent = t("active");
    if (note) note.textContent = profile?.full_name ? t("workspaceSubtitle") : t("profilePreparing");
  }

  function initWorkspacePage() {
    const logoutButton = document.querySelector("#student-logout-button");
    const subtitle = document.querySelector("#workspace-subtitle");
    const pill = document.querySelector("#workspace-status-pill");

    if (subtitle) subtitle.textContent = t("checking");
    if (pill) pill.textContent = t("checkingPill");

    if (!window.starSpeakerSupabase?.isConfigured?.()) {
      window.location.replace(getRelativeUrl(loginPage, { access: "denied" }));
      return;
    }

    getSessionUser()
      .then(async (user) => {
        if (!user) {
          window.location.replace(getRelativeUrl(loginPage));
          return;
        }

        const { profile, active } = await getActiveProfile(user);
        if (!active) {
          await denyAccess(user, profile ? "inactive_profile_workspace" : "profile_missing_workspace", profile);
          window.location.replace(getRelativeUrl(loginPage, { access: "denied" }));
          return;
        }

        await window.starSpeakerSupabase?.updateStudentLoginTimestamps?.(profile, user);
        renderWorkspace(profile);
      })
      .catch(async (error) => {
        console.warn("Student workspace guard failed:", error);
        try {
          await window.starSpeakerSupabase?.signOutStudent?.();
        } finally {
          window.location.replace(getRelativeUrl(loginPage, { access: "denied" }));
        }
      });

    logoutButton?.addEventListener("click", async () => {
      try {
        logoutButton.setAttribute("disabled", "true");
        if (subtitle) subtitle.textContent = t("loggingOut");
        const user = await getSessionUser();
        await window.starSpeakerSupabase?.insertPortalEvent?.(user, "logout", {});
        await window.starSpeakerSupabase?.signOutStudent?.();
        window.location.href = getRelativeUrl(loginPage);
      } catch (error) {
        console.warn("Student logout failed:", error);
        window.location.href = getRelativeUrl(loginPage);
      }
    });
  }

  function init() {
    const page = getPageName();
    if (page === loginPage) {
      initLoginPage();
    }

    if (page === workspacePage) {
      initWorkspacePage();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
