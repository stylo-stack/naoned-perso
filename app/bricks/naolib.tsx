import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader, HeaderButton } from '@/components/ScreenHeader';
import { colors, spacing, typography } from '@/theme';

const FAKE_DEPARTURES = [
  { stop: 'Arrêt Commerce', line: 'Tram 1', direction: 'Beaujoire', minutes: 2 },
  { stop: 'Arrêt Commerce', line: 'Tram 1', direction: 'François Mitterrand', minutes: 8 },
  { stop: 'Arrêt Bouffay', line: 'Bus 11', direction: 'Zola', minutes: 4 },
  { stop: 'Arrêt Bouffay', line: 'Bus 11', direction: 'Gare de Nantes', minutes: 12 },
];

export default function NaolibScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Transports TAN"
        leftAction={<HeaderButton label="‹ Retour" onPress={() => router.back()} variant="back" />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>🚌</Text>
          <Text style={styles.bannerTitle}>Prochains passages</Text>
        </View>

        {FAKE_DEPARTURES.map((d, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.line}>{d.line}</Text>
              <Text style={styles.direction} numberOfLines={1}>
                → {d.direction}
              </Text>
              <Text style={styles.stop}>{d.stop}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.minutes}>{d.minutes}</Text>
              <Text style={styles.minutesLabel}>min</Text>
            </View>
          </View>
        ))}

        <Text style={styles.placeholder}>Données en temps réel à venir.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, gap: spacing.sm },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bannerIcon: { fontSize: 28 },
  bannerTitle: { ...typography.heading, color: colors.textPrimary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: { flex: 1 },
  line: { ...typography.subheading, color: '#2563EB' },
  direction: { ...typography.body, color: colors.textPrimary, marginTop: 2 },
  stop: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  cardRight: { alignItems: 'center', minWidth: 48 },
  minutes: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  minutesLabel: { ...typography.caption, color: colors.textSecondary },
  placeholder: {
    ...typography.caption,
    color: colors.textDisabled,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
