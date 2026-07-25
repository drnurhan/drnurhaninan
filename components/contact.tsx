import { useTranslations } from "next-intl";
import { MapPin, Clock, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";

export function Contact() {
  const t = useTranslations("Contact");

  return (
    <section id="contact" className="bg-surface">
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

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={120} className="space-y-6">
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-line shadow-[var(--shadow-soft)]">
              <iframe
                src={siteConfig.mapEmbedUrl}
                title={t("mapTitle")}
                loading="lazy"
                className="h-72 w-full sm:h-80"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <InfoCard
                icon={<MapPin size={20} />}
                title={t("info.addressTitle")}
              >
                <p>{siteConfig.addressLine}</p>
                <p className="mt-1 text-xs text-ink-soft/70">
                  {t("info.addressNote")}
                </p>
              </InfoCard>

              <InfoCard
                icon={<Clock size={20} />}
                title={t("info.hoursTitle")}
              >
                <p>{t("info.hoursValue")}</p>
                <p className="mt-1 text-xs text-ink-soft/70">
                  {t("info.hoursNote")}
                </p>
              </InfoCard>

              <InfoCard
                icon={<Phone size={20} />}
                title={t("info.phoneTitle")}
              >
                <a
                  href={`tel:${siteConfig.phoneTel}`}
                  className="hover:text-primary"
                >
                  {siteConfig.phoneDisplay}
                </a>
                <p className="mt-1 text-xs text-ink-soft/70">
                  {t("info.phoneNote")}
                </p>
              </InfoCard>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-bg p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-tint text-primary">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-1 text-sm text-ink-soft">{children}</div>
    </div>
  );
}
