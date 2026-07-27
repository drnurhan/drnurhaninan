"use client";

import { useState, useSyncExternalStore } from "react";
import { Share2, Link2, Check } from "lucide-react";

// navigator.share desteği tarayıcıya bağlı olduğu için SSR'da bilinemez;
// useSyncExternalStore ile sunucuda "yok" varsayılır, hydration sonrası
// gerçek değere geçilir (effect içinde setState çağırmadan).
function getNativeShareSnapshot() {
  return typeof navigator !== "undefined" && "share" in navigator;
}
function getNativeShareServerSnapshot() {
  return false;
}
function subscribeNativeShare() {
  return () => {};
}

// lucide-react marka ikonlarını kaldırdığı için WhatsApp burada da özel bir
// SVG ile çiziliyor (bkz. instagram-icon.tsx ile aynı gerekçe).
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.26.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.55-3.7 8.25-8.24 8.25a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.55 3.7-8.25 8.25-8.25M8.53 6.9c-.17 0-.45.06-.68.32-.24.25-.9.88-.9 2.14s.92 2.48 1.05 2.65c.13.17 1.8 2.76 4.38 3.76.6.24 1.07.38 1.44.48.6.17 1.15.14 1.58.09.48-.06 1.5-.61 1.71-1.2.21-.58.21-1.09.15-1.19-.06-.11-.24-.17-.5-.3-.26-.13-1.5-.74-1.74-.83-.23-.08-.4-.13-.57.13-.17.26-.65.83-.8 1-.15.17-.29.19-.55.06-.26-.13-1.09-.4-2.08-1.28-.77-.68-1.29-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.11.26-.29.39-.44.13-.14.17-.25.26-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.4-.8-1.91-.2-.48-.42-.44-.57-.45z" />
    </svg>
  );
}

export function BlogShare({
  title,
  url,
  shareLabel,
  whatsappLabel,
  copyLabel,
  copiedLabel,
}: {
  title: string;
  url: string;
  shareLabel: string;
  whatsappLabel: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(
    subscribeNativeShare,
    getNativeShareSnapshot,
    getNativeShareServerSnapshot
  );

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // Kullanıcı paylaşım panelini iptal etti; yapılacak bir şey yok.
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API engellenmişse sessizce yoksay.
    }
  }

  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-primary-ink hover:text-primary-ink";

  return (
    <div className="flex items-center gap-3">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsappLabel}
        className={buttonClass}
      >
        <WhatsAppIcon size={18} />
      </a>

      {/* Instagram için genel bir web paylaşım linki yok; mobilde native
          paylaşım paneli (Web Share API) Instagram dahil yüklü tüm
          uygulamaları listeler. */}
      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label={shareLabel}
          className={buttonClass}
        >
          <Share2 size={18} />
        </button>
      )}

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : copyLabel}
        className={buttonClass}
      >
        {copied ? <Check size={18} /> : <Link2 size={18} />}
      </button>
    </div>
  );
}
