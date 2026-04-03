import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography } from '@/theme';

interface Props {
  onAdd: () => void;
}

export function EmptyDashboard({ onAdd }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>✦</Text>
      <Text style={styles.title}>{t('dashboard.empty.title')}</Text>
      <Text style={styles.subtitle}>{t('dashboard.empty.subtitle')}</Text>
      <TouchableOpacity style={styles.button} onPress={onAdd} activeOpacity={0.8}>
        <Text style={styles.buttonLabel}>{t('dashboard.empty.addButton')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 40,
    marginBottom: spacing.md,
    color: colors.textDisabled,
  },
  title: {
    ...typography.subheading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  buttonLabel: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
