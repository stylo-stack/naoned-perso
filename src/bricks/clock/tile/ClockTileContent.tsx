import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNow } from '../hooks/useNow';

export function ClockTileContent() {
  const {formattedTime: { hours, minutes }} = useNow();
  const {t} = useTranslation()

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
    margin: "auto",
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
