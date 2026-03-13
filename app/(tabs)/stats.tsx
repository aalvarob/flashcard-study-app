import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFlashcards } from "@/context/FlashcardContext";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function StatsScreen() {
  const colors = useColors();
  const { state, totalCorrect, totalWrong, getCardsByArea, resetAllStats, resetSession } =
    useFlashcards();

  const { sessionCorrect, sessionWrong } = state;
  const totalAnswered = totalCorrect + totalWrong;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const sessionTotal = sessionCorrect + sessionWrong;
  const sessionAccuracy =
    sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;

  const teologiaCards = getCardsByArea("teologia");
  const eclesiologiaCards = getCardsByArea("eclesiologia");

  const teologiaCorrect = teologiaCards.reduce((s, c) => s + c.correctCount, 0);
  const teologiaWrong = teologiaCards.reduce((s, c) => s + c.wrongCount, 0);
  const teologiaTotal = teologiaCorrect + teologiaWrong;
  const teologiaAccuracy =
    teologiaTotal > 0 ? Math.round((teologiaCorrect / teologiaTotal) * 100) : 0;

  const eclesiologiaCorrect = eclesiologiaCards.reduce((s, c) => s + c.correctCount, 0);
  const eclesiologiaWrong = eclesiologiaCards.reduce((s, c) => s + c.wrongCount, 0);
  const eclesiologiaTotal = eclesiologiaCorrect + eclesiologiaWrong;
  const eclesiologiaAccuracy =
    eclesiologiaTotal > 0 ? Math.round((eclesiologiaCorrect / eclesiologiaTotal) * 100) : 0;

  // Top 5 cards with most errors
  const hardestCards = [...state.cards]
    .filter((c) => c.wrongCount > 0)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 5);

  function handleResetSession() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      "Resetar Sessão",
      "Deseja zerar os contadores de acertos e erros desta sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: () => resetSession(),
        },
      ]
    );
  }

  function handleResetAll() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    Alert.alert(
      "Resetar Tudo",
      "Deseja zerar TODAS as estatísticas? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar Tudo",
          style: "destructive",
          onPress: () => resetAllStats(),
        },
      ]
    );
  }

  function getAccuracyColor(acc: number): string {
    if (acc >= 70) return "#27AE60";
    if (acc >= 40) return "#F59E0B";
    return "#E74C3C";
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Estatísticas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sessão Atual */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>SESSÃO ATUAL</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#27AE60" }]}>{sessionCorrect}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Acertos</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#E74C3C" }]}>{sessionWrong}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Erros</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: getAccuracyColor(sessionAccuracy) }]}
                >
                  {sessionAccuracy}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Aproveit.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Total Geral */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>TOTAL GERAL</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#27AE60" }]}>{totalCorrect}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Acertos</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#E74C3C" }]}>{totalWrong}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Erros</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: getAccuracyColor(accuracy) }]}>
                  {accuracy}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Aproveit.</Text>
              </View>
            </View>
            {/* Barra de progresso de aproveitamento */}
            <View style={styles.accuracyBarContainer}>
              <View style={[styles.accuracyBarBg, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.accuracyBarFill,
                    {
                      backgroundColor: getAccuracyColor(accuracy),
                      width: `${accuracy}%` as any,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.accuracyBarLabel, { color: colors.muted }]}>
                {totalAnswered} respostas no total
              </Text>
            </View>
          </View>
        </View>

        {/* Por Área */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>POR ÁREA</Text>

          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.areaRow}>
              <View style={[styles.areaColorDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.areaName, { color: colors.foreground }]}>Teologia</Text>
              <View style={styles.areaStats}>
                <Text style={[styles.areaStatText, { color: "#27AE60" }]}>✓ {teologiaCorrect}</Text>
                <Text style={[styles.areaStatText, { color: "#E74C3C" }]}>✗ {teologiaWrong}</Text>
                <Text style={[styles.areaAccuracy, { color: getAccuracyColor(teologiaAccuracy) }]}>
                  {teologiaAccuracy}%
                </Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.areaRow}>
              <View style={[styles.areaColorDot, { backgroundColor: "#6B46C1" }]} />
              <Text style={[styles.areaName, { color: colors.foreground }]}>Eclesiologia</Text>
              <View style={styles.areaStats}>
                <Text style={[styles.areaStatText, { color: "#27AE60" }]}>✓ {eclesiologiaCorrect}</Text>
                <Text style={[styles.areaStatText, { color: "#E74C3C" }]}>✗ {eclesiologiaWrong}</Text>
                <Text style={[styles.areaAccuracy, { color: getAccuracyColor(eclesiologiaAccuracy) }]}>
                  {eclesiologiaAccuracy}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cards Mais Difíceis */}
        {hardestCards.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>MAIS DIFÍCEIS</Text>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {hardestCards.map((card, index) => (
                <View key={card.id}>
                  {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                  <View style={styles.hardCardRow}>
                    <View style={styles.hardCardContent}>
                      <Text
                        style={[styles.hardCardQuestion, { color: colors.foreground }]}
                        numberOfLines={2}
                      >
                        {card.question}
                      </Text>
                    </View>
                    <View style={styles.hardCardStats}>
                      <Text style={[styles.hardCardStat, { color: "#E74C3C" }]}>
                        ✗ {card.wrongCount}
                      </Text>
                      <Text style={[styles.hardCardStat, { color: "#27AE60" }]}>
                        ✓ {card.correctCount}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Botões de Reset */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>AÇÕES</Text>
          <View style={styles.resetButtons}>
            <Pressable
              onPress={handleResetSession}
              style={({ pressed }) => [
                styles.resetBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.resetBtnText, { color: colors.foreground }]}>
                Resetar Sessão
              </Text>
            </Pressable>

            <Pressable
              onPress={handleResetAll}
              style={({ pressed }) => [
                styles.resetBtn,
                {
                  backgroundColor: "#FEF2F2",
                  borderColor: "#E74C3C",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.resetBtnText, { color: "#E74C3C" }]}>
                Resetar Tudo
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 48,
  },
  accuracyBarContainer: {
    marginTop: 16,
    gap: 6,
  },
  accuracyBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  accuracyBarFill: {
    height: 8,
    borderRadius: 4,
  },
  accuracyBarLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  areaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  areaColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  areaName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  areaStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  areaStatText: {
    fontSize: 13,
    fontWeight: "600",
  },
  areaAccuracy: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 36,
    textAlign: "right",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  hardCardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  hardCardContent: {
    flex: 1,
  },
  hardCardQuestion: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  hardCardStats: {
    alignItems: "flex-end",
    gap: 2,
  },
  hardCardStat: {
    fontSize: 13,
    fontWeight: "600",
  },
  resetButtons: {
    gap: 10,
  },
  resetBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  resetBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
