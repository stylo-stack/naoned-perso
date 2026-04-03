import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useClockTime, formatNantesTime } from '../ClockContext';
import { useTranslation } from 'react-i18next';

export function ClockTileContent() {
  const now = useClockTime();
  const {t} = useTranslation()
  const { hours, minutes } = formatNantesTime(now);

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {hours}:{minutes}
      </Text>
      <Text style={styles.label}>{t("common.nantes")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: "red",
    borderWidth: 2
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
