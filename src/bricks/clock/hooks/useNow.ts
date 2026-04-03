import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

export function formatNantesTime(date: Date): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  return { hours: get("hour"), minutes: get("minute"), seconds: get("second") };
}

export function formatNantesDate(date: Date, language: string): string {
  return new Intl.DateTimeFormat(`${language}-FR`, {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function useNow() {
  const [now, setNow] = useState(new Date());
  const { language } = useLanguage();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return {
    now,
    formattedTime: formatNantesTime(now),
    formattedDate: formatNantesDate(now, language)
  };
}
