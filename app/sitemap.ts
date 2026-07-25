import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

function languageAlternates(pathSuffix: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      `${siteConfig.url}/${locale}${pathSuffix}`,
    ])
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${siteConfig.url}/${routing.defaultLocale}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: languageAlternates("") },
    },
    {
      url: `${siteConfig.url}/${routing.defaultLocale}/kvkk`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: languageAlternates("/kvkk") },
    },
  ];
}
