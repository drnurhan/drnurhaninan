// Tek yerden yönetilen site sabitleri. Gerçek değerler geldiğinde sadece burası güncellenir.
export const siteConfig = {
  domain: "drnurhaninan.com",
  url: "https://drnurhaninan.com",
  email: "info@drnurhaninan.com",
  // TODO: gerçek telefon/WhatsApp numarası ile değiştirilecek.
  phoneDisplay: "+90 XXX XXX XX XX",
  phoneTel: "+90XXXXXXXXXX",
  whatsappNumber: "90XXXXXXXXXX",
  whatsappUrl: "https://wa.me/90XXXXXXXXXX",
  // TODO: açık adres satırı (mahalle/cadde) eklenecek.
  addressLine: "Plaza 224, Kat 4, No 24 – Nilüfer / Bursa",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Plaza%20224%20Nil%C3%BCfer%20Bursa&output=embed",
} as const;
