import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BANK_VERSION = "speaking_question_bank_v2";
const LEVELS = ["a2_1", "a2_2", "b1_1", "b1_2", "b2_1", "b2_2", "c1_1", "unsure"];
const durations = { a2_1: 45, a2_2: 45, b1_1: 60, b1_2: 60, b2_1: 90, b2_2: 90, c1_1: 120, unsure: 60 };
const levelMeta = {
  a2_1: { version: "concrete-description", contextEn: "Use short, clear sentences about a familiar situation.", contextTr: "Tanıdık bir durum hakkında kısa ve net cümleler kullan.", hintEn: "Main idea → Reason → Example", hintTr: "Ana fikir → Neden → Örnek" },
  a2_2: { version: "familiar-sequence", contextEn: "Describe a familiar situation and connect the main steps.", contextTr: "Tanıdık bir durumu anlat ve temel adımları birbirine bağla.", hintEn: "Situation → What happens → Result", hintTr: "Durum → Ne oluyor → Sonuç" },
  b1_1: { version: "supported-explanation", contextEn: "State your approach, explain why, and add a real example.", contextTr: "Yaklaşımını söyle, nedenini açıkla ve gerçek bir örnek ekle.", hintEn: "Approach → Reason → Example", hintTr: "Yaklaşım → Neden → Örnek" },
  b1_2: { version: "organized-experience", contextEn: "Organize the situation, your decision, and the outcome.", contextTr: "Durumu, kararını ve sonucu düzenli biçimde anlat.", hintEn: "Situation → Options → Decision → Outcome", hintTr: "Durum → Seçenekler → Karar → Sonuç" },
  b2_1: { version: "supported-position", contextEn: "Take a clear position and support it with causes and a practical example.", contextTr: "Net bir görüş belirt; nedenler ve pratik bir örnekle destekle.", hintEn: "Position → Reasons → Example → Recommendation", hintTr: "Görüş → Nedenler → Örnek → Öneri" },
  b2_2: { version: "qualified-argument", contextEn: "Balance benefits and limitations, then explain the conditions behind your judgment.", contextTr: "Faydaları ve sınırlamaları dengele; yargının hangi koşullara bağlı olduğunu açıkla.", hintEn: "Claim → Benefits → Limits → Conditions", hintTr: "İddia → Faydalar → Sınırlar → Koşullar" },
  c1_1: { version: "nuanced-evaluation", contextEn: "Evaluate assumptions, trade-offs, and wider implications with a relatable example.", contextTr: "Varsayımları, ödünleşimleri ve daha geniş sonuçları tanıdık bir örnekle değerlendir.", hintEn: "Principle → Assumption → Trade-off → Implication", hintTr: "İlke → Varsayım → Ödünleşim → Sonuç" },
  unsure: { version: "neutral-b1-start", contextEn: "Give a direct answer, one reason, and a familiar example.", contextTr: "Doğrudan cevap ver, bir neden ve tanıdık bir örnek ekle.", hintEn: "Answer → Reason → Example", hintTr: "Cevap → Neden → Örnek" },
};

