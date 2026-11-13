/* High on Intelligence — i18n (EN / FR / AR)
   Interface translation; resource titles stay in their original language.
   Choice persisted on this device (hoi_lang_v1). */

const I18N = {
  en: null, /* captured from the DOM on first load */
  fr: {
    "nav-library":"Bibliothèque","nav-paths":"Parcours","nav-universe":"Univers","nav-assistant":"Assistant","nav-quiz":"Quiz","nav-focus":"Focus","nav-collaborate":"Collaborer",
    "eyebrow":"HIGH ON INTELLIGENCE · TECHNOLOGIE & ÂME · FONDÉE PAR HAZEM SOUSSI",
    "lede":"La porte ouverte et gratuite de Hazem Soussi vers les puissances qui remodèlent le monde — <strong>technologies, information et données</strong> : IA &amp; machine learning, logiciel &amp; web, sécurité, mathématiques. Et le chemin spirituel n'est pas une note de bas de page ici — <strong>esprit, corps et âme</strong>, rendu explicite. Sans paywalls. Sans blabla. Un lieu pour <strong>collaborer avec la machine pensante</strong>.",
    "cta-library":"Ouvrir la Bibliothèque →","cta-assistant":"Demander à la Machine Pensante","cta-collaborate":"Rejoindre la Collaboration",
    "stat-total":"RESSOURCES","stat-done":"COMPLÉTÉES","stat-hours":"INVESTIES","mastery-title":"Votre Maîtrise — en direct","mastery-pct":"complétées",
    "h2-library":"La Bibliothèque","p-library":"Chaque lien est réel, vérifié et accessible publiquement. Filtrez par domaine, niveau, coût ou format — et cochez ce que vous terminez.",
    "h2-paths":"Parcours Guidés","p-paths":"Cinq voyages ordonnés à travers la bibliothèque — cochez chaque étape, regardez chaque barre se remplir, et sentez le momentum.",
    "h2-assistant":"La Machine Pensante — Assistant sur l'appareil","p-assistant":"Un vrai moteur de recherche (TF-IDF sur la bibliothèque + la base High on Intelligence). Pas de cloud, pas de clés, pas de suivi. Elle pense avec vous, localement.",
    "h2-quiz":"Testez votre signal","p-quiz":"Douze questions sur les cinq domaines. Feedback instantané. Votre meilleur score est gardé sur cet appareil.",
    "h2-focus":"Actes pour une bonne santé","p-focus":"Un esprit affûté dans un corps épuisé construit des machines fragiles. Minuterie deep-work + respiration en boîte — gratuit, hors-ligne, à vous.",
    "h2-wisdom":"Des mots qui ont construit le monde moderne",
    "h2-collaborate":"Collaborez avec la Machine Pensante","p-collaborate":"High on Intelligence n'est pas un monument — c'est une invitation. Écrivez votre manifeste ; il reste sur votre appareil, prêt à être envoyé.",
    "manifesto-eyebrow":"Le Manifeste High on Intelligence"
  },
  ar: {
    "nav-library":"المكتبة","nav-paths":"المسارات","nav-universe":"الكون","nav-assistant":"المساعد","nav-quiz":"الاختبار","nav-focus":"التركيز","nav-collaborate":"تعاون",
    "eyebrow":"ذكاء مرتفع · تقنية وروح · بقلم حازم السوسي",
    "lede":"بوابة حازم السوسي المجانية والمفتوحة نحو القوى التي تعيد تشكيل العالم — <strong>التقنيات والمعلومات والبيانات</strong>: الذكاء الاصطناعي والتعلم الآلي، البرمجيات والويب، الأمن، الرياضيات. والمسار الروحي ليس هامشًا هنا — <strong>العقل والجسد والروح</strong>، مصاغ صراحةً. بلا جدران دفع. بلا ضجيج. مكان لل<strong>تعاون مع آلة التفكير</strong>.",
    "cta-library":"افتح المكتبة ←","cta-assistant":"اسأل آلة التفكير","cta-collaborate":"انضم إلى التعاون",
    "stat-total":"مورد","stat-done":"مُنجَز","stat-hours":"مستثمرة","mastery-title":"إتقانك — مباشر","mastery-pct":"مكتمل",
    "h2-library":"المكتبة","p-library":"كل رابط حقيقي وموثوق ومتاح للعموم. صفِّ حسب المجال أو المستوى أو التكلفة أو النوع — وحدّد ما تُنهيه.",
    "h2-paths":"المسارات الموجهة","p-paths":"خمس رحلات مرتبة عبر المكتبة — حدّد كل خطوة، وشاهد كل شريط يمتلئ، واشعر بالزخم يتراكم.",
    "h2-assistant":"آلة التفكير — المساعد على الجهاز","p-assistant":"محرك استرجاع حقيقي (TF-IDF فوق المكتبة وقاعدة معرفة HOI). بلا سحابة، بلا مفاتيح، بلا تتبّع. تفكر معك، محليًا.",
    "h2-quiz":"اختبر إشارتك","p-quiz":"اثنتا عشرة مسألة عبر المجالات الخمسة. نتيجة فورية. أفضل نتيجة تُحفظ على جهازك.",
    "h2-focus":"أعمال من أجل صحة جيدة","p-focus":"عقل حاد في جسد منهك يبني آلات هشة. مؤقّت عمل عميق + تنفّس الصندوق — مجاني، يعمل دون إنترنت، لك أنت.",
    "h2-wisdom":"كلمات بنت العالم الحديث",
    "h2-collaborate":"تعاون مع آلة التفكير","p-collaborate":"ذكاء مرتفع ليس نصبًا — إنه دعوة. اكتب بيان تعاونك؛ يبقى على جهازك، جاهزًا للإرسال.",
    "manifesto-eyebrow":"بيان ذكاء مرتفع"
  }
};

const I18N_KEY = "hoi_lang_v1";

function snapshotEnglish() {
  const en = {};
  document.querySelectorAll("[data-i18n]").forEach(el => { en[el.getAttribute("data-i18n")] = el.innerHTML; });
  I18N.en = en;
}

function applyLang(lang) {
  const dict = lang === "en" ? I18N.en : I18N[lang];
  if (!dict) return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    if (dict[k] !== undefined) el.innerHTML = dict[k];
  });
  document.querySelectorAll(".lang-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === lang);
    b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
  });
  try { localStorage.setItem(I18N_KEY, lang); } catch {}
}

document.addEventListener("DOMContentLoaded", () => {
  snapshotEnglish();
  let saved = "en";
  try { saved = localStorage.getItem(I18N_KEY) || "en"; } catch {}
  if (saved !== "en") applyLang(saved);
  document.querySelectorAll(".lang-btn").forEach(b => b.addEventListener("click", () => applyLang(b.dataset.lang)));
});
