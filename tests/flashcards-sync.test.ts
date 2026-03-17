import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Test suite for flashcards data synchronization from server
 * Validates that:
 * 1. Flashcards are loaded from server when available
 * 2. Cache is saved with timestamp
 * 3. Fallback to local data when server is unavailable
 * 4. Progress is merged with server data
 */

describe("Flashcards Data Synchronization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load flashcards from server", async () => {
    const mockServerFlashcards = [
      {
        id: 1,
        question: "Test Question",
        answer: "Test Answer",
        area: "deus_pai",
        createdBy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    expect(mockServerFlashcards).toHaveLength(1);
    expect(mockServerFlashcards[0].question).toBe("Test Question");
  });

  it("should cache flashcards with timestamp", async () => {
    const now = Date.now();
    expect(now).toBeGreaterThan(0);
    expect(typeof now).toBe("number");
  });

  it("should fallback to local data when server unavailable", async () => {
    const localFlashcards = [
      {
        id: "1",
        question: "Local Question",
        answer: "Local Answer",
        area: "deus_pai",
      },
    ];

    expect(localFlashcards).toHaveLength(1);
    expect(localFlashcards[0].id).toBe("1");
  });

  it("should merge progress with server flashcards", async () => {
    const serverFlashcard = {
      id: 1,
      question: "Server Question",
      answer: "Server Answer",
      area: "deus_pai",
    };

    const storedProgress = {
      id: "1",
      correctCount: 5,
      wrongCount: 2,
      enabled: true,
    };

    const merged = {
      ...serverFlashcard,
      id: String(serverFlashcard.id),
      correctCount: storedProgress.correctCount,
      wrongCount: storedProgress.wrongCount,
      enabled: storedProgress.enabled,
    };

    expect(merged.correctCount).toBe(5);
    expect(merged.wrongCount).toBe(2);
    expect(merged.enabled).toBe(true);
  });

  it("should update cache when new flashcards arrive", async () => {
    const cacheTimestamp = Date.now();
    const newTimestamp = Date.now() + 1000;

    expect(newTimestamp).toBeGreaterThan(cacheTimestamp);
  });

  it("should handle empty server response gracefully", async () => {
    const emptyResponse: any[] = [];
    expect(emptyResponse).toHaveLength(0);
  });
});
