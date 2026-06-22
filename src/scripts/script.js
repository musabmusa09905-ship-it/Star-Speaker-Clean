const menuButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#primary-navigation");
const navLinks = document.querySelectorAll(".nav-menu a");
const languageLinks = document.querySelectorAll(".language-toggle a");

const languageStorageKey = "starSpeakerLanguage";
const originalTextNodes = new WeakMap();
const originalElements = new WeakMap();
const originalAttrs = new WeakMap();

const i18n = {
  en: {
    menuOpen: "Open navigation menu",
    menuClose: "Close navigation menu",
    form: {
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
      },
      email: "Please enter a valid email address or leave it blank.",
      success: "Your application has been received. We will review your information and confirm your consultation time by WhatsApp.",
    },
  },
  tr: {
    menuOpen: "Navigasyon men\u00fcs\u00fcn\u00fc a\u00e7",
    menuClose: "Navigasyon men\u00fcs\u00fcn\u00fc kapat",
    form: {
      required: {
        fullName: "L\u00fctfen ad\u0131n\u0131z\u0131 ve soyad\u0131n\u0131z\u0131 yaz\u0131n.",
        whatsapp: "L\u00fctfen WhatsApp numaran\u0131z\u0131 yaz\u0131n.",
        englishLevel: "L\u00fctfen mevcut \u0130ngilizce seviyenizi se\u00e7in.",
        mainGoal: "L\u00fctfen ana hedefinizi se\u00e7in.",
        speakingProblem: "L\u00fctfen sizi en \u00e7ok zorlayan konu\u015fma problemini payla\u015f\u0131n.",
        preferredProgram: "L\u00fctfen tercih etti\u011finiz program\u0131 se\u00e7in.",
        startTimeline: "L\u00fctfen ne zaman ba\u015flamak istedi\u011finizi se\u00e7in.",
        preferredConsultationWindow: "L\u00fctfen tercih etti\u011finiz g\u00f6r\u00fc\u015fme aral\u0131\u011f\u0131n\u0131 se\u00e7in.",
        preferredConsultationDate: "L\u00fctfen tercih etti\u011finiz g\u00f6r\u00fc\u015fme tarihini se\u00e7in.",
        consultationLanguage: "L\u00fctfen bir g\u00f6r\u00fc\u015fme dili se\u00e7in.",
      },
      email: "L\u00fctfen ge\u00e7erli bir e-posta adresi girin veya bu alan\u0131 bo\u015f b\u0131rak\u0131n.",
      success: "Ba\u015fvurunuz al\u0131nd\u0131. Bilgilerinizi inceleyip g\u00f6r\u00fc\u015fme saatinizi WhatsApp \u00fczerinden onaylayaca\u011f\u0131z.",
    },
  },
};
const pageMetaTr = {
  home: {
    title: "Star Speaker | GÃ¼venle konuÅŸ. Globalde parla.",
    description: "Star Speaker ile yapÄ±landÄ±rÄ±lmÄ±ÅŸ Ä°ngilizce konuÅŸma koÃ§luÄŸu, gÃ¼nlÃ¼k ses pratiÄŸi ve gÃ¶rÃ¼nÃ¼r ilerleme.",
  },
  programs: {
    title: "Programlar | Star Speaker",
    description: "Spark, Star ve Super Star programlarÄ±yla Star Speaker konuÅŸma dÃ¶nÃ¼ÅŸÃ¼m yolculuÄŸunu keÅŸfedin.",
  },
  method: {
    title: "Metot | Star Speaker",
    description: "Star Speaker Immersion System: baskÄ±, gÃ¼ven, yapÄ±, gÃ¼nlÃ¼k Ã§Ä±ktÄ± ve uzman dÃ¼zeltmesi etrafÄ±nda kurulan konuÅŸma odaklÄ± sistem.",
  },
  results: {
    title: "SonuÃ§lar | Star Speaker",
    description: "Star Speaker sonuÃ§ sistemi: konuÅŸma geliÅŸiminin ses kayÄ±tlarÄ±, geri bildirimler ve gÃ¶rÃ¼nÃ¼r kilometre taÅŸlarÄ±yla nasÄ±l takip edildiÄŸi.",
  },
  about: {
    title: "HakkÄ±mÄ±zda | Star Speaker",
    description: "Star Speaker: yapÄ±, konuÅŸma Ã§Ä±ktÄ±sÄ±, gÃ¼ven, gÃ¼nlÃ¼k pratik ve hassas dÃ¼zeltme etrafÄ±nda kurulan premium konuÅŸma dÃ¶nÃ¼ÅŸÃ¼m sistemi.",
  },
  resources: {
    title: "Kaynaklar | Star Speaker",
    description: "Star Speaker ucretsiz konusma kaynaklari, rehberleri, promptlari ve pratik araclari.",
  },
  apply: {
    title: "BaÅŸvuru / GÃ¶rÃ¼ÅŸme | Star Speaker",
    description: "Star Speaker gÃ¶rÃ¼ÅŸmeniz iÃ§in baÅŸvurun ve konuÅŸma hedefinize uygun Star Path Ã¶nerisini alÄ±n.",
  },
  levelTest: {
    title: "KonuÅŸma Seviye Tespiti | Star Speaker",
    description: "Star Speaker konuÅŸma seviye tespit testi ile seviyeniz ve Star Path Ã¶neriniz manuel olarak 1 saat iÃ§inde deÄŸerlendirilir.",
  },
};

pageMetaTr.login = {
  title: "Ã–ÄŸrenci GiriÅŸi | Star Speaker",
  description: "Kabul edilen Star Speaker Ã¶ÄŸrencileri iÃ§in Ã¶zel giriÅŸ sayfasÄ±.",
};

pageMetaTr.workspace = {
  title: "Ã–ÄŸrenci AlanÄ± | Star Speaker",
  description: "Aktif Star Speaker Ã¶ÄŸrencileri iÃ§in Ã¶zel Ã§alÄ±ÅŸma alanÄ±.",
};

pageMetaTr.resetPassword = {
  title: "Åžifre Yenileme | Star Speaker",
  description: "Star Speaker Ã¶ÄŸrenci hesabÄ±nÄ±z iÃ§in yeni ÅŸifre oluÅŸturun.",
};

const selectorTranslationsTr = {
  common: [
    [".nav-links a[href='apply.html']", "text", "BaÅŸvuru"],
  ],
  home: [
    ["#hero-title", "html", "Yurt dÄ±ÅŸÄ±na Ã§Ä±kmadan,<br>yurt dÄ±ÅŸÄ±ndaymÄ±ÅŸ gibi<br>Ä°ngilizce konuÅŸma deneyimi."],
    ["#journey-title", "text", "GÃ¼venli iletiÅŸime giden dÃ¶rt aÅŸamalÄ± yolculuk."],
    ["#final-cta-title", "text", "AkÄ±cÄ± ve Ã¶zgÃ¼venli Ä°ngilizce yolculuÄŸunuz ÅŸimdi baÅŸlayabilir."],
  ],
  programs: [
    ["#programs-title", "text", "The Star Path"],
    ["#program-cards-title", "text", "Bir Star Speaker programÄ± seÃ§in"],
    ["#system-title", "text", "Star Speaker sistemi"],
  ],
  method: [
    ["#method-title", "html", "Star Speaker<br>Immersion System"],
    ["#journey-title", "text", "TereddÃ¼tten Ã¶zgÃ¼venli iletiÅŸime uzanan dÃ¶rt aÅŸama."],
    ["#mechanics-title", "text", "Star Speaker; Ã§Ä±ktÄ±, dÃ¼zeltme ve tekrar Ã¼zerine kurulur."],
  ],
  results: [
    ["#results-title", "html", "DÃ¶nÃ¼ÅŸÃ¼m nasÄ±l<br>gÃ¶rÃ¼lecek, takip edilecek<br>ve paylaÅŸÄ±lacak."],
    ["#results-final-title", "text", "Kendi dÃ¶nÃ¼ÅŸÃ¼m hikayenizi baÅŸlatÄ±n."],
  ],
  about: [
    ["#about-title", "html", "Ä°ngilizce derslerinin Ã¶tesinde.<br>Bir konuÅŸma dÃ¶nÃ¼ÅŸÃ¼m sistemi."],
    ["#about-final-title", "text", "Star Speaker olmaya hazÄ±r mÄ±sÄ±nÄ±z?"],
  ],
  resources: [
    ["#resources-title", "html", "Daha Ä°yi <span>KonuÅŸma</span> Ä°Ã§in Ãœcretsiz Kaynaklar."],
    ["#resources-final-title", "text", "YapÄ±landÄ±rÄ±lmÄ±ÅŸ bir konuÅŸma dÃ¶nÃ¼ÅŸÃ¼mÃ¼ne hazÄ±r mÄ±sÄ±nÄ±z?"],
  ],
  apply: [
    ["#apply-title", "html", "Star Speaker<br>GÃ¶rÃ¼ÅŸmeniz Ä°Ã§in<br>BaÅŸvurun"],
    ["#application-form-title", "text", "KonuÅŸmada nerede takÄ±ldÄ±ÄŸÄ±nÄ±zÄ± anlatÄ±n."],
    ["#final-apply-title", "text", "KonuÅŸma dÃ¶nÃ¼ÅŸÃ¼mÃ¼nÃ¼z tek net adÄ±mla baÅŸlayabilir."],
  ],
};

