import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenHeader, HeaderButton } from "@/components/ScreenHeader";
import { colors, spacing, typography } from "@/theme";
import { useWaitTime, formatMinutes } from "@/bricks/waitTime/WaitTimeContext";
import { WaitTimeSetup } from "@/bricks/waitTime/WaitTimeSetup";
import type { WaitTimeConfig } from "@/bricks/waitTime/WaitTimeContext";
import { NextRefreshCountdown } from "@/components/NextRefreshCountdown";
import { useNextFetchCountdown } from "@/bricks/waitTime/useNextFetchCountdown";

export default function WaitTimeScreen() {
  const router = useRouter();
  const {
    config,
    configLoading,
    setConfig,
    departures,
    loading,
    error,
  } = useWaitTime();
  const { percent } = useNextFetchCountdown();
  const [isConfiguring, setIsConfiguring] = useState(false);

  async function handleDone(newConfig: WaitTimeConfig) {
    await setConfig(newConfig);
    setIsConfiguring(false);
  }

  if (configLoading) {
    return (
      <View style={styles.screen}>
        <ScreenHeader
          title="Prochain passage"
          leftAction={
            <HeaderButton
              label="‹ Retour"
              onPress={() => router.back()}
              variant="back"
            />
          }
        />
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} />
        </View>
      </View>
    );
  }

  if (!config || isConfiguring) {
    return (
      <View style={styles.screen}>
        <ScreenHeader
          title={isConfiguring ? "Configurer" : "Configurer l'arrêt"}
          leftAction={
            isConfiguring ? (
              <HeaderButton
                label="Annuler"
                onPress={() => setIsConfiguring(false)}
              />
            ) : (
              <HeaderButton
                label="‹ Retour"
                onPress={() => router.back()}
                variant="back"
              />
            )
          }
        />
        <WaitTimeSetup onDone={handleDone} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={`Ligne ${config?.numLigne} — ${config.stopLabel}`}
        leftAction={
          <HeaderButton
            label="‹ Retour"
            onPress={() => router.back()}
            variant="back"
          />
        }
        rightAction={
          <HeaderButton
            label="Modifier"
            onPress={() => setIsConfiguring(true)}
          />
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.meta}>
          <Text style={styles.metaText}>→ {config.terminusLabel}</Text>
          <NextRefreshCountdown percent={percent} />
        </View>

        {loading && departures.length === 0 && (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.accent} />
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && departures.length === 0 && (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Aucun passage prévu.</Text>
          </View>
        )}
        {departures.map((dep, i) => (
          <View
            key={i}
            style={[
              styles.card,
              i === 0 && {
                borderLeftWidth: 4,
                borderLeftColor: config.lineColor,
              },
            ]}
          >
            <View style={styles.cardLeft}>
              <Text style={[styles.terminus, i === 0 && styles.terminusNext]}>
                → {dep.terminus}
              </Text>
              {dep.tempsReel && (
                <View style={styles.realtimeBadge}>
                  <Text
                    style={[styles.realtimeText, { color: config.lineColor }]}
                  >
                    Temps réel
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.cardRight}>
              <Text
                style={[
                  styles.minutes,
                  i === 0 && {
                    fontSize: 36,
                    fontWeight: "700",
                    color: config.lineColor,
                  },
                ]}
              >
                {formatMinutes(dep.minutes)}
              </Text>
              <Text style={styles.minutesLabel}>min</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, gap: spacing.sm },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  refreshButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  refreshText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: "600",
  },
  emptyText: {
    ...typography.body,
    color: colors.textDisabled,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: "#DC2626",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: { flex: 1, gap: 4 },
  terminus: {
    ...typography.body,
    color: colors.textPrimary,
  },
  terminusNext: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  realtimeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  realtimeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardRight: { alignItems: "center", minWidth: 52 },
  minutes: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  minutesLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
