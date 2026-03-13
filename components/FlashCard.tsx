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
const CARD_HEIGHT = CARD_WIDTH * 1.25;

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

  const areaLabel = card.area === "teologia" ? "Teologia" : "Eclesiologia";
  const areaColor = card.area === "teologia" ? colors.primary : "#6B46C1";

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
          <Text style={[styles.questionText, { color: colors.foreground }]}>
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
          <Text style={[styles.answerText, { color: "#FFFFFF" }]}>
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
    paddingVertical: 16,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 30,
    textAlign: "center",
  },
  answerText: {
    fontSize: 17,
    fontWeight: "500",
    lineHeight: 26,
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
