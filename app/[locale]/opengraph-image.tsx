import { ogImageContentType, ogImageSize, renderDentistOgImage } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Dr. Nurhan İnan – Estetik & Restoratif Diş Hekimliği";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return renderDentistOgImage(locale);
}
