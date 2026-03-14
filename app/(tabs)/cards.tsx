import React, { useState } from "react";
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
type AreaFilterType = "all" | "escrituras" | "deus" | "homem" | "salvacao" | "igreja" | "batismo" | "pratica" | "historia";

export default function CardsScreen() {
  const colors = useColors();
  const { state, toggleCard } = useFlashcards();
  const [filter, setFilter] = useState<FilterType>("all");
  const [areaFilter, setAreaFilter] = useState<AreaFilterType>("all");

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

  const getAreaLabel = (area: string): string => {
    switch (area) {
      case "escrituras":
        return "Escrituras";
      case "deus":
        return "Deus";
      case "homem":
        return "Homem";
      case "salvacao":
        return "Salvação";
      case "igreja":
        return "Igreja";
      case "batismo":
        return "Batismo";
      case "pratica":
        return "Prática";
      case "historia":
        return "História";
      default:
        return area;
    }
  };

  const getAreaColor = (area: string): string => {
    switch (area) {
      case "escrituras":
        return colors.primary;
      case "deus":
        return "#3B82F6";
      case "homem":
        return "#8B5CF6";
      case "salvacao":
        return "#EC4899";
      case "igreja":
        return "#10B981";
      case "batismo":
        return "#F59E0B";
      case "pratica":
        return "#6366F1";
      case "historia":
        return "#14B8A6";
      default:
        return colors.primary;
    }
  };

  return (
    <ScreenContainer className="p-4">
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Gerenciar Cards
        </Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Ativados
            </Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {enabledCount}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Desativados
            </Text>
            <Text style={[styles.statValue, { color: colors.error }]}>
              {disabledCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.foreground }]}>
          Filtrar por Status
        </Text>
        <View style={styles.filterButtons}>
          {(["all", "enabled", "disabled"] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    filter === f ? colors.primary : colors.surface,
                  borderColor: filter === f ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color: filter === f ? "white" : colors.foreground,
                  },
                ]}
              >
                {f === "all"
                  ? "Todos"
                  : f === "enabled"
                  ? "Ativados"
                  : "Desativados"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Filtro por Área */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.foreground }]}>
          Filtrar por Área
        </Text>
        <FlatList
          horizontal
          data={[
            "all",
            "escrituras",
            "deus",
            "homem",
            "salvacao",
            "igreja",
            "batismo",
            "pratica",
            "historia",
          ] as AreaFilterType[]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setAreaFilter(item)}
              style={[
                styles.areaButton,
                {
                  backgroundColor:
                    areaFilter === item
                      ? getAreaColor(item)
                      : colors.surface,
                  borderColor:
                    areaFilter === item
                      ? getAreaColor(item)
                      : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.areaButtonText,
                  {
                    color:
                      areaFilter === item ? "white" : colors.foreground,
                  },
                ]}
              >
                {item === "all" ? "Todas" : getAreaLabel(item)}
              </Text>
            </Pressable>
          )}
          scrollEnabled
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Lista de Cards */}
      <FlatList
        data={filteredCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.cardItem,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.cardContent}>
              <View
                style={[
                  styles.areaTag,
                  { backgroundColor: getAreaColor(item.area) },
                ]}
              >
                <Text style={styles.areaTagText}>
                  {getAreaLabel(item.area)}
                </Text>
              </View>
              <Text
                style={[styles.cardQuestion, { color: colors.foreground }]}
                numberOfLines={2}
              >
                {item.question}
              </Text>
              <View style={styles.cardStats}>
                <Text style={[styles.cardStat, { color: colors.muted }]}>
                  ✓ {item.correctCount} | ✗ {item.wrongCount} | ? {item.notSureCount} | ! {item.notRememberCount}
                </Text>
              </View>
            </View>
            <Switch
              value={item.enabled}
              onValueChange={() => handleToggle(item.id)}
              trackColor={{
                false: colors.border,
                true: colors.success,
              }}
              thumbColor={item.enabled ? colors.success : colors.muted}
            />
          </View>
        )}
        scrollEnabled
        nestedScrollEnabled
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  areaButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  areaButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  areaTag: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  areaTagText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  cardQuestion: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardStats: {
    marginTop: 4,
  },
  cardStat: {
    fontSize: 11,
  },
});
