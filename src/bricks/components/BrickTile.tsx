import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { BrickDefinition } from '@/bricks/types';
import { spacing } from '@/theme';

interface Props {
  definition: BrickDefinition;
  onPress: () => void;
}

export function BrickTile({ definition, onPress }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const tileSize = (screenWidth - spacing.base * 2 - spacing.sm) / 2;

  return (
    <TouchableOpacity
      style={[styles.container, { width: tileSize, height: tileSize, backgroundColor: definition.accentColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{definition.icon}</Text>
      <Text style={styles.label}>{definition.label}</Text>
    </TouchableOpacity>
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
});
