import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { FlashCard } from "@/components/FlashCard";
import { useFlashcards } from "@/context/FlashcardContext";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function StudyScreen() {
  const colors = useColors();
  const {
    state,
    enabledCards,
    currentCard,
    markCorrect,
    markWrong,
    nextCard,
    prevCard,
    flipCard,
  } = useFlashcards();

  const { sessionCorrect, sessionWrong, isFlipped, currentIndex } = state;
  const total = enabledCards.length;

  function handleFlip() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    flipCard();
  }

  function handleCorrect() {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    markCorrect();
    nextCard();
  }

  function handleWrong() {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    markWrong();
    nextCard();
  }

  function handlePrev() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    prevCard();
  }

  function handleNext() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    nextCard();
  }

  const progress = total > 0 ? (currentIndex + 1) / total : 0;

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header com Score */}
      <View style={[styles.header, { backgroundColor: colors.primary, borderBottomColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Simulado Concílio</Text>
        <View style={styles.scoreRow}>
          <View style={[styles.scoreBox, { backgroundColor: "rgba(39,174,96,0.25)" }]}>
            <Text style={styles.scoreIcon}>✓</Text>
            <Text style={[styles.scoreValue, { color: "#4ADE80" }]}>{sessionCorrect}</Text>
            <Text style={[styles.scoreLabel, { color: "rgba(255,255,255,0.7)" }]}>Acertos</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={[styles.scoreBox, { backgroundColor: "rgba(231,76,60,0.25)" }]}>
            <Text style={styles.scoreIcon}>✗</Text>
            <Text style={[styles.scoreValue, { color: "#F87171" }]}>{sessionWrong}</Text>
            <Text style={[styles.scoreLabel, { color: "rgba(255,255,255,0.7)" }]}>Erros</Text>
          </View>
        </View>
      </View>

      {/* Progresso */}
      <View style={[styles.progressContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.progressText, { color: colors.muted }]}>
          {total > 0 ? `Card ${currentIndex + 1} de ${total}` : "Nenhum card habilitado"}
        </Text>
        <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressBarFill,
              { backgroundColor: colors.accent, width: `${progress * 100}%` as any },
            ]}
          />
        </View>
      </View>

      {/* Área do Card */}
      <View style={styles.cardArea}>
        {currentCard ? (
          <FlashCard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Nenhum card habilitado.{"\n"}Acesse a aba "Cards" para habilitar.
            </Text>
          </View>
        )}
      </View>

      {/* Botões de Ação */}
      {currentCard && (
        <View style={styles.actionsArea}>
          {isFlipped ? (
            /* Botões Acertei / Errei — aparecem após virar */
            <View style={styles.resultButtons}>
              <Pressable
                onPress={handleWrong}
                style={({ pressed }) => [
                  styles.resultBtn,
                  styles.wrongBtn,
                  { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
                ]}
              >
                <Text style={styles.resultBtnIcon}>✗</Text>
                <Text style={styles.resultBtnText}>Errei</Text>
              </Pressable>

              <Pressable
                onPress={handleCorrect}
                style={({ pressed }) => [
                  styles.resultBtn,
                  styles.correctBtn,
                  { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
                ]}
              >
                <Text style={styles.resultBtnIcon}>✓</Text>
                <Text style={styles.resultBtnText}>Acertei</Text>
              </Pressable>
            </View>
          ) : (
            /* Botão Virar */
            <Pressable
              onPress={handleFlip}
              style={({ pressed }) => [
                styles.flipBtn,
                { backgroundColor: colors.accent, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <Text style={styles.flipBtnText}>Ver Resposta</Text>
            </Pressable>
          )}

          {/* Navegação */}
          <View style={styles.navRow}>
            <Pressable
              onPress={handlePrev}
              style={({ pressed }) => [
                styles.navBtn,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.navBtnText, { color: colors.foreground }]}>← Anterior</Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                styles.navBtn,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.navBtnText, { color: colors.foreground }]}>Próximo →</Text>
            </Pressable>
          </View>
        </View>
      )}
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
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  scoreBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  scoreIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  scoreDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
    textAlign: "center",
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  cardArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyCard: {
    width: "100%",
    aspectRatio: 0.8,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  actionsArea: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  resultButtons: {
    flexDirection: "row",
    gap: 12,
  },
  resultBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  wrongBtn: {
    backgroundColor: "#E74C3C",
  },
  correctBtn: {
    backgroundColor: "#27AE60",
  },
  resultBtnIcon: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  resultBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  flipBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  flipBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  navRow: {
    flexDirection: "row",
    gap: 12,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
