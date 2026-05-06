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
        consultationLanguage: "Please choose a preferred consultation language.",
      },
      email: "Please enter a valid email address or leave it blank.",
      success: "Your application has been received. We will contact you soon with the next step.",
    },
  },
  tr: {
    menuOpen: "Navigasyon menüsünü aç",
    menuClose: "Navigasyon menüsünü kapat",
    form: {
      required: {
        fullName: "Lütfen adınızı ve soyadınızı yazın.",
        whatsapp: "Lütfen WhatsApp numaranızı yazın.",
        englishLevel: "Lütfen mevcut İngilizce seviyenizi seçin.",
        mainGoal: "Lütfen ana hedefinizi seçin.",
        speakingProblem: "Lütfen sizi en çok zorlayan konuşma problemini paylaşın.",
        preferredProgram: "Lütfen tercih ettiğiniz programı seçin.",
        startTimeline: "Lütfen ne zaman başlamak istediğinizi seçin.",
        consultationLanguage: "Lütfen bir görüşme dili seçin.",
      },
      email: "Lütfen geçerli bir e-posta adresi girin veya bu alanı boş bırakın.",
      success: "Başvurunuz alındı. Bir sonraki adım için sizinle kısa süre içinde iletişime geçeceğiz.",
    },
  },
};

const pageMetaTr = {
  home: {
    title: "Star Speaker | Güvenle konuş. Globalde parla.",
    description: "Star Speaker ile yapılandırılmış İngilizce konuşma koçluğu, günlük ses pratiği ve görünür ilerleme.",
  },
  programs: {
    title: "Programlar | Star Speaker",
    description: "Spark, Star ve Super Star programlarıyla Star Speaker konuşma dönüşüm yolculuğunu keşfedin.",
  },
  method: {
    title: "Metot | Star Speaker",
    description: "Star Speaker Immersion System: baskı, güven, yapı, günlük çıktı ve uzman düzeltmesi etrafında kurulan konuşma odaklı sistem.",
  },
  results: {
    title: "Sonuçlar | Star Speaker",
    description: "Star Speaker sonuç sistemi: konuşma gelişiminin ses kayıtları, geri bildirimler ve görünür kilometre taşlarıyla nasıl takip edildiği.",
  },
  about: {
    title: "Hakkımızda | Star Speaker",
    description: "Star Speaker: yapı, konuşma çıktısı, güven, günlük pratik ve hassas düzeltme etrafında kurulan premium konuşma dönüşüm sistemi.",
  },
  resources: {
    title: "Kaynaklar | Star Speaker",
    description: "Star Speaker ucretsiz konusma kaynaklari, rehberleri, promptlari ve pratik araclari.",
  },
  apply: {
    title: "Başvuru / Görüşme | Star Speaker",
    description: "Star Speaker görüşmeniz için başvurun ve konuşma hedefinize uygun Star Path önerisini alın.",
  },
  levelTest: {
    title: "Konuşma Seviye Tespiti | Star Speaker",
    description: "Star Speaker konuşma seviye tespit testi ile seviyeniz ve Star Path öneriniz manuel olarak 1 saat içinde değerlendirilir.",
  },
};

pageMetaTr.login = {
  title: "Öğrenci Girişi | Star Speaker",
  description: "Kabul edilen Star Speaker öğrencileri için özel giriş sayfası.",
};

pageMetaTr.workspace = {
  title: "Öğrenci Alanı | Star Speaker",
  description: "Aktif Star Speaker öğrencileri için özel çalışma alanı.",
};

const selectorTranslationsTr = {
  common: [
    [".nav-links a[href='apply.html']", "text", "Başvuru"],
  ],
  home: [
    ["#hero-title", "html", "Yurt dışına çıkmadan,<br>yurt dışındaymış gibi<br>İngilizce konuşma deneyimi."],
    ["#journey-title", "text", "Güvenli iletişime giden dört aşamalı yolculuk."],
    ["#final-cta-title", "text", "Akıcı ve özgüvenli İngilizce yolculuğunuz şimdi başlayabilir."],
  ],
  programs: [
    ["#programs-title", "text", "The Star Path"],
    ["#program-cards-title", "text", "Bir Star Speaker programı seçin"],
    ["#system-title", "text", "Star Speaker sistemi"],
  ],
  method: [
    ["#method-title", "html", "Star Speaker<br>Immersion System"],
    ["#journey-title", "text", "Tereddütten özgüvenli iletişime uzanan dört aşama."],
    ["#mechanics-title", "text", "Star Speaker; çıktı, düzeltme ve tekrar üzerine kurulur."],
  ],
  results: [
    ["#results-title", "html", "Dönüşüm nasıl<br>görülecek, takip edilecek<br>ve paylaşılacak."],
    ["#results-final-title", "text", "Kendi dönüşüm hikayenizi başlatın."],
  ],
  about: [
    ["#about-title", "html", "İngilizce derslerinin ötesinde.<br>Bir konuşma dönüşüm sistemi."],
    ["#about-final-title", "text", "Star Speaker olmaya hazır mısınız?"],
  ],
  resources: [
    ["#resources-title", "html", "Daha İyi <span>Konuşma</span> İçin Ücretsiz Kaynaklar."],
    ["#resources-final-title", "text", "Yapılandırılmış bir konuşma dönüşümüne hazır mısınız?"],
  ],
  apply: [
    ["#apply-title", "html", "Star Speaker<br>Görüşmeniz İçin<br>Başvurun"],
    ["#application-form-title", "text", "Konuşmada nerede takıldığınızı anlatın."],
    ["#final-apply-title", "text", "Konuşma dönüşümünüz tek net adımla başlayabilir."],
  ],
};

