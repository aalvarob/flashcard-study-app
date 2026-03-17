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
import quizData from "@/data/quiz_data.json";

interface QuizState {
  currentQuizId: string | null;
  currentQuestionIndex: number;
  selectedAnswers: { [key: number]: string };
  showResults: boolean;
}

export default function QuizScreen() {
  const colors = useColors();
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuizId: null,
    currentQuestionIndex: 0,
    selectedAnswers: {},
    showResults: false,
  });
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  const currentQuiz = quizState.currentQuizId
    ? quizData.quizzes.find((q) => q.id === quizState.currentQuizId)
    : null;

  const currentQuestion = currentQuiz
    ? currentQuiz.questions[quizState.currentQuestionIndex]
    : null;

  const handleSelectAnswer = (optionId: string) => {
    setQuizState((prev) => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [quizState.currentQuestionIndex]: optionId,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuiz && quizState.currentQuestionIndex < currentQuiz.questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    } else {
      setQuizState((prev) => ({
        ...prev,
        showResults: true,
      }));
    }
  };

  const handleStartQuiz = (quizId: string) => {
    setQuizState({
      currentQuizId: quizId,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      showResults: false,
    });
  };

  const handleRestartQuiz = () => {
    if (currentQuiz) {
      handleStartQuiz(currentQuiz.id);
    }
  };

  const handleBackToList = () => {
    setQuizState({
      currentQuizId: null,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      showResults: false,
    });
  };

  const calculateScore = () => {
    if (!currentQuiz) return 0;
    let correct = 0;
    currentQuiz.questions.forEach((q, idx) => {
      const selectedOptionId = quizState.selectedAnswers[idx];
      const selectedOption = q.options.find((o) => o.id === selectedOptionId);
      if (selectedOption?.isCorrect) correct++;
    });
    return (correct / currentQuiz.questions.length) * 100;
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
    quizzesContainer: {
      gap: isDesktop ? 24 : isTablet ? 16 : 12,
    },
    quizCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: isDesktop ? 24 : isTablet ? 20 : 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    quizTitle: {
      fontSize: isDesktop ? 18 : isTablet ? 16 : 14,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 8,
    },
    quizDescription: {
      fontSize: isDesktop ? 13 : isTablet ? 12 : 11,
      color: colors.muted,
      marginBottom: isDesktop ? 20 : isTablet ? 16 : 12,
    },
    startButton: {
      backgroundColor: colors.primary,
      paddingVertical: isDesktop ? 12 : isTablet ? 10 : 8,
      paddingHorizontal: isDesktop ? 24 : isTablet ? 20 : 16,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: colors.background,
      fontWeight: "600",
      fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
    },
    questionContainer: {
      marginBottom: isDesktop ? 40 : isTablet ? 32 : 24,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginBottom: isDesktop ? 24 : isTablet ? 20 : 16,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
    },
    questionText: {
      fontSize: isDesktop ? 18 : isTablet ? 16 : 14,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: isDesktop ? 24 : isTablet ? 20 : 16,
      lineHeight: isDesktop ? 28 : isTablet ? 24 : 20,
    },
    optionsContainer: {
      gap: isDesktop ? 16 : isTablet ? 12 : 10,
    },
    optionButton: {
      padding: isDesktop ? 16 : isTablet ? 14 : 12,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    optionButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    optionText: {
      fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
      color: colors.foreground,
      lineHeight: isDesktop ? 22 : isTablet ? 20 : 18,
    },
    optionTextSelected: {
      color: colors.background,
      fontWeight: "600",
    },
    feedbackContainer: {
      marginTop: isDesktop ? 24 : isTablet ? 20 : 16,
      padding: isDesktop ? 16 : isTablet ? 14 : 12,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    feedbackText: {
      fontSize: isDesktop ? 13 : isTablet ? 12 : 11,
      color: colors.foreground,
      lineHeight: isDesktop ? 20 : isTablet ? 18 : 16,
    },
    navigationButtons: {
      flexDirection: "row",
      gap: isDesktop ? 16 : isTablet ? 12 : 10,
      marginTop: isDesktop ? 24 : isTablet ? 20 : 16,
    },
    button: {
      flex: 1,
      paddingVertical: isDesktop ? 12 : isTablet ? 10 : 8,
      borderRadius: 8,
      alignItems: "center",
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    primaryButtonText: {
      color: colors.background,
      fontWeight: "600",
      fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
    },
    secondaryButtonText: {
      color: colors.foreground,
      fontWeight: "600",
      fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
    },
    resultsContainer: {
      alignItems: "center",
      paddingVertical: isDesktop ? 40 : isTablet ? 32 : 24,
    },
    scoreCircle: {
      width: isDesktop ? 200 : isTablet ? 160 : 140,
      height: isDesktop ? 200 : isTablet ? 160 : 140,
      borderRadius: isDesktop ? 100 : isTablet ? 80 : 70,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: isDesktop ? 32 : isTablet ? 24 : 20,
      borderWidth: 4,
      borderColor: colors.primary,
    },
    scoreText: {
      fontSize: isDesktop ? 48 : isTablet ? 40 : 36,
      fontWeight: "700",
      color: colors.primary,
    },
    scoreLabel: {
      fontSize: isDesktop ? 16 : isTablet ? 14 : 12,
      color: colors.muted,
      marginTop: 8,
    },
    resultMessage: {
      fontSize: isDesktop ? 18 : isTablet ? 16 : 14,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: isDesktop ? 24 : isTablet ? 20 : 16,
      textAlign: "center",
    },
    resultDetails: {
      fontSize: isDesktop ? 14 : isTablet ? 13 : 12,
      color: colors.muted,
      textAlign: "center",
      marginBottom: isDesktop ? 32 : isTablet ? 24 : 20,
    },
  });

  if (!quizState.currentQuizId) {
    return (
      <ScreenContainer className="flex-1">
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>📝 Quiz Interativo</Text>
            <Text style={styles.subtitle}>
              Teste seus conhecimentos com feedback instantâneo
            </Text>
          </View>

          <View style={styles.quizzesContainer}>
            {quizData.quizzes.map((quiz) => (
              <Pressable
                key={quiz.id}
                onPress={() => handleStartQuiz(quiz.id)}
                style={styles.quizCard}
              >
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizDescription}>{quiz.description}</Text>
                <Pressable style={styles.startButton}>
                  <Text style={styles.buttonText}>Começar Quiz →</Text>
                </Pressable>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (quizState.showResults && currentQuiz) {
    const score = calculateScore();
    const correctCount = Object.values(quizState.selectedAnswers).filter((optionId, idx) => {
      const question = currentQuiz.questions[idx];
      const option = question.options.find((o) => o.id === optionId);
      return option?.isCorrect;
    }).length;

    return (
      <ScreenContainer className="flex-1">
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultsContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{Math.round(score)}%</Text>
              <Text style={styles.scoreLabel}>Sua Nota</Text>
            </View>

            <Text style={styles.resultMessage}>
              {score >= 80
                ? "🎉 Excelente desempenho!"
                : score >= 60
                  ? "👍 Bom trabalho!"
                  : "📚 Continue estudando!"}
            </Text>

            <Text style={styles.resultDetails}>
              Você acertou {correctCount} de {currentQuiz.questions.length} perguntas
            </Text>

            <View style={styles.navigationButtons}>
              <Pressable
                style={[styles.button, styles.primaryButton]}
                onPress={handleRestartQuiz}
              >
                <Text style={styles.primaryButtonText}>Refazer Quiz</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={handleBackToList}
              >
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (currentQuestion) {
    const selectedOptionId = quizState.selectedAnswers[quizState.currentQuestionIndex];
    const selectedOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const progress =
      ((quizState.currentQuestionIndex + 1) / currentQuiz!.questions.length) * 100;

    return (
      <ScreenContainer className="flex-1">
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <Text style={{ fontSize: isDesktop ? 14 : 12, color: colors.muted, marginBottom: 16 }}>
            Pergunta {quizState.currentQuestionIndex + 1} de {currentQuiz!.questions.length}
          </Text>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => handleSelectAnswer(option.id)}
                  style={[
                    styles.optionButton,
                    selectedOptionId === option.id && styles.optionButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptionId === option.id && styles.optionTextSelected,
                    ]}
                  >
                    {option.text}
                  </Text>
                </Pressable>
              ))}
            </View>

            {selectedOption && (
              <View style={styles.feedbackContainer}>
                <Text
                  style={[
                    styles.feedbackText,
                    { color: selectedOption.isCorrect ? colors.success : colors.error },
                    { fontWeight: "600" },
                  ]}
                >
                  {selectedOption.isCorrect ? "✓ Correto!" : "✗ Incorreto"}
                </Text>
                <Text style={[styles.feedbackText, { marginTop: 8 }]}>
                  {selectedOption.explanation}
                </Text>
              </View>
            )}

            <View style={styles.navigationButtons}>
              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={handleBackToList}
              >
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.primaryButton]}
                onPress={handleNextQuestion}
                disabled={!selectedOptionId}
              >
                <Text style={styles.primaryButtonText}>
                  {quizState.currentQuestionIndex === currentQuiz!.questions.length - 1
                    ? "Ver Resultado"
                    : "Próxima"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return null;
}
