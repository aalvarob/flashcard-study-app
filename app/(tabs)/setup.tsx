import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { useFlashcards } from "@/context/FlashcardContext";
import { router } from "expo-router";

import { FlashcardArea } from "@/data/flashcards";

type AreaType = string;

export default function SetupScreen() {
  const colors = useColors();
  const { initializeSession, state, toggleAllCards, toggleAllCardsByArea } = useFlashcards();

  const [candidateName, setCandidateName] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<Set<AreaType>>(new Set());
  const [cardsPerArea, setCardsPerArea] = useState("1");
  const [selectionMode, setSelectionMode] = useState<"single" | "multiple">("single");
  const [areas, setAreas] = useState<{ id: string; label: string; description: string; color: string }[]>([]);

  // Load areas dynamically from cards
  useEffect(() => {
    const uniqueAreas = new Map<string, number>();
    state.cards.forEach((card) => {
      uniqueAreas.set(card.area, (uniqueAreas.get(card.area) || 0) + 1);
    });

    const colorsList = [
      colors.primary,
      "#3B82F6",
      "#8B5CF6",
      "#EC4899",
      "#10B981",
      "#F59E0B",
      "#6366F1",
      "#14B8A6",
      "#EF4444",
      "#F97316",
    ];

    const loadedAreas = Array.from(uniqueAreas.entries()).map(([areaName, count], index) => ({
      id: areaName,
      label: areaName,
      description: `${count} card${count !== 1 ? "s" : ""}`,
      color: colorsList[index % colorsList.length],
    }));

    setAreas(loadedAreas.sort((a, b) => a.label.localeCompare(b.label)));
  }, [state.cards, colors.primary]);

  // Habilitar todos os cards quando selectionMode eh single
  useEffect(() => {
    if (selectionMode === "single") {
      toggleAllCards(true);
    }
  }, [selectionMode, toggleAllCards]);

  const staticAreas: { id: AreaType; label: string; description: string; color: string }[] = [
    { id: "escrituras_sagradas", label: "Escrituras Sagradas", description: "25 cards", color: colors.primary },
    { id: "deus_pai", label: "Deus Pai", description: "15 cards", color: "#3B82F6" },
    { id: "deus_filho", label: "Deus Filho", description: "4 cards", color: "#3B82F6" },
    { id: "deus_espirito_santo", label: "Deus Espírito Santo", description: "7 cards", color: "#3B82F6" },
    { id: "homem", label: "O Homem", description: "1 card", color: "#8B5CF6" },
    { id: "pecado", label: "O Pecado", description: "2 cards", color: "#8B5CF6" },
    { id: "salvacao", label: "Salvação", description: "6 cards", color: "#EC4899" },
    { id: "eleicao", label: "Eleição", description: "3 cards", color: "#EC4899" },
    { id: "reino_de_deus", label: "Reino de Deus", description: "4 cards", color: "#EC4899" },
    { id: "igreja", label: "Igreja", description: "15 cards", color: "#10B981" },
    { id: "dia_do_senhor", label: "O Dia do Senhor", description: "3 cards", color: "#10B981" },
    { id: "ministerio_da_palavra", label: "Ministério da Palavra", description: "4 cards", color: "#10B981" },
    { id: "liberdade_religiosa", label: "Liberdade Religiosa", description: "3 cards", color: "#10B981" },
    { id: "morte", label: "Morte", description: "6 cards", color: "#F59E0B" },
    { id: "justos_e_impios", label: "Justos e Ímpios", description: "5 cards", color: "#F59E0B" },
    { id: "anjos", label: "Anjos", description: "2 cards", color: "#F59E0B" },
    { id: "amor_ao_proximo_e_etica", label: "Amor ao Próximo e Ética", description: "2 cards", color: "#6366F1" },
    { id: "batismo_e_ceia", label: "Batismo e Ceia do Senhor", description: "9 cards", color: "#6366F1" },
    { id: "evangelismo_e_missoes", label: "Evangelismo e Missões", description: "3 cards", color: "#6366F1" },
    { id: "educacao_religiosa", label: "Educação Religiosa", description: "2 cards", color: "#14B8A6" },
    { id: "ordem_social", label: "Ordem Social", description: "2 cards", color: "#14B8A6" },
    { id: "familia", label: "Família", description: "3 cards", color: "#14B8A6" },
    { id: "principios_batistas", label: "Princípios Batistas", description: "1 card", color: "#14B8A6" },
    { id: "historia_dos_batistas", label: "História dos Batistas", description: "3 cards", color: "#14B8A6" },
    { id: "estrutura_e_funcionamento_cbb", label: "Estrutura e Funcionamento da CBB", description: "2 cards", color: "#14B8A6" },
  ];

  // Use dynamic areas if available, otherwise use static areas
  const displayAreas = areas.length > 0 ? areas : staticAreas;

  const cardCounts = ["5", "10", "15", "20", "25", "30", "40", "50"];

  const areaStats = useMemo(() => {
    const stats: Record<string, { enabled: number; total: number }> = {};
    displayAreas.forEach((area) => {
      const areaCards = state.cards.filter((c) => c.area === area.id);
      const enabledCards = areaCards.filter((c) => c.enabled);
      stats[area.id] = { enabled: enabledCards.length, total: areaCards.length };
    });
    return stats;
  }, [state.cards, areas]);

  const getAreaStats = (area: string) => areaStats[area] || { enabled: 0, total: 0 };

  function toggleArea(areaId: AreaType) {
    const newSelected = new Set(selectedAreas);
    if (newSelected.has(areaId)) {
      newSelected.delete(areaId);
    } else {
      newSelected.add(areaId);
    }
    setSelectedAreas(newSelected);
  }

  function toggleAllAreas() {
    if (selectedAreas.size === 0) {
      // Nenhuma área selecionada - ativar/desativar todos os cards
      const allEnabled = state.cards.every((c) => c.enabled);
      toggleAllCards(!allEnabled);
    } else {
      // Áreas selecionadas - ativar/desativar apenas cards das áreas selecionadas
      const selectedAreaIds = Array.from(selectedAreas);
      const allSelectedEnabled = state.cards
        .filter((c) => selectedAreaIds.includes(c.area))
        .every((c) => c.enabled);
      toggleAllCardsByArea(!allSelectedEnabled, selectedAreaIds);
    }
  }

  // Calcular o máximo de cards disponíveis nas áreas selecionadas
  const getMaxCardsAvailable = () => {
    if (selectionMode === "single") {
      // Modo "todas as áreas": retorna o total de cards habilitados
      return state.cards.filter(c => c.enabled).length;
    } else {
      // Modo múltiplo: retorna o total de cards habilitados nas áreas selecionadas
      const selectedAreaIds = Array.from(selectedAreas);
      return state.cards.filter(c => c.enabled && selectedAreaIds.includes(c.area)).length;
    }
  };

  const maxCardsAvailable = getMaxCardsAvailable();
  const currentCardsPerArea = Math.min(parseInt(cardsPerArea), maxCardsAvailable);

  function handleStartStudy() {
    if (!candidateName.trim()) {
      Alert.alert("Atenção", "Por favor, informe seu nome para continuar.");
      return;
    }

    if (selectionMode === "multiple" && selectedAreas.size === 0) {
      Alert.alert("Atenção", "Por favor, selecione pelo menos uma área para continuar.");
      return;
    }

    if (currentCardsPerArea === 0) {
      Alert.alert("Atenção", "Nenhum card disponível nas áreas selecionadas.");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Inicializar a sessão com as configurações
    const selectedAreasList = selectionMode === "multiple" ? Array.from(selectedAreas) : "all";
    
    initializeSession({
      candidateName: candidateName.trim(),
      area: selectedAreasList as any,
      cardsPerArea: currentCardsPerArea,
    });

    // Navegar para a tela de estudo
    router.push("/");
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    header: {
      marginBottom: 24,
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.foreground,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.muted,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.foreground,
      backgroundColor: colors.surface,
    },
    modeToggle: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 16,
    },
    modeButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      alignItems: "center",
    },
    modeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    modeButtonInactive: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    modeButtonText: {
      fontSize: 12,
      fontWeight: "600",
    },
    modeButtonTextActive: {
      color: colors.background,
    },
    modeButtonTextInactive: {
      color: colors.foreground,
    },
    areaGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 16,
    },
    areaButton: {
      width: "48%",
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      borderWidth: 2,
      alignItems: "center",
      marginRight: "4%",
      marginBottom: 12,
    },
    areaButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    areaButtonUnselected: {
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    areaLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 2,
    },
    areaDescription: {
      fontSize: 10,
      color: colors.muted,
    },
    cardCountGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    cardCountInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    cardCountButton: {
      width: 50,
      height: 50,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    cardCountButtonText: {
      fontSize: 24,
      fontWeight: "600",
      color: colors.primary,
    },
    cardCountInput: {
      width: 80,
      height: 50,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.surface,
      fontSize: 18,
      fontWeight: "600",
      color: colors.foreground,
      textAlign: "center",
      paddingHorizontal: 8,
    },
    cardCountButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    cardCountButtonInactive: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    cardCountText: {
      fontSize: 12,
      fontWeight: "600",
    },
    cardCountTextActive: {
      color: colors.foreground,
    },
    toggleAllButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      alignItems: "center",
      minWidth: 100,
    },
    cardCountTextInactive: {
      color: colors.foreground,
    },
    startButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 24,
    },
    startButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.background,
    },
  });

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Simulado Concílio</Text>
            <Text style={styles.subtitle}>Configurar Sessão de Estudo</Text>
          </View>

          {/* Nome do Candidato */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nome do Candidato</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor={colors.muted}
              value={candidateName}
              onChangeText={setCandidateName}
            />
          </View>

          {/* Área da Teologia */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Área da Teologia</Text>
            <View style={styles.modeToggle}>
              <Pressable
                style={[
                  styles.modeButton,
                  selectionMode === "single" ? styles.modeButtonActive : styles.modeButtonInactive,
                ]}
                onPress={() => {
                  setSelectionMode("single");
                  setSelectedAreas(new Set());
                }}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    selectionMode === "single" ? styles.modeButtonTextActive : styles.modeButtonTextInactive,
                  ]}
                >
                  Todas
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modeButton,
                  selectionMode === "multiple" ? styles.modeButtonActive : styles.modeButtonInactive,
                ]}
                onPress={() => setSelectionMode("multiple")}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    selectionMode === "multiple" ? styles.modeButtonTextActive : styles.modeButtonTextInactive,
                  ]}
                >
                  Escolher Áreas
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Seleção de Áreas (apenas no modo múltiplo) */}
          {selectionMode === "multiple" && (
            <View style={styles.section}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>Selecione as Áreas</Text>
                <Pressable
                  style={[
                    styles.toggleAllButton,
                    selectedAreas.size === areas.length ? styles.cardCountButtonActive : styles.cardCountButtonInactive,
                  ]}
                  onPress={toggleAllAreas}
                >
                  <Text
                    style={[
                      styles.cardCountText,
                      selectedAreas.size > 0 && state.cards.filter((c) => Array.from(selectedAreas).includes(c.area)).every((c) => c.enabled) ? styles.cardCountTextActive : styles.cardCountTextInactive,
                    ]}
                  >
                    {selectedAreas.size === 0
                      ? (state.cards.every((c) => c.enabled) ? "Desativar Todos" : "Ativar Todos")
                      : (state.cards.filter((c) => Array.from(selectedAreas).includes(c.area)).every((c) => c.enabled) ? "Desativar" : "Ativar")}
                  </Text>
                </Pressable>
              </View>
              <View style={styles.areaGrid}>
                {displayAreas.map((area) => (
                  <Pressable
                    key={area.id}
                    style={[
                      styles.areaButton,
                      selectedAreas.has(area.id) ? [styles.areaButtonSelected, { backgroundColor: area.color }] : styles.areaButtonUnselected,
                    ]}
                    onPress={() => toggleArea(area.id)}
                  >
                    <Text style={[
                      styles.areaLabel,
                      selectedAreas.has(area.id) && { color: '#FFFFFF' }
                    ]}>{area.label}</Text>
                    <Text style={[
                      styles.areaDescription,
                      selectedAreas.has(area.id) && { color: '#FFFFFF', opacity: 0.95 }
                    ]}>
                      {areaStats[area.id]?.enabled || 0}/{areaStats[area.id]?.total || 0} cards
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Quantidade de Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantidade de Cards</Text>
            <View style={styles.cardCountInputContainer}>
              <Pressable
                onPress={() => {
                  const current = parseInt(cardsPerArea);
                  if (current > 1) setCardsPerArea((current - 1).toString());
                }}
                style={styles.cardCountButton}
              >
                <Text style={styles.cardCountButtonText}>−</Text>
              </Pressable>
              <TextInput
                style={styles.cardCountInput}
                value={cardsPerArea}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  const limited = Math.min(Math.max(1, num), maxCardsAvailable);
                  setCardsPerArea(limited.toString());
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
              <Pressable
                onPress={() => {
                  const current = parseInt(cardsPerArea);
                  if (current < maxCardsAvailable) setCardsPerArea((current + 1).toString());
                }}
                style={styles.cardCountButton}
              >
                <Text style={styles.cardCountButtonText}>+</Text>
              </Pressable>
            </View>
          </View>

          {/* Botão Iniciar */}
          <Pressable style={styles.startButton} onPress={handleStartStudy}>
            <Text style={styles.startButtonText}>Iniciar Estudo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