const topics = {
  meeting: [
    { key: "weekly_update", topic: "team updates", simpleEn: "a useful update you give to other people", simpleTr: "başkalarına verdiğin faydalı bir bilgilendirme", eventEn: "you had to explain progress on a task", eventTr: "bir işteki ilerlemeyi açıklaman gereken", goalEn: "keep a short team update clear and useful", goalTr: "kısa bir ekip bilgilendirmesini net ve faydalı tutmanın", claimEn: "regular updates improve teamwork", claimTr: "düzenli bilgilendirmelerin ekip çalışmasını geliştirdiği", abstractEn: "the balance between transparency and information overload in team communication", abstractTr: "ekip iletişiminde şeffaflık ile bilgi yükü arasındaki denge" },
    { key: "recommend_action", topic: "recommendations", simpleEn: "a small improvement you would suggest", simpleTr: "önereceğin küçük bir iyileştirme", eventEn: "you recommended a different way of doing something", eventTr: "bir işi farklı yapmayı önerdiğin", goalEn: "make a recommendation that colleagues can act on", goalTr: "iş arkadaşlarının uygulayabileceği bir öneri sunmanın", claimEn: "the best recommendations should include possible risks", claimTr: "en iyi önerilerin olası riskleri de içermesi gerektiği", abstractEn: "when evidence should outweigh experience in group decisions", abstractTr: "grup kararlarında kanıtın deneyimden ne zaman daha ağır basması gerektiği" },
    { key: "respond_colleague", topic: "colleague communication", simpleEn: "a helpful way to respond to a colleague", simpleTr: "bir iş arkadaşına cevap vermenin faydalı bir yolu", eventEn: "a colleague disagreed with your idea", eventTr: "bir iş arkadaşının fikrine katılmadığı", goalEn: "respond calmly when a colleague challenges an idea", goalTr: "bir iş arkadaşı fikre itiraz ettiğinde sakin cevap vermenin", claimEn: "disagreement can improve a team's final decision", claimTr: "fikir ayrılığının ekibin nihai kararını geliştirebildiği", abstractEn: "the point at which constructive disagreement becomes unproductive", abstractTr: "yapıcı fikir ayrılığının verimsizleştiği nokta" },
    { key: "work_habit", topic: "work habits", simpleEn: "a work habit that helps you stay organized", simpleTr: "düzenli kalmana yardımcı olan bir çalışma alışkanlığı", eventEn: "your usual work plan had to change", eventTr: "alıştığın çalışma planının değişmesi gerektiği", goalEn: "protect focused work during a busy week", goalTr: "yoğun bir haftada odaklı çalışma zamanını korumanın", claimEn: "flexible work habits make teams more productive", claimTr: "esnek çalışma alışkanlıklarının ekipleri daha verimli yaptığı", abstractEn: "how teams should balance personal flexibility with shared routines", abstractTr: "ekiplerin kişisel esneklik ile ortak düzeni nasıl dengelemesi gerektiği" },
  ],
  interview: [
    { key: "strength", topic: "strengths", simpleEn: "something you do well", simpleTr: "iyi yaptığın bir şey", eventEn: "one of your strengths helped other people", eventTr: "güçlü yönlerinden birinin başkalarına yardım ettiği", goalEn: "show a professional strength without sounding exaggerated", goalTr: "abartılı görünmeden profesyonel bir güçlü yönü göstermenin", claimEn: "a person's most valuable strength can change across roles", claimTr: "bir kişinin en değerli güçlü yönünün role göre değişebildiği", abstractEn: "whether professional strengths are better demonstrated through results or reflection", abstractTr: "profesyonel güçlü yönlerin sonuçlarla mı yoksa öz değerlendirmeyle mi daha iyi gösterildiği" },
    { key: "problem_solving", topic: "problem solving", simpleEn: "a simple problem you solved recently", simpleTr: "yakın zamanda çözdüğün basit bir problem", eventEn: "you solved a problem with limited time", eventTr: "sınırlı zamanda bir problem çözdüğün", goalEn: "explain a problem-solving decision clearly", goalTr: "bir problem çözme kararını net biçimde açıklamanın", claimEn: "good problem solving depends more on questions than quick answers", claimTr: "iyi problem çözmenin hızlı cevaplardan çok doğru sorulara bağlı olduğu", abstractEn: "how uncertainty should influence professional decision making", abstractTr: "belirsizliğin profesyonel karar vermeyi nasıl etkilemesi gerektiği" },
    { key: "learning", topic: "learning", simpleEn: "a useful skill you are learning", simpleTr: "öğrendiğin faydalı bir beceri", eventEn: "you learned from a mistake or difficult task", eventTr: "bir hatadan veya zor görevden öğrendiğin", goalEn: "turn feedback into a practical learning plan", goalTr: "geri bildirimi pratik bir öğrenme planına dönüştürmenin", claimEn: "adaptability is more important than specialist knowledge in a changing role", claimTr: "değişen bir rolde uyum sağlamanın uzmanlık bilgisinden daha önemli olduğu", abstractEn: "the tension between proven expertise and the willingness to relearn", abstractTr: "kanıtlanmış uzmanlık ile yeniden öğrenme isteği arasındaki gerilim" },
    { key: "teamwork", topic: "teamwork", simpleEn: "a time you helped someone in a group", simpleTr: "bir grupta birine yardım ettiğin bir zaman", eventEn: "a team had different priorities and you helped it move forward", eventTr: "bir ekibin farklı öncelikleri olduğu ve ilerlemesine yardım ettiğin", goalEn: "describe your contribution to a shared result", goalTr: "ortak bir sonuca katkını anlatmanın", claimEn: "individual performance should sometimes be judged through team outcomes", claimTr: "bireysel performansın bazen ekip sonuçları üzerinden değerlendirilmesi gerektiği", abstractEn: "how responsibility should be shared when a team succeeds or fails", abstractTr: "bir ekip başarılı veya başarısız olduğunda sorumluluğun nasıl paylaşılması gerektiği" },
  ],
  presentation: [
    { key: "helpful_idea", topic: "explaining ideas", simpleEn: "an idea that makes daily life easier", simpleTr: "günlük hayatı kolaylaştıran bir fikir", eventEn: "you explained a new idea to someone", eventTr: "birine yeni bir fikir açıkladığın", goalEn: "make a new idea easy for an audience to follow", goalTr: "yeni bir fikri dinleyicinin kolayca takip etmesini sağlamanın", claimEn: "simple explanations are usually more persuasive than detailed ones", claimTr: "basit açıklamaların genellikle ayrıntılı olanlardan daha ikna edici olduğu", abstractEn: "what communicators lose when they simplify a complex idea", abstractTr: "iletişim kuranların karmaşık bir fikri sadeleştirirken ne kaybettiği" },
    { key: "recommendation", topic: "recommendations", simpleEn: "something useful you would recommend", simpleTr: "önereceğin faydalı bir şey", eventEn: "your recommendation helped someone make a choice", eventTr: "önerinin birinin seçim yapmasına yardım ettiği", goalEn: "present a recommendation that different listeners can use", goalTr: "farklı dinleyicilerin kullanabileceği bir öneri sunmanın", claimEn: "a strong recommendation must acknowledge its limitations", claimTr: "güçlü bir önerinin sınırlamalarını kabul etmesi gerektiği", abstractEn: "the ethical boundary between persuasion and influence", abstractTr: "ikna ile etkileme arasındaki etik sınır" },
    { key: "change", topic: "change", simpleEn: "a positive change you have noticed", simpleTr: "fark ettiğin olumlu bir değişiklik", eventEn: "a change affected your routine", eventTr: "bir değişikliğin günlük düzenini etkilediği", goalEn: "explain why a change matters to a familiar audience", goalTr: "bir değişimin neden önemli olduğunu tanıdık bir dinleyiciye açıklamanın", claimEn: "small changes can create more lasting results than large plans", claimTr: "küçük değişikliklerin büyük planlardan daha kalıcı sonuçlar yaratabildiği", abstractEn: "why people support change in principle but resist it in practice", abstractTr: "insanların değişimi ilke olarak destekleyip uygulamada neden direnebildiği" },
    { key: "teach_process", topic: "teaching a process", simpleEn: "a simple task you can teach someone", simpleTr: "birine öğretebileceğin basit bir görev", eventEn: "you showed someone how to do something", eventTr: "birine bir şeyin nasıl yapılacağını gösterdiğin", goalEn: "teach a short process without losing the audience", goalTr: "dinleyiciyi kaybetmeden kısa bir süreci öğretmenin", claimEn: "examples are more useful than instructions when teaching a process", claimTr: "bir süreç öğretirken örneklerin talimatlardan daha faydalı olduğu", abstractEn: "how much responsibility a speaker has for an audience's misunderstanding", abstractTr: "dinleyicinin yanlış anlamasında konuşmacının ne kadar sorumluluğu olduğu" },
  ],
  other: [
    { key: "travel", topic: "travel", simpleEn: "a place you enjoy visiting", simpleTr: "ziyaret etmekten hoşlandığın bir yer", eventEn: "a travel plan changed unexpectedly", eventTr: "bir seyahat planının beklenmedik biçimde değiştiği", goalEn: "recommend a travel experience to someone with different interests", goalTr: "farklı ilgi alanları olan birine seyahat deneyimi önermenin", claimEn: "travel is most valuable when it challenges familiar habits", claimTr: "seyahatin tanıdık alışkanlıkları zorladığında en değerli olduğu", abstractEn: "how tourism should balance personal freedom with local responsibility", abstractTr: "turizmin kişisel özgürlük ile yerel sorumluluğu nasıl dengelemesi gerektiği" },
    { key: "technology", topic: "technology", simpleEn: "a piece of technology you use often", simpleTr: "sık kullandığın bir teknoloji", eventEn: "technology made a daily task easier or harder", eventTr: "teknolojinin günlük bir işi kolaylaştırdığı veya zorlaştırdığı", goalEn: "choose healthy boundaries for everyday technology use", goalTr: "günlük teknoloji kullanımı için sağlıklı sınırlar seçmenin", claimEn: "convenient technology can reduce people's independence", claimTr: "kolaylık sağlayan teknolojinin insanların bağımsızlığını azaltabildiği", abstractEn: "what society trades away when convenience becomes the main measure of progress", abstractTr: "kolaylık ilerlemenin ana ölçüsü olduğunda toplumun nelerden vazgeçtiği" },
    { key: "international_life", topic: "international communication", simpleEn: "a situation where English helps you communicate", simpleTr: "İngilizcenin iletişim kurmana yardımcı olduğu bir durum", eventEn: "you communicated with someone from a different background", eventTr: "farklı bir geçmişten gelen biriyle iletişim kurduğun", goalEn: "prevent misunderstandings in international communication", goalTr: "uluslararası iletişimde yanlış anlamaları önlemenin", claimEn: "clear international communication requires more than correct language", claimTr: "net uluslararası iletişimin doğru dilden fazlasını gerektirdiği", abstractEn: "how people can adapt communication without losing authenticity", abstractTr: "insanların özgünlüğünü kaybetmeden iletişimlerini nasıl uyarlayabileceği" },
    { key: "personal_goal", topic: "personal goals", simpleEn: "a personal goal that matters to you", simpleTr: "senin için önemli olan kişisel bir hedef", eventEn: "you changed your plan while working toward a goal", eventTr: "bir hedefe ilerlerken planını değiştirdiğin", goalEn: "keep making progress when motivation changes", goalTr: "motivasyon değiştiğinde ilerlemeyi sürdürmenin", claimEn: "flexible goals lead to better results than fixed plans", claimTr: "esnek hedeflerin sabit planlardan daha iyi sonuçlara yol açtığı", abstractEn: "when persistence becomes less useful than changing direction", abstractTr: "ısrarın yön değiştirmekten daha az faydalı hale geldiği zaman" },
  ],
};

