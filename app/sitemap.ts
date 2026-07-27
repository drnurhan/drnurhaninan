import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";

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
  const posts = getAllPosts();

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
    {
      url: `${siteConfig.url}/${routing.defaultLocale}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: languageAlternates("/blog") },
    },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/${routing.defaultLocale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: { languages: languageAlternates(`/blog/${post.slug}`) },
    })),
  ];
}
