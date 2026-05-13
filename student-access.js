(() => {
  const languageStorageKey = "starSpeakerLanguage";
  const workspacePage = "student-workspace.html";
  const loginPage = "login.html";
  const resetPage = "reset-password.html";

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
      welcome: (name) => (name ? `Welcome back, ${name}.` : "Welcome back."),
      active: "Active",
      checkingPill: "Checking",
      readyPill: "Active",
      loggingOut: "Signing out...",
      workspaceSubtitle: "Your speaking workspace is ready.",
      currentWeek: (week) => `Week ${week}`,
      noFocus: "Profile being prepared",
      forgotPassword: "Please enter your email first so we can send the reset link.",
      resetEmailSending: "Sending password recovery email...",
      resetEmailSent: "Password recovery email sent. Please check your inbox.",
      resetEmailError: "We could not send the password recovery email. Please try again.",
      resetChecking: "Checking recovery link...",
      resetInvalid: "This password recovery link is invalid or expired. Please request a new link from the login page.",
      resetMissingPassword: "Please enter a new password.",
      resetMissingConfirm: "Please confirm your new password.",
      resetShortPassword: "Password must be at least 8 characters.",
      resetMismatch: "Passwords do not match.",
      resetUpdating: "Updating your password...",
      resetSuccess: "Your password has been updated. Redirecting to login...",
      resetError: "We could not update your password. Please request a new link and try again.",
      voiceHelper: "Record your speaking practice for today.",
      voiceNotSubmitted: "Today: Not submitted",
      voiceSubmitted: "Today: Submitted",
      voiceIdleMessage: "No voice submission yet.",
      voiceSubmittedMessage: "Your voice practice has been received. Your coach will review it soon.",
      voiceStart: "Start Recording",
      voiceStop: "Stop Recording",
      voiceSubmit: "Submit Voice",
      voiceAgain: "Record Again",
      voiceUpload: "Upload Audio",
      voiceRecording: "Recording...",
      voiceUploading: "Uploading your voice practice...",
      voicePreview: "Preview Recording",
      voiceMicDenied: "Microphone access was blocked. Please allow microphone permission and try again.",
      voiceUnsupported: "Voice recording is not available on this device. You can still upload an audio file.",
      voiceUploadFailed: "We could not submit your voice practice. Please try again.",
      voiceNoRecording: "Please record or upload a voice file before submitting.",
      voiceTooLarge: "Please upload an audio file under 20MB.",
      voiceTooShort: "Please record a little longer before previewing.",
      voiceQueryFailed: "Voice status could not be loaded right now.",
      taskSubmitted: "Submitted",
      taskNotSubmitted: "Not submitted",
      oneTaskComplete: "1 / 1 Task",
      zeroTaskComplete: "0 / 1 Task",
      weeklySummary: (count) => `${count} / 7 tasks completed`,
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
      welcome: (name) => (name ? `Tekrar hoş geldin, ${name}.` : "Tekrar hoş geldin."),
      active: "Aktif",
      checkingPill: "Kontrol",
      readyPill: "Aktif",
      loggingOut: "Çıkış yapılıyor...",
      workspaceSubtitle: "Konuşma çalışma alanın hazır.",
      currentWeek: (week) => `Hafta ${week}`,
      noFocus: "Profil hazırlanıyor",
      forgotPassword: "Şifre yenileme bağlantısı gönderebilmemiz için lütfen e-posta adresinizi girin.",
      resetEmailSending: "Şifre yenileme e-postası gönderiliyor...",
      resetEmailSent: "Şifre yenileme e-postası gönderildi. Lütfen gelen kutunuzu kontrol edin.",
      resetEmailError: "Şifre yenileme e-postası gönderilemedi. Lütfen tekrar deneyin.",
      resetChecking: "Şifre yenileme bağlantısı kontrol ediliyor...",
      resetInvalid: "Bu şifre yenileme bağlantısı geçersiz veya süresi dolmuş. Lütfen giriş sayfasından yeni bir bağlantı talep edin.",
      resetMissingPassword: "Lütfen yeni şifrenizi girin.",
      resetMissingConfirm: "Lütfen yeni şifrenizi onaylayın.",
      resetShortPassword: "Şifre en az 8 karakter olmalıdır.",
      resetMismatch: "Şifreler eşleşmiyor.",
      resetUpdating: "Şifreniz güncelleniyor...",
      resetSuccess: "Şifreniz güncellendi. Giriş sayfasına yönlendiriliyorsunuz...",
      resetError: "Şifreniz güncellenemedi. Lütfen yeni bir bağlantı talep edip tekrar deneyin.",
      voiceHelper: "Bugünkü konuşma pratiğini kaydet.",
      voiceNotSubmitted: "Bugün: Gönderilmedi",
      voiceSubmitted: "Bugün: Gönderildi",
      voiceIdleMessage: "Henüz ses kaydı yok.",
      voiceSubmittedMessage: "Ses pratiğin alındı. Koçun yakında inceleyecek.",
      voiceStart: "Kaydı Başlat",
      voiceStop: "Kaydı Durdur",
      voiceSubmit: "Sesi Gönder",
      voiceAgain: "Tekrar Kaydet",
      voiceUpload: "Ses Yükle",
      voiceRecording: "Kaydediliyor...",
      voiceUploading: "Ses pratiğin yükleniyor...",
      voicePreview: "Kaydı Önizle",
      voiceMicDenied: "Mikrofon erişimi engellendi. Lütfen mikrofon izni verip tekrar dene.",
      voiceUnsupported: "Bu cihazda ses kaydı kullanılamıyor. Yine de bir ses dosyası yükleyebilirsin.",
      voiceUploadFailed: "Ses pratiğini gönderemedik. Lütfen tekrar dene.",
      voiceNoRecording: "Lütfen göndermeden önce ses kaydet veya bir ses dosyası yükle.",
      voiceTooLarge: "Lütfen 20MB altında bir ses dosyası yükle.",
      voiceTooShort: "Lütfen önizlemeden önce biraz daha uzun kaydet.",
      voiceQueryFailed: "Ses durumu şu anda yüklenemedi.",
      taskSubmitted: "Gönderildi",
      taskNotSubmitted: "Gönderilmedi",
      oneTaskComplete: "1 / 1 Görev",
      zeroTaskComplete: "0 / 1 Görev",
      weeklySummary: (count) => `${count} / 7 görev tamamlandı`,
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

  function getResetPasswordUrl() {
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);
    return `${window.location.origin}${basePath}${resetPage}`;
  }

  function getRecoveryParams() {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const search = new URLSearchParams(window.location.search);
    return {
      hash,
      search,
      code: search.get("code"),
      tokenHash: search.get("token_hash"),
      type: search.get("type") || hash.get("type"),
      accessToken: hash.get("access_token") || search.get("access_token"),
      refreshToken: hash.get("refresh_token") || search.get("refresh_token"),
    };
  }

  function hasRecoveryParams() {
    const params = getRecoveryParams();
    return (
      params.type === "recovery" ||
      Boolean(params.accessToken) ||
      Boolean(params.refreshToken) ||
      Boolean(params.code) ||
      Boolean(params.tokenHash)
    );
  }

  function cleanRecoveryUrl() {
    if (!window.history?.replaceState) return;

    const search = new URLSearchParams(window.location.search);
    ["code", "token_hash", "type", "access_token", "refresh_token"].forEach((key) => {
      search.delete(key);
    });

    const query = search.toString();
    const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState({}, document.title, cleanUrl);
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
    const forgotButton = document.querySelector("#forgot-password-button");

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

    forgotButton?.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      setFieldError(emailInput, emailError, "");
      setStatus(status, "");

      if (!email) {
        setFieldError(emailInput, emailError, t("forgotPassword"));
        emailInput.focus();
        return;
      }

      try {
        forgotButton.setAttribute("disabled", "true");
        setStatus(status, t("resetEmailSending"), "success");
        await window.starSpeakerSupabase.sendPasswordReset(email, getResetPasswordUrl());
        setStatus(status, t("resetEmailSent"), "success");
      } catch (error) {
        console.warn("Password recovery email failed:", error);
        setStatus(status, t("resetEmailError"), "error");
      } finally {
        forgotButton.removeAttribute("disabled");
      }
    });
  }

  function initResetPasswordPage() {
    const form = document.querySelector("#reset-password-form");
    const helper = document.querySelector("#reset-password-helper");
    const newPasswordInput = document.querySelector("#new-password");
    const confirmPasswordInput = document.querySelector("#confirm-password");
    const newPasswordError = document.querySelector("#new-password-error");
    const confirmPasswordError = document.querySelector("#confirm-password-error");
    const status = document.querySelector("#reset-password-status");
    const button = document.querySelector("#reset-password-button");

    if (!form) return;

    let recoveryReady = false;
    let invalidTimer = null;

    function setRecoveryReady() {
      recoveryReady = true;
      form.removeAttribute("aria-disabled");
      form.classList.remove("is-invalid");
      if (helper) {
        helper.textContent = document.querySelector("#reset-password-title")?.nextElementSibling?.textContent || "";
      }
      setStatus(status, "");
      window.clearTimeout(invalidTimer);
    }

    function setInvalidRecovery() {
      if (recoveryReady) return;
      form.setAttribute("aria-disabled", "true");
      form.classList.add("is-invalid");
      if (helper) helper.textContent = t("resetInvalid");
      setStatus(status, t("resetInvalid"), "error");
    }

    function validateResetForm() {
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      let hasError = false;

      setFieldError(newPasswordInput, newPasswordError, "");
      setFieldError(confirmPasswordInput, confirmPasswordError, "");

      if (!newPassword) {
        setFieldError(newPasswordInput, newPasswordError, t("resetMissingPassword"));
        hasError = true;
      } else if (newPassword.length < 8) {
        setFieldError(newPasswordInput, newPasswordError, t("resetShortPassword"));
        hasError = true;
      }

      if (!confirmPassword) {
        setFieldError(confirmPasswordInput, confirmPasswordError, t("resetMissingConfirm"));
        hasError = true;
      } else if (newPassword && newPassword !== confirmPassword) {
        setFieldError(confirmPasswordInput, confirmPasswordError, t("resetMismatch"));
        hasError = true;
      }

      if (hasError) {
        (newPassword ? confirmPasswordInput : newPasswordInput).focus();
        return null;
      }

      return newPassword;
    }

    setStatus(status, t("resetChecking"), "success");
    if (helper) helper.textContent = t("resetChecking");

    if (!window.starSpeakerSupabase?.isConfigured?.()) {
      setInvalidRecovery();
      return;
    }

    const supabaseClient = window.starSpeakerSupabase.getClient?.();
    const recoveryParams = getRecoveryParams();
    const recoveryUrl = hasRecoveryParams();

    supabaseClient?.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setRecoveryReady();
        cleanRecoveryUrl();
      }
    });

    async function prepareRecoverySession() {
      try {
        let session = await window.starSpeakerSupabase.getSession?.();
        if (session && recoveryUrl) {
          setRecoveryReady();
          if (recoveryParams.accessToken || recoveryParams.refreshToken) {
            cleanRecoveryUrl();
          }
          return;
        }

        if (recoveryParams.code) {
          try {
            session = await window.starSpeakerSupabase.exchangeRecoveryCode?.(recoveryParams.code);
            if (session) {
              setRecoveryReady();
              cleanRecoveryUrl();
              return;
            }
          } catch (codeError) {
            console.warn("Password recovery code exchange failed:", codeError);
          }
        }

        if (recoveryParams.tokenHash && recoveryParams.type === "recovery") {
          try {
            session = await window.starSpeakerSupabase.verifyRecoveryToken?.(recoveryParams.tokenHash);
            if (session) {
              setRecoveryReady();
              cleanRecoveryUrl();
              return;
            }
          } catch (tokenError) {
            console.warn("Password recovery token verification failed:", tokenError);
          }
        }

        if (recoveryParams.accessToken && recoveryParams.refreshToken) {
          try {
            session = await window.starSpeakerSupabase.setRecoverySession?.(
              recoveryParams.accessToken,
              recoveryParams.refreshToken,
            );
            if (session) {
              setRecoveryReady();
              cleanRecoveryUrl();
              return;
            }
          } catch (hashError) {
            console.warn("Password recovery hash session failed:", hashError);
          }
        }

        session = await window.starSpeakerSupabase.getSession?.();
        if (session && recoveryUrl) {
          setRecoveryReady();
          cleanRecoveryUrl();
        }
      } catch (error) {
        console.warn("Password recovery session check failed:", error);
      }
    }

    prepareRecoverySession();

    invalidTimer = window.setTimeout(() => {
      if (!recoveryReady) {
        setInvalidRecovery();
      }
    }, recoveryUrl ? 5000 : 1800);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!recoveryReady) {
        setInvalidRecovery();
        return;
      }

      const newPassword = validateResetForm();
      if (!newPassword) return;

      try {
        button?.setAttribute("disabled", "true");
        setStatus(status, t("resetUpdating"), "success");
        await window.starSpeakerSupabase.updateStudentPassword(newPassword);
        setStatus(status, t("resetSuccess"), "success");
        try {
          await window.starSpeakerSupabase.signOutStudent?.();
        } catch (signOutError) {
          console.warn("Password reset sign out failed:", signOutError);
        }
        window.setTimeout(() => {
          window.location.href = getRelativeUrl(loginPage);
        }, 2000);
      } catch (error) {
        console.warn("Password update failed:", error);
        setStatus(status, t("resetError"), "error");
        button?.removeAttribute("disabled");
      }
    });
  }

  let activeWorkspaceProfile = null;
  let activeWorkspaceUser = null;
  let voiceMediaRecorder = null;
  let voiceMediaStream = null;
  let voiceChunks = [];
  let voiceTimerId = null;
  let voiceStartTime = 0;
  let voiceObjectUrl = "";
  let voiceFile = null;
  let voiceDurationSeconds = null;
  let voiceSubmittedToday = false;
  let cachedVoiceSubmissions = [];
  let currentVoiceState = "idle";

  const maxVoiceUploadBytes = 20 * 1024 * 1024;
  const maxRecordingSeconds = 120;
  const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function getDisplayName(profile) {
    return String(profile?.full_name || "").trim();
  }

  function getInitials(name, email = "") {
    const source = name || email || "Student";
    const parts = source
      .replace(/@.*/, "")
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return (parts[0]?.[0] || "S").toUpperCase();
  }

  function getSafeFocus(profile) {
    const focus = String(profile?.current_focus || "").trim();
    if (!focus || /survival mode|interaction mode|expression mode|real world mode/i.test(focus)) {
      return t("noFocus");
    }

    return focus;
  }

  function padTime(value) {
    return String(value).padStart(2, "0");
  }

  function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Math.floor(totalSeconds || 0));
    return `${padTime(Math.floor(seconds / 60))}:${padTime(seconds % 60)}`;
  }

  function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = padTime(date.getMonth() + 1);
    const day = padTime(date.getDate());
    return `${year}-${month}-${day}`;
  }

  function getStartOfWeek(date = new Date()) {
    const current = new Date(date);
    current.setHours(0, 0, 0, 0);
    const day = current.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    current.setDate(current.getDate() + diff);
    return current;
  }

  function getCurrentWeekRange() {
    const start = getStartOfWeek();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      start,
      end,
      startDate: getLocalDateString(start),
      endDate: getLocalDateString(end),
    };
  }

  function getSubmittedDateSet(submissions = []) {
    return new Set(
      submissions
        .map((submission) => String(submission?.submission_date || "").slice(0, 10))
        .filter(Boolean),
    );
  }

  function renderWeeklyPractice(submissions = cachedVoiceSubmissions) {
    const row = document.querySelector("#weekly-practice-row");
    const summary = document.querySelector("#weekly-practice-summary");
    if (!row) return;

    const { start } = getCurrentWeekRange();
    const submittedDates = getSubmittedDateSet(submissions);
    let completedCount = 0;

    row.innerHTML = dayKeys
      .map((dayKey, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        const dateKey = getLocalDateString(date);
        const submitted = submittedDates.has(dateKey);
        if (submitted) completedCount += 1;

        return `
          <article class="practice-day${submitted ? " is-submitted" : ""}">
            <strong>${dayKey}</strong>
            <span>${submitted ? t("oneTaskComplete") : t("zeroTaskComplete")}</span>
            <small>${submitted ? t("taskSubmitted") : t("taskNotSubmitted")}</small>
          </article>
        `;
      })
      .join("");

    if (summary) summary.textContent = t("weeklySummary", completedCount);
  }

  function getVoiceElements() {
    return {
      helper: document.querySelector("#voice-log-helper"),
      panel: document.querySelector(".voice-log-panel"),
      statusPill: document.querySelector("#voice-status-pill"),
      meter: document.querySelector("#voice-recorder-meter"),
      timer: document.querySelector("#voice-recorder-timer"),
      audio: document.querySelector("#voice-audio-preview"),
      message: document.querySelector("#voice-log-message"),
      startButton: document.querySelector("#voice-start-button"),
      stopButton: document.querySelector("#voice-stop-button"),
      submitButton: document.querySelector("#voice-submit-button"),
      againButton: document.querySelector("#voice-again-button"),
      uploadButton: document.querySelector("#voice-upload-button"),
      uploadInput: document.querySelector("#voice-upload-input"),
    };
  }

  function setVoiceMessage(message, type = "") {
    const { message: messageElement } = getVoiceElements();
    if (!messageElement) return;
    messageElement.textContent = message || "";
    messageElement.classList.toggle("is-success", type === "success");
    messageElement.classList.toggle("is-error", type === "error");
  }

  function setVoiceButtonsDisabled(disabled) {
    const elements = getVoiceElements();
    [
      elements.startButton,
      elements.stopButton,
      elements.submitButton,
      elements.againButton,
      elements.uploadButton,
    ].forEach((button) => {
      if (!button) return;
      button.toggleAttribute("disabled", disabled);
    });
  }

  function renderVoiceLabels() {
    const elements = getVoiceElements();
    if (elements.helper) elements.helper.textContent = t("voiceHelper");
    if (elements.startButton) elements.startButton.textContent = t("voiceStart");
    if (elements.stopButton) elements.stopButton.textContent = t("voiceStop");
    if (elements.submitButton) elements.submitButton.textContent = t("voiceSubmit");
    if (elements.againButton) elements.againButton.textContent = t("voiceAgain");
    if (elements.uploadButton) elements.uploadButton.textContent = t("voiceUpload");
  }

  function setVoiceStatus(submitted) {
    const { statusPill } = getVoiceElements();
    if (!statusPill) return;
    statusPill.classList.toggle("is-submitted", submitted);
    statusPill.innerHTML = `<span aria-hidden="true"></span><strong>${submitted ? t("voiceSubmitted") : t("voiceNotSubmitted")}</strong>`;
  }

  function clearVoiceObjectUrl() {
    if (voiceObjectUrl) {
      URL.revokeObjectURL(voiceObjectUrl);
      voiceObjectUrl = "";
    }
  }

  function stopVoiceStream() {
    if (voiceMediaStream) {
      voiceMediaStream.getTracks().forEach((track) => track.stop());
      voiceMediaStream = null;
    }
  }

  function clearVoiceTimer() {
    window.clearInterval(voiceTimerId);
    voiceTimerId = null;
  }

  function resetVoiceRecordingState() {
    clearVoiceTimer();
    stopVoiceStream();
    clearVoiceObjectUrl();
    voiceChunks = [];
    voiceFile = null;
    voiceDurationSeconds = null;
    voiceMediaRecorder = null;
    const { audio, timer, uploadInput } = getVoiceElements();
    if (audio) {
      audio.hidden = true;
      audio.removeAttribute("src");
    }
    if (timer) timer.textContent = "00:00";
    if (uploadInput) uploadInput.value = "";
  }

  function renderVoiceState(state = "idle") {
    const elements = getVoiceElements();
    if (!elements.panel) return;

    currentVoiceState = state;
    renderVoiceLabels();
    elements.panel.dataset.voiceState = state;
    setVoiceStatus(voiceSubmittedToday);

    const isRecording = state === "recording";
    const isPreview = state === "preview";
    const isUploading = state === "uploading";
    const isSubmitted = state === "submitted" || voiceSubmittedToday;

    if (elements.meter) elements.meter.hidden = !isRecording;
    if (elements.startButton) elements.startButton.hidden = isRecording || isPreview || isSubmitted;
    if (elements.stopButton) elements.stopButton.hidden = !isRecording;
    if (elements.submitButton) elements.submitButton.hidden = !isPreview || isSubmitted;
    if (elements.againButton) elements.againButton.hidden = !isPreview || isSubmitted;
    if (elements.uploadButton) elements.uploadButton.hidden = isRecording || isPreview || isSubmitted;

    setVoiceButtonsDisabled(isUploading);

    if (isRecording) {
      setVoiceMessage(t("voiceRecording"), "success");
    } else if (isUploading) {
      setVoiceMessage(t("voiceUploading"), "success");
    } else if (isSubmitted) {
      setVoiceMessage(t("voiceSubmittedMessage"), "success");
    } else if (isPreview) {
      setVoiceMessage(t("voicePreview"), "success");
    } else {
      setVoiceMessage(t("voiceIdleMessage"));
    }
  }

  function getBestRecorderMimeType() {
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];

    return candidates.find((type) => window.MediaRecorder?.isTypeSupported?.(type)) || "";
  }

  async function startVoiceRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder !== "function") {
      setVoiceMessage(t("voiceUnsupported"), "error");
      return;
    }

    try {
      resetVoiceRecordingState();
      voiceMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getBestRecorderMimeType();
      voiceMediaRecorder = new MediaRecorder(
        voiceMediaStream,
        mimeType ? { mimeType } : undefined,
      );
      voiceChunks = [];
      voiceStartTime = Date.now();

      voiceMediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data?.size) {
          voiceChunks.push(event.data);
        }
      });

      voiceMediaRecorder.addEventListener("stop", () => {
        clearVoiceTimer();
        stopVoiceStream();
        voiceDurationSeconds = Math.max(0, Math.round((Date.now() - voiceStartTime) / 1000));

        if (voiceDurationSeconds < 1 || !voiceChunks.length) {
          resetVoiceRecordingState();
          renderVoiceState("idle");
          setVoiceMessage(t("voiceTooShort"), "error");
          return;
        }

        const type = voiceMediaRecorder?.mimeType || "audio/webm";
        voiceFile = new Blob(voiceChunks, { type });
        clearVoiceObjectUrl();
        voiceObjectUrl = URL.createObjectURL(voiceFile);
        const { audio } = getVoiceElements();
        if (audio) {
          audio.src = voiceObjectUrl;
          audio.hidden = false;
        }
        renderVoiceState("preview");
      });

      voiceMediaRecorder.start();
      renderVoiceState("recording");
      const { timer } = getVoiceElements();
      voiceTimerId = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - voiceStartTime) / 1000);
        if (timer) timer.textContent = formatDuration(elapsed);
        if (elapsed >= maxRecordingSeconds && voiceMediaRecorder?.state === "recording") {
          voiceMediaRecorder.stop();
        }
      }, 250);
    } catch (error) {
      console.warn("Voice recording failed:", error);
      resetVoiceRecordingState();
      renderVoiceState("idle");
      setVoiceMessage(t("voiceMicDenied"), "error");
    }
  }

  function stopVoiceRecording() {
    if (voiceMediaRecorder?.state === "recording") {
      voiceMediaRecorder.stop();
    }
  }

  function handleVoiceUploadFile(file) {
    if (!file) return;
    if (file.size > maxVoiceUploadBytes) {
      setVoiceMessage(t("voiceTooLarge"), "error");
      return;
    }

    resetVoiceRecordingState();
    voiceFile = file;
    voiceDurationSeconds = null;
    voiceObjectUrl = URL.createObjectURL(file);
    const { audio } = getVoiceElements();
    if (audio) {
      audio.src = voiceObjectUrl;
      audio.hidden = false;
    }
    renderVoiceState("preview");
  }

  async function submitVoicePractice() {
    if (!activeWorkspaceUser?.id) {
      setVoiceMessage(t("denied"), "error");
      return;
    }

    if (!voiceFile) {
      setVoiceMessage(t("voiceNoRecording"), "error");
      return;
    }

    const submissionDate = getLocalDateString();

    try {
      renderVoiceState("uploading");
      const upload = await window.starSpeakerSupabase.uploadVoiceSubmissionAudio(
        voiceFile,
        activeWorkspaceUser.id,
        submissionDate,
      );

      await window.starSpeakerSupabase.insertVoiceSubmission({
        user_id: activeWorkspaceUser.id,
        student_email: activeWorkspaceUser.email || activeWorkspaceProfile?.email || null,
        storage_path: upload.path,
        audio_url: upload.publicUrl || null,
        duration_seconds: voiceDurationSeconds,
        submission_date: submissionDate,
        status: "submitted",
      });

      voiceSubmittedToday = true;
      resetVoiceRecordingState();
      await hydrateVoiceSubmissions(activeWorkspaceUser);
      renderVoiceState("submitted");
    } catch (error) {
      console.warn("Voice submission failed:", error);
      renderVoiceState(voiceFile ? "preview" : "idle");
      setVoiceMessage(t("voiceUploadFailed"), "error");
    }
  }

  async function hydrateVoiceSubmissions(user) {
    if (!user?.id) return;
    try {
      const { startDate, endDate } = getCurrentWeekRange();
      cachedVoiceSubmissions = await window.starSpeakerSupabase.getVoiceSubmissions?.(
        user.id,
        startDate,
        endDate,
      ) || [];
      const today = getLocalDateString();
      voiceSubmittedToday = cachedVoiceSubmissions.some((submission) => (
        String(submission?.submission_date || "").slice(0, 10) === today
      ));
      renderWeeklyPractice(cachedVoiceSubmissions);
      renderVoiceState(voiceSubmittedToday ? "submitted" : "idle");
    } catch (error) {
      console.warn("Voice submission status load failed:", error);
      cachedVoiceSubmissions = [];
      voiceSubmittedToday = false;
      renderWeeklyPractice([]);
      renderVoiceState("idle");
      setVoiceMessage(t("voiceQueryFailed"), "error");
    }
  }

  function bindVoiceLogControls() {
    const elements = getVoiceElements();
    elements.startButton?.addEventListener("click", startVoiceRecording);
    elements.stopButton?.addEventListener("click", stopVoiceRecording);
    elements.submitButton?.addEventListener("click", submitVoicePractice);
    elements.againButton?.addEventListener("click", () => {
      resetVoiceRecordingState();
      renderVoiceState("idle");
    });
    elements.uploadButton?.addEventListener("click", () => elements.uploadInput?.click());
    elements.uploadInput?.addEventListener("change", () => {
      handleVoiceUploadFile(elements.uploadInput.files?.[0]);
    });
  }

  function renderWorkspace(profile) {
    activeWorkspaceProfile = profile || null;
    const name = getDisplayName(profile);
    const program = profile?.program || t("profilePreparing");
    const week = profile?.current_week ? t("currentWeek", profile.current_week) : t("profilePreparing");
    const focus = getSafeFocus(profile);

    const title = document.querySelector("#workspace-title");
    const subtitle = document.querySelector("#workspace-subtitle");
    const pill = document.querySelector("#workspace-status-pill");
    const programElement = document.querySelector("#workspace-program");
    const weekElement = document.querySelector("#workspace-week");
    const focusElement = document.querySelector("#workspace-focus");
    const statusElement = document.querySelector("#workspace-access-status");
    const note = document.querySelector("#workspace-profile-note");
    const avatar = document.querySelector("#workspace-avatar");
    const userName = document.querySelector("#workspace-user-name");

    if (title) title.textContent = t("welcome", name);
    if (subtitle) subtitle.textContent = t("workspaceSubtitle");
    if (pill) pill.textContent = t("readyPill");
    if (programElement) programElement.textContent = program;
    if (weekElement) weekElement.textContent = week;
    if (focusElement) focusElement.textContent = focus;
    if (statusElement) statusElement.textContent = t("active");
    if (note) note.textContent = profile?.full_name ? t("workspaceSubtitle") : t("profilePreparing");
    if (avatar) avatar.textContent = getInitials(name, profile?.email);
    if (userName) userName.textContent = name || "Student";
    renderVoiceLabels();
    renderWeeklyPractice(cachedVoiceSubmissions);
    renderVoiceState(currentVoiceState || (voiceSubmittedToday ? "submitted" : "idle"));
  }

  function initWorkspacePage() {
    const logoutButton = document.querySelector("#student-logout-button");
    const subtitle = document.querySelector("#workspace-subtitle");
    const pill = document.querySelector("#workspace-status-pill");

    if (subtitle) subtitle.textContent = t("checking");
    if (pill) pill.textContent = t("checkingPill");
    bindVoiceLogControls();
    renderWeeklyPractice([]);
    renderVoiceState("idle");

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
        activeWorkspaceUser = user;
        renderWorkspace(profile);
        await hydrateVoiceSubmissions(user);
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
        resetVoiceRecordingState();
        await window.starSpeakerSupabase?.insertPortalEvent?.(user, "logout", {});
        await window.starSpeakerSupabase?.signOutStudent?.();
        window.location.href = getRelativeUrl(loginPage);
      } catch (error) {
        console.warn("Student logout failed:", error);
        window.location.href = getRelativeUrl(loginPage);
      }
    });

    window.addEventListener("starSpeakerLanguageChange", () => {
      if (activeWorkspaceProfile) {
        renderWorkspace(activeWorkspaceProfile);
      } else {
        if (subtitle) subtitle.textContent = t("checking");
        if (pill) pill.textContent = t("checkingPill");
      }
    });
  }

  function init() {
    const page = getPageName();
    if (page === loginPage) {
      initLoginPage();
    }

    if (page === resetPage) {
      initResetPasswordPage();
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
