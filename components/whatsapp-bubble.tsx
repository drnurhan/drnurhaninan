"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Phone, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { siteConfig } from "@/lib/site-config";

export function WhatsappBubble() {
  const t = useTranslations("WhatsappBubble");
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
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

  const whatsappHref = `${siteConfig.whatsappUrl}?text=${encodeURIComponent(
    t("message")
  )}`;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 end-5 z-50"
      onMouseEnter={() => setHasInteracted(true)}
    >
      {isOpen && (
        <div
          role="menu"
          className="absolute bottom-full end-0 mb-3 w-60 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-medium)]"
        >
          <a
            role="menuitem"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-bg"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsAppIcon size={16} />
            </span>
            {t("chatLabel")}
          </a>
          <a
            role="menuitem"
            href={`tel:${siteConfig.phoneTel}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 border-t border-line px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-bg"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-ink">
              <Phone size={16} />
            </span>
            {t("callLabel")}
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setHasInteracted(true);
          setIsOpen((open) => !open);
        }}
        aria-label={t("ariaLabel")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-medium)] transition-transform hover:scale-105 ${
          hasInteracted
            ? ""
            : "motion-safe:animate-[whatsapp-pulse_2.4s_ease-in-out_infinite]"
        }`}
      >
        {isOpen ? <X size={26} /> : <WhatsAppIcon size={28} />}
      </button>
    </div>
  );
}
