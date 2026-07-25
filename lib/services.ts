import { Sparkles, type LucideIcon } from "lucide-react";

export const serviceIds = [
  "smileDesign",
  "veneers",
  "inlayOnlay",
  "rootCanal",
  "implant",
  "whitening",
] as const;

export type ServiceId = (typeof serviceIds)[number];

// Bu bölümdeki tüm kartlarda kullanıcı isteğiyle tek bir ikon (Sparkles) kullanılıyor.
export const serviceIcons: Record<ServiceId, LucideIcon> = {
  smileDesign: Sparkles,
  veneers: Sparkles,
  inlayOnlay: Sparkles,
  rootCanal: Sparkles,
  implant: Sparkles,
  whitening: Sparkles,
};
