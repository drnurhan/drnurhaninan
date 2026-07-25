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
