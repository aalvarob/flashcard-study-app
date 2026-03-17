import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFlashcards } from "@/context/FlashcardContext";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HomeScreen() {
  const colors = useColors();
  const { state, enabledCards, totalCorrect, totalWrong } = useFlashcards();
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  const totalAnswered = totalCorrect + totalWrong;
  const correctPercentage =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const stats = [
    {
      label: "Cards Habilitados",
      value: enabledCards.length,
      color: colors.primary,
      icon: "rectangle.stack.fill",
    },
    {
      label: "Acertos",
      value: totalCorrect,
      color: colors.success,
      icon: "checkmark.circle.fill",
    },
    {
      label: "Erros",
      value: totalWrong,
      color: colors.error,
      icon: "xmark.circle.fill",
    },
    {
      label: "Taxa de Acerto",
      value: `${correctPercentage}%`,
      color: colors.primary,
      icon: "chart.pie.fill",
    },
  ];

  const shortcuts = [
    {
      title: "Estudar",
      description: "Comece uma sessão de estudo",
      icon: "book.fill",
      color: colors.primary,
      onPress: () => router.push("/(tabs)"),
    },
    {
      title: "Meus Cards",
      description: "Veja todos os cards",
      icon: "rectangle.stack.fill",
      color: colors.primary,
      onPress: () => router.navigate("/(tabs)/cards"),
    },
    {
      title: "Estatísticas",
      description: "Acompanhe seu progresso",
      icon: "chart.bar.fill",
      color: colors.primary,
      onPress: () => router.navigate("/(tabs)/stats"),
    },

  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: isDesktop ? 32 : isTablet ? 24 : 16,
      paddingBottom: 32,
    },
    header: {
      marginBottom: isDesktop ? 40 : isTablet ? 32 : 24,
    },
    title: {
      fontSize: isDesktop ? 40 : isTablet ? 32 : 28,
      fontWeight: "700",
      color: colors.foreground,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: isDesktop ? 18 : isTablet ? 16 : 14,
      color: colors.muted,
    },
    statsContainer: {
      marginBottom: isDesktop ? 48 : isTablet ? 40 : 32,
    },
    statsTitle: {
      fontSize: isDesktop ? 22 : isTablet ? 20 : 18,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: isDesktop ? 24 : isTablet ? 20 : 16,
    },
    statsGrid: {
      flexDirection: isDesktop ? "row" : "row",
      flexWrap: "wrap",
      gap: isDesktop ? 24 : isTablet ? 16 : 12,
    },
    statCard: {
      flex: isDesktop ? 0.22 : isTablet ? 0.48 : 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: isDesktop ? 24 : isTablet ? 20 : 16,
      borderLeftWidth: 4,
      minHeight: isDesktop ? 160 : isTablet ? 140 : 120,
    },
    statIcon: {
      marginBottom: 12,
    },
    statValue: {
      fontSize: isDesktop ? 32 : isTablet ? 28 : 24,
      fontWeight: "700",
      color: colors.foreground,
      marginBottom: 8,
    },
    statLabel: {
      fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
      color: colors.muted,
    },
    shortcutsContainer: {
      marginBottom: isDesktop ? 48 : isTablet ? 40 : 32,
    },
    shortcutsTitle: {
      fontSize: isDesktop ? 22 : isTablet ? 20 : 18,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: isDesktop ? 24 : isTablet ? 20 : 16,
    },
    shortcutsGrid: {
      flexDirection: isDesktop ? "row" : "row",
      flexWrap: "wrap",
      gap: isDesktop ? 24 : isTablet ? 16 : 12,
    },
    shortcutCard: {
      flex: isDesktop ? 0.22 : isTablet ? 0.48 : 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: isDesktop ? 24 : isTablet ? 20 : 16,
      borderTopWidth: 3,
      minHeight: isDesktop ? 160 : isTablet ? 140 : 120,
    },
    shortcutIcon: {
      marginBottom: 12,
    },
    shortcutTitle: {
      fontSize: isDesktop ? 16 : isTablet ? 15 : 14,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 6,
    },
    shortcutDescription: {
      fontSize: isDesktop ? 13 : isTablet ? 12 : 11,
      color: colors.muted,
      marginBottom: 12,
      flex: 1,
    },
    shortcutButton: {
      backgroundColor: colors.primary,
      paddingVertical: isDesktop ? 10 : isTablet ? 8 : 6,
      paddingHorizontal: isDesktop ? 16 : isTablet ? 12 : 10,
      borderRadius: 8,
      alignItems: "center",
    },
    shortcutButtonText: {
      color: colors.background,
      fontWeight: "600",
      fontSize: isDesktop ? 13 : isTablet ? 12 : 11,
    },
    motivationalSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: isDesktop ? 32 : isTablet ? 24 : 20,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    motivationalTitle: {
      fontSize: isDesktop ? 18 : isTablet ? 16 : 14,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 12,
    },
    motivationalText: {
      fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
      color: colors.muted,
      lineHeight: isDesktop ? 22 : isTablet ? 20 : 18,
    },
  });

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>
            Preparátorio para o Exame ao Ministério Pastoral Batista - Estude teologia de forma eficaz
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Seu Progresso</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View
                key={index}
                style={[
                  styles.statCard,
                  { borderLeftColor: stat.color },
                ]}
              >
                <View style={styles.statIcon}>
                  <IconSymbol
                    size={isDesktop ? 28 : isTablet ? 24 : 20}
                    name={stat.icon as any}
                    color={stat.color}
                  />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Shortcuts */}
        <View style={styles.shortcutsContainer}>
          <Text style={styles.shortcutsTitle}>Atalhos Rápidos</Text>
          <View style={styles.shortcutsGrid}>
            {shortcuts.map((shortcut, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.shortcutCard,
                  { borderTopColor: shortcut.color },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={shortcut.onPress}
              >
                <View style={styles.shortcutIcon}>
                  <IconSymbol
                    size={isDesktop ? 28 : isTablet ? 24 : 20}
                    name={shortcut.icon as any}
                    color={shortcut.color}
                  />
                </View>
                <Text style={styles.shortcutTitle}>{shortcut.title}</Text>
                <Text style={styles.shortcutDescription}>
                  {shortcut.description}
                </Text>
                <View style={styles.shortcutButton}>
                  <Text style={styles.shortcutButtonText}>Acessar</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Motivational Section */}
        <View style={styles.motivationalSection}>
          <Text style={styles.motivationalTitle}>💡 Dica do Dia</Text>
          <Text style={styles.motivationalText}>
            Estude regularmente! Estudos mostram que revisar o material em
            intervalos regulares melhora significativamente a retenção de
            conhecimento. Tente estudar pelo menos 30 minutos por dia.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
