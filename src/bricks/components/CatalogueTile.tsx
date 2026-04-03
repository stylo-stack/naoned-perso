import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BrickDefinition } from '@/bricks/types';
import { colors, spacing, typography } from '@/theme';

interface Props {
  definition: BrickDefinition;
  isEnabled: boolean;
  onAdd: () => void;
}

export function CatalogueTile({ definition, isEnabled, onAdd }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: definition.accentColor }]}>
        <Text style={styles.icon}>{definition.icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{definition.label}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {definition.description}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.addButton, isEnabled && styles.addButtonDisabled]}
        onPress={onAdd}
        disabled={isEnabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.addButtonLabel, isEnabled && styles.addButtonLabelDisabled]}>
          {isEnabled ? '✓' : '+'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginVertical: spacing.xs,
    borderRadius: 14,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  label: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.border,
  },
  addButtonLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  addButtonLabelDisabled: {
    color: colors.textSecondary,
  },
});
