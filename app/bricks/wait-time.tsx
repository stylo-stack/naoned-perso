import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenHeader, HeaderButton } from "@/components/ScreenHeader";
import { colors, spacing, typography } from "@/theme";
import {
  useWaitTime,
  formatMinutes,
  WaitTimeProvider,
} from "@/bricks/waitTime/WaitTimeContext";
import { WaitTimeSetup } from "@/bricks/waitTime/screen/WaitTimeSetup/WaitTimeSetup";
import type { WaitTimeConfig } from "@/bricks/waitTime/WaitTimeContext";
import { NextRefreshCountdown } from "@/components/NextRefreshCountdown";
import { useNextFetchCountdown } from "@/bricks/waitTime/hooks/useNextFetchCountdown";

function WaitTimeScreen() {
  const { t } = useTranslation();
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
          title={t('bricks.wait-time.screen.title')}
          leftAction={
            <HeaderButton
              label={t('common.back')}
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
          title={isConfiguring ? t('bricks.wait-time.screen.configureTitle') : t('bricks.wait-time.screen.configureStopTitle')}
          leftAction={
            isConfiguring ? (
              <HeaderButton
                label={t('common.cancel')}
                onPress={() => setIsConfiguring(false)}
              />
            ) : (
              <HeaderButton
                label={t('common.back')}
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
        title={t('bricks.wait-time.screen.lineTitle', { numLigne: config.numLigne, stopLabel: config.stopLabel })}
        leftAction={
          <HeaderButton
            label={t('common.back')}
            onPress={() => router.back()}
            variant="back"
          />
        }
        rightAction={
          <HeaderButton
            label={t('common.edit')}
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
            <Text style={styles.emptyText}>{t('bricks.wait-time.screen.noPassage')}</Text>
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
                    {t('common.realtime')}
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
              <Text style={styles.minutesLabel}>{t('common.min')}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function WaitTimeScreenWrapper() {
  const { instanceId } = useLocalSearchParams<{ instanceId: string }>();
  return (
    <WaitTimeProvider instanceId={instanceId ?? "default"}>
      <WaitTimeScreen />
    </WaitTimeProvider>
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
