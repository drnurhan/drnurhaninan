import { useTranslations } from "next-intl";
import { InstagramIcon } from "@/components/instagram-icon";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-primary-deep text-white/85">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
        <div>
          <p className="font-serif text-lg text-white">Dr. Nurhan İnan</p>
          <p className="mt-1 text-sm">{t("tagline")}</p>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("instagramAria")}
            className="mt-4 inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-white"
          >
            <InstagramIcon size={18} />
            {siteConfig.instagramHandle}
          </a>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            {t("addressColumnTitle")}
          </p>
          <p className="mt-2 text-sm">{siteConfig.addressLine}</p>
          <p className="mt-1 text-sm">{siteConfig.phoneDisplay}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-1 block text-sm hover:text-white"
          >
            {siteConfig.email}
          </a>
        </div>

        <div className="sm:text-end">
          <p className="text-sm">{t("rights")}</p>
          <p className="mt-1 text-xs text-white/60">
            {/* Bilinçli olarak çevrilmiyor: tasarım/geliştirme kredisi
                site diline bakılmaksızın sabit İngilizce kalır. */}
            Designed &amp; Developed by{" "}
            <a
              href="mailto:ufukyilmazim@gmail.com"
              className="underline underline-offset-2 hover:text-white"
            >
              Ufuk Yılmaz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
