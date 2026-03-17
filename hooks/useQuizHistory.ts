import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timestamp: number;
  date: string;
}

const QUIZ_HISTORY_KEY = "@quiz_history";

export function useQuizHistory() {
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar histórico do AsyncStorage
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar histórico de quiz:", error);
      setLoading(false);
    }
  };

  // Salvar novo resultado
  const addResult = useCallback(
    async (
      quizId: string,
      quizTitle: string,
      score: number,
      correctCount: number,
      totalQuestions: number
    ) => {
      try {
        const now = new Date();
        const result: QuizResult = {
          id: `${quizId}-${Date.now()}`,
          quizId,
          quizTitle,
          score,
          correctCount,
          totalQuestions,
          timestamp: Date.now(),
          date: now.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        const updated = [result, ...history];
        setHistory(updated);
        await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updated));
        return result;
      } catch (error) {
        console.error("Erro ao salvar resultado do quiz:", error);
        throw error;
      }
    },
    [history]
  );

  // Obter histórico de um quiz específico
  const getQuizHistory = useCallback(
    (quizId: string) => {
      return history.filter((result) => result.quizId === quizId);
    },
    [history]
  );

  // Obter estatísticas gerais
  const getStats = useCallback(() => {
    if (history.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
      };
    }

    const scores = history.map((r) => r.score);
    return {
      totalAttempts: history.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      bestScore: Math.max(...scores),
      worstScore: Math.min(...scores),
    };
  }, [history]);

  // Limpar histórico
  const clearHistory = useCallback(async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem(QUIZ_HISTORY_KEY);
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
      throw error;
    }
  }, []);

  // Deletar resultado específico
  const deleteResult = useCallback(
    async (resultId: string) => {
      try {
        const updated = history.filter((r) => r.id !== resultId);
        setHistory(updated);
        await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Erro ao deletar resultado:", error);
        throw error;
      }
    },
    [history]
  );

  return {
    history,
    loading,
    addResult,
    getQuizHistory,
    getStats,
    clearHistory,
    deleteResult,
  };
}
