import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { FlashCard } from "@/components/FlashCard";
import { useFlashcards } from "@/context/FlashcardContext";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useRef } from "react";

export default function StudyScreen() {
  const colors = useColors();
  const hasNavigatedToResult = useRef(false);
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

  const { sessionCorrect, sessionWrong, sessionNotSure, sessionNotRemember, isFlipped, currentIndex, sessionTotal } = state;
  const total = sessionTotal > 0 ? sessionTotal : enabledCards.length;
  const totalAnswered = sessionCorrect + sessionWrong + sessionNotSure + sessionNotRemember;

  // Verificar se todos os cards foram respondidos
  useEffect(() => {
    if (total > 0 && totalAnswered === total && totalAnswered > 0 && !hasNavigatedToResult.current) {
      // Todos os cards foram respondidos, ir para a tela de resultado
      hasNavigatedToResult.current = true;
      router.push("/result");
    }
  }, [totalAnswered, total, router]);

  // Reset flag quando resetStudySession eh chamado
  useEffect(() => {
    if (totalAnswered === 0) {
      hasNavigatedToResult.current = false;
    }
  }, [totalAnswered]);

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
    if (currentCard) markCorrect(currentCard.id);
    nextCard();
  }

  function handleWrong() {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    if (currentCard) markWrong(currentCard.id);
    nextCard();
  }

  function handleNotSure() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (currentCard) markNotSure(currentCard.id);
    nextCard();
  }

  function handleNotRemember() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (currentCard) markNotRemember(currentCard.id);
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

  function handleEndStudy() {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    router.push("/result");
  }

  const progress = total > 0 ? totalAnswered / total : 0;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={true}>
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

      {/* Botões de Resultado na Parte Superior — aparecem após virar */}
      {currentCard && isFlipped && (
        <View style={styles.topResultButtonsArea}>
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
        </View>
      )}

      {/* Botões de Ação Rápida — aparecem antes de virar */}
      {currentCard && !isFlipped && (
        <View style={styles.quickActionsArea}>
          <View style={styles.quickActionsRow}>
            <Pressable
              onPress={handleNotSure}
              style={({ pressed }) => [
                styles.quickActionBtn,
                styles.notSureBtn,
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <Text style={styles.quickActionBtnIcon}>?</Text>
              <Text style={styles.quickActionBtnText}>Não Sei</Text>
            </Pressable>

            <Pressable
              onPress={handleNotRemember}
              style={({ pressed }) => [
                styles.quickActionBtn,
                styles.notRememberBtn,
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <Text style={styles.quickActionBtnIcon}>!</Text>
              <Text style={styles.quickActionBtnText}>Não Lembro</Text>
            </Pressable>
          </View>
        </View>
      )}

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
        <>
          {/* Botão Encerrar com Navegação acima */}
          <View style={styles.actionsArea}>
            {/* Navegação - Acima do botão encerrar */}
            <View style={styles.navRow}>
              <Pressable
                onPress={handlePrev}
                style={({ pressed }) => [
                  styles.navBtn,
                  { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
                ]}
              >
                <Text style={[styles.navBtnText, { color: colors.foreground }]}>← Anterior</Text>
              </Pressable>

              <Pressable
                onPress={handleNext}
                style={({ pressed }) => [
                  styles.navBtn,
                  { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
                ]}
              >
                <Text style={[styles.navBtnText, { color: colors.foreground }]}>Próximo →</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleEndStudy}
              style={({ pressed }) => [
                styles.endBtn,
                { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <Text style={styles.endBtnText}>Encerrar Simulado</Text>
            </Pressable>
          </View>
        </>
      )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  cbaLogo: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  opbbLogo: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 4,
  },
  scoreBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 6,
  },
  scoreIcon: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  scoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  progressText: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  topResultButtonsArea: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    paddingBottom: 2,
  },
  quickActionsArea: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    paddingBottom: 2,
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  quickActionBtnIcon: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quickActionBtnText: {
    fontSize: 11,
    fontWeight: "600",
  },
  notSureBtn: {
    backgroundColor: "#F59E0B",
  },
  notRememberBtn: {
    backgroundColor: "#A855F7",
  },
  cardArea: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 4,
    minHeight: 380,
  },
  emptyCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  actionsArea: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  resultButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  resultBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  resultBtnIcon: {
    fontSize: 18,
    fontWeight: "bold",
  },
  resultBtnText: {
    fontSize: 11,
    fontWeight: "600",
  },
  correctBtn: {
    backgroundColor: "#4ADE80",
  },
  wrongBtn: {
    backgroundColor: "#F87171",
  },
  flipBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  flipBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  navRow: {
    flexDirection: "row",
    gap: 12,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderWidth: 1.5,
    borderColor: "#333",
  },

  navBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  endBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    marginBottom: 8,
  },
  endBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