function wording(level, item) {
  const capitalize = (value) => value.charAt(0).toLocaleUpperCase("tr-TR") + value.slice(1);
  const simpleTr = capitalize(item.simpleTr);
  const eventTr = capitalize(item.eventTr);
  const goalTr = capitalize(item.goalTr);
  const forms = {
    a2_1: [`Talk about ${item.simpleEn}. Why is it important to you?`, `${simpleTr} hakkında konuş. Senin için neden önemli?`],
    a2_2: [`Describe ${item.simpleEn}. How does it help or affect you?`, `${simpleTr} anlat. Sana nasıl yardımcı oluyor veya seni nasıl etkiliyor?`],
    b1_1: [`Explain ${item.simpleEn}. What makes it useful or important?`, `${simpleTr} açıkla. Onu faydalı veya önemli yapan nedir?`],
    b1_2: [`Describe a time when ${item.eventEn}. What did you do, and what was the result?`, `${eventTr} bir zamanı anlat. Ne yaptın ve sonuç ne oldu?`],
    b2_1: [`What is the most effective way to ${item.goalEn}? Support your view with a practical example.`, `${goalTr} en etkili yolu nedir? Görüşünü pratik bir örnekle destekle.`],
    b2_2: [`To what extent do you agree that ${item.claimEn}? Discuss the benefits, limits, and conditions.`, `${item.claimTr} görüşüne ne ölçüde katılıyorsun? Faydaları, sınırları ve koşulları tartış.`],
    c1_1: [`How should we think about ${item.abstractEn}? Evaluate the assumptions, trade-offs, and wider implications.`, `${item.abstractTr} hakkında nasıl düşünmeliyiz? Varsayımları, ödünleşimleri ve daha geniş sonuçları değerlendir.`],
    unsure: [`Tell us about ${item.simpleEn}. Give a reason and one example.`, `${simpleTr} hakkında konuş. Bir neden ve bir örnek ver.`],
  };
  return forms[level];
}

