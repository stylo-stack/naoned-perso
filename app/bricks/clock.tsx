import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenHeader, HeaderButton } from '@/components/ScreenHeader';
import { useClockTime, formatNantesTime, formatNantesDate } from '@/bricks/clock/ClockContext';
import { colors, spacing, typography } from '@/theme';

export default function ClockScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const now = useClockTime();
  const { hours, minutes, seconds } = formatNantesTime(now);
  const date = formatNantesDate(now);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t('bricks.clock.screen.title')}
        leftAction={<HeaderButton label={t('common.back')} onPress={() => router.back()} variant="back" />}
      />
      <View style={styles.content}>
        <Text style={styles.hhmm}>
          {hours}:{minutes}
        </Text>
        <Text style={styles.seconds}>:{seconds}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.tz}>Europe/Paris</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  hhmm: {
    fontSize: 80,
    fontWeight: '100',
    color: colors.textPrimary,
    letterSpacing: 6,
    lineHeight: 88,
  },
  seconds: {
    fontSize: 28,
    fontWeight: '200',
    color: colors.textSecondary,
    letterSpacing: 3,
  },
  date: {
    ...typography.subheading,
    color: colors.textSecondary,
    marginTop: spacing.xl,
    textTransform: 'capitalize',
  },
  tz: {
    ...typography.caption,
    color: colors.textDisabled,
  },
});
