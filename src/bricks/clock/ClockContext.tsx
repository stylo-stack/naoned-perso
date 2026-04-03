import React, { createContext, useContext, useEffect, useState } from 'react';

const ClockContext = createContext<Date>(new Date());

export function ClockProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <ClockContext.Provider value={now}>{children}</ClockContext.Provider>;
}

export function useClockTime(): Date {
  return useContext(ClockContext);
}

export function formatNantesTime(date: Date): { hours: string; minutes: string; seconds: string } {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  return { hours: get('hour'), minutes: get('minute'), seconds: get('second') };
}

export function formatNantesDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}
