import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { BrickDefinition } from '@/bricks/types';
import { colors, spacing } from '@/theme';

interface Props {
  definition: BrickDefinition;
  drag: () => void;
  isActive: boolean;
  onRemove: () => void;
}

export function BrickTileEdit({ definition, drag, isActive, onRemove }: Props) {
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const tileSize = (screenWidth - spacing.base * 2 - spacing.sm) / 2;

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withSpring(-1.8, { damping: 3 }),
        withSpring(1.8, { damping: 3 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${isActive ? 0 : rotation.value}deg` },
      { scale: withSpring(isActive ? 1.06 : 1, { damping: 12 }) },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.container, { width: tileSize, height: tileSize, backgroundColor: definition.accentColor }]}
        onLongPress={drag}
        delayLongPress={150}
        activeOpacity={0.85}
      >
        <Text style={styles.icon}>{definition.icon}</Text>
        <Text style={styles.label}>{t(definition.labelKey)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.removeButton} onPress={onRemove} hitSlop={8}>
        <Text style={styles.removeIcon}>−</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 52,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  removeIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
});
