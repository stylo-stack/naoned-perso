import { BrickDefinition, BrickId, BrickInstance } from './types';
import { ClockProvider } from './clock/ClockContext';
import { ClockTileContent } from './clock/ClockTileContent';

export const BRICK_REGISTRY: BrickDefinition[] = [
  {
    id: 'naolib',
    label: 'Transports TAN',
    description: 'Prochains passages aux arrêts de bus et tram.',
    icon: '🚌',
    accentColor: '#2563EB',
    route: '/bricks/naolib',
    defaultEnabled: true,
  },
  {
    id: 'weather',
    label: 'Météo Nantes',
    description: 'Conditions météo actuelles.',
    icon: '🌦️',
    accentColor: '#0891B2',
    route: '/bricks/weather',
    defaultEnabled: true,
  },
  {
    id: 'agenda',
    label: 'Agenda',
    description: 'Vos prochains événements.',
    icon: '📅',
    accentColor: '#7C3AED',
    route: '/bricks/agenda',
    defaultEnabled: true,
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
