const TURKISH_MOBILE_E164 = /^\+905[0-9]{9}$/;
const CONTACT_NAME = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]{0,78}[\p{L}\p{M}.]$/u;
const CONTACT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_ERROR_MESSAGES = Object.freeze({
  fullName: "Lütfen geçerli bir ad ve soyad gir.",
  whatsapp: "Lütfen geçerli bir WhatsApp numarası gir.",
  email: "Lütfen geçerli bir e-posta adresi gir.",
});

export function normalizeTurkishMobilePhone(value) {
  const input = String(value || "").normalize("NFKC").trim();
  if (!input || !/^\+?[0-9\s().-]+$/.test(input)) return "";
  const digits = input.replace(/\D/g, "");
  let canonical = "";
  if (digits.length === 10 && digits.startsWith("5")) canonical = `+90${digits}`;
  if (digits.length === 11 && digits.startsWith("05")) canonical = `+90${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("905")) canonical = `+${digits}`;
  return TURKISH_MOBILE_E164.test(canonical) ? canonical : "";
}

export function normalizePublicContactName(value) {
  const normalized = String(value || "").normalize("NFC").replace(/\s+/gu, " ").trim();
  return normalized.length >= 2 && normalized.length <= 80 && CONTACT_NAME.test(normalized) ? normalized : "";
}

export function normalizePublicContactEmail(value) {
  const normalized = String(value || "").normalize("NFC").trim().toLowerCase();
  if (!normalized) return "";
  return normalized.length <= 120 && CONTACT_EMAIL.test(normalized) ? normalized : null;
}

export function normalizePublicContact(contact) {
  const fullName = normalizePublicContactName(contact?.fullName);
  if (!fullName) return { valid: false, invalidField: "fullName", message: CONTACT_ERROR_MESSAGES.fullName };
  const whatsapp = normalizeTurkishMobilePhone(contact?.whatsapp);
  if (!whatsapp) return { valid: false, invalidField: "whatsapp", message: CONTACT_ERROR_MESSAGES.whatsapp };
  const email = normalizePublicContactEmail(contact?.email);
  if (email === null) return { valid: false, invalidField: "email", message: CONTACT_ERROR_MESSAGES.email };
  return { valid: true, invalidField: "", message: "", value: { fullName, whatsapp, email } };
}
