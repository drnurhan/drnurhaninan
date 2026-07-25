import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

// schema.org Dentist (LocalBusiness) yapısal verisi — Google'ın yerel işletme
// zengin sonuçları (rich results) için kullanılır. Sadece doğrulanmış gerçek
// verileri içerir; bilinmeyen alanlar (geo, sameAs, aggregateRating vb.)
// gerçek veri gelene kadar bilinçli olarak eklenmez.
export function getDentistSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Dr. Nurhan İnan",
    image: `${siteConfig.url}/images/n_photo.png`,
    url: `${siteConfig.url}/${locale}`,
    telephone: siteConfig.phoneTel,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.addressLine,
      addressLocality: "Nilüfer",
      addressRegion: "Bursa",
      addressCountry: "TR",
    },
    medicalSpecialty: "Dentistry",
    areaServed: ["Bursa", "Turkey"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "15:00",
      },
    ],
    sameAs: [siteConfig.whatsappUrl],
    inLanguage: routing.locales,
    availableLanguage: routing.locales,
    hasMap: siteConfig.mapEmbedUrl,
  };
}
