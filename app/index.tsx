import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import { useDashboardContext } from '@/context/DashboardContext';
import { getBrickById } from '@/bricks/registry';
import { BrickInstance } from '@/bricks/types';
import { BrickTile } from '@/bricks/components/BrickTile';
import { BrickTileEdit } from '@/bricks/components/BrickTileEdit';
import { ScreenHeader, HeaderButton } from '@/components/ScreenHeader';
import { EmptyDashboard } from '@/components/EmptyDashboard';
import { colors, spacing, typography } from '@/theme';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { bricks, isLoading, isEditMode, toggleEditMode, removeBrick, onDragEnd } =
    useDashboardContext();

  function handleEditPress() {
    toggleEditMode(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleDonePress() {
    toggleEditMode(false);
  }

  function renderItem({ item, drag, isActive }: RenderItemParams<BrickInstance>) {
    const definition = getBrickById(item.id);
    if (!definition) return null;

    const content = isEditMode ? (
      <BrickTileEdit
        definition={definition}
        drag={drag}
        isActive={isActive}
        onRemove={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          removeBrick(item.instanceId);
        }}
      />
    ) : (
      <BrickTile
        definition={definition}
        instance={item}
        onPress={() =>
          router.push(`${definition.route}?instanceId=${item.instanceId}` as never)
        }
      />
    );

    if (definition.Provider) {
      const Provider = definition.Provider;
      return <Provider instanceId={item.instanceId}>{content}</Provider>;
    }
    return content;
  }

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Naoned"
        rightAction={
          isEditMode ? (
            <HeaderButton label={t('common.done')} onPress={handleDonePress} variant="primary" />
          ) : (
            <HeaderButton label={t('common.edit')} onPress={handleEditPress} />
          )
        }
      />

      {bricks.length === 0 && !isEditMode ? (
        <EmptyDashboard onAdd={() => router.push('/catalogue')} />
      ) : (
        <DraggableFlatList
          data={bricks}
          keyExtractor={(item) => item.instanceId}
          onDragEnd={({ data }) => onDragEnd(data)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          onPlaceholderIndexChange={() =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }
        />
      )}

      {isEditMode && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/catalogue')}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonLabel}>{t('dashboard.addTile')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  row: {
    gap: spacing.sm,
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 24,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonLabel: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
