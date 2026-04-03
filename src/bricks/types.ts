import React from 'react';

export type BrickId = string;

export interface BrickDefinition {
  id: BrickId;
  label: string;
  description: string;
  icon: string;
  accentColor: string;
  route: string;
  defaultEnabled: boolean;
  /** If true, multiple instances of this brick can be added to the dashboard. */
  allowMultiple?: boolean;
  /** Optional per-instance context provider wrapping the tile and its screen. */
  Provider?: React.ComponentType<{ children: React.ReactNode; instanceId: string }>;
  /** Optional component rendered inside the dashboard tile instead of icon + label. */
  TileContent?: React.ComponentType;
  /** Optional hook that returns a dynamic accent color, overriding accentColor on the tile. */
  useAccentColor?: () => string;
}

export interface BrickInstance {
  id: BrickId;
  instanceId: string;
  order: number;
}
