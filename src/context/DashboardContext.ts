import { createContext, useContext } from 'react';
import { BrickId, BrickInstance } from '@/bricks/types';

export interface DashboardContextValue {
  bricks: BrickInstance[];
  isLoading: boolean;
  isEditMode: boolean;
  toggleEditMode: (value?: boolean) => void;
  addBrick: (id: BrickId) => Promise<void>;
  removeBrick: (instanceId: string) => Promise<void>;
  onDragEnd: (data: BrickInstance[]) => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboardContext(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardContext.Provider');
  return ctx;
}
