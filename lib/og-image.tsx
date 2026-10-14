import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

async function loadGoogleFont(family: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);

  if (match) {
    const response = await fetch(match[1]);
    if (response.ok) return response.arrayBuffer();
  }
  return null;
}

const taglineByLocale: Record<string, string> = {
  tr: "Estetik & Restoratif Diş Hekimliği",
  en: "Aesthetic & Restorative Dentistry",
  ar: "طب الأسنان التجميلي والترميمي",
  de: "Ästhetische & Restaurative Zahnheilkunde",
  fr: "Dentisterie Esthétique et Restauratrice",
  el: "Αισθητική & Αποκαταστατική Οδοντιατρική",
  es: "Odontología Estética y Restauradora",
  it: "Odontoiatria Estetica e Restaurativa",
  pl: "Stomatologia Estetyczna i Rekonstrukcyjna",
  no: "Estetisk & Restaurativ Tannbehandling",
  ru: "Эстетическая и Восстановительная Стоматология",
};

export async function renderDentistOgImage(locale: string) {
  const tagline = taglineByLocale[locale] ?? taglineByLocale.en;
  const fontFamily = locale === "ar" ? "IBM+Plex+Sans+Arabic:wght@600" : "Inter:wght@600";
  const fontData = await loadGoogleFont(
    fontFamily,
    `Dr. Nurhan İnan${tagline}${siteConfig.domain}`
  );

  const logoBuffer = await readFile(
    join(process.cwd(), "public/images/n_logo_gold.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0E4E4A",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "18px solid rgba(217,188,126,0.35)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={120} height={120} alt="" />
        <div
          style={{
            marginTop: 36,
            fontSize: 64,
            fontWeight: 600,
            color: "#FFFFFF",
            fontFamily: fontData ? "brand" : undefined,
          }}
        >
          Dr. Nurhan İnan
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            color: "#D9BC7E",
            fontFamily: fontData ? "brand" : undefined,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
            fontFamily: fontData ? "brand" : undefined,
          }}
        >
          {siteConfig.domain}
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: fontData
        ? [{ name: "brand", data: fontData, weight: 600 as const }]
        : undefined,
    }
  );
}
