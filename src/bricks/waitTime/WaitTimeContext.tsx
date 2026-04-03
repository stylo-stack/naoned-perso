import i18n from '@/i18n';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNextDepartures, parseWaitMinutes } from "naolib-wait-time-js";
import type { WaitTime } from "naolib-wait-time-js";

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
  lastFetchTimestamp?: number;
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

export const INTERVAL_LENGTH = 60000;

function storageKey(instanceId: string): string {
  return `@wait-time-config-${instanceId}`;
}

// Module-level listeners so multiple Provider instances sharing the same instanceId
// stay in sync when one of them calls setConfig.
const configListeners = new Map<string, Set<(config: WaitTimeConfig) => void>>();

function addConfigListener(
  instanceId: string,
  cb: (config: WaitTimeConfig) => void,
): () => void {
  if (!configListeners.has(instanceId)) {
    configListeners.set(instanceId, new Set());
  }
  configListeners.get(instanceId)!.add(cb);
  return () => {
    configListeners.get(instanceId)?.delete(cb);
    if (configListeners.get(instanceId)?.size === 0) {
      configListeners.delete(instanceId);
    }
  };
}

function notifyConfigListeners(instanceId: string, config: WaitTimeConfig): void {
  configListeners.get(instanceId)?.forEach((cb) => cb(config));
}

export function WaitTimeProvider({
  children,
  instanceId,
}: {
  children: React.ReactNode;
  instanceId: string;
}) {
  const [config, setConfigState] = useState<WaitTimeConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<number>();

  useEffect(() => {
    setConfigLoading(true);
    AsyncStorage.getItem(storageKey(instanceId)).then((raw) => {
      if (raw) {
        try {
          setConfigState(JSON.parse(raw));
        } catch {}
      } else {
        setConfigState(null);
      }
      setConfigLoading(false);
    });
  }, [instanceId]);

  // Keep in sync with sibling Provider instances that share the same instanceId
  useEffect(() => {
    return addConfigListener(instanceId, (newConfig) => {
      setConfigState(newConfig);
      setDepartures([]);
      setError(null);
    });
  }, [instanceId]);

  const setConfig = useCallback(
    async (newConfig: WaitTimeConfig) => {
      await AsyncStorage.setItem(
        storageKey(instanceId),
        JSON.stringify(newConfig),
      );
      setConfigState(newConfig);
      setDepartures([]);
      setError(null);
      notifyConfigListeners(instanceId, newConfig);
    },
    [instanceId],
  );

  const fetchDepartures = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      const results = await getNextDepartures(config.codeLieu, {
        line: config?.numLigne,
        sens: config.sens,
        limit: 5,
      });
      setDepartures(results.map(toDeperture));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : i18n.t('errors.unknown'));
    } finally {
      setLoading(false);
      setLastFetchTimestamp(Date.now());
    }
  }, [config]);

  useEffect(() => {
    if (!config) return;
    fetchDepartures();
    const interval = setInterval(fetchDepartures, INTERVAL_LENGTH);
    return () => clearInterval(interval);
  }, [config, fetchDepartures]);

  return (
    <WaitTimeContext.Provider
      value={{
        config,
        configLoading,
        setConfig,
        departures,
        loading,
        error,
        refresh: fetchDepartures,
        lastFetchTimestamp,
      }}
    >
      {children}
    </WaitTimeContext.Provider>
  );
}

export async function clearWaitTimeStorage(instanceId: string): Promise<void> {
  await AsyncStorage.removeItem(storageKey(instanceId));
}

export function useWaitTime(): WaitTimeContextValue {
  return useContext(WaitTimeContext);
}

export function formatMinutes(minutes: number | null): string {
  if (minutes === null) return "?";
  if (minutes === 0) return "<1";
  return String(minutes);
}

const DEFAULT_LINE_COLOR = "#059669";

export function useWaitTimeAccentColor(): string {
  const { config } = useWaitTime();
  return config?.lineColor ?? DEFAULT_LINE_COLOR;
}