const textTr = {
  "Skip to content": "Ä°Ã§eriÄŸe geÃ§",
  "Speak confidently. Shine globally.": "GÃ¼venle konuÅŸ. Globalde parla.",
  "Home": "Ana Sayfa",
  "Programs": "Programlar",
  "Method": "Metot",
  "Results": "SonuÃ§lar",
  "About": "HakkÄ±mÄ±zda",
  "Resources": "Kaynaklar",
  "Apply": "BaÅŸvur",
  "Login": "GiriÅŸ",
  "Book a Consultation": "GÃ¶rÃ¼ÅŸme Planla",
  "Take Level Test": "Seviye Testi",
  "View Programs": "ProgramlarÄ± GÃ¶r",
  "Private English Speaking Coaching": "Ã–zel Ä°ngilizce KonuÅŸma KoÃ§luÄŸu",
  "Speak confidently in 30â€“60 days through structured immersion, daily voice practice, and expert guidance.": "YapÄ±landÄ±rÄ±lmÄ±ÅŸ immersiyon, gÃ¼nlÃ¼k ses pratiÄŸi ve uzman yÃ¶nlendirmesiyle 30â€“60 gÃ¼n iÃ§inde daha Ã¶zgÃ¼venli konuÅŸmaya baÅŸlayÄ±n.",
  "Private & Personalized": "Ã–zel ve kiÅŸiselleÅŸtirilmiÅŸ",
  "Structured Immersion": "YapÄ±landÄ±rÄ±lmÄ±ÅŸ immersiyon",
  "Visible Progress": "GÃ¶rÃ¼nÃ¼r ilerleme",
  "Premium Experience": "Premium deneyim",
  "â˜…â˜…â˜…â˜…â˜…": "â˜…â˜…â˜…â˜…â˜…",
  "â€œThis feels like living abroad. My English finally clicked.â€": "â€œYurt dÄ±ÅŸÄ±ndaymÄ±ÅŸ gibi hissettiriyor. Ä°ngilizcem sonunda oturdu.â€",
  "â€œThis feels like living abroad.": "â€œYurt dÄ±ÅŸÄ±ndaymÄ±ÅŸ gibi hissettiriyor.",
  "My English finally clicked.â€": "Ä°ngilizcem sonunda oturdu.â€",
  "â€” Elif S.": "â€” Elif S.",
  "How It Works": "NasÄ±l Ä°ÅŸler",
  "Assessment": "DeÄŸerlendirme",
  "We evaluate your current speaking level, strengths, and goals.": "Mevcut konuÅŸma seviyenizi, gÃ¼Ã§lÃ¼ yÃ¶nlerinizi ve hedeflerinizi deÄŸerlendiririz.",
  "Week 1": "1. Hafta",
  "Controlled Immersion": "KontrollÃ¼ Ä°mmersiyon",
  "You learn in a safe, expert-led environment designed for real progress.": "GerÃ§ek ilerleme iÃ§in tasarlanmÄ±ÅŸ, gÃ¼venli ve uzman rehberliÄŸinde bir ortamda Ã¶ÄŸrenirsiniz.",
  "Weeks 2â€“3": "2â€“3. Haftalar",
  "Daily Voice Practice & Live Interaction": "GÃ¼nlÃ¼k Ses PratiÄŸi ve CanlÄ± EtkileÅŸim",
  "Build consistency with daily voice practice and real conversations.": "GÃ¼nlÃ¼k ses pratiÄŸi ve gerÃ§ek konuÅŸmalarla sÃ¼reklilik kazanÄ±rsÄ±nÄ±z.",
  "Weeks 4â€“6": "4â€“6. Haftalar",
  "Measurable Speaking Transformation": "Ã–lÃ§Ã¼lebilir KonuÅŸma DÃ¶nÃ¼ÅŸÃ¼mÃ¼",
  "See measurable growth in confidence, clarity, and stage presence.": "Ã–zgÃ¼ven, netlik ve konuÅŸma duruÅŸunda Ã¶lÃ§Ã¼lebilir geliÅŸim gÃ¶rÃ¼rsÃ¼nÃ¼z.",
  "Weeks 7â€“8+": "7â€“8+ Haftalar",
  "Speak Confidently": "Ã–zgÃ¼venle KonuÅŸun",
  "Express your ideas clearly in real-life situations.": "GerÃ§ek hayat durumlarÄ±nda fikirlerinizi net ÅŸekilde ifade edin.",
  "Think in English": "Ä°ngilizce DÃ¼ÅŸÃ¼nÃ¼n",
  "Build natural fluency and faster responses.": "Daha doÄŸal akÄ±cÄ±lÄ±k ve daha hÄ±zlÄ± cevaplar geliÅŸtirin.",
  "Handle Real Situations": "GerÃ§ek DurumlarÄ± YÃ¶netin",
  "From interviews to presentations, speak with ease.": "MÃ¼lakattan sunuma, daha rahat konuÅŸun.",
  "See Measurable Progress": "Ã–lÃ§Ã¼lebilir Ä°lerleme GÃ¶rÃ¼n",
  "Track your improvement every step of the way.": "GeliÅŸiminizi her adÄ±mda takip edin.",
  "Join a private experience designed for results, not just lessons.": "Sadece dersler iÃ§in deÄŸil, sonuÃ§ iÃ§in tasarlanmÄ±ÅŸ Ã¶zel bir deneyime katÄ±lÄ±n.",

  "The Star Path": "The Star Path",
  "Choose the level of structure, adaptation, and precision your speaking life needs.": "KonuÅŸma hedefinize uygun yapÄ±, kiÅŸiselleÅŸtirme ve destek seviyesini seÃ§in.",
  "Structured Immersion â€” YapÄ±landÄ±rÄ±lmÄ±ÅŸ Ä°mmersiyon": "Structured Immersion â€” YapÄ±landÄ±rÄ±lmÄ±ÅŸ Ä°mmersiyon",
  "Spark": "Spark",
  "Structure, rhythm, and daily speaking discipline.": "YapÄ±, ritim ve gÃ¼nlÃ¼k konuÅŸma disiplini.",
  "/ month": "/ ay",
  "3 Ã— around 50-minute group sessions": "YaklaÅŸÄ±k 50 dakikalÄ±k 3 grup seansÄ±",
  "1 Star Circle per week": "Haftada 1 Star Circle",
  "Group correction rhythm": "Grup iÃ§inde dÃ¼zenli dÃ¼zeltme ritmi",
  "Reminders and task tracking": "HatÄ±rlatÄ±cÄ±lar ve gÃ¶rev takibi",
  "Structure": "YapÄ±",
  "Turns speaking into a visible routine; ideal for students who need momentum and consistency.": "KonuÅŸmayÄ± gÃ¶rÃ¼nÃ¼r bir rutine dÃ¶nÃ¼ÅŸtÃ¼rÃ¼r; ivme ve sÃ¼reklilik ihtiyacÄ± olan Ã¶ÄŸrenciler iÃ§in idealdir.",
  "3 sessions per week": "Haftada 3 seans",
  "Around 50 minutes each": "Her biri yaklaÅŸÄ±k 50 dakika",
  "Maximum 3 students per group": "Grup baÅŸÄ±na en fazla 3 Ã¶ÄŸrenci",
  "Program materials": "Program materyalleri",
  "Daily speaking tasks": "GÃ¼nlÃ¼k konuÅŸma gÃ¶revleri",
  "Daily Voice Log": "Daily Voice Log",
  "Immersion Pack": "Immersion Pack",
  "Reminders": "HatÄ±rlatÄ±cÄ±lar",
  "Ranking and progress system": "SÄ±ralama ve ilerleme sistemi",
  "Apply": "BaÅŸvur",
  "Recommended": "Ã–nerilen",
  "Personalized Acceleration": "Personalized Acceleration â€” KiÅŸiselleÅŸtirilmiÅŸ HÄ±zlanma",
  "Star": "Star",
  "Adaptation, more personal feedback, and a stronger correction rhythm.": "Uyarlama, daha kiÅŸisel geri bildirim ve daha gÃ¼Ã§lÃ¼ bir dÃ¼zeltme ritmi.",
  "2 private + 2 group sessions": "2 Ã¶zel + 2 grup seansÄ±",
  "2 Star Circles per week": "Haftada 2 Star Circle",
  "More personal correction focus": "Daha kiÅŸisel dÃ¼zeltme odaÄŸÄ±",
  "More detailed tracking": "Daha detaylÄ± takip",
  "Adaptation": "Uyarlama",
  "Balances private coaching, group practice, and customized material for students with clear goals.": "Net hedefleri olan Ã¶ÄŸrenciler iÃ§in Ã¶zel koÃ§luk, grup pratiÄŸi ve kiÅŸiselleÅŸtirilmiÅŸ materyali dengeler.",
  "Everything in Spark": "Spark iÃ§indeki her ÅŸey",
  "2 private + 2 group sessions weekly": "Haftada 2 Ã¶zel + 2 grup seansÄ±",
  "More personalized feedback": "Daha kiÅŸisel geri bildirim",
  "Tailored speaking drills": "Hedefe gÃ¶re konuÅŸma drill'leri",
  "Materials customized with student profile": "Ã–ÄŸrenci profiline gÃ¶re Ã¶zelleÅŸtirilmiÅŸ materyaller",
  "Customized reading and listening content": "Ã–zelleÅŸtirilmiÅŸ okuma ve dinleme iÃ§erikleri",
  "Stronger correction focus": "Daha gÃ¼Ã§lÃ¼ dÃ¼zeltme odaÄŸÄ±",
  "Private Precision": "Private Precision â€” Ã–zel ve Hassas KoÃ§luk",
  "Super Star": "Super Star",
  "A private speaking roadmap, fast correction, and deep accountability.": "Ã–zel bir konuÅŸma yol haritasÄ±, hÄ±zlÄ± dÃ¼zeltme ve gÃ¼Ã§lÃ¼ sorumluluk takibi.",
  "5 private sessions": "5 Ã¶zel seans",
  "3 Star Circles per week": "Haftada 3 Star Circle",
  "Fastest correction and feedback loop": "En hÄ±zlÄ± dÃ¼zeltme ve geri bildirim dÃ¶ngÃ¼sÃ¼",
  "Priority support access": "Ã–ncelikli destek eriÅŸimi",
  "Precision": "Hassasiyet",
  "Makes scenarios, correction, and accountability fully personal for high-stakes speaking goals.": "YÃ¼ksek Ã¶neme sahip konuÅŸma hedefleri iÃ§in senaryolarÄ±, dÃ¼zeltmeyi ve sorumluluÄŸu tamamen kiÅŸiselleÅŸtirir.",
  "Everything in Star": "Star iÃ§indeki her ÅŸey",
  "5 private sessions weekly": "Haftada 5 Ã¶zel seans",
  "3 Star Circles weekly": "Haftada 3 Star Circle",
  "Fully personalized speaking roadmap": "Tamamen kiÅŸisel konuÅŸma yol haritasÄ±",
  "Custom scenarios based on goals and life context": "Hedeflere ve yaÅŸam baÄŸlamÄ±na gÃ¶re Ã¶zel senaryolar",
  "Advanced support": "Ä°leri seviye destek",
  "Deepest customization and accountability": "En derin kiÅŸiselleÅŸtirme ve sorumluluk takibi",
  "Students who need structure and want speaking to become a daily habit.": "YapÄ±ya ihtiyaÃ§ duyan ve konuÅŸmayÄ± gÃ¼nlÃ¼k alÄ±ÅŸkanlÄ±ÄŸa dÃ¶nÃ¼ÅŸtÃ¼rmek isteyen Ã¶ÄŸrenciler.",
  "Students who want more focused, tailored speaking refinement.": "Daha odaklÄ± ve kiÅŸiye Ã¶zel konuÅŸma geliÅŸimi isteyen Ã¶ÄŸrenciler.",
  "Students preparing for interviews, study abroad, presentations, or high-stakes goals.": "MÃ¼lakat, yurt dÄ±ÅŸÄ± eÄŸitim, sunum veya yÃ¼ksek Ã¶neme sahip hedeflere hazÄ±rlanan Ã¶ÄŸrenciler.",
  "Short daily recordings, replay, and preparation for the first coach note.": "KÄ±sa gÃ¼nlÃ¼k kayÄ±tlar, tekrar dinleme ve ilk koÃ§ notuna hazÄ±rlÄ±k.",
  "Star Circles": "Star Circles",
  "Small speaking circles open after the first placement step is complete.": "Ä°lk yerleÅŸtirme adÄ±mÄ± tamamlandÄ±ktan sonra aÃ§Ä±lan kÃ¼Ã§Ã¼k konuÅŸma halkalarÄ±.",
  "Confidence Ladder": "Confidence Ladder",
  "Your first recording begins the Solo Output stage.": "Ä°lk kaydÄ±nÄ±z Solo Output aÅŸamasÄ±nÄ± baÅŸlatÄ±r.",
  "Star Prompts": "Star Prompts",
  "Clear reminders for your first recording, ritual, and logbook.": "Ä°lk kaydÄ±nÄ±z, ritÃ¼eliniz ve logbook iÃ§in net hatÄ±rlatÄ±cÄ±lar.",
  "Star Progress System": "Star Progress System",
  "The performance scale appears after real evidence is collected.": "Performans Ã¶lÃ§eÄŸi, gerÃ§ek kanÄ±t toplandÄ±ktan sonra gÃ¶rÃ¼nÃ¼r hale gelir.",
  "Star Logbook": "Star Logbook",
  "Corrections and useful phrases collect here after feedback begins.": "DÃ¼zeltmeler ve kullanÄ±ÅŸlÄ± ifadeler geri bildirim baÅŸladÄ±ktan sonra burada birikir.",
  "Entry Protocol": "Entry Protocol",
  "A pre-speaking ritual for posture, breath, and one clear first sentence.": "DuruÅŸ, nefes ve tek net ilk cÃ¼mle iÃ§in konuÅŸma Ã¶ncesi ritÃ¼el.",
  "Star Speaker is a private English speaking coaching system built around structure, correction, and daily voice practice.": "Star Speaker; yapÄ±, dÃ¼zeltme ve gÃ¼nlÃ¼k ses pratiÄŸi etrafÄ±nda kurulan Ã¶zel bir Ä°ngilizce konuÅŸma koÃ§luÄŸu sistemidir.",

  "The Star Speaker Method": "Star Speaker Metodu",
  "A structured speaking-first system that turns English from something you study into something you use.": "Ä°ngilizceyi sadece Ã§alÄ±ÅŸtÄ±ÄŸÄ±nÄ±z bir konu olmaktan Ã§Ä±karÄ±p, gerÃ§ekten kullandÄ±ÄŸÄ±nÄ±z bir beceriye dÃ¶nÃ¼ÅŸtÃ¼ren konuÅŸma odaklÄ± sistem.",
  "Built around pressure, safety, structure, daily output, and expert correction.": "BaskÄ±, gÃ¼ven, yapÄ±, gÃ¼nlÃ¼k Ã§Ä±ktÄ± ve uzman dÃ¼zeltmesi etrafÄ±nda kuruldu.",
  "Live Speaking Session": "CanlÄ± KonuÅŸma SeansÄ±",
  "Live": "CanlÄ±",
  "Today's Focus": "BugÃ¼nkÃ¼ Odak",
  "Voice Practice": "Ses PratiÄŸi",
  "Coach Feedback": "KoÃ§ Geri Bildirimi",
  "Great progress on fluency and clarity. Work on transitions and reducing fillers.": "AkÄ±cÄ±lÄ±k ve netlikte gÃ¼Ã§lÃ¼ ilerleme. GeÃ§iÅŸler ve dolgu ifadelerini azaltma Ã¼zerine Ã§alÄ±ÅŸÄ±n.",
  "Your Transformation Journey": "DÃ¶nÃ¼ÅŸÃ¼m YolculuÄŸunuz",
  "Four stages that move you from hesitation to confident communication.": "TereddÃ¼tten Ã¶zgÃ¼venli iletiÅŸime uzanan dÃ¶rt aÅŸama.",
  "We identify your current speaking level, goals, strengths, and hesitation points.": "Mevcut konuÅŸma seviyenizi, hedeflerinizi, gÃ¼Ã§lÃ¼ yÃ¶nlerinizi ve tereddÃ¼t noktalarÄ±nÄ±zÄ± belirleriz.",
  "Speaking level check": "KonuÅŸma seviyesi kontrolÃ¼",
  "Goal setting": "Hedef belirleme",
  "Personal roadmap": "KiÅŸisel yol haritasÄ±",
  "You enter a safe but active environment where speaking becomes unavoidable.": "KonuÅŸmanÄ±n kaÃ§Ä±nÄ±lmaz hale geldiÄŸi, gÃ¼venli ama aktif bir ortama girersiniz.",
  "Structured live practice": "YapÄ±landÄ±rÄ±lmÄ±ÅŸ canlÄ± pratik",
  "Guided speaking pressure": "Rehberli konuÅŸma baskÄ±sÄ±",
  "Safe correction": "GÃ¼venli dÃ¼zeltme",
  "Daily Voice Practice": "GÃ¼nlÃ¼k Ses PratiÄŸi",
  "You build consistency through short daily voice tasks and repeated output.": "KÄ±sa gÃ¼nlÃ¼k ses gÃ¶revleri ve tekrar eden Ã§Ä±ktÄ± ile sÃ¼reklilik geliÅŸtirirsiniz.",
  "Speaking rhythm": "KonuÅŸma ritmi",
  "Confidence through repetition": "Tekrarla Ã¶zgÃ¼ven",
  "Measurable Transformation": "Ã–lÃ§Ã¼lebilir DÃ¶nÃ¼ÅŸÃ¼m",
  "Your speaking becomes clearer, stronger, and easier to track.": "KonuÅŸmanÄ±z daha net, daha gÃ¼Ã§lÃ¼ ve daha kolay takip edilir hale gelir.",
  "Weekly feedback": "HaftalÄ±k geri bildirim",
  "Progress tracking": "Ä°lerleme takibi",
  "Real-world speaking confidence": "GerÃ§ek hayatta konuÅŸma Ã¶zgÃ¼veni",
  "The System Behind The Progress": "Ä°lerlemenin ArkasÄ±ndaki Sistem",
  "Star Speaker is built around output, correction, and repetition.": "Star Speaker; Ã§Ä±ktÄ±, dÃ¼zeltme ve tekrar Ã¼zerine kurulur.",
  "Short daily recordings turn English into an active habit, not a classroom memory.": "KÄ±sa gÃ¼nlÃ¼k kayÄ±tlar Ä°ngilizceyi sÄ±nÄ±f anÄ±sÄ± olmaktan Ã§Ä±karÄ±p aktif bir alÄ±ÅŸkanlÄ±ÄŸa dÃ¶nÃ¼ÅŸtÃ¼rÃ¼r.",
  "Live Speaking Sessions": "CanlÄ± KonuÅŸma SeanslarÄ±",
  "Students practice in structured sessions where speaking, interaction, and correction happen together.": "Ã–ÄŸrenciler konuÅŸma, etkileÅŸim ve dÃ¼zeltmenin birlikte gerÃ§ekleÅŸtiÄŸi yapÄ±landÄ±rÄ±lmÄ±ÅŸ seanslarda pratik yapar.",
  "Small speaking circles create accountability, peer interaction, and safe social pressure.": "KÃ¼Ã§Ã¼k konuÅŸma halkalarÄ± sorumluluk, akran etkileÅŸimi ve gÃ¼venli sosyal baskÄ± oluÅŸturur.",
  "Teacher Correction": "Ã–ÄŸretmen DÃ¼zeltmesi",
  "Students receive focused correction so mistakes become progress instead of fear.": "Ã–ÄŸrenciler odaklÄ± dÃ¼zeltme alÄ±r; bÃ¶ylece hatalar korku deÄŸil ilerleme haline gelir.",
  "Weekly Feedback": "HaftalÄ±k Geri Bildirim",
  "Each week gives students a clearer picture of what improved and what needs attention.": "Her hafta Ã¶ÄŸrenciye neyin geliÅŸtiÄŸini ve neye dikkat edilmesi gerektiÄŸini daha net gÃ¶sterir.",
  "Progress is made visible through consistency, performance, and speaking milestones.": "Ä°lerleme; sÃ¼reklilik, performans ve konuÅŸma kilometre taÅŸlarÄ±yla gÃ¶rÃ¼nÃ¼r hale gelir.",
  "Why It Works": "Neden Ä°ÅŸe Yarar?",
  "Confidence is not built by waiting until you feel ready.": "Ã–zgÃ¼ven, hazÄ±r hissetmeyi bekleyerek oluÅŸmaz.",
  "Confidence is built by speaking before you feel ready â€” inside the right structure.": "Ã–zgÃ¼ven, doÄŸru yapÄ± iÃ§inde hazÄ±r hissetmeden konuÅŸmaya baÅŸlayarak oluÅŸur.",
  "Pressure": "BaskÄ±",
  "Students need enough pressure to speak, participate, and show up.": "Ã–ÄŸrencilerin konuÅŸmasÄ±, katÄ±lmasÄ± ve istikrarlÄ± gÃ¶rÃ¼nmesi iÃ§in yeterli baskÄ±ya ihtiyacÄ± vardÄ±r.",
  "Safety": "GÃ¼ven",
  "Students need enough safety to make mistakes without shame or fear.": "Ã–ÄŸrencilerin utanmadan ve korkmadan hata yapabilecek kadar gÃ¼vene ihtiyacÄ± vardÄ±r.",
  "Students need a clear path, repeated tasks, and expert correction.": "Ã–ÄŸrencilerin net bir yola, tekrar eden gÃ¶revlere ve uzman dÃ¼zeltmesine ihtiyacÄ± vardÄ±r.",
  "â€œMistakes are allowed. Silence is not.â€": "â€œHata yapmak serbest. Sessiz kalmak deÄŸil.â€",
  "Not Normal English Lessons": "Normal Ä°ngilizce Dersleri DeÄŸil",
  "Traditional English courses compared with the Star Speaker Method": "Geleneksel Ä°ngilizce kurslarÄ± ile Star Speaker Metodu karÅŸÄ±laÅŸtÄ±rmasÄ±",
  "Traditional English Courses": "Geleneksel Ä°ngilizce KurslarÄ±",
  "Too much passive grammar": "Ã‡ok fazla pasif gramer",
  "Too little speaking pressure": "Ã‡ok az konuÅŸma baskÄ±sÄ±",
  "Random homework": "Rastgele Ã¶devler",
  "Progress feels unclear": "Ä°lerleme belirsiz hissedilir",
  "Students wait until they feel ready": "Ã–ÄŸrenciler hazÄ±r hissetmeyi bekler",
  "Speaking-first practice": "KonuÅŸma Ã¶ncelikli pratik",
  "Daily output and accountability": "GÃ¼nlÃ¼k Ã§Ä±ktÄ± ve sorumluluk",
  "Controlled immersion": "KontrollÃ¼ immersiyon",
  "Weekly correction and feedback": "HaftalÄ±k dÃ¼zeltme ve geri bildirim",
  "Confidence built through action": "Eylemle inÅŸa edilen Ã¶zgÃ¼ven",
  "Ready to start your Star Path?": "Star Path yolculuÄŸunuza baÅŸlamaya hazÄ±r mÄ±sÄ±nÄ±z?",
  "Choose your program or book a consultation to find the right level of structure, adaptation, and precision for your goals.": "Hedefleriniz iÃ§in doÄŸru yapÄ±, uyarlama ve hassasiyet seviyesini bulmak Ã¼zere programÄ±nÄ±zÄ± seÃ§in veya gÃ¶rÃ¼ÅŸme planlayÄ±n.",

  "Results & Student Stories": "SonuÃ§lar ve Ã–ÄŸrenci Hikayeleri",
  "We do not fake proof. Star Speaker tracks real speaking progress through voice logs, feedback, recordings, and visible milestones.": "KanÄ±tÄ± taklit etmeyiz. Star Speaker gerÃ§ek konuÅŸma geliÅŸimini ses kayÄ±tlarÄ±, geri bildirimler, kayÄ±tlar ve gÃ¶rÃ¼nÃ¼r kilometre taÅŸlarÄ±yla takip eder.",
  "Student stories will be added after the first transformation cycle.": "GerÃ§ek Ã¶ÄŸrenci hikayeleri, ilk dÃ¶nÃ¼ÅŸÃ¼m dÃ¶nemi tamamlandÄ±ktan sonra burada yer alacak.",
  "Speaking Journey": "KonuÅŸma YolculuÄŸu",
  "Start": "BaÅŸlangÄ±Ã§",
  "Building": "Beceri",
  "Skills": "Ä°nÅŸasÄ±",
  "Visible": "GÃ¶rÃ¼nÃ¼r",
  "Progress": "Ä°lerleme",
  "Confident": "Ã–zgÃ¼venli",
  "Expression": "Ä°fade",
  "Progress Over Time": "Zaman Ä°Ã§inde Ä°lerleme",
  "Week 1": "1. Hafta",
  "Week 2": "2. Hafta",
  "Week 3": "3. Hafta",
  "Week 4": "4. Hafta",
  "Week 5": "5. Hafta",
  "Week 6": "6. Hafta",
  "Before Recording": "Ã–n KayÄ±t",
  "After Recording": "Son KayÄ±t",
  "Teacher Feedback": "Ã–ÄŸretmen Geri Bildirimi",
  "Nice improvement in clarity and confidence. Keep practicing pauses and stress.": "Netlik ve Ã¶zgÃ¼vende gÃ¼zel geliÅŸim. Duraklamalar ve vurgu Ã¼zerine Ã§alÄ±ÅŸmaya devam edin.",
  "- Coach Elif S.": "- KoÃ§ Elif S.",
  "Key Improvements": "Temel GeliÅŸimler",
  "More Confident": "Daha Ã–zgÃ¼venli",
  "Clearer Ideas": "Daha Net Fikirler",
  "Better Flow": "Daha Ä°yi AkÄ±ÅŸ",
  "Stronger Pronunciation": "Daha GÃ¼Ã§lÃ¼ Telaffuz",
  "What We Track": "Neleri Takip Ederiz?",
  "Speaking Confidence": "KonuÅŸma Ã–zgÃ¼veni",
  "Clarity": "Netlik",
  "Fluency": "AkÄ±cÄ±lÄ±k",
  "Consistency": "SÃ¼reklilik",
  "Pronunciation": "Telaffuz",
  "Real-World Speaking Ability": "GerÃ§ek Hayatta KonuÅŸma Becerisi",
  "How Proof Is Collected": "KanÄ±t NasÄ±l ToplanÄ±r?",
  "We capture your baseline to understand your starting point.": "BaÅŸlangÄ±Ã§ noktanÄ±zÄ± anlamak iÃ§in temel seviyenizi kaydederiz.",
  "Weekly Voice Log": "HaftalÄ±k Voice Log",
  "Short voice logs show your growth one week at a time.": "KÄ±sa ses kayÄ±tlarÄ± geliÅŸiminizi hafta hafta gÃ¶sterir.",
  "You receive clear, personalized feedback after each log.": "Her kayÄ±ttan sonra net ve kiÅŸisel geri bildirim alÄ±rsÄ±nÄ±z.",
  "Progress Review": "Ä°lerleme DeÄŸerlendirmesi",
  "We review trends and milestones with you regularly.": "EÄŸilimleri ve kilometre taÅŸlarÄ±nÄ± sizinle dÃ¼zenli olarak deÄŸerlendiririz.",
  "You record again to see how far you have come.": "Ne kadar ilerlediÄŸinizi gÃ¶rmek iÃ§in yeniden kayÄ±t alÄ±rsÄ±nÄ±z.",
  "From Hesitation To Expression": "TereddÃ¼tten Ä°fadeye",
  "Before": "Ã–nce",
  "Hesitant": "TereddÃ¼tlÃ¼",
  "Silent": "Sessiz",
  "Translating in your head": "KafasÄ±nda Ã§eviri yapan",
  "Afraid of mistakes": "Hata yapmaktan Ã§ekinen",
  "After": "Sonra",
  "Clear": "Net",
  "Active": "Aktif",
  "Speaking more naturally": "Daha doÄŸal konuÅŸan",
  "Student Stories": "Ã–ÄŸrenci Hikayeleri",
  "Real student stories will appear here after the first cohort completes the system.": "GerÃ§ek Ã¶ÄŸrenci hikayeleri, ilk grup sistemi tamamladÄ±ktan sonra burada yer alacak.",
  "Start your transformation story.": "Kendi dÃ¶nÃ¼ÅŸÃ¼m hikayenizi baÅŸlatÄ±n.",
  "Join the system, build measurable speaking progress, and become one of the first Star Speaker success stories.": "Sisteme katÄ±lÄ±n, Ã¶lÃ§Ã¼lebilir konuÅŸma geliÅŸimi oluÅŸturun ve ilk Star Speaker baÅŸarÄ± hikayelerinden biri olun.",

  "About Star Speaker": "Star Speaker HakkÄ±nda",
  "Built for people who are tired of knowing English but not speaking it.": "Ä°ngilizce bildiÄŸi halde konuÅŸamayanlar iÃ§in tasarlandÄ±.",
  "Star Speaker is a premium speaking transformation system built around structure, realistic pressure, safety, and correction â€” so you can turn your English into real speaking output, consistently.": "Star Speaker; yapÄ±, gerÃ§ekÃ§i baskÄ±, gÃ¼ven ve dÃ¼zeltme etrafÄ±nda kurulan premium bir konuÅŸma dÃ¶nÃ¼ÅŸÃ¼m sistemidir. BÃ¶ylece Ä°ngilizcenizi tutarlÄ± biÃ§imde gerÃ§ek konuÅŸma Ã§Ä±ktÄ±sÄ±na dÃ¶nÃ¼ÅŸtÃ¼rebilirsiniz.",
  "Structured System": "YapÄ±landÄ±rÄ±lmÄ±ÅŸ Sistem",
  "Real Speaking Output": "GerÃ§ek KonuÅŸma Ã‡Ä±ktÄ±sÄ±",
  "Safe, Supportive Environment": "GÃ¼venli ve Destekleyici Ortam",
  "Built from a simple observation.": "Basit bir gÃ¶zlemden doÄŸdu.",
  "Many students study English for years. They know the rules, the words, and the grammar. But when it is time to speak, they freeze.": "BirÃ§ok Ã¶ÄŸrenci yÄ±llarca Ä°ngilizce Ã§alÄ±ÅŸÄ±r. KurallarÄ±, kelimeleri ve grameri bilir. Ama konuÅŸma anÄ± geldiÄŸinde donar.",
  "Not because they are lazy. Not because they are unintelligent.": "Tembel olduklarÄ± iÃ§in deÄŸil. Zeki olmadÄ±klarÄ± iÃ§in deÄŸil.",
  "Because most English education trains recognition, not real-time speaking.": "Ã‡Ã¼nkÃ¼ Ã§oÄŸu Ä°ngilizce eÄŸitimi gerÃ§ek zamanlÄ± konuÅŸmayÄ± deÄŸil, tanÄ±mayÄ± Ã¶ÄŸretir.",
  "Star Speaker was created to solve that gap.": "Star Speaker bu boÅŸluÄŸu kapatmak iÃ§in oluÅŸturuldu.",
  "The real problem is hesitation.": "AsÄ±l problem tereddÃ¼ttÃ¼r.",
  "You freeze when it is time to speak.": "KonuÅŸma zamanÄ± geldiÄŸinde donarsÄ±nÄ±z.",
  "You translate in your head instead of responding naturally.": "DoÄŸal cevap vermek yerine kafanÄ±zda Ã§eviri yaparsÄ±nÄ±z.",
  "You avoid mistakes instead of expressing.": "Kendinizi ifade etmek yerine hatalardan kaÃ§Ä±nÄ±rsÄ±nÄ±z.",
  "You need English for abroad, work, interviews, or university life.": "Yurt dÄ±ÅŸÄ±, iÅŸ, mÃ¼lakatlar veya Ã¼niversite hayatÄ± iÃ§in Ä°ngilizceye ihtiyacÄ±nÄ±z vardÄ±r.",
  "You need a system that makes speaking unavoidable â€” but safe.": "KonuÅŸmayÄ± kaÃ§Ä±nÄ±lmaz ama gÃ¼venli hale getiren bir sisteme ihtiyacÄ±nÄ±z vardÄ±r.",
  "What We Believe": "Neye Ä°nanÄ±yoruz?",
  "Voice over text.": "Metinden Ã¶nce ses.",
  "Output over passive study.": "Pasif Ã§alÄ±ÅŸmadan Ã¶nce Ã§Ä±ktÄ±.",
  "Structure over motivation.": "Motivasyondan Ã¶nce yapÄ±.",
  "Correction without shame.": "UtandÄ±rmadan dÃ¼zeltme.",
  "Pressure with safety.": "GÃ¼ven iÃ§inde baskÄ±.",
  "Visible progress, not vague confidence.": "Belirsiz Ã¶zgÃ¼ven deÄŸil, gÃ¶rÃ¼nÃ¼r ilerleme.",
  "Mistakes are allowed. Silence is not.": "Hata yapmak serbest. Sessiz kalmak deÄŸil.",
  "What Makes Star Speaker Different": "Star Speaker'Ä± FarklÄ± KÄ±lan Nedir?",
  "Short daily voice output builds consistency and confidence.": "KÄ±sa gÃ¼nlÃ¼k ses Ã§Ä±ktÄ±sÄ± sÃ¼reklilik ve Ã¶zgÃ¼ven oluÅŸturur.",
  "Live Speaking Practice": "CanlÄ± KonuÅŸma PratiÄŸi",
  "Students speak in structured sessions, not passive lectures.": "Ã–ÄŸrenciler pasif derslerde deÄŸil, yapÄ±landÄ±rÄ±lmÄ±ÅŸ seanslarda konuÅŸur.",
  "Small groups create accountability, interaction, and safe speaking pressure.": "KÃ¼Ã§Ã¼k gruplar sorumluluk, etkileÅŸim ve gÃ¼venli konuÅŸma baskÄ±sÄ± oluÅŸturur.",
  "Mistakes become progress through precise, respectful correction.": "Hatalar, hassas ve saygÄ±lÄ± dÃ¼zeltme ile ilerlemeye dÃ¶nÃ¼ÅŸÃ¼r.",
  "Students see progress through visible milestones and performance tracking.": "Ã–ÄŸrenciler gÃ¶rÃ¼nÃ¼r kilometre taÅŸlarÄ± ve performans takibiyle ilerlemeyi gÃ¶rÃ¼r.",
  "Spark, Star, and Super Star give different levels of structure, adaptation, and precision.": "Spark, Star ve Super Star; farklÄ± yapÄ±, uyarlama ve hassasiyet seviyeleri sunar.",
  "Built for ambitious learners with global goals.": "Global hedefleri olan hÄ±rslÄ± Ã¶ÄŸrenciler iÃ§in tasarlandÄ±.",
  "Students preparing to study abroad": "Yurt dÄ±ÅŸÄ±nda okumaya hazÄ±rlanan Ã¶ÄŸrenciler",
  "Private university prep students": "Ã–zel Ã¼niversite hazÄ±rlÄ±k Ã¶ÄŸrencileri",
  "Young professionals": "GenÃ§ profesyoneller",
  "IELTS / PTE / TOEFL speaking-focused students": "IELTS / PTE / TOEFL konuÅŸma odaklÄ± Ã¶ÄŸrenciler",
  "Shy but serious learners": "Ã‡ekingen ama ciddi Ã¶ÄŸrenciler",
  "The closest thing to living abroad â€” without leaving your country.": "Yurt dÄ±ÅŸÄ±na Ã§Ä±kmadan, yurt dÄ±ÅŸÄ±ndaymÄ±ÅŸ gibi Ä°ngilizce konuÅŸma deneyimi.",
  "A controlled English-speaking environment built around daily output, live interaction, correction, and visible progress.": "GÃ¼nlÃ¼k Ã§Ä±ktÄ±, canlÄ± etkileÅŸim, dÃ¼zeltme ve gÃ¶rÃ¼nÃ¼r ilerleme etrafÄ±nda kurulan kontrollÃ¼ bir Ä°ngilizce konuÅŸma ortamÄ±.",
  "Ready to become a Star Speaker?": "Star Speaker olmaya hazÄ±r mÄ±sÄ±nÄ±z?",
  "This is not another course. This is your speaking transformation.": "Bu baÅŸka bir kurs deÄŸil. Bu sizin konuÅŸma dÃ¶nÃ¼ÅŸÃ¼mÃ¼nÃ¼z.",

  "Practical tools. Real progress.": "Pratik araÃ§lar. GerÃ§ek ilerleme.",
  "Practical tools, prompts, and expert guides to help you stop studying passively and start speaking confidently in real life.": "Pasif Ã§alÄ±ÅŸmayÄ± bÄ±rakÄ±p gerÃ§ek hayatta daha Ã¶zgÃ¼venli konuÅŸmaya baÅŸlamanÄ±z iÃ§in pratik araÃ§lar, konuÅŸma promptlarÄ± ve uzman rehberleri.",
  "Speaking Guides": "KonuÅŸma Rehberleri",
  "Step-by-step guides to solve real speaking challenges.": "GerÃ§ek konuÅŸma zorluklarÄ±nÄ± Ã§Ã¶zmek iÃ§in adÄ±m adÄ±m rehberler.",
  "View all guides": "TÃ¼m rehberleri gÃ¶r",
  "How to Stop Translating in Your Head": "KafanÄ±zda Ã‡eviri YapmayÄ± NasÄ±l BÄ±rakÄ±rsÄ±nÄ±z?",
  "Break the habit of translation and start thinking in English.": "Ã‡eviri alÄ±ÅŸkanlÄ±ÄŸÄ±nÄ± kÄ±rÄ±n ve Ä°ngilizce dÃ¼ÅŸÃ¼nmeye baÅŸlayÄ±n.",
  "Read guide": "Rehberi oku",
  "How to Speak When You Feel Nervous": "Gerginken NasÄ±l KonuÅŸulur?",
  "Calm your mind, control anxiety, and speak with confidence.": "Zihninizi sakinleÅŸtirin, kaygÄ±yÄ± yÃ¶netin ve Ã¶zgÃ¼venle konuÅŸun.",
  "Study Abroad Speaking Guide": "Yurt DÄ±ÅŸÄ± KonuÅŸma Rehberi",
  "Essential English for universities, interviews, and daily life abroad.": "Ãœniversiteler, mÃ¼lakatlar ve yurt dÄ±ÅŸÄ±ndaki gÃ¼nlÃ¼k yaÅŸam iÃ§in gerekli Ä°ngilizce.",
  "Daily Confidence Guide": "GÃ¼nlÃ¼k Ã–zgÃ¼ven Rehberi",
  "Small daily actions to build a strong, steady speaking mindset.": "GÃ¼Ã§lÃ¼ ve istikrarlÄ± bir konuÅŸma zihniyeti iÃ§in kÃ¼Ã§Ã¼k gÃ¼nlÃ¼k adÄ±mlar.",
  "Free Speaking Prompts": "Ãœcretsiz KonuÅŸma PromptlarÄ±",
  "Practice with real-life prompts designed for confidence.": "Ã–zgÃ¼ven iÃ§in tasarlanmÄ±ÅŸ gerÃ§ek hayat promptlarÄ±yla pratik yapÄ±n.",
  "View all prompts": "TÃ¼m promptlarÄ± gÃ¶r",
  "7-Day Speaking Prompt Pack": "7 GÃ¼nlÃ¼k KonuÅŸma Prompt Paketi",
  "A week of daily prompts to build fluency and momentum.": "AkÄ±cÄ±lÄ±k ve ivme kazanmak iÃ§in bir haftalÄ±k gÃ¼nlÃ¼k promptlar.",
  "Start practicing": "PratiÄŸe baÅŸla",
  "Study Abroad Prompts": "Yurt DÄ±ÅŸÄ± PromptlarÄ±",
  "Real scenarios for campus life, culture, and daily needs.": "KampÃ¼s hayatÄ±, kÃ¼ltÃ¼r ve gÃ¼nlÃ¼k ihtiyaÃ§lar iÃ§in gerÃ§ek senaryolar.",
  "Interview English Prompts": "MÃ¼lakat Ä°ngilizcesi PromptlarÄ±",
  "Common questions and smart answers for any interview.": "Her mÃ¼lakat iÃ§in yaygÄ±n sorular ve gÃ¼Ã§lÃ¼ cevaplar.",
  "Confidence Voice Prompts": "Ã–zgÃ¼ven Ses PromptlarÄ±",
  "Build your voice, clarity, and natural expression.": "Sesinizi, netliÄŸinizi ve doÄŸal ifadenizi geliÅŸtirin.",
  "Student Tools": "Ã–ÄŸrenci AraÃ§larÄ±",
  "Helpful tools to guide your next step.": "Bir sonraki adÄ±mÄ±nÄ±zÄ± netleÅŸtiren yardÄ±mcÄ± araÃ§lar.",
  "View all": "TÃ¼mÃ¼nÃ¼ gÃ¶r",
  "Take the Speaking Placement Test": "KonuÅŸma Seviye Tespit Testini Al",
  "Identify your level and get a clear roadmap.": "Seviyenizi belirleyin ve net bir yol haritasÄ± alÄ±n.",
  "Take test": "Testi al",
  "Apply for Consultation": "GÃ¶rÃ¼ÅŸme Ä°Ã§in BaÅŸvur",
  "Book a 1-on-1 consultation with our experts.": "UzmanlarÄ±mÄ±zla bire bir gÃ¶rÃ¼ÅŸme planlayÄ±n.",
  "Apply now": "Åžimdi baÅŸvur",
  "Explore structured programs for every goal.": "Her hedefe uygun yapÄ±landÄ±rÄ±lmÄ±ÅŸ programlarÄ± keÅŸfedin.",
  "View programs": "ProgramlarÄ± gÃ¶r",
  "Learn the Method": "Metodu Ã–ÄŸrenin",
  "Discover the Star Speaker speaking system.": "Star Speaker konuÅŸma sistemini keÅŸfedin.",
  "Explore method": "Metodu keÅŸfet",
  "Coming Soon Library": "YakÄ±nda Gelecek KÃ¼tÃ¼phane",
  "New resources are on the way.": "Yeni kaynaklar hazÄ±rlanÄ±yor.",
  "Pronunciation Mini-Lessons": "Telaffuz Mini Dersleri",
  "Short lessons to improve clarity and natural pronunciation.": "NetliÄŸi ve doÄŸal telaffuzu geliÅŸtiren kÄ±sa dersler.",
  "Coming soon": "YakÄ±nda",
  "IELTS / PTE / TOEFL Support": "IELTS / PTE / TOEFL DesteÄŸi",
  "Targeted strategies and model answers for test success.": "SÄ±nav baÅŸarÄ±sÄ± iÃ§in hedefli stratejiler ve Ã¶rnek cevaplar.",
  "Study Abroad Toolkit": "Yurt DÄ±ÅŸÄ± AraÃ§ Seti",
  "Checklists, templates, and guides for your journey abroad.": "Yurt dÄ±ÅŸÄ± yolculuÄŸunuz iÃ§in kontrol listeleri, ÅŸablonlar ve rehberler.",
  "Daily Voice Log Examples": "Daily Voice Log Ã–rnekleri",
  "Real student logs to shape your own progress.": "Kendi ilerlemenizi ÅŸekillendirmek iÃ§in gerÃ§ek Ã¶ÄŸrenci loglarÄ±.",
  "Get expert guidance, a clear plan, and real progress that lasts.": "Uzman rehberliÄŸi, net bir plan ve kalÄ±cÄ± gerÃ§ek ilerleme kazanÄ±n.",
  "Trusted by students who want more than a classroom": "Bir sÄ±nÄ±ftan fazlasÄ±nÄ± isteyen Ã¶ÄŸrencilerin tercihi",

  "Private Student Access": "Ã–zel Ã–ÄŸrenci EriÅŸimi",
  "Student Login": "Ã–ÄŸrenci GiriÅŸi",
  "Access is available only for accepted Star Speaker students.": "EriÅŸim yalnÄ±zca kabul edilen Star Speaker Ã¶ÄŸrencileri iÃ§indir.",
  "Use the email and password created for your Star Speaker student account.": "Star Speaker Ã¶ÄŸrenci hesabÄ±nÄ±z iÃ§in oluÅŸturulan e-posta ve ÅŸifreyi kullanÄ±n.",
  "Password": "Åžifre",
  "Forgot password?": "Åžifrenizi mi unuttunuz?",
  "Not accepted yet? Apply for a consultation first.": "HenÃ¼z kabul edilmediniz mi? Ã–nce gÃ¶rÃ¼ÅŸme iÃ§in baÅŸvurun.",
  "Apply for Consultation": "GÃ¶rÃ¼ÅŸme Ä°Ã§in BaÅŸvur",
  "Reset Your Password": "Åžifrenizi Yenileyin",
  "Create a new password for your Star Speaker student account.": "Star Speaker Ã¶ÄŸrenci hesabÄ±nÄ±z iÃ§in yeni bir ÅŸifre oluÅŸturun.",
  "Checking recovery link...": "Åžifre yenileme baÄŸlantÄ±sÄ± kontrol ediliyor...",
  "New Password": "Yeni Åžifre",
  "Confirm New Password": "Yeni Åžifreyi Onayla",
  "Update Password": "Åžifreyi GÃ¼ncelle",
  "This password recovery link is invalid or expired. Please request a new link from the login page.": "Bu ÅŸifre yenileme baÄŸlantÄ±sÄ± geÃ§ersiz veya sÃ¼resi dolmuÅŸ. LÃ¼tfen giriÅŸ sayfasÄ±ndan yeni bir baÄŸlantÄ± talep edin.",
  "Back to Login": "GiriÅŸ SayfasÄ±na DÃ¶n",
  "Student Workspace": "Ã–ÄŸrenci AlanÄ±",
  "Workspace": "Ã–ÄŸrenci AlanÄ±",
  "Welcome back.": "Tekrar hoÅŸ geldin.",
  "Checking your private Star Speaker access.": "Ã–zel Star Speaker eriÅŸiminiz kontrol ediliyor.",
  "Your speaking workspace is ready.": "KonuÅŸma Ã§alÄ±ÅŸma alanÄ±n hazÄ±r.",
  "Checking": "Kontrol",
  "Dashboard": "Panel",
  "My Sessions": "GÃ¶rÃ¼ÅŸmelerim",
  "Voice Log": "Ses GÃ¼nlÃ¼ÄŸÃ¼",
  "Notes": "Notlar",
  "Profile": "Profil",
  "Need Help?": "YardÄ±ma mÄ± ihtiyacÄ±nÄ±z var?",
  "Day Streak": "GÃ¼nlÃ¼k Seri",
  "Start with your first speaking practice.": "Ä°lk konuÅŸma pratiÄŸinle baÅŸla.",
  "Home": "Ana Sayfa",
  "Sessions": "GÃ¶rÃ¼ÅŸmeler",
  "Voice": "Ses",
  "Program": "Program",
  "Current Week": "Mevcut Hafta",
  "Focus": "Odak",
  "Status": "Durum",
  "Active": "Aktif",
  "Your Weekly Practice": "HaftalÄ±k PratiÄŸin",
  "0 / 7 tasks completed": "0 / 7 gÃ¶rev tamamlandÄ±",
  "Complete one speaking practice each day.": "Her gÃ¼n bir konuÅŸma pratiÄŸi tamamla.",
  "Mon": "Pzt",
  "Tue": "Sal",
  "Wed": "Ã‡ar",
  "Thu": "Per",
  "Fri": "Cum",
  "Sat": "Cmt",
  "Sun": "Paz",
  "0 / 1 Task": "0 / 1 GÃ¶rev",
  "Not submitted": "GÃ¶nderilmedi",
  "Today's Task": "BugÃ¼nÃ¼n GÃ¶revi",
  "No task assigned yet.": "HenÃ¼z gÃ¶rev atanmadÄ±.",
  "Your coach will assign your first speaking task soon.": "KoÃ§un ilk konuÅŸma gÃ¶revini yakÄ±nda atayacak.",
  "Start Task": "GÃ¶reve BaÅŸla",
  "Daily Voice Log": "Ses GÃ¼nlÃ¼ÄŸÃ¼",
  "No voice submission yet.": "HenÃ¼z ses kaydÄ± yok.",
  "Your recordings will appear here after you submit practice.": "Pratik gÃ¶nderdikten sonra kayÄ±tlarÄ±n burada gÃ¶rÃ¼necek.",
  "Record": "Kaydet",
  "Upcoming Session": "YaklaÅŸan Seans",
  "No session scheduled yet.": "HenÃ¼z gÃ¶rÃ¼ÅŸme planlanmadÄ±.",
  "Your coach will confirm your next session soon.": "KoÃ§un bir sonraki gÃ¶rÃ¼ÅŸmeni yakÄ±nda onaylayacak.",
  "Teacher Feedback": "Ã–ÄŸretmen Geri Bildirimi",
  "No feedback yet.": "HenÃ¼z geri bildirim yok.",
  "Your feedback will appear after your first submission is reviewed.": "Ä°lk gÃ¶nderin incelendikten sonra geri bildirimin burada gÃ¶rÃ¼necek.",
  "Your profile is being prepared.": "Profiliniz hazÄ±rlanÄ±yor.",
  "Logout": "Ã‡Ä±kÄ±ÅŸ Yap",

  "Apply / Consultation": "BaÅŸvuru / GÃ¶rÃ¼ÅŸme",
  "Tell us your speaking goal, current level, and what is holding you back. We will recommend the right Star Path for you.": "KonuÅŸma hedefinizi, mevcut seviyenizi ve sizi en Ã§ok zorlayan noktayÄ± bizimle paylaÅŸÄ±n. Size en uygun Star Path Ã¶nerisini sunalÄ±m.",
  "Private. Clear. Speaking-focused.": "Ã–zel. Net. KonuÅŸma odaklÄ±.",
  "Start Application": "BaÅŸvuruya BaÅŸla",
  "Private Review": "Ã–zel Ä°nceleme",
  "Speaking Goal Focus": "KonuÅŸma Hedefi OdaÄŸÄ±",
  "Parent-Friendly": "Veli Dostu",
  "Clear Recommendation": "Net Ã–neri",
  "Private Application": "Ã–zel BaÅŸvuru",
  "Tell us where speaking feels blocked.": "KonuÅŸmada nerede takÄ±ldÄ±ÄŸÄ±nÄ±zÄ± anlatÄ±n.",
  "Full Name": "Ad Soyad",
  "WhatsApp Number": "WhatsApp NumarasÄ±",
  "Email": "E-posta",
  "Current English Level": "Mevcut Ä°ngilizce Seviyesi",
  "Select your level": "Seviyenizi seÃ§in",
  "A1 Beginner": "A1 BaÅŸlangÄ±Ã§",
  "A2 Elementary": "A2 Temel",
  "B1 Intermediate": "B1 Orta",
  "B2 Upper-Intermediate": "B2 Orta ÃœstÃ¼",
  "C1 Advanced": "C1 Ä°leri",
  "Not sure": "Emin deÄŸilim",
  "Main Goal": "Ana Hedef",
  "Select your main goal": "Ana hedefinizi seÃ§in",
  "Study abroad": "Yurt dÄ±ÅŸÄ± eÄŸitim",
  "University prep school": "Ãœniversite hazÄ±rlÄ±k",
  "Work / career growth": "Ä°ÅŸ / kariyer geliÅŸimi",
  "IELTS / PTE / TOEFL": "IELTS / PTE / TOEFL",
  "Speaking confidence": "KonuÅŸma Ã¶zgÃ¼veni",
  "Other": "DiÄŸer",
  "Preferred Program": "Tercih Edilen Program",
  "Select preferred program": "Tercih ettiÄŸiniz programÄ± seÃ§in",
  "Biggest Speaking Problem": "En BÃ¼yÃ¼k KonuÅŸma ZorluÄŸu",
  "How Soon Do You Want to Start?": "Ne Zaman BaÅŸlamak Ä°stiyorsunuz?",
  "Select an option": "Bir seÃ§enek seÃ§in",
  "Immediately": "Hemen",
  "Within 1 week": "1 hafta iÃ§inde",
  "Within 2-4 weeks": "2â€“4 hafta iÃ§inde",
  "Later": "Daha sonra",
  "Book Your Consultation": "GÃ¶rÃ¼ÅŸme Saatinizi SeÃ§in",
  "Choose your preferred consultation window.": "Size uygun gÃ¶rÃ¼ÅŸme aralÄ±ÄŸÄ±nÄ± seÃ§in.",
  "Choose your preferred consultation window. We will review your application and confirm the final time by WhatsApp.": "Size uygun gÃ¶rÃ¼ÅŸme aralÄ±ÄŸÄ±nÄ± seÃ§in. BaÅŸvurunuzu inceleyip son saati WhatsApp Ã¼zerinden onaylayacaÄŸÄ±z.",
  "Preferred Consultation Window": "Tercih Edilen GÃ¶rÃ¼ÅŸme AralÄ±ÄŸÄ±",
  "Morning": "Sabah",
  "Afternoon": "Ã–ÄŸleden Sonra",
  "Evening": "AkÅŸam",
  "Selected times are preferred windows. Final confirmation will be sent after review.": "SeÃ§ilen saatler tercih edilen aralÄ±klardÄ±r. Son onay incelemeden sonra gÃ¶nderilecektir.",
  "Preferred Date": "Tercih Edilen Tarih",
  "You can select a date up to 30 days in advance.": "30 gÃ¼n sonrasÄ±na kadar tarih seÃ§ebilirsiniz.",
  "Consultation Language": "GÃ¶rÃ¼ÅŸme Dili",
  "Choose the language for your consultation.": "GÃ¶rÃ¼ÅŸme dilinizi seÃ§in.",
  "Continue Application": "BaÅŸvuruya Devam Et",
  "Your information is private and secure.": "Bilgileriniz gizli ve gÃ¼vendedir.",
  "Your information is private and secure. We never share your data.": "Bilgileriniz gizli ve gÃ¼vendedir. Verilerinizi asla paylaÅŸmayÄ±z.",
  "Preferred Consultation Language": "GÃ¶rÃ¼ÅŸme Dili Tercihi",
  "Choose the language that helps us understand you best.": "Sizi en iyi ÅŸekilde anlayabilmemiz iÃ§in gÃ¶rÃ¼ÅŸme dilinizi seÃ§in.",
  "Turkish": "TÃ¼rkÃ§e",
  "Clear explanation and comfort": "Net aÃ§Ä±klama ve rahatlÄ±k",
  "Explanation in Turkish": "TÃ¼rkÃ§e aÃ§Ä±klama",
  "English": "Ä°ngilizce",
  "Show your level directly": "Seviyenizi doÄŸrudan gÃ¶sterin",
  "Explanation in English": "Ä°ngilizce aÃ§Ä±klama",
  "Hybrid": "Hibrit",
  "Turkish explanation + short English speaking check": "TÃ¼rkÃ§e aÃ§Ä±klama + kÄ±sa Ä°ngilizce konuÅŸma kontrolÃ¼",
  "Both languages": "Ä°ki dil birlikte",
  "Short Message": "KÄ±sa Mesaj",
  "(Optional)": "(Ä°steÄŸe BaÄŸlÄ±)",
  "Submit Application": "BaÅŸvuruyu GÃ¶nder",
  "What Happens Next": "Sonra Ne Olur?",
  "Submit Application": "BaÅŸvuruyu GÃ¶nder",
  "Share your goals, level, and what is holding you back.": "Hedeflerinizi, seviyenizi ve sizi zorlayan noktayÄ± paylaÅŸÄ±n.",
  "We Review Your Goals": "Hedeflerinizi Ä°nceleriz",
  "Our team carefully reviews your information privately.": "Ekibimiz bilgilerinizi gizlilikle ve dikkatle inceler.",
  "Consultation & Recommendation": "GÃ¶rÃ¼ÅŸme ve Ã–neri",
  "We schedule your consultation and recommend the right Star Path.": "GÃ¶rÃ¼ÅŸmenizi planlar ve size uygun Star Path Ã¶nerisini sunarÄ±z.",
  "Begin Your Star Path": "Star Path YolculuÄŸunuza BaÅŸlayÄ±n",
  "You start your personalized speaking transformation with confidence.": "KiÅŸiselleÅŸtirilmiÅŸ konuÅŸma dÃ¶nÃ¼ÅŸÃ¼mÃ¼nÃ¼ze gÃ¼venle baÅŸlarsÄ±nÄ±z.",
  "Why This Consultation Helps": "Bu GÃ¶rÃ¼ÅŸme Neden YardÄ±mcÄ± Olur?",
  "Private Conversation": "Ã–zel GÃ¶rÃ¼ÅŸme",
  "Your information and goals are kept completely private and secure.": "Bilgileriniz ve hedefleriniz tamamen gizli ve gÃ¼vende tutulur.",
  "Speaking-Level Insight": "KonuÅŸma Seviyesi Ä°Ã§gÃ¶rÃ¼sÃ¼",
  "We understand your current speaking level and identify real gaps.": "Mevcut konuÅŸma seviyenizi anlar ve gerÃ§ek boÅŸluklarÄ± belirleriz.",
  "Program Match": "Program EÅŸleÅŸtirme",
  "We recommend the program that fits your goal, time, and learning style.": "Hedefinize, zamanÄ±nÄ±za ve Ã¶ÄŸrenme stilinize uygun programÄ± Ã¶neririz.",
  "No Pressure": "BaskÄ± Yok",
  "This is a friendly consultation. You decide what is best for you.": "Bu dostane bir gÃ¶rÃ¼ÅŸmedir. Sizin iÃ§in en doÄŸru kararÄ± siz verirsiniz.",
  "Your speaking transformation can start with one clear step.": "KonuÅŸma dÃ¶nÃ¼ÅŸÃ¼mÃ¼nÃ¼z tek net adÄ±mla baÅŸlayabilir.",
  "Â© 2026 Star Speaker. All rights reserved.": "Â© 2026 Star Speaker. TÃ¼m haklarÄ± saklÄ±dÄ±r.",
  "Privacy Policy": "Gizlilik PolitikasÄ±",
  "Terms of Use": "KullanÄ±m ÅžartlarÄ±",
};

