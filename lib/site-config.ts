// Tek yerden yönetilen site sabitleri. Gerçek değerler geldiğinde sadece burası güncellenir.
export const siteConfig = {
  domain: "drnurhaninan.com",
  url: "https://drnurhaninan.com",
  email: "info@drnurhaninan.com",
  phoneDisplay: "+90 541 682 16 16",
  phoneTel: "+905416821616",
  whatsappNumber: "905416821616",
  whatsappUrl: "https://wa.me/905416821616",
  // TODO: açık adres satırı (mahalle/cadde) eklenecek.
  addressLine: "Plaza 224, Kat 4, No 24 – Nilüfer / Bursa",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Plaza%20224%20Nil%C3%BCfer%20Bursa&output=embed",
} as const;

// Open Graph, BCP-47 tarzı düz dil kodları (tr, en...) değil resmi
// og:locale formatını (tr_TR, en_US...) bekler.
export const ogLocaleMap: Record<string, string> = {
  tr: "tr_TR",
  en: "en_US",
  ar: "ar_AR",
  de: "de_DE",
  fr: "fr_FR",
  el: "el_GR",
  es: "es_ES",
  it: "it_IT",
  pl: "pl_PL",
  no: "nb_NO",
  ru: "ru_RU",
};
