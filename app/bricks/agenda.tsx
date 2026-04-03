import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader, HeaderButton } from '@/components/ScreenHeader';
import { colors, spacing, typography } from '@/theme';

const FAKE_EVENTS = [
  {
    title: 'Marché de Talensac',
    date: 'Sam 5 avr.',
    time: '08:00 – 13:30',
    location: 'Place de Talensac',
  },
  {
    title: 'Concert au Lieu Unique',
    date: 'Sam 5 avr.',
    time: '20:30',
    location: 'Le Lieu Unique',
  },
  {
    title: 'Braderie du quartier Zola',
    date: 'Dim 6 avr.',
    time: '10:00 – 18:00',
    location: 'Rue Paul Bellamy',
  },
];

export default function AgendaScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Agenda"
        leftAction={<HeaderButton label="‹ Retour" onPress={() => router.back()} variant="back" />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📅</Text>
          <Text style={styles.headerTitle}>Prochains événements</Text>
        </View>

        {FAKE_EVENTS.map((event, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{event.date.split(' ')[1]}</Text>
              <Text style={styles.dayText}>{event.date.split(' ')[0]}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
              <Text style={styles.eventLocation}>📍 {event.location}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.placeholder}>Connectez votre agenda à venir.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, gap: spacing.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  headerIcon: { fontSize: 28 },
  headerTitle: { ...typography.heading, color: colors.textPrimary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dateBadge: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    width: 44,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dateText: { ...typography.subheading, color: colors.white },
  dayText: { ...typography.caption, color: 'rgba(255,255,255,0.8)' },
  cardBody: { flex: 1, gap: 3 },
  eventTitle: { ...typography.subheading, color: colors.textPrimary },
  eventTime: { ...typography.body, color: colors.textSecondary },
  eventLocation: { ...typography.caption, color: colors.textSecondary },
  placeholder: {
    ...typography.caption,
    color: colors.textDisabled,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