const textTr = {
  "Skip to content": "İçeriğe geç",
  "Speak confidently. Shine globally.": "Güvenle konuş. Globalde parla.",
  "Home": "Ana Sayfa",
  "Programs": "Programlar",
  "Method": "Metot",
  "Results": "Sonuçlar",
  "About": "Hakkımızda",
  "Resources": "Kaynaklar",
  "Apply": "Başvur",
  "Login": "Giriş",
  "Book a Consultation": "Görüşme Planla",
  "Take Level Test": "Seviye Testi",
  "View Programs": "Programları Gör",
  "Private English Speaking Coaching": "Özel İngilizce Konuşma Koçluğu",
  "Speak confidently in 30–60 days through structured immersion, daily voice practice, and expert guidance.": "Yapılandırılmış immersiyon, günlük ses pratiği ve uzman yönlendirmesiyle 30–60 gün içinde daha özgüvenli konuşmaya başlayın.",
  "Private & Personalized": "Özel ve kişiselleştirilmiş",
  "Structured Immersion": "Yapılandırılmış immersiyon",
  "Visible Progress": "Görünür ilerleme",
  "Premium Experience": "Premium deneyim",
  "★★★★★": "★★★★★",
  "“This feels like living abroad. My English finally clicked.”": "“Yurt dışındaymış gibi hissettiriyor. İngilizcem sonunda oturdu.”",
  "“This feels like living abroad.": "“Yurt dışındaymış gibi hissettiriyor.",
  "My English finally clicked.”": "İngilizcem sonunda oturdu.”",
  "— Elif S.": "— Elif S.",
  "How It Works": "Nasıl İşler",
  "Assessment": "Değerlendirme",
  "We evaluate your current speaking level, strengths, and goals.": "Mevcut konuşma seviyenizi, güçlü yönlerinizi ve hedeflerinizi değerlendiririz.",
  "Week 1": "1. Hafta",
  "Controlled Immersion": "Kontrollü İmmersiyon",
  "You learn in a safe, expert-led environment designed for real progress.": "Gerçek ilerleme için tasarlanmış, güvenli ve uzman rehberliğinde bir ortamda öğrenirsiniz.",
  "Weeks 2–3": "2–3. Haftalar",
  "Daily Voice Practice & Live Interaction": "Günlük Ses Pratiği ve Canlı Etkileşim",
  "Build consistency with daily voice practice and real conversations.": "Günlük ses pratiği ve gerçek konuşmalarla süreklilik kazanırsınız.",
  "Weeks 4–6": "4–6. Haftalar",
  "Measurable Speaking Transformation": "Ölçülebilir Konuşma Dönüşümü",
  "See measurable growth in confidence, clarity, and stage presence.": "Özgüven, netlik ve konuşma duruşunda ölçülebilir gelişim görürsünüz.",
  "Weeks 7–8+": "7–8+ Haftalar",
  "Speak Confidently": "Özgüvenle Konuşun",
  "Express your ideas clearly in real-life situations.": "Gerçek hayat durumlarında fikirlerinizi net şekilde ifade edin.",
  "Think in English": "İngilizce Düşünün",
  "Build natural fluency and faster responses.": "Daha doğal akıcılık ve daha hızlı cevaplar geliştirin.",
  "Handle Real Situations": "Gerçek Durumları Yönetin",
  "From interviews to presentations, speak with ease.": "Mülakattan sunuma, daha rahat konuşun.",
  "See Measurable Progress": "Ölçülebilir İlerleme Görün",
  "Track your improvement every step of the way.": "Gelişiminizi her adımda takip edin.",
  "Join a private experience designed for results, not just lessons.": "Sadece dersler için değil, sonuç için tasarlanmış özel bir deneyime katılın.",

  "The Star Path": "The Star Path",
  "Choose the level of structure, adaptation, and precision your speaking life needs.": "Konuşma hedefinize uygun yapı, kişiselleştirme ve destek seviyesini seçin.",
  "Structured Immersion — Yapılandırılmış İmmersiyon": "Structured Immersion — Yapılandırılmış İmmersiyon",
  "Spark": "Spark",
  "Structure, rhythm, and daily speaking discipline.": "Yapı, ritim ve günlük konuşma disiplini.",
  "/ month": "/ ay",
  "3 × around 50-minute group sessions": "Yaklaşık 50 dakikalık 3 grup seansı",
  "1 Star Circle per week": "Haftada 1 Star Circle",
  "Group correction rhythm": "Grup içinde düzenli düzeltme ritmi",
  "Reminders and task tracking": "Hatırlatıcılar ve görev takibi",
  "Structure": "Yapı",
  "Turns speaking into a visible routine; ideal for students who need momentum and consistency.": "Konuşmayı görünür bir rutine dönüştürür; ivme ve süreklilik ihtiyacı olan öğrenciler için idealdir.",
  "3 sessions per week": "Haftada 3 seans",
  "Around 50 minutes each": "Her biri yaklaşık 50 dakika",
  "Maximum 3 students per group": "Grup başına en fazla 3 öğrenci",
  "Program materials": "Program materyalleri",
  "Daily speaking tasks": "Günlük konuşma görevleri",
  "Daily Voice Log": "Daily Voice Log",
  "Immersion Pack": "Immersion Pack",
  "Reminders": "Hatırlatıcılar",
  "Ranking and progress system": "Sıralama ve ilerleme sistemi",
  "Apply": "Başvur",
  "Recommended": "Önerilen",
  "Personalized Acceleration": "Personalized Acceleration — Kişiselleştirilmiş Hızlanma",
  "Star": "Star",
  "Adaptation, more personal feedback, and a stronger correction rhythm.": "Uyarlama, daha kişisel geri bildirim ve daha güçlü bir düzeltme ritmi.",
  "2 private + 2 group sessions": "2 özel + 2 grup seansı",
  "2 Star Circles per week": "Haftada 2 Star Circle",
  "More personal correction focus": "Daha kişisel düzeltme odağı",
  "More detailed tracking": "Daha detaylı takip",
  "Adaptation": "Uyarlama",
  "Balances private coaching, group practice, and customized material for students with clear goals.": "Net hedefleri olan öğrenciler için özel koçluk, grup pratiği ve kişiselleştirilmiş materyali dengeler.",
  "Everything in Spark": "Spark içindeki her şey",
  "2 private + 2 group sessions weekly": "Haftada 2 özel + 2 grup seansı",
  "More personalized feedback": "Daha kişisel geri bildirim",
  "Tailored speaking drills": "Hedefe göre konuşma drill'leri",
  "Materials customized with student profile": "Öğrenci profiline göre özelleştirilmiş materyaller",
  "Customized reading and listening content": "Özelleştirilmiş okuma ve dinleme içerikleri",
  "Stronger correction focus": "Daha güçlü düzeltme odağı",
  "Private Precision": "Private Precision — Özel ve Hassas Koçluk",
  "Super Star": "Super Star",
  "A private speaking roadmap, fast correction, and deep accountability.": "Özel bir konuşma yol haritası, hızlı düzeltme ve güçlü sorumluluk takibi.",
  "5 private sessions": "5 özel seans",
  "3 Star Circles per week": "Haftada 3 Star Circle",
  "Fastest correction and feedback loop": "En hızlı düzeltme ve geri bildirim döngüsü",
  "Priority support access": "Öncelikli destek erişimi",
  "Precision": "Hassasiyet",
  "Makes scenarios, correction, and accountability fully personal for high-stakes speaking goals.": "Yüksek öneme sahip konuşma hedefleri için senaryoları, düzeltmeyi ve sorumluluğu tamamen kişiselleştirir.",
  "Everything in Star": "Star içindeki her şey",
  "5 private sessions weekly": "Haftada 5 özel seans",
  "3 Star Circles weekly": "Haftada 3 Star Circle",
  "Fully personalized speaking roadmap": "Tamamen kişisel konuşma yol haritası",
  "Custom scenarios based on goals and life context": "Hedeflere ve yaşam bağlamına göre özel senaryolar",
  "Advanced support": "İleri seviye destek",
  "Deepest customization and accountability": "En derin kişiselleştirme ve sorumluluk takibi",
  "Students who need structure and want speaking to become a daily habit.": "Yapıya ihtiyaç duyan ve konuşmayı günlük alışkanlığa dönüştürmek isteyen öğrenciler.",
  "Students who want more focused, tailored speaking refinement.": "Daha odaklı ve kişiye özel konuşma gelişimi isteyen öğrenciler.",
  "Students preparing for interviews, study abroad, presentations, or high-stakes goals.": "Mülakat, yurt dışı eğitim, sunum veya yüksek öneme sahip hedeflere hazırlanan öğrenciler.",
  "Short daily recordings, replay, and preparation for the first coach note.": "Kısa günlük kayıtlar, tekrar dinleme ve ilk koç notuna hazırlık.",
  "Star Circles": "Star Circles",
  "Small speaking circles open after the first placement step is complete.": "İlk yerleştirme adımı tamamlandıktan sonra açılan küçük konuşma halkaları.",
  "Confidence Ladder": "Confidence Ladder",
  "Your first recording begins the Solo Output stage.": "İlk kaydınız Solo Output aşamasını başlatır.",
  "Star Prompts": "Star Prompts",
  "Clear reminders for your first recording, ritual, and logbook.": "İlk kaydınız, ritüeliniz ve logbook için net hatırlatıcılar.",
  "Star Progress System": "Star Progress System",
  "The performance scale appears after real evidence is collected.": "Performans ölçeği, gerçek kanıt toplandıktan sonra görünür hale gelir.",
  "Star Logbook": "Star Logbook",
  "Corrections and useful phrases collect here after feedback begins.": "Düzeltmeler ve kullanışlı ifadeler geri bildirim başladıktan sonra burada birikir.",
  "Entry Protocol": "Entry Protocol",
  "A pre-speaking ritual for posture, breath, and one clear first sentence.": "Duruş, nefes ve tek net ilk cümle için konuşma öncesi ritüel.",
  "Star Speaker is a private English speaking coaching system built around structure, correction, and daily voice practice.": "Star Speaker; yapı, düzeltme ve günlük ses pratiği etrafında kurulan özel bir İngilizce konuşma koçluğu sistemidir.",

  "The Star Speaker Method": "Star Speaker Metodu",
  "A structured speaking-first system that turns English from something you study into something you use.": "İngilizceyi sadece çalıştığınız bir konu olmaktan çıkarıp, gerçekten kullandığınız bir beceriye dönüştüren konuşma odaklı sistem.",
  "Built around pressure, safety, structure, daily output, and expert correction.": "Baskı, güven, yapı, günlük çıktı ve uzman düzeltmesi etrafında kuruldu.",
  "Live Speaking Session": "Canlı Konuşma Seansı",
  "Live": "Canlı",
  "Today's Focus": "Bugünkü Odak",
  "Voice Practice": "Ses Pratiği",
  "Coach Feedback": "Koç Geri Bildirimi",
  "Great progress on fluency and clarity. Work on transitions and reducing fillers.": "Akıcılık ve netlikte güçlü ilerleme. Geçişler ve dolgu ifadelerini azaltma üzerine çalışın.",
  "Your Transformation Journey": "Dönüşüm Yolculuğunuz",
  "Four stages that move you from hesitation to confident communication.": "Tereddütten özgüvenli iletişime uzanan dört aşama.",
  "We identify your current speaking level, goals, strengths, and hesitation points.": "Mevcut konuşma seviyenizi, hedeflerinizi, güçlü yönlerinizi ve tereddüt noktalarınızı belirleriz.",
  "Speaking level check": "Konuşma seviyesi kontrolü",
  "Goal setting": "Hedef belirleme",
  "Personal roadmap": "Kişisel yol haritası",
  "You enter a safe but active environment where speaking becomes unavoidable.": "Konuşmanın kaçınılmaz hale geldiği, güvenli ama aktif bir ortama girersiniz.",
  "Structured live practice": "Yapılandırılmış canlı pratik",
  "Guided speaking pressure": "Rehberli konuşma baskısı",
  "Safe correction": "Güvenli düzeltme",
  "Daily Voice Practice": "Günlük Ses Pratiği",
  "You build consistency through short daily voice tasks and repeated output.": "Kısa günlük ses görevleri ve tekrar eden çıktı ile süreklilik geliştirirsiniz.",
  "Speaking rhythm": "Konuşma ritmi",
  "Confidence through repetition": "Tekrarla özgüven",
  "Measurable Transformation": "Ölçülebilir Dönüşüm",
  "Your speaking becomes clearer, stronger, and easier to track.": "Konuşmanız daha net, daha güçlü ve daha kolay takip edilir hale gelir.",
  "Weekly feedback": "Haftalık geri bildirim",
  "Progress tracking": "İlerleme takibi",
  "Real-world speaking confidence": "Gerçek hayatta konuşma özgüveni",
  "The System Behind The Progress": "İlerlemenin Arkasındaki Sistem",
  "Star Speaker is built around output, correction, and repetition.": "Star Speaker; çıktı, düzeltme ve tekrar üzerine kurulur.",
  "Short daily recordings turn English into an active habit, not a classroom memory.": "Kısa günlük kayıtlar İngilizceyi sınıf anısı olmaktan çıkarıp aktif bir alışkanlığa dönüştürür.",
  "Live Speaking Sessions": "Canlı Konuşma Seansları",
  "Students practice in structured sessions where speaking, interaction, and correction happen together.": "Öğrenciler konuşma, etkileşim ve düzeltmenin birlikte gerçekleştiği yapılandırılmış seanslarda pratik yapar.",
  "Small speaking circles create accountability, peer interaction, and safe social pressure.": "Küçük konuşma halkaları sorumluluk, akran etkileşimi ve güvenli sosyal baskı oluşturur.",
  "Teacher Correction": "Öğretmen Düzeltmesi",
  "Students receive focused correction so mistakes become progress instead of fear.": "Öğrenciler odaklı düzeltme alır; böylece hatalar korku değil ilerleme haline gelir.",
  "Weekly Feedback": "Haftalık Geri Bildirim",
  "Each week gives students a clearer picture of what improved and what needs attention.": "Her hafta öğrenciye neyin geliştiğini ve neye dikkat edilmesi gerektiğini daha net gösterir.",
  "Progress is made visible through consistency, performance, and speaking milestones.": "İlerleme; süreklilik, performans ve konuşma kilometre taşlarıyla görünür hale gelir.",
  "Why It Works": "Neden İşe Yarar?",
  "Confidence is not built by waiting until you feel ready.": "Özgüven, hazır hissetmeyi bekleyerek oluşmaz.",
  "Confidence is built by speaking before you feel ready — inside the right structure.": "Özgüven, doğru yapı içinde hazır hissetmeden konuşmaya başlayarak oluşur.",
  "Pressure": "Baskı",
  "Students need enough pressure to speak, participate, and show up.": "Öğrencilerin konuşması, katılması ve istikrarlı görünmesi için yeterli baskıya ihtiyacı vardır.",
  "Safety": "Güven",
  "Students need enough safety to make mistakes without shame or fear.": "Öğrencilerin utanmadan ve korkmadan hata yapabilecek kadar güvene ihtiyacı vardır.",
  "Students need a clear path, repeated tasks, and expert correction.": "Öğrencilerin net bir yola, tekrar eden görevlere ve uzman düzeltmesine ihtiyacı vardır.",
  "“Mistakes are allowed. Silence is not.”": "“Hata yapmak serbest. Sessiz kalmak değil.”",
  "Not Normal English Lessons": "Normal İngilizce Dersleri Değil",
  "Traditional English courses compared with the Star Speaker Method": "Geleneksel İngilizce kursları ile Star Speaker Metodu karşılaştırması",
  "Traditional English Courses": "Geleneksel İngilizce Kursları",
  "Too much passive grammar": "Çok fazla pasif gramer",
  "Too little speaking pressure": "Çok az konuşma baskısı",
  "Random homework": "Rastgele ödevler",
  "Progress feels unclear": "İlerleme belirsiz hissedilir",
  "Students wait until they feel ready": "Öğrenciler hazır hissetmeyi bekler",
  "Speaking-first practice": "Konuşma öncelikli pratik",
  "Daily output and accountability": "Günlük çıktı ve sorumluluk",
  "Controlled immersion": "Kontrollü immersiyon",
  "Weekly correction and feedback": "Haftalık düzeltme ve geri bildirim",
  "Confidence built through action": "Eylemle inşa edilen özgüven",
  "Ready to start your Star Path?": "Star Path yolculuğunuza başlamaya hazır mısınız?",
  "Choose your program or book a consultation to find the right level of structure, adaptation, and precision for your goals.": "Hedefleriniz için doğru yapı, uyarlama ve hassasiyet seviyesini bulmak üzere programınızı seçin veya görüşme planlayın.",

  "Results & Student Stories": "Sonuçlar ve Öğrenci Hikayeleri",
  "We do not fake proof. Star Speaker tracks real speaking progress through voice logs, feedback, recordings, and visible milestones.": "Kanıtı taklit etmeyiz. Star Speaker gerçek konuşma gelişimini ses kayıtları, geri bildirimler, kayıtlar ve görünür kilometre taşlarıyla takip eder.",
  "Student stories will be added after the first transformation cycle.": "Gerçek öğrenci hikayeleri, ilk dönüşüm dönemi tamamlandıktan sonra burada yer alacak.",
  "Speaking Journey": "Konuşma Yolculuğu",
  "Start": "Başlangıç",
  "Building": "Beceri",
  "Skills": "İnşası",
  "Visible": "Görünür",
  "Progress": "İlerleme",
  "Confident": "Özgüvenli",
  "Expression": "İfade",
  "Progress Over Time": "Zaman İçinde İlerleme",
  "Week 1": "1. Hafta",
  "Week 2": "2. Hafta",
  "Week 3": "3. Hafta",
  "Week 4": "4. Hafta",
  "Week 5": "5. Hafta",
  "Week 6": "6. Hafta",
  "Before Recording": "Ön Kayıt",
  "After Recording": "Son Kayıt",
  "Teacher Feedback": "Öğretmen Geri Bildirimi",
  "Nice improvement in clarity and confidence. Keep practicing pauses and stress.": "Netlik ve özgüvende güzel gelişim. Duraklamalar ve vurgu üzerine çalışmaya devam edin.",
  "- Coach Elif S.": "- Koç Elif S.",
  "Key Improvements": "Temel Gelişimler",
  "More Confident": "Daha Özgüvenli",
  "Clearer Ideas": "Daha Net Fikirler",
  "Better Flow": "Daha İyi Akış",
  "Stronger Pronunciation": "Daha Güçlü Telaffuz",
  "What We Track": "Neleri Takip Ederiz?",
  "Speaking Confidence": "Konuşma Özgüveni",
  "Clarity": "Netlik",
  "Fluency": "Akıcılık",
  "Consistency": "Süreklilik",
  "Pronunciation": "Telaffuz",
  "Real-World Speaking Ability": "Gerçek Hayatta Konuşma Becerisi",
  "How Proof Is Collected": "Kanıt Nasıl Toplanır?",
  "We capture your baseline to understand your starting point.": "Başlangıç noktanızı anlamak için temel seviyenizi kaydederiz.",
  "Weekly Voice Log": "Haftalık Voice Log",
  "Short voice logs show your growth one week at a time.": "Kısa ses kayıtları gelişiminizi hafta hafta gösterir.",
  "You receive clear, personalized feedback after each log.": "Her kayıttan sonra net ve kişisel geri bildirim alırsınız.",
  "Progress Review": "İlerleme Değerlendirmesi",
  "We review trends and milestones with you regularly.": "Eğilimleri ve kilometre taşlarını sizinle düzenli olarak değerlendiririz.",
  "You record again to see how far you have come.": "Ne kadar ilerlediğinizi görmek için yeniden kayıt alırsınız.",
  "From Hesitation To Expression": "Tereddütten İfadeye",
  "Before": "Önce",
  "Hesitant": "Tereddütlü",
  "Silent": "Sessiz",
  "Translating in your head": "Kafasında çeviri yapan",
  "Afraid of mistakes": "Hata yapmaktan çekinen",
  "After": "Sonra",
  "Clear": "Net",
  "Active": "Aktif",
  "Speaking more naturally": "Daha doğal konuşan",
  "Student Stories": "Öğrenci Hikayeleri",
  "Real student stories will appear here after the first cohort completes the system.": "Gerçek öğrenci hikayeleri, ilk grup sistemi tamamladıktan sonra burada yer alacak.",
  "Start your transformation story.": "Kendi dönüşüm hikayenizi başlatın.",
  "Join the system, build measurable speaking progress, and become one of the first Star Speaker success stories.": "Sisteme katılın, ölçülebilir konuşma gelişimi oluşturun ve ilk Star Speaker başarı hikayelerinden biri olun.",

  "About Star Speaker": "Star Speaker Hakkında",
  "Built for people who are tired of knowing English but not speaking it.": "İngilizce bildiği halde konuşamayanlar için tasarlandı.",
  "Star Speaker is a premium speaking transformation system built around structure, realistic pressure, safety, and correction — so you can turn your English into real speaking output, consistently.": "Star Speaker; yapı, gerçekçi baskı, güven ve düzeltme etrafında kurulan premium bir konuşma dönüşüm sistemidir. Böylece İngilizcenizi tutarlı biçimde gerçek konuşma çıktısına dönüştürebilirsiniz.",
  "Structured System": "Yapılandırılmış Sistem",
  "Real Speaking Output": "Gerçek Konuşma Çıktısı",
  "Safe, Supportive Environment": "Güvenli ve Destekleyici Ortam",
  "Built from a simple observation.": "Basit bir gözlemden doğdu.",
  "Many students study English for years. They know the rules, the words, and the grammar. But when it is time to speak, they freeze.": "Birçok öğrenci yıllarca İngilizce çalışır. Kuralları, kelimeleri ve grameri bilir. Ama konuşma anı geldiğinde donar.",
  "Not because they are lazy. Not because they are unintelligent.": "Tembel oldukları için değil. Zeki olmadıkları için değil.",
  "Because most English education trains recognition, not real-time speaking.": "Çünkü çoğu İngilizce eğitimi gerçek zamanlı konuşmayı değil, tanımayı öğretir.",
  "Star Speaker was created to solve that gap.": "Star Speaker bu boşluğu kapatmak için oluşturuldu.",
  "The real problem is hesitation.": "Asıl problem tereddüttür.",
  "You freeze when it is time to speak.": "Konuşma zamanı geldiğinde donarsınız.",
  "You translate in your head instead of responding naturally.": "Doğal cevap vermek yerine kafanızda çeviri yaparsınız.",
  "You avoid mistakes instead of expressing.": "Kendinizi ifade etmek yerine hatalardan kaçınırsınız.",
  "You need English for abroad, work, interviews, or university life.": "Yurt dışı, iş, mülakatlar veya üniversite hayatı için İngilizceye ihtiyacınız vardır.",
  "You need a system that makes speaking unavoidable — but safe.": "Konuşmayı kaçınılmaz ama güvenli hale getiren bir sisteme ihtiyacınız vardır.",
  "What We Believe": "Neye İnanıyoruz?",
  "Voice over text.": "Metinden önce ses.",
  "Output over passive study.": "Pasif çalışmadan önce çıktı.",
  "Structure over motivation.": "Motivasyondan önce yapı.",
  "Correction without shame.": "Utandırmadan düzeltme.",
  "Pressure with safety.": "Güven içinde baskı.",
  "Visible progress, not vague confidence.": "Belirsiz özgüven değil, görünür ilerleme.",
  "Mistakes are allowed. Silence is not.": "Hata yapmak serbest. Sessiz kalmak değil.",
  "What Makes Star Speaker Different": "Star Speaker'ı Farklı Kılan Nedir?",
  "Short daily voice output builds consistency and confidence.": "Kısa günlük ses çıktısı süreklilik ve özgüven oluşturur.",
  "Live Speaking Practice": "Canlı Konuşma Pratiği",
  "Students speak in structured sessions, not passive lectures.": "Öğrenciler pasif derslerde değil, yapılandırılmış seanslarda konuşur.",
  "Small groups create accountability, interaction, and safe speaking pressure.": "Küçük gruplar sorumluluk, etkileşim ve güvenli konuşma baskısı oluşturur.",
  "Mistakes become progress through precise, respectful correction.": "Hatalar, hassas ve saygılı düzeltme ile ilerlemeye dönüşür.",
  "Students see progress through visible milestones and performance tracking.": "Öğrenciler görünür kilometre taşları ve performans takibiyle ilerlemeyi görür.",
  "Spark, Star, and Super Star give different levels of structure, adaptation, and precision.": "Spark, Star ve Super Star; farklı yapı, uyarlama ve hassasiyet seviyeleri sunar.",
  "Built for ambitious learners with global goals.": "Global hedefleri olan hırslı öğrenciler için tasarlandı.",
  "Students preparing to study abroad": "Yurt dışında okumaya hazırlanan öğrenciler",
  "Private university prep students": "Özel üniversite hazırlık öğrencileri",
  "Young professionals": "Genç profesyoneller",
  "IELTS / PTE / TOEFL speaking-focused students": "IELTS / PTE / TOEFL konuşma odaklı öğrenciler",
  "Shy but serious learners": "Çekingen ama ciddi öğrenciler",
  "The closest thing to living abroad — without leaving your country.": "Yurt dışına çıkmadan, yurt dışındaymış gibi İngilizce konuşma deneyimi.",
  "A controlled English-speaking environment built around daily output, live interaction, correction, and visible progress.": "Günlük çıktı, canlı etkileşim, düzeltme ve görünür ilerleme etrafında kurulan kontrollü bir İngilizce konuşma ortamı.",
  "Ready to become a Star Speaker?": "Star Speaker olmaya hazır mısınız?",
  "This is not another course. This is your speaking transformation.": "Bu başka bir kurs değil. Bu sizin konuşma dönüşümünüz.",

  "Practical tools. Real progress.": "Pratik araçlar. Gerçek ilerleme.",
  "Practical tools, prompts, and expert guides to help you stop studying passively and start speaking confidently in real life.": "Pasif çalışmayı bırakıp gerçek hayatta daha özgüvenli konuşmaya başlamanız için pratik araçlar, konuşma promptları ve uzman rehberleri.",
  "Speaking Guides": "Konuşma Rehberleri",
  "Step-by-step guides to solve real speaking challenges.": "Gerçek konuşma zorluklarını çözmek için adım adım rehberler.",
  "View all guides": "Tüm rehberleri gör",
  "How to Stop Translating in Your Head": "Kafanızda Çeviri Yapmayı Nasıl Bırakırsınız?",
  "Break the habit of translation and start thinking in English.": "Çeviri alışkanlığını kırın ve İngilizce düşünmeye başlayın.",
  "Read guide": "Rehberi oku",
  "How to Speak When You Feel Nervous": "Gerginken Nasıl Konuşulur?",
  "Calm your mind, control anxiety, and speak with confidence.": "Zihninizi sakinleştirin, kaygıyı yönetin ve özgüvenle konuşun.",
  "Study Abroad Speaking Guide": "Yurt Dışı Konuşma Rehberi",
  "Essential English for universities, interviews, and daily life abroad.": "Üniversiteler, mülakatlar ve yurt dışındaki günlük yaşam için gerekli İngilizce.",
  "Daily Confidence Guide": "Günlük Özgüven Rehberi",
  "Small daily actions to build a strong, steady speaking mindset.": "Güçlü ve istikrarlı bir konuşma zihniyeti için küçük günlük adımlar.",
  "Free Speaking Prompts": "Ücretsiz Konuşma Promptları",
  "Practice with real-life prompts designed for confidence.": "Özgüven için tasarlanmış gerçek hayat promptlarıyla pratik yapın.",
  "View all prompts": "Tüm promptları gör",
  "7-Day Speaking Prompt Pack": "7 Günlük Konuşma Prompt Paketi",
  "A week of daily prompts to build fluency and momentum.": "Akıcılık ve ivme kazanmak için bir haftalık günlük promptlar.",
  "Start practicing": "Pratiğe başla",
  "Study Abroad Prompts": "Yurt Dışı Promptları",
  "Real scenarios for campus life, culture, and daily needs.": "Kampüs hayatı, kültür ve günlük ihtiyaçlar için gerçek senaryolar.",
  "Interview English Prompts": "Mülakat İngilizcesi Promptları",
  "Common questions and smart answers for any interview.": "Her mülakat için yaygın sorular ve güçlü cevaplar.",
  "Confidence Voice Prompts": "Özgüven Ses Promptları",
  "Build your voice, clarity, and natural expression.": "Sesinizi, netliğinizi ve doğal ifadenizi geliştirin.",
  "Student Tools": "Öğrenci Araçları",
  "Helpful tools to guide your next step.": "Bir sonraki adımınızı netleştiren yardımcı araçlar.",
  "View all": "Tümünü gör",
  "Take the Speaking Placement Test": "Konuşma Seviye Tespit Testini Al",
  "Identify your level and get a clear roadmap.": "Seviyenizi belirleyin ve net bir yol haritası alın.",
  "Take test": "Testi al",
  "Apply for Consultation": "Görüşme İçin Başvur",
  "Book a 1-on-1 consultation with our experts.": "Uzmanlarımızla bire bir görüşme planlayın.",
  "Apply now": "Şimdi başvur",
  "Explore structured programs for every goal.": "Her hedefe uygun yapılandırılmış programları keşfedin.",
  "View programs": "Programları gör",
  "Learn the Method": "Metodu Öğrenin",
  "Discover the Star Speaker speaking system.": "Star Speaker konuşma sistemini keşfedin.",
  "Explore method": "Metodu keşfet",
  "Coming Soon Library": "Yakında Gelecek Kütüphane",
  "New resources are on the way.": "Yeni kaynaklar hazırlanıyor.",
  "Pronunciation Mini-Lessons": "Telaffuz Mini Dersleri",
  "Short lessons to improve clarity and natural pronunciation.": "Netliği ve doğal telaffuzu geliştiren kısa dersler.",
  "Coming soon": "Yakında",
  "IELTS / PTE / TOEFL Support": "IELTS / PTE / TOEFL Desteği",
  "Targeted strategies and model answers for test success.": "Sınav başarısı için hedefli stratejiler ve örnek cevaplar.",
  "Study Abroad Toolkit": "Yurt Dışı Araç Seti",
  "Checklists, templates, and guides for your journey abroad.": "Yurt dışı yolculuğunuz için kontrol listeleri, şablonlar ve rehberler.",
  "Daily Voice Log Examples": "Daily Voice Log Örnekleri",
  "Real student logs to shape your own progress.": "Kendi ilerlemenizi şekillendirmek için gerçek öğrenci logları.",
  "Get expert guidance, a clear plan, and real progress that lasts.": "Uzman rehberliği, net bir plan ve kalıcı gerçek ilerleme kazanın.",
  "Trusted by students who want more than a classroom": "Bir sınıftan fazlasını isteyen öğrencilerin tercihi",

  "Private Student Access": "Özel Öğrenci Erişimi",
  "Student Login": "Öğrenci Girişi",
  "Access is available only for accepted Star Speaker students.": "Erişim yalnızca kabul edilen Star Speaker öğrencileri içindir.",
  "Use the email and password created for your Star Speaker student account.": "Star Speaker öğrenci hesabınız için oluşturulan e-posta ve şifreyi kullanın.",
  "Password": "Şifre",
  "Not accepted yet? Apply for a consultation first.": "Henüz kabul edilmediniz mi? Önce görüşme için başvurun.",
  "Apply for Consultation": "Görüşme İçin Başvur",
  "Student Workspace": "Öğrenci Alanı",
  "Workspace": "Öğrenci Alanı",
  "Welcome back.": "Tekrar hoş geldin.",
  "Checking your private Star Speaker access.": "Özel Star Speaker erişiminiz kontrol ediliyor.",
  "Checking": "Kontrol",
  "Program": "Program",
  "Current Week": "Mevcut Hafta",
  "Focus": "Odak",
  "Status": "Durum",
  "Active": "Aktif",
  "Today's Voice Task": "Bugünün Ses Görevi",
  "Your next voice task will appear here after your coach assigns it.": "Koçunuz atadıktan sonra bir sonraki ses göreviniz burada görünecek.",
  "Weekly Path": "Haftalık Yol",
  "Week 1 Survival Mode": "1. Hafta Survival Mode",
  "Week 2 Interaction Mode": "2. Hafta Interaction Mode",
  "Week 3 Expression Mode": "3. Hafta Expression Mode",
  "Week 4 Real World Mode": "4. Hafta Real World Mode",
  "Coach Feedback": "Koç Geri Bildirimi",
  "Your feedback will appear here after review.": "Geri bildiriminiz inceleme sonrası burada görünecek.",
  "Upcoming Session": "Yaklaşan Seans",
  "Your next live session will appear here once scheduled.": "Planlandıktan sonra bir sonraki canlı seansınız burada görünecek.",
  "Resources for This Week": "Bu Haftanın Kaynakları",
  "Weekly resources will appear here after your program starts.": "Programınız başladıktan sonra haftalık kaynaklar burada görünecek.",
  "Profile Status": "Profil Durumu",
  "Your profile is being prepared.": "Profiliniz hazırlanıyor.",
  "Logout": "Çıkış Yap",

  "Apply / Consultation": "Başvuru / Görüşme",
  "Tell us your speaking goal, current level, and what is holding you back. We will recommend the right Star Path for you.": "Konuşma hedefinizi, mevcut seviyenizi ve sizi en çok zorlayan noktayı bizimle paylaşın. Size en uygun Star Path önerisini sunalım.",
  "Private. Clear. Speaking-focused.": "Özel. Net. Konuşma odaklı.",
  "Start Application": "Başvuruya Başla",
  "Private Review": "Özel İnceleme",
  "Speaking Goal Focus": "Konuşma Hedefi Odağı",
  "Parent-Friendly": "Veli Dostu",
  "Clear Recommendation": "Net Öneri",
  "Private Application": "Özel Başvuru",
  "Tell us where speaking feels blocked.": "Konuşmada nerede takıldığınızı anlatın.",
  "Full Name": "Ad Soyad",
  "WhatsApp Number": "WhatsApp Numarası",
  "Email": "E-posta",
  "Current English Level": "Mevcut İngilizce Seviyesi",
  "Select your level": "Seviyenizi seçin",
  "A1 Beginner": "A1 Başlangıç",
  "A2 Elementary": "A2 Temel",
  "B1 Intermediate": "B1 Orta",
  "B2 Upper-Intermediate": "B2 Orta Üstü",
  "C1 Advanced": "C1 İleri",
  "Not sure": "Emin değilim",
  "Main Goal": "Ana Hedef",
  "Select your main goal": "Ana hedefinizi seçin",
  "Study abroad": "Yurt dışı eğitim",
  "University prep school": "Üniversite hazırlık",
  "Work / career growth": "İş / kariyer gelişimi",
  "IELTS / PTE / TOEFL": "IELTS / PTE / TOEFL",
  "Speaking confidence": "Konuşma özgüveni",
  "Other": "Diğer",
  "Preferred Program": "Tercih Edilen Program",
  "Select preferred program": "Tercih ettiğiniz programı seçin",
  "Biggest Speaking Problem": "En Büyük Konuşma Zorluğu",
  "How Soon Do You Want to Start?": "Ne Zaman Başlamak İstiyorsunuz?",
  "Select an option": "Bir seçenek seçin",
  "Immediately": "Hemen",
  "Within 1 week": "1 hafta içinde",
  "Within 2-4 weeks": "2–4 hafta içinde",
  "Later": "Daha sonra",
  "Preferred Consultation Language": "Görüşme Dili Tercihi",
  "Choose the language that helps us understand you best.": "Sizi en iyi şekilde anlayabilmemiz için görüşme dilinizi seçin.",
  "Turkish": "Türkçe",
  "Clear explanation and comfort": "Net açıklama ve rahatlık",
  "English": "İngilizce",
  "Show your level directly": "Seviyenizi doğrudan gösterin",
  "Hybrid": "Hibrit",
  "Turkish explanation + short English speaking check": "Türkçe açıklama + kısa İngilizce konuşma kontrolü",
  "Short Message": "Kısa Mesaj",
  "(Optional)": "(İsteğe Bağlı)",
  "Submit Application": "Başvuruyu Gönder",
  "What Happens Next": "Sonra Ne Olur?",
  "Submit Application": "Başvuruyu Gönder",
  "Share your goals, level, and what is holding you back.": "Hedeflerinizi, seviyenizi ve sizi zorlayan noktayı paylaşın.",
  "We Review Your Goals": "Hedeflerinizi İnceleriz",
  "Our team carefully reviews your information privately.": "Ekibimiz bilgilerinizi gizlilikle ve dikkatle inceler.",
  "Consultation & Recommendation": "Görüşme ve Öneri",
  "We schedule your consultation and recommend the right Star Path.": "Görüşmenizi planlar ve size uygun Star Path önerisini sunarız.",
  "Begin Your Star Path": "Star Path Yolculuğunuza Başlayın",
  "You start your personalized speaking transformation with confidence.": "Kişiselleştirilmiş konuşma dönüşümünüze güvenle başlarsınız.",
  "Why This Consultation Helps": "Bu Görüşme Neden Yardımcı Olur?",
  "Private Conversation": "Özel Görüşme",
  "Your information and goals are kept completely private and secure.": "Bilgileriniz ve hedefleriniz tamamen gizli ve güvende tutulur.",
  "Speaking-Level Insight": "Konuşma Seviyesi İçgörüsü",
  "We understand your current speaking level and identify real gaps.": "Mevcut konuşma seviyenizi anlar ve gerçek boşlukları belirleriz.",
  "Program Match": "Program Eşleştirme",
  "We recommend the program that fits your goal, time, and learning style.": "Hedefinize, zamanınıza ve öğrenme stilinize uygun programı öneririz.",
  "No Pressure": "Baskı Yok",
  "This is a friendly consultation. You decide what is best for you.": "Bu dostane bir görüşmedir. Sizin için en doğru kararı siz verirsiniz.",
  "Your speaking transformation can start with one clear step.": "Konuşma dönüşümünüz tek net adımla başlayabilir.",
  "© 2026 Star Speaker. All rights reserved.": "© 2026 Star Speaker. Tüm hakları saklıdır.",
  "Privacy Policy": "Gizlilik Politikası",
  "Terms of Use": "Kullanım Şartları",
};

