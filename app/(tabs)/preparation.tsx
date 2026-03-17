import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import preparationContent from "@/data/preparation_content.json";

export default function PreparationScreen() {
  const colors = useColors();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  const sections = [
    {
      id: "sermon",
      title: "🎤 Sermão de 5 Minutos",
      icon: "🎤",
      description: "Modelo simples para pregar no concílio",
      content: preparationContent.sermon || [],
    },
    {
      id: "personal_questions",
      title: "❓ Perguntas Pessoais",
      icon: "❓",
      description: "25 perguntas sobre vida espiritual e ministério",
      content: preparationContent.personal_questions || [],
    },
    {
      id: "controversial_topics",
      title: "⚠️ Temas Polêmicos",
      icon: "⚠️",
      description: "Como responder sobre temas teológicos delicados",
      content: preparationContent.controversial_topics || [],
    },
    {
      id: "conversion_experience",
      title: "✝️ Experiência de Conversão",
      icon: "✝️",
      description: "Sua história de conversão e chamado",
      content: preparationContent.conversion_experience || [],
    },
    {
      id: "difficult_questions",
      title: "🤔 Perguntas Difíceis",
      icon: "🤔",
      description: "Respostas para perguntas mais desafiadoras",
      content: preparationContent.difficult_questions || [],
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

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
    sectionsContainer: {
      gap: isDesktop ? 24 : isTablet ? 16 : 12,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: "hidden",
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    sectionHeader: {
      padding: isDesktop ? 24 : isTablet ? 20 : 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    sectionTitleSection: {
      flex: 1,
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: isDesktop ? 18 : isTablet ? 16 : 14,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 4,
    },
    sectionDescription: {
      fontSize: isDesktop ? 13 : isTablet ? 12 : 11,
      color: colors.muted,
      lineHeight: isDesktop ? 18 : isTablet ? 16 : 14,
    },
    expandIcon: {
      fontSize: isDesktop ? 24 : isTablet ? 20 : 18,
      color: colors.primary,
    },
    sectionContent: {
      paddingHorizontal: isDesktop ? 24 : isTablet ? 20 : 16,
      paddingBottom: isDesktop ? 24 : isTablet ? 20 : 16,
      backgroundColor: colors.background,
    },
    contentItem: {
      marginBottom: isDesktop ? 16 : isTablet ? 12 : 10,
      paddingLeft: isDesktop ? 16 : isTablet ? 12 : 10,
      borderLeftWidth: 2,
      borderLeftColor: colors.primary,
    },
    contentText: {
      fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
      color: colors.foreground,
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
          <Text style={styles.title}>📚 Preparação para o Concílio</Text>
          <Text style={styles.subtitle}>
            Conteúdo essencial para sua ordenação pastoral
          </Text>
        </View>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map((section) => (
            <Pressable
              key={section.id}
              onPress={() => toggleSection(section.id)}
              style={styles.sectionCard}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleSection}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionDescription}>
                    {section.description}
                  </Text>
                </View>
                <Text style={styles.expandIcon}>
                  {expandedSection === section.id ? "▼" : "▶"}
                </Text>
              </View>

              {expandedSection === section.id && (
                <View style={styles.sectionContent}>
                  {section.content.length > 0 ? (
                    section.content.map((item, index) => (
                      <View key={index} style={styles.contentItem}>
                        <Text style={styles.contentText}>{item}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.contentText}>
                      Conteúdo não disponível
                    </Text>
                  )}
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
