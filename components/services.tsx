import { useTranslations } from "next-intl";
import { serviceIcons, serviceIds } from "@/lib/services";
import { Reveal } from "@/components/reveal";

export function Services() {
  const t = useTranslations("Services");

  return (
    <section id="services" className="bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal className="max-w-xl">
          <p className="font-semibold uppercase tracking-wide text-accent">
            {t("kicker")}
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-ink-soft">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceIds.map((id, index) => {
            const Icon = serviceIcons[id];
            return (
              <Reveal key={id} delay={index * 60}>
                <div className="group h-full rounded-[var(--radius-card)] border border-line bg-surface p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-medium)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-ink">
                    {t(`items.${id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {t(`items.${id}.description`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
