import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { ArretStop } from "naolib-wait-time-js";
import { getLineColor } from "../../utils/lineColors";
import { styles } from "./styles";


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
  return (
    <View style={{marginBottom: 200}}>
      <TouchableOpacity onPress={onBack} style={styles.backRow}>
        <Text style={styles.backLabel}>‹ Modifier l'arrêt</Text>
      </TouchableOpacity>

      <Text style={styles.stepTitle}>{stop.libelle}</Text>
      <Text style={styles.stepSubtitle}>Choisir une ligne</Text>

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