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
  const areas = ["escrituras", "deus", "homem", "salvacao", "igreja", "batismo", "pratica", "historia"] as const;
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      "Resetar Tudo",
      "Deseja zerar todos os contadores de todas as áreas? Esta ação não pode ser desfeita.",
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

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Título */}
        <Text style={[styles.title, { color: colors.foreground }]}>
          Estatísticas
        </Text>

        {/* Resumo Geral */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Resumo Geral
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Acertos
              </Text>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {totalCorrect}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Erros
              </Text>
              <Text style={[styles.statValue, { color: colors.error }]}>
                {totalWrong}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Dúvidas
              </Text>
              <Text style={[styles.statValue, { color: colors.warning }]}>
                {totalNotSure}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Esqueci
              </Text>
              <Text style={[styles.statValue, { color: "#8B5CF6" }]}>
                {totalNotRemember}
              </Text>
            </View>
          </View>
          <View style={styles.accuracyBar}>
            <Text style={[styles.accuracyLabel, { color: colors.muted }]}>
              Aproveitamento Geral
            </Text>
            <Text
              style={[
                styles.accuracyValue,
                {
                  color:
                    accuracy >= 80
                      ? colors.success
                      : accuracy >= 60
                      ? colors.warning
                      : colors.error,
                },
              ]}
            >
              {accuracy}%
            </Text>
          </View>
        </View>

        {/* Resumo da Sessão */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Sessão Atual
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Acertos
              </Text>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {sessionCorrect}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Erros
              </Text>
              <Text style={[styles.statValue, { color: colors.error }]}>
                {sessionWrong}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Dúvidas
              </Text>
              <Text style={[styles.statValue, { color: colors.warning }]}>
                {sessionNotSure}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                Esqueci
              </Text>
              <Text style={[styles.statValue, { color: "#8B5CF6" }]}>
                {sessionNotRemember}
              </Text>
            </View>
          </View>
          <View style={styles.accuracyBar}>
            <Text style={[styles.accuracyLabel, { color: colors.muted }]}>
              Aproveitamento da Sessão
            </Text>
            <Text
              style={[
                styles.accuracyValue,
                {
                  color:
                    sessionAccuracy >= 80
                      ? colors.success
                      : sessionAccuracy >= 60
                      ? colors.warning
                      : colors.error,
                },
              ]}
            >
              {sessionAccuracy}%
            </Text>
          </View>
        </View>

        {/* Estatísticas por Área */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Por Área
        </Text>
        {areaStats.map((stat) => (
          <View
            key={stat.area}
            style={[
              styles.areaCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.areaHeader,
                { backgroundColor: getAreaColor(stat.area) },
              ]}
            >
              <Text style={styles.areaName}>{getAreaLabel(stat.area)}</Text>
              <Text style={styles.areaAccuracy}>{stat.areaAccuracy}%</Text>
            </View>
            <View style={styles.areaStats}>
              <Text style={[styles.areaStat, { color: colors.success }]}>
                ✓ {stat.correct}
              </Text>
              <Text style={[styles.areaStat, { color: colors.error }]}>
                ✗ {stat.wrong}
              </Text>
              <Text style={[styles.areaStat, { color: colors.warning }]}>
                ? {stat.notSure}
              </Text>
              <Text style={[styles.areaStat, { color: "#8B5CF6" }]}>
                ! {stat.notRemember}
              </Text>
            </View>
          </View>
        ))}

        {/* Cards Mais Difíceis */}
        {hardestCards.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Cards Mais Difíceis
            </Text>
            {hardestCards.map((card) => (
              <View
                key={card.id}
                style={[
                  styles.hardCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Text
                  style={[styles.hardCardQuestion, { color: colors.foreground }]}
                  numberOfLines={2}
                >
                  {card.question}
                </Text>
                <Text style={[styles.hardCardStats, { color: colors.muted }]}>
                  ✗ {card.wrongCount} | ? {card.notSureCount} | ! {card.notRememberCount}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Botões de Ação */}
        <View style={styles.actionButtons}>
          <Pressable
            onPress={handleResetSession}
            style={[
              styles.button,
              { backgroundColor: colors.warning, opacity: 0.8 },
            ]}
          >
            <Text style={styles.buttonText}>Resetar Sessão</Text>
          </Pressable>
          <Pressable
            onPress={handleResetAll}
            style={[
              styles.button,
              { backgroundColor: colors.error, opacity: 0.8 },
            ]}
          >
            <Text style={styles.buttonText}>Resetar Tudo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    minWidth: "48%",
    alignItems: "center",
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  accuracyBar: {
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  accuracyLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  accuracyValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
  },
  areaCard: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    overflow: "hidden",
  },
  areaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  areaName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  areaAccuracy: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  areaStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  areaStat: {
    fontSize: 12,
    fontWeight: "600",
  },
  hardCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  hardCardQuestion: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  hardCardStats: {
    fontSize: 11,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
