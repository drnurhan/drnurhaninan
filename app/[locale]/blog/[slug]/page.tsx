import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { ogLocaleMap, siteConfig } from "@/lib/site-config";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/blog";
import { getBlogPostingSchema } from "@/lib/structured-data";
import { blogMdxComponents } from "@/components/blog-mdx-components";
import { BlogShare } from "@/components/blog-share";
import { Reveal } from "@/components/reveal";

export function generateStaticParams() {
  const posts = getAllPosts();
  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}/blog/${slug}`])
  );

  return {
    title: `${post.title} | Dr. Nurhan İnan`,
    description: post.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog/${slug}`,
      languages: {
        ...languages,
        "x-default": `${siteConfig.url}/${routing.defaultLocale}/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/${locale}/blog/${slug}`,
      siteName: "Dr. Nurhan İnan",
      locale: ogLocaleMap[locale] ?? "en_US",
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations("Blog");
  const { previous, next } = getAdjacentPosts(slug);
  // CSS uppercase yerine burada locale-duyarlı büyütme kullanıyoruz (Nisan/
  // Ekim gibi Türkçe ay adlarındaki noktalı "i" harfi CSS text-transform ile
  // yanlış büyütülüyor).
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date(post.date))
    .toLocaleUpperCase(locale);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBlogPostingSchema(post, locale)),
        }}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-primary-ink"
      >
        <ChevronLeft size={16} />
        {t("backLabel")}
      </Link>

      <Reveal className="mt-6">
        <p className="text-xs font-semibold tracking-wide text-accent-strong">
          {formattedDate}
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
      </Reveal>

      <Reveal delay={100} className="mt-10">
        <MDXRemote source={post.content} components={blogMdxComponents} />
      </Reveal>

      <div className="mt-10 flex items-center gap-3 border-t border-line pt-8">
        <span className="text-sm font-semibold text-ink-soft">
          {t("shareLabel")}
        </span>
        <BlogShare
          title={post.title}
          url={`${siteConfig.url}/${locale}/blog/${slug}`}
          shareLabel={t("shareLabel")}
          whatsappLabel={t("shareWhatsappLabel")}
          copyLabel={t("copyLinkLabel")}
          copiedLabel={t("linkCopiedLabel")}
        />
      </div>

      {(previous || next) && (
        <div className="mt-16 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-accent"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-accent-strong">
                <ChevronLeft size={14} />
                {t("prevPostLabel").toLocaleUpperCase(locale)}
              </span>
              <span className="mt-2 font-serif text-lg text-ink group-hover:text-primary-ink">
                {previous.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 text-right transition-colors hover:border-accent sm:items-end"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-accent-strong">
                {t("nextPostLabel").toLocaleUpperCase(locale)}
                <ChevronRight size={14} />
              </span>
              <span className="mt-2 font-serif text-lg text-ink group-hover:text-primary-ink">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </main>
  );
}
