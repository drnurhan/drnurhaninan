import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en", "ar", "de", "fr", "el", "es", "it", "pl", "no", "ru"],
  defaultLocale: "tr",
  // Ziyaretçinin tarayıcı diline bakılmaksızın site her zaman Türkçe açılsın;
  // dil değişimi sadece header'daki dil seçiciyle yapılır.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
