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
  selectedQuestions: any[];
  numQuestionsToAnswer: number | null;
  selectingNumQuestions: boolean;
  counterValue: number;
}

export default function QuizScreen() {
  const colors = useColors();
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuizId: null,
    currentQuestionIndex: 0,
    selectedAnswers: {},
    showResults: false,
    selectedQuestions: [],
    numQuestionsToAnswer: null,
    selectingNumQuestions: false,
    counterValue: 3,
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

  const currentQuestion = quizState.selectedQuestions.length > 0
    ? quizState.selectedQuestions[quizState.currentQuestionIndex]
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
    if (quizState.currentQuestionIndex < quizState.selectedQuestions.length - 1) {
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

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleStartQuiz = (quizId: string) => {
    setQuizState({
      currentQuizId: quizId,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      showResults: false,
      selectedQuestions: [],
      numQuestionsToAnswer: null,
      selectingNumQuestions: true,
      counterValue: 3,
    });
  };

  const handleIncrementCounter = () => {
    if (!currentQuiz) return;
    setQuizState((prev) => ({
      ...prev,
      counterValue: Math.min(prev.counterValue + 1, currentQuiz.questions.length),
    }));
  };

  const handleDecrementCounter = () => {
    setQuizState((prev) => ({
      ...prev,
      counterValue: Math.max(prev.counterValue - 1, 3),
    }));
  };

  const handleSelectNumQuestions = (num: number) => {
    if (!currentQuiz) return;
    // Embaralhar perguntas e selecionar o número desejado
    const shuffled = [...currentQuiz.questions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, num);
    setQuizState((prev) => ({
      ...prev,
      selectedQuestions: selected,
      numQuestionsToAnswer: num,
      selectingNumQuestions: false,
    }));
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
      selectedQuestions: [],
      numQuestionsToAnswer: null,
      selectingNumQuestions: false,
      counterValue: 3,
    });
  };

  const calculateScore = () => {
    if (quizState.selectedQuestions.length === 0) return 0;
    let correct = 0;
    quizState.selectedQuestions.forEach((q, idx) => {
      const selectedOptionId = quizState.selectedAnswers[idx];
      const selectedOption = q.options.find((o: any) => o.id === selectedOptionId);
      if (selectedOption?.isCorrect) correct++;
    });
    return (correct / quizState.selectedQuestions.length) * 100;
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
    selectionContainer: {
      alignItems: "center",
      paddingVertical: isDesktop ? 40 : isTablet ? 32 : 24,
    },
    description: {
      fontSize: isDesktop ? 16 : isTablet ? 14 : 12,
      color: colors.muted,
      marginBottom: isDesktop ? 32 : isTablet ? 24 : 20,
      textAlign: "center",
    },
    counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: isDesktop ? 24 : isTablet ? 16 : 12,
      marginBottom: isDesktop ? 40 : isTablet ? 32 : 24,
    },
    counterButton: {
      width: isDesktop ? 50 : isTablet ? 45 : 40,
      height: isDesktop ? 50 : isTablet ? 45 : 40,
      borderRadius: isDesktop ? 25 : isTablet ? 22.5 : 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    counterDisplay: {
      minWidth: isDesktop ? 80 : isTablet ? 70 : 60,
      height: isDesktop ? 50 : isTablet ? 45 : 40,
      borderRadius: 8,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.primary,
    },
    counterText: {
      fontSize: isDesktop ? 24 : isTablet ? 20 : 18,
      fontWeight: "700",
      color: colors.foreground,
    },
    counterButtonText: {
      fontSize: isDesktop ? 20 : isTablet ? 18 : 16,
      fontWeight: "700",
      color: colors.background,
    },
    confirmButton: {
      paddingVertical: isDesktop ? 12 : isTablet ? 10 : 8,
      paddingHorizontal: isDesktop ? 24 : isTablet ? 20 : 16,
    },
    backButton: {
      paddingVertical: isDesktop ? 12 : isTablet ? 10 : 8,
      paddingHorizontal: isDesktop ? 24 : isTablet ? 20 : 16,
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
    progressText: {
      fontSize: isDesktop ? 12 : isTablet ? 11 : 10,
      color: colors.muted,
      marginBottom: isDesktop ? 12 : isTablet ? 10 : 8,
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
    optionButtonQuiz: {
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

  // Seleção de número de perguntas
  if (quizState.selectingNumQuestions && currentQuiz) {
    return (
      <ScreenContainer className="flex-1">
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.selectionContainer}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {currentQuiz.title}
            </Text>
            <Text style={[styles.description, { color: colors.muted }]}>
              Quantas perguntas você gostaria de responder?
            </Text>
            <View style={styles.counterContainer}>
              <Pressable
                onPress={handleDecrementCounter}
                disabled={quizState.counterValue <= 3}
                style={({ pressed }) => [
                  styles.counterButton,
                  {
                    opacity: quizState.counterValue <= 3 ? 0.5 : pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </Pressable>
              <View style={styles.counterDisplay}>
                <Text style={styles.counterText}>{quizState.counterValue}</Text>
              </View>
              <Pressable
                onPress={handleIncrementCounter}
                disabled={quizState.counterValue >= currentQuiz.questions.length}
                style={({ pressed }) => [
                  styles.counterButton,
                  {
                    opacity:
                      quizState.counterValue >= currentQuiz.questions.length
                        ? 0.5
                        : pressed
                          ? 0.8
                          : 1,
                  },
                ]}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => handleSelectNumQuestions(quizState.counterValue)}
              style={({ pressed }) => [
                styles.button,
                styles.primaryButton,
                styles.confirmButton,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={styles.primaryButtonText}>Começar Quiz</Text>
            </Pressable>
            <Pressable
              onPress={handleBackToList}
              style={({ pressed }) => [
                styles.backButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={{ color: colors.primary }}>← Voltar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Lista de quizzes
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

  // Resultados
  if (quizState.showResults && currentQuiz) {
    const score = calculateScore();
    const correctCount = Object.values(quizState.selectedAnswers).filter((optionId, idx) => {
      const question = quizState.selectedQuestions[idx];
      const option = question.options.find((o: any) => o.id === optionId);
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
              Você acertou {correctCount} de {quizState.selectedQuestions.length} perguntas
            </Text>

            <View style={styles.navigationButtons}>
              <Pressable
                onPress={handleRestartQuiz}
                style={({ pressed }) => [
                  styles.button,
                  styles.primaryButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.primaryButtonText}>Refazer Quiz</Text>
              </Pressable>
              <Pressable
                onPress={handleBackToList}
                style={({ pressed }) => [
                  styles.button,
                  styles.secondaryButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Pergunta do quiz
  if (currentQuestion) {
    const progress =
      ((quizState.currentQuestionIndex + 1) / quizState.selectedQuestions.length) * 100;
    const selectedOptionId = quizState.selectedAnswers[quizState.currentQuestionIndex];
    const selectedOption = currentQuestion.options.find(
      (o: any) => o.id === selectedOptionId
    );

    return (
      <ScreenContainer className="flex-1">
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Pergunta {quizState.currentQuestionIndex + 1} de{" "}
              {quizState.selectedQuestions.length}
            </Text>

            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option: any, idx: number) => (
                <Pressable
                  key={`${quizState.currentQuestionIndex}-${idx}`}
                  onPress={() => handleSelectAnswer(option.id)}
                  style={[
                    styles.optionButtonQuiz,
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

            {selectedOptionId && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>
                  {selectedOption?.isCorrect ? "✅ Correto! " : "❌ Incorreto. "}
                  {selectedOption?.explanation}
                </Text>
              </View>
            )}

            <View style={styles.navigationButtons}>
              <Pressable
                onPress={handlePreviousQuestion}
                disabled={quizState.currentQuestionIndex === 0}
                style={({ pressed }) => [
                  styles.button,
                  styles.secondaryButton,
                  {
                    opacity:
                      quizState.currentQuestionIndex === 0
                        ? 0.5
                        : pressed
                          ? 0.8
                          : 1,
                  },
                ]}
              >
                <Text style={styles.secondaryButtonText}>← Anterior</Text>
              </Pressable>
              <Pressable
                onPress={handleNextQuestion}
                disabled={!selectedOptionId}
                style={({ pressed }) => [
                  styles.button,
                  styles.primaryButton,
                  { opacity: !selectedOptionId ? 0.5 : pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {quizState.currentQuestionIndex ===
                  quizState.selectedQuestions.length - 1
                    ? "Finalizar"
                    : "Próxima →"}
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
