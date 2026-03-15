import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFlashcards } from "@/context/FlashcardContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Card {
  id: string;
  question: string;
  answer: string;
  area: string;
  enabled?: boolean;
}

const DEFAULT_AREAS = [
  "Escrituras Sagradas",
  "Deus Pai",
  "Deus Filho",
  "Deus Espírito Santo",
  "Homem",
  "Pecado",
  "Salvação",
  "Eleição",
  "Reino de Deus",
  "Igreja",
  "Dia do Senhor",
  "Ministério da Palavra",
  "Liberdade Religiosa",
  "Morte",
  "Justos e Ímpios",
  "Anjos",
  "Amor ao Próximo e Ética",
  "Batismo e Ceia",
  "Mordomia",
  "Evangelismo e Missões",
  "Educação Religiosa",
  "Ordem Social",
  "Família",
  "Princípios Batistas",
  "História dos Batistas",
  "Estrutura e Funcionamento CBB",
];

export default function AdminScreen() {
  const colors = useColors();
  const { state: contextState } = useFlashcards();
  const [cards, setCards] = useState<Card[]>([]);
  const [areas, setAreas] = useState<string[]>(DEFAULT_AREAS);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    area: DEFAULT_AREAS[0],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  // Load cards from context
  useEffect(() => {
    if (contextState?.cards && contextState.cards.length > 0) {
      const mappedCards = contextState.cards.map((c) => ({
        id: c.id,
        question: c.question,
        answer: c.answer,
        area: c.area,
        enabled: c.enabled,
      }));
      setCards(mappedCards);
    } else {
      loadCardsFromStorage();
    }
    loadAreasFromStorage();
  }, [contextState?.cards]);

  const loadCardsFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem("flashcards");
      if (stored) {
        setCards(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  };

  const loadAreasFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem("areas");
      if (stored) {
        setAreas(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading areas:", error);
    }
  };

  const saveCards = async (updatedCards: Card[]) => {
    try {
      await AsyncStorage.setItem("flashcards", JSON.stringify(updatedCards));
      setCards(updatedCards);
    } catch (error) {
      console.error("Error saving cards:", error);
    }
  };

  const handleAddCard = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      Alert.alert("Erro", "Pergunta e resposta são obrigatórias");
      return;
    }

    const newCard: Card = {
      id: Date.now().toString(),
      question: formData.question,
      answer: formData.answer,
      area: formData.area,
      enabled: true,
    };

    const updated = editingId
      ? cards.map((c) => (c.id === editingId ? { ...newCard, id: c.id } : c))
      : [...cards, newCard];

    await saveCards(updated);
    setFormData({ question: "", answer: "", area: areas[0] });
    setEditingId(null);
    Alert.alert("Sucesso", editingId ? "Card atualizado" : "Card criado");
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert("Confirmar", "Tem certeza que deseja deletar este card?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          const updated = cards.filter((c) => c.id !== id);
          await saveCards(updated);
          Alert.alert("Sucesso", "Card deletado");
        },
      },
    ]);
  };

  const handleEditCard = (card: Card) => {
    setFormData({
      question: card.question,
      answer: card.answer,
      area: card.area,
    });
    setEditingId(card.id);
  };

  const handleToggleCard = async (id: string) => {
    const updated = cards.map((c) =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    await saveCards(updated);
  };

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = !selectedArea || card.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 12,
    },
    formGroup: {
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.foreground,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      color: colors.foreground,
      backgroundColor: colors.surface,
      fontSize: 14,
    },
    multilineInput: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 12,
    },
    buttonText: {
      color: colors.background,
      fontWeight: "600",
      fontSize: 14,
    },
    card: {
      backgroundColor: colors.surface,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      padding: 12,
      marginBottom: 12,
      borderRadius: 8,
    },
    cardQuestion: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 6,
    },
    cardAnswer: {
      fontSize: 13,
      color: colors.muted,
      marginBottom: 8,
    },
    cardArea: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: "500",
      marginBottom: 8,
    },
    cardActions: {
      flexDirection: "row",
      gap: 8,
    },
    smallButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: "center",
    },
    editButton: {
      backgroundColor: colors.primary,
    },
    deleteButton: {
      backgroundColor: colors.error,
    },
    smallButtonText: {
      color: "#fff",
      fontWeight: "500",
      fontSize: 12,
    },
    stats: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
    },
    statItem: {
      alignItems: "center",
    },
    statNumber: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 4,
    },
  });

  return (
    <ScreenContainer className="flex-1">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{cards.length}</Text>
            <Text style={styles.statLabel}>Total de Cards</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {cards.filter((c) => c.enabled).length}
            </Text>
            <Text style={styles.statLabel}>Habilitados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{areas.length}</Text>
            <Text style={styles.statLabel}>Áreas</Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {editingId ? "Editar Card" : "Criar Novo Card"}
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Área</Text>
            <View
              style={[
                styles.input,
                { paddingVertical: 0, paddingHorizontal: 0 },
              ]}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {areas.map((area) => (
                  <Pressable
                    key={area}
                    onPress={() =>
                      setFormData({ ...formData, area })
                    }
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      backgroundColor:
                        formData.area === area
                          ? colors.primary
                          : colors.surface,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          formData.area === area
                            ? colors.background
                            : colors.foreground,
                        fontSize: 12,
                        fontWeight: "500",
                      }}
                    >
                      {area}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Pergunta</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Digite a pergunta"
              placeholderTextColor={colors.muted}
              value={formData.question}
              onChangeText={(text) =>
                setFormData({ ...formData, question: text })
              }
              multiline
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Resposta</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Digite a resposta"
              placeholderTextColor={colors.muted}
              value={formData.answer}
              onChangeText={(text) =>
                setFormData({ ...formData, answer: text })
              }
              multiline
            />
          </View>

          <Pressable
            style={styles.button}
            onPress={handleAddCard}
          >
            <Text style={styles.buttonText}>
              {editingId ? "Atualizar Card" : "Criar Card"}
            </Text>
          </Pressable>

          {editingId && (
            <Pressable
              style={[styles.button, { backgroundColor: colors.muted }]}
              onPress={() => {
                setEditingId(null);
                setFormData({
                  question: "",
                  answer: "",
                  area: areas[0],
                });
              }}
            >
              <Text style={styles.buttonText}>Cancelar Edição</Text>
            </Pressable>
          )}
        </View>

        {/* Search and Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cards ({filteredCards.length})</Text>

          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              placeholder="Buscar cards..."
              placeholderTextColor={colors.muted}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Filtrar por área</Text>
            <View
              style={[
                styles.input,
                { paddingVertical: 0, paddingHorizontal: 0 },
              ]}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Pressable
                  onPress={() => setSelectedArea("")}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor:
                      selectedArea === ""
                        ? colors.primary
                        : colors.surface,
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedArea === ""
                          ? colors.background
                          : colors.foreground,
                      fontSize: 12,
                      fontWeight: "500",
                    }}
                  >
                    Todas
                  </Text>
                </Pressable>
                {areas.map((area) => (
                  <Pressable
                    key={area}
                    onPress={() => setSelectedArea(area)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      backgroundColor:
                        selectedArea === area
                          ? colors.primary
                          : colors.surface,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          selectedArea === area
                            ? colors.background
                            : colors.foreground,
                        fontSize: 12,
                        fontWeight: "500",
                      }}
                    >
                      {area}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Cards List */}
        <View style={styles.section}>
          {filteredCards.length === 0 ? (
            <Text style={{ color: colors.muted, textAlign: "center" }}>
              Nenhum card encontrado
            </Text>
          ) : (
            filteredCards.map((card) => (
              <View key={card.id} style={styles.card}>
                <Text style={styles.cardQuestion}>{card.question}</Text>
                <Text style={styles.cardAnswer}>{card.answer}</Text>
                <Text style={styles.cardArea}>{card.area}</Text>
                <View style={styles.cardActions}>
                  <Pressable
                    style={[styles.smallButton, styles.editButton]}
                    onPress={() => handleEditCard(card)}
                  >
                    <Text style={styles.smallButtonText}>Editar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.smallButton, styles.deleteButton]}
                    onPress={() => handleDeleteCard(card.id)}
                  >
                    <Text style={styles.smallButtonText}>Deletar</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.smallButton,
                      {
                        backgroundColor: card.enabled
                          ? colors.success
                          : colors.muted,
                      },
                    ]}
                    onPress={() => handleToggleCard(card.id)}
                  >
                    <Text style={styles.smallButtonText}>
                      {card.enabled ? "Ativo" : "Inativo"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
