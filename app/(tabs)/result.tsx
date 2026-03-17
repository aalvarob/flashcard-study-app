import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFlashcards } from "@/context/FlashcardContext";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";

export default function ResultScreen() {
  const colors = useColors();
  const { state, resetSession, resetStudySession } = useFlashcards();

  const { sessionCorrect, sessionWrong, sessionNotSure, sessionNotRemember } = state;
  const total = sessionCorrect + sessionWrong + sessionNotSure + sessionNotRemember;
  const accuracy = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0;

  function getAccuracyColor(acc: number): string {
    if (acc >= 80) return "#27AE60";
    if (acc >= 60) return "#F59E0B";
    if (acc >= 40) return "#E74C3C";
    return "#C0392B";
  }

  function getAccuracyMessage(acc: number): string {
    if (acc >= 90) return "Excelente! Você domina este conteúdo!";
    if (acc >= 80) return "Muito bom! Continue assim!";
    if (acc >= 70) return "Bom desempenho! Revise os erros.";
    if (acc >= 60) return "Desempenho aceitável. Estude mais.";
    if (acc >= 40) return "Precisa estudar mais este conteúdo.";
    return "Revise todo o conteúdo com cuidado.";
  }

  function handleReturnHome() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    resetSession();
    router.push("/setup");
  }

  function handleReturnStudy() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Apenas reseta os contadores da sessão, mantendo os cards habilitados
    resetStudySession();
    // Navegar diretamente para a tela de estudo (index)
    router.replace("/(tabs)");
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={styles.container}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.primary }]}>
            <Text style={styles.headerTitle}>Sessão Concluída!</Text>
          </View>

          {/* Accuracy Circle */}
          <View style={styles.accuracyContainer}>
            <View
              style={[
                styles.accuracyCircle,
                { borderColor: getAccuracyColor(accuracy) },
              ]}
            >
              <Text style={[styles.accuracyValue, { color: getAccuracyColor(accuracy) }]}>
                {accuracy}%
              </Text>
              <Text style={[styles.accuracyLabel, { color: colors.muted }]}>
                Aproveitamento
              </Text>
            </View>
          </View>

          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={[styles.messageText, { color: colors.foreground }]}>
              {getAccuracyMessage(accuracy)}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statsTitle, { color: colors.foreground }]}>
              Resumo da Sessão
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statIcon, { color: "#27AE60" }]}>✓</Text>
                <Text style={[styles.statValue, { color: "#27AE60" }]}>
                  {sessionCorrect}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Acertos
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={[styles.statIcon, { color: "#E74C3C" }]}>✗</Text>
                <Text style={[styles.statValue, { color: "#E74C3C" }]}>
                  {sessionWrong}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Erros
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={[styles.statIcon, { color: "#F59E0B" }]}>?</Text>
                <Text style={[styles.statValue, { color: "#F59E0B" }]}>
                  {sessionNotSure}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Dúvidas
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={[styles.statIcon, { color: "#A855F7" }]}>!</Text>
                <Text style={[styles.statValue, { color: "#A855F7" }]}>
                  {sessionNotRemember}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Esqueci
                </Text>
              </View>
            </View>

            <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.muted }]}>
                Total de Respostas:
              </Text>
              <Text style={[styles.totalValue, { color: colors.foreground }]}>
                {total}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleReturnStudy}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>
                Estudar Novamente
              </Text>
            </Pressable>

            <Pressable
              onPress={handleReturnHome}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={styles.primaryButtonText}>
                Voltar ao Início
              </Text>
            </Pressable>
          </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  accuracyContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  accuracyCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  accuracyValue: {
    fontSize: 40,
    fontWeight: "700",
  },
  accuracyLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  messageContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: "center",
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
  statsCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  statsTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    paddingVertical: 12,
  },
  statIcon: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