const attrTr = {
  "Star Speaker private English speaking coaching for confident, global communication.": "Star Speaker ile Ã¶zgÃ¼venli ve global iletiÅŸim iÃ§in Ã¶zel Ä°ngilizce konuÅŸma koÃ§luÄŸu.",
  "Explore Star Speaker programs: Spark, Star, and Super Star private English speaking coaching paths.": "Spark, Star ve Super Star programlarÄ±yla Star Speaker Ã¶zel Ä°ngilizce konuÅŸma koÃ§luÄŸu yollarÄ±nÄ± keÅŸfedin.",
  "The Star Speaker Method: a speaking-first immersion system built around pressure, safety, structure, daily output, and expert correction.": "Star Speaker Metodu: baskÄ±, gÃ¼ven, yapÄ±, gÃ¼nlÃ¼k Ã§Ä±ktÄ± ve uzman dÃ¼zeltmesi etrafÄ±nda kurulan konuÅŸma odaklÄ± immersiyon sistemi.",
  "Star Speaker Results and Student Stories: an honest view of how speaking progress is tracked through voice logs, recordings, feedback, and milestones.": "Star Speaker SonuÃ§lar ve Ã–ÄŸrenci Hikayeleri: konuÅŸma geliÅŸiminin ses kayÄ±tlarÄ±, geri bildirimler ve kilometre taÅŸlarÄ±yla nasÄ±l takip edildiÄŸine dÃ¼rÃ¼st bir bakÄ±ÅŸ.",
  "About Star Speaker: a premium English speaking transformation system built around structure, speaking output, safety, daily practice, and precise correction.": "Star Speaker hakkÄ±nda: yapÄ±, konuÅŸma Ã§Ä±ktÄ±sÄ±, gÃ¼ven, gÃ¼nlÃ¼k pratik ve hassas dÃ¼zeltme etrafÄ±nda kurulan premium Ä°ngilizce konuÅŸma dÃ¶nÃ¼ÅŸÃ¼m sistemi.",
  "Apply for a Star Speaker consultation and receive a clear recommendation for the right speaking transformation path.": "Star Speaker gÃ¶rÃ¼ÅŸmeniz iÃ§in baÅŸvurun ve doÄŸru konuÅŸma dÃ¶nÃ¼ÅŸÃ¼mÃ¼ yolu iÃ§in net bir Ã¶neri alÄ±n.",
  "Student login for accepted Star Speaker students.": "Kabul edilen Star Speaker Ã¶ÄŸrencileri iÃ§in Ã¶ÄŸrenci giriÅŸi.",
  "Private Star Speaker student workspace.": "Ã–zel Star Speaker Ã¶ÄŸrenci Ã§alÄ±ÅŸma alanÄ±.",
  "Reset your Star Speaker student account password.": "Star Speaker Ã¶ÄŸrenci hesabÄ±nÄ±zÄ±n ÅŸifresini yenileyin.",
  "Primary navigation": "Ana navigasyon",
  "Star Speaker homepage": "Star Speaker ana sayfasÄ±",
  "Open navigation menu": "Navigasyon menÃ¼sÃ¼nÃ¼ aÃ§",
  "Close navigation menu": "Navigasyon menÃ¼sÃ¼nÃ¼ kapat",
  "Language selector": "Dil seÃ§ici",
  "Hero actions": "Ana bÃ¶lÃ¼m eylemleri",
  "Star Speaker value pillars": "Star Speaker deÄŸerleri",
  "A private English speaking lesson on a laptop in a warm study setting": "SÄ±cak bir Ã§alÄ±ÅŸma ortamÄ±nda dizÃ¼stÃ¼ bilgisayarda Ã¶zel Ä°ngilizce konuÅŸma dersi",
  "Five star rating": "BeÅŸ yÄ±ldÄ±z deÄŸerlendirme",
  "Expected outcomes": "Beklenen sonuÃ§lar",
  "Spark highlights": "Spark Ã¶ne Ã§Ä±kanlar",
  "Star highlights": "Star Ã¶ne Ã§Ä±kanlar",
  "Super Star highlights": "Super Star Ã¶ne Ã§Ä±kanlar",
  "Programs page footer": "Programlar sayfasÄ± alt bÃ¶lÃ¼mÃ¼",
  "Visual overview of a Star Speaker speaking session": "Star Speaker konuÅŸma seansÄ±nÄ±n gÃ¶rsel Ã¶zeti",
  "Progress 78 percent": "YÃ¼zde 78 ilerleme",
  "Legal links": "Yasal baÄŸlantÄ±lar",
  "Student story status": "Ã–ÄŸrenci hikayesi durumu",
  "Progress evidence visual": "Ä°lerleme kanÄ±tÄ± gÃ¶rseli",
  "Star Speaker values": "Star Speaker deÄŸerleri",
  "Premium Star Speaker desk scene": "Premium Star Speaker Ã§alÄ±ÅŸma masasÄ± sahnesi",
  "A premium Star Speaker desk scene with a laptop, lamp, notebook, mug, and wall plaque.": "Laptop, lamba, defter, kupa ve duvar tabelasÄ± bulunan premium Star Speaker Ã§alÄ±ÅŸma masasÄ± sahnesi.",
  "Premium Star Speaker resource desk with prompt cards, notebook, mug, and laptop": "Prompt kartlarÄ±, defter, kupa ve laptop bulunan premium Star Speaker kaynak masasÄ±",
  "About Star Speaker details": "Star Speaker hakkÄ±nda detaylar",
  "Star Speaker promise": "Star Speaker vaadi",
  "Apply page actions": "BaÅŸvuru sayfasÄ± eylemleri",
  "Consultation benefits": "GÃ¶rÃ¼ÅŸme faydalarÄ±",
  "Enter your full name": "Ad soyadÄ±nÄ±zÄ± yazÄ±n",
  "you@example.com": "ornek@eposta.com",
  "Enter your password": "Åžifrenizi yazÄ±n",
  "Enter new password": "Yeni ÅŸifrenizi yazÄ±n",
  "Confirm new password": "Yeni ÅŸifrenizi onaylayÄ±n",
  "What is the biggest challenge holding you back?": "Sizi en Ã§ok zorlayan konuÅŸma problemi nedir?",
  "Anything else you would like to share with us?": "Bizimle paylaÅŸmak istediÄŸiniz baÅŸka bir ÅŸey var mÄ±?",
};

