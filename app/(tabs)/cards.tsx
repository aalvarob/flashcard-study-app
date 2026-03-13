import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Switch,
  StyleSheet,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFlashcards, Flashcard } from "@/context/FlashcardContext";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

type FilterType = "all" | "enabled" | "disabled";

export default function CardsScreen() {
  const colors = useColors();
  const { state, toggleCard } = useFlashcards();
  const [filter, setFilter] = useState<FilterType>("all");
  const [areaFilter, setAreaFilter] = useState<"all" | "teologia" | "eclesiologia">("all");

  const filteredCards = state.cards.filter((card) => {
    const matchesStatus =
      filter === "all" ||
      (filter === "enabled" && card.enabled) ||
      (filter === "disabled" && !card.enabled);
    const matchesArea = areaFilter === "all" || card.area === areaFilter;
    return matchesStatus && matchesArea;
  });

  const enabledCount = state.cards.filter((c) => c.enabled).length;
  const disabledCount = state.cards.filter((c) => !c.enabled).length;

  function handleToggle(id: string) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleCard(id);
  }

  const renderItem = useCallback(
    ({ item }: { item: Flashcard }) => {
      const areaLabel = item.area === "teologia" ? "Teologia" : "Eclesiologia";
      const areaColor = item.area === "teologia" ? colors.primary : "#6B46C1";

      return (
        <View
          style={[
            styles.cardItem,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: item.enabled ? 1 : 0.5,
            },
          ]}
        >
          <View style={styles.cardItemContent}>
            <View style={[styles.areaBadge, { backgroundColor: areaColor + "15" }]}>
              <Text style={[styles.areaText, { color: areaColor }]}>{areaLabel}</Text>
            </View>
            <Text
              style={[styles.questionText, { color: colors.foreground }]}
              numberOfLines={2}
            >
              {item.question}
            </Text>
            {(item.correctCount > 0 || item.wrongCount > 0 || item.notSureCount > 0 || item.notRememberCount > 0) && (
              <View style={styles.statsRow}>
                {item.correctCount > 0 && (
                  <Text style={[styles.statText, { color: "#27AE60" }]}>
                    ✓ {item.correctCount}
                  </Text>
                )}
                {item.wrongCount > 0 && (
                  <Text style={[styles.statText, { color: "#E74C3C" }]}>
                    ✗ {item.wrongCount}
                  </Text>
                )}
                {item.notSureCount > 0 && (
                  <Text style={[styles.statText, { color: "#F59E0B" }]}>
                    ? {item.notSureCount}
                  </Text>
                )}
                {item.notRememberCount > 0 && (
                  <Text style={[styles.statText, { color: "#A855F7" }]}>
                    ! {item.notRememberCount}
                  </Text>
                )}
              </View>
            )}
          </View>
          <Switch
            value={item.enabled}
            onValueChange={() => handleToggle(item.id)}
            trackColor={{ false: colors.border, true: colors.accent + "80" }}
            thumbColor={item.enabled ? colors.accent : colors.muted}
            ios_backgroundColor={colors.border}
          />
        </View>
      );
    },
    [colors, handleToggle]
  );

  const keyExtractor = useCallback((item: Flashcard) => item.id, []);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Gerenciar Cards</Text>
        <View style={styles.statsHeader}>
          <Text style={[styles.statsHeaderText, { color: "rgba(255,255,255,0.85)" }]}>
            {enabledCount} habilitados · {disabledCount} desabilitados · {state.cards.length} total
          </Text>
        </View>
      </View>

      {/* Filtros de Status */}
      <View style={[styles.filtersContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.filterRow}>
          {(["all", "enabled", "disabled"] as FilterType[]).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={({ pressed }) => [
                styles.filterBtn,
                {
                  backgroundColor: filter === f ? colors.primary : colors.background,
                  borderColor: filter === f ? colors.primary : colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  { color: filter === f ? "#FFFFFF" : colors.muted },
                ]}
              >
                {f === "all" ? "Todos" : f === "enabled" ? "Habilitados" : "Desabilitados"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Filtro de Área */}
        <View style={styles.filterRow}>
          {(["all", "teologia", "eclesiologia"] as const).map((a) => (
            <Pressable
              key={a}
              onPress={() => setAreaFilter(a)}
              style={({ pressed }) => [
                styles.filterBtn,
                {
                  backgroundColor: areaFilter === a ? "#6B46C1" : colors.background,
                  borderColor: areaFilter === a ? "#6B46C1" : colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  { color: areaFilter === a ? "#FFFFFF" : colors.muted },
                ]}
              >
                {a === "all" ? "Todas as Áreas" : a === "teologia" ? "Teologia" : "Eclesiologia"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={filteredCards}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Nenhum card encontrado com os filtros selecionados.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statsHeader: {
    alignItems: "center",
  },
  statsHeaderText: {
    fontSize: 13,
    fontWeight: "500",
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  cardItemContent: {
    flex: 1,
    gap: 6,
  },
  areaBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  areaText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
