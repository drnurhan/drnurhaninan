import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

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

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    // RESEND_API_KEY henüz tanımlı değil (deploy aşamasında eklenecek): isteği logla, hata verme.
    console.log("[contact] RESEND_API_KEY tanımlı değil, form isteği:", {
      ...body,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: `drnurhaninan.com <onboarding@resend.dev>`,
      to: siteConfig.email,
      subject: `[drnurhaninan.com] ${subjectLabel} – ${body.name}`,
      text: emailBody,
    });

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[contact] Resend gönderim hatası:", error);
    return NextResponse.json(
      { ok: false, error: "send-failed" },
      { status: 502 }
    );
  }
}
