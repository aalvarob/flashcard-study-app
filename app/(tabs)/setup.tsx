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

export default function SetupScreen() {
  const colors = useColors();
  const { initializeSession } = useFlashcards();

  const [candidateName, setCandidateName] = useState("");
  const [selectedArea, setSelectedArea] = useState<"all" | "teologia" | "eclesiologia">("all");
  const [cardsPerArea, setCardsPerArea] = useState("10");

  const areas = [
    { id: "all", label: "Todas as Áreas", description: "Teologia + Eclesiologia" },
    { id: "teologia", label: "Teologia", description: "46 cards" },
    { id: "eclesiologia", label: "Eclesiologia", description: "33 cards" },
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
      area: selectedArea as "all" | "teologia" | "eclesiologia",
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
            <View style={styles.areaGrid}>
              {areas.map((area) => (
                <Pressable
                  key={area.id}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setSelectedArea(area.id as any);
                  }}
                  style={({ pressed }) => [
                    styles.areaButton,
                    {
                      backgroundColor:
                        selectedArea === area.id
                          ? colors.primary
                          : colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.areaButtonLabel,
                      {
                        color:
                          selectedArea === area.id
                            ? "#FFFFFF"
                            : colors.foreground,
                      },
                    ]}
                  >
                    {area.label}
                  </Text>
                  <Text
                    style={[
                      styles.areaButtonDescription,
                      {
                        color:
                          selectedArea === area.id
                            ? "rgba(255,255,255,0.8)"
                            : colors.muted,
                      },
                    ]}
                  >
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
            <View style={styles.cardCountGrid}>
              {cardCounts.map((count) => (
                <Pressable
                  key={count}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setCardsPerArea(count);
                  }}
                  style={({ pressed }) => [
                    styles.cardCountButton,
                    {
                      backgroundColor:
                        cardsPerArea === count
                          ? colors.accent
                          : colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cardCountButtonText,
                      {
                        color:
                          cardsPerArea === count
                            ? "#FFFFFF"
                            : colors.foreground,
                      },
                    ]}
                  >
                    {count}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Resumo */}
          <View
            style={[
              styles.summary,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.summaryTitle, { color: colors.foreground }]}>
              Resumo da Sessão
            </Text>
            <Text style={[styles.summaryText, { color: colors.muted }]}>
              Candidato: <Text style={{ color: colors.foreground, fontWeight: "600" }}>
                {candidateName || "Não informado"}
              </Text>
            </Text>
            <Text style={[styles.summaryText, { color: colors.muted }]}>
              Área: <Text style={{ color: colors.foreground, fontWeight: "600" }}>
                {areas.find((a) => a.id === selectedArea)?.label}
              </Text>
            </Text>
            <Text style={[styles.summaryText, { color: colors.muted }]}>
              Cards por Área: <Text style={{ color: colors.foreground, fontWeight: "600" }}>
                {cardsPerArea}
              </Text>
            </Text>
          </View>

          {/* Botão Iniciar */}
          <Pressable
            onPress={handleStartStudy}
            style={({ pressed }) => [
              styles.startButton,
              {
                backgroundColor: colors.accent,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <Text style={styles.startButtonText}>Iniciar Estudo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  areaGrid: {
    gap: 12,
  },
  areaButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  areaButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  areaButtonDescription: {
    fontSize: 12,
  },
  cardCountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cardCountButton: {
    flex: 1,
    minWidth: "22%",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cardCountButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  summary: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  startButton: {
    marginHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
