import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNextDepartures, parseWaitMinutes } from 'naolib-wait-time-js';
import type { WaitTime } from 'naolib-wait-time-js';

const STORAGE_KEY = '@wait-time-config';

export type WaitTimeConfig = {
  codeLieu: string;
  stopLabel: string;
  numLigne: string;
  sens: 1 | 2;
  terminusLabel: string;
  lineColor: string;
};

export type Departure = {
  terminus: string;
  temps: string;
  minutes: number | null;
  tempsReel: boolean;
};

type WaitTimeContextValue = {
  config: WaitTimeConfig | null;
  configLoading: boolean;
  setConfig: (config: WaitTimeConfig) => Promise<void>;
  departures: Departure[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const WaitTimeContext = createContext<WaitTimeContextValue>({
  config: null,
  configLoading: true,
  setConfig: async () => {},
  departures: [],
  loading: false,
  error: null,
  refresh: () => {},
});

function toDeperture(wt: WaitTime): Departure {
  return {
    terminus: wt.terminus,
    temps: wt.temps,
    minutes: parseWaitMinutes(wt.temps),
    tempsReel: wt.tempsReel,
  };
}

export function WaitTimeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<WaitTimeConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setConfigState(JSON.parse(raw));
        } catch {}
      }
      setConfigLoading(false);
    });
  }, []);

  const setConfig = useCallback(async (newConfig: WaitTimeConfig) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    setConfigState(newConfig);
    setDepartures([]);
    setError(null);
  }, []);

  const fetchDepartures = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      const results = await getNextDepartures(config.codeLieu, {
        line: config?.numLigne,
        sens: config.sens,
        limit: 3,
      });
      setDepartures(results.map(toDeperture));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    if (!config) return;
    fetchDepartures();
    const interval = setInterval(fetchDepartures, 60_000);
    return () => clearInterval(interval);
  }, [config, fetchDepartures]);

  return (
    <WaitTimeContext.Provider
      value={{ config, configLoading, setConfig, departures, loading, error, refresh: fetchDepartures }}
    >
      {children}
    </WaitTimeContext.Provider>
  );
}

export function useWaitTime(): WaitTimeContextValue {
  return useContext(WaitTimeContext);
}

export function formatMinutes(minutes: number | null): string {
  if (minutes === null) return '?';
  if (minutes === 0) return '<1';
  return String(minutes);
}

const DEFAULT_LINE_COLOR = '#059669';

export function useWaitTimeAccentColor(): string {
  const { config } = useWaitTime();
  return config?.lineColor ?? DEFAULT_LINE_COLOR;
}
