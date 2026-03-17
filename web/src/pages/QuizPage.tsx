import React, { useState } from "react";
import quizData from "../../../data/quiz_data.json";
import "./QuizPage.css";

interface QuizState {
  currentQuizId: string | null;
  currentQuestionIndex: number;
  selectedAnswers: { [key: number]: string };
  showResults: boolean;
}

export function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuizId: null,
    currentQuestionIndex: 0,
    selectedAnswers: {},
    showResults: false,
  });

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

  if (!quizState.currentQuizId) {
    return (
      <div className="quiz-page">
        <div className="quiz-header">
          <h1>📝 Quiz Interativo</h1>
          <p>Teste seus conhecimentos com feedback instantâneo</p>
        </div>

        <div className="quiz-list">
          {quizData.quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <h2 className="quiz-card-title">{quiz.title}</h2>
              <p className="quiz-card-description">{quiz.description}</p>
              <button
                className="quiz-start-button"
                onClick={() => handleStartQuiz(quiz.id)}
              >
                Começar Quiz →
              </button>
            </div>
          ))}
        </div>
      </div>
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
      <div className="quiz-page">
        <div className="quiz-results">
          <div className="score-circle">
            <div className="score-text">{Math.round(score)}%</div>
            <div className="score-label">Sua Nota</div>
          </div>

          <h2 className="result-message">
            {score >= 80
              ? "🎉 Excelente desempenho!"
              : score >= 60
                ? "👍 Bom trabalho!"
                : "📚 Continue estudando!"}
          </h2>

          <p className="result-details">
            Você acertou {correctCount} de {currentQuiz.questions.length} perguntas
          </p>

          <div className="quiz-buttons">
            <button className="quiz-button primary" onClick={handleRestartQuiz}>
              Refazer Quiz
            </button>
            <button className="quiz-button secondary" onClick={handleBackToList}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentQuestion) {
    const selectedOptionId = quizState.selectedAnswers[quizState.currentQuestionIndex];
    const selectedOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const progress =
      ((quizState.currentQuestionIndex + 1) / currentQuiz!.questions.length) * 100;

    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">
              Pergunta {quizState.currentQuestionIndex + 1} de {currentQuiz!.questions.length}
            </p>
          </div>

          <div className="quiz-question-section">
            <h2 className="quiz-question">{currentQuestion.question}</h2>

            <div className="quiz-options">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  className={`quiz-option ${
                    selectedOptionId === option.id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectAnswer(option.id)}
                >
                  <span className="option-text">{option.text}</span>
                </button>
              ))}
            </div>

            {selectedOption && (
              <div className={`quiz-feedback ${selectedOption.isCorrect ? "correct" : "incorrect"}`}>
                <p className="feedback-title">
                  {selectedOption.isCorrect ? "✓ Correto!" : "✗ Incorreto"}
                </p>
                <p className="feedback-text">{selectedOption.explanation}</p>
              </div>
            )}

            <div className="quiz-buttons">
              <button className="quiz-button secondary" onClick={handleBackToList}>
                Voltar
              </button>
              <button
                className="quiz-button primary"
                onClick={handleNextQuestion}
                disabled={!selectedOptionId}
              >
                {quizState.currentQuestionIndex === currentQuiz!.questions.length - 1
                  ? "Ver Resultado"
                  : "Próxima"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
