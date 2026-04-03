import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import type { ArretStop } from "naolib-wait-time-js";
import { styles } from "./styles";
import { getLineColor } from "../../utils/lineColors";


type ChooseDirectionStepProps = {
  stop: ArretStop;
  onBack: () => void;
  onSelect: (numLigne: string) => void;
}

export function ChooseLineStep({
  stop,
  onBack,
  onSelect,
}: ChooseDirectionStepProps) {
  const { t } = useTranslation();
  return (
    <View style={{marginBottom: 200}}>
      <TouchableOpacity onPress={onBack} style={styles.backRow}>
        <Text style={styles.backLabel}>{t('bricks.wait-time.setup.editStop')}</Text>
      </TouchableOpacity>

      <Text style={styles.stepTitle}>{stop.libelle}</Text>
      <Text style={styles.stepSubtitle}>{t('bricks.wait-time.setup.chooseLine')}</Text>

      <FlatList
        data={stop.ligne}
        keyExtractor={(item) => item.numLigne}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => onSelect(item.numLigne)}
          >
            <View
              style={[
                styles.lineBadge,
                { backgroundColor: getLineColor(item.numLigne) },
              ]}
            >
              <Text style={styles.lineBadgeText}>{item.numLigne}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
