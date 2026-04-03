import { useState, useMemo, useEffect } from "react";
import { useWaitTime, INTERVAL_LENGTH } from "../WaitTimeContext";

export function useNextFetchCountdown() {
  const { lastFetchTimestamp } = useWaitTime();
  const [now, setNow] = useState(0);

  const timeLeft = useMemo(() => {
    if (!lastFetchTimestamp) return 0;
    const diff = now - lastFetchTimestamp;
    const intervalDiff = INTERVAL_LENGTH - diff;
    const formatted = Math.round(intervalDiff / 1000);
    if (formatted < 0) return 0;
    if (formatted > INTERVAL_LENGTH) return INTERVAL_LENGTH;
    return formatted;
  }, [lastFetchTimestamp, now]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  return {timeLeft, percent: (INTERVAL_LENGTH - timeLeft *1000) / INTERVAL_LENGTH };
}
