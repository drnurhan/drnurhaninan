"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

const navItems = ["trust", "services", "about", "contact"] as const;

export function Header() {
  const t = useTranslations("Header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="brand-mark h-9 w-9 shrink-0 sm:h-10 sm:w-10"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-urbanist text-lg font-semibold text-ink sm:text-xl">
              {t("logoName")}
            </span>
            <span className="text-xs text-ink-soft sm:text-sm">
              {t("logoTagline")}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-sm text-ink-soft transition-colors hover:text-primary"
            >
              {t(`nav.${item}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? t("menuClose") : t("menuOpen")}
            className="rounded-full p-2 text-ink md:hidden"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-line bg-bg px-4 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-base text-ink-soft transition-colors hover:text-primary"
              >
                {t(`nav.${item}`)}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
