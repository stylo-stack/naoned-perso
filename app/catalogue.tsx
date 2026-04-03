import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BRICK_REGISTRY } from '@/bricks/registry';
import { BrickDefinition } from '@/bricks/types';
import { CatalogueTile } from '@/bricks/components/CatalogueTile';
import { ScreenHeader, HeaderButton } from '@/components/ScreenHeader';
import { useDashboardContext } from '@/context/DashboardContext';
import { colors, spacing } from '@/theme';

export default function CatalogueScreen() {
  const router = useRouter();
  const { bricks, addBrick } = useDashboardContext();

  const enabledIds = new Set(bricks.map((b) => b.id));

  async function handleAdd(id: string) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addBrick(id);
    router.back();
  }

  function renderItem({ item }: { item: BrickDefinition }) {
    return (
      <CatalogueTile
        definition={item}
        isEnabled={enabledIds.has(item.id) && !item.allowMultiple}
        onAdd={() => handleAdd(item.id)}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Ajouter une tuile"
        rightAction={<HeaderButton label="Fermer" onPress={() => router.back()} />}
      />
      <FlatList
        data={BRICK_REGISTRY}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
});
