import { useState, useMemo, useEffect } from "react";
import { useWaitTime } from "../WaitTimeContext";

export function useNextFetchCountdown() {
  const { lastFetchTimestamp, intervalLength} = useWaitTime();
  const [now, setNow] = useState(0);

  const timeLeft = useMemo(() => {
    if (!lastFetchTimestamp) return 0;
    const diff = now - lastFetchTimestamp;
    const intervalDiff = intervalLength - diff;
    const formatted = Math.round(intervalDiff / 1000);
    if (formatted < 0) return 0;
    if (formatted > intervalLength) return intervalLength;
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

  return {timeLeft, percent: (intervalLength - timeLeft *1000) / intervalLength };
}
