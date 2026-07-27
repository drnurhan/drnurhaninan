import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";
import { BlogCarousel } from "@/components/blog-carousel";
import { getAllPosts } from "@/lib/blog";

export function BlogSection() {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const posts = getAllPosts();

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal className="max-w-xl">
          <p className="font-semibold uppercase tracking-wide text-accent-light">
            {t("kicker")}
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-white/80">{t("subtitle")}</p>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <BlogCarousel
            posts={posts}
            locale={locale}
            readMoreLabel={t("readMoreLabel")}
            prevLabel={t("prevLabel")}
            nextLabel={t("nextLabel")}
            viewAllLabel={t("viewAllLabel")}
          />
        </Reveal>
      </div>
    </section>
  );
}
