"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BlogPostCard } from "@/components/blog-post-card";
import type { BlogPostMeta } from "@/lib/blog";

export function BlogCarousel({
  posts,
  locale,
  readMoreLabel,
  prevLabel,
  nextLabel,
  viewAllLabel,
}: {
  posts: BlogPostMeta[];
  locale: string;
  readMoreLabel: string;
  prevLabel: string;
  nextLabel: string;
  viewAllLabel: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={prevLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={nextLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <Link
          href="/blog"
          className="hidden items-center gap-1.5 text-sm font-semibold text-accent-light transition-colors hover:text-white sm:inline-flex"
        >
          {viewAllLabel}
          <ChevronRight size={16} />
        </Link>
      </div>

      <div
        ref={scrollerRef}
        className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <div
            key={post.slug}
            className="w-72 shrink-0 snap-start sm:w-80"
          >
            <BlogPostCard
              post={post}
              locale={locale}
              readMoreLabel={readMoreLabel}
              variant="dark"
              className="h-full"
            />
          </div>
        ))}
      </div>

      <Link
        href="/blog"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-light transition-colors hover:text-white sm:hidden"
      >
        {viewAllLabel}
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
