import { Activity, Anchor, Component, Layers, Sparkles, Sun, type LucideIcon } from "lucide-react";

export const serviceIds = [
  "smileDesign",
  "veneers",
  "inlayOnlay",
  "rootCanal",
  "implant",
  "whitening",
] as const;

export type ServiceId = (typeof serviceIds)[number];

// İkon eşleşmeleri tek bu dosyadan yönetilir; metinler messages/*.json içindedir.
export const serviceIcons: Record<ServiceId, LucideIcon> = {
  smileDesign: Sparkles,
  veneers: Layers,
  inlayOnlay: Component,
  rootCanal: Activity,
  implant: Anchor,
  whitening: Sun,
};
