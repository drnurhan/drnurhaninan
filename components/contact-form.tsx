"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const subjectKeys = [
  "appointment",
  "pricing",
  "international",
  "general",
  "other",
] as const;

const timeKeys = ["morning", "noon", "evening"] as const;

type Status = "idle" | "submitting" | "success" | "error";

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
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

  const isAppointment = subject === "appointment";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      subject,
      preferredDate: isAppointment ? formData.get("preferredDate") : null,
      timePreference: isAppointment ? timePreference || null : null,
      message: formData.get("message"),
      kvkkConsent: formData.get("kvkkConsent") === "on",
      locale,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("request-failed");

      const data = (await response.json()) as { delivered: boolean };

      if (!data.delivered) {
        // RESEND_API_KEY henüz tanımlı değil: istek loglandı ama mail gönderilemedi.
        setStatus("error");
        return;
      }

      setStatus("success");
      event.currentTarget.reset();
      setSubject("appointment");
      setTimePreference("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] border border-primary/20 bg-primary-tint p-8 text-center">
        <p className="font-serif text-xl text-primary">
          {t("successTitle")}
        </p>
        <p className="mt-2 text-ink-soft">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
          onChange={(e) => setSubject(e.target.value as typeof subject)}
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
          className="mt-1 h-4 w-4 shrink-0 rounded border-line text-primary focus:ring-primary"
        />
        <span>
          {t("kvkkLabel")}{" "}
          <Link
            href="/kvkk"
            locale={locale}
            className="underline underline-offset-2 hover:text-primary"
          >
            {t("kvkkLinkLabel")}
          </Link>
        </span>
      </label>

      <p className="text-xs text-ink-soft">{t("requiredNote")}</p>

      {status === "error" && (
        <p className="text-sm text-red-700">{t("errorMessage")}</p>
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
  "w-full rounded-[var(--radius-input)] border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-ink-soft/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

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
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
    </div>
  );
}
