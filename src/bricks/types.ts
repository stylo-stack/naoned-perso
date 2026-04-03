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
  /** Optional context provider wrapping the whole app, so tile and screen share state. */
  Provider?: React.ComponentType<{ children: React.ReactNode }>;
  /** Optional component rendered inside the dashboard tile instead of icon + label. */
  TileContent?: React.ComponentType;
  /** Optional hook that returns a dynamic accent color, overriding accentColor on the tile. */
  useAccentColor?: () => string;
}

export interface BrickInstance {
  id: BrickId;
  order: number;
}
