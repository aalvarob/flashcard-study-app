import React, { useEffect } from "react";
import { Pressable, Text, View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useColors } from "@/hooks/use-colors";
import { Flashcard } from "@/context/FlashcardContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.0;

interface FlashCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashCard({ card, isFlipped, onFlip }: FlashCardProps) {
  const colors = useColors();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(isFlipped ? 180 : 0, { duration: 400 });
  }, [isFlipped]);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotation.value,
      [0, 180],
      [0, 180],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotation.value,
      [0, 180],
      [180, 360],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const areaLabels: Record<string, string> = {
    "escrituras_sagradas": "Escrituras",
    "deus_pai": "Deus Pai",
    "deus_filho": "Deus Filho",
    "deus_espirito_santo": "Esp. Santo",
    "homem": "Homem",
    "pecado": "Pecado",
    "salvacao": "Salvação",
    "eleicao": "Eleição",
    "reino_de_deus": "Reino",
    "igreja": "Igreja",
    "dia_do_senhor": "Domingo",
    "ministerio_da_palavra": "Ministério",
    "liberdade_religiosa": "Liberdade",
    "morte": "Morte",
    "justos_e_impios": "Justos/Ímpios",
    "anjos": "Anjos",
    "amor_ao_proximo_e_etica": "Amor/Ética",
    "batismo_e_ceia": "Batismo/Ceia",
    "mordomia": "Mordomia",
    "evangelismo_e_missoes": "Evangelismo",
    "educacao_religiosa": "Educação",
    "ordem_social": "Ordem Social",
    "familia": "Família",
    "principios_batistas": "Princípios",
    "historia_dos_batistas": "História",
    "estrutura_e_funcionamento_cbb": "CBB",
  };
  const areaColors: Record<string, string> = {
    "escrituras_sagradas": colors.primary,
    "deus_pai": "#3B82F6",
    "deus_filho": "#3B82F6",
    "deus_espirito_santo": "#3B82F6",
    "homem": "#8B5CF6",
    "pecado": "#8B5CF6",
    "salvacao": "#EC4899",
    "eleicao": "#EC4899",
    "reino_de_deus": "#EC4899",
    "igreja": "#10B981",
    "dia_do_senhor": "#10B981",
    "ministerio_da_palavra": "#10B981",
    "liberdade_religiosa": "#10B981",
    "morte": "#F59E0B",
    "justos_e_impios": "#F59E0B",
    "anjos": "#F59E0B",
    "amor_ao_proximo_e_etica": "#6366F1",
    "batismo_e_ceia": "#6366F1",
    "mordomia": "#6366F1",
    "evangelismo_e_missoes": "#6366F1",
    "educacao_religiosa": "#14B8A6",
    "ordem_social": "#14B8A6",
    "familia": "#14B8A6",
    "principios_batistas": "#14B8A6",
    "historia_dos_batistas": "#14B8A6",
    "estrutura_e_funcionamento_cbb": "#14B8A6",
  };
  const areaLabel = areaLabels[card.area] || card.area;
  const areaColor = areaColors[card.area] || colors.primary;

  return (
    <Pressable
      onPress={onFlip}
      style={[styles.container, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
    >
      {/* Front - Question */}
      <Animated.View
        style={[
          styles.card,
          styles.front,
          frontStyle,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          },
        ]}
      >
        <View style={[styles.areaBadge, { backgroundColor: areaColor + "20" }]}>
          <Text style={[styles.areaText, { color: areaColor }]}>{areaLabel}</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.cardLabel, { color: colors.muted }]}>PERGUNTA</Text>
          <Text 
            style={[styles.questionText, { color: colors.foreground }]}
            numberOfLines={6}
            ellipsizeMode="tail"
          >
            {card.question}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={[styles.tapHint, { color: colors.muted }]}>
            Toque para ver a resposta
          </Text>
        </View>
      </Animated.View>

      {/* Back - Answer */}
      <Animated.View
        style={[
          styles.card,
          styles.back,
          backStyle,
          {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          },
        ]}
      >
        <View style={[styles.areaBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <Text style={[styles.areaText, { color: "rgba(255,255,255,0.9)" }]}>{areaLabel}</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.cardLabel, { color: "rgba(255,255,255,0.7)" }]}>RESPOSTA</Text>
          <Text 
            style={[styles.answerText, { color: "#FFFFFF" }]}
            numberOfLines={6}
            ellipsizeMode="tail"
          >
            {card.answer}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={[styles.tapHint, { color: "rgba(255,255,255,0.6)" }]}>
            Toque para ver a pergunta
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  card: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    justifyContent: "space-between",
  },
  front: {},
  back: {},
  areaBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  areaText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    textAlign: "center",
  },
  answerText: {
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 30,
    textAlign: "center",
  },
  cardFooter: {
    alignItems: "center",
    paddingTop: 8,
  },
  tapHint: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
