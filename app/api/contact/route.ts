import { NextResponse, after } from "next/server";
import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site-config";

// SMTP el sıkışması bazen fonksiyonun tarayıcıya cevap dönme süresine yakın
// sürüyordu: mail Hostinger'a gönderiliyor ama yanıt zamanında dönmediği için
// formda "gönderilemedi" hatası görünüyordu. Çözüm: tarayıcıya hemen cevap
// dön, gerçek gönderimi `after()` ile yanıt döndükten SONRA arka planda yap.
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

  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpPassword) {
    // SMTP_PASSWORD tanımlı değil: isteği logla, kullanıcıya nazikçe bildir.
    console.log("[contact] SMTP_PASSWORD tanımlı değil, form isteği:", {
      ...body,
    });
    return NextResponse.json({ ok: true, delivered: false });
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

  // Gerçek SMTP gönderimi, yanıt tarayıcıya döndükten sonra arka planda
  // çalışır — tarayıcı SMTP'nin ne kadar süreceğini beklemez.
  after(async () => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.hostinger.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER || siteConfig.email,
          pass: smtpPassword,
        },
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

      console.log("[contact] Mail başarıyla gönderildi:", body.name);
    } catch (error) {
      console.error("[contact] SMTP gönderim hatası (arka plan):", error);
    }
  });

  return NextResponse.json({ ok: true, delivered: true });
}
