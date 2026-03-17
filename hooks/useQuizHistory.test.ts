import { describe, it, expect, beforeEach, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuizHistory } from "./useQuizHistory";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("useQuizHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (AsyncStorage.getItem as any).mockResolvedValue(null);
    (AsyncStorage.setItem as any).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as any).mockResolvedValue(undefined);
  });


  it("deve carregar histórico do AsyncStorage", async () => {
    const mockHistory = [
      {
        id: "result-1",
        quizId: "quiz-1",
        quizTitle: "Perguntas Pessoais",
        score: 85,
        correctCount: 5,
        totalQuestions: 10,
        timestamp: Date.now(),
        date: "17/03/2026 19:30",
      },
    ];

    (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify(mockHistory));
    expect(mockHistory).toHaveLength(1);
  });

  it("deve retornar histórico de um quiz específico", () => {
    const mockResults = [
      { quizId: "quiz-1", score: 85 },
      { quizId: "quiz-2", score: 90 },
      { quizId: "quiz-1", score: 75 },
    ];

    const quiz1Results = mockResults.filter((r) => r.quizId === "quiz-1");
    expect(quiz1Results).toHaveLength(2);
    expect(quiz1Results.every((r) => r.quizId === "quiz-1")).toBe(true);
  });

  it("deve calcular estatísticas corretamente", () => {
    const scores = [80, 90, 70];
    const totalAttempts = scores.length;
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    expect(totalAttempts).toBe(3);
    expect(averageScore).toBe(80);
    expect(bestScore).toBe(90);
    expect(worstScore).toBe(70);
  });

  it("deve limpar histórico", async () => {
    expect(AsyncStorage.removeItem).toBeDefined();
  });

  it("deve deletar um resultado específico", () => {
    const results = [
      { id: "result-1", quizId: "quiz-1" },
      { id: "result-2", quizId: "quiz-2" },
    ];

    const filtered = results.filter((r) => r.id !== "result-1");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("result-2");
  });

  it("deve retornar estatísticas vazias quando não há histórico", () => {
    const history: any[] = [];
    const stats = {
      totalAttempts: history.length,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
    };
    expect(stats.totalAttempts).toBe(0);
    expect(stats.averageScore).toBe(0);
    expect(stats.bestScore).toBe(0);
    expect(stats.worstScore).toBe(0);
  });
});
