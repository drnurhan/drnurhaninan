"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, GraduationCap, Award, Users, Languages } from "lucide-react";
import { Reveal } from "@/components/reveal";

export function About() {
  const t = useTranslations("About");
  const [isExpanded, setIsExpanded] = useState(false);

  const educationItems = t.raw("sections.education.items") as string[];
  const certificateItems = t.raw("sections.certificates.items") as string[];
  const membershipItems = t.raw("sections.memberships.items") as string[];

  return (
    <section id="about" className="bg-bg">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-start md:py-24 lg:px-8">
        <Reveal>
          <div className="mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[var(--radius-card)] border border-line bg-primary-tint shadow-[var(--shadow-soft)] md:mx-0">
            <div className="flex h-full w-full items-center justify-center px-8 text-center">
              <p className="text-sm text-ink-soft">
                {t("imageAlt")}
                <br />
                <span className="text-xs">
                  /public/images/doctor-about.jpg
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="font-semibold uppercase tracking-wide text-accent">
            {t("kicker")}
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-ink-soft">{t("text")}</p>

          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            aria-expanded={isExpanded}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-deep"
          >
            {isExpanded ? t("collapseLabel") : t("expandLabel")}
            <ChevronDown
              size={16}
              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
            <div className="mt-6 space-y-5 border-t border-line pt-6">
              {/* TODO — gerçek bilgiler eklenecek: About.sections içinde */}
              <div className="flex gap-3">
                <GraduationCap size={20} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold text-ink">
                    {t("sections.education.title")}
                  </h3>
                  <ul className="mt-1 text-sm text-ink-soft">
                    {educationItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Award size={20} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold text-ink">
                    {t("sections.certificates.title")}
                  </h3>
                  <ul className="mt-1 text-sm text-ink-soft">
                    {certificateItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Users size={20} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold text-ink">
                    {t("sections.memberships.title")}
                  </h3>
                  <ul className="mt-1 text-sm text-ink-soft">
                    {membershipItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Languages size={20} className="mt-0.5 shrink-0 text-primary" />
                <p className="text-sm text-ink-soft">
                  {t("internationalLine")}
                </p>
              </div>
            </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
