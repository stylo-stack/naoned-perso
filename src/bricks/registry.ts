import { BrickDefinition, BrickId, BrickInstance } from "./types";
import { ClockTileContent } from "./clock/tile/ClockTileContent";
import {
  WaitTimeProvider,
  useWaitTimeAccentColor,
} from "./waitTime/WaitTimeContext";
import { WaitTimeTileContent } from "./waitTime/tile/WaitTimeTileContent";

export const BRICK_REGISTRY: BrickDefinition[] = [
  {
    id: "wait-time",
    labelKey: "bricks.wait-time.label",
    descriptionKey: "bricks.wait-time.description",
    icon: "🚏",
    accentColor: "#059669",
    route: "/bricks/wait-time",
    defaultEnabled: false,
    allowMultiple: true,
    Provider: WaitTimeProvider,
    TileContent: WaitTimeTileContent,
    useAccentColor: useWaitTimeAccentColor,
  },
  {
    id: "clock",
    labelKey: "bricks.clock.label",
    descriptionKey: "bricks.clock.description",
    icon: "🕐",
    accentColor: "#1E293B",
    route: "/bricks/clock",
    defaultEnabled: false,
    TileContent: ClockTileContent,
  },
];

export function getBrickById(id: BrickId): BrickDefinition | undefined {
  return BRICK_REGISTRY.find((b) => b.id === id);
}

export function getDefaultBrickInstances(): BrickInstance[] {
  return BRICK_REGISTRY.filter((b) => b.defaultEnabled).map((b, index) => ({
    id: b.id,
    instanceId: Math.random().toString(36).slice(2) + Date.now().toString(36),
    order: index,
  }));
}
