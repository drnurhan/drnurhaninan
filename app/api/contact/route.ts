import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site-config";

// SMTP el sıkışması bazen varsayılan fonksiyon süresine yakın sürebiliyor;
// bu da mail gönderilmesine rağmen tarayıcıya zamanında cevap dönmemesine
// (ve formda "gönderilemedi" hatası görünmesine) yol açıyordu.
export const maxDuration = 30;

type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  preferredDate?: string | null;
  timePreference?: string | null;
  message?: string;
  kvkkConsent: boolean;
  locale: string;
};

const subjectLabels: Record<string, string> = {
  appointment: "Randevu Talebi",
  pricing: "Tedavi ve Fiyat Bilgisi",
  international: "Uluslararası Hasta",
  general: "Genel Soru",
  other: "Diğer",
};

const timeLabels: Record<string, string> = {
  morning: "Sabah",
  noon: "Öğlen",
  evening: "Akşam",
};

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ContactPayload>;

  if (!body.name || !body.phone || !body.kvkkConsent) {
    return NextResponse.json(
      { ok: false, error: "missing-required-fields" },
      { status: 400 }
    );
  }

  const subjectLabel = subjectLabels[body.subject ?? ""] ?? body.subject ?? "-";
  const timeLabel = body.timePreference
    ? timeLabels[body.timePreference] ?? body.timePreference
    : "-";
  const submittedAt = new Date().toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
  });

  const emailBody = [
    `Ad Soyad: ${body.name}`,
    `Telefon: ${body.phone}`,
    `E-posta: ${body.email || "-"}`,
    `Konu: ${subjectLabel}`,
    `Tercih Edilen Tarih: ${body.preferredDate || "-"}`,
    `Zaman Tercihi: ${timeLabel}`,
    `Mesaj: ${body.message || "-"}`,
    `Gönderim Tarihi: ${submittedAt}`,
  ].join("\n");

  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpPassword) {
    // SMTP_PASSWORD henüz tanımlı değil (deploy aşamasında eklenecek): isteği logla, hata verme.
    console.log("[contact] SMTP_PASSWORD tanımlı değil, form isteği:", {
      ...body,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || siteConfig.email,
        pass: smtpPassword,
      },
      // Hostinger yavaş yanıt verirse yığılıp fonksiyon zaman aşımına
      // çarpmak yerine makul bir sürede net bir hata ile düşsün.
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });

    await transporter.sendMail({
      from: `"drnurhaninan.com" <${process.env.SMTP_USER || siteConfig.email}>`,
      to: siteConfig.email,
      replyTo: body.email || undefined,
      subject: `[drnurhaninan.com] ${subjectLabel} – ${body.name}`,
      text: emailBody,
    });

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[contact] SMTP gönderim hatası:", error);
    return NextResponse.json(
      { ok: false, error: "send-failed" },
      { status: 502 }
    );
  }
}
