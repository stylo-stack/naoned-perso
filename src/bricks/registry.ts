import { BrickDefinition, BrickId, BrickInstance } from './types';
import { ClockProvider } from './clock/ClockContext';
import { ClockTileContent } from './clock/ClockTileContent';
import { WaitTimeProvider, useWaitTimeAccentColor } from './waitTime/WaitTimeContext';
import { WaitTimeTileContent } from './waitTime/WaitTimeTileContent';

export const BRICK_REGISTRY: BrickDefinition[] = [
  {
    id: 'wait-time',
    label: 'Prochain passage',
    description: 'Affiche les prochains passages d\'une ligne à un arrêt.',
    icon: '🚏',
    accentColor: '#059669',
    route: '/bricks/wait-time',
    defaultEnabled: false,
    Provider: WaitTimeProvider,
    TileContent: WaitTimeTileContent,
    useAccentColor: useWaitTimeAccentColor,
  },
  {
    id: 'clock',
    label: 'Heure à Nantes',
    description: "L'heure actuelle à Nantes.",
    icon: '🕐',
    accentColor: '#1E293B',
    route: '/bricks/clock',
    defaultEnabled: false,
    Provider: ClockProvider,
    TileContent: ClockTileContent,
  },
];

export function getBrickById(id: BrickId): BrickDefinition | undefined {
  return BRICK_REGISTRY.find((b) => b.id === id);
}

export function getDefaultBrickInstances(): BrickInstance[] {
  return BRICK_REGISTRY.filter((b) => b.defaultEnabled).map((b, index) => ({
    id: b.id,
    order: index,
  }));
}