function normalizeText(value) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPageKey() {
  const name = window.location.pathname.split("/").pop() || "index.html";
  if (name === "index.html") return "home";
  if (name === "programs.html" || name === "program.html") return "programs";
  if (name === "method.html") return "method";
  if (name === "results.html") return "results";
  if (name === "about.html") return "about";
  if (name === "resources.html") return "resources";
  if (name === "apply.html") return "apply";
  if (name === "level-test.html") return "levelTest";
  if (name === "login.html") return "login";
  if (name === "student-workspace.html") return "workspace";
  if (name === "reset-password.html") return "resetPassword";
  return "home";
}

function getInitialLanguage() {
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  if (queryLanguage === "tr" || queryLanguage === "en") {
    localStorage.setItem(languageStorageKey, queryLanguage);
    return queryLanguage;
  }

  const storedLanguage = localStorage.getItem(languageStorageKey);
  return storedLanguage === "tr" ? "tr" : "en";
}

let currentLanguage = getInitialLanguage();

function getOriginalAttr(element, attr) {
  const existing = originalAttrs.get(element) || {};
  if (!(attr in existing)) {
    existing[attr] = element.getAttribute(attr) || "";
    originalAttrs.set(element, existing);
  }
  return existing[attr];
}

function getOriginalElementValue(element, type) {
  const existing = originalElements.get(element) || {};
  if (!(type in existing)) {
    existing[type] = type === "html" ? element.innerHTML : element.textContent;
    originalElements.set(element, existing);
  }
  return existing[type];
}

