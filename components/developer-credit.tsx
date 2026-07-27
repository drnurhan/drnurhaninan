"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Mail, Phone, X } from "lucide-react";

// "Developed by" satırındaki kişisel iletişim linki — tasarım/geliştirme
// kredisi gibi bilinçli olarak site diline bakılmaksızın sabit kalır,
// bu yüzden metinleri i18n üzerinden değil doğrudan burada tutuyoruz.
export function DeveloperCredit() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="underline underline-offset-2 hover:text-white/80"
      >
        Ufuk Yılmaz
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            />

            <div
              role="dialog"
              aria-modal="true"
              className="motion-safe:animate-[bottom-sheet-in_0.3s_ease-out] absolute inset-x-0 bottom-0 mx-auto w-full max-w-sm rounded-t-[var(--radius-card)] border border-line bg-surface p-2 pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-medium)]"
            >
              <div className="mx-auto mb-1 mt-2 h-1 w-10 rounded-full bg-line" />

              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-sm font-semibold text-ink">Ufuk Yılmaz</p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Kapat"
                  className="rounded-full p-1.5 text-ink-soft hover:bg-bg hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1 p-1">
                <a
                  href="mailto:ufukyilmazim@gmail.com"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-[var(--radius-input)] px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-bg"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-ink">
                    <Mail size={16} />
                  </span>
                  Mail Gönder
                </a>
                <a
                  href="tel:+905413202300"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-[var(--radius-input)] px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-bg"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-ink">
                    <Phone size={16} />
                  </span>
                  Ara
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
