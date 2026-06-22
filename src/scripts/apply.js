const applicationForm = document.querySelector("#application-form");
const applicationStatus = document.querySelector("#application-status");
const applicationFocusLinks = document.querySelectorAll('a[href="#application-form"]');
const applicationSubmitButton = applicationForm?.querySelector('button[type="submit"]');
const preferredProgramField = document.querySelector("#preferred-program");
const preferredDateField = document.querySelector("#preferred-consultation-date");
const programPreselectNote = document.querySelector("#program-preselect-note");
let preselectedProgramValue = "";

const fallbackFormMessages = {
  required: {
    fullName: "Please enter your full name.",
    whatsapp: "Please enter your WhatsApp number.",
    englishLevel: "Please select your current English level.",
    mainGoal: "Please select your main goal.",
    speakingProblem: "Please share the speaking challenge holding you back.",
    preferredProgram: "Please select a preferred program.",
    startTimeline: "Please select when you want to start.",
    preferredConsultationWindow: "Please choose a preferred consultation window.",
    preferredConsultationDate: "Please choose a preferred consultation date.",
    consultationLanguage: "Please choose a preferred consultation language.",
    default: "This field is required.",
  },
  email: "Please enter a valid email address or leave it blank.",
  success: "Your application has been received. We will review your information and confirm your consultation time by WhatsApp.",
  loading: "Submitting your application...",
  error: "We could not submit this right now. Please try again or contact us directly.",
};

function getFormMessages() {
  return window.starSpeakerI18n?.getFormMessages?.() || fallbackFormMessages;
}

function getCurrentLanguage() {
  return window.starSpeakerI18n?.getLanguage?.() === "tr" ? "tr" : "en";
}

function getSubmitMessages() {
  const language = getCurrentLanguage();
  return {
    success: getFormMessages().success,
    loading: language === "tr" ? "Başvurunuz gönderiliyor..." : "Submitting your application...",
    error: language === "tr"
      ? "Şu anda gönderim yapılamadı. Lütfen tekrar deneyin veya bizimle doğrudan iletişime geçin."
      : "We could not submit this right now. Please try again or contact us directly.",
  };
}

function getFieldErrorElement(field) {
  if (field.type === "radio") {
    const group = field.closest("fieldset");
    const groupDescription = group?.getAttribute("aria-describedby");
    if (!groupDescription) return null;
    return groupDescription
      .split(/\s+/)
      .map((id) => document.getElementById(id))
      .find((element) => element?.classList.contains("field-error")) || null;
  }

  const describedBy = field.getAttribute("aria-describedby");
  if (!describedBy) return null;
  return describedBy
    .split(/\s+/)
    .map((id) => document.getElementById(id))
    .find((element) => element?.classList.contains("field-error")) || null;
}

function setFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  const error = getFieldErrorElement(field);

  wrapper?.classList.toggle("has-error", Boolean(message));

  if (field.type === "radio") {
    applicationForm
      ?.querySelectorAll(`input[type="radio"][name="${field.name}"]`)
      .forEach((input) => input.setAttribute("aria-invalid", message ? "true" : "false"));
  } else {
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  if (error) {
    error.textContent = message;
  }
}

function validateEmail(field) {
  const value = field.value.trim();
  if (!value) {
    return "";
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : getFormMessages().email;
}

function validateField(field) {
  const name = field.name;
  const value = field.value.trim();
  const messages = getFormMessages();

  if (field.type === "radio") {
    const checked = applicationForm?.querySelector(`input[type="radio"][name="${name}"]:checked`);
    return checked ? "" : messages.required[name] || messages.required.default;
  }

  if (field.required && !value) {
    return messages.required[name] || messages.required.default;
  }

  if (name === "email") {
    return validateEmail(field);
  }

  return "";
}

function focusApplicationForm() {
  const firstField = applicationForm?.querySelector("input, select, textarea");
  applicationForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => firstField?.focus({ preventScroll: true }), 360);
}

function setApplicationStatus(message, type = "success") {
  if (!applicationStatus) return;
  applicationStatus.textContent = message;
  applicationStatus.classList.remove("is-error", "is-loading");
  applicationStatus.classList.add("is-visible");
  if (type === "error") applicationStatus.classList.add("is-error");
  if (type === "loading") applicationStatus.classList.add("is-loading");
}

function getRadioValue(name) {
  return applicationForm?.querySelector(`input[type="radio"][name="${name}"]:checked`)?.value || "";
}

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function configurePreferredDateLimits() {
  if (!preferredDateField) return;

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  preferredDateField.min = formatDateForInput(today);
  preferredDateField.max = formatDateForInput(maxDate);
}

function focusInvalidField(field) {
  if (field.type !== "radio") {
    field.focus();
    return;
  }

  const option = field.closest("label");
  const group = field.closest("fieldset");
  (option || group)?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => option?.focus?.() || field.focus(), 220);
}

