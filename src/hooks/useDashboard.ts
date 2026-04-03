import { useEffect, useState } from 'react';
import { BrickId, BrickInstance } from '@/bricks/types'; // BrickId still used by handleAddBrick
import {
  addBrick,
  loadDashboard,
  removeBrick,
  reorderBricks,
  saveDashboard,
} from '@/store/dashboardStore';

export function useDashboard() {
  const [bricks, setBricks] = useState<BrickInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadDashboard().then((loaded) => {
      setBricks(loaded);
      setIsLoading(false);
    });
  }, []);

  function toggleEditMode(value?: boolean) {
    setIsEditMode((prev) => (value !== undefined ? value : !prev));
  }

  async function handleAddBrick(id: BrickId) {
    const updated = addBrick(bricks, id);
    setBricks(updated);
    await saveDashboard(updated);
  }

  async function handleRemoveBrick(instanceId: string) {
    const updated = removeBrick(bricks, instanceId);
    setBricks(updated);
    await saveDashboard(updated);
  }

  async function handleDragEnd(data: BrickInstance[]) {
    const updated = reorderBricks(data);
    setBricks(updated);
    await saveDashboard(updated);
  }

  return {
    bricks,
    isLoading,
    isEditMode,
    toggleEditMode,
    addBrick: handleAddBrick,
    removeBrick: handleRemoveBrick,
    onDragEnd: handleDragEnd,
  };
}
