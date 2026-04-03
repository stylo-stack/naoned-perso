import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getNextDepartures, getStops } from 'naolib-wait-time-js';
import type { ArretStop } from 'naolib-wait-time-js';
import { colors, spacing, typography } from '@/theme';
import { getLineColor } from './lineColors';
import type { WaitTimeConfig } from './WaitTimeContext';

type Props = {
  onDone: (config: WaitTimeConfig) => void;
};

type Step =
  | { type: 'stop' }
  | { type: 'line'; stop: ArretStop }
  | { type: 'direction'; stop: ArretStop; numLigne: string };

type DirectionOption = {
  sens: 1 | 2;
  terminusLabel: string;
};

let stopsCache: ArretStop[] | null = null;

async function getAllStops(): Promise<ArretStop[]> {
  if (!stopsCache) {
    stopsCache = await getStops();
  }
  return stopsCache;
}

export function WaitTimeSetup({ onDone }: Props) {
  const [step, setStep] = useState<Step>({ type: 'stop' });

  if (step.type === 'stop') {
    return (
      <StopSearchStep
        onSelect={(stop) => setStep({ type: 'line', stop })}
      />
    );
  }
  if (step.type === 'line') {
    return (
      <LinePickStep
        stop={step.stop}
        onBack={() => setStep({ type: 'stop' })}
        onSelect={(numLigne) => setStep({ type: 'direction', stop: step.stop, numLigne })}
      />
    );
  }
  return (
    <DirectionPickStep
      stop={step.stop}
      numLigne={step?.numLigne}
      onBack={() => setStep({ type: 'line', stop: step.stop })}
      onSelect={(sens, terminusLabel, lineColor) =>
        onDone({
          codeLieu: step.stop.codeLieu,
          stopLabel: step.stop.libelle,
          numLigne: step?.numLigne,
          sens,
          terminusLabel,
          lineColor,
        })
      }
    />
  );
}

// ─── Step 1: search stop ─────────────────────────────────────────────────────

function StopSearchStep({ onSelect }: { onSelect: (stop: ArretStop) => void }) {
  const [query, setQuery] = useState('');
  const [allStops, setAllStops] = useState<ArretStop[]>([]);
  const [fetchingStops, setFetchingStops] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setFetchingStops(true);
    getAllStops()
      .then(setAllStops)
      .finally(() => setFetchingStops(false));
  }, []);

  const results = query.length >= 2
    ? allStops
        .filter((s) => s.libelle.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 20)
    : [];

  return (
    <View style={styles.stepContainer}>
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
        <Text style={styles.hint}>Tapez au moins 2 caractères pour rechercher.</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.codeLieu}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => onSelect(item)}>
            <Text style={styles.listItemLabel}>{item.libelle}</Text>
            <Text style={styles.listItemSub}>{item.ligne.map((l) => l.numLigne).join(' · ')}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ─── Step 2: pick line ────────────────────────────────────────────────────────

function LinePickStep({
  stop,
  onBack,
  onSelect,
}: {
  stop: ArretStop;
  onBack: () => void;
  onSelect: (numLigne: string) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backRow}>
        <Text style={styles.backLabel}>‹ Modifier l'arrêt</Text>
      </TouchableOpacity>

      <Text style={styles.stepTitle}>{stop.libelle}</Text>
      <Text style={styles.stepSubtitle}>Choisir une ligne</Text>

      <FlatList
        data={stop.ligne}
        keyExtractor={(item) => item.numLigne}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => onSelect(item.numLigne)}>
            <View style={[styles.lineBadge, {backgroundColor: getLineColor(item.numLigne)}]}>
              <Text style={styles.lineBadgeText}>{item.numLigne}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ─── Step 3: pick direction ───────────────────────────────────────────────────

function DirectionPickStep({
  stop,
  numLigne,
  onBack,
  onSelect,
}: {
  stop: ArretStop;
  numLigne: string;
  onBack: () => void;
  onSelect: (sens: 1 | 2, terminusLabel: string, lineColor: string) => void;
}) {
  const [directions, setDirections] = useState<DirectionOption[]>([]);
  const [lineColor, setLineColor] = useState('#059669');
  const [loading, setLoading] = useState(true);

  const loadDirections = useCallback(async () => {
    setLoading(true);
    try {
      const results = await getNextDepartures(stop.codeLieu, { line: numLigne, limit: 10 });
      const seen = new Map<number, string>();
      for (const r of results) {
        if (!seen.has(r.sens)) seen.set(r.sens, r.terminus);
      }
      const found: DirectionOption[] = [];
      if (seen.has(1)) found.push({ sens: 1, terminusLabel: seen.get(1)! });
      if (seen.has(2)) found.push({ sens: 2, terminusLabel: seen.get(2)! });
      // If no live data, offer both directions unlabelled
      if (found.length === 0) {
        found.push({ sens: 1, terminusLabel: 'Direction 1' });
        found.push({ sens: 2, terminusLabel: 'Direction 2' });
      } else if (found.length === 1) {
        const other: 1 | 2 = found[0].sens === 1 ? 2 : 1;
        found.push({ sens: other, terminusLabel: `Direction ${other}` });
      }
      setDirections(found.sort((a, b) => a.sens - b.sens));
      setLineColor(getLineColor(numLigne));
    } catch {
      setDirections([
        { sens: 1, terminusLabel: 'Direction 1' },
        { sens: 2, terminusLabel: 'Direction 2' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [stop.codeLieu, numLigne]);

  useEffect(() => { loadDirections(); }, [loadDirections]);

  return (
    <View style={styles.stepContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backRow}>
        <Text style={styles.backLabel}>‹ Modifier la ligne</Text>
      </TouchableOpacity>

      <Text style={styles.stepTitle}>Ligne {numLigne} — {stop.libelle}</Text>
      <Text style={styles.stepSubtitle}>Choisir une direction</Text>

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
              onPress={() => onSelect(item.sens, item.terminusLabel, lineColor)}
            >
              <Text style={[styles.listItemLabel]}>→ {item.terminusLabel}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginBottom: 2,
    marginHorizontal: spacing.base,
  },
  stepSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    marginHorizontal: spacing.base,
  },
  backRow: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  backLabel: {
    ...typography.body,
    color: colors.accent,
  },
  searchInput: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...typography.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hint: {
    ...typography.caption,
    color: colors.textDisabled,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginHorizontal: spacing.base,
  },
  centered: {
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  listItemLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  listItemSub: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  lineBadge: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  lineBadgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
