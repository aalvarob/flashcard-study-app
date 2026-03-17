import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function TipsScreen() {
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

  const tips = [
    {
      id: "study",
      title: "📚 Dicas de Estudo",
      icon: "📚",
      content: [
        "Estude pelo menos 1 hora por dia. Se não for possível, dedique 30 minutos.",
        "Examine os textos bíblicos correspondentes a cada pergunta.",
        "Participe de alguns Concílios quando for possível.",
        "Peça a seu Pastor ou conhecido para fazer um simulado.",
        "Durma cedo na noite anterior ao Concílio.",
      ],
    },
    {
      id: "posture",
      title: "🎯 Guia de Postura no Concílio",
      icon: "🎯",
      content: [
        "Responda sempre com a Bíblia, mesmo que de forma breve.",
        "Seja objetivo e evite respostas longas.",
        "Estrutura ideal: afirmação → texto bíblico → explicação curta.",
        "Não seja combativo, mesmo quando discordar.",
        "Demonstre equilíbrio doutrinário, evitando extremos.",
        "Quando não souber, não invente. Admita honestamente.",
        "Demonstre coração pastoral: caráter, amor pela igreja e compromisso com missões.",
      ],
    },
    {
      id: "responses",
      title: "💬 Como Responder Bem",
      icon: "💬",
      content: [
        "Abra a Bíblia e mostre o texto, capítulo e versículo.",
        "Use frases como: 'Entendo que a Escritura ensina...' ou 'Creio que a melhor interpretação bíblica é...'",
        "Responda apenas o que está sendo perguntado.",
        "Se não entender a pergunta, peça para repetir ou reformular.",
        "Não demonstre irritação ou impaciência.",
        "Não faça perguntas ao Examinador.",
        "Não critique pastores ou igrejas em suas respostas.",
      ],
    },
    {
      id: "behaviors",
      title: "✔️ 10 Atitudes que Impressionam",
      icon: "✔️",
      content: [
        "Respostas bíblicas fundamentadas",
        "Simplicidade e clareza na comunicação",
        "Humildade e disposição para aprender",
        "Amor genuíno pela Igreja",
        "Visão missionária",
        "Equilíbrio doutrinário",
        "Vida devocional evidente",
        "Respeito aos pastores",
        "Compromisso com a Palavra de Deus",
        "Cumprimente todos com sorriso e aperto de mão",
      ],
    },
    {
      id: "avoid",
      title: "❌ O que Evitar",
      icon: "❌",
      content: [
        "Não ouvir a pergunta inteira",
        "Não responder de forma defensiva",
        "Não inventar respostas",
        "Não demonstrar insegurança doutrinária",
        "Não ignorar a autoridade da Igreja local",
        "Não fazer gracejos ou demonstrar convencimento",
        "Não se alongar nas respostas",
        "Não demonstrar irritação ou impaciência",
      ],
    },
    {
      id: "summary",
      title: "📖 Resumo da Fé Batista",
      icon: "📖",
      content: [
        '"Creio que a Bíblia é a Palavra de Deus, que Jesus Cristo é o único Salvador, que a salvação é pela graça mediante a fé e que a missão da Igreja é fazer discípulos até que Cristo volte."',
        "Referência: Mateus 28.19–20",
      ],
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
    tipsContainer: {
      gap: isDesktop ? 24 : isTablet ? 16 : 12,
    },
    tipCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: "hidden",
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    tipHeader: {
      padding: isDesktop ? 24 : isTablet ? 20 : 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tipTitle: {
      fontSize: isDesktop ? 18 : isTablet ? 16 : 14,
      fontWeight: "600",
      color: colors.foreground,
      flex: 1,
    },
    tipContent: {
      paddingHorizontal: isDesktop ? 24 : isTablet ? 20 : 16,
      paddingBottom: isDesktop ? 24 : isTablet ? 20 : 16,
      backgroundColor: colors.background,
    },
    tipItem: {
      marginBottom: isDesktop ? 16 : isTablet ? 12 : 10,
      paddingLeft: isDesktop ? 16 : isTablet ? 12 : 10,
      borderLeftWidth: 2,
      borderLeftColor: colors.primary,
    },
    tipItemText: {
      fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
      color: colors.foreground,
      lineHeight: isDesktop ? 22 : isTablet ? 20 : 18,
    },
    expandIcon: {
      fontSize: isDesktop ? 24 : isTablet ? 20 : 18,
      color: colors.primary,
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
          <Text style={styles.title}>💡 Dicas para o Exame</Text>
          <Text style={styles.subtitle}>
            Guia completo para se preparar e se sair bem no Concílio
          </Text>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          {tips.map((tip) => (
            <Pressable
              key={tip.id}
              onPress={() => toggleSection(tip.id)}
              style={styles.tipCard}
            >
              <View style={styles.tipHeader}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === tip.id ? "▼" : "▶"}
                </Text>
              </View>

              {expandedSection === tip.id && (
                <View style={styles.tipContent}>
                  {tip.content.map((item, index) => (
                    <View key={index} style={styles.tipItem}>
                      <Text style={styles.tipItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