const questions = [];
for (const [purpose, items] of Object.entries(topics)) {
  for (const level of LEVELS) {
    items.forEach((item, index) => {
      const [questionEn, questionTr] = wording(level, item);
      const meta = levelMeta[level];
      questions.push({
        id: `${purpose}_${level}_${item.key}_${String(index + 1).padStart(3, "0")}`,
        purpose,
        level,
        question_tr: questionTr,
        question_en: questionEn,
        context_tr: meta.contextTr,
        context_en: meta.contextEn,
        structure_hint_tr: meta.hintTr,
        structure_hint_en: meta.hintEn,
        recommended_duration: durations[level],
        topic: item.topic,
        difficulty_version: meta.version,
        active: true,
        question_bank_version: BANK_VERSION,
      });
    });
  }
}

const legacyIds = [
  "meeting-a2-1-helpful-routine", "meeting-a2-2-useful-app", "meeting-b1-1-time-organization", "meeting-b1-2-home-or-office", "meeting-b2-1-useful-meetings", "meeting-b2-2-digital-communication", "meeting-c1-1-productive-disagreement", "meeting-unsure-practical-change",
  "interview-a2-1-enjoyable-activity", "interview-a2-2-learned-skill", "interview-b1-1-recent-problem", "interview-b1-2-difficult-choice", "interview-b2-1-learning-goal", "interview-b2-2-changed-opinion", "interview-c1-1-success-definition", "interview-unsure-proud-moment",
  "presentation-a2-1-favorite-place", "presentation-a2-2-recommend-experience", "presentation-b1-1-helpful-habit", "presentation-b1-2-recent-change", "presentation-b2-1-technology-boundaries", "presentation-b2-2-place-to-live", "presentation-c1-1-convenience-cost", "presentation-unsure-useful-recommendation",
];

