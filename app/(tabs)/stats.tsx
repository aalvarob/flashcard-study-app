import React from "react";
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
  const { state, totalCorrect, totalWrong, totalNotSure, totalNotRemember, getCardsByArea, resetAllStats, resetSession } =
    useFlashcards();

  const { sessionCorrect, sessionWrong, sessionNotSure, sessionNotRemember } = state;
  const totalAnswered = totalCorrect + totalWrong + totalNotSure + totalNotRemember;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const sessionTotal = sessionCorrect + sessionWrong + sessionNotSure + sessionNotRemember;
  const sessionAccuracy =
    sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;

  // Get stats for each area
  const areas = ["teologia", "relacionamento", "pratica", "denominacao"] as const;
  const areaStats = areas.map((area) => {
    const cards = getCardsByArea(area);
    const correct = cards.reduce((s, c) => s + c.correctCount, 0);
    const wrong = cards.reduce((s, c) => s + c.wrongCount, 0);
    const notSure = cards.reduce((s, c) => s + c.notSureCount, 0);
    const notRemember = cards.reduce((s, c) => s + c.notRememberCount, 0);
    const total = correct + wrong + notSure + notRemember;
    const areaAccuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { area, correct, wrong, notSure, notRemember, total, areaAccuracy };
  });

  // Top 5 cards with most errors or uncertainties
  const hardestCards = [...state.cards]
    .filter((c) => c.wrongCount > 0 || c.notSureCount > 0 || c.notRememberCount > 0)
    .sort((a, b) => (b.wrongCount + b.notSureCount + b.notRememberCount) - (a.wrongCount + a.notSureCount + a.notRememberCount))
    .slice(0, 5);

  function handleResetSession() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      "Resetar Sessão",
      "Deseja zerar os contadores de acertos, erros, dúvidas e esquecimentos desta sessão?",
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

  function getAreaLabel(area: string): string {
    switch (area) {
      case "teologia":
        return "Teologia";
      case "relacionamento":
        return "Relacionamento";
      case "pratica":
        return "Prática";
      case "denominacao":
        return "Denominação";
      default:
        return "Desconhecido";
    }
  }

  function getAreaColor(area: string): string {
    switch (area) {
      case "teologia":
        return colors.primary;
      case "relacionamento":
        return "#3B82F6";
      case "pratica":
        return "#10B981";
      case "denominacao":
        return "#8B5CF6";
      default:
        return colors.primary;
    }
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Estatísticas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Session Stats */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Sessão Atual</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Acertos</Text>
              <Text style={[styles.statValue, { color: "#27AE60" }]}>{sessionCorrect}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Erros</Text>
              <Text style={[styles.statValue, { color: "#E74C3C" }]}>{sessionWrong}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Dúvidas</Text>
              <Text style={[styles.statValue, { color: "#F59E0B" }]}>{sessionNotSure}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Esqueci</Text>
              <Text style={[styles.statValue, { color: "#A855F7" }]}>{sessionNotRemember}</Text>
            </View>
          </View>
          <View style={styles.accuracyRow}>
            <Text style={[styles.accuracyLabel, { color: colors.muted }]}>Aproveitamento:</Text>
            <Text style={[styles.accuracyValue, { color: getAccuracyColor(sessionAccuracy) }]}>
              {sessionAccuracy}%
            </Text>
          </View>
        </View>

        {/* Total Stats */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Total Geral</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Acertos</Text>
              <Text style={[styles.statValue, { color: "#27AE60" }]}>{totalCorrect}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Erros</Text>
              <Text style={[styles.statValue, { color: "#E74C3C" }]}>{totalWrong}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Dúvidas</Text>
              <Text style={[styles.statValue, { color: "#F59E0B" }]}>{totalNotSure}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Esqueci</Text>
              <Text style={[styles.statValue, { color: "#A855F7" }]}>{totalNotRemember}</Text>
            </View>
          </View>
          <View style={styles.accuracyRow}>
            <Text style={[styles.accuracyLabel, { color: colors.muted }]}>Aproveitamento:</Text>
            <Text style={[styles.accuracyValue, { color: getAccuracyColor(accuracy) }]}>
              {accuracy}%
            </Text>
          </View>
        </View>

        {/* Area Stats */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Por Área</Text>
          {areaStats.map((stat) => (
            <View key={stat.area} style={[styles.areaStatContainer, { borderBottomColor: colors.border }]}>
              <View style={styles.areaStatHeader}>
                <View style={[styles.areaColorDot, { backgroundColor: getAreaColor(stat.area) }]} />
                <Text style={[styles.areaStatTitle, { color: colors.foreground }]}>
                  {getAreaLabel(stat.area)}
                </Text>
              </View>
              <View style={styles.areaStatValues}>
                <View style={styles.areaStatItem}>
                  <Text style={[styles.areaStatLabel, { color: colors.muted }]}>✓</Text>
                  <Text style={[styles.areaStatValue, { color: "#27AE60" }]}>{stat.correct}</Text>
                </View>
                <View style={styles.areaStatItem}>
                  <Text style={[styles.areaStatLabel, { color: colors.muted }]}>✗</Text>
                  <Text style={[styles.areaStatValue, { color: "#E74C3C" }]}>{stat.wrong}</Text>
                </View>
                <View style={styles.areaStatItem}>
                  <Text style={[styles.areaStatLabel, { color: colors.muted }]}>?</Text>
                  <Text style={[styles.areaStatValue, { color: "#F59E0B" }]}>{stat.notSure}</Text>
                </View>
                <View style={styles.areaStatItem}>
                  <Text style={[styles.areaStatLabel, { color: colors.muted }]}>!</Text>
                  <Text style={[styles.areaStatValue, { color: "#A855F7" }]}>{stat.notRemember}</Text>
                </View>
                <View style={styles.areaStatItem}>
                  <Text style={[styles.areaStatLabel, { color: colors.muted }]}>%</Text>
                  <Text style={[styles.areaStatValue, { color: getAccuracyColor(stat.areaAccuracy) }]}>
                    {stat.areaAccuracy}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Hardest Cards */}
        {hardestCards.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Cards Mais Difíceis</Text>
            {hardestCards.map((card, idx) => (
              <View key={card.id} style={[styles.hardCardItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.hardCardRank, { color: colors.muted }]}>#{idx + 1}</Text>
                <Text
                  style={[styles.hardCardQuestion, { color: colors.foreground }]}
                  numberOfLines={2}
                >
                  {card.question}
                </Text>
                <View style={styles.hardCardStats}>
                  {card.wrongCount > 0 && (
                    <Text style={[styles.hardCardStat, { color: "#E74C3C" }]}>
                      ✗ {card.wrongCount}
                    </Text>
                  )}
                  {card.notSureCount > 0 && (
                    <Text style={[styles.hardCardStat, { color: "#F59E0B" }]}>
                      ? {card.notSureCount}
                    </Text>
                  )}
                  {card.notRememberCount > 0 && (
                    <Text style={[styles.hardCardStat, { color: "#A855F7" }]}>
                      ! {card.notRememberCount}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Reset Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handleResetSession}
            style={({ pressed }) => [
              styles.resetButton,
              { backgroundColor: "#F59E0B", opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.resetButtonText}>Resetar Sessão</Text>
          </Pressable>
          <Pressable
            onPress={handleResetAll}
            style={({ pressed }) => [
              styles.resetButton,
              { backgroundColor: "#E74C3C", opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.resetButtonText}>Resetar Tudo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  accuracyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  accuracyLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  accuracyValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  areaStatContainer: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  areaStatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  areaColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  areaStatTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  areaStatValues: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  areaStatItem: {
    alignItems: "center",
    gap: 2,
  },
  areaStatLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  areaStatValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  hardCardItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  hardCardRank: {
    fontSize: 12,
    fontWeight: "700",
  },
  hardCardQuestion: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  hardCardStats: {
    flexDirection: "row",
    gap: 12,
  },
  hardCardStat: {
    fontSize: 12,
    fontWeight: "700",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
