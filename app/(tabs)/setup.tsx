import React, { useState } from "react";
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

type AreaType = "all" | "escrituras" | "deus" | "homem" | "salvacao" | "igreja" | "batismo" | "pratica" | "historia";

export default function SetupScreen() {
  const colors = useColors();
  const { initializeSession } = useFlashcards();

  const [candidateName, setCandidateName] = useState("");
  const [selectedArea, setSelectedArea] = useState<AreaType>("all");
  const [cardsPerArea, setCardsPerArea] = useState("10");

  const areas = [
    { id: "all" as AreaType, label: "Todas as Áreas", description: "129 cards", color: colors.primary },
    { id: "escrituras" as AreaType, label: "Escrituras Sagradas", description: "22 cards", color: colors.primary },
    { id: "deus" as AreaType, label: "Deus", description: "26 cards", color: "#3B82F6" },
    { id: "homem" as AreaType, label: "O Homem", description: "4 cards", color: "#8B5CF6" },
    { id: "salvacao" as AreaType, label: "Salvação", description: "9 cards", color: "#EC4899" },
    { id: "igreja" as AreaType, label: "Igreja", description: "27 cards", color: "#10B981" },
    { id: "batismo" as AreaType, label: "Batismo e Ceia", description: "9 cards", color: "#F59E0B" },
    { id: "pratica" as AreaType, label: "Prática", description: "29 cards", color: "#6366F1" },
    { id: "historia" as AreaType, label: "História", description: "3 cards", color: "#14B8A6" },
  ];

  const cardCounts = ["5", "10", "15", "20", "25", "30", "40", "50"];

  function handleStartStudy() {
    if (!candidateName.trim()) {
      Alert.alert("Atenção", "Por favor, informe seu nome para continuar.");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Inicializar a sessão com as configurações
    initializeSession({
      candidateName: candidateName.trim(),
      area: selectedArea,
      cardsPerArea: parseInt(cardsPerArea),
    });

    // Navegar para a tela de estudo
    router.push("/");
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.primary }]}>
            <Text style={styles.headerTitle}>Simulado Concílio</Text>
            <Text style={styles.headerSubtitle}>Configuração de Estudo</Text>
          </View>

          {/* Nome do Candidato */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Nome do Candidato
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder="Digite seu nome"
              placeholderTextColor={colors.muted}
              value={candidateName}
              onChangeText={setCandidateName}
              returnKeyType="done"
            />
          </View>

          {/* Área de Estudo */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Área de Estudo
            </Text>
            <View style={styles.areasGrid}>
              {areas.map((area) => (
                <Pressable
                  key={area.id}
                  onPress={() => setSelectedArea(area.id)}
                  style={({ pressed }) => [
                    styles.areaCard,
                    {
                      backgroundColor: selectedArea === area.id ? area.color + "20" : colors.surface,
                      borderColor: selectedArea === area.id ? area.color : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <View style={[styles.areaColorIndicator, { backgroundColor: area.color }]} />
                  <Text style={[styles.areaLabel, { color: colors.foreground }]}>
                    {area.label}
                  </Text>
                  <Text style={[styles.areaDescription, { color: colors.muted }]}>
                    {area.description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Quantidade de Cards */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Cards por Área
            </Text>
            <View style={styles.cardsGrid}>
              {cardCounts.map((count) => (
                <Pressable
                  key={count}
                  onPress={() => setCardsPerArea(count)}
                  style={({ pressed }) => [
                    styles.countButton,
                    {
                      backgroundColor: cardsPerArea === count ? colors.primary : colors.surface,
                      borderColor: cardsPerArea === count ? colors.primary : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countButtonText,
                      { color: cardsPerArea === count ? "#FFFFFF" : colors.foreground },
                    ]}
                  >
                    {count}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Botão Iniciar */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleStartStudy}
              style={({ pressed }) => [
                styles.startButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={styles.startButtonText}>Iniciar Estudo</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  areasGrid: {
    gap: 10,
  },
  areaCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  areaColorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  areaLabel: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  areaDescription: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  countButton: {
    flex: 1,
    minWidth: "20%",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  countButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 12,
  },
  startButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
