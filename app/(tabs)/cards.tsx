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
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";
import { FlashcardArea } from "@/data/flashcards";
import { EditFlashcardModal } from "@/components/EditFlashcardModal";

type FilterType = "all" | "enabled" | "disabled";
type AreaFilterType = "all" | FlashcardArea;

export default function CardsScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const { state, toggleCard } = useFlashcards();
  const [filter, setFilter] = useState<FilterType>("all");
  const [areaFilter, setAreaFilter] = useState<AreaFilterType>("all");
  const [editingCard, setEditingCard] = useState<{ id: number; question: string; answer: string; area: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateMutation = trpc.flashcards.update.useMutation();
  const createMutation = trpc.flashcards.create.useMutation();

  const isAdmin = user?.role === "admin";

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

  function handleEditCard(card: Flashcard) {
    if (!isAdmin) return;
    setEditingCard({
      id: parseInt(card.id),
      question: card.question,
      answer: card.answer,
      area: card.area,
    });
    setShowEditModal(true);
  }

  function handleCreateCard() {
    if (!isAdmin) return;
    setEditingCard(null);
    setShowEditModal(true);
  }

  async function handleSaveCard(data: { question: string; answer: string; area: string }) {
    setIsLoading(true);
    try {
      if (editingCard?.id) {
        // Update existing card
        await updateMutation.mutateAsync({
          id: editingCard.id,
          ...data,
        });
      } else {
        // Create new card
        await createMutation.mutateAsync(data);
      }
      setShowEditModal(false);
      setEditingCard(null);
    } catch (error) {
      console.error("Error saving card:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const getAreaLabel = (area: string): string => {
    const labels: { [key: string]: string } = {
      "escrituras_sagradas": "Escrituras",
      "deus_pai": "Deus Pai",
      "deus_filho": "Deus Filho",
      "deus_espirito_santo": "Esp. Santo",
      "homem": "Homem",
      "pecado": "Pecado",
      "salvacao": "Salvação",
      "eleicao": "Eleição",
      "reino_de_deus": "Reino",
      "igreja": "Igreja",
      "dia_do_senhor": "Domingo",
      "ministerio_da_palavra": "Ministério",
      "liberdade_religiosa": "Liberdade",
      "morte": "Morte",
      "justos_e_impios": "Justos/Ímpios",
      "anjos": "Anjos",
      "amor_ao_proximo_e_etica": "Amor/Ética",
      "batismo_e_ceia": "Batismo/Ceia",
      "mordomia": "Mordomia",
      "evangelismo_e_missoes": "Evangelismo",
      "educacao_religiosa": "Educação",
      "ordem_social": "Ordem Social",
      "familia": "Família",
      "principios_batistas": "Princípios",
      "historia_dos_batistas": "História",
      "estrutura_e_funcionamento_cbb": "CBB",
    };
    return labels[area] || area;
  };

  const getAreaColor = (area: string): string => {
    const colorMap: { [key: string]: string } = {
      "escrituras_sagradas": colors.primary,
      "deus_pai": "#3B82F6",
      "deus_filho": "#3B82F6",
      "deus_espirito_santo": "#3B82F6",
      "homem": "#8B5CF6",
      "pecado": "#8B5CF6",
      "salvacao": "#EC4899",
      "eleicao": "#EC4899",
      "reino_de_deus": "#EC4899",
      "igreja": "#10B981",
      "dia_do_senhor": "#10B981",
      "ministerio_da_palavra": "#10B981",
      "liberdade_religiosa": "#10B981",
      "morte": "#F59E0B",
      "justos_e_impios": "#F59E0B",
      "anjos": "#F59E0B",
      "amor_ao_proximo_e_etica": "#6366F1",
      "batismo_e_ceia": "#6366F1",
      "mordomia": "#6366F1",
      "evangelismo_e_missoes": "#6366F1",
      "educacao_religiosa": "#14B8A6",
      "ordem_social": "#14B8A6",
      "familia": "#14B8A6",
      "principios_batistas": "#14B8A6",
      "historia_dos_batistas": "#14B8A6",
      "estrutura_e_funcionamento_cbb": "#14B8A6",
    };
    return colorMap[area] || colors.primary;
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

      {/* Admin Actions */}
      {isAdmin && (
        <Pressable
          onPress={handleCreateCard}
          style={({ pressed }) => [
            styles.createButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.createButtonText}>+ Novo Card</Text>
        </Pressable>
      )}

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
            "escrituras_sagradas",
            "deus_pai",
            "deus_filho",
            "deus_espirito_santo",
            "homem",
            "pecado",
            "salvacao",
            "eleicao",
            "reino_de_deus",
            "igreja",
            "dia_do_senhor",
            "ministerio_da_palavra",
            "liberdade_religiosa",
            "morte",
            "justos_e_impios",
            "anjos",
            "amor_ao_proximo_e_etica",
            "batismo_e_ceia",
            "mordomia",
            "evangelismo_e_missoes",
            "educacao_religiosa",
            "ordem_social",
            "familia",
            "principios_batistas",
            "historia_dos_batistas",
            "estrutura_e_funcionamento_cbb",
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
            <View style={styles.cardActions}>
              {isAdmin && (
                <Pressable
                  onPress={() => handleEditCard(item)}
                  style={({ pressed }) => [
                    styles.editButton,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <Text style={styles.editButtonText}>✎</Text>
                </Pressable>
              )}
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
          </View>
        )}
        scrollEnabled
        nestedScrollEnabled
      />

      {/* Edit Modal */}
      <EditFlashcardModal
        visible={showEditModal}
        flashcard={editingCard || undefined}
        onClose={() => {
          setShowEditModal(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        isLoading={isLoading}
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
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 18,
    color: "#666",
  },
});