function buildApplyPayload() {
  return {
    full_name: applicationForm.querySelector("#full-name").value.trim(),
    whatsapp_number: applicationForm.querySelector("#whatsapp").value.trim(),
    email: applicationForm.querySelector("#email").value.trim() || null,
    current_level: applicationForm.querySelector("#english-level").value,
    main_goal: applicationForm.querySelector("#main-goal").value,
    biggest_speaking_problem: applicationForm.querySelector("#speaking-problem").value.trim(),
    preferred_program: applicationForm.querySelector("#preferred-program").value,
    start_timeline: applicationForm.querySelector("#start-timeline").value,
    preferred_consultation_window: getRadioValue("preferredConsultationWindow"),
    preferred_consultation_date: applicationForm.querySelector("#preferred-consultation-date").value,
    preferred_consultation_language: getRadioValue("consultationLanguage"),
    short_message: applicationForm.querySelector("#short-message").value.trim() || null,
    source: "apply_page",
    status: "new",
  };
}

function getProgramPreselectNoteText() {
  return getCurrentLanguage() === "tr"
    ? "Program seçiminize göre belirlendi."
    : "Selected from your program choice.";
}

function updateProgramPreselectNote() {
  if (!programPreselectNote || !preselectedProgramValue) return;
  const isStillSelected = preferredProgramField?.value === preselectedProgramValue;
  programPreselectNote.hidden = !isStillSelected;
  if (isStillSelected) {
    programPreselectNote.textContent = getProgramPreselectNoteText();
  }
}

function applyProgramQueryPreselection() {
  if (!preferredProgramField) return;

  const programMap = {
    spark: "Spark",
    star: "Star",
    "super-star": "Super Star",
  };
  const params = new URLSearchParams(window.location.search);
  const selectedProgram = programMap[params.get("program")?.toLowerCase() || ""];

  if (!selectedProgram) return;

  preferredProgramField.value = selectedProgram;
  preselectedProgramValue = selectedProgram;
  preferredProgramField.dispatchEvent(new Event("input", { bubbles: true }));
  preferredProgramField.dispatchEvent(new Event("change", { bubbles: true }));
  updateProgramPreselectNote();
  window.starSpeakerPremiumSelects?.refreshAll?.();
}

applyProgramQueryPreselection();
configurePreferredDateLimits();

applicationFocusLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    focusApplicationForm();
  });
});

applicationForm?.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    setFieldError(field, validateField(field));
    applicationStatus?.classList.remove("is-visible");
    if (field === preferredProgramField) updateProgramPreselectNote();
  });

  field.addEventListener("change", () => {
    setFieldError(field, validateField(field));
    applicationStatus?.classList.remove("is-visible");
    if (field === preferredProgramField) updateProgramPreselectNote();
  });

  field.addEventListener("blur", () => {
    setFieldError(field, validateField(field));
  });
});

applicationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fields = Array.from(applicationForm.querySelectorAll("input, select, textarea"));
  const invalidFields = [];

  fields.forEach((field) => {
    const message = validateField(field);
    setFieldError(field, message);

    if (message) {
      invalidFields.push(field);
    }
  });

  if (invalidFields.length > 0) {
    applicationStatus?.classList.remove("is-visible");
    focusInvalidField(invalidFields[0]);
    return;
  }

  const messages = getSubmitMessages();
  const payload = buildApplyPayload();

  try {
    applicationSubmitButton?.setAttribute("disabled", "true");
    setApplicationStatus(messages.loading, "loading");
    if (!window.starSpeakerSupabase?.isConfigured?.()) {
      throw new Error("Supabase is not configured.");
    }
    await window.starSpeakerSupabase.insertApplySubmission(payload);
    setApplicationStatus(messages.success, "success");
  } catch (error) {
    console.warn("Apply submission failed:", error);
    localStorage.setItem("starSpeakerLatestApplySubmission", JSON.stringify({
      ...payload,
      savedAt: new Date().toISOString(),
      submitError: error?.message || String(error),
    }));
    setApplicationStatus(messages.error, "error");
  } finally {
    applicationSubmitButton?.removeAttribute("disabled");
  }
});

window.addEventListener("starSpeakerLanguageChange", () => {
  updateProgramPreselectNote();

  applicationForm?.querySelectorAll('[aria-invalid="true"]').forEach((field) => {
    setFieldError(field, validateField(field));
  });

  if (applicationStatus?.classList.contains("is-visible")) {
    if (applicationStatus.classList.contains("is-error")) {
      applicationStatus.textContent = getSubmitMessages().error;
    } else if (applicationStatus.classList.contains("is-loading")) {
      applicationStatus.textContent = getSubmitMessages().loading;
    } else {
      applicationStatus.textContent = getFormMessages().success;
    }
  }
});
