import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { BlogPostMeta } from "@/lib/blog";

export function BlogPostCard({
  post,
  locale,
  readMoreLabel,
  variant = "light",
  className = "",
}: {
  post: BlogPostMeta;
  locale: string;
  readMoreLabel: string;
  variant?: "light" | "dark";
  className?: string;
}) {
  // CSS text-transform:uppercase harf sıralamasından habersizdir ve Türkçe
  // noktalı "i"yi yanlış şekilde "I"ya çevirir (Nisan/Ekim gibi ay adlarında
  // sorun çıkarır); bu yüzden metni burada, locale-duyarlı şekilde büyütüyoruz.
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date(post.date))
    .toLocaleUpperCase(locale);

  const isDark = variant === "dark";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col rounded-[var(--radius-card)] border p-6 transition-all hover:-translate-y-1 ${
        isDark
          ? "border-white/15 bg-white/5 hover:border-accent-light"
          : "border-line bg-surface shadow-[var(--shadow-soft)] hover:border-accent hover:shadow-[var(--shadow-medium)]"
      } ${className}`}
    >
      <p
        className={`text-xs font-semibold tracking-wide ${
          isDark ? "text-accent-light" : "text-accent-strong"
        }`}
      >
        {formattedDate}
      </p>
      <h3
        className={`mt-3 font-serif text-lg leading-snug ${
          isDark ? "text-white" : "text-ink"
        }`}
      >
        {post.title}
      </h3>
      <p
        className={`mt-2 flex-1 text-sm leading-relaxed ${
          isDark ? "text-white/75" : "text-ink-soft"
        }`}
      >
        {post.excerpt}
      </p>
      <span
        className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
          isDark
            ? "text-accent-light group-hover:text-white"
            : "text-primary-ink group-hover:text-primary-ink-deep"
        }`}
      >
        {readMoreLabel}
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
