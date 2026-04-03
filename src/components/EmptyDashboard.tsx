import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

interface Props {
  onAdd: () => void;
}

export function EmptyDashboard({ onAdd }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>✦</Text>
      <Text style={styles.title}>Votre tableau de bord est vide</Text>
      <Text style={styles.subtitle}>Ajoutez des tuiles pour personnaliser votre expérience.</Text>
      <TouchableOpacity style={styles.button} onPress={onAdd} activeOpacity={0.8}>
        <Text style={styles.buttonLabel}>+ Ajouter des tuiles</Text>
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
