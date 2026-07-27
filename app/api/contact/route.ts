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
  photoConsent?: boolean;
  locale: string;
};

const subjectLabels: Record<string, string> = {
  appointment: "Randevu Talebi",
  pricing: "Tedavi ve Fiyat Bilgisi",
  international: "Uluslararası Hasta",
  freePhotoAssessment: "Ücretsiz Gülüş Ön Değerlendirmesi (fotoğraflı)",
  general: "Genel Soru",
  other: "Diğer",
};

const timeLabels: Record<string, string> = {
  morning: "Sabah",
  noon: "Öğlen",
  evening: "Akşam",
};

const MAX_PHOTOS = 3;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png"];

async function parseRequest(
  request: Request
): Promise<{ body: Partial<ContactPayload>; photos: File[] }> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const body: Partial<ContactPayload> = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      preferredDate: (formData.get("preferredDate") as string) || null,
      timePreference: (formData.get("timePreference") as string) || null,
      message: String(formData.get("message") || ""),
      kvkkConsent: formData.get("kvkkConsent") === "true",
      photoConsent: formData.get("photoConsent") === "true",
      locale: String(formData.get("locale") || "tr"),
    };
    const photos = formData
      .getAll("photos")
      .filter((entry): entry is File => entry instanceof File);
    return { body, photos };
  }

  const body = (await request.json()) as Partial<ContactPayload>;
  return { body, photos: [] };
}

export async function POST(request: Request) {
  const { body, photos } = await parseRequest(request);

  if (!body.name || !body.phone || !body.kvkkConsent) {
    return NextResponse.json(
      { ok: false, error: "missing-required-fields" },
      { status: 400 }
    );
  }

  const isPhotoAssessment = body.subject === "freePhotoAssessment";

  if (isPhotoAssessment) {
    if (!body.photoConsent) {
      return NextResponse.json(
        { ok: false, error: "missing-photo-consent" },
        { status: 400 }
      );
    }
    if (photos.length === 0 || photos.length > MAX_PHOTOS) {
      return NextResponse.json(
        { ok: false, error: "invalid-photo-count" },
        { status: 400 }
      );
    }
    for (const photo of photos) {
      if (!ACCEPTED_PHOTO_TYPES.includes(photo.type)) {
        return NextResponse.json(
          { ok: false, error: "invalid-photo-type" },
          { status: 400 }
        );
      }
      if (photo.size > MAX_PHOTO_SIZE) {
        return NextResponse.json(
          { ok: false, error: "photo-too-large" },
          { status: 400 }
        );
      }
    }
  }

  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpPassword) {
    // SMTP_PASSWORD tanımlı değil: isteği logla, kullanıcıya nazikçe bildir.
    console.log("[contact] SMTP_PASSWORD tanımlı değil, form isteği:", {
      ...body,
      photos: photos.map((p) => p.name),
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

  const emailLines = [
    `Ad Soyad: ${body.name}`,
    `Telefon: ${body.phone}`,
    `E-posta: ${body.email || "-"}`,
    `Konu: ${subjectLabel}`,
    `Tercih Edilen Tarih: ${body.preferredDate || "-"}`,
    `Zaman Tercihi: ${timeLabel}`,
    `Mesaj: ${body.message || "-"}`,
  ];

  if (isPhotoAssessment) {
    emailLines.push(
      `Fotoğraf Onayı (Açık Rıza): ${body.photoConsent ? "Evet" : "Hayır"}`,
      `Ekli Fotoğraf Sayısı: ${photos.length}`
    );
  }

  emailLines.push(`Gönderim Tarihi: ${submittedAt}`);
  const emailBody = emailLines.join("\n");

  const mailSubject = isPhotoAssessment
    ? `[Ön Değerlendirme] ${body.name}`
    : `[drnurhaninan.com] ${subjectLabel} – ${body.name}`;

  // Attachment dönüşümü (File -> Buffer) yanıt döndürülmeden ÖNCE, senkron
  // akışta yapılır: `request`e bağlı File akışları, after() içinde (yanıt
  // döndükten sonra) artık güvenle okunamayabilir.
  const attachments = await Promise.all(
    photos.map(async (file) => ({
      filename: file.name || "fotograf.jpg",
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
    }))
  );

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
        subject: mailSubject,
        text: emailBody,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      console.log("[contact] Mail başarıyla gönderildi:", body.name);
    } catch (error) {
      console.error("[contact] SMTP gönderim hatası (arka plan):", error);
    }
  });

  return NextResponse.json({ ok: true, delivered: true });
}
