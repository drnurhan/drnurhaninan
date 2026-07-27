"use client";

import { useState, useSyncExternalStore } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

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
