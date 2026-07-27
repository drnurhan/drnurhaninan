import { useTranslations } from "next-intl";
import { MessageCircle, Star, Sparkles as SparklesIcon, Globe2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { HeroSlider } from "@/components/hero-slider";

const clinicImagePaths = [
  "/images/clinic/clinic-1.webp",
  "/images/clinic/clinic-2.webp",
  "/images/clinic/clinic-3.webp",
];

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
        <div>
          <p className="font-semibold uppercase tracking-wide text-accent-strong">
            {t("kicker")}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {t("titlePrefix")}{" "}
            <em className="text-primary-ink italic">{t("titleEmphasis")}</em>{" "}
            {t("titleSuffix")}
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-soft">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              {t("ctaPrimary")}
            </a>
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 px-7 py-3.5 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-tint"
            >
              <MessageCircle size={18} />
              {t("ctaWhatsapp")}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft">
            <span className="flex items-center gap-1.5">
              <Star size={16} className="fill-accent text-accent" />
              {t("trustBar.rating")}
            </span>
            <span className="flex items-center gap-1.5">
              <SparklesIcon size={16} className="text-primary-ink" />
              {t("trustBar.experience")}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 size={16} className="text-primary-ink" />
              {t("trustBar.languages")}
            </span>
          </div>
          {/* ÖRNEK VERİ — gerçek Google puanı ve deneyim yılı eklenecek */}
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-t-[7rem] rounded-b-[20px] border border-line bg-primary-tint shadow-[var(--shadow-medium)]">
          <HeroSlider
            slides={clinicImagePaths.map((src) => ({
              src,
              alt: t("imageAlt"),
            }))}
            dotLabel={t("sliderDotLabel")}
            prevLabel={t("sliderPrevLabel")}
            nextLabel={t("sliderNextLabel")}
          />
        </div>
      </div>
    </section>
  );
}
