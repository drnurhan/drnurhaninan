import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { googleReviews } from "@/lib/google-reviews";

export function GoogleRating() {
  const t = useTranslations("Trust");
  const locale = useLocale();
  const rating = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(googleReviews.rating);
  const filled = Math.round(googleReviews.rating);

  return (
    <div className="mx-auto max-w-2xl rounded-[var(--radius-card)] border border-white/15 bg-white/5 p-6 text-center sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-light">
        {t("googleLabel")}
      </p>
      <div className="mt-4 flex items-center justify-center gap-4">
        <span className="font-serif text-5xl text-white">{rating}</span>
        <div
          role="img"
          aria-label={t("googleStarsAria", { rating })}
          className="flex gap-1 text-accent"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={26}
              aria-hidden="true"
              className={i < filled ? "fill-accent" : ""}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-white/70">
        {t("googleCount", { count: googleReviews.count })}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={googleReviews.writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-3 font-semibold text-primary-deep transition-colors hover:bg-accent-light"
        >
          {t("googleRate")}
        </a>
        <a
          href={googleReviews.readReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
        >
          {t("googleRead")}
        </a>
      </div>
    </div>
  );
}
