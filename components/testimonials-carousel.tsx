"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/lib/testimonials";

export function TestimonialsCarousel() {
  const t = useTranslations("Trust");
  const [index, setIndex] = useState(0);

  const total = testimonials.length;
  const current = testimonials[index];

  function goPrev() {
    setIndex((i) => (i - 1 + total) % total);
  }

  function goNext() {
    setIndex((i) => (i + 1) % total);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label={t("previousLabel")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>

        <figure className="min-h-[13rem] flex-1 rounded-[var(--radius-card)] bg-white/5 p-6 text-center sm:p-8">
          <div className="flex justify-center gap-1 text-accent" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-accent" />
            ))}
          </div>
          <blockquote className="mt-4 text-white/90">
            “{current.quote}”
          </blockquote>
          <figcaption className="mt-4 text-sm font-semibold text-white/70">
            — {current.name}
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={goNext}
          aria-label={t("nextLabel")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-white/70">
        {index + 1} / {total}
      </div>
    </div>
  );
}
