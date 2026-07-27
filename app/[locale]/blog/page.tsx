import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ogLocaleMap, siteConfig } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";
import { BlogPostCard } from "@/components/blog-post-card";
import { Reveal } from "@/components/reveal";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}/blog`])
  );

  return {
    title: `${t("pageTitle")} | Dr. Nurhan İnan`,
    description: t("subtitle"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages: {
        ...languages,
        "x-default": `${siteConfig.url}/${routing.defaultLocale}/blog`,
      },
    },
    openGraph: {
      title: `${t("pageTitle")} | Dr. Nurhan İnan`,
      description: t("subtitle"),
      url: `${siteConfig.url}/${locale}/blog`,
      siteName: "Dr. Nurhan İnan",
      locale: ogLocaleMap[locale] ?? "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Blog");
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <Reveal className="max-w-xl">
        <p className="font-semibold uppercase tracking-wide text-accent-strong">
          {t("kicker")}
        </p>
        <h1 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-ink-soft">{t("subtitle")}</p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 60}>
            <BlogPostCard
              post={post}
              locale={locale}
              readMoreLabel={t("readMoreLabel")}
              className="h-full"
            />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
