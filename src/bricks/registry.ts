import { BrickDefinition, BrickId, BrickInstance } from './types';

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
