import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-primary-deep text-white/85">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
        <div>
          <p className="font-serif text-lg text-white">Dr. Nurhan İnan</p>
          <p className="mt-1 text-sm">{t("tagline")}</p>
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
            {t("designedByPrefix")}{" "}
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
