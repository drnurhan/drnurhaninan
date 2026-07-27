"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ImagePlus, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

const subjectKeys = [
  "appointment",
  "pricing",
  "international",
  "freePhotoAssessment",
  "general",
  "other",
] as const;

const timeKeys = ["morning", "noon", "evening"] as const;

type Status = "idle" | "submitting" | "success" | "error";
type PhotoFile = { file: File; previewUrl: string };

const MAX_PHOTOS = 3;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png"];

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

// Telefon fotoğrafları genelde 5 MB'ın çok üzerinde oluyor; kullanıcıyı
// reddetmek yerine tarayıcıda otomatik olarak yeniden boyutlandırıp
// sıkıştırıyoruz. Zaten küçük dosyalarda dokunmadan geçiyoruz.
async function compressImage(file: File): Promise<File> {
  if (file.size <= 1.5 * 1024 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82)
    );
    if (!blob) return file;

    const newName = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    // Sıkıştırma başarısız olursa (bozuk dosya vb.) orijinal dosyayla devam
    // et; boyut kontrolü zaten aşağıda ayrıca yapılıyor.
    return file;
  }
}

export function ContactForm() {
  const t = useTranslations("Contact.form");
  const locale = useLocale();

  const [subject, setSubject] = useState<(typeof subjectKeys)[number]>(
    "appointment"
  );
  const [timePreference, setTimePreference] = useState<
    (typeof timeKeys)[number] | ""
  >("");
  const [status, setStatus] = useState<Status>("idle");
  const [succeededWithPhoto, setSucceededWithPhoto] = useState(false);

  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoSectionRef = useRef<HTMLDivElement>(null);

  const isAppointment = subject === "appointment";
  const isPhotoAssessment = subject === "freePhotoAssessment";

  async function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList);
    let error: string | null = null;
    const next = [...photos];

    for (const file of incoming) {
      if (next.length >= MAX_PHOTOS) {
        error = t("photoErrorCount");
        break;
      }
      if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
        error = t("photoErrorType");
        continue;
      }

      const processed = await compressImage(file);

      if (processed.size > MAX_PHOTO_SIZE) {
        error = t("photoErrorSize");
        continue;
      }
      next.push({ file: processed, previewUrl: URL.createObjectURL(processed) });
    }

    setPhotos(next);
    setFileError(error);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) void addFiles(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.dataTransfer.files) void addFiles(event.dataTransfer.files);
  }

  function handleHighlightClick() {
    setSubject("freePhotoAssessment");
    setTimeout(() => {
      photoSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Form elementini burada, senkron olarak yakalıyoruz: `await`den sonra
    // event.currentTarget tarayıcı tarafından null'a çevriliyor (DOM
    // standardı — event dispatch'i bittiğinde currentTarget sıfırlanır).
    const form = event.currentTarget;

    if (isPhotoAssessment && photos.length === 0) {
      setFileError(t("photoErrorRequired"));
      return;
    }

    setStatus("submitting");

    const rawFormData = new FormData(form);
    const commonFields: Record<string, string> = {
      name: String(rawFormData.get("name") || ""),
      phone: String(rawFormData.get("phone") || ""),
      email: String(rawFormData.get("email") || ""),
      subject,
      preferredDate: isAppointment
        ? String(rawFormData.get("preferredDate") || "")
        : "",
      timePreference: isAppointment ? timePreference : "",
      message: String(rawFormData.get("message") || ""),
      kvkkConsent: String(rawFormData.get("kvkkConsent") === "on"),
      photoConsent: String(
        isPhotoAssessment && rawFormData.get("photoConsent") === "on"
      ),
      locale,
    };

    try {
      let response: Response;

      if (isPhotoAssessment && photos.length > 0) {
        const multipart = new FormData();
        Object.entries(commonFields).forEach(([key, value]) => {
          multipart.append(key, value);
        });
        photos.forEach(({ file }) => multipart.append("photos", file));
        response = await fetch("/api/contact", {
          method: "POST",
          body: multipart,
        });
      } else {
        response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: commonFields.name,
            phone: commonFields.phone,
            email: commonFields.email,
            subject: commonFields.subject,
            preferredDate: commonFields.preferredDate || null,
            timePreference: commonFields.timePreference || null,
            message: commonFields.message,
            kvkkConsent: rawFormData.get("kvkkConsent") === "on",
            locale: commonFields.locale,
          }),
        });
      }

      if (!response.ok) throw new Error("request-failed");

      const data = (await response.json()) as { delivered: boolean };

      if (!data.delivered) {
        // SMTP_PASSWORD henüz tanımlı değil: istek loglandı ama mail gönderilemedi.
        setStatus("error");
        return;
      }

      setSucceededWithPhoto(isPhotoAssessment);
      setStatus("success");
      form.reset();
      setSubject("appointment");
      setTimePreference("");
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPhotos([]);
      setFileError(null);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] border border-primary/20 bg-primary-tint p-8 text-center">
        <p className="font-serif text-xl text-primary-ink">
          {t("successTitle")}
        </p>
        <p className="mt-2 text-ink-soft">
          {succeededWithPhoto ? t("successMessagePhoto") : t("successMessage")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <button
        type="button"
        onClick={handleHighlightClick}
        className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-card)] border-2 border-accent bg-accent-soft px-5 py-4 text-left transition-transform hover:-translate-y-0.5"
      >
        <span className="text-sm font-semibold text-accent-strong sm:text-base">
          {t("highlightText")}
        </span>
        <ArrowRight size={18} className="shrink-0 text-accent-strong" />
      </button>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} htmlFor="name" required>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={inputClass}
          />
        </Field>
        <Field label={t("phone")} htmlFor="phone" required>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={inputClass}
          />
        </Field>
      </div>

      <Field label={t("email")} htmlFor="email">
        <input id="email" name="email" type="email" className={inputClass} />
      </Field>

      <Field label={t("subject")} htmlFor="subject">
        <select
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value as typeof subject);
            setFileError(null);
          }}
          className={inputClass}
        >
          {subjectKeys.map((key) => (
            <option key={key} value={key}>
              {t(`subjectOptions.${key}`)}
            </option>
          ))}
        </select>
      </Field>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
          isAppointment ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
        <div className="grid gap-5 pt-1 sm:grid-cols-2">
          <Field label={t("preferredDate")} htmlFor="preferredDate">
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              min={todayIsoDate()}
              className={inputClass}
            />
          </Field>

          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-ink">
              {t("timePreference")}
            </legend>
            <div className="flex flex-wrap gap-2">
              {timeKeys.map((key) => {
                const isActive = timePreference === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setTimePreference(isActive ? "" : key)
                    }
                    aria-pressed={isActive}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-white"
                        : "border-line text-ink-soft hover:border-primary/40"
                    }`}
                  >
                    {t(`timeOptions.${key}`)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
        </div>
      </div>

      <div
        ref={photoSectionRef}
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
          isPhotoAssessment ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 pt-1">
            <p className="text-sm text-ink-soft">{t("photoIntro")}</p>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-[var(--radius-card)] border-2 border-dashed border-line bg-bg px-6 py-10 text-center transition-colors hover:border-primary-ink"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-tint text-primary-ink">
                <ImagePlus size={30} />
              </span>
              <p className="mt-4 text-base font-semibold text-ink">
                {t("photoDropLabel")}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {t("photoUploadHint")}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-deep"
              >
                {t("photoBrowseLabel")}
              </button>
            </div>

            {fileError && (
              <p className="text-sm text-red-700 dark:text-red-400">
                {fileError}
              </p>
            )}

            {photos.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element -- geçici blob: önizleme, next/image ile uyumlu değil */}
                    <img
                      src={photo.previewUrl}
                      alt=""
                      className="h-16 w-16 rounded-[var(--radius-input)] border border-line object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      aria-label={t("removePhotoLabel")}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-start gap-3 text-sm text-ink-soft">
              <input
                type="checkbox"
                name="photoConsent"
                required={isPhotoAssessment}
                className="mt-1 h-4 w-4 shrink-0 rounded border-line text-primary-ink focus:ring-primary-ink"
              />
              <span>{t("photoConsentLabel")}</span>
            </label>

            <p className="text-xs text-ink-soft/80">{t("photoDisclaimer")}</p>
          </div>
        </div>
      </div>

      <Field label={t("message")} htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass}
        />
      </Field>

      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="kvkkConsent"
          required
          className="mt-1 h-4 w-4 shrink-0 rounded border-line text-primary-ink focus:ring-primary-ink"
        />
        <span>
          {t("kvkkLabel")}{" "}
          <Link
            href="/kvkk"
            locale={locale}
            className="underline underline-offset-2 hover:text-primary-ink"
          >
            {t("kvkkLinkLabel")}
          </Link>
        </span>
      </label>

      <p className="text-xs text-ink-soft">{t("requiredNote")}</p>

      {status === "error" && (
        <p className="text-sm text-red-700 dark:text-red-400">{t("errorMessage")}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-deep disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-line bg-input-bg px-4 py-2.5 text-ink placeholder:text-ink-soft/60 focus:border-primary-ink focus:outline-none focus:ring-1 focus:ring-primary-ink";

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-accent-strong"> *</span>}
      </label>
      {children}
    </div>
  );
}
