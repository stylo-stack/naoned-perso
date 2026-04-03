import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { getNextDepartures } from "naolib-wait-time-js";
import type { ArretStop } from "naolib-wait-time-js";
import { colors} from "@/theme";
import { getLineColor } from "../../utils/lineColors";
import { styles } from "./styles";


type DirectionOption = {
  sens: 1 | 2;
  terminusLabel: string;
  disabled?: boolean;
};


type ChooseDirectionStepProps = {
  stop: ArretStop;
  numLigne: string;
  onBack: () => void;
  onSelect: (sens: 1 | 2, terminusLabel: string, lineColor: string) => void;
}

export function ChooseDirectionStep({
  stop,
  numLigne,
  onBack,
  onSelect,
}: ChooseDirectionStepProps) {
  const { t } = useTranslation();
  const [directions, setDirections] = useState<DirectionOption[]>([]);
  const [lineColor, setLineColor] = useState("#059669");
  const [loading, setLoading] = useState(true);
  const [nullScheduleData, setNullScheduleData] = useState(false);

  const loadDirections = useCallback(async () => {
    setLoading(true);
    try {
      const results = await getNextDepartures(stop.codeLieu, {
        line: numLigne,
        limit: 10,
      });
      const seen = new Map<number, string>();
      for (const r of results) {
        if (!seen.has(r.sens)) seen.set(r.sens, r.terminus);
      }
      const found: DirectionOption[] = [];
      if (seen.has(1)) found.push({ sens: 1, terminusLabel: seen.get(1)! });
      if (seen.has(2)) found.push({ sens: 2, terminusLabel: seen.get(2)! });
      // If no live data, offer both directions unlabelled
      if (found.length === 0) {
        setNullScheduleData(true);
        found.push({
          sens: 1,
          terminusLabel: t('bricks.wait-time.setup.directionNoData', { n: 1 }),
          disabled: true,
        });
        found.push({
          sens: 2,
          terminusLabel: t('bricks.wait-time.setup.directionNoData', { n: 2 }),
          disabled: true,
        });
      } else if (found.length === 1) {
        const other: 1 | 2 = found[0].sens === 1 ? 2 : 1;
        found.push({ sens: other, terminusLabel: t('bricks.wait-time.setup.directionOther', { n: other }) });
      }
      setDirections(found.sort((a, b) => a.sens - b.sens));
      setLineColor(getLineColor(numLigne));
    } catch {
      setDirections([
        { sens: 1, terminusLabel: t('bricks.wait-time.setup.direction1') },
        { sens: 2, terminusLabel: t('bricks.wait-time.setup.direction2') },
      ]);
    } finally {
      setLoading(false);
    }
  }, [stop.codeLieu, numLigne, t]);

  useEffect(() => {
    loadDirections();
  }, [loadDirections]);

  return (
    <>
    <View>
      <TouchableOpacity onPress={onBack} style={styles.backRow}>
        <Text style={styles.backLabel}>{t('bricks.wait-time.setup.editLine')}</Text>
      </TouchableOpacity>

      <Text style={styles.stepTitle}>
        {t('bricks.wait-time.setup.lineTitle', { numLigne, stopLabel: stop.libelle })}
      </Text>
      <Text style={styles.stepSubtitle}>{nullScheduleData ? t('bricks.wait-time.setup.noData') : t('bricks.wait-time.setup.chooseDirection')}</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={directions}
          keyExtractor={(item) => String(item.sens)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              disabled={item.disabled}
              onPress={() => onSelect(item.sens, item.terminusLabel, lineColor)}
            >
              <Text style={[styles.listItemLabel]}>→ {item.terminusLabel}</Text>
            </TouchableOpacity>
          )}
        />
      )}

    </View>
          {nullScheduleData ? (
        <View style={{padding: 40, ...styles.centered}}>
          <TouchableOpacity onPress={onBack}>
            <Text>{t('bricks.wait-time.setup.editLineButton')}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      </>
  );
}
