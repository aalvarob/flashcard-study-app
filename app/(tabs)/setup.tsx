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

import { FlashcardArea } from "@/data/flashcards";

type AreaType = "all" | FlashcardArea;

export default function SetupScreen() {
  const colors = useColors();
  const { initializeSession } = useFlashcards();

  const [candidateName, setCandidateName] = useState("");
  const [selectedArea, setSelectedArea] = useState<AreaType>("all");
  const [cardsPerArea, setCardsPerArea] = useState("10");

  const areas = [
    { id: "all" as AreaType, label: "Todas as Áreas", description: "132 cards", color: colors.primary },
    { id: "escrituras_sagradas" as AreaType, label: "Escrituras Sagradas", description: "25 cards", color: colors.primary },
    { id: "deus_pai" as AreaType, label: "Deus Pai", description: "15 cards", color: "#3B82F6" },
    { id: "deus_filho" as AreaType, label: "Deus Filho", description: "4 cards", color: "#3B82F6" },
    { id: "deus_espirito_santo" as AreaType, label: "Deus Espírito Santo", description: "7 cards", color: "#3B82F6" },
    { id: "homem" as AreaType, label: "O Homem", description: "1 card", color: "#8B5CF6" },
    { id: "pecado" as AreaType, label: "O Pecado", description: "2 cards", color: "#8B5CF6" },
    { id: "salvacao" as AreaType, label: "Salvação", description: "6 cards", color: "#EC4899" },
    { id: "eleicao" as AreaType, label: "Eleição", description: "3 cards", color: "#EC4899" },
    { id: "reino_de_deus" as AreaType, label: "Reino de Deus", description: "4 cards", color: "#EC4899" },
    { id: "igreja" as AreaType, label: "Igreja", description: "15 cards", color: "#10B981" },
    { id: "dia_do_senhor" as AreaType, label: "O Dia do Senhor", description: "3 cards", color: "#10B981" },
    { id: "ministerio_da_palavra" as AreaType, label: "Ministério da Palavra", description: "4 cards", color: "#10B981" },
    { id: "liberdade_religiosa" as AreaType, label: "Liberdade Religiosa", description: "3 cards", color: "#10B981" },
    { id: "morte" as AreaType, label: "Morte", description: "6 cards", color: "#F59E0B" },
    { id: "justos_e_impios" as AreaType, label: "Justos e Ímpios", description: "5 cards", color: "#F59E0B" },
    { id: "anjos" as AreaType, label: "Anjos", description: "2 cards", color: "#F59E0B" },
    { id: "amor_ao_proximo_e_etica" as AreaType, label: "Amor ao Próximo e Ética", description: "2 cards", color: "#6366F1" },
    { id: "batismo_e_ceia" as AreaType, label: "Batismo e Ceia do Senhor", description: "9 cards", color: "#6366F1" },
    { id: "mordomia" as AreaType, label: "Mordomia", description: "0 cards", color: "#6366F1" },
    { id: "evangelismo_e_missoes" as AreaType, label: "Evangelismo e Missões", description: "3 cards", color: "#6366F1" },
    { id: "educacao_religiosa" as AreaType, label: "Educação Religiosa", description: "2 cards", color: "#14B8A6" },
    { id: "ordem_social" as AreaType, label: "Ordem Social", description: "2 cards", color: "#14B8A6" },
    { id: "familia" as AreaType, label: "Família", description: "3 cards", color: "#14B8A6" },
    { id: "principios_batistas" as AreaType, label: "Princípios Batistas", description: "1 card", color: "#14B8A6" },
    { id: "historia_dos_batistas" as AreaType, label: "História dos Batistas", description: "2 cards", color: "#14B8A6" },
    { id: "estrutura_e_funcionamento_cbb" as AreaType, label: "Estrutura e Funcionamento da CBB", description: "1 card", color: "#14B8A6" },
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
