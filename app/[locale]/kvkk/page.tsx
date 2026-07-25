import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Kvkk" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}/kvkk`])
  );

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/kvkk`,
      languages: {
        ...languages,
        "x-default": `${siteConfig.url}/${routing.defaultLocale}/kvkk`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("metaDescription"),
      url: `${siteConfig.url}/${locale}/kvkk`,
      siteName: "Dr. Nurhan İnan",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("metaDescription"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function KvkkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Kvkk");
  const body = t.raw("body") as string[];

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">
        {t("title")}
      </h1>

      {/* Bu içerik bir taslaktır — yayına almadan önce hukuki kontrol gerekir. */}
      <p className="mt-4 rounded-[var(--radius-input)] border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-ink-soft">
        {t("disclaimer")}
      </p>

      <div className="mt-8 space-y-4 text-ink-soft">
        {body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
