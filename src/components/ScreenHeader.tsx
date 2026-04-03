import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';

interface Props {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export function ScreenHeader({ title, leftAction, rightAction }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.side}>{leftAction ?? null}</View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side}>{rightAction ?? null}</View>
    </View>
  );
}

export function HeaderButton({
  label,
  onPress,
  variant = 'default',
}: {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'primary' | 'back';
}) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8} activeOpacity={0.6}>
      <Text
        style={[
          styles.buttonText,
          variant === 'primary' && styles.buttonPrimary,
          variant === 'back' && styles.buttonBack,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.subheading,
    color: colors.textPrimary,
  },
  side: {
    width: 64,
    alignItems: 'flex-end',
  },
  buttonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  buttonPrimary: {
    color: colors.accent,
    fontWeight: '600',
  },
  buttonBack: {
    color: colors.accent,
  },
});
