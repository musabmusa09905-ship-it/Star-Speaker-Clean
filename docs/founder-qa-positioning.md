# Star Speaker positioning — founder QA

Local review build, 7 September 2026. Branch: `feat/broaden-website-positioning`, based on main `a2904488b94d167fe33544e27d2b2a69b5ca1cbc`. Not published.

Preview from the website repository with `node scripts/preview-site.mjs 4189`, then open http://127.0.0.1:4189/.

## Visible changes to review

- Root opens English. Explicit `?lang=tr` still opens Turkish. Language switching keeps campaign queries, repeated values, and supported section anchors.
- Hero: “Speak English when it matters.” / “Önemli anlarda İngilizce konuş.” Header now says Speaking Performance / Konuşma Performansı.
- Problems cover finding words, starting, organizing, explaining, grammar in speech, listening/responding, and pressure. Existing career examples remain.
- Four situation groups: career, speaking exams, study/international life, everyday communication. These are practice contexts, not new products.
- Method is a compact five-step list: speak, focused feedback, practice, try again, keep building. Problem images form compact cards. Mobile/tablet hero puts text and actions first.
- Programs precede testimonials. Career Flow STAR (17,000 TL), SUPER STAR (23,000 TL), and 21-day Sprint (12,000 TL) retain all published sessions, durations, support, and terms. Testimonials and their evidence are unchanged.
- FAQ explains roughly B1+ focus while retaining A2.1–C1.1 suitability. Public Turkish analysis uses one answer, transcript-based feedback, and retry; it is distinct from the signed-in Member Diagnostic. No fixed three-minute or audio-diagnosis promise.
- English CTAs use the existing WhatsApp number and message; Turkish analysis CTAs retain the existing route. Footer: “Speaking practice for the moments that matter.” / “Önemli anlar için İngilizce konuşma pratiği.”
- EN/TR titles, descriptions, social-preview text, canonical/alternate links and sitemap reflect the positioning. Existing social image, official monogram, black/champagne/ivory palette, and serif/sans typography remain.

## Mobile and desktop checkpoints

Both languages were checked at 320, 360, 390, 768 and 1440px: no horizontal content overflow; one H1; images have alt attributes. Primary hero CTA ends at 539/545px (EN/TR) at 320px, 514/539px at 360px, 514/514px at 390px, 547/547px at 768px, and 696/696px at 1440px. Review wrapping, spacing and program-card readability on your own phone too.

Browser checks covered menu keyboard activation, Escape focus return, locale switching with repeated campaign parameters, FAQ keyboard expansion, English WhatsApp handoff to +90 552 524 77 46, and the Turkish analysis entry page. No message, lead, or recording was submitted. All eight native test scripts and the production build pass; repeated build output is deterministic. This is a Chromium preview check, not a separate Safari/device certification.

## Founder decisions / follow-up

- Confirm the broader voice feels right for visitors arriving from English Instagram; the supplied positioning is reflected here, but no Instagram profile was edited or independently audited.
- Supply an approved founder photo and factual bio if a founder section is wanted. None was invented.
- The Turkish analysis product retains its current separate career-focused wording; its implementation and the member app were intentionally outside this marketing pass.
- Review both languages before publication. This commit is ready for founder QA and has not been pushed or deployed.
