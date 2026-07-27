"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone } from "lucide-react";

// "Developed by" satırındaki kişisel iletişim linki — tasarım/geliştirme
// kredisi gibi bilinçli olarak site diline bakılmaksızın sabit kalır,
// bu yüzden metinleri i18n üzerinden değil doğrudan burada tutuyoruz.
export function DeveloperCredit() {
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
    <span ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="underline underline-offset-2 hover:text-white/80"
      >
        Ufuk Yılmaz
      </button>

      {isOpen && (
        <span
          role="menu"
          className="absolute bottom-full end-0 z-10 mb-2 w-44 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface text-start shadow-[var(--shadow-medium)]"
        >
          <a
            role="menuitem"
            href="mailto:ufukyilmazim@gmail.com"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-bg"
          >
            <Mail size={14} className="text-primary-ink" />
            Mail Gönder
          </a>
          <a
            role="menuitem"
            href="tel:+905413202300"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 border-t border-line px-4 py-2.5 text-sm text-ink transition-colors hover:bg-bg"
          >
            <Phone size={14} className="text-primary-ink" />
            Ara
          </a>
        </span>
      )}
    </span>
  );
}
