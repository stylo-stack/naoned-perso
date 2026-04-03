import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useClockTime, formatNantesTime } from './ClockContext';

export function ClockTileContent() {
  const now = useClockTime();
  const { hours, minutes } = formatNantesTime(now);

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {hours}:{minutes}
      </Text>
      <Text style={styles.label}>Nantes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  time: {
    fontSize: 38,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
    marginTop: 6,
  },
});
