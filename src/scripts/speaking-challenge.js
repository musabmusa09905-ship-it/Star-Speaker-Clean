const form = document.querySelector("[data-sc-form]");
const success = document.querySelector("[data-sc-success]");
const status = document.querySelector("[data-sc-status]");
const submitButton = form?.querySelector('button[type="submit"]');
const config = window.STAR_SPEAKER_SUPABASE_CONFIG || {};
const params = new URLSearchParams(window.location.search);
const campaign = Object.fromEntries(
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
    .map((key) => [key, params.get(key)])
    .filter(([, value]) => value),
);
const source = campaign.utm_source || document.referrer || "direct";
let formStarted = false;

function submissionId() {
  const key = "starSpeakerSpeakingChallengeSubmissionId";
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    sessionStorage.setItem(key, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

function track(event, details = {}) {
  const payload = {
    event,
    locale: "tr",
    path: window.location.pathname,
    source,
    referrer: document.referrer || "",
    ...campaign,
    ...details,
  };
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("star-speaker:analytics", { detail: payload }));
}

function fieldError(name, message = "") {
  const field = form?.elements[name];
  const target = document.querySelector(`[data-error-for="${name}"]`);
  if (target) target.textContent = message;
  if (field instanceof RadioNodeList) {
    Array.from(field).forEach((item) => item.setAttribute("aria-invalid", String(Boolean(message))));
  } else if (field) {
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }
}

function validate() {
  const data = new FormData(form);
  const errors = {};
  const namePattern = /^[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+(?:[ '-][A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+)*$/;
  const firstName = String(data.get("firstName") || "").trim();
  const lastName = String(data.get("lastName") || "").trim();
  const phoneDigits = String(data.get("whatsapp") || "").replace(/\D/g, "");
  if (!namePattern.test(firstName)) errors.firstName = "Lütfen adını kontrol et.";
  if (!namePattern.test(lastName)) errors.lastName = "Lütfen soyadını kontrol et.";
  if (!/^(?:90)?5\d{9}$/.test(phoneDigits.replace(/^0/, ""))) errors.whatsapp = "Geçerli bir Türkiye cep telefonu numarası gir.";
  if (!data.get("englishLevel")) errors.englishLevel = "Lütfen seviyeni seç.";
  if (!data.get("urgency")) errors.urgency = "Lütfen bir seçenek seç.";
  if (!data.get("consent")) errors.consent = "Devam etmek için onay vermen gerekiyor.";
  ["firstName", "lastName", "whatsapp", "englishLevel", "urgency", "consent"].forEach((name) => fieldError(name, errors[name]));
  const firstInvalid = Object.keys(errors)[0];
  if (firstInvalid) {
    const field = form.elements[firstInvalid];
    (field instanceof RadioNodeList ? field[0] : field)?.focus();
    return null;
  }
  return {
    action: "save_speaking_challenge_lead",
    submission_id: submissionId(),
    contact: { firstName, lastName, whatsapp: data.get("whatsapp") },
    english_level: data.get("englishLevel"),
    urgency: data.get("urgency"),
    consent_accepted: true,
    consent_accepted_at: new Date().toISOString(),
    source_data: {
      source,
      referrer: document.referrer || "",
      path: window.location.pathname,
      ...campaign,
    },
  };
}

async function submitApplication(payload) {
  if (!config.url || !config.anonKey) throw new Error("Başvuru bağlantısı şu anda kullanılamıyor.");
  const response = await fetch(`${config.url}/functions/v1/ai-speaking-coach`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Başvurun şu anda gönderilemedi. Lütfen tekrar dene.");
  return body;
}

form?.addEventListener("focusin", () => {
  if (formStarted) return;
  formStarted = true;
  track("speaking_challenge_form_start");
}, { once: true });

form?.addEventListener("input", (event) => {
  if (event.target?.name) fieldError(event.target.name);
  status.textContent = "";
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = validate();
  if (!payload) return;
  track("speaking_challenge_form_submit");
  submitButton.disabled = true;
  status.textContent = "Başvurun gönderiliyor…";
  try {
    await submitApplication(payload);
    track("speaking_challenge_form_success");
    form.hidden = true;
    success.hidden = false;
    success.focus();
  } catch (error) {
    track("speaking_challenge_form_error", { error_type: "submission_failed" });
    status.textContent = error?.message || "Başvurun şu anda gönderilemedi. Lütfen tekrar dene.";
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelectorAll("[data-sc-cta]").forEach((cta) => {
  cta.addEventListener("click", () => track("speaking_challenge_cta_click", { location: cta.dataset.scCta }));
});

track("speaking_challenge_view");
