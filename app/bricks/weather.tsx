import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader, HeaderButton } from '@/components/ScreenHeader';
import { colors, spacing, typography } from '@/theme';

const FORECAST = [
  { day: 'Lun', icon: '🌦️', temp: '14°' },
  { day: 'Mar', icon: '⛅', temp: '16°' },
  { day: 'Mer', icon: '☀️', temp: '18°' },
  { day: 'Jeu', icon: '🌧️', temp: '12°' },
  { day: 'Ven', icon: '⛅', temp: '15°' },
];

export default function WeatherScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Météo Nantes"
        leftAction={<HeaderButton label="‹ Retour" onPress={() => router.back()} variant="back" />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.current}>
          <Text style={styles.emoji}>🌦️</Text>
          <Text style={styles.city}>Nantes, Loire-Atlantique</Text>
          <Text style={styles.temp}>14°C</Text>
          <Text style={styles.condition}>Partiellement nuageux</Text>
        </View>

        <View style={styles.forecastCard}>
          {FORECAST.map((f) => (
            <View key={f.day} style={styles.forecastItem}>
              <Text style={styles.forecastDay}>{f.day}</Text>
              <Text style={styles.forecastIcon}>{f.icon}</Text>
              <Text style={styles.forecastTemp}>{f.temp}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.placeholder}>Données météo à venir.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, alignItems: 'center', gap: spacing.lg },
  current: { alignItems: 'center', gap: spacing.xs },
  emoji: { fontSize: 72 },
  city: { ...typography.caption, color: colors.textSecondary },
  temp: { fontSize: 56, fontWeight: '200', color: colors.textPrimary, lineHeight: 64 },
  condition: { ...typography.body, color: colors.textSecondary },
  forecastCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    width: '100%',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  forecastItem: { alignItems: 'center', gap: spacing.xs },
  forecastDay: { ...typography.label, color: colors.textSecondary },
  forecastIcon: { fontSize: 22 },
  forecastTemp: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  placeholder: {
    ...typography.caption,
    color: colors.textDisabled,
    textAlign: 'center',
  },
});
