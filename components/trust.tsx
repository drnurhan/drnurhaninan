import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Reveal } from "@/components/reveal";

type Stat = { value: string; label: string };
type Testimonial = { quote: string; name: string };

export function Trust() {
  const t = useTranslations("Trust");
  const stats = t.raw("stats") as Stat[];
  const testimonials = t.raw("testimonials") as Testimonial[];

  return (
    <section id="trust" className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal className="max-w-xl">
          <p className="font-semibold uppercase tracking-wide text-accent">
            {t("kicker")}
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        {/* ÖRNEK VERİ — gerçeği gelecek: rakamlar messages/*.json > Trust.stats içinde */}
        <Reveal delay={100}>
          <dl className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[var(--radius-card)] border border-white/15 bg-white/5 p-6 text-center"
              >
                <dd className="font-serif text-3xl text-accent sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-sm text-white/80">{stat.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-white/50">{t("statsNote")}</p>
        </Reveal>

        {/* ÖRNEK YORUM — gerçek hasta yorumlarıyla değiştirilecek: Trust.testimonials */}
        <Reveal delay={200}>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="rounded-[var(--radius-card)] bg-white/5 p-6 sm:p-8"
              >
                <div className="flex gap-1 text-accent" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-accent" />
                  ))}
                </div>
                <blockquote className="mt-4 text-white/90">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-white/70">
                  — {testimonial.name}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/50">{t("testimonialsNote")}</p>
        </Reveal>
      </div>
    </section>
  );
}
