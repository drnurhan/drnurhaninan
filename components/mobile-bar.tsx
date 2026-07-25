import { useTranslations } from "next-intl";
import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function MobileBar() {
  const t = useTranslations("MobileBar");

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-line bg-surface/95 p-3 backdrop-blur-md md:hidden">
      <a
        href={`tel:${siteConfig.phoneTel}`}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white"
      >
        <Phone size={18} />
        {t("call")}
      </a>
      <a
        href={siteConfig.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/30 px-4 py-3 text-sm font-semibold text-primary"
      >
        <MessageCircle size={18} />
        {t("whatsapp")}
      </a>
    </div>
  );
}
