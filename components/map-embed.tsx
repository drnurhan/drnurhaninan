"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function MapEmbed({
  title,
  loadLabel,
}: {
  title: string;
  loadLabel: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return (
      <iframe
        src={siteConfig.mapEmbedUrl}
        title={title}
        loading="lazy"
        className="h-72 w-full sm:h-80"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsLoaded(true)}
      className="flex h-72 w-full flex-col items-center justify-center gap-3 bg-primary-tint text-primary transition-colors hover:bg-primary-tint/70 sm:h-80"
    >
      <MapPin size={28} />
      <span className="text-sm font-semibold">{loadLabel}</span>
    </button>
  );
}
