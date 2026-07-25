"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("LanguageSwitcher");
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Language"
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      {routing.locales.map((locale, index) => {
        const isActive = locale === activeLocale;
        return (
          <span key={locale} className="flex items-center gap-2">
            {index > 0 && <span className="text-line" aria-hidden="true">·</span>}
            <Link
              href={pathname}
              locale={locale}
              aria-current={isActive ? "true" : undefined}
              className={
                isActive
                  ? "font-semibold text-primary underline underline-offset-4 decoration-accent"
                  : "text-ink-soft hover:text-primary transition-colors"
              }
            >
              {t(locale)}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
