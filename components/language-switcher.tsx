"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("LanguageSwitcher");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("selectLanguage")}
        className="flex items-center gap-1.5 rounded-full p-2 text-ink-soft transition-colors hover:bg-primary-tint hover:text-primary"
      >
        <Globe size={20} />
        <span className="hidden text-xs font-semibold uppercase sm:inline">
          {activeLocale}
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-[var(--radius-input)] border border-line bg-surface py-1 shadow-[var(--shadow-medium)]"
        >
          {routing.locales.map((locale) => {
            const isActive = locale === activeLocale;
            return (
              <Link
                key={locale}
                href={pathname}
                locale={locale}
                role="menuitem"
                aria-current={isActive ? "true" : undefined}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-primary-tint font-semibold text-primary"
                    : "text-ink-soft hover:bg-bg hover:text-primary"
                }`}
              >
                {t(locale)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
