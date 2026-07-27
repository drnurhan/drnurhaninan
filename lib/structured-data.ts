import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import type { BlogPost } from "@/lib/blog";

// schema.org Dentist (LocalBusiness) yapısal verisi — Google'ın yerel işletme
// zengin sonuçları (rich results) için kullanılır. Sadece doğrulanmış gerçek
// verileri içerir; bilinmeyen alanlar (geo, aggregateRating vb.) gerçek veri
// gelene kadar bilinçli olarak eklenmez.
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
    sameAs: [siteConfig.whatsappUrl, siteConfig.instagramUrl],
    inLanguage: routing.locales,
    availableLanguage: routing.locales,
    hasMap: siteConfig.mapEmbedUrl,
  };
}

// Blog yazıları için schema.org BlogPosting verisi — Google'da makale
// zengin sonuçları (yazar, tarih) için kullanılır.
export function getBlogPostingSchema(post: BlogPost, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Dr. Nurhan İnan",
    },
    publisher: {
      "@type": "Organization",
      name: "Dr. Nurhan İnan",
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/${locale}/blog/${post.slug}`,
  };
}
