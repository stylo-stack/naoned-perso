import AsyncStorage from '@react-native-async-storage/async-storage';
import { BRICK_REGISTRY, getDefaultBrickInstances } from '@/bricks/registry';
import { BrickId, BrickInstance } from '@/bricks/types';
import { STORAGE_KEYS } from './storageKeys';

function generateInstanceId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function loadDashboard(): Promise<BrickInstance[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.DASHBOARD_BRICKS);
  if (raw === null) {
    return getDefaultBrickInstances();
  }
  const parsed: (Omit<BrickInstance, 'instanceId'> & { instanceId?: string })[] = JSON.parse(raw);
  const validIds = new Set(BRICK_REGISTRY.map((b) => b.id));
  return parsed
    .filter((b) => validIds.has(b.id))
    .map((b) => ({ ...b, instanceId: b.instanceId ?? generateInstanceId() }))
    .sort((a, b) => a.order - b.order);
}

export async function saveDashboard(bricks: BrickInstance[]): Promise<void> {
  const reindexed = bricks.map((b, i) => ({ ...b, order: i }));
  await AsyncStorage.setItem(
    STORAGE_KEYS.DASHBOARD_BRICKS,
    JSON.stringify(reindexed),
  );
}

export function addBrick(current: BrickInstance[], id: BrickId): BrickInstance[] {
  const definition = BRICK_REGISTRY.find((b) => b.id === id);
  if (!definition?.allowMultiple && current.some((b) => b.id === id)) return current;
  return [...current, { id, instanceId: generateInstanceId(), order: current.length }];
}

export function removeBrick(current: BrickInstance[], instanceId: string): BrickInstance[] {
  return current.filter((b) => b.instanceId !== instanceId);
}

export function reorderBricks(bricks: BrickInstance[]): BrickInstance[] {
  return bricks.map((b, i) => ({ ...b, order: i }));
}
