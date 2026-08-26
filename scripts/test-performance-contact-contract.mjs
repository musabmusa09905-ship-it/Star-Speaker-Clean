import assert from "node:assert/strict";
import {
  CONTACT_ERROR_MESSAGES,
  normalizePublicContact,
  normalizePublicContactEmail,
  normalizePublicContactName,
  normalizeTurkishMobilePhone,
} from "../src/scripts/performance-contact-contract.js";

const acceptedPhones = [
  "0555 111 22 33",
  "05551112233",
  "5551112233",
  "+90 555 111 22 33",
  "+905551112233",
  "(0555) 111-22-33",
];
for (const phone of acceptedPhones) assert.equal(normalizeTurkishMobilePhone(phone), "+905551112233", phone);

for (const phone of ["", "123", "055511122333", "phone", "+445551112233", "garbage +90 555 111 22 33", "+90"]) {
  assert.equal(normalizeTurkishMobilePhone(phone), "", phone);
}

for (const name of ["Çağrı Öztürk", "Jean-Luc Picard", "D'Arcy Wretzky", "Mária de la Cruz", "李 明", "Anne   Marie O’Neill"]) {
  assert.ok(normalizePublicContactName(name), name);
}
assert.equal(normalizePublicContactName("Anne   Marie O’Neill"), "Anne Marie O’Neill");
for (const name of ["", "A", "123 456", "<script>"]) assert.equal(normalizePublicContactName(name), "", name);

assert.equal(normalizePublicContactEmail(" USER@Example.COM "), "user@example.com");
assert.equal(normalizePublicContactEmail(""), "");
for (const email of ["user@example", "user@@example.com", "user example@example.com"]) assert.equal(normalizePublicContactEmail(email), null);

for (const whatsapp of acceptedPhones) {
  const result = normalizePublicContact({ fullName: "Çağrı Öztürk", whatsapp, email: "qa@example.invalid" });
  assert.equal(result.valid, true, whatsapp);
  assert.deepEqual(result.value, { fullName: "Çağrı Öztürk", whatsapp: "+905551112233", email: "qa@example.invalid" });
}
const invalidContact = normalizePublicContact({ fullName: "Çağrı Öztürk", whatsapp: "123", email: "" });
assert.deepEqual(
  { valid: invalidContact.valid, invalidField: invalidContact.invalidField, message: invalidContact.message },
  { valid: false, invalidField: "whatsapp", message: CONTACT_ERROR_MESSAGES.whatsapp },
);

console.log("Performance Sprint contact contract tests passed");