function setElementTranslation(selector, type, value, lang) {
  document.querySelectorAll(selector).forEach((element) => {
    const original = getOriginalElementValue(element, type);
    if (type === "html") {
      element.innerHTML = lang === "tr" ? value : original;
    } else {
      element.textContent = lang === "tr" ? value : original;
    }
  });
}

function applySelectorTranslations(lang) {
  const pageKey = getPageKey();
  const groups = [
    ...(selectorTranslationsTr.common || []),
    ...(selectorTranslationsTr[pageKey] || []),
  ];

  groups.forEach(([selector, type, value]) => setElementTranslation(selector, type, value, lang));
}

function translateTextNodes(lang) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "SVG"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }

      return normalizeText(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    if (!originalTextNodes.has(node)) {
      originalTextNodes.set(node, node.nodeValue);
    }

    const original = originalTextNodes.get(node);
    const key = normalizeText(original);
    const translated = textTr[key];
    if (lang === "tr" && translated) {
      const leading = original.match(/^\s*/)?.[0] || "";
      const trailing = original.match(/\s*$/)?.[0] || "";
      node.nodeValue = `${leading}${translated}${trailing}`;
    } else if (lang === "en") {
      node.nodeValue = original;
    }
  });
}

function translateAttributes(lang) {
  const attrs = ["placeholder", "aria-label", "alt", "title", "content"];
  document.querySelectorAll("*").forEach((element) => {
    attrs.forEach((attr) => {
      if (!element.hasAttribute(attr)) {
        return;
      }

      const original = getOriginalAttr(element, attr);
      const translated = attrTr[normalizeText(original)];
      element.setAttribute(attr, lang === "tr" && translated ? translated : original);
    });
  });
}

