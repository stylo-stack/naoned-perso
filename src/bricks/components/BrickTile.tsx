import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BrickDefinition, BrickInstance } from '@/bricks/types';
import { spacing } from '@/theme';

interface Props {
  definition: BrickDefinition;
  instance: BrickInstance;
  onPress: () => void;
}

export function BrickTile({ definition, onPress }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const tileSize = (screenWidth - spacing.base * 2 - spacing.sm) / 2;

  if (definition.useAccentColor) {
    return <DynamicColorTile definition={definition} onPress={onPress} tileSize={tileSize} />;
  }

  return (
    <TileShell color={definition.accentColor} tileSize={tileSize} onPress={onPress}>
      {definition.TileContent ? (
        <definition.TileContent />
      ) : (
        <FallbackContent definition={definition} />
      )}
    </TileShell>
  );
}

function DynamicColorTile({
  definition,
  onPress,
  tileSize,
}: Omit<Props, 'instance'> & { tileSize: number; }) {
  const color = definition.useAccentColor!();
  return (
    <TileShell color={color} tileSize={tileSize} onPress={onPress}>
      {definition.TileContent ? (
        <definition.TileContent />
      ) : (
        <FallbackContent definition={definition} />
      )}
    </TileShell>
  );
}

function FallbackContent({ definition }: { definition: BrickDefinition }) {
  const { t } = useTranslation();
  return (
    <>
      <Text style={styles.icon}>{definition.icon}</Text>
      <Text style={styles.label}>{t(definition.labelKey)}</Text>
    </>
  );
}

function TileShell({
  color,
  tileSize,
  onPress,
  children,
}: {
  color: string;
  tileSize: number;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={[styles.container, { width: tileSize, height: tileSize, backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {children}
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
