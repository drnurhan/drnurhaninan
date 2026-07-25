export type Testimonial = { quote: string; name: string };

// ÖRNEK YORUMLAR — gerçek hasta yorumlarıyla değiştirilecek.
// Bilinçli tasarım kararı: yorumlar, yazıldıkları orijinal dilde sabittir ve
// site dili ne olursa olsun (next-intl locale'inden bağımsız) aynı şekilde
// gösterilir — gerçek yorumlar da (ör. Google Yorumları) böyle çalışır,
// ziyaretçinin diline göre "çevrilmiş" gibi görünmemelidir.
export const testimonials: Testimonial[] = [
  // Türkçe (14)
  {
    quote:
      "Yıllardır diş hekimi korkum vardı ama Dr. İnan'ın kliniğinde hiç böyle hissetmedim. Herkes çok ilgiliydi, gülüşüm şu an hayalimdeki gibi.",
    name: "Elif Y.",
  },
  {
    quote:
      "İmplant için araştırma yaparken çok kararsızdım, doğru yeri bulduğuma şimdi eminim. Sonuç gerçekten doğal duruyor.",
    name: "Mehmet K.",
  },
  {
    quote:
      "Kanal tedavisi olacağım için çok endişeliydim, hiç ağrı hissetmedim bile. Ellerinize sağlık.",
    name: "Ayşe D.",
  },
  {
    quote:
      "Gülüş tasarımı öncesi ve sonrası fotoğraflarıma bakınca inanamıyorum, tam istediğim gibi oldu.",
    name: "Burak S.",
  },
  {
    quote:
      "Lamina yaptırdım, hem doğal görünüyor hem de çok sağlam duruyor. Kesinlikle tavsiye ederim.",
    name: "Zeynep A.",
  },
  {
    quote:
      "Diş beyazlatma sonrası gülüşüm bambaşka oldu, hiç hassasiyet de yaşamadım.",
    name: "Cem T.",
  },
  {
    quote:
      "Randevu almaktan tedaviye kadar her aşama çok profesyoneldi, hiç beklemedim.",
    name: "Selin R.",
  },
  {
    quote:
      "Ailemle birlikte gittik, hepimiz çok memnun kaldık, çocuğumun tedavisinde bile çok sabırlıydılar.",
    name: "Hakan Ö.",
  },
  {
    quote:
      "Önceden farklı bir yerde kötü bir deneyim yaşamıştım, burada kendimi tamamen güvende hissettim.",
    name: "Derya M.",
  },
  {
    quote:
      "İnley-onley yaptırdım, dişim sanki hiç dokunulmamış gibi duruyor.",
    name: "Onur B.",
  },
  {
    quote:
      "Uzun zamandır ertelediğim tedaviyi sonunda yaptırdım, keşke daha önce gelseymişim.",
    name: "Gizem K.",
  },
  {
    quote: "Kliniğin havası çok sakin ve temiz, kendimi hep rahat hissettim.",
    name: "Emre Y.",
  },
  {
    quote:
      "Fiyat ve kalite dengesinden de çok memnun kaldım, kaliteden hiç ödün verilmemiş.",
    name: "Nazlı Ç.",
  },
  {
    quote:
      "Dr. İnan her adımı tek tek anlattı, hiçbir zaman kendimi bilgisiz hissetmedim.",
    name: "Kerem A.",
  },
  // English (3)
  {
    quote:
      "I was nervous about traveling abroad for treatment, but the whole team made me feel completely at ease. My smile looks incredible now.",
    name: "Sarah T.",
  },
  {
    quote:
      "Best decision I've made for my smile. The veneers look so natural, nobody can tell they're not my real teeth.",
    name: "James O.",
  },
  {
    quote:
      "From the first consultation to the final result, everything was handled with real care. Highly recommend it.",
    name: "Rachel M.",
  },
  // Français (2)
  {
    quote:
      "J'avais peur de me faire soigner à l'étranger, mais tout s'est passé à la perfection. Mon sourire a complètement changé ma confiance en moi.",
    name: "Camille B.",
  },
  {
    quote:
      "Un résultat vraiment naturel, et une équipe adorable du début à la fin. Je recommande sans hésiter.",
    name: "Nicolas D.",
  },
  // العربية (2)
  {
    quote:
      "كنت خائفة من السفر للعلاج في الخارج، لكن كل شيء سار بسلاسة وشعرت بالأمان في كل خطوة. ابتسامتي الآن أجمل بكثير.",
    name: "سارة م.",
  },
  {
    quote:
      "النتيجة فاقت توقعاتي تمامًا، والفريق كان محترفًا ومتفهمًا طوال فترة العلاج.",
    name: "يوسف ع.",
  },
  // Español (1)
  {
    quote:
      "Viajar para tratarme daba un poco de miedo, pero desde el primer momento me sentí en confianza. El resultado es totalmente natural.",
    name: "Laura G.",
  },
];
