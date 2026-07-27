import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { BlogPostMeta } from "@/lib/blog";

export function BlogPostCard({
  post,
  locale,
  readMoreLabel,
  className = "",
}: {
  post: BlogPostMeta;
  locale: string;
  readMoreLabel: string;
  className?: string;
}) {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.date));

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-medium)] ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-strong">
        {formattedDate}
      </p>
      <h3 className="mt-3 font-serif text-lg leading-snug text-ink">
        {post.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
        {post.excerpt}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-primary-deep">
        {readMoreLabel}
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