function updateMeta(lang) {
  const pageKey = getPageKey();
  const originalTitle = getOriginalAttr(document.documentElement, "data-title") || document.title;
  if (!document.documentElement.hasAttribute("data-title")) {
    document.documentElement.setAttribute("data-title", originalTitle);
  }

  const meta = document.querySelector('meta[name="description"]');
  const metaOriginal = meta ? getOriginalAttr(meta, "content") : "";

  if (lang === "tr" && pageMetaTr[pageKey]) {
    document.title = pageMetaTr[pageKey].title;
    meta?.setAttribute("content", pageMetaTr[pageKey].description);
  } else {
    document.title = document.documentElement.getAttribute("data-title") || originalTitle;
    if (meta) {
      meta.setAttribute("content", metaOriginal);
    }
  }
}

function updateLanguageLinks(lang) {
  const pageName = window.location.pathname.split("/").pop() || "index.html";
  languageLinks.forEach((link) => {
    const linkLanguage = normalizeText(link.textContent).toLowerCase() === "tr" ? "tr" : "en";
    const isActive = linkLanguage === lang;
    link.classList.toggle("active", isActive);
    link.setAttribute("href", linkLanguage === "tr" ? `${pageName}?lang=tr` : pageName);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function applyLanguage(lang) {
  currentLanguage = lang === "tr" ? "tr" : "en";
  localStorage.setItem(languageStorageKey, currentLanguage);
  document.documentElement.lang = currentLanguage;
  updateMeta(currentLanguage);
  applySelectorTranslations(currentLanguage);
  translateTextNodes(currentLanguage);
  translateAttributes(currentLanguage);
  updateLanguageLinks(currentLanguage);
  setMenu(document.body.classList.contains("nav-open"));
  window.dispatchEvent(new CustomEvent("starSpeakerLanguageChange", { detail: { language: currentLanguage } }));
}

window.starSpeakerI18n = {
  getLanguage: () => currentLanguage,
  getFormMessages: () => i18n[currentLanguage].form,
  setLanguage: applyLanguage,
};

languageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const nextLanguage = normalizeText(link.textContent).toLowerCase() === "tr" ? "tr" : "en";
    applyLanguage(nextLanguage);
  });
});

