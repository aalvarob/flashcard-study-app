import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function DocumentsScreen() {
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

  const documents = [
    {
      id: "pacto",
      title: "📜 Pacto das Igrejas Batistas",
      icon: "📜",
      description: "Compromissos e princípios fundamentais das igrejas batistas",
      content: [
        "Tendo sido levados pelo Espírito Santo a aceitar a Jesus Cristo como único e suficiente Salvador, e batizados, sob profissão de fé, em nome do Pai, do Filho e do Espírito Santo, decidimo-nos, unânimes, como um corpo em Cristo, firmar, solene e alegremente, na presença de Deus e desta congregação, o seguinte Pacto:",
        "Comprometemo-nos a, auxiliados pelo Espírito Santo, andar sempre unidos no amor cristão; trabalhar para que esta igreja cresça no conhecimento da Palavra, na santidade, no conforto mútuo e na espiritualidade; manter os seus cultos, suas doutrinas, suas ordenanças e sua disciplina; contribuir liberalmente para o sustento do ministério, para as despesas da igreja, para o auxílio dos pobres e para a propaganda do evangelho em todas as nações.",
        "Comprometemo-nos, também, a manter uma devoção particular; a evitar e condenar todos os vícios; a educar religiosamente nossos filhos; a procurar a salvação de todo o mundo, a começar dos nossos parentes, amigos e conhecidos; a ser corretos em nossas transações, fiéis em nossos compromissos, exemplares em nossa conduta e ser diligentes nos trabalhos seculares; evitar a detração, a difamação e a ira, sempre e em tudo visando à expansão do reino do nosso Salvador.",
        "Além disso, comprometemo-nos a ter cuidado uns dos outros; a lembrarmo-nos uns dos outros nas orações; ajudar mutuamente nas enfermidades e necessidades; cultivar relações francas e a delicadeza no trato; estar prontos a perdoar as ofensas, buscando, quando possível, a paz com todos os homens.",
        "Finalmente, nos comprometemos a, quando sairmos desta localidade para outra, nos unirmos a uma outra igreja da mesma fé e ordem, em que possamos observar os princípios da Palavra de Deus e o espírito deste Pacto.",
        "O Senhor nos abençoe e nos proteja para que sejamos fiéis e sinceros até a morte.",
      ],
    },
    {
      id: "declaracao",
      title: "📖 Declaração Doutrinária da CBB",
      icon: "📖",
      description: "Fundamentos doutrinários da Convenção Batista Brasileira",
      content: [
        "Documento que apresenta os princípios doutrinários fundamentais da Convenção Batista Brasileira, incluindo crenças sobre Deus, Jesus Cristo, Salvação e a Igreja.",
      ],
    },
    {
      id: "historia",
      title: "📚 História dos Batistas",
      icon: "📚",
      description: "Origem e desenvolvimento do movimento batista no mundo e no Brasil",
      content: [
        "Documento que narra a história do movimento batista, desde suas origens na Europa até sua expansão no Brasil e em Alagoas.",
      ],
    },
    {
      id: "principios",
      title: "⚖️ Princípios Batistas",
      icon: "⚖️",
      description: "Princípios fundamentais que caracterizam a fé e prática batista",
      content: [
        "Documento que detalha os princípios batistas como autonomia da igreja local, liberdade de consciência, separação entre Igreja e Estado, e competência da alma.",
      ],
    },
    {
      id: "codigo",
      title: "⚖️ Código de Ética",
      icon: "⚖️",
      description: "Normas éticas e morais para ministros batistas",
      content: [
        "Documento que estabelece as normas éticas e morais esperadas de ministros batistas, incluindo conduta pessoal, familiar e ministerial.",
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
    docsContainer: {
      gap: isDesktop ? 24 : isTablet ? 16 : 12,
    },
    docCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: "hidden",
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    docHeader: {
      padding: isDesktop ? 24 : isTablet ? 20 : 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    docTitleSection: {
      flex: 1,
      marginRight: 12,
    },
    docTitle: {
      fontSize: isDesktop ? 18 : isTablet ? 16 : 14,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 4,
    },
    docDescription: {
      fontSize: isDesktop ? 13 : isTablet ? 12 : 11,
      color: colors.muted,
      lineHeight: isDesktop ? 18 : isTablet ? 16 : 14,
    },
    expandIcon: {
      fontSize: isDesktop ? 24 : isTablet ? 20 : 18,
      color: colors.primary,
    },
    docContent: {
      paddingHorizontal: isDesktop ? 24 : isTablet ? 20 : 16,
      paddingBottom: isDesktop ? 24 : isTablet ? 20 : 16,
      backgroundColor: colors.background,
    },
    docItem: {
      marginBottom: isDesktop ? 16 : isTablet ? 12 : 10,
      paddingLeft: isDesktop ? 16 : isTablet ? 12 : 10,
      borderLeftWidth: 2,
      borderLeftColor: colors.primary,
    },
    docItemText: {
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
          <Text style={styles.title}>📚 Documentos Importantes</Text>
          <Text style={styles.subtitle}>
            Referências doutrinária e histórica para estudo
          </Text>
        </View>

        {/* Documents */}
        <View style={styles.docsContainer}>
          {documents.map((doc) => (
            <Pressable
              key={doc.id}
              onPress={() => toggleSection(doc.id)}
              style={styles.docCard}
            >
              <View style={styles.docHeader}>
                <View style={styles.docTitleSection}>
                  <Text style={styles.docTitle}>{doc.title}</Text>
                  <Text style={styles.docDescription}>{doc.description}</Text>
                </View>
                <Text style={styles.expandIcon}>
                  {expandedSection === doc.id ? "▼" : "▶"}
                </Text>
              </View>

              {expandedSection === doc.id && (
                <View style={styles.docContent}>
                  {doc.content.map((item, index) => (
                    <View key={index} style={styles.docItem}>
                      <Text style={styles.docItemText}>{item}</Text>
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