const payload = { version: BANK_VERSION, generated_at: "2026-08-04", questions, legacy_ids: legacyIds };
const json = `${JSON.stringify(payload, null, 2)}\n`;
const js = `// Generated by scripts/generate-performance-question-bank.mjs.\nexport const QUESTION_BANK_VERSION = ${JSON.stringify(BANK_VERSION)};\nexport const QUESTIONS = Object.freeze(${JSON.stringify(questions, null, 2)});\nexport const LEGACY_QUESTION_IDS = Object.freeze(${JSON.stringify(legacyIds, null, 2)});\n`;
const ts = `// Generated by scripts/generate-performance-question-bank.mjs.\nexport const QUESTION_BANK_VERSION = ${JSON.stringify(BANK_VERSION)};\nexport const QUESTIONS = ${JSON.stringify(questions, null, 2)} as const;\nexport const LEGACY_QUESTION_IDS = new Set(${JSON.stringify(legacyIds, null, 2)});\nexport type CareerEnglishQuestion = (typeof QUESTIONS)[number];\n`;
const appendix = [
  "# Star Speaker speaking question bank v2",
  "",
  `Version: \`${BANK_VERSION}\`  `,
  `Active questions: ${questions.length}`,
  "",
  "| ID | Purpose | Level | Turkish | English | Topic | Duration | Structure hint |",
  "|---|---|---|---|---|---|---:|---|",
  ...questions.map((q) => `| \`${q.id}\` | ${q.purpose} | ${q.level} | ${q.question_tr.replaceAll("|", "\\|")} | ${q.question_en.replaceAll("|", "\\|")} | ${q.topic} | ${q.recommended_duration}s | ${q.structure_hint_en.replaceAll("|", "\\|")} |`),
  "",
].join("\n");

for (const [path, content] of [
  ["src/data/performance-question-bank.json", json],
  ["src/scripts/performance-question-bank.js", js],
  ["supabase/functions/_shared/performance-question-bank.ts", ts],
  ["docs/PERFORMANCE_QUESTION_BANK_V2.md", appendix],
]) {
  const target = resolve(root, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

console.log(`Generated ${questions.length} active questions (${questions.length / 32} per purpose × level cell).`);