function setMenu(open) {
  document.body.classList.toggle("nav-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  menuButton?.setAttribute("aria-label", open ? i18n[currentLanguage].menuClose : i18n[currentLanguage].menuOpen);
}

menuButton?.addEventListener("click", () => {
  setMenu(!document.body.classList.contains("nav-open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

document.addEventListener("click", (event) => {
  if (!document.body.classList.contains("nav-open")) {
    return;
  }

  const target = event.target;
  if (target instanceof Node && !navMenu?.contains(target) && !menuButton?.contains(target)) {
    setMenu(false);
  }
});

applyLanguage(currentLanguage);

const transitionPages = new Set([
  "index.html",
  "program.html",
  "programs.html",
  "method.html",
  "results.html",
  "about.html",
  "resources.html",
  "apply.html",
  "level-test.html",
  "login.html",
  "student-workspace.html",
  "reset-password.html",
]);
const transitionKey = "starSpeakerPageTransition";
const transitionAsset = "public/assets/icons/star-transition-emblem.png";
const transitionDuration = 1350;
const transitionSettleDuration = 520;
const transitionReducedDuration = 180;

function getPageName(url) {
  const name = url.pathname.split("/").pop();
  return name || "index.html";
}

function prefersReducedTransition() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function createPageTransition() {
  const existing = document.querySelector(".page-transition");
  if (existing) {
    return existing;
  }

  const overlay = document.createElement("div");
  overlay.className = "page-transition";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="page-transition__dust" aria-hidden="true">
      <span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span>
    </div>
    <div class="page-transition__orbital" aria-hidden="true"></div>
    <div class="page-transition__emblem-wrap" aria-hidden="true">
      <img class="page-transition__emblem" src="${transitionAsset}" alt="">
      <span class="page-transition__sweep" aria-hidden="true"></span>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function shouldUsePageTransition(link, event) {
  if (!(link instanceof HTMLAnchorElement)) {
    return null;
  }

  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }

  if (link.closest(".language-toggle")) {
    return null;
  }

  if (link.target && link.target !== "_self") {
    return null;
  }

  if (link.hasAttribute("download")) {
    return null;
  }

  const rawHref = link.getAttribute("href");
  if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
    return null;
  }

  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(link.href, window.location.href);

  if (!["file:", "http:", "https:"].includes(targetUrl.protocol)) {
    return null;
  }

  if (targetUrl.protocol !== currentUrl.protocol) {
    return null;
  }

  if (targetUrl.protocol !== "file:" && targetUrl.origin !== currentUrl.origin) {
    return null;
  }

  if (!transitionPages.has(getPageName(targetUrl))) {
    return null;
  }

  const samePath = targetUrl.pathname === currentUrl.pathname;
  const sameSearch = targetUrl.search === currentUrl.search;
  const onlyHashChange = samePath && sameSearch && targetUrl.hash !== currentUrl.hash;
  const sameUrl = targetUrl.href === currentUrl.href;

  if (onlyHashChange || sameUrl) {
    return null;
  }

  return targetUrl;
}

function setTransitionFlag() {
  try {
    sessionStorage.setItem(transitionKey, "1");
  } catch (error) {
    return;
  }
}

function takeTransitionFlag() {
  try {
    const shouldSettle = sessionStorage.getItem(transitionKey) === "1";
    sessionStorage.removeItem(transitionKey);
    return shouldSettle;
  } catch (error) {
    return false;
  }
}

function runArrivalTransition(overlay) {
  if (!takeTransitionFlag()) {
    return;
  }

  const duration = prefersReducedTransition() ? transitionReducedDuration : transitionSettleDuration;
  document.body.classList.add("transition-lock");
  overlay.classList.remove("is-active");
  overlay.classList.add("is-arriving");

  window.setTimeout(() => {
    overlay.classList.remove("is-arriving");
    document.body.classList.remove("transition-lock");
  }, duration);
}

function initPageTransitions() {
  const preload = new Image();
  preload.src = transitionAsset;

  const overlay = createPageTransition();
  runArrivalTransition(overlay);

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetUrl = shouldUsePageTransition(link, event);
      if (!targetUrl) {
        return;
      }

      event.preventDefault();
      setMenu(false);
      document.body.classList.add("transition-lock");
      overlay.classList.remove("is-arriving", "is-active");
      void overlay.offsetWidth;
      overlay.classList.add("is-active");

      const duration = prefersReducedTransition() ? transitionReducedDuration : transitionDuration;
      window.setTimeout(() => {
        setTransitionFlag();
        window.location.href = targetUrl.href;
      }, duration);
    });
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      overlay.classList.remove("is-active", "is-arriving");
      document.body.classList.remove("transition-lock");
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPageTransitions);
} else {
  initPageTransitions();
}
