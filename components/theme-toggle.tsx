"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

// Tema durumu React state'i olarak değil, <html data-theme> attribute'unun
// kendisi "external store" kabul edilip useSyncExternalStore ile okunuyor.
// Bu sayede SSR'da (data-theme bilinmez) her zaman "light" varsayılır ve
// hydration'dan hemen sonra gerçek değere geçilir — effect içinde
// setState çağırmaya gerek kalmadan, hydration uyuşmazlığı da olmadan.
const listeners = new Set<() => void>();

function getSnapshot() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function setTheme(isDark: boolean) {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch {
    // localStorage kapalıysa (gizli sekme vb.) sessizce yoksay; tercih
    // sadece o oturum boyunca DOM üzerinde kalır.
  }
  listeners.forEach((listener) => listener());
}

export function ThemeToggle({
  lightLabel,
  darkLabel,
}: {
  lightLabel: string;
  darkLabel: string;
}) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={() => setTheme(!isDark)}
      aria-label={isDark ? lightLabel : darkLabel}
      className="flex items-center gap-1.5 rounded-full p-2 text-ink-soft transition-colors hover:bg-primary-tint hover:text-primary-ink"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
