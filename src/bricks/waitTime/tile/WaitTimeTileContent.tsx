import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useWaitTime, formatMinutes } from "../WaitTimeContext";
import { NextRefreshCountdown } from "@/components/NextRefreshCountdown";
import { useNextFetchCountdown } from "../hooks/useNextFetchCountdown";



export function WaitTimeTileContent() {
  const { t } = useTranslation();
  const { config, configLoading, departures, loading} =
    useWaitTime();

    const {percent} = useNextFetchCountdown();

  if (configLoading) return null;

  if (!config) {
    return (
      <View style={styles.container}>
        <Text style={styles.unconfigured}>{t('bricks.wait-time.tile.tapToConfigure')}</Text>
      </View>
    );
  }

  const next = departures[0] ?? null;
  const following = departures[1] ?? null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.lineBadge, { backgroundColor: config.lineColor }]}>
          <Text style={styles.lineText}>{config.numLigne}</Text>
        </View>
        <Text style={styles.stopName} numberOfLines={1}>
          {config.stopLabel}
        </Text>
      </View>

      {next && (
        <Text style={styles.direction} numberOfLines={1}>
          → {next.terminus}
        </Text>
      )}

      <View style={styles.times}>
        <View style={styles.nextBlock}>
          <Text style={styles.nextMinutes}>
            {loading && !next ? "…" : next ? formatMinutes(next.minutes) : "--"}
          </Text>
          <Text style={styles.nextLabel}>{t('common.min')}</Text>
        </View>

        {following && (
          <View style={styles.followingBlock}>
            <Text style={styles.followingMinutes}>
              {formatMinutes(following.minutes)}
            </Text>
            <Text style={styles.followingLabel}>{t('common.min')}</Text>
          </View>
        )}
      </View>
      <NextRefreshCountdown percent={percent}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    gap: 4,
  },
  unconfigured: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lineBadge: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  lineText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  stopName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  direction: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  times: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 2,
  },
  nextBlock: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  nextMinutes: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 44,
  },
  nextLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  followingBlock: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    marginBottom: 2,
  },
  followingMinutes: {
    fontSize: 22,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
    lineHeight: 26,
  },
  followingLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 2,
  },
});