const attrTr = {
  "Star Speaker private English speaking coaching for confident, global communication.": "Star Speaker ile özgüvenli ve global iletişim için özel İngilizce konuşma koçluğu.",
  "Explore Star Speaker programs: Spark, Star, and Super Star private English speaking coaching paths.": "Spark, Star ve Super Star programlarıyla Star Speaker özel İngilizce konuşma koçluğu yollarını keşfedin.",
  "The Star Speaker Method: a speaking-first immersion system built around pressure, safety, structure, daily output, and expert correction.": "Star Speaker Metodu: baskı, güven, yapı, günlük çıktı ve uzman düzeltmesi etrafında kurulan konuşma odaklı immersiyon sistemi.",
  "Star Speaker Results and Student Stories: an honest view of how speaking progress is tracked through voice logs, recordings, feedback, and milestones.": "Star Speaker Sonuçlar ve Öğrenci Hikayeleri: konuşma gelişiminin ses kayıtları, geri bildirimler ve kilometre taşlarıyla nasıl takip edildiğine dürüst bir bakış.",
  "About Star Speaker: a premium English speaking transformation system built around structure, speaking output, safety, daily practice, and precise correction.": "Star Speaker hakkında: yapı, konuşma çıktısı, güven, günlük pratik ve hassas düzeltme etrafında kurulan premium İngilizce konuşma dönüşüm sistemi.",
  "Apply for a Star Speaker consultation and receive a clear recommendation for the right speaking transformation path.": "Star Speaker görüşmeniz için başvurun ve doğru konuşma dönüşümü yolu için net bir öneri alın.",
  "Student login for accepted Star Speaker students.": "Kabul edilen Star Speaker öğrencileri için öğrenci girişi.",
  "Private Star Speaker student workspace.": "Özel Star Speaker öğrenci çalışma alanı.",
  "Primary navigation": "Ana navigasyon",
  "Star Speaker homepage": "Star Speaker ana sayfası",
  "Open navigation menu": "Navigasyon menüsünü aç",
  "Close navigation menu": "Navigasyon menüsünü kapat",
  "Language selector": "Dil seçici",
  "Hero actions": "Ana bölüm eylemleri",
  "Star Speaker value pillars": "Star Speaker değerleri",
  "A private English speaking lesson on a laptop in a warm study setting": "Sıcak bir çalışma ortamında dizüstü bilgisayarda özel İngilizce konuşma dersi",
  "Five star rating": "Beş yıldız değerlendirme",
  "Expected outcomes": "Beklenen sonuçlar",
  "Spark highlights": "Spark öne çıkanlar",
  "Star highlights": "Star öne çıkanlar",
  "Super Star highlights": "Super Star öne çıkanlar",
  "Programs page footer": "Programlar sayfası alt bölümü",
  "Visual overview of a Star Speaker speaking session": "Star Speaker konuşma seansının görsel özeti",
  "Progress 78 percent": "Yüzde 78 ilerleme",
  "Legal links": "Yasal bağlantılar",
  "Student story status": "Öğrenci hikayesi durumu",
  "Progress evidence visual": "İlerleme kanıtı görseli",
  "Star Speaker values": "Star Speaker değerleri",
  "Premium Star Speaker desk scene": "Premium Star Speaker çalışma masası sahnesi",
  "A premium Star Speaker desk scene with a laptop, lamp, notebook, mug, and wall plaque.": "Laptop, lamba, defter, kupa ve duvar tabelası bulunan premium Star Speaker çalışma masası sahnesi.",
  "Premium Star Speaker resource desk with prompt cards, notebook, mug, and laptop": "Prompt kartları, defter, kupa ve laptop bulunan premium Star Speaker kaynak masası",
  "About Star Speaker details": "Star Speaker hakkında detaylar",
  "Star Speaker promise": "Star Speaker vaadi",
  "Apply page actions": "Başvuru sayfası eylemleri",
  "Consultation benefits": "Görüşme faydaları",
  "Enter your full name": "Ad soyadınızı yazın",
  "you@example.com": "ornek@eposta.com",
  "Enter your password": "Şifrenizi yazın",
  "What is the biggest challenge holding you back?": "Sizi en çok zorlayan konuşma problemi nedir?",
  "Anything else you would like to share with us?": "Bizimle paylaşmak istediğiniz başka bir şey var mı?",
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
]);
const transitionKey = "starSpeakerPageTransition";
const transitionAsset = "public/images/star-transition-emblem.png";
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
