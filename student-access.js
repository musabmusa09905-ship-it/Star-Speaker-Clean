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
      dayMon: "Mon",
      dayTue: "Tue",
      dayWed: "Wed",
      dayThu: "Thu",
      dayFri: "Fri",
      daySat: "Sat",
      daySun: "Sun",
      weeklySummary: (count) => `${count} / 7 tasks completed`,
      weeklyLoadError: "We could not load your weekly practice right now.",
      feedbackEmptyTitle: "No feedback yet.",
      feedbackEmptyBody: "Your feedback will appear after your first voice submission is reviewed.",
      feedbackPendingTitle: "Your voice practice has been received.",
      feedbackPendingBody: "Feedback will appear here after your coach reviews it.",
      feedbackLatestTitle: "Latest Teacher Feedback",
      feedbackReviewed: "Reviewed",
      feedbackCoachNote: "Coach Note",
      feedbackNextFocus: "Next Focus",
      feedbackPronunciation: "Pronunciation",
      feedbackFluency: "Fluency",
      feedbackGrammar: "Grammar",
      feedbackConfidence: "Confidence",
      feedbackReviewedBy: "Reviewed by",
      feedbackDefaultCoach: "Star Speaker Coach",
      historyTitle: "Voice History",
      historySubtitle: "Your submitted speaking practices and reviewed feedback.",
      historyEmptyTitle: "No voice history yet.",
      historyEmptyBody: "Your submitted recordings will appear here after your first voice practice.",
      historySubmitted: "Submitted",
      historyPendingReview: "Pending Review",
      historyReviewed: "Reviewed",
      historyPlaybackUnavailable: "Recording saved. Playback is unavailable right now.",
      historyFeedbackPending: "Feedback pending.",
      historyCoachPending: "Your coach will review this submission soon.",
      historyShowMore: "Show more",
      historyShowLess: "Show less",
      historyLoadError: "We could not load your voice history right now.",
      profileTitle: "Student Profile",
      profileSubtitle: "Your Star Speaker access and program information.",
      profileFullName: "Full Name",
      profileEmail: "Email",
      profileProgram: "Program",
      profileStatus: "Status",
      profileCurrentWeek: "Current Week",
      profileMemberSince: "Member Since",
      profileNeedHelp: "Need help?",
      profileContact: "Contact Star Speaker",
      profileLogout: "Logout",
      backToDashboard: "Back to Dashboard",
      notAvailable: "Not available",
      dayDetailsTitle: "Day Details",
      dayDetailsSubmitted: "Submitted",
      dayDetailsNotSubmitted: "Not submitted",
      dayDetailsNoSubmission: "No voice practice submitted for this day.",
      dayDetailsSubmittedAt: "Submitted at",
      dayDetailsLatestSubmission: "Latest submission for this day.",
      dayDetailsClose: "Close",
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
      dayMon: "Pzt",
      dayTue: "Sal",
      dayWed: "Çar",
      dayThu: "Per",
      dayFri: "Cum",
      daySat: "Cmt",
      daySun: "Paz",
      weeklySummary: (count) => `${count} / 7 görev tamamlandı`,
      weeklyLoadError: "Haftalık pratiğin şu anda yüklenemedi.",
      feedbackEmptyTitle: "Henüz geri bildirim yok.",
      feedbackEmptyBody: "İlk ses gönderin incelendikten sonra geri bildirimin burada görünecek.",
      feedbackPendingTitle: "Ses pratiğin alındı.",
      feedbackPendingBody: "Koçun inceledikten sonra geri bildirimin burada görünecek.",
      feedbackLatestTitle: "Son Öğretmen Geri Bildirimi",
      feedbackReviewed: "İncelendi",
      feedbackCoachNote: "Koç Notu",
      feedbackNextFocus: "Sonraki Odak",
      feedbackPronunciation: "Telaffuz",
      feedbackFluency: "Akıcılık",
      feedbackGrammar: "Dil Bilgisi",
      feedbackConfidence: "Özgüven",
      feedbackReviewedBy: "İnceleyen",
      feedbackDefaultCoach: "Star Speaker Koçu",
      historyTitle: "Ses Geçmişi",
      historySubtitle: "Gönderdiğin konuşma pratikleri ve incelenen geri bildirimler.",
      historyEmptyTitle: "Henüz ses geçmişi yok.",
      historyEmptyBody: "İlk ses pratiğini gönderdikten sonra kayıtların burada görünecek.",
      historySubmitted: "Gönderildi",
      historyPendingReview: "İnceleme Bekliyor",
      historyReviewed: "İncelendi",
      historyPlaybackUnavailable: "Kayıt kaydedildi. Şu anda oynatma kullanılamıyor.",
      historyFeedbackPending: "Geri bildirim bekleniyor.",
      historyCoachPending: "Koçun bu gönderiyi yakında inceleyecek.",
      historyShowMore: "Daha fazla göster",
      historyShowLess: "Daha az göster",
      historyLoadError: "Ses geçmişin şu anda yüklenemedi.",
      profileTitle: "Öğrenci Profili",
      profileSubtitle: "Star Speaker erişim ve program bilgilerin.",
      profileFullName: "Ad Soyad",
      profileEmail: "E-posta",
      profileProgram: "Program",
      profileStatus: "Durum",
      profileCurrentWeek: "Mevcut Hafta",
      profileMemberSince: "Üyelik Başlangıcı",
      profileNeedHelp: "Yardıma mı ihtiyacın var?",
      profileContact: "Star Speaker ile iletişime geç",
      profileLogout: "Çıkış",
      backToDashboard: "Panele Dön",
      notAvailable: "Mevcut değil",
      dayDetailsTitle: "Gün Detayları",
      dayDetailsSubmitted: "Gönderildi",
      dayDetailsNotSubmitted: "Gönderilmedi",
      dayDetailsNoSubmission: "Bu gün için ses pratiği gönderilmedi.",
      dayDetailsSubmittedAt: "Gönderim saati",
      dayDetailsLatestSubmission: "Bu gün için son gönderim.",
      dayDetailsClose: "Kapat",
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
  let voiceHistoryExpanded = false;
  let voiceHistoryLoadFailed = false;
  let activeDayDetailDateKey = "";
  const voicePlaybackUrls = new Map();

  const maxVoiceUploadBytes = 20 * 1024 * 1024;
  const maxRecordingSeconds = 120;
  const dayKeys = ["dayMon", "dayTue", "dayWed", "dayThu", "dayFri", "daySat", "daySun"];
  const initialHistoryLimit = 5;

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

  function getSubmissionDateKey(submission) {
    const submissionDate = String(submission?.submission_date || "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(submissionDate)) {
      return submissionDate;
    }

    const createdAt = submission?.created_at ? new Date(submission.created_at) : null;
    if (createdAt && !Number.isNaN(createdAt.getTime())) {
      return getLocalDateString(createdAt);
    }

    return "";
  }

  function getSubmittedDateSet(submissions = []) {
    return new Set(
      submissions
        .map(getSubmissionDateKey)
        .filter(Boolean),
    );
  }

  function renderWeeklyPractice(submissions = cachedVoiceSubmissions, options = {}) {
    const row = document.querySelector("#weekly-practice-row");
    const summary = document.querySelector("#weekly-practice-summary");
    if (!row) return;

    if (options.error) {
      if (summary) summary.textContent = t("weeklyLoadError");
      row.innerHTML = dayKeys
        .map((dayKey, index) => `
          <button class="practice-day" type="button" data-date-key="" aria-label="${escapeHtml(t(dayKey))}">
            <strong>${t(dayKey)}</strong>
            <span><i aria-hidden="true"></i>${t("zeroTaskComplete")}</span>
            <small>${t("taskNotSubmitted")}</small>
          </button>
        `)
        .join("");
      return;
    }

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
          <button
            class="practice-day${submitted ? " is-submitted" : ""}"
            type="button"
            data-date-key="${escapeHtml(dateKey)}"
            aria-label="${escapeHtml(`${t(dayKey)}: ${submitted ? t("taskSubmitted") : t("taskNotSubmitted")}`)}"
          >
            <strong>${t(dayKey)}</strong>
            <span><i aria-hidden="true"></i>${submitted ? t("oneTaskComplete") : t("zeroTaskComplete")}</span>
            <small>${submitted ? t("taskSubmitted") : t("taskNotSubmitted")}</small>
          </button>
        `;
      })
      .join("");

    if (summary) summary.textContent = t("weeklySummary", completedCount);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function hasText(value) {
    return String(value || "").trim().length > 0;
  }

  function getFeedbackDateValue(submission) {
    return Date.parse(submission?.reviewed_at || submission?.created_at || "") || 0;
  }

  function getLatestReviewedSubmission(submissions = []) {
    return [...submissions]
      .filter((submission) => (
        String(submission?.review_status || "").toLowerCase() === "reviewed" ||
        hasText(submission?.reviewed_at) ||
        hasText(submission?.coach_feedback)
      ))
      .sort((a, b) => getFeedbackDateValue(b) - getFeedbackDateValue(a))[0] || null;
  }

  function formatFeedbackDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(getLanguage() === "tr" ? "tr-TR" : "en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function getSubmissionDateValue(submission) {
    return Date.parse(submission?.created_at || submission?.submission_date || "") || 0;
  }

  function getSortedVoiceSubmissions(submissions = []) {
    return [...submissions].sort((a, b) => getSubmissionDateValue(b) - getSubmissionDateValue(a));
  }

  function getDateFromKey(dateKey) {
    const parts = String(dateKey || "").split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return null;
    }

    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatLongDateKey(dateKey) {
    const date = getDateFromKey(dateKey);
    if (!date || Number.isNaN(date.getTime())) return dateKey || "";

    return new Intl.DateTimeFormat(getLanguage() === "tr" ? "tr-TR" : "en", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function formatProfileDate(value) {
    if (!value) return t("notAvailable");
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return t("notAvailable");

    return new Intl.DateTimeFormat(getLanguage() === "tr" ? "tr-TR" : "en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function formatSubmissionTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(getLanguage() === "tr" ? "tr-TR" : "en", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function getProfileDisplayValue(value) {
    const text = String(value || "").trim();
    return text || t("notAvailable");
  }

  function getProfileStatusValue(profile) {
    const status = String(profile?.access_status || "").trim();
    if (!status) return t("notAvailable");
    return status.toLowerCase() === "active" ? t("active") : status;
  }

  function getProfileRows(profile) {
    return [
      [t("profileFullName"), getProfileDisplayValue(profile?.full_name)],
      [t("profileEmail"), getProfileDisplayValue(profile?.email || activeWorkspaceUser?.email)],
      [t("profileProgram"), getProfileDisplayValue(profile?.program)],
      [t("profileStatus"), getProfileStatusValue(profile)],
      [t("profileCurrentWeek"), profile?.current_week ? t("currentWeek", profile.current_week) : t("notAvailable")],
      [t("profileMemberSince"), formatProfileDate(profile?.created_at)],
    ];
  }

  function renderProfileView(profile) {
    const title = document.querySelector("#profile-title");
    const panel = document.querySelector("#workspace-profile-panel");
    if (title) title.textContent = t("profileTitle");
    if (!panel) return;

    const rows = getProfileRows(profile);
    panel.innerHTML = `
      <p class="workspace-profile-intro">${escapeHtml(t("profileSubtitle"))}</p>
      <div class="workspace-profile-grid">
        ${rows.map(([label, value]) => `
          <div class="workspace-profile-row">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </div>
        `).join("")}
      </div>
      <div class="workspace-profile-support">
        <div>
          <strong>${escapeHtml(t("profileNeedHelp"))}</strong>
          <p>${escapeHtml(t("profileContact"))}</p>
          <a href="mailto:support@starspeakerstudio.com">support@starspeakerstudio.com</a>
        </div>
        <div class="workspace-profile-actions">
          <button class="button button-outline" type="button" data-workspace-view="dashboard">${escapeHtml(t("backToDashboard"))}</button>
          <button class="button button-outline" type="button" data-profile-logout>${escapeHtml(t("profileLogout"))}</button>
        </div>
      </div>
    `;
  }

  function updateWorkspaceNavState(view) {
    const activeHash = view === "profile" ? "#profile" : "#dashboard";
    document.querySelectorAll(".workspace-nav a, .workspace-bottom-nav a").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === activeHash);
    });
  }

  function setWorkspaceView(view = "dashboard") {
    const normalizedView = view === "profile" ? "profile" : "dashboard";
    document.body.classList.toggle("is-profile-view", normalizedView === "profile");
    document.body.dataset.workspaceView = normalizedView;
    updateWorkspaceNavState(normalizedView);

    const target = document.querySelector(normalizedView === "profile" ? "#profile" : "#dashboard");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (normalizedView === "profile") {
      document.querySelector("#profile-title")?.focus?.();
    } else {
      document.querySelector("#main")?.focus?.();
    }
  }

  function bindWorkspaceNavigation() {
    document.querySelectorAll(".workspace-nav a, .workspace-bottom-nav a").forEach((link) => {
      link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");
        if (hash === "#profile") {
          event.preventDefault();
          setWorkspaceView("profile");
          return;
        }

        if (hash === "#dashboard") {
          event.preventDefault();
          setWorkspaceView("dashboard");
        } else {
          setWorkspaceView("dashboard");
        }
      });
    });

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-workspace-view]");
      if (!button) return;
      setWorkspaceView(button.dataset.workspaceView);
    });
  }

  function isReviewedSubmission(submission) {
    return (
      String(submission?.review_status || "").toLowerCase() === "reviewed" ||
      hasText(submission?.reviewed_at) ||
      hasText(submission?.coach_feedback)
    );
  }

  function getHistoryStatus(submission) {
    if (isReviewedSubmission(submission)) {
      return { className: "is-reviewed", label: t("historyReviewed") };
    }

    if (hasText(submission?.storage_path) || hasText(submission?.audio_url) || hasText(submission?.created_at)) {
      return { className: "is-pending", label: t("historyPendingReview") };
    }

    return { className: "", label: t("historySubmitted") };
  }

  function getSubmissionId(submission, index = 0) {
    return String(
      submission?.id ||
      submission?.storage_path ||
      `${submission?.submission_date || "voice"}-${submission?.created_at || index}`,
    );
  }

  async function prepareVoicePlaybackUrls(submissions = []) {
    const visible = getSortedVoiceSubmissions(submissions)
      .slice(0, voiceHistoryExpanded ? submissions.length : initialHistoryLimit);

    await Promise.all(visible.map(async (submission, index) => {
      await getVoicePlaybackUrl(submission, index);
    }));
  }

  async function getVoicePlaybackUrl(submission, index = 0) {
    const key = getSubmissionId(submission, index);
    if (voicePlaybackUrls.has(key)) return voicePlaybackUrls.get(key) || "";

    if (hasText(submission?.audio_url)) {
      voicePlaybackUrls.set(key, submission.audio_url);
      return submission.audio_url;
    }

    if (!hasText(submission?.storage_path)) {
      voicePlaybackUrls.set(key, "");
      return "";
    }

    try {
      const signedUrl = await window.starSpeakerSupabase.getVoiceSubmissionSignedUrl?.(
        submission.storage_path,
        3600,
      );
      voicePlaybackUrls.set(key, signedUrl || "");
      return signedUrl || "";
    } catch (error) {
      console.warn("Voice signed URL failed:", error);
      voicePlaybackUrls.set(key, "");
      return "";
    }
  }

  function renderVoiceHistoryItem(submission, index) {
    const key = getSubmissionId(submission, index);
    const playbackUrl = voicePlaybackUrls.get(key) || "";
    const status = getHistoryStatus(submission);
    const reviewed = isReviewedSubmission(submission);
    const dateLabel = formatFeedbackDate(submission?.submission_date || submission?.created_at);
    const coachNote = hasText(submission?.coach_feedback)
      ? `<div class="voice-history-feedback"><span>${escapeHtml(t("feedbackCoachNote"))}</span><p>${escapeHtml(submission.coach_feedback)}</p></div>`
      : "";
    const nextFocus = hasText(submission?.coach_next_focus)
      ? `<div class="voice-history-feedback"><span>${escapeHtml(t("feedbackNextFocus"))}</span><p>${escapeHtml(submission.coach_next_focus)}</p></div>`
      : "";

    return `
      <article class="voice-history-item">
        <div class="voice-history-item-header">
          <div>
            <strong>${escapeHtml(dateLabel || t("historySubmitted"))}</strong>
            <small>${escapeHtml(t("historySubmitted"))}</small>
          </div>
          <span class="voice-history-status ${status.className}">${escapeHtml(status.label)}</span>
        </div>
        ${playbackUrl
          ? `<audio class="voice-history-audio" controls src="${escapeHtml(playbackUrl)}"></audio>`
          : `<p class="voice-history-unavailable">${escapeHtml(t("historyPlaybackUnavailable"))}</p>`
        }
        <div class="voice-history-feedback-wrap">
          ${reviewed && (coachNote || nextFocus)
            ? `${coachNote}${nextFocus}`
            : `<div class="voice-history-feedback"><span>${escapeHtml(t("historyFeedbackPending"))}</span><p>${escapeHtml(t("historyCoachPending"))}</p></div>`
          }
        </div>
      </article>
    `;
  }

  function renderVoiceHistory(submissions = cachedVoiceSubmissions) {
    const title = document.querySelector("#voice-history-title");
    const subtitle = document.querySelector("#voice-history-subtitle");
    const list = document.querySelector("#voice-history-list");
    const toggle = document.querySelector("#voice-history-toggle");
    if (title) title.textContent = t("historyTitle");
    if (subtitle) subtitle.textContent = t("historySubtitle");
    if (!list) return;

    const sorted = getSortedVoiceSubmissions(submissions);
    if (voiceHistoryLoadFailed) {
      list.innerHTML = `
        <div class="workspace-empty-state">
          <strong>${escapeHtml(t("historyLoadError"))}</strong>
          <p>${escapeHtml(t("voiceQueryFailed"))}</p>
        </div>
      `;
      if (toggle) toggle.hidden = true;
      return;
    }

    if (!sorted.length) {
      list.innerHTML = `
        <div class="workspace-empty-state">
          <strong>${escapeHtml(t("historyEmptyTitle"))}</strong>
          <p>${escapeHtml(t("historyEmptyBody"))}</p>
        </div>
      `;
      if (toggle) toggle.hidden = true;
      return;
    }

    const visible = voiceHistoryExpanded ? sorted : sorted.slice(0, initialHistoryLimit);
    list.innerHTML = visible.map(renderVoiceHistoryItem).join("");
    if (toggle) {
      toggle.hidden = sorted.length <= initialHistoryLimit;
      toggle.textContent = voiceHistoryExpanded ? t("historyShowLess") : t("historyShowMore");
    }
  }

  function getSubmissionsForDate(dateKey) {
    return getSortedVoiceSubmissions(cachedVoiceSubmissions)
      .filter((submission) => getSubmissionDateKey(submission) === dateKey);
  }

  function getDayDetailElements() {
    return {
      modal: document.querySelector("#day-detail-modal"),
      card: document.querySelector("#day-detail-modal .workspace-modal-card"),
      title: document.querySelector("#day-detail-title"),
      date: document.querySelector("#day-detail-date"),
      body: document.querySelector("#day-detail-body"),
      close: document.querySelector("#day-detail-modal .workspace-modal-close"),
    };
  }

  function closeDayDetail() {
    const { modal } = getDayDetailElements();
    activeDayDetailDateKey = "";
    if (modal) modal.hidden = true;
    document.body.classList.remove("workspace-modal-open");
  }

  async function renderDayDetails(dateKey) {
    const elements = getDayDetailElements();
    if (!elements.modal || !elements.body) return;

    activeDayDetailDateKey = dateKey;
    elements.modal.hidden = false;
    document.body.classList.add("workspace-modal-open");
    if (elements.title) elements.title.textContent = t("dayDetailsTitle");
    if (elements.date) elements.date.textContent = formatLongDateKey(dateKey);
    if (elements.close) elements.close.setAttribute("aria-label", t("dayDetailsClose"));

    const submissions = getSubmissionsForDate(dateKey);
    if (!submissions.length) {
      elements.body.innerHTML = `
        <div class="day-detail-status is-empty">
          <span>${escapeHtml(t("dayDetailsNotSubmitted"))}</span>
        </div>
        <div class="workspace-empty-state">
          <strong>${escapeHtml(t("dayDetailsNoSubmission"))}</strong>
        </div>
      `;
      elements.card?.focus();
      return;
    }

    const latest = submissions[0];
    const playbackUrl = await getVoicePlaybackUrl(latest, 0);
    if (activeDayDetailDateKey !== dateKey) return;

    const status = getHistoryStatus(latest);
    const reviewed = isReviewedSubmission(latest);
    const submittedTime = formatSubmissionTime(latest.created_at);
    const coachNote = hasText(latest.coach_feedback)
      ? `<div class="day-detail-feedback"><span>${escapeHtml(t("feedbackCoachNote"))}</span><p>${escapeHtml(latest.coach_feedback)}</p></div>`
      : "";
    const nextFocus = hasText(latest.coach_next_focus)
      ? `<div class="day-detail-feedback"><span>${escapeHtml(t("feedbackNextFocus"))}</span><p>${escapeHtml(latest.coach_next_focus)}</p></div>`
      : "";

    elements.body.innerHTML = `
      <div class="day-detail-status ${status.className}">
        <span>${escapeHtml(status.label)}</span>
      </div>
      <div class="day-detail-meta">
        <strong>${escapeHtml(t("dayDetailsLatestSubmission"))}</strong>
        ${submittedTime ? `<p>${escapeHtml(t("dayDetailsSubmittedAt"))}: ${escapeHtml(submittedTime)}</p>` : ""}
      </div>
      ${playbackUrl
        ? `<audio class="voice-history-audio" controls src="${escapeHtml(playbackUrl)}"></audio>`
        : `<p class="voice-history-unavailable">${escapeHtml(t("historyPlaybackUnavailable"))}</p>`
      }
      <div class="day-detail-feedback-wrap">
        ${reviewed && (coachNote || nextFocus)
          ? `${coachNote}${nextFocus}`
          : `<div class="day-detail-feedback"><span>${escapeHtml(t("historyFeedbackPending"))}</span><p>${escapeHtml(t("historyCoachPending"))}</p></div>`
        }
      </div>
    `;
    elements.card?.focus();
  }

  function renderFeedbackField(labelKey, value) {
    if (!hasText(value)) return "";

    return `
      <div class="teacher-feedback-field">
        <span>${escapeHtml(t(labelKey))}</span>
        <p>${escapeHtml(value)}</p>
      </div>
    `;
  }

  function renderTeacherFeedback(submissions = cachedVoiceSubmissions) {
    const panel = document.querySelector("#feedback-panel");
    if (!panel) return;

    const reviewed = getLatestReviewedSubmission(submissions);
    const hasSubmissions = Array.isArray(submissions) && submissions.length > 0;

    panel.classList.remove("teacher-feedback-reviewed", "teacher-feedback-pending");

    if (!reviewed) {
      panel.classList.toggle("teacher-feedback-pending", hasSubmissions);
      panel.innerHTML = `
        <strong>${escapeHtml(hasSubmissions ? t("feedbackPendingTitle") : t("feedbackEmptyTitle"))}</strong>
        <p>${escapeHtml(hasSubmissions ? t("feedbackPendingBody") : t("feedbackEmptyBody"))}</p>
      `;
      return;
    }

    panel.classList.add("teacher-feedback-reviewed");
    const reviewedBy = hasText(reviewed.reviewed_by) ? reviewed.reviewed_by : t("feedbackDefaultCoach");
    const reviewedDate = formatFeedbackDate(reviewed.reviewed_at || reviewed.created_at);
    const fields = [
      renderFeedbackField("feedbackCoachNote", reviewed.coach_feedback),
      renderFeedbackField("feedbackNextFocus", reviewed.coach_next_focus),
      renderFeedbackField("feedbackPronunciation", reviewed.pronunciation_feedback),
      renderFeedbackField("feedbackFluency", reviewed.fluency_feedback),
      renderFeedbackField("feedbackGrammar", reviewed.grammar_feedback),
      renderFeedbackField("feedbackConfidence", reviewed.confidence_feedback),
    ].join("");

    panel.innerHTML = `
      <div class="teacher-feedback-topline">
        <strong>${escapeHtml(t("feedbackLatestTitle"))}</strong>
        <span>${escapeHtml(t("feedbackReviewed"))}</span>
      </div>
      <div class="teacher-feedback-fields">
        ${fields || renderFeedbackField("feedbackCoachNote", reviewed.coach_feedback)}
      </div>
      <p class="teacher-feedback-meta">
        ${escapeHtml(t("feedbackReviewedBy"))} ${escapeHtml(reviewedBy)}
        ${reviewedDate ? ` · ${escapeHtml(reviewedDate)}` : ""}
      </p>
    `;
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
      const submissions = await window.starSpeakerSupabase.getVoiceSubmissions?.(
        user.id,
      ) || [];
      cachedVoiceSubmissions = submissions.filter((submission) => (
        !submission?.user_id || submission.user_id === user.id
      ));
      voiceHistoryLoadFailed = false;
      await prepareVoicePlaybackUrls(cachedVoiceSubmissions);
      const today = getLocalDateString();
      voiceSubmittedToday = cachedVoiceSubmissions.some((submission) => (
        getSubmissionDateKey(submission) === today
      ));
      renderWeeklyPractice(cachedVoiceSubmissions);
      renderTeacherFeedback(cachedVoiceSubmissions);
      renderVoiceHistory(cachedVoiceSubmissions);
      renderVoiceState(voiceSubmittedToday ? "submitted" : "idle");
    } catch (error) {
      console.warn("Voice submission status load failed:", error);
      cachedVoiceSubmissions = [];
      voiceSubmittedToday = false;
      voiceHistoryLoadFailed = true;
      renderWeeklyPractice([], { error: true });
      renderTeacherFeedback([]);
      renderVoiceHistory([]);
      renderVoiceState("idle");
      setVoiceMessage(t("voiceQueryFailed"), "error");
    }
  }

  async function handleWorkspaceLogout(button = null) {
    const subtitle = document.querySelector("#workspace-subtitle");
    try {
      button?.setAttribute("disabled", "true");
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

    document.querySelector("#voice-history-toggle")?.addEventListener("click", async () => {
      voiceHistoryExpanded = !voiceHistoryExpanded;
      await prepareVoicePlaybackUrls(cachedVoiceSubmissions);
      renderVoiceHistory(cachedVoiceSubmissions);
    });

    document.querySelector("#weekly-practice-row")?.addEventListener("click", (event) => {
      const card = event.target.closest("[data-date-key]");
      const dateKey = card?.dataset?.dateKey;
      if (dateKey) renderDayDetails(dateKey);
    });

    document.querySelectorAll("[data-day-detail-close]").forEach((element) => {
      element.addEventListener("click", closeDayDetail);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && activeDayDetailDateKey) {
        closeDayDetail();
      }
    });

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-profile-logout]");
      if (button) {
        handleWorkspaceLogout(button);
      }
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
    renderProfileView(profile);
    renderVoiceLabels();
    renderWeeklyPractice(cachedVoiceSubmissions);
    renderTeacherFeedback(cachedVoiceSubmissions);
    renderVoiceHistory(cachedVoiceSubmissions);
    renderVoiceState(currentVoiceState || (voiceSubmittedToday ? "submitted" : "idle"));
  }

  function initWorkspacePage() {
    const logoutButton = document.querySelector("#student-logout-button");
    const subtitle = document.querySelector("#workspace-subtitle");
    const pill = document.querySelector("#workspace-status-pill");

    if (subtitle) subtitle.textContent = t("checking");
    if (pill) pill.textContent = t("checkingPill");
    bindWorkspaceNavigation();
    bindVoiceLogControls();
    renderWeeklyPractice([]);
    renderTeacherFeedback([]);
    renderVoiceHistory([]);
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

    logoutButton?.addEventListener("click", () => handleWorkspaceLogout(logoutButton));

    window.addEventListener("starSpeakerLanguageChange", () => {
      if (activeWorkspaceProfile) {
        renderWorkspace(activeWorkspaceProfile);
        if (activeDayDetailDateKey) {
          renderDayDetails(activeDayDetailDateKey);
        }
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
