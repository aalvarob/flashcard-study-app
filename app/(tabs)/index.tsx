import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { FlashCard } from "@/components/FlashCard";
import { useFlashcards } from "@/context/FlashcardContext";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect } from "react";

export default function StudyScreen() {
  const colors = useColors();
  const {
    state,
    enabledCards,
    currentCard,
    markCorrect,
    markWrong,
    markNotSure,
    markNotRemember,
    nextCard,
    prevCard,
    flipCard,
  } = useFlashcards();

  const { sessionCorrect, sessionWrong, sessionNotSure, sessionNotRemember, isFlipped, currentIndex } = state;
  const total = enabledCards.length;
  const totalAnswered = sessionCorrect + sessionWrong + sessionNotSure + sessionNotRemember;

  // Verificar se todos os cards foram respondidos
  useEffect(() => {
    if (total > 0 && totalAnswered === total) {
      // Todos os cards foram respondidos, ir para a tela de resultado
      router.push("/result");
    }
  }, [totalAnswered, total]);

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
    // nextCard() é chamado automaticamente pelo contexto ao desabilitar o card
  }

  function handleWrong() {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    markWrong();
    nextCard();
  }

  function handleNotSure() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    markNotSure();
    nextCard();
  }

  function handleNotRemember() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    markNotRemember();
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

  const progress = total > 0 ? totalAnswered / total : 0;

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header com Score */}
      <View style={[styles.header, { backgroundColor: colors.primary, borderBottomColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <Image
            source={require("@/assets/images/cba-logo.webp")}
            style={styles.cbaLogo}
          />
          <Text style={styles.headerTitle}>Simulado Concílio</Text>
          <Image
            source={require("@/assets/images/opbb-logo.webp")}
            style={styles.opbbLogo}
          />
        </View>
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
          <View style={styles.scoreDivider} />
          <View style={[styles.scoreBox, { backgroundColor: "rgba(245,158,11,0.25)" }]}>
            <Text style={styles.scoreIcon}>?</Text>
            <Text style={[styles.scoreValue, { color: "#FBBF24" }]}>{sessionNotSure}</Text>
            <Text style={[styles.scoreLabel, { color: "rgba(255,255,255,0.7)" }]}>Dúvida</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={[styles.scoreBox, { backgroundColor: "rgba(168,85,247,0.25)" }]}>
            <Text style={styles.scoreIcon}>!</Text>
            <Text style={[styles.scoreValue, { color: "#D8B4FE" }]}>{sessionNotRemember}</Text>
            <Text style={[styles.scoreLabel, { color: "rgba(255,255,255,0.7)" }]}>Esqueci</Text>
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
            /* Botões de Resultado — aparecem após virar */
            <View style={styles.resultButtonsContainer}>
              <View style={styles.resultButtonsRow}>
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

              <View style={styles.resultButtonsRow}>
                <Pressable
                  onPress={handleNotSure}
                  style={({ pressed }) => [
                    styles.resultBtn,
                    styles.notSureBtn,
                    { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
                  ]}
                >
                  <Text style={styles.resultBtnIcon}>?</Text>
                  <Text style={styles.resultBtnText}>Não Sei</Text>
                </Pressable>

                <Pressable
                  onPress={handleNotRemember}
                  style={({ pressed }) => [
                    styles.resultBtn,
                    styles.notRememberBtn,
                    { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
                  ]}
                >
                  <Text style={styles.resultBtnIcon}>!</Text>
                  <Text style={styles.resultBtnText}>Não Lembro</Text>
                </Pressable>
              </View>
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
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 10,
  },
  cbaLogo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  opbbLogo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  scoreBox: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 2,
  },
  scoreIcon: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  scoreDivider: {
    width: 1,
    height: 40,
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  resultButtonsContainer: {
    gap: 10,
  },
  resultButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  resultBtn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 4,
  },
  wrongBtn: {
    backgroundColor: "#E74C3C",
  },
  correctBtn: {
    backgroundColor: "#27AE60",
  },
  notSureBtn: {
    backgroundColor: "#F59E0B",
  },
  notRememberBtn: {
    backgroundColor: "#A855F7",
  },
  resultBtnIcon: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  resultBtnText: {
    fontSize: 13,
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
