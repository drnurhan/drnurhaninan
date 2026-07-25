import { useTranslations } from "next-intl";
import { Reveal } from "@/components/reveal";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";

type Stat = { value: string; label: string; note?: string };

export function Trust() {
  const t = useTranslations("Trust");
  const stats = t.raw("stats") as Stat[];

  return (
    <section id="trust" className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal className="max-w-xl">
          <p className="font-semibold uppercase tracking-wide text-accent-light">
            {t("kicker")}
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[var(--radius-card)] border border-white/15 bg-white/5 p-6 text-center"
              >
                <dd className="font-serif text-3xl text-accent sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-sm text-white/80">{stat.label}</dt>
                {stat.note && (
                  <p className="mt-1 text-xs text-white/70">{stat.note}</p>
                )}
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10">
            <TestimonialsCarousel />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
