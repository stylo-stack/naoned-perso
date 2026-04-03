import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getStops } from "naolib-wait-time-js";
import type { ArretStop } from "naolib-wait-time-js";
import { colors } from "@/theme";
import { styles } from "./styles";

let stopsCache: ArretStop[] | null = null;

async function getAllStops(): Promise<ArretStop[]> {
  if (!stopsCache) {
    stopsCache = await getStops();
  }
  return stopsCache;
}

type StopSearchStepProps = { onSelect: (stop: ArretStop) => void }

export function StopSearchStep({ onSelect }: StopSearchStepProps) {
  const [query, setQuery] = useState("");
  const [allStops, setAllStops] = useState<ArretStop[]>([]);
  const [fetchingStops, setFetchingStops] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setFetchingStops(true);
    getAllStops()
      .then(setAllStops)
      .finally(() => setFetchingStops(false));
  }, []);

  const results =
    query.length >= 2
      ? allStops
          .filter((s) => s.libelle.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 20)
      : [];

  return (
    <View>
      <Text style={styles.stepTitle}>Choisir un arrêt</Text>

      <TextInput
        ref={inputRef}
        style={styles.searchInput}
        placeholder="Rechercher un arrêt…"
        placeholderTextColor={colors.textDisabled}
        value={query}
        onChangeText={setQuery}
        autoFocus
        clearButtonMode="while-editing"
      />

      {fetchingStops && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.hint}>Chargement des arrêts…</Text>
        </View>
      )}

      {!fetchingStops && query.length >= 2 && results.length === 0 && (
        <Text style={styles.hint}>Aucun arrêt trouvé.</Text>
      )}

      {!fetchingStops && query.length < 2 && (
        <Text style={styles.hint}>
          Tapez au moins 2 caractères pour rechercher.
        </Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.codeLieu}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.listItemLabel}>{item.libelle}</Text>
            <Text style={styles.listItemSub} numberOfLines={1}>
              {item.ligne.map((l) => l.numLigne).join(" · ")}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
